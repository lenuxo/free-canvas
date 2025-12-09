# Tldraw 4.2.0 样式面板实现指南

## 问题分析

在 Tldraw 4.2.0 中，`StylePanelContent` 不是一个直接导出的组件。尝试导入这个组件会导致错误：
```
The requested module does not provide an export named 'StylePanelContent'
```

## 正确的实现方法

### 1. 使用正确的组件

Tldraw 4.2.0 提供以下样式面板相关组件：

- **DefaultStylePanel** - 完整的默认样式面板组件
- **DefaultStylePanelContent** - 默认样式面板内容（不包含容器）
- **StylePanelSection** - 用于组织自定义控件的区域组件
- **各种 StylePanel*Picker** - 预构建的样式选择器组件

### 2. 基本实现模式

```typescript
import {
	DefaultStylePanelContent,
	StylePanelSection,
	useEditor,
	useRelevantStyles,
} from 'tldraw'

function CustomStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()

	if (!styles) return null

	// 检查是否显示自定义样式
	const shouldShowCustom = checkIfCustomStylesNeeded(styles)

	// 如果不需要自定义样式，只显示默认面板
	if (!shouldShowCustom) {
		return <DefaultStylePanelContent />
	}

	// 返回包含默认内容和自定义扩展的面板
	return (
		<div className="tlui-style-panel">
			{/* 显示默认样式内容 */}
			<DefaultStylePanelContent />

			{/* 添加自定义样式控件 */}
			<StylePanelSection>
				{/* 自定义控件内容 */}
			</StylePanelSection>
		</div>
	)
}
```

### 3. 样式值的读取和处理

使用 `useRelevantStyles` hook 获取当前选中形状的样式：

```typescript
const styles = useRelevantStyles()

// 获取特定样式值
const colorStyle = styles.get(myCustomStyle)

// 处理不同类型的样式值
if (colorStyle?.type === 'mixed') {
	// 混合状态 - 多个形状有不同的值
} else {
	// 统一值 - colorStyle.value
}
```

### 4. 样式的设置

使用 `editor.setStyleForSelectedShapes` 设置样式：

```typescript
const setStyle = (styleProp, value) => {
	// 标记历史停止点，用于撤销/重做
	editor.markHistoryStoppingPoint()

	// 设置样式
	editor.setStyleForSelectedShapes(styleProp, value)
}
```

## 组件使用说明

### DefaultStylePanelContent
- 显示所有默认的样式控件（颜色、线条、填充等）
- 不接受 children 属性
- 独立使用，不需要包装容器

### StylePanelSection
- 用于组织自定义样式控件
- 提供视觉分组和一致的外观
- 接受 children 作为内容

### 样式面板 Picker 组件

Tldraw 提供多种预构建的样式选择器：

- `StylePanelColorPicker` - 颜色选择器
- `StylePanelFillPicker` - 填充样式选择器
- `StylePanelDashPicker` - 虚线样式选择器
- `StylePanelFontPicker` - 字体选择器
- `StylePanelGeoShapePicker` - 几何形状选择器

## 实际应用示例

### 完整的自定义样式面板

参考项目中的 `DynamicBackgroundStylePanel.tsx` 文件，它展示了：

1. 条件性显示自定义控件（只在选中特定形状时显示）
2. 默认样式内容的保留
3. 自定义控件的组织和布局
4. 样式值的正确处理

### 在 Tldraw 组件中使用

```typescript
<Tldraw
	components={{
		StylePanel: () => <CustomStylePanel />
	}}
/>
```

## 注意事项

1. **不要尝试包装 DefaultStylePanelContent** - 它是一个独立的组件
2. **使用 StylePanelSection** 来组织自定义控件
3. **正确处理混合状态** - 多个选中形状可能有不同的样式值
4. **标记历史点** - 在更改样式前调用 `markHistoryStoppingPoint()`
5. **保持样式一致性** - 使用 Tldraw 的样式系统而不是直接的 CSS 样式

## 调试技巧

1. 使用 `console.log(styles)` 查看可用的样式
2. 检查样式值的 `type` 属性来判断是否为混合状态
3. 确保自定义样式已正确定义和注册
4. 验证组件是否正确地接收到了 styles 对象