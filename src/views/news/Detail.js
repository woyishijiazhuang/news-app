import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Descriptions } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import E from 'wangeditor'
function Detail(props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [star, setStar] = useState(true)
  useEffect(() => {
    const editor = new E('#toolbar-container','#detail-container')
    editor.create()
    // 禁止编辑
    editor.disable()
    // 请求到数据后追加到页面中
    axios(`/news/${id}?_expand=category&_expand=role`).then(({data})=>{
      setNews(data)
      editor.txt.html(data.content)
      return data.view
    })
    // 每次刷新都导致阅读加一
    // .then(res=>{
    //    // 每次请求数据时阅读量加一
    //   axios.patch(`/news/${id}`,{view: res + 1})
    // })
    return ()=>{
      // 跟随页面销毁
      editor.destroy()
    }
  }, [id])
  // 销毁时阅读量加一,省略了{}和return
  useEffect(()=>()=>
   news && axios.patch(`/news/${id}`,{view: news.view + 1})
  ,[id,news])
  // 点击喜欢按钮
  let handleLike = ()=>{
    star && axios.patch(`/news/${id}`,{star: news.star + 1})
    setStar(false)
  }
  return (
    <>
      {news && <PageHeader
        onBack={() => navigate(-1)}
        title={news.title}
        subTitle={<div onClick={()=>handleLike()}>
          {news.category.title}
          <HeartTwoTone twoToneColor={star?"":"#eb2f96"} />
        </div>
        }
        footer={<hr/ >}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {news.publishTime?(new Date(news.publishTime)).toLocaleString():"未发布"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">
            {news.region}
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">{news.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{news.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>}
      {/* 暂时不知道怎么不渲染菜单，只好使用css隐藏 */}
      <div id="toolbar-container" style={{'display':'none'}}></div>

      <div id="detail-container">
        {/* 数据请求时显示的初始内容，文章内容区域 */}
        <h2>loding...</h2>
      </div>
    </>
  )
}

export default Detail