# 通用拖拽创建工具基类使用指南

## 概述

`DraggableShapeTool` 基类为所有矩形类组件提供统一的拖拽创建交互体验。基于此基类，新组件的开发时间可以减少70%以上。

## 快速开始

### 1. 继承基类

```typescript
import { DraggableShapeTool, type DraggableShapeToolConfig } from './base'
import type { MyShape } from './MyShape'

export class MyTool extends DraggableShapeTool<MyShape> {
  static override id = 'my-tool'

  getConfig(): DraggableShapeToolConfig<MyShape> {
    return {
      shapeType: 'my-shape',
      defaultSize: { width: 200, height: 150 },
      minimumSize: { width: 50, height: 50 },
      previewOpacity: 0.3,
      createShapeProps: (x, y, width, height) => ({
        // 返回形状特定的属性
        color: '#3b82f6',
        text: 'Hello World',
      }),
    }
  }
}
```

### 2. 形状组件支持预览

```typescript
// 在你的形状组件中添加预览模式
override component(shape: MyShape) {
  // 预览模式：简单的半透明方块
  if (shape.opacity < 0.8) {
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: "none",
          opacity: shape.opacity,
        }}
      >
        <div className="w-full h-full bg-blue-200 border border-blue-300 rounded" />
      </HTMLContainer>
    );
  }

  // 正常模式：渲染完整组件
  return (
    <HTMLContainer style={{ width: shape.props.w, height: shape.props.h }}>
      <MyComponent shape={shape} />
    </HTMLContainer>
  );
}
```

## 配置选项详解

### DraggableShapeToolConfig 接口

```typescript
export interface DraggableShapeToolConfig<T extends TLBaseShape<string, any>> {
  /** 形状类型标识符 - 必须与形状定义一致 */
  shapeType: string

  /** 默认尺寸 - 点击创建时使用 */
  defaultSize: { width: number; height: number }

  /** 最小尺寸限制 - 拖拽创建时过滤小组件 */
  minimumSize: { width: number; height: number }

  /** 预览透明度 - 通常0.2-0.4之间 */
  previewOpacity: number

  /** 创建形状属性的回调函数 */
  createShapeProps: (x: number, y: number, width: number, height: number) => T['props']

  /** 可选：自定义预览样式 */
  customPreviewStyle?: React.CSSProperties
}
```

## 实际案例

### 案例1：网页容器组件

```typescript
export class WebContainerTool extends DraggableShapeTool<WebContainerShape> {
  static override id = 'web-container'

  getConfig(): DraggableShapeToolConfig<WebContainerShape> {
    return {
      shapeType: 'web-container',
      defaultSize: { width: 400, height: 300 }, // 适合网页内容
      minimumSize: { width: 100, height: 80 },   // 避免过小无法使用
      previewOpacity: 0.3,
      createShapeProps: () => ({
        url: '', // 初始为空，等待用户编辑
      }),
    }
  }
}
```

### 案例2：动态背景组件（重构建议）

```typescript
export class DynamicBackgroundTool extends DraggableShapeTool<DynamicBackgroundShape> {
  static override id = 'dynamic-background'

  getConfig(): DraggableShapeToolConfig<DynamicBackgroundShape> {
    return {
      shapeType: 'dynamic-background',
      defaultSize: { width: 600, height: 400 },  // 默认背景尺寸
      minimumSize: { width: 50, height: 50 },     // 最小限制
      previewOpacity: 0.3,
      createShapeProps: () => ({
        backgroundType: toolManager.getCurrentBackgroundType(),
        animationSpeed: 1.0,
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        // ... 其他属性
      }),
    }
  }
}
```

### 案例3：便签组件

```typescript
export class NoteTool extends DraggableShapeTool<NoteShape> {
  static override id = 'note'

  getConfig(): DraggableShapeToolConfig<NoteShape> {
    return {
      shapeType: 'note',
      defaultSize: { width: 200, height: 200 },  // 便签默认正方形
      minimumSize: { width: 100, height: 100 },   // 最小可读尺寸
      previewOpacity: 0.4,
      createShapeProps: () => ({
        text: '', // 初始空文本
        color: '#fef3c7', // 黄色便签
      }),
    }
  }
}
```

## 用户体验特性

### 1. 双重创建模式

- **拖拽创建**：按住鼠标拖拽出任意尺寸
- **点击创建**：快速点击创建默认尺寸

### 2. 实时预览

- 拖拽过程中显示半透明预览形状
- 清晰的视觉反馈，避免意外操作

### 3. 智能过滤

- 最小尺寸限制防止意外创建过小组件
- ESC键随时取消操作

### 4. 一致性

- 与动态背景组件完全一致的用户体验
- 统一的交互模式和视觉反馈

## 迁移现有组件

### 从 StateNode 迁移

**旧代码（50+行）：**
```typescript
class MyTool extends StateNode {
  static override id = 'my-tool'

  private startPagePoint: { x: number; y: number } | null = null
  private isDragging = false
  private previewShapeId: string | null = null

  override onEnter() { /* 光标设置 */ }
  override onExit() { /* 清理状态 */ }
  override onPointerDown(info: TLPointerEventInfo) { /* 开始拖拽 */ }
  override onPointerMove(info: TLPointerEventInfo) { /* 更新预览 */ }
  override onPointerUp(info: TLPointerEventInfo) { /* 创建形状 */ }
  override onClick(info: TLClickEventInfo) { /* 点击创建 */ }
  override onKeyDown(info: TLKeyboardEventInfo) { /* ESC处理 */ }
  // ... 大量重复的状态管理和坐标转换代码
}
```

**新代码（15行）：**
```typescript
class MyTool extends DraggableShapeTool<MyShape> {
  static override id = 'my-tool'

  getConfig(): DraggableShapeToolConfig<MyShape> {
    return {
      shapeType: 'my-shape',
      defaultSize: { width: 200, height: 150 },
      minimumSize: { width: 50, height: 50 },
      previewOpacity: 0.3,
      createShapeProps: (x, y, w, h) => ({ /* 属性 */ }),
    }
  }
}
```

## 最佳实践

### 1. 尺寸配置

- **默认尺寸**：考虑内容的合理显示尺寸
- **最小尺寸**：确保组件的基本可用性
- **比例关系**：保持视觉协调性

### 2. 预览样式

- 使用组件的主色调进行预览
- 保持边框和圆角等视觉特征
- 透明度在0.2-0.4之间效果最佳

### 3. 属性初始化

- URL类型组件：初始为空字符串
- 颜色类型组件：使用品牌色或默认色
- 文本类型组件：初始为空或占位文本

### 4. 错误处理

- 在 `createShapeProps` 中进行属性验证
- 确保默认值是有效的

## 总结

`DraggableShapeTool` 基类显著简化了自定义组件的开发：

✅ **代码减少70%** - 从50+行减少到15行
✅ **交互一致性** - 所有组件统一用户体验
✅ **维护性提升** - 核心逻辑集中管理
✅ **开发效率** - 新组件只需配置参数
✅ **错误减少** - 消除坐标转换等常见错误

建议所有新的矩形类组件都基于此基类开发。