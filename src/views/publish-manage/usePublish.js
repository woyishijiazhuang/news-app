import { useEffect, useState } from 'react'
import axios from 'axios'
import { message } from 'antd'

const usePublish = (type) => {
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('myCat'))
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username,type])

  let handle
  switch(type) {
    case 1 :
      // handlePublish 对待发布的新闻进行发布
      handle = id => {
        axios.patch(`/news/${id}`,{"publishState": 2, "publishiTime": Date.now()}).then(res=>{
          setDataSource(dataSource.filter(item => item.id!==id))
          message.success('发布成功')
        })
      }
      break
    case 2 :
      // handleUnpublish对已发布的新闻进行下线
      handle = id => {
        axios.patch(`/news/${id}`,{"publishState": 3}).then(res=>{
          setDataSource(dataSource.filter(item => item.id!==id))
          message.success('已下线')
        })
      }
      break
    case 3 :
      // handleDelete 对已下线的新闻进行删除
      handle = id => {
        axios.delete(`/news/${id}`).then(res=>{
          setDataSource(dataSource.filter(item => item.id!==id))
          message.success('已删除')
        })
      }
      break
    default :
      console.error('需要一个 [type = 1 or 2 or 3] 初始值!')
  }

  
  return {
    dataSource,
    handle
  }
}
export default usePublish