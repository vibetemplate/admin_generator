# 后台管理系统配置规范

本文档定义了后台管理系统生成器的配置规范，用于生成基于Ant Design + React + Next.js + TailwindCSS的现代化管理后台。

## 配置文件结构

配置文件采用JSON格式，命名为 `admin-config.json`。主要包含以下几个部分：

1. **project** - 项目基础信息
2. **ui** - 用户界面配置
3. **features** - 功能特性配置
4. **modules** - 功能模块配置
5. **permissions** - 权限系统配置
6. **api** - API接口配置
7. **database** - 数据库配置
8. **deployment** - 部署配置

## 完整配置示例

```json
{
  "project": {
    "name": "AdminSystem",
    "displayName": "管理后台系统",
    "version": "1.0.0",
    "description": "现代化企业级管理后台系统",
    "author": "开发团队",
    "homepage": "https://admin.example.com",
    "keywords": ["admin", "management", "dashboard", "react", "nextjs"],
    "license": "MIT"
  },
  "ui": {
    "theme": {
      "name": "default",
      "primaryColor": "#1890ff",
      "errorColor": "#ff4d4f",
      "warningColor": "#faad14",
      "successColor": "#52c41a",
      "infoColor": "#1890ff",
      "borderRadius": 6,
      "fontSize": 14
    },
    "layout": {
      "type": "side",
      "fixedHeader": true,
      "fixedSidebar": true,
      "colorWeak": false,
      "multiTab": true,
      "splitMenus": false
    },
    "darkMode": {
      "enabled": true,
      "defaultMode": "light",
      "storageKey": "theme-mode"
    },
    "responsive": {
      "enabled": true,
      "breakpoints": {
        "xs": 480,
        "sm": 576,
        "md": 768,
        "lg": 992,
        "xl": 1200,
        "xxl": 1600
      }
    },
    "watermark": {
      "enabled": false,
      "content": "内部系统",
      "fontSize": 16,
      "opacity": 0.15
    }
  },
  "features": {
    "auth": {
      "enabled": true,
      "provider": "nextauth",
      "strategy": "jwt",
      "sessionTimeout": 7200,
      "multiDevice": true,
      "socialLogin": {
        "google": true,
        "github": false,
        "wechat": false
      }
    },
    "permissions": {
      "enabled": true,
      "type": "rbac",
      "granularity": "route",
      "dynamicRoutes": true,
      "buttonLevel": true
    },
    "i18n": {
      "enabled": true,
      "defaultLocale": "zh-CN",
      "locales": ["zh-CN", "en-US", "ja-JP"],
      "fallbackLocale": "zh-CN",
      "detectBrowserLanguage": true
    },
    "analytics": {
      "enabled": true,
      "provider": "custom",
      "trackPageView": true,
      "trackUserAction": true,
      "trackError": true
    },
    "notifications": {
      "enabled": true,
      "realtime": true,
      "types": ["success", "info", "warning", "error"],
      "position": "topRight",
      "maxCount": 10
    },
    "export": {
      "enabled": true,
      "formats": ["excel", "csv", "pdf"],
      "maxRecords": 10000
    },
    "upload": {
      "enabled": true,
      "maxSize": "10MB",
      "allowedTypes": ["image/*", "application/pdf", ".xlsx", ".docx"],
      "storage": "oss"
    },
    "cache": {
      "enabled": true,
      "provider": "localStorage",
      "ttl": 3600,
      "prefix": "admin_cache_"
    }
  },
  "modules": [
    {
      "name": "dashboard",
      "title": "仪表板",
      "icon": "DashboardOutlined",
      "path": "/dashboard",
      "component": "Dashboard",
      "permissions": ["dashboard:view"],
      "cache": true,
      "children": []
    },
    {
      "name": "system",
      "title": "系统管理",
      "icon": "SettingOutlined",
      "path": "/system",
      "permissions": ["system:view"],
      "children": [
        {
          "name": "users",
          "title": "用户管理",
          "icon": "UserOutlined",
          "path": "/system/users",
          "component": "UserManagement",
          "permissions": ["system:user:view"],
          "actions": [
            {
              "name": "create",
              "title": "新增",
              "permission": "system:user:create"
            },
            {
              "name": "edit",
              "title": "编辑",
              "permission": "system:user:edit"
            },
            {
              "name": "delete",
              "title": "删除",
              "permission": "system:user:delete"
            }
          ]
        },
        {
          "name": "roles",
          "title": "角色管理",
          "icon": "TeamOutlined",
          "path": "/system/roles",
          "component": "RoleManagement",
          "permissions": ["system:role:view"]
        },
        {
          "name": "permissions",
          "title": "权限管理",
          "icon": "SafetyCertificateOutlined",
          "path": "/system/permissions",
          "component": "PermissionManagement",
          "permissions": ["system:permission:view"]
        }
      ]
    },
    {
      "name": "content",
      "title": "内容管理",
      "icon": "FileTextOutlined",
      "path": "/content",
      "permissions": ["content:view"],
      "children": [
        {
          "name": "articles",
          "title": "文章管理",
          "icon": "EditOutlined",
          "path": "/content/articles",
          "component": "ArticleManagement",
          "permissions": ["content:article:view"]
        },
        {
          "name": "categories",
          "title": "分类管理",
          "icon": "AppstoreOutlined",
          "path": "/content/categories",
          "component": "CategoryManagement",
          "permissions": ["content:category:view"]
        }
      ]
    }
  ],
  "permissions": {
    "roles": [
      {
        "id": "admin",
        "name": "超级管理员",
        "description": "拥有所有权限",
        "permissions": ["*"]
      },
      {
        "id": "manager",
        "name": "管理员",
        "description": "拥有大部分管理权限",
        "permissions": [
          "dashboard:view",
          "system:user:*",
          "system:role:view",
          "content:*"
        ]
      },
      {
        "id": "operator",
        "name": "操作员",
        "description": "拥有基础操作权限",
        "permissions": [
          "dashboard:view",
          "content:article:view",
          "content:article:create",
          "content:article:edit"
        ]
      }
    ],
    "resources": [
      {
        "id": "dashboard",
        "name": "仪表板",
        "actions": ["view"]
      },
      {
        "id": "system",
        "name": "系统管理",
        "actions": ["view"],
        "children": [
          {
            "id": "user",
            "name": "用户管理",
            "actions": ["view", "create", "edit", "delete", "export"]
          },
          {
            "id": "role",
            "name": "角色管理",
            "actions": ["view", "create", "edit", "delete"]
          },
          {
            "id": "permission",
            "name": "权限管理",
            "actions": ["view", "edit"]
          }
        ]
      },
      {
        "id": "content",
        "name": "内容管理",
        "actions": ["view"],
        "children": [
          {
            "id": "article",
            "name": "文章管理",
            "actions": ["view", "create", "edit", "delete", "publish"]
          },
          {
            "id": "category",
            "name": "分类管理",
            "actions": ["view", "create", "edit", "delete"]
          }
        ]
      }
    ]
  },
  "api": {
    "baseURL": "https://api.example.com",
    "timeout": 10000,
    "retries": 3,
    "version": "v1",
    "prefix": "/api",
    "auth": {
      "type": "bearer",
      "headerName": "Authorization",
      "tokenPrefix": "Bearer "
    },
    "interceptors": {
      "request": true,
      "response": true,
      "error": true
    },
    "mock": {
      "enabled": true,
      "delay": 1000,
      "baseURL": "/api/mock"
    }
  },
  "database": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": "admin_system",
    "username": "admin",
    "pool": {
      "min": 2,
      "max": 10
    },
    "migrations": {
      "enabled": true,
      "directory": "migrations"
    },
    "seeds": {
      "enabled": true,
      "directory": "seeds"
    }
  },
  "deployment": {
    "environment": "production",
    "baseURL": "https://admin.example.com",
    "cdn": {
      "enabled": true,
      "domain": "https://cdn.example.com"
    },
    "ssl": {
      "enabled": true,
      "forceHTTPS": true
    },
    "compression": {
      "enabled": true,
      "level": 6
    },
    "monitoring": {
      "enabled": true,
      "errorTracking": true,
      "performanceMonitoring": true
    }
  },
  "development": {
    "port": 3000,
    "host": "localhost",
    "https": false,
    "proxy": {
      "/api": {
        "target": "http://localhost:8080",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    },
    "devTools": {
      "enabled": true,
      "redux": true,
      "reactQuery": true
    }
  },
  "build": {
    "outputPath": "dist",
    "publicPath": "/",
    "sourcemap": false,
    "minify": true,
    "extractCSS": true,
    "bundleAnalyzer": false,
    "optimization": {
      "splitChunks": true,
      "runtimeChunk": true,
      "usedExports": true,
      "sideEffects": false
    }
  },
  "testing": {
    "unit": {
      "enabled": true,
      "framework": "jest",
      "coverage": true,
      "threshold": 80
    },
    "e2e": {
      "enabled": false,
      "framework": "playwright",
      "baseURL": "http://localhost:3000"
    }
  }
}
```

## 配置字段说明

### project (必需)
项目基础信息配置

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | string | 是 | - | 项目名称（英文，用于包名） |
| displayName | string | 是 | - | 项目显示名称 |
| version | string | 是 | "1.0.0" | 项目版本号 |
| description | string | 否 | - | 项目描述 |
| author | string | 否 | - | 作者信息 |
| homepage | string | 否 | - | 项目主页 |
| keywords | array | 否 | [] | 关键词 |
| license | string | 否 | "MIT" | 许可证 |

### ui (必需)
用户界面配置

#### theme
| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | string | 否 | "default" | 主题名称 |
| primaryColor | string | 否 | "#1890ff" | 主色调 |
| errorColor | string | 否 | "#ff4d4f" | 错误色 |
| warningColor | string | 否 | "#faad14" | 警告色 |
| successColor | string | 否 | "#52c41a" | 成功色 |
| infoColor | string | 否 | "#1890ff" | 信息色 |
| borderRadius | number | 否 | 6 | 圆角大小 |
| fontSize | number | 否 | 14 | 基础字体大小 |

#### layout
| 字段 | 类型 | 必需 | 默认值 | 可选值 | 说明 |
|------|------|------|--------|--------|------|
| type | string | 否 | "side" | "side", "top", "mix" | 布局类型 |
| fixedHeader | boolean | 否 | true | - | 固定头部 |
| fixedSidebar | boolean | 否 | true | - | 固定侧边栏 |
| colorWeak | boolean | 否 | false | - | 色弱模式 |
| multiTab | boolean | 否 | true | - | 多标签页 |
| splitMenus | boolean | 否 | false | - | 分割菜单 |

### features (可选)
功能特性配置

#### auth
| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| enabled | boolean | 否 | true | 是否启用认证 |
| provider | string | 否 | "nextauth" | 认证提供商 |
| strategy | string | 否 | "jwt" | 认证策略 |
| sessionTimeout | number | 否 | 7200 | 会话超时时间(秒) |
| multiDevice | boolean | 否 | true | 是否支持多设备登录 |

#### permissions
| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| enabled | boolean | 否 | true | 是否启用权限系统 |
| type | string | 否 | "rbac" | 权限类型 |
| granularity | string | 否 | "route" | 权限粒度 |
| dynamicRoutes | boolean | 否 | true | 是否支持动态路由 |
| buttonLevel | boolean | 否 | true | 是否支持按钮级权限 |

#### i18n
| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| enabled | boolean | 否 | true | 是否启用国际化 |
| defaultLocale | string | 否 | "zh-CN" | 默认语言 |
| locales | array | 否 | ["zh-CN", "en-US"] | 支持的语言 |
| fallbackLocale | string | 否 | "zh-CN" | 回退语言 |
| detectBrowserLanguage | boolean | 否 | true | 是否检测浏览器语言 |

### modules (必需)
功能模块配置，定义系统的菜单结构和路由

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| name | string | 是 | 模块名称（英文） |
| title | string | 是 | 模块显示名称 |
| icon | string | 否 | 图标名称 |
| path | string | 是 | 路由路径 |
| component | string | 否 | 组件名称 |
| permissions | array | 否 | 所需权限 |
| cache | boolean | 否 | 是否缓存 |
| children | array | 否 | 子模块 |

### permissions (可选)
权限系统配置，定义角色和资源权限

#### roles
| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| id | string | 是 | 角色ID |
| name | string | 是 | 角色名称 |
| description | string | 否 | 角色描述 |
| permissions | array | 是 | 权限列表 |

#### resources
| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| id | string | 是 | 资源ID |
| name | string | 是 | 资源名称 |
| actions | array | 是 | 可用操作 |
| children | array | 否 | 子资源 |

### api (可选)
API接口配置

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| baseURL | string | 是 | - | API基础URL |
| timeout | number | 否 | 10000 | 超时时间(毫秒) |
| retries | number | 否 | 3 | 重试次数 |
| version | string | 否 | "v1" | API版本 |
| prefix | string | 否 | "/api" | API前缀 |

## 应用类型模板

### 电商管理后台
适用于电商平台的商品、订单、用户管理

```json
{
  "project": {
    "name": "EcommerceAdmin",
    "displayName": "电商管理后台",
    "category": "ecommerce"
  },
  "modules": [
    {
      "name": "dashboard",
      "title": "数据概览",
      "icon": "DashboardOutlined",
      "path": "/dashboard"
    },
    {
      "name": "products",
      "title": "商品管理",
      "icon": "ShoppingOutlined",
      "path": "/products"
    },
    {
      "name": "orders",
      "title": "订单管理",
      "icon": "ShoppingCartOutlined",
      "path": "/orders"
    },
    {
      "name": "users",
      "title": "用户管理",
      "icon": "UserOutlined",
      "path": "/users"
    }
  ]
}
```

### CRM客户管理系统
适用于销售团队的客户关系管理

```json
{
  "project": {
    "name": "CRMAdmin",
    "displayName": "CRM管理系统",
    "category": "crm"
  },
  "modules": [
    {
      "name": "dashboard",
      "title": "销售概览",
      "icon": "DashboardOutlined",
      "path": "/dashboard"
    },
    {
      "name": "customers",
      "title": "客户管理",
      "icon": "ContactsOutlined",
      "path": "/customers"
    },
    {
      "name": "opportunities",
      "title": "销售机会",
      "icon": "BulbOutlined",
      "path": "/opportunities"
    },
    {
      "name": "activities",
      "title": "活动记录",
      "icon": "CalendarOutlined",
      "path": "/activities"
    }
  ]
}
```

### 内容管理CMS
适用于内容创作和发布管理

```json
{
  "project": {
    "name": "CMSAdmin",
    "displayName": "内容管理系统",
    "category": "cms"
  },
  "modules": [
    {
      "name": "dashboard",
      "title": "内容概览",
      "icon": "DashboardOutlined",
      "path": "/dashboard"
    },
    {
      "name": "articles",
      "title": "文章管理",
      "icon": "EditOutlined",
      "path": "/articles"
    },
    {
      "name": "media",
      "title": "媒体库",
      "icon": "PictureOutlined",
      "path": "/media"
    },
    {
      "name": "categories",
      "title": "分类管理",
      "icon": "AppstoreOutlined",
      "path": "/categories"
    }
  ]
}
```

## 验证规则

1. **必需字段验证**：`project.name`、`project.displayName`、`project.version`、`ui`、`modules` 必须提供
2. **类型验证**：所有字段必须符合指定的数据类型
3. **枚举验证**：枚举类型字段必须使用预定义的值
4. **依赖验证**：某些功能之间存在依赖关系，需要一起启用
5. **路径唯一性**：模块路径必须唯一
6. **权限一致性**：权限配置必须与模块权限一致

## 最佳实践

1. **模块化设计**：合理划分功能模块，避免单个模块过于复杂
2. **权限细化**：设计合理的权限粒度，确保系统安全
3. **用户体验**：选择合适的布局和主题，提供良好的用户体验
4. **性能优化**：启用缓存和代码分割，提高系统性能
5. **国际化支持**：考虑多语言需求，预留国际化配置
6. **监控和日志**：配置适当的监控和错误追踪
7. **测试覆盖**：编写充分的单元测试和集成测试
8. **文档完善**：维护完整的API文档和用户手册

## 示例配置文件

完整的示例配置文件可在 `examples/` 目录中找到：

- `examples/ecommerce-admin/admin-config.json` - 电商管理后台配置
- `examples/crm-admin/admin-config.json` - CRM客户管理配置
- `examples/cms-admin/admin-config.json` - 内容管理CMS配置

## 配置验证

使用 JSON Schema 验证配置文件：

```bash
# 安装验证工具
npm install -g ajv-cli

# 验证配置文件
ajv validate -s schemas/admin-config.schema.json -d admin-config.json
```

配置文件必须通过 Schema 验证才能用于生成后台管理系统。