import request from '@gem-mine/request'
import ucManagerExtend from '@utils/ucManagerExtend'
import { buildURL } from '@sdp.nd/request-adapter-waf'
import mpAdapter from 'axios-miniprogram-adapter'
import { HTTP_STATUS } from '@constants/status'
import Taro from '@fish.mobile/taro'

const isH5 = process.env.TARO_ENV === 'h5'
const { baseUrl, uploadUrl } = SDP_ENV_CONFIG

function showError(message, show = true) {
  show &&
    Taro.showToast({
      title: message || '网络异常',
      icon: 'none'
    })
  return false
}
// 初始化请求配置
request.init(
  {
    demoRequest: {
      defaults: {
        url: baseUrl,
        prefix: ''
      }
    },
    csRequest: {
      defaults: {
        url: uploadUrl,
        prefix: ''
      }
    },
    payRequest: {
      defaults: {
        url: "https://wxpay.zmei.me",
        prefix: ''
      }
    }
  },
  {}
)
request.config({
  adapter: isH5 ? null : mpAdapter,
  before(config) {
    if (!config.noAuth && !ucManagerExtend.getToken()) {
      ucManagerExtend.logoutPage()
      return showError('请登陆体验完整功能')
    }
    // auth 处理
    if (!config.noAuth && ucManagerExtend.getToken()) {
      const { url: _url, method, params, paramsSerializer, headers = {}, ...restConfig } = config
      const url = buildURL(_url, params, paramsSerializer)
      headers.Authorization = ucManagerExtend.getAuthHeader({
        url,
        method
      })
      config = Object.assign({}, restConfig, {
        url,
        headers,
        method
      })
    }
    return config
  },
  error(error) {
    const statusCode = error.status
    let errorMessage = ''
    if (statusCode === HTTP_STATUS.NOT_FOUND) {
      errorMessage = '请求资源不存在'
    } else if (statusCode === HTTP_STATUS.FORBIDDEN) {
      ucManagerExtend.logoutPage()
      errorMessage = '没有权限访问，请登陆'
    } else if (statusCode === HTTP_STATUS.AUTHENTICATE) {
      ucManagerExtend.logoutPage()
      errorMessage = '需要鉴权，请登陆'
    } else {
      errorMessage = error.message
    }
    showError(errorMessage)
    return Promise.reject(error)
  }
})
export const csRequest = request.csRequest
export const payRequest = request.payRequest
export default request.demoRequest
