import { Table, Button } from 'antd'
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {DeleteOutlined} from '@ant-design/icons'
function NewsCategory(props) {
  // 存新闻分类
  const [categories, setCategories] = useState([])
  // 获取新闻分类
  useEffect(()=>{
    axios.get('/categories').then(res => {
      setCategories(res.data)
    })
  },[])
  // 删除新闻分类
  const deleteMethod = (id) => {
    axios.delete(`/categories/${id}`).then(()=>{
      setCategories(categories.filter(item=>item.id !== id))
    })
  }
  // 修改栏目名称-接收当前修改的item,和事件对象
  const handleChange = (item,e) => {
    // 用map得到新的分类
    const newCategories =  categories.map(data=>{
      if(data.id === item.id){
        const text = e.target.innerText.trim()
        if(data.title !== text){
          axios.patch(`/categories/${item.id}`,{title: text,value: text})
          return{id: data.id, title: text, value: text}
        }
      }
      return data
    })
    setCategories(newCategories)
  }
  // table 表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '栏目名称',
      render: item=><div
        className='content-editable'
        contentEditable="true"
        suppressContentEditableWarning
        onBlur={(e)=>handleChange(item,e)}
        onKeyDown={ e => e.code === "Enter" && e.target.blur() }
        >
        {item.title}
      </div>
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: id=><Button
        danger
        onClick={() => {deleteMethod(id)}}
        shape="circle"
        icon={<DeleteOutlined />}
      />
    }
  ]
  return (
    <Table columns={columns}
      dataSource={categories}
      rowKey={(item) => item.id}
      pagination={{ pageSize: 5 }}
      // components = {{ body:{row: EditableRow,cell: EditableCell} }}
    />
  )
}

export default NewsCategory