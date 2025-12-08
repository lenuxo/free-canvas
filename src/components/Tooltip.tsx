import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
	children: React.ReactNode
	content: string
	position?: 'top' | 'bottom' | 'left' | 'right'
	delay?: number
	className?: string
}

/**
 * 通用 Tooltip 组件 - 提供优雅的悬停提示功能
 *
 * 设计特点：
 * - 支持四个方向的 tooltip 定位
 * - 可配置显示延迟时间
 * - 平滑的显示/隐藏动画效果
 * - 智能边界检测，避免超出视窗
 * - 完全可定制的样式
 *
 * 技术实现：
 * - 使用 React hooks (useState, useRef, useEffect)
 * - 通过 CSS transforms 实现平滑动画
 * - 智能定位算法，自动调整位置避免溢出
 */
export function Tooltip({
	children,
	content,
	position = 'top',
	delay = 600,
	className = ''
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [finalPosition, setFinalPosition] = useState(position)
	const timeoutRef = useRef<NodeJS.Timeout>()
	const tooltipRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	/**
	 * 处理鼠标进入 - 延迟显示 tooltip
	 * 使用 delay 参数控制显示时机，避免鼠标快速划过时频繁显示
	 */
	const handleMouseEnter = () => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(true)
		}, delay)
	}

	/**
	 * 处理鼠标离开 - 立即隐藏 tooltip
	 * 清除延迟显示的定时器，确保状态一致性
	 */
	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		setIsVisible(false)
	}

	/**
	 * 智能位置调整 - 避免 tooltip 超出视窗边界
	 *
	 * 调整逻辑：
	 * 1. 获取触发器和 tooltip 的边界信息
	 * 2. 根据首选位置计算 tooltip 应该显示的位置
	 * 3. 检查是否会超出视窗边界
	 * 4. 如果超出，自动调整到合适的位置
	 */
	useEffect(() => {
		if (!isVisible || !triggerRef.current || !tooltipRef.current) return

		const trigger = triggerRef.current.getBoundingClientRect()
		const tooltip = tooltipRef.current.getBoundingClientRect()
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		}

		let adjustedPosition = position

		// 根据位置检测边界并调整
		switch (position) {
			case 'top':
				if (trigger.top < tooltip.height) {
					adjustedPosition = 'bottom'
				}
				break
			case 'bottom':
				if (trigger.bottom + tooltip.height > viewport.height) {
					adjustedPosition = 'top'
				}
				break
			case 'left':
				if (trigger.left < tooltip.width) {
					adjustedPosition = 'right'
				}
				break
			case 'right':
				if (trigger.right + tooltip.width > viewport.width) {
					adjustedPosition = 'left'
				}
				break
		}

		setFinalPosition(adjustedPosition)
	}, [isVisible, position])

	/**
	 * 组件清理 - 清理定时器避免内存泄漏
	 */
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	/**
	 * 计算 tooltip 的定位样式
	 *
	 * 定位策略：
	 * - 使用绝对定位相对于触发器
	 * - 根据最终位置计算 top、left、transform 值
	 * - 使用 CSS 变量实现动态位置计算
	 */
	const getTooltipStyles = () => {
		const baseStyles: React.CSSProperties = {
			position: 'absolute',
			zIndex: 1000,
			pointerEvents: 'none',
		}

		switch (finalPosition) {
			case 'top':
				return {
					...baseStyles,
					bottom: '100%',
					left: '50%',
					transform: 'translateX(-50%) translateY(-8px)',
				}
			case 'bottom':
				return {
					...baseStyles,
					top: '100%',
					left: '50%',
					transform: 'translateX(-50%) translateY(8px)',
				}
			case 'left':
				return {
					...baseStyles,
					right: '100%',
					top: '50%',
					transform: 'translateY(-50%) translateX(-8px)',
				}
			case 'right':
				return {
					...baseStyles,
					left: '100%',
					top: '50%',
					transform: 'translateY(-50%) translateX(8px)',
				}
			default:
				return baseStyles
		}
	}

	/**
	 * 获取 tooltip 箭头的样式
	 * 箭头指向触发器，提供视觉连接
	 */
	const getArrowStyles = () => {
		const baseArrowStyles: React.CSSProperties = {
			position: 'absolute',
			width: 0,
			height: 0,
			border: '5px solid transparent',
		}

		switch (finalPosition) {
			case 'top':
				return {
					...baseArrowStyles,
					bottom: '-10px',
					left: '50%',
					transform: 'translateX(-50%)',
					borderTopColor: '#1f2937',
				}
			case 'bottom':
				return {
					...baseArrowStyles,
					top: '-10px',
					left: '50%',
					transform: 'translateX(-50%)',
					borderBottomColor: '#1f2937',
				}
			case 'left':
				return {
					...baseArrowStyles,
					right: '-10px',
					top: '50%',
					transform: 'translateY(-50%)',
					borderLeftColor: '#1f2937',
				}
			case 'right':
				return {
					...baseArrowStyles,
					left: '-10px',
					top: '50%',
					transform: 'translateY(-50%)',
					borderRightColor: '#1f2937',
				}
			default:
				return baseArrowStyles
		}
	}

	return (
		<div
			ref={triggerRef}
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}

			{/* Tooltip 内容 */}
			{isVisible && (
				<div
					ref={tooltipRef}
					className={`
						px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg
						opacity-0 transition-opacity duration-200 ease-in-out
						whitespace-nowrap z-50
						${className}
					`}
					style={{
						...getTooltipStyles(),
						opacity: isVisible ? 1 : 0,
					}}
				>
					{content}

					{/* Tooltip 箭头 */}
					<div style={getArrowStyles()} />
				</div>
			)}
		</div>
	)
}