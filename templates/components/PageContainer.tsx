'use client'

import React from 'react'
import { Breadcrumb, Button, Space, Divider, Card } from 'antd'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: React.ReactNode
}

export interface PageAction {
  key: string
  label: string
  icon?: React.ReactNode
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  danger?: boolean
  loading?: boolean
  onClick: () => void
  permission?: string
}

interface PageContainerProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: PageAction[]
  showBack?: boolean
  backText?: string
  onBack?: () => void
  extra?: React.ReactNode
  children: React.ReactNode
  loading?: boolean
  className?: string
  contentStyle?: React.CSSProperties
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  showBack = false,
  backText = '返回',
  onBack,
  extra,
  children,
  loading = false,
  className = '',
  contentStyle = {}
}) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const renderBreadcrumb = () => {
    const defaultBreadcrumbs = [
      {
        title: '首页',
        href: '/dashboard',
        icon: <HomeOutlined />
      }
    ]

    const allBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs]

    return (
      <Breadcrumb className="mb-4">
        {allBreadcrumbs.map((item, index) => (
          <Breadcrumb.Item key={index} href={item.href}>
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  }

  const renderHeader = () => {
    const hasHeaderContent = title || subtitle || actions.length > 0 || showBack || extra

    if (!hasHeaderContent) return null

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showBack && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                className="mr-3"
              >
                {backText}
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 m-0">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 mt-1 mb-0">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {extra && (
              <div className="mr-4">
                {extra}
              </div>
            )}
            {actions.length > 0 && (
              <Space>
                {actions.map(action => (
                  <Button
                    key={action.key}
                    type={action.type || 'default'}
                    icon={action.icon}
                    danger={action.danger}
                    loading={action.loading}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </Space>
            )}
          </div>
        </div>
        <Divider className="mt-4 mb-0" />
      </div>
    )
  }

  return (
    <div className={`page-container ${className}`}>
      {breadcrumbs.length > 0 && renderBreadcrumb()}
      {renderHeader()}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  )
}

// 带卡片的页面容器
export const CardPageContainer: React.FC<PageContainerProps & {
  cardProps?: any
}> = ({ cardProps = {}, children, ...props }) => {
  return (
    <PageContainer {...props}>
      <Card loading={props.loading} {...cardProps}>
        {children}
      </Card>
    </PageContainer>
  )
}

// 简化的页面头部组件
export const PageHeader: React.FC<Pick<PageContainerProps, 
  'title' | 'subtitle' | 'actions' | 'showBack' | 'backText' | 'onBack' | 'extra'
>> = (props) => {
  return (
    <PageContainer {...props} breadcrumbs={[]}>
      <div />
    </PageContainer>
  )
}

export default PageContainer