import usePublish from './usePublish'
import NewsPublish from './NewsPublish'
import { Button } from 'antd'
function Sunset(props) {
  const {dataSource,handle} = usePublish(3)
  return (
    <NewsPublish dataSource={dataSource}>
      { id => <Button danger onClick={()=>handle(id)}>删除</Button> }
    </NewsPublish>
  )
}

export default Sunset