import React from 'react'

/**
 * 粒子系统背景组件
 *
 * 设计特点：
 * - 使用CSS动画创建漂浮粒子效果
 * - 多层不同大小和速度的粒子
 * - 随机分布，营造深度感
 *
 * 可配置参数：
 * - animationSpeed: 动画速度倍率 (0.1 - 3.0)
 * - particleCount: 粒子数量 (5 - 50)
 * - primaryColor: 粒子颜色
 */
interface ParticleSystemBackgroundProps {
	animationSpeed?: number
	particleCount?: number
	primaryColor?: string
}

export function ParticleSystemBackground({
	animationSpeed = 1.0,
	particleCount = 20,
	primaryColor = '#3b82f6'
}: ParticleSystemBackgroundProps) {
	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
			{/* 星光背景效果 */}
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `
						radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
						radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
						radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
					`,
					animation: 'float 20s ease-in-out infinite',
				}}
			/>

				{/* 粒子层1 - 小粒子 */}
			<div className="absolute inset-0">
				{Array.from({ length: Math.floor(particleCount * 0.6) }, (_, i) => (
					<div
						key={`particle-small-${i}`}
						className="absolute w-1 h-1 rounded-full"
						style={{
							backgroundColor: primaryColor,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `floatUp ${(8 + Math.random() * 8) / animationSpeed}s ease-in-out infinite ${Math.random() * 5}s`,
							opacity: 0.8,
						}}
					/>
				))}
			</div>

			{/* 粒子层2 - 中粒子 */}
			<div className="absolute inset-0">
				{Array.from({ length: Math.floor(particleCount * 0.3) }, (_, i) => (
					<div
						key={`particle-medium-${i}`}
						className="absolute w-2 h-2 rounded-full"
						style={{
							backgroundColor: primaryColor,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `floatUp ${(10 + Math.random() * 10) / animationSpeed}s ease-in-out infinite ${Math.random() * 8}s`,
							opacity: 0.6,
						}}
					/>
				))}
			</div>

			{/* 粒子层3 - 大粒子 */}
			<div className="absolute inset-0">
				{Array.from({ length: Math.floor(particleCount * 0.1) || 1 }, (_, i) => (
					<div
						key={`particle-large-${i}`}
						className="absolute w-3 h-3 rounded-full"
						style={{
							backgroundColor: primaryColor,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `floatUp ${(15 + Math.random() * 10) / animationSpeed}s ease-in-out infinite ${Math.random() * 10}s`,
							opacity: 0.4,
						}}
					/>
				))}
			</div>

			{/* CSS动画定义 */}
			<style>{`
				@keyframes floatUp {
					0% {
						transform: translateY(100vh) scale(0);
						opacity: 0;
					}
					10% {
						opacity: 0.8;
					}
					100% {
						transform: translateY(-100vh) scale(1.5);
						opacity: 0;
					}
				}

				@keyframes float {
					0%, 100% {
						transform: translateY(0) translateX(0);
					}
					33% {
						transform: translateY(-10px) translateX(10px);
					}
					66% {
						transform: translateY(10px) translateX(-10px);
					}
				}
			`}</style>
		</div>
	)
}