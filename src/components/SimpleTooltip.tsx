import React, { useState, useRef, useEffect } from 'react'

interface SimpleTooltipProps {
	children: React.ReactNode
	content: string
	position?: 'top' | 'bottom' | 'left' | 'right'
	delay?: number
	className?: string
}

/**
 * 简单可靠的 Tooltip 组件
 *
 * 设计特点：
 * - 基于CSS position: absolute，简单可靠
 * - 支持四个方向定位
 * - 可配置显示延迟时间
 * - 自动避免超出视窗边界
 * - 平滑的显示/隐藏动画
 */
export function SimpleTooltip({
	children,
	content,
	position = 'top',
	delay = 600,
	className = ''
}: SimpleTooltipProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [finalPosition, setFinalPosition] = useState(position)
	const timeoutRef = useRef<NodeJS.Timeout>()
	const tooltipRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	const handleMouseEnter = () => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(true)
		}, delay)
	}

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		setIsVisible(false)
	}

	/**
	 * 智能位置调整 - 避免tooltip超出视窗边界
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
				if (trigger.top < tooltip.height + 8) {
					adjustedPosition = 'bottom'
				}
				break
			case 'bottom':
				if (trigger.bottom + tooltip.height + 8 > viewport.height) {
					adjustedPosition = 'top'
				}
				break
			case 'left':
				if (trigger.left < tooltip.width + 8) {
					adjustedPosition = 'right'
				}
				break
			case 'right':
				if (trigger.right + tooltip.width + 8 > viewport.width) {
					adjustedPosition = 'left'
				}
				break
		}

		setFinalPosition(adjustedPosition)
	}, [isVisible, position])

	/**
	 * 清理定时器
	 */
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	/**
	 * 计算tooltip的定位样式
	 */
	const getTooltipStyles = (): React.CSSProperties => {
		const baseStyles: React.CSSProperties = {
			position: 'absolute',
			zIndex: 9999,
			pointerEvents: 'none',
			opacity: isVisible ? 1 : 0,
			transform: isVisible ? 'translateY(0)' : 'translateY(4px)',
			transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
		}

		switch (finalPosition) {
			case 'top':
				return {
					...baseStyles,
					bottom: '100%',
					left: '50%',
					transform: isVisible ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%) translateY(-4px)',
				}
			case 'bottom':
				return {
					...baseStyles,
					top: '100%',
					left: '50%',
					transform: isVisible ? 'translateX(-50%) translateY(8px)' : 'translateX(-50%) translateY(4px)',
				}
			case 'left':
				return {
					...baseStyles,
					right: '100%',
					top: '50%',
					transform: isVisible ? 'translateY(-50%) translateX(-8px)' : 'translateY(-50%) translateX(-4px)',
				}
			case 'right':
				return {
					...baseStyles,
					left: '100%',
					top: '50%',
					transform: isVisible ? 'translateY(-50%) translateX(8px)' : 'translateY(-50%) translateX(4px)',
				}
			default:
				return baseStyles
		}
	}

	/**
	 * 获取箭头样式
	 */
	const getArrowStyles = (): React.CSSProperties => {
		const baseArrowStyles: React.CSSProperties = {
			position: 'absolute',
			width: 0,
			height: 0,
			border: '4px solid transparent',
		}

		switch (finalPosition) {
			case 'top':
				return {
					...baseArrowStyles,
					bottom: '-8px',
					left: '50%',
					transform: 'translateX(-50%)',
					borderTopColor: '#1f2937',
				}
			case 'bottom':
				return {
					...baseArrowStyles,
					top: '-8px',
					left: '50%',
					transform: 'translateX(-50%)',
					borderBottomColor: '#1f2937',
				}
			case 'left':
				return {
					...baseArrowStyles,
					right: '-8px',
					top: '50%',
					transform: 'translateY(-50%)',
					borderLeftColor: '#1f2937',
				}
			case 'right':
				return {
					...baseArrowStyles,
					left: '-8px',
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

			{/* Tooltip内容 */}
			{isVisible && (
				<div
					ref={tooltipRef}
					className={`
						px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg
						whitespace-nowrap
						${className}
					`}
					style={getTooltipStyles()}
				>
					{content}
					{/* 箭头 */}
					<div style={getArrowStyles()} />
				</div>
			)}
		</div>
	)
}