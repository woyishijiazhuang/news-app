import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Layout, Menu } from 'antd'
const { Sider } = Layout
const { SubMenu } = Menu


function SideMenu(props) {
    const navigate = useNavigate()
    const location = useLocation()
    // 定义左侧菜单数据
    const [menu, setMenu] = useState([])
    // 请求左侧菜单数据
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data)
        })
    }, [])
    // 根据菜单数据动态渲染
    const renderMenu = function (menu) {
        const { role: { rights } } = JSON.parse(localStorage.getItem('myCat'))
        return menu.map(item => {
            // 判断 是否需要渲染
            if (!(item.pagepermisson && rights.includes(item.key))) return null
            // 有子节点 且 子节点不为空,渲染带下拉的SubMenu,否则渲染带点击跳转路由的Menu
            return (item.children?.length) ?
                <SubMenu key={item.key} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
                :
                <Menu.Item key={item.key} onClick={() => { navigate(item.key) }}>
                    {item.title}
                </Menu.Item>
        })
    }
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div className="logo">全球新闻发布系统</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu theme="dark" mode="inline"
                        selectedKeys={location.pathname}
                        defaultOpenKeys={["/" + location.pathname.split("/")[1]]}
                    >
                        { renderMenu(menu) }
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
    isCollapsed
})
export default connect(mapStateToProps)(SideMenu)