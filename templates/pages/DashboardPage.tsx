'use client'

import React from 'react'
import { Row, Col, Card, Statistic, Progress, Table, List, Avatar } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { Line, Column, Pie } from '@ant-design/plots'

// 模拟数据
const statisticsData = [
  {
    title: '总用户数',
    value: 11928,
    prefix: <UserOutlined />,
    suffix: '人',
    valueStyle: { color: '#3f8600' },
    trend: { value: 12.5, isUp: true }
  },
  {
    title: '今日订单',
    value: 893,
    prefix: <ShoppingCartOutlined />,
    suffix: '单',
    valueStyle: { color: '#1890ff' },
    trend: { value: 8.2, isUp: true }
  },
  {
    title: '今日收入',
    value: 38672,
    prefix: <DollarCircleOutlined />,
    suffix: '元',
    valueStyle: { color: '#cf1322' },
    trend: { value: 2.3, isUp: false }
  },
  {
    title: '访问量',
    value: 56789,
    prefix: <EyeOutlined />,
    suffix: '次',
    valueStyle: { color: '#722ed1' },
    trend: { value: 15.8, isUp: true }
  }
]

const salesData = [
  { month: '1月', sales: 3800 },
  { month: '2月', sales: 4200 },
  { month: '3月', sales: 3600 },
  { month: '4月', sales: 4800 },
  { month: '5月', sales: 5200 },
  { month: '6月', sales: 4900 }
]

const categoryData = [
  { type: '电子产品', value: 35 },
  { type: '服装鞋帽', value: 25 },
  { type: '家居用品', value: 20 },
  { type: '图书音像', value: 12 },
  { type: '其他', value: 8 }
]

const recentOrders = [
  {
    id: '1',
    orderNo: 'ORD20231201001',
    customer: '张三',
    amount: 299.00,
    status: '已完成',
    time: '2023-12-01 14:30'
  },
  {
    id: '2',
    orderNo: 'ORD20231201002',
    customer: '李四',
    amount: 1299.00,
    status: '处理中',
    time: '2023-12-01 13:45'
  },
  {
    id: '3',
    orderNo: 'ORD20231201003',
    customer: '王五',
    amount: 599.00,
    status: '已发货',
    time: '2023-12-01 12:20'
  }
]

const notifications = [
  {
    id: '1',
    title: '新用户注册',
    description: '用户"新用户001"完成注册',
    time: '5分钟前',
    avatar: <UserOutlined />
  },
  {
    id: '2',
    title: '订单提醒',
    description: '订单ORD20231201004待处理',
    time: '10分钟前',
    avatar: <ShoppingCartOutlined />
  },
  {
    id: '3',
    title: '库存预警',
    description: '商品"iPhone 15"库存不足',
    time: '30分钟前',
    avatar: <RiseOutlined />
  }
]

const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo'
  },
  {
    title: '客户',
    dataIndex: 'customer',
    key: 'customer'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => `¥${amount.toFixed(2)}`
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusColors: Record<string, string> = {
        '已完成': 'text-green-600',
        '处理中': 'text-blue-600',
        '已发货': 'text-orange-600'
      }
      return <span className={statusColors[status] || 'text-gray-600'}>{status}</span>
    }
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time'
  }
]

const DashboardPage: React.FC = () => {
  // 销售趋势图配置
  const salesConfig = {
    data: salesData,
    xField: 'month',
    yField: 'sales',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond'
    },
    label: {
      style: {
        fill: '#aaa'
      }
    }
  }

  // 分类占比图配置
  const categoryConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}'
    },
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* 数据统计卡片 */}
      <Row gutter={[16, 16]}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={stat.valueStyle}
              />
              <div className="mt-2 flex items-center">
                {stat.trend.isUp ? (
                  <RiseOutlined className="text-green-500 mr-1" />
                ) : (
                  <FallOutlined className="text-red-500 mr-1" />
                )}
                <span className={stat.trend.isUp ? 'text-green-500' : 'text-red-500'}>
                  {stat.trend.value}%
                </span>
                <span className="text-gray-500 ml-1">vs 昨日</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="销售趋势" className="h-96">
            <Line {...salesConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="销售分类" className="h-96">
            <Pie {...categoryConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格和通知 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="最近订单" 
            extra={<a href="/orders">查看全部</a>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="系统通知">
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.avatar} />}
                    title={item.title}
                    description={
                      <div>
                        <div>{item.description}</div>
                        <div className="text-gray-400 text-xs mt-1">{item.time}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 进度指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card title="本月目标完成度">
            <Progress
              type="circle"
              percent={75}
              strokeColor="#52c41a"
              size={120}
            />
            <div className="text-center mt-4">
              <div className="text-lg font-semibold">75%</div>
              <div className="text-gray-500">目标：10万元</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="客户满意度">
            <Progress
              type="circle"
              percent={92}
              strokeColor="#1890ff"
              size={120}
            />
            <div className="text-center mt-4">
              <div className="text-lg font-semibold">92%</div>
              <div className="text-gray-500">较上月 +3%</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="库存周转率">
            <Progress
              type="circle"
              percent={68}
              strokeColor="#faad14"
              size={120}
            />
            <div className="text-center mt-4">
              <div className="text-lg font-semibold">68%</div>
              <div className="text-gray-500">需要关注</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage