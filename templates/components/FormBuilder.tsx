'use client'

import React from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Upload,
  Button,
  Card,
  Row,
  Col,
  Divider
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { FormProps, UploadProps } from 'antd'

const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

export interface FormFieldOption {
  label: string
  value: any
  disabled?: boolean
}

export interface FormField {
  name: string
  label: string
  type: 
    | 'input'
    | 'textarea'
    | 'password'
    | 'number'
    | 'select'
    | 'multiSelect'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'dateRange'
    | 'time'
    | 'upload'
    | 'divider'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: FormFieldOption[]
  rules?: any[]
  span?: number
  dependencies?: string[]
  hidden?: boolean
  extra?: string
  tooltip?: string
  uploadProps?: UploadProps
  min?: number
  max?: number
  rows?: number
  format?: string
  showTime?: boolean
}

interface FormBuilderProps extends FormProps {
  fields: FormField[]
  loading?: boolean
  onFinish: (values: any) => void
  onFinishFailed?: (errorInfo: any) => void
  submitText?: string
  resetText?: string
  showReset?: boolean
  submitButtonProps?: any
  resetButtonProps?: any
  cardProps?: any
  title?: string
  initialValues?: Record<string, any>
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  loading = false,
  onFinish,
  onFinishFailed,
  submitText = '提交',
  resetText = '重置',
  showReset = true,
  submitButtonProps = {},
  resetButtonProps = {},
  cardProps = {},
  title,
  initialValues,
  ...formProps
}) => {
  const [form] = Form.useForm()

  const renderField = (field: FormField) => {
    if (field.hidden) return null

    // 分割线特殊处理
    if (field.type === 'divider') {
      return (
        <Col span={24} key={field.name}>
          <Divider orientation="left">{field.label}</Divider>
        </Col>
      )
    }

    const baseProps = {
      placeholder: field.placeholder,
      disabled: field.disabled
    }

    let component: React.ReactNode

    switch (field.type) {
      case 'input':
        component = <Input {...baseProps} />
        break

      case 'textarea':
        component = (
          <TextArea
            {...baseProps}
            rows={field.rows || 4}
            maxLength={field.max}
            showCount={!!field.max}
          />
        )
        break

      case 'password':
        component = <Input.Password {...baseProps} />
        break

      case 'number':
        component = (
          <InputNumber
            {...baseProps}
            min={field.min}
            max={field.max}
            style={{ width: '100%' }}
          />
        )
        break

      case 'select':
        component = (
          <Select {...baseProps} allowClear>
            {field.options?.map(option => (
              <Option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        )
        break

      case 'multiSelect':
        component = (
          <Select {...baseProps} mode="multiple" allowClear>
            {field.options?.map(option => (
              <Option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        )
        break

      case 'radio':
        component = (
          <Radio.Group>
            {field.options?.map(option => (
              <Radio
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        )
        break

      case 'checkbox':
        component = (
          <Checkbox.Group>
            {field.options?.map(option => (
              <Checkbox
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )
        break

      case 'switch':
        component = <Switch />
        break

      case 'date':
        component = (
          <DatePicker
            {...baseProps}
            format={field.format || 'YYYY-MM-DD'}
            showTime={field.showTime}
            style={{ width: '100%' }}
          />
        )
        break

      case 'dateRange':
        component = (
          <RangePicker
            {...baseProps}
            format={field.format || 'YYYY-MM-DD'}
            showTime={field.showTime}
            style={{ width: '100%' }}
          />
        )
        break

      case 'time':
        component = (
          <TimePicker
            {...baseProps}
            format={field.format || 'HH:mm:ss'}
            style={{ width: '100%' }}
          />
        )
        break

      case 'upload':
        component = (
          <Upload {...field.uploadProps}>
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
        )
        break

      default:
        component = <Input {...baseProps} />
    }

    return (
      <Col span={field.span || 24} key={field.name}>
        <Form.Item
          name={field.name}
          label={field.label}
          rules={field.rules || (field.required ? [{ required: true, message: `请输入${field.label}` }] : [])}
          dependencies={field.dependencies}
          extra={field.extra}
          tooltip={field.tooltip}
        >
          {component}
        </Form.Item>
      </Col>
    )
  }

  const content = (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      {...formProps}
    >
      <Row gutter={16}>
        {fields.map(renderField)}
      </Row>

      <Row justify="end" className="mt-6">
        <Col>
          <div className="flex gap-2">
            {showReset && (
              <Button
                onClick={() => form.resetFields()}
                {...resetButtonProps}
              >
                {resetText}
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              {...submitButtonProps}
            >
              {submitText}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  )

  return title ? (
    <Card title={title} {...cardProps}>
      {content}
    </Card>
  ) : (
    content
  )
}

// 常用字段预设
export const CommonFields = {
  // 基础字段
  name: (required = true): FormField => ({
    name: 'name',
    label: '名称',
    type: 'input',
    required,
    span: 12
  }),

  description: (required = false): FormField => ({
    name: 'description',
    label: '描述',
    type: 'textarea',
    required,
    rows: 4
  }),

  status: (options = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ]): FormField => ({
    name: 'status',
    label: '状态',
    type: 'select',
    options,
    span: 12
  }),

  // 日期字段
  createdAt: (): FormField => ({
    name: 'createdAt',
    label: '创建时间',
    type: 'dateRange',
    span: 12
  }),

  // 文件上传
  avatar: (): FormField => ({
    name: 'avatar',
    label: '头像',
    type: 'upload',
    uploadProps: {
      listType: 'picture-card',
      maxCount: 1,
      accept: 'image/*'
    },
    span: 12
  }),

  // 分割线
  divider: (label: string): FormField => ({
    name: `divider_${Date.now()}`,
    label,
    type: 'divider'
  })
}

export default FormBuilder