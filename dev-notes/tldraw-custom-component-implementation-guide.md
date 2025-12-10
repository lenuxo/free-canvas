# Tldraw 自定义组件和配置实现指南

本指南基于Tldraw官方最佳实践和实际开发经验，详细介绍如何正确实现自定义形状、工具和配置系统。

## 概述

Tldraw采用插件化架构，支持三种主要的自定义扩展：
- **自定义形状（Shape）**：定义新类型的绘图元素
- **自定义工具（Tool）**：创建用于绘制和操作的工具
- **自定义配置**：样式系统和UI扩展

## 核心架构模式

### 1. 三层架构设计

```
App.tsx (主应用)
├── 工具注册 (customTools)
├── 形状注册 (customShapeUtils)
└── UI覆盖 (uiOverrides)
```

**官方推荐的注册方式**：
```typescript
// [1] 在组件外部定义，避免重复渲染
const customShapeUtils = [CardShapeUtil]
const customTools = [CardShapeTool]

// [2] 传递给Tldraw组件
<Tldraw
    shapeUtils={customShapeUtils}
    tools={customTools}
    overrides={uiOverrides}
    components={components}
/>
```

### 2. 工具-形状分离原则

- **ShapeUtil**：负责形状的渲染、行为、属性和样式
- **Tool**：专注于创建形状的逻辑
- **样式系统**：统一的属性管理和验证

## 自定义形状实现

### ShapeUtil 基础结构

```typescript
export class DynamicBackgroundShapeUtil extends BaseBoxShapeUtil<DynamicBackgroundShape> {
    static override type = 'dynamic-background' as const

    // [1] 属性定义 - 使用Tldraw样式系统
    static override props = {
        w: T.number,
        h: T.number,
        backgroundType: backgroundTypeStyle,  // 自定义样式
        animationSpeed: animationSpeedStyle,
        // ...
    }

    // [2] 默认值
    override getDefaultProps(): DynamicBackgroundShape['props'] {
        return {
            w: 600,
            h: 400,
            backgroundType: 'gradient-flow',
            animationSpeed: 1.0,
            // ...
        }
    }

    // [3] 组件渲染
    override component(shape: DynamicBackgroundShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    pointerEvents: shape.isLocked ? 'none' : 'auto',
                    opacity: shape.opacity,
                }}
            >
                <div className="w-full h-full overflow-hidden">
                    {this.renderBackgroundComponent(shape)}
                </div>
            </HTMLContainer>
        )
    }

    // [4] 选中指示器
    override indicator(shape: DynamicBackgroundShape) {
        const { w, h } = shape.props
        return <rect width={w} height={h} fill="none" stroke="#007AFF" strokeWidth={2} />
    }
}
```

### 类型定义

```typescript
export interface DynamicBackgroundShape extends TLBaseBoxShape<'dynamic-background'> {
    props: {
        w: number
        h: number
        backgroundType: BackgroundType
        animationSpeed: AnimationSpeed
        // 其他属性...
    }
}
```

## 自定义工具实现

### 方式一：继承BaseBoxShapeTool（推荐）

```typescript
export class DynamicBackgroundTool extends BaseBoxShapeTool {
    static override id = 'dynamic-background'
    override shapeType = 'dynamic-background'

    // 自动获得正确的坐标处理、拖拽创建等功能
    // 不需要手动处理坐标转换
}
```

### 方式二：继承StateNode（需要手动处理坐标）

```typescript
class DynamicBackgroundToolState extends StateNode {
    static override id = 'dynamic-background'

    override onClick: (info: TLClickEventInfo) => void = (info) => {
        // ⚠️ 坐标转换陷阱：info.point是屏幕坐标，需要转换为画板坐标
        const pagePoint = this.editor.screenToPage(info.point)
        this.createBackground(pagePoint.x - 300, pagePoint.y - 200, 600, 400)
    }

    override onPointerUp: (info: TLPointerEventInfo) => void = (info) => {
        // 拖拽时需要转换起始点和结束点
        const endPoint = this.editor.screenToPage(info.point)
        const startPoint = this.editor.screenToPage(this.startPagePoint)

        const width = Math.abs(endPoint.x - startPoint.x)
        const height = Math.abs(endPoint.y - startPoint.y)

        this.createBackground(
            Math.min(startPoint.x, endPoint.x),
            Math.min(startPoint.y, endPoint.y),
            width,
            height
        )
    }
}
```

## 样式系统实现

### StyleProp 定义

```typescript
// 动态背景类型样式
export const backgroundTypeStyle = StyleProp.defineEnum('dynamic-background:type', {
    defaultValue: 'gradient-flow',
    values: ['gradient-flow', 'heatmap'] as const,
})

// 动画速度样式（带验证）
export const animationSpeedStyle = StyleProp.define('dynamic-background:animationSpeed', {
    defaultValue: 1.0,
    type: T.number.check((n) => {
        if (n < 0.1 || n > 3.0) {
            throw new Error('Animation speed must be between 0.1 and 3.0')
        }
    }),
})
```

### 在ShapeUtil中使用样式

```typescript
static override props = {
    backgroundType: backgroundTypeStyle,
    animationSpeed: animationSpeedStyle,
    // ...
}
```

## UI集成和工具栏

### UI覆盖配置

```typescript
export const uiOverrides: TLUiOverrides = {
    tools(editor, tools) {
        // 添加工具到UI上下文
        tools.dynamic-background = {
            id: 'dynamic-background',
            icon: 'color',
            label: '动态背景',
            kbd: 'd',
            onSelect: () => {
                editor.setCurrentTool('dynamic-background')
            },
        }
        return tools
    },
}
```

### 工具栏组件扩展

```typescript
export const components: TLComponents = {
    Toolbar: (props) => {
        const tools = useTools()
        const isDynamicBgSelected = useIsToolSelected(tools['dynamic-background'])

        return (
            <DefaultToolbar {...props}>
                <TldrawUiMenuItem
                    {...tools['dynamic-background']}
                    isSelected={isDynamicBgSelected}
                />
                <DefaultToolbarContent />
            </DefaultToolbar>
        )
    },
}
```

## 样式面板实现

### 自定义样式面板

```typescript
function DynamicBackgroundStylePanel() {
    const editor = useEditor()
    const styles = useRelevantStyles()

    if (!styles) return null

    // 获取样式值
    const backgroundType = styles.get(backgroundTypeStyle)
    const animationSpeed = styles.get(animationSpeedStyle)

    // 设置样式
    const setStyle = (styleProp: any, value: any) => {
        editor.setStyleForSelectedShapes(styleProp, value)
    }

    return (
        <DefaultStylePanel>
            <DefaultStylePanelContent />

            {backgroundType && (
                <div className="space-y-4 p-4 border-t border-gray-200">
                    {/* 动画速度控制 */}
                    <div>
                        <label>动画速度: {animationSpeed?.value?.toFixed(1)}x</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={animationSpeed?.value || 1.0}
                            onChange={(e) => {
                                const value = parseFloat(e.currentTarget.value)
                                setStyle(animationSpeedStyle, value)
                            }}
                        />
                    </div>
                </div>
            )}
        </DefaultStylePanel>
    )
}
```

## 常见错误和陷阱

### 1. 坐标转换错误 ⚠️

**错误做法**：
```typescript
override onClick: (info: TLClickEventInfo) => void = (info) => {
    // 直接使用info.point，在画板移动/缩放后位置错误
    this.createBackground(info.point.x - 300, info.point.y - 200, 600, 400)
}
```

**正确做法**：
```typescript
override onClick: (info: TLClickEventInfo) => void = (info) => {
    // 转换为画板坐标
    const pagePoint = this.editor.screenToPage(info.point)
    this.createBackground(pagePoint.x - 300, pagePoint.y - 200, 600, 400)
}
```

### 2. 样式定义错误

**错误做法**：
```typescript
// 在ShapeUtil中直接定义简单类型
static override props = {
    backgroundType: T.string,  // 缺少样式系统的优势
}
```

**正确做法**：
```typescript
// 使用StyleProp定义样式
export const backgroundTypeStyle = StyleProp.defineEnum('dynamic-background:type', {
    defaultValue: 'gradient-flow',
    values: ['gradient-flow', 'heatmap'] as const,
})

static override props = {
    backgroundType: backgroundTypeStyle,  // 获得样式系统的所有功能
}
```

### 3. 工具类选择错误

**错误选择**：
- 使用`StateNode`实现简单的矩形创建工具
- 需要手动实现拖拽、坐标转换等复杂逻辑

**正确选择**：
- 使用`BaseBoxShapeTool`实现矩形/盒子形状
- 使用`StateNode`仅当需要完全自定义的交互逻辑

### 4. 组件渲染错误

**错误做法**：
```typescript
// 缺少事件阻止，可能导致编辑器行为异常
override component(shape: DynamicBackgroundShape) {
    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    )
}
```

**正确做法**：
```typescript
override component(shape: DynamicBackgroundShape) {
    return (
        <HTMLContainer id={shape.id}>
            <div>
                <button
                    onClick={() => setCount(count + 1)}
                    onPointerDown={(e) => e.stopPropagation()}  // 阻止事件冒泡
                >
                    Click me
                </button>
            </div>
        </HTMLContainer>
    )
}
```

### 5. 样式面板无障碍错误

**错误做法**：
```typescript
<input type="range" min="0" max="1" step="0.01" />
```

**正确做法**：
```typescript
<input
    type="range"
    min="0"
    max="1"
    step="0.01"
    title="动画速度调节滑块"  // 添加title属性
    aria-label="动画速度"     // 添加aria-label
/>
```

## 最佳实践总结

### 1. 架构设计
- 优先使用官方提供的基类（BaseBoxShapeTool、BaseBoxShapeUtil）
- 工具和形状职责分离，保持单一职责原则
- 使用Tldraw的样式系统，不要重新实现

### 2. 坐标处理
- 始终注意屏幕坐标和画板坐标的区别
- 使用`editor.screenToPage()`进行坐标转换
- 优先选择自动处理坐标的工具基类

### 3. 性能优化
- 在组件外部定义静态配置，避免重复渲染
- 使用`useIsToolSelected`等hooks优化选择状态
- 合理使用React.memo避免不必要的重渲染

### 4. 可访问性
- 为所有表单元素添加适当的title和aria属性
- 确保键盘导航支持
- 提供清晰的视觉反馈

### 5. 错误处理
- 使用Tldraw的类型系统进行属性验证
- 为用户输入添加适当的边界检查
- 提供有意义的错误消息

## 完整示例结构

```
src/
├── tools/
│   ├── DynamicBackgroundShape.tsx      # 形状工具类
│   └── DynamicBackgroundTool.tsx       # 工具状态类
├── styles/
│   └── dynamic-background-styles.ts    # 样式定义
├── components/
│   └── DynamicBackgroundStylePanel.tsx # 样式面板
└── App.tsx                            # 主应用注册
```

这个指南结合了官方最佳实践和实际开发中的经验教训，帮助避免常见的实现陷阱，确保自定义组件与Tldraw生态系统良好集成。