import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Login from '../views/login/Login.js'
import NewsSandBox from '../views/sandbox/NewsSandBox.js'
// import NewsRouter from '../components/sandbox/NewsRouter.js'
// import Home from '../views/sandbox/Home.js'
// import UserList from '../views/sandbox/user-manage/UserList.js'
// import RoleList from '../views/sandbox/rihgt-manage/RoleList.js'
// import RightList from '../views/sandbox/rihgt-manage/RightList.js'
// import Nopermission from '../views/sandbox/nopermission/Nopermission.js'
import News from '../views/news/News'
import Detail from '../views/news/Detail'

function IndexRouter() {
    // 放在了sandbox组件内
    // if(!window.localStorage.getItem('myCat')){
    //     window.location.href = "http://localhost:3000/#/login"
    //     return <Login/>
    // }
    return (
        <HashRouter>
            <Routes>
                <Route path='/news' element={<News />} />
                <Route path='/detail/:id' element={<Detail />} />
                <Route path='/*' element={<NewsSandBox />}>
                    {/* <Route path='/' element={<Navigate to='/home' />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/user-manage/list' element={<UserList />} />
                    <Route path='/right-manage/role/list' element={<RoleList />} />
                    <Route path='/right-manage/right/list' element={<RightList />} />
                    <Route path='*' element={<Nopermission />} /> */}
                </Route>
                <Route path='/login' element={<Login />} />
            </Routes>
        </HashRouter>
    )

}

export default IndexRouter