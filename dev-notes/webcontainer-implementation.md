# WebContainer 功能实现详解

## 概述

WebContainer 是基于 Tldraw 的自定义形状组件，允许在白板中嵌入外部网页。本文档详细记录了实现过程中的技术难点、解决方案和关键设计决策。

## 核心功能

- **网页嵌入**：通过 iframe 在白板中嵌入外部网页
- **URL 编辑**：通过 tooltip 形式的工具栏编辑网页 URL
- **交互优化**：解决 iframe 拦截鼠标事件的问题
- **视觉一致性**：与 Tldraw 原生组件保持一致的交互体验

## 技术架构

### 1. 组件结构

```
WebContainer 功能组件
├── FinalWebContainer.tsx          # 形状工具类 + React 组件
├── WebContainerToolbar.tsx        # 自定义工具栏组件
├── WebContainerToolUtil.tsx       # 工具状态管理
└── App.tsx                        # 主应用集成
```

### 2. 核心类型定义

```typescript
export type WebContainerShape = TLBaseShape<'web-container', {
  w: number     // 宽度
  h: number     // 高度
  url: string   // 网页地址
}>
```

## 关键技术实现

### 1. iframe 交互问题解决

**问题**：iframe 会拦截所有鼠标事件，导致无法拖拽移动容器。

**解决方案**：分层架构
```tsx
{/* 透明拖拽层 - z-index: 1 */}
<div
  className="absolute inset-0 z-10 cursor-move bg-black bg-opacity-5"
  onMouseDown={(e) => e.stopPropagation()}
  title="拖拽移动容器，选中后点击工具按钮编辑URL"
/>

{/* iframe 层 - z-index: 0 */}
<iframe
  src={url}
  className="w-full h-full border-0 rounded relative"
  style={{ zIndex: 0 }}
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  title="网页容器"
/>
```

**技术要点**：
- 使用 z-index 分层：拖拽层在上，iframe 层在下
- 透明拖拽层处理鼠标事件，不影响视觉效果
- 使用 sandbox 属性确保安全性

### 2. URL 编辑交互设计

**设计目标**：模仿 Tldraw 原生媒体组件的交互模式，通过 tooltip 编辑 URL。

#### 2.1 工具栏组件实现

```tsx
function WebContainerToolbar() {
  const editor = useEditor()
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [tempUrl, setTempUrl] = useState('')

  // 使用 useValue 监听选中状态
  const selectedWebContainer = useValue(
    'selectedWebContainer',
    () => {
      const selectedShapeIds = editor.getSelectedShapeIds()
      if (selectedShapeIds.length !== 1) return null
      const shape = editor.getShape(selectedShapeIds[0])
      return shape?.type === 'web-container' ? shape : null
    },
    [editor]
  )
}
```

#### 2.2 工具栏定位计算

```tsx
// 获取选中形状的边界框
const selectionBounds = editor.getSelectionPageBounds()
if (!selectionBounds) return null

// 计算工具栏位置：在选中形状上方居中
const centerPoint = {
  x: selectionBounds.x + selectionBounds.w / 2,
  y: selectionBounds.y - 10 // 在形状上方10px
}

// 转换为屏幕坐标
const screenPoint = editor.pageToScreen(centerPoint)
```

**关键 API**：
- `editor.getSelectionPageBounds()` - 获取选中区域的页面边界框
- `editor.pageToScreen()` - 坐标系转换（页面坐标 → 屏幕坐标）

### 3. Tldraw UI 组件覆盖

**问题**：如何让自定义工具栏只在选中 WebContainer 时显示？

**解决方案**：通过 `components` prop 覆盖原生组件

```tsx
// App.tsx
<Tldraw
  components={{
    // 隐藏原生工具栏
    Toolbar: null,

    // 覆盖图片工具栏，为WebContainer显示自定义工具栏
    ImageToolbar: () => <WebContainerToolbar />,
  }}
>
```

**设计思路**：
- 利用 Tldraw 的组件覆盖机制
- 覆盖 `ImageToolbar` 而非创建全新组件，确保与现有系统集成
- 工具栏内部通过形状类型判断是否显示

### 4. 形状工具类实现

```tsx
export class WebContainerShapeUtil extends BaseBoxShapeUtil<WebContainerShape> {
  static override type = 'web-container' as const

  getDefaultProps(): WebContainerShape['props'] {
    return {
      w: 400,
      h: 300,
      url: '',
    }
  }

  component(shape: WebContainerShape) {
    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
        }}
        className="pointer-events-auto"
      >
        <WebContainerComponent shape={shape} />
      </HTMLContainer>
    )
  }
}
```

**技术选择**：
- 继承 `BaseBoxShapeUtil` 获得内置的矩形框功能
- 使用 `HTMLContainer` 支持复杂的 HTML 元素（iframe）

## 开发过程中的关键错误和解决方案

### 1. API 兼容性问题

**错误**：`editor.getSelectionBounds() is not a function`

**原因**：使用了错误的 API 方法名

**解决**：查阅 Tldraw 文档，使用正确的方法：
```typescript
// 错误 ❌
const selectionBounds = editor.getSelectionBounds()

// 正确 ✅
const selectionBounds = editor.getSelectionPageBounds()
```

### 2. 坐标系理解错误

**错误**：边界框属性访问错误

**原因**：Tldraw v4.2.0 中 Box 对象使用 `x, y, w, h` 而非 `minX, minY, width, height`

```typescript
// 错误 ❌
const centerPoint = {
  x: selectionBounds.minX + selectionBounds.width / 2,
  y: selectionBounds.minY - 10
}

// 正确 ✅
const centerPoint = {
  x: selectionBounds.x + selectionBounds.w / 2,
  y: selectionBounds.y - 10
}
```

### 3. Hook 使用错误

**错误**：使用不存在的 Tldraw hooks

**原因**：混淆了不同版本或库的 API

```typescript
// 错误 ❌
import { useSelection, useTransformPagePoint } from 'tldraw'

// 正确 ✅
import { useEditor, useValue } from 'tldraw'
```

## 最佳实践总结

### 1. 文档驱动开发
- 遇到不熟悉的 API 时，优先查阅官方文档
- 使用 context7 工具搜索最新版本的 API 参考
- 不要基于假设或经验使用 API

### 2. 渐进式实现
- 先实现基础功能，再优化交互体验
- 分离关注点：组件渲染、状态管理、事件处理独立实现
- 每次只解决一个问题，避免同时修改多个部分

### 3. 错误处理策略
- 充分利用 TypeScript 类型系统避免运行时错误
- 边界条件检查（如 `if (!selectionBounds) return null`）
- 优雅降级：功能不可用时提供合理的备选方案

### 4. 组件设计原则
- **单一职责**：每个组件只负责一个明确功能
- **状态最小化**：避免不必要的内部状态，优先使用 Tldraw 提供的状态
- **事件处理优化**：正确处理事件冒泡，避免与框架冲突

## 扩展方向

1. **安全性增强**：更严格的 URL 白名单和内容安全策略
2. **性能优化**：iframe 预加载、缓存机制
3. **交互扩展**：支持网页内的缩放、滚动等操作
4. **样式定制**：网页容器的边框、阴影等视觉定制

## 相关资源

- [Tldraw 官方文档](https://tldraw.dev/docs)
- [HTMLContainer API 参考](https://tldraw.dev/docs/editor#htmlcontainer)
- [BaseBoxShapeUtil API 参考](https://tldraw.dev/docs/shapes#baseboxshapeutil)

---

*创建时间：2025-12-08*
*最后更新：2025-12-08*