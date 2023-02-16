const path = require('path')

const config = {
  projectName: 'taro-template',
  date: '2019-5-10',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  alias:{
    '@tarojs/helper':'@fish.mobile/helper',
    '@tarojs/taro':'@fish.mobile/taro',
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  babel: {
    sourceMap: true,
    presets: [
      [
        'env',
        {
          modules: false
        }
      ]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      [
        'import',
        {
          libraryName: 'fish-miniapp',
          style: false,
          customName: function(name) {
            return `fish-miniapp/dist/ui/h5/components/${name.replace('at-', '')}`
          }
        }
      ],
      ['transform-runtime', {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: 'babel-runtime'
        }
      ]
    ]
  },
  plugins: [
    '@tarojs/plugin-sass',
    '@tarojs/plugin-terser'
  ],
  defineConstants: {SDP_ENV_CONFIG: JSON.stringify(require('./sdp'))
},
alias: {
  '@actions': path.resolve(__dirname, '..', 'src/actions'),
  '@assets': path.resolve(__dirname, '..', 'src/assets'),
  '@components': path.resolve(__dirname, '..', 'src/components'),
  '@constants': path.resolve(__dirname, '..', 'src/constants'),
  '@utils': path.resolve(__dirname, '..', 'src/utils'),
  './adapters/http': path.resolve(__dirname, '..', 'node_modules/axios-miniprogram-adapter/dist')
},
copy: {
  patterns: [],
  options: {}
},
mini: {
  module: {
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
        }
      },
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
  },
  h5: {
    publicPath: '/',
    // publicPath: '/client',// 后端服务器和前端服务器共用域名时用
    staticDirectory: 'static',
    esnextModules: ['fish-mobile', 'uc-login-mini-program'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
