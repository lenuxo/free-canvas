import React, { useEffect } from 'react'
import { Editor, TLTool } from 'tldraw'

// 自定义工具接口
interface CustomToolProps {
	id: string
	label: string
	icon: React.ReactNode
	editor?: Editor | null
	isActive: boolean
	onClick: () => void
}

// 基础自定义工具组件
export function CustomTool({ id, label, icon, editor, isActive, onClick }: CustomToolProps) {
	useEffect(() => {
		if (isActive && editor) {
			// 当工具被激活时，可以设置初始状态
			console.log(`Custom tool ${id} activated`)

			// 设置工具特定的键盘快捷键
			const handleKeyDown = (e: KeyboardEvent) => {
				// 这里可以添加自定义快捷键逻辑
				if (e.key === 'Escape') {
					// 按ESC退出工具
					onClick()
				}
			}

			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isActive, editor, id, onClick])

	return (
		<button
			onClick={onClick}
			className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
				isActive
					? 'bg-blue-500 text-white shadow-md transform scale-105'
					: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
			}`}
			title={label}
		>
			{icon}
		</button>
	)
}

// 高级自定义工具类（完全自定义的行为）
export class AdvancedCustomTool implements TLTool {
	id = 'advanced-custom'
	label = '高级自定义工具'
	icon = '🔧'
	kbd = 'x'

	onEnter = (editor: Editor) => {
		// 进入工具时的初始化逻辑
		console.log('Advanced custom tool activated')

		// 可以设置特定样式或状态
		editor.setStyleForNextShapes('geo', {
			geo: 'rectangle',
			fill: 'solid',
			color: 'blue',
			dash: 'draw',
			size: 'm'
		})
	}

	onExit = (editor: Editor) => {
		// 退出工具时的清理逻辑
		console.log('Advanced custom tool deactivated')
	}

	onPointerDown = (info: { editor: Editor; point: number[] }) => {
		const { editor, point } = info

		// 在点击位置创建自定义形状
		editor.createShape({
			type: 'geo',
			x: point[0] - 50,
			y: point[1] - 50,
			props: {
				geo: 'rectangle',
				w: 100,
				h: 100,
				fill: 'solid',
				color: 'blue',
				dash: 'draw',
				size: 'm'
			}
		})
	}

	onPointerMove = (info: { editor: Editor; point: number[] }) => {
		// 鼠标移动时的逻辑（可选）
	}

	onPointerUp = (info: { editor: Editor; point: number[] }) => {
		// 鼠标松开时的逻辑（可选）
	}
}

// 注册自定义工具的函数
export function registerCustomTools(editor: Editor) {
	// 注册高级自定义工具
	editor.registerTool(AdvancedCustomTool)

	// 可以注册更多自定义工具
	// editor.registerTool(AnotherCustomTool)
}

// 预留的自定义工具组件示例
export function StampTool({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
	return (
		<CustomTool
			id="stamp"
			label="印章工具"
			icon={
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>
			}
			isActive={isActive}
			onClick={onClick}
		/>
	)
}

// 预留的绘制工具组件示例
export function PenTool({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
	return (
		<CustomTool
			id="pen"
			label="画笔工具"
			icon={
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
				</svg>
			}
			isActive={isActive}
			onClick={onClick}
		/>
	)
}