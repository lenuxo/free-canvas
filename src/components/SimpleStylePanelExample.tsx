import React from 'react'
import {
	DefaultStylePanelContent,
	StylePanelSection,
	useEditor,
	useRelevantStyles,
} from 'tldraw'

/**
 * 简单的样式面板示例
 *
 * 这个例子展示了如何正确创建自定义样式面板：
 * 1. 使用 DefaultStylePanelContent 显示默认样式
 * 2. 使用 StylePanelSection 组织自定义控件
 * 3. 正确处理样式值的读取和设置
 */
function SimpleStylePanelExample() {
	const editor = useEditor()
	const styles = useRelevantStyles()

	if (!styles) return null

	// 示例：获取当前选中形状的某个样式属性
	// 这里使用 color 作为示例，实际项目中应该使用自定义的样式
	const colorStyle = styles.get('color' as any)

	// 示例：设置样式的函数
	const setCustomStyle = (value: any) => {
		// 为选中的形状设置样式
		editor.setStyleForSelectedShapes('color' as any, value)
	}

	// 标记历史点
	const markHistory = () => {
		editor.markHistoryStoppingPoint()
	}

	return (
		<div className="tlui-style-panel">
			{/* 1. 显示默认的样式面板内容 */}
			<DefaultStylePanelContent />

			{/* 2. 添加自定义样式部分 */}
			<StylePanelSection>
				<div className="p-4">
					<h3 className="text-sm font-medium mb-3">自定义样式</h3>

					{/* 示例：自定义颜色选择器 */}
					<div className="space-y-2">
						<label className="text-xs text-gray-600">自定义颜色</label>
						<div className="flex gap-2">
							<input
								type="color"
								value={colorStyle?.type !== 'mixed' ? (colorStyle?.value || '#000000') : '#000000'}
								onChange={(e) => {
									markHistory()
									setCustomStyle(e.target.value)
								}}
								className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
							/>
							<input
								type="text"
								placeholder="#000000"
								value={colorStyle?.type !== 'mixed' ? (colorStyle?.value || '') : ''}
								onChange={(e) => {
									if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
										markHistory()
										setCustomStyle(e.target.value)
									}
								}}
								className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
							/>
						</div>
					</div>

					{/* 示例：自定义按钮组 */}
					<div className="mt-4">
						<label className="text-xs text-gray-600 block mb-2">快速样式</label>
						<div className="flex gap-2">
							{['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((color) => (
								<button
									key={color}
									onClick={() => {
										markHistory()
										setCustomStyle(color)
									}}
									className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
									style={{ backgroundColor: color }}
									title={`设置颜色为 ${color}`}
								/>
							))}
						</div>
					</div>
				</div>
			</StylePanelSection>
		</div>
	)
}

export default SimpleStylePanelExample