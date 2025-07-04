'use client'

import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { 
  PageContainer, 
  DataTable, 
  SearchForm, 
  CommonActions,
  CommonSearchFields 
} from '../components'
import type { DataTableColumn } from '../components'

// 模拟数据类型
interface ListItem {
  id: string
  name: string
  email: string
  phone: string
  status: number
  role: string
  createdAt: string
  lastLoginAt: string
}

// 模拟API响应类型
interface ApiResponse {
  data: ListItem[]
  total: number
  current: number
  pageSize: number
}

// 模拟数据
const mockData: ListItem[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 1,
    role: 'admin',
    createdAt: '2023-01-15 10:30:00',
    lastLoginAt: '2023-12-01 14:30:00'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 1,
    role: 'user',
    createdAt: '2023-02-20 16:45:00',
    lastLoginAt: '2023-11-30 09:15:00'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 0,
    role: 'user',
    createdAt: '2023-03-10 08:20:00',
    lastLoginAt: '2023-11-25 18:45:00'
  }
]

const ListPage: React.FC = () => {
  const [data, setData] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
  })
  const [searchParams, setSearchParams] = useState<Record<string, any>>({})

  // 模拟API调用
  const fetchData = async (params: Record<string, any> = {}) => {
    setLoading(true)
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟搜索和分页
      let filteredData = [...mockData]
      
      // 关键词搜索
      if (params.keyword) {
        filteredData = filteredData.filter(item =>
          item.name.includes(params.keyword) ||
          item.email.includes(params.keyword) ||
          item.phone.includes(params.keyword)
        )
      }
      
      // 状态筛选
      if (params.status !== undefined && params.status !== '') {
        filteredData = filteredData.filter(item => item.status === params.status)
      }
      
      // 角色筛选
      if (params.role) {
        filteredData = filteredData.filter(item => item.role === params.role)
      }
      
      const total = filteredData.length
      const start = (params.current - 1) * params.pageSize
      const end = start + params.pageSize
      const pageData = filteredData.slice(start, end)
      
      setData(pageData)
      setPagination(prev => ({
        ...prev,
        total,
        current: params.current || 1
      }))
    } catch (error) {
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    fetchData({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchParams
    })
  }, [])

  // 搜索处理
  const handleSearch = (values: Record<string, any>) => {
    const params = {
      ...values,
      current: 1,
      pageSize: pagination.pageSize
    }
    setSearchParams(values)
    fetchData(params)
  }

  // 重置处理
  const handleReset = () => {
    setSearchParams({})
    fetchData({
      current: 1,
      pageSize: pagination.pageSize
    })
  }

  // 分页处理
  const handleTableChange = (page: number, pageSize: number) => {
    const params = {
      current: page,
      pageSize,
      ...searchParams
    }
    fetchData(params)
  }

  // 刷新数据
  const handleRefresh = () => {
    fetchData({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchParams
    })
  }

  // 新建处理
  const handleCreate = () => {
    message.info('跳转到新建页面')
    // router.push('/users/create')
  }

  // 导出处理
  const handleExport = () => {
    message.success('导出成功')
  }

  // 编辑处理
  const handleEdit = (record: ListItem) => {
    message.info(`编辑用户: ${record.name}`)
    // router.push(`/users/edit/${record.id}`)
  }

  // 删除处理
  const handleDelete = async (record: ListItem) => {
    try {
      // 模拟删除API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success('删除成功')
      handleRefresh()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 查看处理
  const handleView = (record: ListItem) => {
    message.info(`查看用户: ${record.name}`)
    // router.push(`/users/view/${record.id}`)
  }

  // 批量删除
  const handleBatchDelete = (selectedRows: ListItem[]) => {
    message.success(`批量删除 ${selectedRows.length} 条记录`)
  }

  // 搜索表单字段
  const searchFields = [
    CommonSearchFields.keyword('请输入姓名、邮箱或手机号'),
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      span: 6
    },
    {
      name: 'role',
      label: '角色',
      type: 'select' as const,
      options: [
        { label: '全部角色', value: '' },
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ],
      span: 6
    },
    CommonSearchFields.dateRange('dateRange', '创建时间')
  ]

  // 表格列定义
  const columns: DataTableColumn[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      sorter: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 140
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        const roleMap: Record<string, string> = {
          admin: '管理员',
          user: '普通用户'
        }
        return roleMap[role] || role
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <span className={status === 1 ? 'text-green-600' : 'text-red-600'}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: true
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 160
    }
  ]

  // 操作按钮
  const actions = [
    CommonActions.view(handleView),
    CommonActions.edit(handleEdit),
    CommonActions.delete(handleDelete)
  ]

  // 批量操作
  const batchActions = [
    {
      key: 'batchDelete',
      label: '批量删除',
      onClick: handleBatchDelete
    }
  ]

  return (
    <PageContainer
      title="用户管理"
      subtitle="管理系统用户信息"
      breadcrumbs={[
        { title: '系统管理' },
        { title: '用户管理' }
      ]}
    >
      <div className="space-y-4">
        {/* 搜索表单 */}
        <SearchForm
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* 数据表格 */}
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          actions={actions}
          batchActions={batchActions}
          pagination={{
            ...pagination,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange
          }}
          onRefresh={handleRefresh}
          onCreate={handleCreate}
          onExport={handleExport}
          onSearch={handleSearch}
          title="用户列表"
        />
      </div>
    </PageContainer>
  )
}

export default ListPage