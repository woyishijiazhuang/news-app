import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Table, Button } from 'antd'

function Audit(props) {
  // 定义 请求待审核的数据
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      let list = res.data
      const {username,region,roleId} = JSON.parse(window.localStorage.getItem('myCat'))
      // 根据用户过滤数据
      list = roleId===1?list:[
          ...list.filter(item=>item.author===username),
          ...list.filter(item=>item.region===region && item.roleId===3)
      ]
      setDataSource(list)
    })
  },[])
  // table表头和内容模板
  const columns = [
    {
      title: '新闻标题',
      render: item => (
        <NavLink title='点击预览' to={`../news-manage/preview/${item.id}`}>
          {item.title} 
        </NavLink>)
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      render: item => item.category.title
    },
    {
      title: '操作',
      render: item => <>
        <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
        <Button type='primary' onClick={()=>handleAudit(item,2,1)}>通过</Button>
      </>
    }
  ]
  // 驳回或者通过的操作
  const handleAudit = (item,auditState,publishState)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState,publishState
    })
  }
  return (
    <Table columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
    />
  );
}

export default Audit;