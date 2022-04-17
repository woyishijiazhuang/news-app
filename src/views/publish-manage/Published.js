import usePublish from './usePublish'
import NewsPublish from './NewsPublish'
import { Button } from 'antd'
function Published(props) {
  const {dataSource,handle} = usePublish(2)
  return (
    <NewsPublish dataSource={dataSource}>
      {id => <Button danger onClick={()=>handle(id)}>下线</Button>}
    </NewsPublish>
  )
}

export default Published