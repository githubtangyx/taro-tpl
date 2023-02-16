import Taro, { Component, AtMessageUtil } from '@fish.mobile/taro'
import { View, RichText } from '@fish.mobile/components'
import {
  AtActivityIndicator,
  AtActionSheet,
  AtActionSheetItem,
  AtMessage,
  AtFab,
  AtButton,
  AtAvatar,
  AtIcon
} from 'fish-miniapp'
import { getArticleDetail, deleteArticle, getConfigByCode } from '@actions/home'
import './index.scss'
import { USER_CACHE } from '@constants/cache'
import { actions } from '@gem-mine/durex'
import ReadCount from '@components/read-count'
import Praise from '@components/praise'
import testjpg from './test.jpg'
interface ArticleDetail {
  userId?: string
  author?: string
  coverImage?: string
  createTime?: string
  content: string
  isPraise: boolean
  id?: string
  readCount?: number
  praiseCount?: number
  title?: string
}
interface DetailState {
  articleDetail?: ArticleDetail
  showAddPage?: boolean
  isH5: boolean
  showDeleteConfirm: boolean
  userId?: string
}

class Detail extends Component {
  config = {
    navigationBarTitleText: '详细'
  }
  state: DetailState = {
    isH5: process.env.TARO_ENV === 'h5',
    articleDetail: undefined,
    showAddPage: false,
    showDeleteConfirm: false,
    userId: Taro.getStorageSync(USER_CACHE.USER_ID)
  }
  onSubmit = () => {
    Taro.switchTab({
      url: `/pages/home/index`
    })
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
    getArticleDetail(this.$router.params.id, this.state.userId).then((articleDetail) => {
      this.setState({
        articleDetail
      })
      if (this.state.isH5 && wx) {
        const { title, coverImage } = articleDetail || { title: '', coverImage: '' }
        const shareData = {
          title,
          imgUrl: coverImage
        }
        wx.ready(function () {
          //需在用户可能点击分享按钮前就先调用
          // 兼容新旧API
          // 旧API
          wx.onMenuShareAppMessage(shareData)
          wx.onMenuShareTimeline(shareData)
          wx.onMenuShareQQ(shareData)
          wx.onMenuShareQZone(shareData)
          // onMenuShareWeibo 微博已经没有在分享选项里了
          // 新API
          wx.updateAppMessageShareData(shareData)
          wx.updateTimelineShareData(shareData)
        })
      }
    })
  }

  deleteMyArticle (id) {
    deleteArticle(id).then(() => {
      this.onShowDelete(false)
      AtMessageUtil.success('删除我的文章成功！')
      setTimeout(() => {
        // 刷新列表
        actions.article.getArticleList({ isFirstPage: true })
        Taro.switchTab({
          url: `/pages/home/index`
        })
      }, 1000)
    })
  }
  onShowDelete (isOpened) {
    this.setState({ showDeleteConfirm: isOpened })
  }
  onShareAppMessage (evt) {
    console.log('evt:', evt)
    const { title, coverImage } = this.state.articleDetail || { title: '', coverImage: '' }
    return {
      title: title,
      imageUrl: coverImage
    }
  }
  onClickHome = () => {
    if (this.state.isH5) {
      Taro.switchTab({
        url: `/pages/home/index`
      })
    }
  }
  render () {
    const { articleDetail, showDeleteConfirm, userId, isH5, showAddPage } = this.state
    if (!articleDetail) {
      return <AtActivityIndicator mode='center' tip='加载中...' />
    }
    const isMyArticle = articleDetail && userId == articleDetail.userId
    return (
      <View className='at-article'>
        {showAddPage && (
          <View className='share-container'>
            <AtFab onClick={this.onClickHome}>
              <AtButton openType='share' className='share-btn'>
                <AtIcon type={isH5 ? 'home' : 'share-alt'} color='white' />
              </AtButton>
            </AtFab>
          </View>
        )}
        <AtMessage />
        <View className='at-article__h1'>{articleDetail.title}</View>
        <View className='at-article__info'>
          <View className='at-row at-row__justify--between'>
            <View className='at-col at-col-5 '>
              {`${articleDetail.createTime}   ${articleDetail.author}`}
            </View>
            {showAddPage &&
            isMyArticle && (
              <View
                className='at-col at-col-5 article-text-strong'
                onClick={this.onShowDelete.bind(this, true)}>
                删除
              </View>
            )}
          </View>
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__p'>
              <RichText nodes={articleDetail.content} />
            </View>
          </View>
        </View>
        <View className='article-footer at-row at-row__justify--between'>
          <View className='at-col at-col-5 at-article__info '>
            <ReadCount readCount={articleDetail && articleDetail.readCount} />
          </View>
          {showAddPage && (
            <Praise
              className='at-col at-col-5 at-article__info article-text-strong'
              userId={userId}
              isPraise={articleDetail && articleDetail.isPraise}
              praiseCount={articleDetail && articleDetail.praiseCount}
              articleDetailId={articleDetail && articleDetail.id}
            />
          )}
        </View>
        {isMyArticle && (
          <AtActionSheet
            cancelText='取消'
            visible={showDeleteConfirm}
            onClose={this.onShowDelete.bind(this, false)}
            title='确认删除？'>
            <AtActionSheetItem
              onClick={this.deleteMyArticle.bind(this, articleDetail && articleDetail.id)}>
              确定
            </AtActionSheetItem>
          </AtActionSheet>
        )}
        {showAddPage && <AtAvatar size='large' className='avatar' shape='circle' src={testjpg} />}
      </View>
    )
  }
}

export default Detail
