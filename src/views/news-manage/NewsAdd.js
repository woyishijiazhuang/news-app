import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Radio, Form, Input } from 'antd'
import axios from 'axios'
import E from 'wangeditor'

// import StepOne from './StepOne.js'
const { Step } = Steps
function NewsAdd(props) {
  const newsFrom = useRef()
  // 存步骤
  const [current, setCurrent] = useState(0)
  // 存新闻分类
  const [categories, setCategories] = useState([])
  // 存第一步表单内容
  const [formInfo, setFormInfo] = useState({})
  // 存文档内容
  const [htmlWord, setHtmlWord] = useState("")
  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategories(res.data)
    })
  }, [])
  useEffect(() => {
    const editor = new E('#wangEditor')
    editor.create()
    editor.config.onblur = (newHtml) => {
      setHtmlWord(newHtml)
    }
    return () => {
      // 防止热更新出错
      editor.destroy()
    }
  }, [])
  const handleNext = () => {
    if (current === 0) {
      newsFrom.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
        setCurrent(current + 1)
    }
  }
  // 保存
  const User = JSON.parse(window.localStorage.getItem('myCat'))
  const handleSave = auditState => {
    axios.post('/news', {
      ...formInfo,
      "content": htmlWord,
      "region": User.region?User.region:"全球",
      "author": User.username,
      "roleId": User.roleId, 
      "auditState": auditState, 
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then(()=>{
      setCurrent(0)
      alert('操作成功')
    })
  }
return (
  <>
    <PageHeader
      className="site-page-header"
      title="撰写新闻"
      subTitle="This is a subtitle"
    />
    <Steps current={current}>
      <Step title="基本信息" description="新闻标题和分类" />
      <Step title="新闻内容" description="新闻主体内容" />
      <Step title="新闻提交" description="保存草稿或提交内容" />
    </Steps>
    {/* 三个步骤对应的内容 */}
    <br />
    <div style={{ display: current === 0 ? "block" : "none" }}>
      <Form
        ref={newsFrom}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="新闻标题"
          name="title"
          rules={[{ required: true, message: 'Please input 新闻标题!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="新闻分类"
          name="categoryId"
          rules={[{ required: true, message: 'Please input 新闻分类!' }]}
        >
          <Radio.Group>
            {
              categories.map(item =>
                <Radio.Button key={item.id} value={item.id}>
                  {item.title}
                </Radio.Button>
              )
            }
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
    <div style={{ display: current === 1 ? "block" : "none" }}>
      <div id={'wangEditor'}></div>
    </div>
    <div style={{ display: current === 2 ? "block" : "none" }}>
      333
    </div>
    {current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>}
    {current < 2 && <Button onClick={handleNext} type='primary'>下一步</Button>}
    {current === 2 && <div style={{ float: 'right' }}>
      <Button type='primary' onClick={()=>handleSave(0)}>保存草稿箱</Button>
      <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
    </div>}
  </>
)
}

export default NewsAdd