import Taro, { Component, Config } from '@fish.mobile/taro'
import '@fish.mobile/async-await'
import Index from './pages/home'
import request from '@utils/request'
import ucManagerExtend from '@utils/ucManagerExtend'
import { createStore } from '@gem-mine/durex'
import { Provider } from '@fish.mobile/redux'
import './model'
import './app.scss'

const store = createStore()
const isH5 = process.env.TARO_ENV === 'h5'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && isH5)  {
//   require('react-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [ 'pages/home/index', 'pages/home/add/index', 'pages/user/index' ],
    subPackages: [
      {
        root: 'page-detail',
        pages: [ 'pages/home/detail/index' ]
      }
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'TaroDemo',
      navigationBarTextStyle: 'black'
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    },
    tabBar: {
      color: '#666',
      selectedColor: '#b4282d',
      backgroundColor: '#fafafa',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/home/index',
          iconPath: './assets/images/tab-bar/home.png',
          selectedIconPath: './assets/images/tab-bar/home-active.png',
          text: '首页'
        },
        {
          pagePath: 'pages/user/index',
          iconPath: './assets/images/tab-bar/user.png',
          selectedIconPath: './assets/images/tab-bar/user-active.png',
          text: '个人'
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {
    ucManagerExtend.isLogin().then((isLogin) => isLogin && ucManagerExtend.refreshToken())
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

//初始化公众号配置
const initConfig = function () {
  if (isH5) {
    //初始化公众号配置
    return request
      .get(`/init/gzh`, { noAuth: true })
      .then(function (responseData) {
        wx.config({
          // debug: true, //发布生产要关掉
          // beta: true,
          appId: responseData.appId,
          nonceStr: responseData.nonceStr,
          signature: responseData.signature,
          timestamp: responseData.timestamp,
          //根据需要开启
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareQZone',
            'openLocation',
            'getLocation',
            'scanQRCode',
            'chooseWXPay'
          ]
        })
        wx.error(function (res) {
          console.log('error:', res)
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        })
      })
      .catch((e) => console.log(e))
  } else {
    return Promise.resolve()
  }
}
// 初始化uc示例
// initUC()
// 启动项目
initConfig().then(() => {
  Taro.render(<App />, document.getElementById('app'))
})
