'use client'

import React, { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Space } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout

interface AdminLayoutProps {
  children: React.ReactNode
  menuItems: MenuProps['items']
  user?: {
    name: string
    avatar?: string
    role: string
  }
  notifications?: number
  onMenuClick?: (key: string) => void
  onUserMenuClick?: (key: string) => void
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  menuItems,
  user,
  notifications = 0,
  onMenuClick,
  onUserMenuClick
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        className="bg-white shadow-sm"
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <div className="text-xl font-bold text-blue-600">
            {collapsed ? 'A' : 'Admin'}
          </div>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          onClick={({ key }) => onMenuClick?.(key)}
          className="border-none"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          
          <Space size="middle">
            <Badge count={notifications} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-lg"
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => onUserMenuClick?.(key)
              }}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer">
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  className="mr-2"
                />
                <div className="text-sm">
                  <div className="font-medium">{user?.name || '用户'}</div>
                  <div className="text-gray-500">{user?.role || '角色'}</div>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <Content className="p-6 bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout