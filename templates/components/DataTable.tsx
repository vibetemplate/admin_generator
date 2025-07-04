'use client'

import React, { useState } from 'react'
import {
  Table,
  Card,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Popconfirm,
  message
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'
import type { TableProps, ColumnsType } from 'antd/es/table'

const { RangePicker } = DatePicker
const { Option } = Select

export interface DataTableColumn {
  title: string
  dataIndex: string
  key: string
  width?: number
  sorter?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
}

export interface DataTableAction {
  key: string
  label: string
  icon?: React.ReactNode
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  danger?: boolean
  onClick: (record: any) => void
  permission?: string
}

interface DataTableProps {
  columns: DataTableColumn[]
  data: any[]
  loading?: boolean
  pagination?: TableProps<any>['pagination']
  rowSelection?: TableProps<any>['rowSelection']
  actions?: DataTableAction[]
  batchActions?: {
    key: string
    label: string
    icon?: React.ReactNode
    onClick: (selectedRows: any[]) => void
    permission?: string
  }[]
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  refreshable?: boolean
  creatable?: boolean
  onSearch?: (searchText: string) => void
  onFilter?: (filters: Record<string, any>) => void
  onRefresh?: () => void
  onCreate?: () => void
  onExport?: () => void
  title?: string
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  pagination,
  rowSelection,
  actions = [],
  batchActions = [],
  searchable = true,
  filterable = true,
  exportable = true,
  refreshable = true,
  creatable = true,
  onSearch,
  onFilter,
  onRefresh,
  onCreate,
  onExport,
  title = '数据列表'
}) => {
  const [searchText, setSearchText] = useState('')
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [filters, setFilters] = useState<Record<string, any>>({})

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value)
    onSearch?.(value)
  }

  // 处理筛选
  const handleFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter?.(newFilters)
  }

  // 构建表格列（包含操作列）
  const tableColumns: ColumnsType<any> = [
    ...columns.map(col => ({
      ...col,
      sorter: col.sorter,
      filterDropdown: col.filterable ? (
        <div className="p-2">
          <Input
            placeholder={`搜索 ${col.title}`}
            onChange={(e) => handleFilter(col.dataIndex, e.target.value)}
            className="w-48"
          />
        </div>
      ) : undefined
    })),
    ...(actions.length > 0 ? [{
      title: '操作',
      key: 'actions',
      width: actions.length * 60 + 40,
      render: (_, record: any) => (
        <Space size="small">
          {actions.map(action => (
            <Tooltip key={action.key} title={action.label}>
              {action.key === 'delete' ? (
                <Popconfirm
                  title="确认删除"
                  description="删除后无法恢复，确认删除吗？"
                  onConfirm={() => action.onClick(record)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type={action.type || 'text'}
                    icon={action.icon}
                    size="small"
                    danger={action.danger}
                  />
                </Popconfirm>
              ) : (
                <Button
                  type={action.type || 'text'}
                  icon={action.icon}
                  size="small"
                  danger={action.danger}
                  onClick={() => action.onClick(record)}
                />
              )}
            </Tooltip>
          ))}
        </Space>
      )
    }] : [])
  ]

  // 行选择配置
  const tableRowSelection = rowSelection || (batchActions.length > 0 ? {
    selectedRowKeys: selectedRows.map(row => row.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRows(selectedRows)
    }
  } : undefined)

  return (
    <Card title={title} className="w-full">
      {/* 工具栏 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {searchable && (
            <Input.Search
              placeholder="搜索..."
              allowClear
              style={{ width: 250 }}
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && handleSearch('')}
            />
          )}
          
          {filterable && (
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => handleFilter('dateRange', dates)}
            />
          )}
        </div>
        
        <Space>
          {/* 批量操作 */}
          {batchActions.length > 0 && selectedRows.length > 0 && (
            <>
              {batchActions.map(action => (
                <Button
                  key={action.key}
                  icon={action.icon}
                  onClick={() => {
                    action.onClick(selectedRows)
                    setSelectedRows([])
                  }}
                >
                  {action.label} ({selectedRows.length})
                </Button>
              ))}
            </>
          )}
          
          {refreshable && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            >
              刷新
            </Button>
          )}
          
          {exportable && (
            <Button
              icon={<ExportOutlined />}
              onClick={onExport}
            >
              导出
            </Button>
          )}
          
          {creatable && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
            >
              新建
            </Button>
          )}
        </Space>
      </div>
      
      {/* 数据表格 */}
      <Table
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        rowSelection={tableRowSelection}
        scroll={{ x: 'max-content' }}
        rowKey="id"
      />
    </Card>
  )
}

// 常用操作按钮预设
export const CommonActions = {
  view: (onClick: (record: any) => void): DataTableAction => ({
    key: 'view',
    label: '查看',
    icon: <EyeOutlined />,
    type: 'text',
    onClick
  }),
  
  edit: (onClick: (record: any) => void): DataTableAction => ({
    key: 'edit',
    label: '编辑',
    icon: <EditOutlined />,
    type: 'text',
    onClick
  }),
  
  delete: (onClick: (record: any) => void): DataTableAction => ({
    key: 'delete',
    label: '删除',
    icon: <DeleteOutlined />,
    type: 'text',
    danger: true,
    onClick
  })
}

export default DataTable