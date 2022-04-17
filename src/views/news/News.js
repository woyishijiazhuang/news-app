import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Row, Col, Card, List } from 'antd'
import axios from 'axios'
function News(props) {
  const [newsList, setNewsList] = useState()
  useEffect(() => {
    axios("/news?publishState=2&_expand=category").then(({ data }) => {
      const list = {}
      data.forEach(item => {
        if (!list[item.category.value]?.push(item)) {
          (list[item.category.value] = [item])
        }
      })
      setNewsList(Object.entries(list))
    })
  }, [])
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <Row justify='space-around' gutter={['auto', 24]}>
        {
          newsList?.map(item => {
            return <Col span={7}  key={item[0]}>
              <Card title={item[0]} hoverable style={{'height':'280px'}}>
                <List
                  size='small'
                  pagination={{ pageSize: 3 }}
                  dataSource={item[1]}
                  renderItem={data => (
                    <List.Item>
                      <Link to={`/detail/${data.id}`}>{data.title}</Link>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          })
        }
      </Row>
    </div>
  )
}

export default News