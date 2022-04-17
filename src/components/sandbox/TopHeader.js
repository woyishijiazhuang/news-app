import React from 'react'
import { Layout,Button, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
const { Header } = Layout
function TopHeader(props) {
  // 点击切换图标并收起侧边栏
  const toggle = () => {
    // props.dispatch()
    props.changeCollapsed()
  }
  // 退出登录
  const exitLogin = ()=>{
    window.localStorage.removeItem("myCat")
    window.location.hash = "#/login"
  }
const {role:{roleName},username} = JSON.parse(localStorage.getItem('myCat'))
  return (
    <Header
      className="site-layout-background"
      style={{ padding: '0 16px' }}
    >
      {
        props.isCollapsed ?
        <MenuUnfoldOutlined onClick={toggle} /> :
        <MenuFoldOutlined onClick={toggle} />
      }
      <div style={{ float: 'right' }}>
        <span>欢迎{roleName+username}回来</span>
        <Avatar size="large" icon={<UserOutlined/ >}></Avatar>
        <Button danger size='small' onClick={exitLogin}>退出</Button>
      </div>
    </Header>
  )
}
const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)