'use client'

import React, { useState } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Space
} from 'antd'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import type { FormProps } from 'antd'

const { Option } = Select
const { RangePicker } = DatePicker

export interface SearchFormField {
  name: string
  label: string
  type: 'input' | 'select' | 'dateRange' | 'date'
  placeholder?: string
  options?: { label: string; value: any }[]
  span?: number
  allowClear?: boolean
}

interface SearchFormProps extends Omit<FormProps, 'onFinish'> {
  fields: SearchFormField[]
  onSearch: (values: Record<string, any>) => void
  onReset?: () => void
  loading?: boolean
  collapsed?: boolean
  showCollapse?: boolean
  maxVisibleFields?: number
  extra?: React.ReactNode
}

const SearchForm: React.FC<SearchFormProps> = ({
  fields,
  onSearch,
  onReset,
  loading = false,
  collapsed: controlledCollapsed,
  showCollapse = true,
  maxVisibleFields = 3,
  extra,
  ...formProps
}) => {
  const [form] = Form.useForm()
  const [internalCollapsed, setInternalCollapsed] = useState(true)
  
  const collapsed = controlledCollapsed ?? internalCollapsed
  const shouldShowCollapse = showCollapse && fields.length > maxVisibleFields

  const handleFinish = (values: Record<string, any>) => {
    // 过滤空值
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)
    
    onSearch(filteredValues)
  }

  const handleReset = () => {
    form.resetFields()
    onReset?.()
    onSearch({})
  }

  const toggleCollapsed = () => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(!internalCollapsed)
    }
  }

  const renderField = (field: SearchFormField) => {
    const baseProps = {
      placeholder: field.placeholder || `请选择${field.label}`,
      allowClear: field.allowClear ?? true
    }

    let component: React.ReactNode

    switch (field.type) {
      case 'input':
        component = (
          <Input
            {...baseProps}
            placeholder={field.placeholder || `请输入${field.label}`}
          />
        )
        break

      case 'select':
        component = (
          <Select {...baseProps}>
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )
        break

      case 'date':
        component = (
          <DatePicker
            {...baseProps}
            style={{ width: '100%' }}
          />
        )
        break

      case 'dateRange':
        component = (
          <RangePicker
            {...baseProps}
            style={{ width: '100%' }}
          />
        )
        break

      default:
        component = <Input {...baseProps} />
    }

    return (
      <Col
        key={field.name}
        span={field.span || 8}
        style={{
          display: shouldShowCollapse && collapsed
            ? fields.indexOf(field) >= maxVisibleFields ? 'none' : 'block'
            : 'block'
        }}
      >
        <Form.Item
          name={field.name}
          label={field.label}
          style={{ marginBottom: 16 }}
        >
          {component}
        </Form.Item>
      </Col>
    )
  }

  return (
    <Card className="mb-4">
      <Form
        form={form}
        onFinish={handleFinish}
        {...formProps}
      >
        <Row gutter={24}>
          {fields.map(renderField)}
          
          <Col
            span={8}
            style={{
              display: shouldShowCollapse && collapsed && fields.length > maxVisibleFields
                ? 'none'
                : 'block'
            }}
          >
            <Form.Item style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                {shouldShowCollapse && (
                  <Button
                    type="link"
                    onClick={toggleCollapsed}
                    style={{ padding: 0 }}
                  >
                    {collapsed ? '展开' : '收起'}
                    {collapsed ? <DownOutlined /> : <UpOutlined />}
                  </Button>
                )}
                {extra}
              </Space>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 展开状态下的额外操作区域 */}
        {shouldShowCollapse && !collapsed && (
          <Row justify="end">
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button
                  type="link"
                  onClick={toggleCollapsed}
                  style={{ padding: 0 }}
                >
                  收起
                  <UpOutlined />
                </Button>
                {extra}
              </Space>
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  )
}

// 常用搜索字段预设
export const CommonSearchFields = {
  keyword: (placeholder = '请输入关键词'): SearchFormField => ({
    name: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder,
    span: 8
  }),

  status: (options = [
    { label: '全部', value: '' },
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ]): SearchFormField => ({
    name: 'status',
    label: '状态',
    type: 'select',
    options,
    span: 6
  }),

  dateRange: (name = 'dateRange', label = '日期范围'): SearchFormField => ({
    name,
    label,
    type: 'dateRange',
    span: 10
  }),

  category: (options: { label: string; value: any }[]): SearchFormField => ({
    name: 'categoryId',
    label: '分类',
    type: 'select',
    options: [{ label: '全部分类', value: '' }, ...options],
    span: 6
  }),

  user: (options: { label: string; value: any }[]): SearchFormField => ({
    name: 'userId',
    label: '用户',
    type: 'select',
    options: [{ label: '全部用户', value: '' }, ...options],
    span: 6
  })
}

export default SearchForm