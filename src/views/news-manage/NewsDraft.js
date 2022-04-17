import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Table, Button } from 'antd'
import {
  DeleteOutlined,
  ToTopOutlined,
  EditOutlined
} from '@ant-design/icons'
function NewsDraft(props) {
  const navigate = useNavigate()
  // 文章存储
  const [dataSource, setDataSource] = useState([])
  // 获取文章
  useEffect(() => {
    const author = JSON.parse(window.localStorage.getItem('myCat')).username
    axios.get(`/news?auditState=0&author=${author}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  // 删除按钮
  const deleteNews = id => {
    if (window.confirm('确认删除吗?')) {
      axios.delete(`/news/${id}`).then(() => {
        setDataSource(dataSource.filter(item => item.id !== id))
      })
    }
  }
  // 预览按钮
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
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
      title: "操作",
      render: item => <div>
        <Button
          danger
          onClick={() => deleteNews(item.id)}
          shape="circle"
          icon={<DeleteOutlined />}
        />
        <Button
          shape="circle"
          icon={<EditOutlined />}
          onClick={() =>navigate(`/news-manage/update/${item.id}`) }
        />
        <Button 
          type="primary"
          shape="circle"
          icon={<ToTopOutlined />}
          onClick={()=>{
            axios.patch(`/news/${item.id}`,{"auditState": 1}).then(()=>{
              navigate('/audit-manage/list')
            })
          }}
        />
      </div>

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

export default NewsDraft