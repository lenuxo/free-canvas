import React from 'react'
import { Editor } from 'tldraw'
import { toolManager } from '../utils/ToolManager'

interface CustomToolbarProps {
	selectedTool: string
	onToolSelect: (tool: string) => void
	editor?: Editor | null
}

export function CustomToolbar({ selectedTool, onToolSelect, editor }: CustomToolbarProps) {
	// 设置编辑器到工具管理器
	React.useEffect(() => {
		if (editor) {
			toolManager.setEditor(editor)
		}
	}, [editor])

	// 获取所有工具配置
	const toolConfig = toolManager.getToolConfigurations()
	const { basicTools, mediaTools, customTools } = toolConfig

	// 只显示你要求的四个工具：选择、手型、文本、media
	const displayTools = [...basicTools, ...mediaTools]

	const handleToolClick = (toolId: string) => {
		onToolSelect(toolId)
		// 使用工具管理器处理工具切换
		if (editor) {
			toolManager.switchToTool(toolId)
		}
	}

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2 z-50 border border-gray-200">
			{/* 基础工具组：选择、手型、文本 */}
			{basicTools.map((tool) => (
				<button
					key={tool.id}
					type="button"
					onClick={() => handleToolClick(tool.id)}
					className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
						selectedTool === tool.id
							? 'bg-blue-500 text-white shadow-md transform scale-105'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
					}`}
					title={tool.label}
				>
					{tool.icon}
				</button>
			))}

			{/* 分隔线 */}
			{basicTools.length > 0 && mediaTools.length > 0 && (
				<div className="border-l border-gray-300 mx-1"/>
			)}

			{/* Media工具组：图片 */}
			{mediaTools.map((tool) => (
				<button
					key={tool.id}
					type="button"
					onClick={() => handleToolClick(tool.id)}
					className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
						selectedTool === tool.id
							? 'bg-blue-500 text-white shadow-md transform scale-105'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
					}`}
					title={tool.label}
				>
					{tool.icon}
				</button>
			))}

			{/* 扩展工具分隔线 */}
			{mediaTools.length > 0 && (
				<div className="border-l border-gray-300 mx-1"/>
			)}

			{/* 扩展工具区域 - 预留给未来的新工具 */}
			<button
				type="button"
				onClick={() => {
					console.log('扩展工具区域点击 - 这里可以添加更多工具')
					// 这里可以打开一个工具面板或者显示更多工具选项
				}}
				className="p-2 rounded bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm font-medium"
				title="更多工具即将推出"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 8c1.1 0 2-.9 2-2s-.9 2-2 .9 2 2zm0 2c-1.1 0-2 .9-2 2s-.9 2-2-.9 2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2-.9 2-2-.9 2-2z"/>
				</svg>
			</button>
		</div>
	)
}