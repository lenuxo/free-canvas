import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * 子工具项的定义
 */
export interface SubTool {
	id: string
	name: string
	onClick: () => void
}

/**
 * 工具集组件的属性
 */
export interface ToolsetMenuProps {
	/** 工具集的主图标 */
	icon: React.ReactNode
	/** 工具集的标签 */
	label: string
	/** 工具集的子工具列表 */
	subTools: SubTool[]
	/** 是否处于选中状态 */
	isActive?: boolean
	/** 自定义类名 */
	className?: string
	/** 延迟显示菜单的时间（毫秒） */
	delay?: number
}

/**
 * 工具集菜单组件 - 悬停展示子工具菜单
 *
 * 设计特点：
 * - 工具集在工具栏中占据一个图标位
 * - 悬停时显示包含所有子工具的垂直菜单
 * - 纯文字菜单，只显示工具名称
 * - 点击子工具激活对应的功能
 * - 智能定位，避免超出视窗
 */
export function ToolsetMenu({
	icon,
	label,
	subTools,
	isActive = false,
	className = '',
	delay = 300
}: ToolsetMenuProps) {
	const [isMenuVisible, setIsMenuVisible] = useState(false)
	const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom')
	const timeoutRef = useRef<NodeJS.Timeout>()
	const hideTimeoutRef = useRef<NodeJS.Timeout>()
	const menuRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	const handleMouseEnter = () => {
		// 清除任何待执行的隐藏定时器
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
		}
		// 清除显示定时器
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		// 设置新的显示定时器
		timeoutRef.current = setTimeout(() => {
			setIsMenuVisible(true)
		}, delay)
	}

	const handleMouseLeave = () => {
		// 清除显示定时器
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		// 延迟隐藏菜单，给用户时间移动到菜单上
		hideTimeoutRef.current = setTimeout(() => {
			setIsMenuVisible(false)
		}, 100)
	}

	const handleMenuMouseEnter = () => {
		// 当鼠标进入菜单时，清除隐藏定时器
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
		}
	}

	const handleMenuMouseLeave = () => {
		// 当鼠标离开菜单时，延迟隐藏
		hideTimeoutRef.current = setTimeout(() => {
			setIsMenuVisible(false)
		}, 100)
	}

	/**
	 * 调整菜单位置，避免超出视窗
	 */
	useEffect(() => {
		if (!isMenuVisible || !triggerRef.current || !menuRef.current) return

		const trigger = triggerRef.current.getBoundingClientRect()
		const menu = menuRef.current.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		// 检查菜单是否会超出底部
		if (trigger.bottom + menu.height + 8 > viewportHeight) {
			setMenuPosition('top')
		} else {
			setMenuPosition('bottom')
		}
	}, [isMenuVisible])

	/**
	 * 清理定时器
	 */
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current)
			}
		}
	}, [])

	/**
	 * 处理子工具点击
	 */
	const handleSubToolClick = (subTool: SubTool) => {
		subTool.onClick()
		setIsMenuVisible(false)
	}

	/**
	 * 计算菜单的定位样式
	 */
	const getMenuStyles = (): React.CSSProperties => {
		const baseStyles: React.CSSProperties = {
			position: 'absolute',
			zIndex: 9999,
			opacity: isMenuVisible ? 1 : 0,
			transform: isMenuVisible ? 'translateY(0)' : 'translateY(-4px)',
			transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
			pointerEvents: isMenuVisible ? 'auto' : 'none',
		}

		if (menuPosition === 'top') {
			return {
				...baseStyles,
				bottom: '100%',
				left: '50%',
				transform: isMenuVisible ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%) translateY(-4px)',
			}
		} else {
			return {
				...baseStyles,
				top: '100%',
				left: '50%',
				transform: isMenuVisible ? 'translateX(-50%) translateY(8px)' : 'translateX(-50%) translateY(4px)',
			}
		}
	}

	return (
		<div
			ref={triggerRef}
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* 工具集主按钮 */}
			<Button
				variant="ghost"
				size="sm"
				type="button"
				className={cn(
					"p-2 h-auto transition-all duration-200 flex items-center justify-center",
					isActive
						? 'bg-blue-500 text-white shadow-md transform scale-105 hover:bg-blue-600'
						: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105',
					className
				)}
				title={label}
			>
				{icon}
			</Button>

			{/* 子工具菜单 */}
			{isMenuVisible && (
				<div
					ref={menuRef}
					className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48"
					onMouseEnter={handleMenuMouseEnter}
					onMouseLeave={handleMenuMouseLeave}
					style={getMenuStyles()}
				>
					{/* 菜单标题 */}
					<div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
						{label}
					</div>

					{/* 子工具列表 */}
					<div className="max-h-64 overflow-y-auto">
						{subTools.map((subTool) => (
							<button
								key={subTool.id}
								type="button"
								onClick={() => handleSubToolClick(subTool)}
								className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors
									focus:outline-none focus:bg-gray-100 text-gray-700"
							>
								{subTool.name}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}