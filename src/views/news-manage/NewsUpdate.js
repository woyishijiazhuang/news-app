import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Radio, Form, Input } from 'antd'
import axios from 'axios'
import E from 'wangeditor'
import { useNavigate, useParams } from 'react-router-dom'

const { Step } = Steps
function NewsUpdate(props) {
  const navigator = useNavigate()
  const params = useParams()
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
    const editor = new E('#wangEditor')
    editor.create()
    editor.config.onblur = (newHtml) => {
      setHtmlWord(newHtml)
    }
    // 获取新闻分类
    axios.get('/categories').then(res => {
      setCategories(res.data)
    })
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(({data}) => {
      // 预设第一步表单内容
      newsFrom.current.setFieldsValue({
        title: data.title,
        categoryId: data.categoryId
      })
      // 预设第二部内容
      editor.txt.html(data.content)
      // 防止没有触发 失去焦点 的事件
      setHtmlWord(data.content)
    })
      return () => {
      // 防止热更新出错
      editor.destroy()
    }
  }, [params.id])
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
  const handleSave = auditState => {
    console.log(htmlWord);
    axios.patch(`/news/${params.id}`, {
      ...formInfo,
      "content": htmlWord,
      "auditState": auditState,
    }).then(() => {
      alert(`你可以到${auditState===0?'草稿箱':'审核列表'}中查看你的新闻`)
      navigator(auditState===0?'/news-manage/draft':'audit-manage/list')
    })
  }
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => navigator(-1)}
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
        <p>保存到草稿箱或提交</p>
      </div>
      {current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>}
      {current < 2 && <Button onClick={handleNext} type='primary'>下一步</Button>}
      {current === 2 && <div style={{ float: 'right' }}>
        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
      </div>}
    </>
  )
}

export default NewsUpdate