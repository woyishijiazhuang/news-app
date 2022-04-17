import usePublish from './usePublish'
import NewsPublish from './NewsPublish'
import { Button } from 'antd'
function Unpublished(props) {
  const {dataSource,handle} = usePublish(1)
  return (
    <NewsPublish dataSource={dataSource}>
      {id => <Button onClick={()=>handle(id)} type='primary'>发布</Button>}
    </NewsPublish>
  )
}

export default Unpublished