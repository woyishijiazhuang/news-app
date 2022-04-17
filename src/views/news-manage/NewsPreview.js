import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader, Descriptions } from 'antd'
import axios from 'axios'
import E from 'wangeditor'
function NewsPreview(props) {
  const auditList = ['未审核','审核中','已通过','未通过']
  const publishList = ['未发布','待发布','已上线','已下线']
  const colorList = ['black','orange','green','red']
  // 获取路由参数
  const params = useParams()
  // 路由导航
  const navigate = useNavigate()
  // 根据路由获取数据
  const [news, setNews] = useState(null)
  useEffect(() => {
    const editor = new E('#text-header','#text-container')
    editor.create()
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNews(res.data)
      editor.txt.html(res.data.content)
      editor.disable()
    })
    return ()=>{
      editor.destroy()
    }
  }, [params.id])
  return (
    <div className="site-page-header-ghost-wrapper">
      {news && <PageHeader
        onBack={() => navigate(-1)}
        title={news.title}
        subTitle={news.category.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {(new Date(news.createTime)).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {news.publishTime?(new Date(news.publishTime)).toLocaleString():"未发布"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">
            {news.region}
          </Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <span style={{'color':colorList[news.auditState]}}>
              {auditList[news.auditState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <span style={{'color':colorList[news.publishState]}}>
              {publishList[news.publishState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">{news.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{news.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>}
      <div id='text-header' style={{'display':'none'}}></div><hr/>
      <div id="text-container"></div>
    </div>
  )
}


export default NewsPreview