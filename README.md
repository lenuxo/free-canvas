# Free Canvas

一个基于 Tldraw 构建的自由白板应用，支持自定义工具和扩展功能。

## 项目简介

Free Canvas 是一个功能丰富的在线白板应用，基于强大的 Tldraw 绘图引擎构建。项目采用现代化的技术栈，提供流畅的绘图体验和可扩展的架构设计。

### 核心特性

- **自由绘图**: 基于 Tldraw 的专业绘图工具集
- **自定义工具**: 支持扩展自定义绘图工具
- **网页容器**: 独特的网页嵌入功能，可在白板中直接显示外部网页
- **自定义UI**: 隐藏原生界面，提供定制化用户体验
- **键盘快捷键**: 完整的键盘操作支持

### 技术栈

- **Tldraw 4.2.0** - 核心绘图引擎
- **React 18.3.1** + **TypeScript 5.8.3** - 开发框架
- **Vite 7.0.1** - 构建工具
- **Tailwind CSS 4.1** - 样式框架

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开浏览器访问 `http://localhost:5173` 即可开始使用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
src/
├── components/                # 通用组件
│   ├── CustomToolbar.tsx      # 自定义工具栏
│   └── KeyboardHandler.tsx    # 键盘快捷键处理
├── tools/                     # 自定义工具
│   ├── FinalWebContainer.tsx  # 网页容器形状实现
│   └── WebContainerToolUtil.tsx # 网页容器工具状态
├── utils/                     # 工具函数
│   └── ToolManager.tsx        # 工具管理器
└── App.tsx                    # 主应用入口
```

## 核心功能

### 网页容器工具

项目的标志性功能，允许用户在白板中嵌入和显示外部网页：

- **URL输入**: 支持动态输入和修改网页地址
- **实时预览**: iframe 方式嵌入外部网页
- **可调整大小**: 支持拖拽调整容器尺寸
- **智能交互**: 解决 iframe 事件拦截问题，支持拖拽移动

### 自定义工具栏

替代原生 UI，提供统一的用户体验：

- **工具选择**: 支持多种绘图工具切换
- **图标集成**: 使用 Lucide React 图标库
- **响应式设计**: 适配不同屏幕尺寸

### 键盘快捷键

在隐藏原生 UI 模式下提供完整的键盘操作：

- **删除功能**: Delete/Backspace 删除选中形状
- **智能检测**: 避免与输入框编辑冲突
- **扩展性**: 易于添加新的快捷键功能

## 开发指南

### 添加新工具

1. 在 `src/tools/` 目录下创建工具文件
2. 继承 `StateNode` 类实现工具状态管理
3. 在 `src/App.tsx` 中注册新工具
4. 更新工具栏组件添加工具按钮

### 自定义形状

1. 使用 `ShapeUtil` 或 `BaseBoxShapeUtil` 基类
2. 实现必需方法：`getDefaultProps`、`component`、`indicator`
3. 注册到 `Tldraw` 组件的 `shapeUtils` 属性

### 扩展UI

项目采用组件化架构，便于扩展：

- 组件位于 `src/components/` 目录
- 使用 React Hooks 进行状态管理
- 支持通过 `useEditor` hook 访问编辑器功能

---

**技术提示**: 项目采用模块化架构设计，支持快速扩展新功能。开发时建议优先查阅 Tldraw 官方文档了解 API 详情。