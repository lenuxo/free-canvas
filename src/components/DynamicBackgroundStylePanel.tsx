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
	heatmapColorsStyle,
	heatmapColorBackStyle,
	heatmapContourStyle,
	heatmapAngleStyle,
	heatmapNoiseStyle,
	heatmapInnerGlowStyle,
	heatmapOuterGlowStyle,
	heatmapScaleStyle,
} from '../styles/dynamic-background-styles'

/**
 * 动态背景自定义样式面板
 *
 * 支持多种动态背景类型的配置：
 * - 渐变流动背景：动画速度、颜色配置
 * - 热力图背景：颜色、效果参数配置
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

	// Heatmap 特有样式
	const heatmapColors = styles.get(heatmapColorsStyle)
	const heatmapColorBack = styles.get(heatmapColorBackStyle)
	const heatmapContour = styles.get(heatmapContourStyle)
	const heatmapAngle = styles.get(heatmapAngleStyle)
	const heatmapNoise = styles.get(heatmapNoiseStyle)
	const heatmapInnerGlow = styles.get(heatmapInnerGlowStyle)
	const heatmapOuterGlow = styles.get(heatmapOuterGlowStyle)
	const heatmapScale = styles.get(heatmapScaleStyle)

	// 标记历史停止点，用于样式更改
	const markHistoryPoint = () => {
		editor.markHistoryStoppingPoint()
	}

	// 设置样式的通用函数
	const setStyle = (styleProp: any, value: any) => {
		editor.setStyleForSelectedShapes(styleProp, value)
	}

	// 渲染渐变流动背景配置
	const renderGradientFlowConfig = () => (
		<div className="space-y-4">
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
	)

	// 渲染热力图背景配置
	const renderHeatmapConfig = () => {
		// 解析颜色字符串为数组
		const colorsArray = heatmapColors?.value?.split(',') || [
			'#112069', '#1f3ca3', '#3265e7', '#6bd8ff',
			'#ffe77a', '#ff9a1f', '#ff4d00'
		]

		return (
			<div className="space-y-4">
				{/* 颜色列表 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						颜色列表 (用逗号分隔)
					</label>
					<textarea
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={heatmapColors?.type === 'mixed' ? '' : heatmapColors?.value || ''}
						onChange={(e) => {
							markHistoryPoint()
							const value = e.currentTarget.value
							setStyle(heatmapColorsStyle, value)
						}}
						placeholder="#112069,#1f3ca3,#3265e7,#6bd8ff,#ffe77a,#ff9a1f,#ff4d00"
						rows={3}
					/>
					<div className="mt-2 flex flex-wrap gap-1">
						{colorsArray.map((color, index) => (
							<div
								key={index}
								className="w-6 h-6 rounded border border-gray-300"
								style={{ backgroundColor: color }}
								title={color}
							/>
						))}
					</div>
				</div>

				{/* 背景色 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						背景色
					</label>
					<div className="flex items-center space-x-2">
						<input
							type="color"
							className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
							value={heatmapColorBack?.type === 'mixed' ? '#000000' : heatmapColorBack?.value || '#000000'}
							onChange={(e) => {
								markHistoryPoint()
								const value = e.currentTarget.value
								if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
									setStyle(heatmapColorBackStyle, value)
								}
							}}
							title="背景色选择器"
						/>
						<input
							type="text"
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={heatmapColorBack?.type === 'mixed' ? '' : heatmapColorBack?.value || ''}
							onChange={(e) => {
								markHistoryPoint()
								const value = e.currentTarget.value
								if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
									setStyle(heatmapColorBackStyle, value)
								}
							}}
							placeholder="#000000"
						/>
					</div>
				</div>

				{/* 轮廓强度 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						轮廓强度: {heatmapContour?.value?.toFixed(2)}
					</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						className="w-full"
						value={heatmapContour?.type === 'mixed' ? 0.5 : heatmapContour?.value || 0.5}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapContourStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</div>
				</div>

				{/* 角度 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						角度: {heatmapAngle?.value?.toFixed(0)}°
					</label>
					<input
						type="range"
						min="0"
						max="360"
						step="1"
						className="w-full"
						value={heatmapAngle?.type === 'mixed' ? 0 : heatmapAngle?.value || 0}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapAngleStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0°</span>
						<span>180°</span>
						<span>360°</span>
					</div>
				</div>

				{/* 噪声 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						噪声: {heatmapNoise?.value?.toFixed(2)}
					</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						className="w-full"
						value={heatmapNoise?.type === 'mixed' ? 0 : heatmapNoise?.value || 0}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapNoiseStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</div>
				</div>

				{/* 内部发光 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						内部发光: {heatmapInnerGlow?.value?.toFixed(2)}
					</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						className="w-full"
						value={heatmapInnerGlow?.type === 'mixed' ? 0.5 : heatmapInnerGlow?.value || 0.5}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapInnerGlowStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</div>
				</div>

				{/* 外部发光 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						外部发光: {heatmapOuterGlow?.value?.toFixed(2)}
					</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						className="w-full"
						value={heatmapOuterGlow?.type === 'mixed' ? 0.5 : heatmapOuterGlow?.value || 0.5}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapOuterGlowStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</div>
				</div>

				{/* 缩放 */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						缩放: {heatmapScale?.value?.toFixed(2)}
					</label>
					<input
						type="range"
						min="0.01"
						max="4"
						step="0.01"
						className="w-full"
						value={heatmapScale?.type === 'mixed' ? 0.75 : heatmapScale?.value || 0.75}
						onChange={(e) => {
							markHistoryPoint()
							const value = parseFloat(e.currentTarget.value)
							setStyle(heatmapScaleStyle, value)
						}}
					/>
					<div className="flex justify-between text-xs text-gray-500">
						<span>0.01</span>
						<span>0.75</span>
						<span>4</span>
					</div>
				</div>
			</div>
		)
	}

	// 获取背景类型的中文名称
	const getBackgroundTypeName = (type: string) => {
		switch (type) {
			case 'gradient-flow': return '渐变流动背景'
			case 'heatmap': return '热力图背景'
			default: return '动态背景'
		}
	}

	return (
		<DefaultStylePanel>
			<DefaultStylePanelContent />

			{backgroundType && (
				<div className="space-y-4 p-4 border-t border-gray-200">
					{/* 背景类型标题 */}
					<div className="text-sm font-medium text-gray-700">
						{getBackgroundTypeName(backgroundType.value)}
					</div>

					{/* 动画速度 - 所有背景类型通用 */}
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

					{/* 根据背景类型显示不同的配置选项 */}
					{backgroundType.value === 'gradient-flow' && renderGradientFlowConfig()}
					{backgroundType.value === 'heatmap' && renderHeatmapConfig()}
				</div>
			)}
		</DefaultStylePanel>
	)
}

export default DynamicBackgroundStylePanel