import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as echarts from 'echarts'
import { Card, Row, Col, List, Avatar, Drawer } from 'antd'
import { EllipsisOutlined, EditOutlined, PieChartOutlined } from '@ant-design/icons'
import axios from 'axios'
const { Meta } = Card

function Home(props) {
	const navigate = useNavigate()
	// 柱状图和饼图引用
	const barRef = useRef()
	const peiRef = useRef()
	// 抽屉展示状态
	const [visible, setVisible] = useState(false)
	// 下面两个只用一次,饼图渲染要的数据(所有发布过的新闻)和防止饼图多次渲染的变量
	const [dataSource, setDataSource] = useState({})
	const [peiShouldRender, setPeiShouldRender] = useState(false)
	// 1.定义并请求 用户最常浏览数据
	const [viewList, setViewList] = useState([])
	useEffect(() => {
		axios(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
			setViewList(res.data)
		})
	}, [])
	// 2.定义并请求 用户点赞最多数据
	const [starList, setStarList] = useState([])
	useEffect(() => {
		axios(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
			setStarList(res.data)
		})
	}, [])
	// 3.本地读取用户信息显示
	const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('myCat'))
	// 4.echarts柱状图展示所有发布新闻
	useEffect(() => {
		const newsList = {}
		var barChart
		axios("/news?publishState=2&_expand=category").then(({ data }) => {
			// 根据新闻类型分类
			data.forEach(item => {
				if (!newsList[item.category.value]?.push(item)) {
					(newsList[item.category.value] = [item])
				}
			})
			// 小心返回的键名数组顺序会被重新排序,整形成柱图需要的数据
			const xAxisData = Object.keys(newsList)
			setDataSource(data)
			const yAxisData = xAxisData.map(item=>newsList[item].length)

			// 柱状图初始化
			barChart = echarts.init(barRef.current)
			barChart.setOption({
				title: {
					text: '新闻分类图示'
				},
				tooltip: { },
				xAxis: {
					data: xAxisData,
					axisLabel: {
						interval: 0
					}
				},
				yAxis: {minInterval: 1},
				series: [
					{
						name: '数量',
						type: 'bar',
						data: yAxisData
					}
				]
			})
		})
		// 柱图根据窗口动态变化
		window.onresize = () => barChart.resize()
		return () => {
			window.onresize = null
			// 防止热更新报错
			barChart.dispose()
		}
	}, [])
	// 5.展示饼图(用户自己的新闻信息)和初始化函数		
	let peiShow = useCallback(()=>{
		setVisible(true)
		// 防止多次渲染
		if(peiShouldRender) return
		setTimeout(()=>{
			setPeiShouldRender(true)
			const authorNewsList = {}
			// 在所有新闻里,统计当前用户的新闻分类
			dataSource.forEach(item => {
				if(item.author === username){
					if (!authorNewsList[item.category.value]?.push(item)) {
						(authorNewsList[item.category.value] = [item])
					}
				}
			})
			const xAxisData = Object.keys(authorNewsList)
			const peiData = xAxisData.map(item=>({value:authorNewsList[item].length,name:item}))
			var peiChart = echarts.init(peiRef.current)
			peiChart.setOption({
				title: {
					text: '新闻分类图示',
					left: 'center'
				},
				tooltip: { },
				legend: {
					orient: 'vertical',
					left: 'left'
				},
				series: [
					{
						name: '数量',
						type: 'pie',
						data: peiData,
						// label: {position: 'inside'}
					}
				]
			})
		},0)	
	},[dataSource,peiShouldRender,username])
	return (
		<div className="site-card-wrapper">
			{/* 中间三个卡片 */}
			<Row gutter={16}>
				<Col span={8}>
					<Card title="用户最常浏览" bordered>
						<List
							dataSource={viewList}
							renderItem={item => (
								<List.Item>
									<Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card title="Card title" bordered>
						<List
							dataSource={starList}
							renderItem={item => (
								<List.Item>
									<Link to={`/0news-manage/preview/${item.id}`}>{item.title}</Link>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<PieChartOutlined key="setting" onClick={()=>peiShow()}/>,
							<EditOutlined key="edit" onClick={()=>navigate('/user-manage/list')} />,
							<EllipsisOutlined key="ellipsis" />,
						]}
					>
						<Meta
							avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
							title={username}
							description={<div>
								<b>{region ? region : "全球"}</b>
								&nbsp;&nbsp;{roleName}
							</div>}
						/>
					</Card>
				</Col>
			</Row>
			{/* 下方柱图占位 */}
			<div ref={barRef} style={{
				'height': '400px',
			}}></div>
			{/* 侧边抽屉和饼图 */}
			<Drawer
				title="个人新闻分类"
				// size="large"
				width={600}
				placement="right"
				onClose={()=>setVisible(false)}
				visible={visible}
			>
				<div ref={peiRef}  style={{
					'height': '400px'
				}}>

				</div>
      </Drawer>
		</div>
	)
}

export default Home