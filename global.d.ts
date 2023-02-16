declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare module 'axios-miniprogram-adapter'
declare const wx: any
// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq'
    [key: string]: any
  }
}
declare const SDP_ENV_CONFIG: {
  /**
   * 内容服务域名
   */
  csOrigin: string
  /**
   * 内容服务存储目录
   */
  path: string
  /**
   * 内容服务存储分区（桶）
   */
  bucket: string
  /**
   * uc运行环境
   */
  ucEnv: string
  /**
   * uc组织ID
   */
  orgId: string
  /**
   * uc组织
   */
  orgName: string
  /**
   * 共享平台发布环境
   */
  env: string
  /**
   * 上传服务端API地址（可以和baseUrl合并到一个服务）
   */
  uploadUrl: string
  /**
   * 业务服务端API地址
   */
  baseUrl: string
  /**
   * 微信-公众号
   */
  appIdH5: string
  /**
   * uc应用id-公众号
   */
  sdpAppIdH5: string
  /**
   * uc应用id-小程序
   */
  sdpAppId: string
}
