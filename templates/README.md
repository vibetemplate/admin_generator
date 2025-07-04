# 后台管理系统组件模板库

这个目录包含了用于构建后台管理系统的React组件模板。这些组件基于Ant Design和TailwindCSS，提供了完整的管理后台UI解决方案。

## 📦 组件目录

### 布局组件

#### AdminLayout
完整的管理后台布局组件，包含侧边栏、顶部导航、用户信息等。

**特性：**
- 可折叠侧边栏
- 用户下拉菜单
- 通知徽章
- 响应式设计

**使用示例：**
```tsx
import { AdminLayout } from '@/components'

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表板'
  }
]

function App() {
  return (
    <AdminLayout
      menuItems={menuItems}
      user={{ name: '张三', role: '管理员' }}
      notifications={5}
      onMenuClick={(key) => console.log(key)}
    >
      <div>页面内容</div>
    </AdminLayout>
  )
}
```

#### PageContainer
页面容器组件，提供面包屑、页面标题、操作按钮等。

**特性：**
- 面包屑导航
- 页面标题和副标题
- 操作按钮区域
- 返回按钮

**使用示例：**
```tsx
import { PageContainer } from '@/components'

function UserList() {
  return (
    <PageContainer
      title="用户管理"
      subtitle="管理系统用户信息"
      breadcrumbs={[
        { title: '系统管理' },
        { title: '用户管理' }
      ]}
      actions={[
        {
          key: 'create',
          label: '新建用户',
          type: 'primary',
          onClick: () => {}
        }
      ]}
    >
      <div>用户列表内容</div>
    </PageContainer>
  )
}
```

### 数据组件

#### DataTable
高级数据表格组件，支持搜索、筛选、排序、分页、批量操作等。

**特性：**
- 内置搜索框
- 列筛选器
- 行选择和批量操作
- 操作按钮列
- 导出功能
- 刷新按钮

**使用示例：**
```tsx
import { DataTable, CommonActions } from '@/components'

function UserList() {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' }
  ]

  const actions = [
    CommonActions.edit((record) => console.log('编辑', record)),
    CommonActions.delete((record) => console.log('删除', record))
  ]

  return (
    <DataTable
      columns={columns}
      data={userData}
      actions={actions}
      onSearch={(text) => console.log('搜索', text)}
      onCreate={() => console.log('新建')}
    />
  )
}
```

#### SearchForm
搜索表单组件，支持多种字段类型和展开收起功能。

**特性：**
- 多种字段类型
- 展开/收起功能
- 自动过滤空值
- 预设常用字段

**使用示例：**
```tsx
import { SearchForm, CommonSearchFields } from '@/components'

function UserSearch() {
  const fields = [
    CommonSearchFields.keyword('请输入用户名'),
    CommonSearchFields.status(),
    CommonSearchFields.dateRange('createTime', '注册时间')
  ]

  return (
    <SearchForm
      fields={fields}
      onSearch={(values) => console.log('搜索条件', values)}
      onReset={() => console.log('重置')}
    />
  )
}
```

### 表单组件

#### FormBuilder
动态表单构建器，支持多种字段类型和验证规则。

**特性：**
- 20+ 种字段类型
- 表单验证
- 栅格布局
- 依赖字段
- 预设常用字段

**使用示例：**
```tsx
import { FormBuilder, CommonFields } from '@/components'

function UserForm() {
  const fields = [
    CommonFields.name(),
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
      rules: [
        { type: 'email', message: '请输入有效的邮箱地址' }
      ]
    },
    CommonFields.status(),
    CommonFields.description()
  ]

  return (
    <FormBuilder
      fields={fields}
      onFinish={(values) => console.log('提交', values)}
      title="用户信息"
      loading={false}
    />
  )
}
```

## 🎨 样式定制

所有组件都基于Ant Design主题系统，可以通过修改主题配置来定制样式：

```tsx
import { ConfigProvider } from 'antd'

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      {/* 你的应用 */}
    </ConfigProvider>
  )
}
```

## 🔧 类型定义

### DataTableColumn
```tsx
interface DataTableColumn {
  title: string
  dataIndex: string
  key: string
  width?: number
  sorter?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
}
```

### FormField
```tsx
interface FormField {
  name: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'date' | ... // 20+ 种类型
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: FormFieldOption[]
  rules?: any[]
  span?: number
  dependencies?: string[]
  hidden?: boolean
}
```

### SearchFormField
```tsx
interface SearchFormField {
  name: string
  label: string
  type: 'input' | 'select' | 'dateRange' | 'date'
  placeholder?: string
  options?: { label: string; value: any }[]
  span?: number
  allowClear?: boolean
}
```

## 📝 最佳实践

### 1. 权限控制
```tsx
// 在组件中检查权限
const hasPermission = (permission: string) => {
  return userPermissions.includes(permission)
}

const actions = [
  ...(hasPermission('user:edit') ? [CommonActions.edit(handleEdit)] : []),
  ...(hasPermission('user:delete') ? [CommonActions.delete(handleDelete)] : [])
]
```

### 2. 状态管理
```tsx
// 使用 React Query 管理数据状态
const { data, loading, refetch } = useQuery({
  queryKey: ['users', searchParams],
  queryFn: () => fetchUsers(searchParams)
})

<DataTable
  data={data}
  loading={loading}
  onRefresh={refetch}
/>
```

### 3. 错误处理
```tsx
// 统一错误处理
const handleAction = async (action: () => Promise<void>) => {
  try {
    await action()
    message.success('操作成功')
  } catch (error) {
    message.error('操作失败：' + error.message)
  }
}
```

### 4. 响应式设计
```tsx
// 根据屏幕大小调整列布局
const getSpan = (size: 'xs' | 'sm' | 'md' | 'lg') => {
  const spanMap = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6
  }
  return spanMap[size] || 24
}
```

## 🚀 快速开始

1. **安装依赖**
```bash
npm install antd @ant-design/icons tailwindcss
```

2. **复制组件**
将 `components` 目录复制到你的项目中

3. **配置样式**
在你的项目中配置 Ant Design 和 TailwindCSS

4. **开始使用**
```tsx
import { AdminLayout, DataTable, FormBuilder } from '@/components'
```

## 📖 更多资源

- [Ant Design 官方文档](https://ant.design/)
- [TailwindCSS 官方文档](https://tailwindcss.com/)
- [React Hook Form 文档](https://react-hook-form.com/)
- [项目配置规范](../ADMIN-SPEC.md)