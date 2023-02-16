import Taro, { Component, AtMessageUtil } from '@fish.mobile/taro'
import { View } from '@fish.mobile/components'
import {
  AtForm,
  AtButton,
  AtInput,
  AtTextarea,
  AtImagePicker,
  AtDivider,
  AtWhiteSpace,
  AtMessage
} from 'fish-miniapp'
import { addArticle, getToken, getConfigByCode } from '@actions/home'
import FormSchema from 'async-validator'
import './index.scss'
import { USER_CACHE } from '@constants/cache'
import { actions } from '@gem-mine/durex'

const descriptor = {
  title: {
    type: 'string',
    required: true,
    message: '请输入文章标题'
  },
  content: {
    type: 'string',
    required: true,
    message: '请输入文章内容'
  },
  images: {
    type: 'array',
    required: true,
    message: '请上传一张封面图片'
  }
}
const validator = new FormSchema(descriptor)
const { csOrigin, path, bucket } = SDP_ENV_CONFIG

const getAction = () => {
  return new Promise((resolve) =>
    getToken({ path }).then((tokenInfo) => {
      const uploadAction = `${csOrigin}/v0.1/upload?token=${tokenInfo.token}&policy=${tokenInfo.policy}&date=${encodeURIComponent(
        tokenInfo.date_time
      )}`
      resolve(uploadAction)
    })
  )
}

interface File {
  path: string
  size: number
}
interface AtImagePickerFile {
  url: string
  file?: File
}
interface AddState {
  showAddPage?: boolean
  showAddBtn: boolean
  title: string
  content: string
  images: Array<AtImagePickerFile>
}
const initData = {
  title: '',
  content: '',
  images: [],
  showAddBtn: true,
  showAddPage: undefined
}
class Add extends Component {
  config = {
    navigationBarTitleText: '发布文章'
  }
  state: AddState = initData
  handleCommonChange (stateName, value) {
    this.setState({
      [stateName]: value
    })
  }
  handleImageChange (value, operationType) {
    console.log(value, operationType)
    // 小程序不支持获取原始文件名：https://developers.weixin.qq.com/community/develop/doc/0004c2645f0090bf924771cf356c00
    if (operationType === 'add') {
      const file = value[0].file
      if (file.size > 2 * 1024 * 1024) {
        Taro.showToast({
          icon: 'none',
          title: '图片大小不能超过2MB'
        })
        return
      }
      getAction().then((action) => {
        return Taro.uploadFile({
          url: action as string,
          filePath: file.path,
          name: 'file',
          formData: {
            contentType: 'text/html;charset=UTF-8"',
            path: path,
            name: `article_cover.${file.path.replace(/.+\./, '')}`,
            serviceName: bucket,
            scope: 1
          }
        }).then((resData) => {
          //上传的无法拦截，单独处理
          if (resData.statusCode === 200) {
            this.setState({
              images: [
                { url: `${csOrigin}/v0.1/static${JSON.parse(resData.data).path}?size=80` }
              ],
              showAddBtn: false
            })
          } else {
            Taro.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        })
      })
    } else {
      this.setState({
        images: [],
        showAddBtn: true
      })
    }
  }
  onSubmit = () => {
    const { title, content, images } = this.state
    validator.validate({ title, content, images }, (errors) => {
      if (!errors) {
        const userInfo = Taro.getStorageSync(USER_CACHE.USER_INFO) || { user_id: '', nick_name: '' }
        addArticle({
          userId: userInfo.user_id,
          author: userInfo.nick_name,
          title,
          content,
          coverImage: images[0].url
        }).then(() => {
          AtMessageUtil.success('发布成功')
          setTimeout(() => {
            this.setState(initData)
            // 刷新列表
            actions.article.getArticleList({ isFirstPage: true })
            Taro.switchTab({
              url: `/pages/home/index`
            })
          }, 1000)
        })
      } else {
        Taro.showToast({
          icon: 'none',
          title: errors[0].message
        })
      }
    })
  }
  onFail (mes) {
    console.log(mes)
  }
  componentDidMount () {
    // 绕过发布审核
    getConfigByCode('taro-template-add')
      .then((res) => {
        this.setState({ showAddPage: res.value[0].value === '1' })
      })
      .catch(() => {
        this.setState({ showAddPage: false })
      })
  }
  render () {
    const { title, content, images, showAddBtn, showAddPage } = this.state
    return (
      <View className='add'>
        <AtMessage />
        {showAddPage === undefined ? (
          <View />
        ) : showAddPage ? (
          <AtForm onSubmit={this.onSubmit}>
            <AtInput
              name='title'
              className='i-title'
              border={false}
              placeholder='请输入文章标题'
              value={title}
              onChange={this.handleCommonChange.bind(this, 'title')}
            />
            <AtDivider noChild customStyle={{ height: '1px' }} />
            <AtTextarea
              className='i-content'
              value={content}
              onChange={this.handleCommonChange.bind(this, 'content')}
              maxLength={20000}
              placeholder='请输入文章内容'
            />
            <AtWhiteSpace className='item-ws' />
            <AtImagePicker
              showAddButton={showAddBtn}
              fileList={images}
              onError={this.onFail.bind(this)}
              onChange={this.handleImageChange.bind(this)}
            />
            <View className='submit-container'>
              <AtButton type='primary' htmlType='submit'>
                提交
              </AtButton>
            </View>
          </AtForm>
        ) : (
          <View>开发建设中...</View>
        )}
      </View>
    )
  }
}

export default Add
