import React,{forwardRef } from 'react'
import { Form, Input, Radio,Select} from 'antd'
const UserFrom = forwardRef((props,ref) => {
  // const [regionDisable, setRegionDisable] = useState(false)
  const {roleId,region} = JSON.parse(localStorage.getItem('myCat'))
  const checkRegionDisabled =(item)=>{
    if(props.isUpdate){
      if(roleId===1) return false
      else return true
    }else{
      if(roleId===1) return false
      else return item.value!==region
    }

  }
  const checkRoleDisabled =(item)=>{
    if(props.isUpdate){
      if(roleId===1) return false
      else return true
    }else{
      if(roleId===1) return false
      else return item.id!==3
    }
  }
  return (
    <Form
      ref={ref}
      layout="vertical"
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: 'Please input username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: 'Please input password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={[{ required: !props.regionDisable, message: 'Please input region!' }]}
      >
        {/* <Radio.Group disabled={props.regionDisable}>
          {props.regionList.map(item => 
            <Radio.Button
              value={item.value}
              key={item.id}
              disabled={checkRegionDisabled(item)}
            >
              {item.title}
            </Radio.Button>)
          }
        </Radio.Group> */}
        <Select disabled={props.regionDisable}>
        {props.regionList.map(item => 
            <Select.Option
              value={item.value}
              key={item.id}
              disabled={checkRegionDisabled(item)}
            >
              {item.title}
            </Select.Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="角色"
        name="roleId"
        rules={[{ required: true, message: '请输入角色!' }]}
      >
        <Radio.Group onChange={
          e=>{
            if(e.target.value===1){
              props.setRegionDisable(true)
              ref.current.setFieldsValue({region:""})
            }else{
              props.setRegionDisable(false)
            }
          }}
        >
          {props.roleList.map(item =>
            <Radio.Button value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>
            {item.roleName}
            </Radio.Button>)
          }
        </Radio.Group>
      </Form.Item>
    </Form>
  )
})

export default UserFrom