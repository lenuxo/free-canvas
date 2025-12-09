import React from 'react'
import {
	DefaultStylePanel,
	DefaultStylePanelContent,
	useEditor,
	useRelevantStyles,
} from 'tldraw'
import {
	backgroundTypeStyle,
	animationSpeedStyle,
	primaryColorStyle,
	secondaryColorStyle,
} from '../styles/dynamic-background-styles'

/**
 * 动态背景自定义样式面板
 *
 * 提供针对渐变流动背景的配置项：
 * - 动画速度调节
 * - 颜色配置
 */
function DynamicBackgroundStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()

	if (!styles) return null

	// 获取当前选中的样式值
	const backgroundType = styles.get(backgroundTypeStyle)
	const animationSpeed = styles.get(animationSpeedStyle)
	const primaryColor = styles.get(primaryColorStyle)
	const secondaryColor = styles.get(secondaryColorStyle)

	// 标记历史停止点，用于样式更改
	const markHistoryPoint = () => {
		editor.markHistoryStoppingPoint()
	}

	// 设置样式的通用函数
	const setStyle = (styleProp: any, value: any) => {
		editor.setStyleForSelectedShapes(styleProp, value)
	}

	return (
		<DefaultStylePanel>
			<DefaultStylePanelContent />

			{backgroundType && (
				<div className="space-y-4 p-4 border-t border-gray-200">
					{/* 渐变背景标题 */}
					<div className="text-sm font-medium text-gray-700">
						渐变流动背景
					</div>

					{/* 动画速度 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							动画速度: {animationSpeed?.value?.toFixed(1)}x
							{animationSpeed?.type === 'mixed' && ' (混合)'}
						</label>
						<input
							type="range"
							min="0.1"
							max="3.0"
							step="0.1"
							className="w-full"
							value={animationSpeed?.type === 'mixed' ? 1.0 : animationSpeed?.value || 1.0}
							onChange={(e) => {
								markHistoryPoint()
								const value = parseFloat(e.currentTarget.value)
								if (value >= 0.1 && value <= 3.0) {
									setStyle(animationSpeedStyle, value)
								}
							}}
							title="动画速度调节滑块"
							placeholder="1.0"
						/>
						<div className="flex justify-between text-xs text-gray-500">
							<span>0.1x</span>
							<span>1.0x</span>
							<span>3.0x</span>
						</div>
					</div>

					{/* 主色调 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							主色调
						</label>
						<div className="flex items-center space-x-2">
							<input
								type="color"
								className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
								value={primaryColor?.type === 'mixed' ? '#3b82f6' : primaryColor?.value || '#3b82f6'}
								onChange={(e) => {
									markHistoryPoint()
									const value = e.currentTarget.value
									if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
										setStyle(primaryColorStyle, value)
									}
								}}
								title="主色调选择器"
							/>
							<input
								type="text"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={primaryColor?.type === 'mixed' ? '' : primaryColor?.value || ''}
								onChange={(e) => {
									markHistoryPoint()
									const value = e.currentTarget.value
									if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
										setStyle(primaryColorStyle, value)
									}
								}}
								placeholder="#3b82f6"
							/>
						</div>
					</div>

					{/* 次色调 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							次色调
						</label>
						<div className="flex items-center space-x-2">
							<input
								type="color"
								className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
								value={secondaryColor?.type === 'mixed' ? '#8b5cf6' : secondaryColor?.value || '#8b5cf6'}
								onChange={(e) => {
									markHistoryPoint()
									const value = e.currentTarget.value
									if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
										setStyle(secondaryColorStyle, value)
									}
								}}
								title="次色调选择器"
							/>
							<input
								type="text"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={secondaryColor?.type === 'mixed' ? '' : secondaryColor?.value || ''}
								onChange={(e) => {
									markHistoryPoint()
									const value = e.currentTarget.value
									if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
										setStyle(secondaryColorStyle, value)
									}
								}}
								placeholder="#8b5cf6"
							/>
						</div>
					</div>
				</div>
			)}
		</DefaultStylePanel>
	)
}

export default DynamicBackgroundStylePanel