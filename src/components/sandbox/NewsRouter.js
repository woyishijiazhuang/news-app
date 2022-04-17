import React, { useEffect, useState } from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sandbox/Home.js'
import UserList from '../../views/sandbox/user-manage/UserList.js'
import RoleList from '../../views/sandbox/rihgt-manage/RoleList.js'
import RightList from '../../views/sandbox/rihgt-manage/RightList.js'
import Nopermission from '../../views/sandbox/nopermission/Nopermission.js'
import NewsAdd from '../../views/news-manage/NewsAdd'
import NewsDraft from '../../views/news-manage/NewsDraft'
import NewsCategory from '../../views/news-manage/NewsCategory'
import NewsPreview from '../../views/news-manage/NewsPreview'
import NewsUpdate from '../../views/news-manage/NewsUpdate'
import Audit from '../../views/audit-manage/Audit'
import AuditList from '../../views/audit-manage/AuditList'
import Unpublished from '../../views/publish-manage/Unpublished'
import Published from '../../views/publish-manage/Published'
import Sunset from '../../views/publish-manage/Sunset'
const LoaclRouterMap = {
  '/home': <Home/>,
  '/user-manage/list': <UserList/>,
  '/right-manage/role/list': <RoleList/>,
  '/right-manage/right/list': <RightList/>,
  "/news-manage/add": <NewsAdd/>,
  "/news-manage/draft":<NewsDraft/>,
  "/news-manage/category":<NewsCategory/>,
  "/news-manage/preview/:id":<NewsPreview />,
  "/news-manage/update/:id":<NewsUpdate />,
  "/audit-manage/audit":<Audit/>,
  "/audit-manage/list":<AuditList/>,
  "/publish-manage/unpublished":<Unpublished/>,
  "/publish-manage/published":<Published/>,
  "/publish-manage/sunset":<Sunset/>
}

function NewsRouter(props) {
  const [BackRouteList,setBackRouteList] = useState([])
  useEffect(()=>{
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res=>{
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  },[])
  const checkRoute = (item)=>{
    return LoaclRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const {role:{rights}} = JSON.parse(localStorage.getItem('myCat'))
  const checkUserPermission = (item)=>{
    return rights.includes(item.key)
  }
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      {
        BackRouteList.map(item=>
          (checkRoute(item) && checkUserPermission(item))?
          <Route key={item.key} path={item.key}
            element={LoaclRouterMap[item.key] || <Nopermission />}
          />
          :
          null
        )
      }
      {/* <Route path='/home' element={<Home />} />
      <Route path='/user-manage/list' element={<UserList />} />
      <Route path='/right-manage/role/list' element={<RoleList />} />
      <Route path='/right-manage/right/list' element={<RightList />} /> */}
      <Route path='*' element={<Nopermission />} />
    </Routes>
  )
}

export default NewsRouter