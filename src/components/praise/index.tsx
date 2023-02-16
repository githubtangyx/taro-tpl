import { View, Text } from '@fish.mobile/components'
import Taro, { useState } from '@fish.mobile/taro'
import { getPayData, addPraise } from '@actions/home'
import { USER_CACHE } from '@constants/cache'
import classNames from 'classnames'

function ReadCount ({ isPraise, praiseCount, articleDetailId, userId, className }) {
  const [ praiseCountNow, setPraiseCount ] = useState(praiseCount)
  const [ isPraiseNow, setPraise ] = useState(isPraise)

  function sponsor () {
    if (isPraiseNow) {
      addPraise(articleDetailId, -1, userId).then(() => {
        setPraise(false)
        setPraiseCount(praiseCountNow - 1)
      })
    } else {
      const openId = Taro.getStorageSync(USER_CACHE.OPEN_ID)
      addPraise(articleDetailId, 1, userId).then(() => {
        setPraise(true)
        setPraiseCount(praiseCountNow + 1)
      })
      getPayData(openId)
        .then((payData) => {
          Taro.requestPayment(payData)
            .then(() => {
              Taro.showToast({
                icon: 'none',
                title: '感谢你的赞助！'
              })
            })
            .catch((e) => {
              console.error(`调用支付失败.${JSON.stringify(e)}`)
            })
        })
        .catch(() => {
          Taro.showToast({
            icon: 'none',
            title: `服务端对接公司钱包暂未开发`
          })
        })
    }
  }

  const iconCls = classNames({
    'at-icon': true,
    'at-icon-heart-o': !isPraiseNow,
    'at-icon-heart': isPraiseNow,
    'view-icon': true
  })
  return (
    <View className={className} onClick={sponsor}>
      <Text className={iconCls} /> {isPraiseNow ? '取消赞' : '赞助'}
      <Text>{praiseCountNow}</Text>
    </View>
  )
}
ReadCount.options = {
  addGlobalClass: true
}
export default ReadCount
