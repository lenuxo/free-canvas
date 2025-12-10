# Tldraw 自定义组件实现分析

## 官方示例学习总结

通过分析Tldraw官方的自定义形状和工具示例，发现了我们当前实现中的几个关键问题：

### 1. 工具继承方式的问题

**官方做法：**
```typescript
export class CardShapeTool extends BaseBoxShapeTool {
    static override id = 'card'
    static override initial = 'idle'
    override shapeType = 'card'
}
```

**我们的问题：**
```typescript
class DynamicBackgroundToolState extends StateNode {
    static override id = 'dynamic-background'
    // 没有继承 BaseBoxShapeTool，导致需要自己处理所有坐标转换逻辑
}
```

### 2. 坐标处理的核心差异

**BaseBoxShapeTool 内置功能：**
- 自动处理屏幕坐标到画板坐标的转换
- 处理拖拽创建形状的逻辑
- 处理单击创建形状的逻辑
- 正确处理缩放和平移后的坐标

**我们当前的StateNode方式：**
- 需要手动处理 `info.point` 坐标转换
- 在画板移动/缩放后出现坐标错位
- 自己实现拖拽逻辑，容易出现bug

### 3. 实现架构对比

**官方推荐的架构：**
1. `ShapeUtil` - 负责形状的渲染、行为和属性
2. `Tool` - 继承 `BaseBoxShapeTool`，专注于创建形状
3. 类型定义 - 使用 Tldraw 的类型系统
4. 样式系统 - 使用 Tldraw 的 StyleProp API

**我们当前的架构：**
1. `DynamicBackgroundShapeUtil` - 形状工具类 ✅ 正确
2. `DynamicBackgroundToolState` - 继承 `StateNode` ❌ 应该继承 `BaseBoxShapeTool`
3. 坐标处理 - 手动处理转换 ❌ 应该使用内置功能

### 4. 样式系统的使用

**官方做法：**
```typescript
// 使用 RecordProps 定义形状属性
export const cardShapeProps: RecordProps<ICardShape> = {
    w: T.number,
    h: T.number,
    color: DefaultColorStyle,
}
```

**我们的实现：**
```typescript
// 直接在 ShapeUtil 中定义 props
static override props = {
    w: T.number,
    h: T.number,
    backgroundType: backgroundTypeStyle,
    // ...
}
```

这点我们的实现是正确的。

## 核心问题分析

### 坐标转换问题的根本原因

当前问题的根源在于：
1. 我们使用的是 `StateNode` 而不是 `BaseBoxShapeTool`
2. `info.point` 在事件处理中是屏幕坐标，不是画板坐标
3. 缺少屏幕坐标到画板坐标的转换逻辑

### 解决方案

有两种解决方案：

#### 方案一：使用BaseBoxShapeTool（推荐）
```typescript
export class DynamicBackgroundTool extends BaseBoxShapeTool {
    static override id = 'dynamic-background'
    override shapeType = 'dynamic-background'

    // 不需要自己处理坐标转换，BaseBoxShapeTool会自动处理
    // onDoubleClick、onPointerDown 等事件都会提供正确的画板坐标
}
```

#### 方案二：修复当前StateNode的坐标转换
```typescript
override onClick: (info: TLClickEventInfo) => void = (info) => {
    // 将屏幕坐标转换为画板坐标
    const pagePoint = this.editor.screenToPage(info.point)
    this.createBackground(pagePoint.x - 300, pagePoint.y - 200, 600, 400)
}
```

## 实现建议

1. **重构工具类**：将 `DynamicBackgroundToolState` 改为继承 `BaseBoxShapeTool`
2. **简化事件处理**：移除手动坐标转换逻辑
3. **保持形状工具类**：当前的 `DynamicBackgroundShapeUtil` 实现正确
4. **UI集成**：按照官方示例集成到工具栏

## 学习要点

1. **利用内置功能**：Tldraw提供了很多内置工具类，应该优先使用而不是重新实现
2. **坐标系统**：理解屏幕坐标和画板坐标的区别，正确使用转换API
3. **架构模式**：遵循官方推荐的工具-形状分离架构
4. **样式系统**：充分利用Tldraw的样式系统，避免重复造轮子

这个分析解释了为什么会出现坐标错位问题，以及如何按照官方最佳实践来修复。