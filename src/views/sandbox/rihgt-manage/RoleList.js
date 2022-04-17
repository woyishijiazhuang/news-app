import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import {
    DeleteOutlined,
    UnorderedListOutlined
} from '@ant-design/icons'
import axios from 'axios'
function RoleList(props) {
    const [data, setData] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentID,setCurrentID] = useState(0)
    const [currentRight, setCurrentRight] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: "操作",
            render: item => <div>
                <Button danger onClick={() => deleteMethod(item)} shape="circle" icon={<DeleteOutlined />} />
                
                <Button type="primary" onClick={() => showModal(item)} shape="circle" icon={<UnorderedListOutlined />} />
            </div>

        }
    ]
    // 请求data, rightList
    useEffect(() => {
        axios.get("/roles").then(res => {
            setData(res.data)
        })
        axios.get("/rights?_embed=children").then(res=>{
            setRightList(res.data)
        })
    }, [])
    const deleteMethod = item => {
        if (window.confirm("你确认要删除吗?")) {
            axios.delete(`/roles/${item.id}`).then(() => {
                setData(data.filter(e => e.id !== item.id))
            }).catch(() => {
                window.alert("操作失败")
            })
        }
    }
    // 展示模态框
    const showModal = (item) => {
        setIsModalVisible(true)
        setCurrentID(item.id)
        setCurrentRight(item.rights)
    }
    // 确认按钮,隐藏模态框
    const handleOk = () => {
        setIsModalVisible(false)
        setData(data.map(item=>{
            if(item.id===currentID)return{...item,rights:currentRight}
            return item
        }))
        axios.patch(`/roles/${currentID}`,{"rights":currentRight})
    }
    // 取消按钮,隐藏模态框
    const handleCancel = () => { setIsModalVisible(false) }
    const check = (checkKeys)=>{setCurrentRight(checkKeys.checked)}
    return (
        <div>
            <Table columns={columns} dataSource={data} rowKey={(item) => item.id} />
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly
                    checkedKeys={currentRight}
                    treeData={rightList}
                    onCheck={(checkKeys)=>{check(checkKeys)}}
                />
            </Modal>
        </div>
    )
}

export default RoleList