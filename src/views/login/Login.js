import { Form, Input, Button } from 'antd'
import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
const Login = () => {
    const onFinish = values => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {

            if (res.data.length) {
                localStorage.setItem('myCat', JSON.stringify(res.data[0]))
                window.location.hash = '/'
            } else {
                alert("用户名或密码错误!")
            }
        })
    }
    const onFinishFailed = () => {

    }
    return (
        <>
            <div className='login-from'>
                <h2 style={{ textAlign: 'center', color: 'white' }}>全球新闻发布管理系统</h2>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        initialValue="admin"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input value="admin" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        initialValue="123456"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <div style={{'display':'flex','justifyContent':'space-between'}}>
                            <Link to='/news'>游客访问</Link>
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default Login