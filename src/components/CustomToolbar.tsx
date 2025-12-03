import React from 'react'
import { Editor, useDefaultHelpers } from 'tldraw'
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

	// 获取默认 helpers
	const { insertMedia } = useDefaultHelpers()

	const handleToolClick = (toolId: string) => {
		onToolSelect(toolId)
		// 使用工具管理器处理工具切换
		if (editor) {
			toolManager.switchToTool(toolId)
		}
	}

	const handleImageClick = () => {
		// 直接调用 Tldraw 的原生图片上传
		insertMedia()
	}

	// 获取工具配置
	const toolConfig = toolManager.getToolConfigurations()
	const { basicTools, mediaTools, customTools } = toolConfig

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2 z-50 border border-gray-200">
			{/* 基础工具组 */}
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
				<div className="border-l border-gray-300 mx-1" />
			)}

			{/* Media工具组 */}
			{mediaTools.map((tool) => (
				<button
					key={tool.id}
					type="button"
					onClick={tool.id === 'image' ? handleImageClick : () => handleToolClick(tool.id)}
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
			{(mediaTools.length > 0 && customTools.length > 0) && (
				<div className="border-l border-gray-300 mx-1" />
			)}

			{/* 自定义工具组 */}
			{customTools.map((tool) => (
				<button
					key={tool.id}
					type="button"
					onClick={() => handleToolClick(tool.id)}
					className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
						selectedTool === tool.id
							? 'bg-green-500 text-white shadow-md transform scale-105'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
					}`}
					title={tool.label}
				>
					{tool.icon}
				</button>
			))}
		</div>
	)
}