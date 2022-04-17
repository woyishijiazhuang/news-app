import React, { useEffect, useRef, useState } from 'react'
import UserFrom from '../../../components/user-manage/UserFrom'
import { Button, Table, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
function UserList(props) {
    const [regionDisable,setRegionDisable] = useState(false)
    // table数据源,用户列表
    const [dataSource, setDataSource] = useState([])
    // 添加用户模态框显示
    const [visible, setVisible] = useState(false)
    // 更新用户模态框显示
    const [updateVisible, setUpdateVisible] = useState(false)
    // 更改时记录角色id
    const [currentId, setCurrentId] = useState(0)
    // 区域 和 角色列表
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    // 表单引用
    const addFrom = useRef()
    const updateFrom = useRef()
    // 表单标题和内容
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            // filters:[
            //     ...regionList.map(item=>({text:item.title,value:item.value})),
            //     {text:"全球",value:"全球"}
            // ],
            // onFilter:(value,item)=>item.region===value,
            render: region => <b>{region === '' ? '全球' : region}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleId',
            render: roleId => roleId === 1 ? "超级管理员" : (roleId === 2 ? "区域管理员" : "区域编辑")
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => <Switch onChange={() => changeRoleState(item)} checked={roleState} disabled={item.default}></Switch>
        },
        {
            title: "操作",
            render: item => <div>
                <Button disabled={item.default} danger shape="circle" icon={<DeleteOutlined />}
                    onClick={()=>{deleteMethod(item)}}    
                />
                
                <Button disabled={item.default} type="primary" shape="circle" icon={<EditOutlined />} 
                    onClick={()=>changeUser(item)} 
                />
            </div>
        }
    ]
    // 请求用户,区域,角色列表
    useEffect(()=>{
        axios.get("/users?_expand=role").then(res => {
            let list = res.data
            const {username,region,roleId} = JSON.parse(window.localStorage.getItem('myCat'))
            list = roleId===1?list:[
                ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region===region && item.roleId===3)
            ]
            setDataSource(list)
        })
    },[])
    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegionList(res.data)
        })
        axios.get("/roles").then(res => {
            setRoleList(res.data)
        })
    }, [])
    // 点击删除用户
    const deleteMethod = item => {
        if(window.confirm("确认删除?")){
            axios.delete(`/users/${item.id}`).then(()=>{
                setDataSource(dataSource.filter(data=>data.id!==item.id)) 
            })
        }
    }
    // 切换用户状态
    const changeRoleState = item => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    // 添加用户表单提交确认
    const addFromOK = () => {
        addFrom.current.validateFields().then(value => {
            setVisible(false)
            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                setDataSource([...dataSource, res.data])
            })
        })
    }
    // 点击修改用户
    const changeUser = item => {    
        setUpdateVisible(true)
        setTimeout(()=>{
            updateFrom.current.setFieldsValue(item) 
            setRegionDisable(item.roleId===1)
            setCurrentId(item.id)
        },0)
    }
    // 更新表单确认后
    const updataFromOK = ()=>{
        // 获取表单的值
        updateFrom.current.validateFields().then(value=>{
            // 关闭表单
            setUpdateVisible(false)
            // console.log(value,dataSource,currentId);
            // 改变本地状态
            setDataSource(
                dataSource.map(item=>{
                    if(currentId === item.id){
                        return{
                            ...item,
                            ...value,
                            role: roleList.filter(data=>data.id===value.roleId)[0]
                        }
                    }
                    return item
                })
            )         
            // 更改数据库
            axios.patch(`/users/${currentId}`,value)
        })
    }
    return (
        <div style={{ "overflow": "auto", "height": "100%" }}>
            <Button type="primary" onClick={() => setVisible(true)} >添加用户</Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ "pageSize": 5 }}
                rowKey={item => item.id}
            />
            <Modal title="添加用户"
                visible={visible}
                okText="添加"
                cancelText="取消"
                onCancel={() => setVisible(false)}
                onOk={addFromOK}
            >
                <UserFrom 
                    regionList={regionList} 
                    roleList={roleList} 
                    ref={addFrom} 
                    regionDisable={regionDisable}
                    setRegionDisable={setRegionDisable} 
                />
            </Modal>
            <Modal title="更新用户"
                visible={updateVisible}
                okText="更新"
                cancelText="取消"
                onCancel={() => {setUpdateVisible(false);}}
                onOk={updataFromOK}
            >
                <UserFrom 
                    isUpdate
                    regionList={regionList} 
                    roleList={roleList} 
                    ref={updateFrom} 
                    regionDisable={regionDisable} 
                    setRegionDisable={setRegionDisable} 
                />
            </Modal>
        </div>
    )
}

export default UserList