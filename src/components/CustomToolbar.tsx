import React from 'react'
import { Editor, useDefaultHelpers } from 'tldraw'
import { toolManager } from '../utils/ToolManager'
import { Tooltip } from './Tooltip'

interface CustomToolbarProps {
	selectedTool: string
	onToolSelect: (tool: string) => void
	editor?: Editor | null
}

/**
 * 自定义工具栏组件 - 替代Tldraw原生UI的关键组件
 *
 * 设计原理：
 * - 在Tldraw组件内部渲染，通过onMount获取编辑器实例
 * - 接收editor prop，用于调用Tldraw的各种API功能
 * - 集成工具管理器，统一处理工具切换逻辑
 *
 * 工具栏集成要点：
 * 1. 通过onMount回调获取编辑器实例，这是连接自定义UI与Tldraw功能的桥梁
 * 2. 使用toolManager统一管理工具状态和切换逻辑
 * 3. 支持原生工具和自定义工具的混合使用
 */
export function CustomToolbar({ selectedTool, onToolSelect, editor }: CustomToolbarProps) {
	/**
	 * 编辑器实例设置 - 将editor传递给工具管理器
	 * 确保工具管理器可以调用Tldraw的API（如setCurrentTool、select等）
	 */
	React.useEffect(() => {
		if (editor) {
			toolManager.setEditor(editor)
		}
	}, [editor])

	// 获取Tldraw默认辅助函数（如插入媒体等）
	const { insertMedia } = useDefaultHelpers()

	/**
	 * 工具点击处理 - 统一的工具切换逻辑
	 *
	 * 处理流程：
	 * 1. 更新本地选中状态（UI反馈）
	 * 2. 调用工具管理器执行实际的工具切换
	 */
	const handleToolClick = (toolId: string) => {
		onToolSelect(toolId)
		// 委托给工具管理器处理具体的工具切换逻辑
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
				<Tooltip key={tool.id} content={tool.label} position="bottom">
					<button
						type="button"
						onClick={() => handleToolClick(tool.id)}
						className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
							selectedTool === tool.id
								? 'bg-blue-500 text-white shadow-md transform scale-105'
								: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
						}`}
					>
						{tool.icon}
					</button>
				</Tooltip>
			))}

			{/* 分隔线 */}
			{basicTools.length > 0 && mediaTools.length > 0 && (
				<div className="border-l border-gray-300 mx-1" />
			)}

			{/* Media工具组 */}
			{mediaTools.map((tool) => (
				<Tooltip key={tool.id} content={tool.label} position="bottom">
					<button
						type="button"
						onClick={tool.id === 'image' ? handleImageClick : () => handleToolClick(tool.id)}
						className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
							selectedTool === tool.id
								? 'bg-blue-500 text-white shadow-md transform scale-105'
								: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
						}`}
					>
						{tool.icon}
					</button>
				</Tooltip>
			))}

			{/* 分隔线 */}
			{(mediaTools.length > 0 && customTools.length > 0) && (
				<div className="border-l border-gray-300 mx-1" />
			)}

			{/* 自定义工具组 */}
			{customTools.map((tool) => (
				<Tooltip key={tool.id} content={tool.label} position="bottom">
					<button
						type="button"
						onClick={() => handleToolClick(tool.id)}
						className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
							selectedTool === tool.id
								? 'bg-green-500 text-white shadow-md transform scale-105'
								: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
						}`}
					>
						{tool.icon}
					</button>
				</Tooltip>
			))}
		</div>
	)
}