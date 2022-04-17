import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Table, Tag, Button, message } from 'antd'
import axios from 'axios'


function AuditList(props) {
  const navigate = useNavigate()
  // 存table数据
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('myCat'))
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  // 撤销按钮
  const handleRervert = (item)=>{
    axios.patch(`/news/${item.id}`,{auditState:0}).then(res=>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      message.success('已退回到草稿箱')
    })
  }
  // 发布按钮
  const handlePublish = item=>{
    axios.patch(`/news/${item.id}`,{publishState: 2,publishTime:Date.now()}).then(res=>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      message.success('已发布')
    })
  }
  // table表头和内容模板
  const columns = [
    {
      title: '新闻标题',
      render: item => (
        <NavLink title='点击预览' to={`../news-manage/preview/${item.id}`}>
          {item.title} 
        </NavLink>
      )
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: auditState =>{
        const colorList = ['','orange','green','red']
        const AuditList = ['草稿箱','审核中','已通过','未通过']
        return <Tag color={colorList[auditState]}>{AuditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: item => <>
        { item.auditState===1 && <Button onClick={()=>{handleRervert(item)}}>撤销</Button> }
        { item.auditState===2 && <Button danger onClick={()=>handlePublish(item)}>发布</Button> }
        { item.auditState===3 && <Button type='primary' onClick={() =>navigate(`/news-manage/update/${item.id}`) }>更新</Button> }
      </>
    }
  ]
  return (
      <Table columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
      />
  )
}

export default AuditList