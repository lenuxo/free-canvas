import React from 'react'
import { Heatmap } from '@paper-design/shaders-react'

export interface HeatmapBackgroundProps {
	width?: number
	height?: number
	image?: string
	colors?: string[]
	colorBack?: string
	contour?: number
	angle?: number
	noise?: number
	innerGlow?: number
	outerGlow?: number
	speed?: number
	scale?: number
	className?: string
}

export const HeatmapBackground: React.FC<HeatmapBackgroundProps> = ({
	width = 800,
	height = 600,
	image = "https://shaders.paper.design/images/logos/diamond.svg",
	colors = ["#112069", "#1f3ca3", "#3265e7", "#6bd8ff", "#ffe77a", "#ff9a1f", "#ff4d00"],
	colorBack = "#000000",
	contour = 0.5,
	angle = 0,
	noise = 0,
	innerGlow = 0.5,
	outerGlow = 0.5,
	speed = 1,
	scale = 0.75,
	className = ""
}) => {
	// 添加动画帧管理，确保shader动画流畅
	const [frame, setFrame] = React.useState(0)

	React.useEffect(() => {
		if (speed === 0) return

		let animationFrameId: number
		let startTime = Date.now()

		const animate = () => {
			const currentTime = Date.now() - startTime
			setFrame(currentTime)
			animationFrameId = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId)
			}
		}
	}, [speed])

	return (
		<div
			className={`heatmap-background ${className}`}
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden'
			}}
		>
			<Heatmap
				width={width}
				height={height}
				image={image}
				colors={colors}
				colorBack={colorBack}
				contour={contour}
				angle={angle}
				noise={noise}
				innerGlow={innerGlow}
				outerGlow={outerGlow}
				speed={speed}
				scale={scale}
				frame={speed > 0 ? frame : 0}
				fit="cover"
			/>
		</div>
	)
}

export default HeatmapBackground