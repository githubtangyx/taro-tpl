import { Text, Block } from '@fish.mobile/components'
function ReadCount ({ readCount }) {
  return (
    <Block>
      <Text className='taro-text at-icon at-icon-eye view-icon' /> 阅读 <Text>{readCount}</Text>
    </Block>
  )
}
ReadCount.options = {
  addGlobalClass: true
}
export default ReadCount
