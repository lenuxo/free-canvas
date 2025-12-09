import React from 'react'

/**
 * 波浪动画背景组件
 *
 * 设计特点：
 * - 使用SVG创建流畅的波浪效果
 * - 多层波浪叠加，营造海洋感
 * - 响应式动画，适应不同尺寸
 */
export function WaveAnimationBackground() {
	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600">
			{/* 波浪层1 - 最底层 */}
			<svg
				className="absolute bottom-0 left-0 w-full"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				style={{
					animation: 'wave 8s linear infinite',
					height: '60px',
					zIndex: 1,
				}}
			>
				<path
					d="M0,60 C200,20 400,80 600,60 C800,40 1000,80 1200,60 L1200,120 L0,120 Z"
					fill="rgba(255,255,255,0.1)"
				/>
			</svg>

			{/* 波浪层2 - 中间层 */}
			<svg
				className="absolute bottom-0 left-0 w-full"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				style={{
					animation: 'wave 6s linear infinite',
					height: '60px',
					zIndex: 2,
					animationDelay: '-2s',
				}}
			>
				<path
					d="M0,60 C300,30 400,90 600,60 C900,30 1000,90 1200,60 L1200,120 L0,120 Z"
					fill="rgba(255,255,255,0.15)"
				/>
			</svg>

			{/* 波浪层3 - 最上层 */}
			<svg
				className="absolute bottom-0 left-0 w-full"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				style={{
					animation: 'wave 4s linear infinite',
					height: '60px',
					zIndex: 3,
					animationDelay: '-4s',
				}}
			>
				<path
					d="M0,60 C150,40 350,80 600,60 C850,40 1050,80 1200,60 L1200,120 L0,120 Z"
					fill="rgba(255,255,255,0.2)"
				/>
			</svg>

			{/* 添加一些装饰性元素 */}
			<div
				className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-20"
				style={{
					animation: 'pulse 4s ease-in-out infinite',
				}}
			/>
			<div
				className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full opacity-15"
				style={{
					animation: 'pulse 4s ease-in-out infinite',
					animationDelay: '1s',
				}}
			/>
			<div
				className="absolute top-32 left-1/3 w-12 h-12 bg-white rounded-full opacity-10"
				style={{
					animation: 'pulse 4s ease-in-out infinite',
					animationDelay: '2s',
				}}
			/>

			{/* CSS动画定义 */}
			<style>{`
				@keyframes wave {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-600px);
					}
				}

				@keyframes pulse {
					0%, 100% {
						opacity: 0.1;
						transform: scale(1);
					}
					50% {
						opacity: 0.2;
						transform: scale(1.1);
					}
				}
			`}</style>
		</div>
	)
}