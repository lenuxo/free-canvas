# 自定义工具开发指南

## 🚨 重要提醒：新建拖拽工具

### 推荐使用通用拖拽基类

**强烈建议**所有新的拖拽工具都基于 `DraggableShapeTool` 基类开发：

```typescript
import { DraggableShapeTool, type DraggableShapeToolConfig } from './base'

export class MyTool extends DraggableShapeTool<MyShape> {
  static override id = 'my-tool'

  getConfig(): DraggableShapeToolConfig<MyShape> {
    return {
      shapeType: 'my-shape',
      defaultSize: { width: 200, height: 150 },
      minimumSize: { width: 50, height: 50 },
      previewOpacity: 0.3,
      createShapeProps: (x, y, w, h) => ({ /* 特有属性 */ }),
    }
  }
}
```

### 为什么使用基类？

✅ **开发效率提升70%** - 从50+行代码减少到15行
✅ **统一的用户体验** - 所有组件都有相同的拖拽交互
✅ **减少重复代码** - 消除坐标转换、状态管理等重复逻辑
✅ **降低出错率** - 核心逻辑集中测试和维护

### 参考资源

- 📖 **使用示例**: `WebContainerToolUtil.tsx` (最佳实践)
- 📚 **开发指南**: `dev-notes/draggable-shape-tool-usage-example.md`
- 🔧 **基类实现**: `base/DraggableShapeTool.tsx`

## 现有工具

### 拖拽创建工具

1. **动态背景工具** (`DynamicBackgroundTool.tsx`)
   - 支持gradient-flow和heatmap两种背景类型
   - 自定义预览模式
   - 🚨 *建议重构为使用DraggableShapeTool基类*

2. **网页容器工具** (`WebContainerToolUtil.tsx`)
   - ✅ 已重构为使用DraggableShapeTool基类
   - 从76行代码减少到15行
   - 最佳实践示例

### 基类和工具

- `base/DraggableShapeTool.tsx` - 通用拖拽创建基类
- `base/index.ts` - 基类统一导出

## 开发新工具的步骤

### 1. 创建形状定义

```typescript
// MyShape.tsx
export interface MyShapeProps {
  w: number
  h: number
  // 特有属性
  color: string
  text: string
}

export interface MyShape extends TLBaseShape<'my-shape', MyShapeProps> {}
```

### 2. 创建形状工具类

```typescript
// MyShapeUtil.tsx
export class MyShapeUtil extends BaseBoxShapeUtil<MyShape> {
  static override type = 'my-shape' as const

  override component(shape: MyShape) {
    // 💡 重要：支持预览模式
    if (shape.opacity < 0.8) {
      return (
        <HTMLContainer id={shape.id}>
          <div className="w-full h-full bg-blue-200" />
        </HTMLContainer>
      );
    }

    // 正常渲染
    return <MyComponent shape={shape} />
  }
}
```

### 3. 创建工具类

```typescript
// MyTool.tsx
import { DraggableShapeTool, type DraggableShapeToolConfig } from './base'

export class MyTool extends DraggableShapeTool<MyShape> {
  static override id = 'my-tool'

  getConfig(): DraggableShapeToolConfig<MyShape> {
    return {
      shapeType: 'my-shape',
      defaultSize: { width: 200, height: 150 },
      minimumSize: { width: 50, height: 50 },
      previewOpacity: 0.3,
      createShapeProps: () => ({
        color: '#3b82f6',
        text: '',
      }),
    }
  }
}
```

### 4. 注册到应用

```typescript
// App.tsx
const customShapeUtils = [MyShapeUtil]
const customTools = [MyTool]

<Tldraw shapeUtils={customShapeUtils} tools={customTools} />
```

## 常见问题

### Q: 什么时候应该使用DraggableShapeTool基类？

A: 当你的工具需要支持以下功能时：
- 用户可以拖拽创建任意尺寸的形状
- 需要实时预览反馈
- 需要点击创建默认大小组件
- 需要最小尺寸限制
- 希望与其他组件保持一致的交互体验

### Q: 如何自定义预览样式？

A: 在形状的`component`方法中，当`shape.opacity < 0.8`时返回预览样式：

```typescript
if (shape.opacity < 0.8) {
  return (
    <HTMLContainer id={shape.id}>
      <div className="w-full h-full bg-purple-200 border-2 border-purple-300" />
    </HTMLContainer>
  );
}
```

### Q: 如何处理特殊形状？

A: 对于非矩形形状（如线条、圆形等），可以继承`StateNode`并参考`DynamicBackgroundTool.tsx`的实现模式。