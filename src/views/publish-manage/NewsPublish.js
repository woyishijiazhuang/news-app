import React from 'react';
import { Link } from 'react-router-dom'
import { Table } from 'antd'
function NewsPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      render: item => (
        <Link title='点击预览' to={`../news-manage/preview/${item.id}`}>
          {item.title} 
        </Link>
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
      title: '操作',
      dataIndex: 'id',
      render: props.children
    }
  ]
  return (
    <Table columns={columns}
      dataSource={props.dataSource}
      rowKey={(item) => item.id}
      pagination={{ pageSize: 5 }}
    />
  );
}

export default NewsPublish;