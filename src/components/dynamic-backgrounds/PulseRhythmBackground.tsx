import React from 'react'

/**
 * 脉冲节奏背景组件
 *
 * 设计特点：
 * - 使用CSS动画创建脉冲效果
 * - 多层圆形同心扩散
 * - 营造节奏感和生命力
 */
export function PulseRhythmBackground() {
	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-pink-900 via-red-900 to-orange-900">
			{/* 背景底色 */}
			<div className="absolute inset-0 bg-black/30" />

			{/* 脉冲圆圈层 */}
			<div className="absolute inset-0 flex items-center justify-center">
				{/* 中心圆圈 */}
				<div
					className="absolute w-16 h-16 bg-white rounded-full opacity-30"
					style={{
						animation: 'pulse 2s ease-in-out infinite',
					}}
				/>

				{/* 第一层脉冲 */}
				<div
					className="absolute w-32 h-32 bg-pink-400 rounded-full opacity-20"
					style={{
						animation: 'pulseWave 3s ease-in-out infinite',
					}}
				/>

				{/* 第二层脉冲 */}
				<div
					className="absolute w-48 h-48 bg-red-400 rounded-full opacity-15"
					style={{
						animation: 'pulseWave 4s ease-in-out infinite 1s',
					}}
				/>

				{/* 第三层脉冲 */}
				<div
					className="absolute w-64 h-64 bg-orange-400 rounded-full opacity-10"
					style={{
						animation: 'pulseWave 5s ease-in-out infinite 2s',
					}}
				/>
			</div>

			{/* 装饰性小圆圈 */}
			<div className="absolute inset-0">
				{Array.from({ length: 8 }, (_, i) => (
					<div
						key={`pulse-circle-${i}`}
						className="absolute w-4 h-4 bg-white rounded-full"
						style={{
							left: `${20 + Math.random() * 80}%`,
							top: `${20 + Math.random() * 80}%`,
							animation: `miniPulse ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 5}s`,
							opacity: 0.3 + Math.random() * 0.3,
						}}
					/>
				))}
			</div>

			{/* 流动的颜色渐变 */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					background: 'radial-gradient(circle at center, transparent 30%, rgba(255, 0, 0, 0.3) 60%, transparent 100%)',
					animation: 'colorFlow 8s ease-in-out infinite',
				}}
			/>

			{/* 光泽效果 */}
			<div
				className="absolute inset-0 opacity-20"
				style={{
					background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
					animation: 'glow 3s ease-in-out infinite',
				}}
			/>

			{/* CSS动画定义 */}
			<style>{`
				@keyframes pulse {
					0% {
						transform: scale(1);
						opacity: 0.3;
					}
					50% {
						transform: scale(1.2);
						opacity: 0.6;
					}
					100% {
						transform: scale(1);
						opacity: 0.3;
					}
				}

				@keyframes pulseWave {
					0% {
						transform: scale(1);
						opacity: 0.2;
					}
					50% {
						transform: scale(1.3);
						opacity: 0;
					}
					100% {
						transform: scale(2);
						opacity: 0;
					}
				}

				@keyframes miniPulse {
					0% {
						transform: scale(1);
						opacity: 0.3;
					}
					50% {
						transform: scale(1.5);
						opacity: 0.6;
					}
					100% {
						transform: scale(1);
						opacity: 0.3;
					}
				}

				@keyframes colorFlow {
					0%, 100% {
						background: radial-gradient(circle at center, transparent 30%, rgba(255, 0, 0, 0.3) 60%, transparent 100%);
					}
					25% {
						background: radial-gradient(circle at center, transparent 30%, rgba(0, 255, 0, 0.3) 60%, transparent 100%);
					}
					50% {
						background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 255, 0.3) 60%, transparent 100%);
					}
					75% {
						background: radial-gradient(circle at center, transparent 30%, rgba(255, 255, 0, 0.3) 60%, transparent 100%);
					}
				}

				@keyframes glow {
					0%, 100% {
						opacity: 0.2;
					}
					50% {
						opacity: 0.4;
					}
				}
			`}</style>
		</div>
	)
}