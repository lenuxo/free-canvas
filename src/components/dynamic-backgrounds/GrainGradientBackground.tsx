import React from 'react'
import { GrainGradient } from '@paper-design/shaders-react'

export interface GrainGradientBackgroundProps {
	width?: number
	height?: number
	colors?: string[]
	colorBack?: string
	softness?: number
	intensity?: number
	noise?: number
	shape?: "wave" | "dots" | "truchet" | "corners" | "ripple" | "blob" | "sphere"
	speed?: number
	frame?: number
	scale?: number
	rotation?: number
	offsetX?: number
	offsetY?: number
	fit?: "contain" | "cover"
	worldWidth?: number
	worldHeight?: number
	originX?: number
	originY?: number
	minPixelRatio?: number
	maxPixelCount?: number
	className?: string
}

export const GrainGradientBackground: React.FC<GrainGradientBackgroundProps> = ({
	width = 800,
	height = 600,
	colors = ["#702200", "#eaba7b", "#38b422"],
	colorBack = "#0a0000",
	softness = 0,
	intensity = 0.2,
	noise = 1,
	shape = "sphere",
	speed = 1,
	frame = 0,
	scale = 1,
	rotation = 0,
	offsetX = 0,
	offsetY = 0,
	fit = "cover",
	worldWidth,
	worldHeight,
	originX = 0.5,
	originY = 0.5,
	minPixelRatio,
	maxPixelCount,
	className = ""
}) => {
	// 添加动画帧管理，确保shader动画流畅
	const [currentFrame, setCurrentFrame] = React.useState(0)

	React.useEffect(() => {
		if (speed === 0) return

		let animationFrameId: number
		let startTime = Date.now()

		const animate = () => {
			const currentTime = Date.now() - startTime
			setCurrentFrame(currentTime)
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
			className={`grain-gradient-background ${className}`}
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden'
			}}
		>
			<GrainGradient
				width={width}
				height={height}
				colors={colors}
				colorBack={colorBack}
				softness={softness}
				intensity={intensity}
				noise={noise}
				shape={shape}
				speed={speed}
				frame={speed > 0 ? currentFrame : 0}
				scale={scale}
				rotation={rotation}
				offsetX={offsetX}
				offsetY={offsetY}
				fit={fit}
				worldWidth={worldWidth}
				worldHeight={worldHeight}
				originX={originX}
				originY={originY}
				minPixelRatio={minPixelRatio}
				maxPixelCount={maxPixelCount}
			/>
		</div>
	)
}