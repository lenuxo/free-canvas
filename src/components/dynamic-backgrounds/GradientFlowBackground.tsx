

/**
 * 渐变流动背景组件
 *
 * 设计特点：
 * - 使用CSS渐变和动画创建流动效果
 * - 多层渐变叠加，营造深度感
 * - 流畅的颜色变换动画
 *
 * 可配置参数：
 * - animationSpeed: 动画速度倍率 (0.1 - 3.0)
 * - primaryColor: 主色调
 * - secondaryColor: 次色调
 */
interface GradientFlowBackgroundProps {
	animationSpeed?: number
	primaryColor?: string
	secondaryColor?: string
}

export function GradientFlowBackground({
	animationSpeed = 1.0,
	primaryColor = '#3b82f6',
	secondaryColor = '#8b5cf6'
}: GradientFlowBackgroundProps) {
	return (
		<div className="w-full h-full relative overflow-hidden">
			{/* 多层渐变背景 - 使用配置的颜色 */}
			<div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
				}}
			/>

			{/* 流动渐变层1 */}
			<div
				className="absolute inset-0 opacity-60"
				style={{
					background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, ${primaryColor}88, ${secondaryColor}88)`,
					backgroundSize: '300% 300%',
					animation: `gradientFlow ${8 / animationSpeed}s ease-in-out infinite`,
				}}
			/>

			{/* 流动渐变层2 */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					background: `linear-gradient(-45deg, ${secondaryColor}, ${primaryColor}, ${secondaryColor}dd, ${primaryColor}dd)`,
					backgroundSize: '400% 400%',
					animation: `gradientFlow ${12 / animationSpeed}s ease-in-out infinite reverse`,
				}}
			/>

			{/* 光效层 */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					background: `radial-gradient(circle at 30% 70%, ${primaryColor}40, transparent 70%)`,
					animation: `pulseLight ${4 / animationSpeed}s ease-in-out infinite`,
				}}
			/>

			{/* 底部渐变遮罩 */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

			{/* CSS动画定义 */}
			<style>{`
				@keyframes gradientFlow {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				@keyframes pulseLight {
					0%, 100% {
						opacity: 0.3;
						transform: scale(1);
					}
					50% {
						opacity: 0.5;
						transform: scale(1.1);
					}
				}
			`}</style>
		</div>
	)
}