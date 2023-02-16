import { ComponentClass } from 'react'
import Taro, { Component } from '@fish.mobile/taro'
import { View, Text, Image } from '@fish.mobile/components'
import { AtFab, AtPullToRefresh } from 'fish-miniapp'
import { actions } from '@gem-mine/durex'
import { connect } from '@fish.mobile/redux'
import { getConfigByCode } from '@actions/home'
import './index.scss'

interface ArticleListItem {
  coverImage: string
  createTime: string
  id: string
  praiseCount: number
  title: string
}
interface articleListProps {
  articleList: ArticleListItem[]
  statusUp: 'more' | 'loading' | 'noMore' | 'error'
  statusDown: 'more' | 'loading' | 'noMore' | 'error'
}
type PageOwnProps = {}

type PageState = {
  height?: number
  showAddPage?: boolean
}
interface Home {
  props: articleListProps
}
@connect(({ article }) => {
  return article
})
class Home extends Component {
  config = {
    enablePullDownRefresh: true,
    navigationBarTitleText: '文章列表'
  }
  state = { height: 0, showAddPage: false }
  componentDidMount () {
    Taro.getSystemInfo().then((res) => {
      let height = res.windowHeight
      if (process.env.TARO_ENV === 'h5') {
        height = height - 53
      }
      this.setState({
        height
      })
    })
    // 绕过发布审核
    getConfigByCode('taro-template-add')
      .then((res) => {
        this.setState({ showAddPage: res.value[0].value === '1' })
      })
      .catch(() => {
        this.setState({ showAddPage: false })
      })
  }
  onButtonClick = () => {
    Taro.navigateTo({
      url: `/pages/home/add/index`
    })
  }
  showDetail (id) {
    Taro.navigateTo({
      url: `/page-detail/pages/home/detail/index?id=${id}`
    })
  }
  handleReferesh (isPullDown) {
    actions.article.getArticleList({ isFirstPage: isPullDown })
  }
  render () {
    const { articleList, statusUp, statusDown } = this.props
    const { height, showAddPage } = this.state
    return (
      <View>
        <AtPullToRefresh
          mountedDirection={articleList.length > 0 ? 'down' : 'up'}
          customStyle={{ height: `${height}px` }}
          statusUp={statusUp}
          statusDown={statusDown}
          onRefresh={this.handleReferesh}>
          <View className='page-news-list'>
            {articleList.map((item) => (
              <View
                key={item.id}
                className='news-item'
                onClick={this.showDetail.bind(this, item.id)}>
                <View className='taro-img item-img'>
                  <Image
                    className='taro-img__mode-aspectfill'
                    mode='aspectFill'
                    src={item.coverImage}
                  />
                </View>
                <View className='item-content'>
                  <View className='item-content-title'>{item.title}</View>
                  <View className='item-content-meta'>
                    <View className='view-wrap'>
                      <Text className='taro-text at-icon at-icon-heart-2 view-icon' />
                      <Text className='taro-text view-num'>{item.praiseCount}</Text>
                    </View>
                    <View className='view-wrap'>
                      <Text className='taro-text at-icon at-icon-clock view-icon' />
                      <Text className='taro-text view-num'>{item.createTime}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </AtPullToRefresh>
        {showAddPage && (
          <View className='btn-fab'>
            <AtFab onClick={this.onButtonClick}>
              <Text className='at-fab__icon at-icon at-icon-camera' />
            </AtFab>
          </View>
        )}
      </View>
    )
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>
