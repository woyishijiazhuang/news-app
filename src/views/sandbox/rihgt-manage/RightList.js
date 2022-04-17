import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Switch } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'

function RightList(props) {
    const [dataSource, setDataSource] = useState([])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id=><b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => <Tag color="orange">{key}</Tag>
        },
        {
            title: "操作",
            render: item => <div>
                <Button onClick={() => deleteMethod(item)} danger shape="circle" icon={<DeleteOutlined />} />
                
                {/* {item.pagepermisson === undefined ? null:<Button type="primary" disabled={!item.pagepermisson} shape="circle" icon={<EditOutlined />} />} */}
                {item.pagepermisson === undefined ? null:<Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}}></Switch>}

            </div>

        }
    ]
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            res.data.forEach(item => { if(!item.children.length)item.children=""} )
            setDataSource(res.data)
        })
    }, [])
    const deleteMethod = item => {
        // antd不兼容react18,当确认删除则执行后面语句
        if(window.confirm("确认删除权限吗?")){
            let url
            // 一级菜单和二级菜单需要不同的操作去处理数据,url有点不同
            if(item.grade === 1){
                url = "rights"
                setDataSource(dataSource.filter(data => data.id !== item.id))
            }else{
                url =  "children"
                // 这里任然改变了状态,不过没啥大问题
                let list = dataSource.filter(data=>data.id===item.rightId)
                list[0].children = list[0].children.filter(data=>data.id!==item.id)
                setDataSource([...dataSource])
            }
            axios.delete(`/${url}/${item.id}`)
        }
    }
    const switchMethod = item => {
        item.pagepermisson = item.pagepermisson === 1 ? 0:1
        setDataSource([...dataSource])
        axios.patch(`/${item.grade === 1 ? "rights" : "children"}/${item.id}`,{
            pagepermisson: item.pagepermisson
        })
    }
    return (
        <div style={{ "overflow": "auto", "height": "100%" }}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ "pageSize": 5 }}
            />
        </div>
    )
}

export default RightList