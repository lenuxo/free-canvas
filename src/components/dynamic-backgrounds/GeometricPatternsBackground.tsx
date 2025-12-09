import React from 'react'

/**
 * 几何图案背景组件
 *
 * 设计特点：
 * - 使用CSS创建几何图案
 * - 多层图案旋转和移动
 * - 营造现代感和科技感
 */
export function GeometricPatternsBackground() {
	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
			{/* 背景底色 */}
			<div className="absolute inset-0 bg-black/20" />

			{/* 几何图案层1 - 旋转的六边形 */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					backgroundImage: `
						linear-gradient(30deg, rgba(147, 51, 234, 0.3) 25%, transparent 25%),
						linear-gradient(150deg, rgba(79, 70, 229, 0.3) 25%, transparent 25%),
						linear-gradient(270deg, rgba(236, 72, 153, 0.3) 25%, transparent 25%),
						linear-gradient(90deg, rgba(59, 130, 246, 0.3) 25%, transparent 25%)
					`,
					backgroundSize: '40px 40px',
					animation: 'rotatePattern 20s linear infinite',
				}}
			/>

			{/* 几何图案层2 - 移动的圆圈 */}
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `
						radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.2) 2%, transparent 2%),
						radial-gradient(circle at 75% 75%, rgba(79, 70, 229, 0.2) 2%, transparent 2%),
						radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 3%, transparent 3%)
					`,
					backgroundSize: '60px 60px, 80px 80px',
					animation: 'movePattern 15s ease-in-out infinite',
				}}
			/>

			{/* 装饰性几何元素 */}
			<div className="absolute inset-0">
				{/* 三角形图案 */}
				<div
					className="absolute top-20 left-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-purple-400/30"
					style={{
						animation: 'rotate 8s linear infinite',
					}}
				/>
				<div
					className="absolute bottom-32 right-32 w-0 h-0 border-l-[30px] border-r-[30px] border-t-[52px] border-l-transparent border-r-transparent border-t-blue-400/30"
					style={{
						animation: 'rotate 6s linear infinite reverse',
					}}
				/>
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[43px] border-l-transparent border-r-transparent border-green-400/30"
					style={{
						animation: 'rotate 10s linear infinite',
					}}
				/>

				{/* 正方形和矩形 */}
				<div
					className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-cyan-400/30 rotate-45"
					style={{
						animation: 'rotateSquare 7s ease-in-out infinite',
					}}
				/>
				<div
					className="absolute bottom-1/4 left-1/4 w-20 h-12 border-2 border-pink-400/30"
					style={{
						animation: 'rotateRectangle 9s ease-in-out infinite reverse',
					}}
				/>
			</div>

			{/* CSS动画定义 */}
			<style>{`
				@keyframes rotatePattern {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}

				@keyframes movePattern {
					0%, 100% {
						background-position: 0% 0%, 40px 40px, 80px 80px;
					}
					50% {
						background-position: 30px 30px, 70px 70px, 50px 50px;
					}
				}

				@keyframes rotate {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}

				@keyframes rotateSquare {
					0%, 100% {
						transform: rotate(45deg);
					}
					50% {
						transform: rotate(225deg);
					}
				}

				@keyframes rotateRectangle {
					0%, 100% {
						transform: rotate(0deg);
					}
					50% {
						transform: rotate(180deg);
					}
				}
			`}</style>
		</div>
	)
}