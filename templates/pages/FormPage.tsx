'use client'

import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useRouter, useParams } from 'next/navigation'
import { 
  PageContainer, 
  FormBuilder, 
  CommonFields 
} from '../components'
import type { FormField } from '../components'

// 模拟数据类型
interface FormData {
  name: string
  email: string
  phone: string
  role: string
  status: number
  avatar: any[]
  department: string
  position: string
  address: string
  description: string
  permissions: string[]
  settings: {
    emailNotification: boolean
    smsNotification: boolean
  }
}

const FormPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const isEdit = !!params?.id
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({})

  // 模拟获取编辑数据
  const fetchData = async (id: string) => {
    setLoading(true)
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟API响应
      const mockData: FormData = {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        role: 'admin',
        status: 1,
        avatar: [],
        department: 'tech',
        position: 'developer',
        address: '北京市朝阳区xxx街道xxx号',
        description: '这是一个测试用户的描述信息',
        permissions: ['user:view', 'user:create'],
        settings: {
          emailNotification: true,
          smsNotification: false
        }
      }
      
      setInitialValues(mockData)
    } catch (error) {
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    if (isEdit && params?.id) {
      fetchData(params.id as string)
    }
  }, [isEdit, params?.id])

  // 提交处理
  const handleSubmit = async (values: FormData) => {
    setSubmitLoading(true)
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('提交的数据:', values)
      
      message.success(isEdit ? '更新成功' : '创建成功')
      
      // 跳转回列表页
      router.push('/users')
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  // 提交失败处理
  const handleSubmitFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo)
    message.error('请检查表单填写是否正确')
  }

  // 返回处理
  const handleBack = () => {
    router.push('/users')
  }

  // 表单字段定义
  const formFields: FormField[] = [
    // 基础信息分组
    CommonFields.divider('基础信息'),
    {
      name: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      span: 12,
      rules: [
        { required: true, message: '请输入姓名' },
        { min: 2, max: 20, message: '姓名长度为2-20个字符' }
      ]
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
      span: 12,
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入有效的邮箱地址' }
      ]
    },
    {
      name: 'phone',
      label: '手机号',
      type: 'input',
      required: true,
      span: 12,
      rules: [
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
      ]
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ]
    },
    CommonFields.status([
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]),
    CommonFields.avatar(),

    // 工作信息分组
    CommonFields.divider('工作信息'),
    {
      name: 'department',
      label: '部门',
      type: 'select',
      span: 12,
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '销售部', value: 'sales' }
      ]
    },
    {
      name: 'position',
      label: '职位',
      type: 'input',
      span: 12,
      placeholder: '请输入职位'
    },
    {
      name: 'address',
      label: '办公地址',
      type: 'textarea',
      rows: 3,
      placeholder: '请输入办公地址'
    },
    CommonFields.description(),

    // 权限设置分组
    CommonFields.divider('权限设置'),
    {
      name: 'permissions',
      label: '权限',
      type: 'checkbox',
      options: [
        { label: '查看用户', value: 'user:view' },
        { label: '创建用户', value: 'user:create' },
        { label: '编辑用户', value: 'user:edit' },
        { label: '删除用户', value: 'user:delete' },
        { label: '查看订单', value: 'order:view' },
        { label: '处理订单', value: 'order:process' }
      ]
    },

    // 通知设置分组
    CommonFields.divider('通知设置'),
    {
      name: ['settings', 'emailNotification'],
      label: '邮件通知',
      type: 'switch',
      span: 12,
      extra: '接收系统邮件通知'
    },
    {
      name: ['settings', 'smsNotification'],
      label: '短信通知',
      type: 'switch',
      span: 12,
      extra: '接收系统短信通知'
    }
  ]

  // 页面操作按钮
  const pageActions = [
    {
      key: 'save',
      label: isEdit ? '保存修改' : '创建用户',
      type: 'primary' as const,
      loading: submitLoading,
      onClick: () => {
        // 这个会被表单的提交按钮处理
      }
    }
  ]

  return (
    <PageContainer
      title={isEdit ? '编辑用户' : '新建用户'}
      subtitle={isEdit ? '修改用户信息' : '创建新的用户账户'}
      breadcrumbs={[
        { title: '系统管理' },
        { title: '用户管理', href: '/users' },
        { title: isEdit ? '编辑用户' : '新建用户' }
      ]}
      showBack
      onBack={handleBack}
      loading={loading}
    >
      <FormBuilder
        fields={formFields}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        loading={submitLoading}
        initialValues={initialValues}
        submitText={isEdit ? '保存修改' : '创建用户'}
        title={isEdit ? '用户信息' : '新建用户'}
        cardProps={{
          className: 'max-w-4xl mx-auto'
        }}
      />
    </PageContainer>
  )
}

export default FormPage