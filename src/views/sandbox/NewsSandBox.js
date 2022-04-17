import React from 'react'
// import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
/* 引入的自定义组件 */
import SideMenu from '../../components/sandbox/SideMenu.js'
import TopHeader from '../../components/sandbox/TopHeader.js'
import NewsRouter from '../../components/sandbox/NewsRouter.js'

// import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const { Content } = Layout
const NewsSandBox = () => {

    if(!window.localStorage.getItem('myCat')){
        window.location.hash = "#/login"
        return null
    }
    return (
        <Layout>
            <SideMenu/>
            <Layout className="site-layout">
                <TopHeader/>
                <Content
                    className="site-layout-background"
                    style={{ margin: '24px 16px',padding: 24,
                        minHeight: 280, overflow: 'auto'             
                    }}
                >
                    {/* <Outlet/> */}
                    <NewsRouter/>
                </Content>
            </Layout>            
        </Layout>
    );
};

export default NewsSandBox;