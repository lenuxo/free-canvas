import React from 'react'

/**
 * 极光效果背景组件
 *
 * 设计特点：
 * - 模拟北极光的自然流动效果
 * - 使用多层渐变和透明度变化
 * - 绿色和紫色为主色调
 * - 轻柔的波浪动画
 */
export function AuroraEffectBackground() {
	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			{/* 背景底色 */}
			<div className="absolute inset-0 bg-black/40" />

			{/* 极光层1 - 主极光 */}
			<div
				className="absolute inset-0 opacity-60"
				style={{
					background: 'linear-gradient(135deg, transparent 30%, rgba(0, 255, 127, 0.3) 50%, transparent 70%)',
					filter: 'blur(20px)',
					animation: 'aurora1 15s ease-in-out infinite alternate',
				}}
			/>

			{/* 极光层2 - 副极光 */}
			<div
				className="absolute inset-0 opacity-50"
				style={{
					background: 'linear-gradient(45deg, transparent 40%, rgba(147, 51, 234, 0.3) 60%, transparent 80%)',
					filter: 'blur(25px)',
					animation: 'aurora2 18s ease-in-out infinite alternate-reverse',
				}}
			/>

			{/* 极光层3 - 光幕效果 */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					background: 'linear-gradient(90deg, transparent 20%, rgba(34, 211, 238, 0.2) 40%, rgba(168, 85, 247, 0.2) 60%, transparent 80%)',
					filter: 'blur(30px)',
					animation: 'aurora3 20s ease-in-out infinite alternate',
				}}
			/>

			{/* 星星点缀 */}
			<div className="absolute inset-0">
				{Array.from({ length: 30 }, (_, i) => (
					<div
						key={`star-${i}`}
						className="absolute w-1 h-1 bg-white rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 60}%`,
							opacity: Math.random() * 0.8 + 0.2,
							animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`,
						}}
					/>
				))}
			</div>

			{/* 流动光带 */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 255, 127, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)',
					animation: 'auroraFlow 25s ease-in-out infinite',
				}}
			/>

			{/* 光晕效果 */}
			<div
				className="absolute inset-0 opacity-20"
				style={{
					background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
					animation: 'glow 8s ease-in-out infinite',
				}}
			/>

			{/* CSS动画定义 */}
			<style>{`
				@keyframes aurora1 {
					0% {
						transform: translateX(-20%) translateY(-10%) rotate(-5deg);
						opacity: 0.4;
					}
					50% {
						transform: translateX(10%) translateY(5%) rotate(5deg);
						opacity: 0.7;
					}
					100% {
						transform: translateX(30%) translateY(-5%) rotate(-3deg);
						opacity: 0.5;
					}
				}

				@keyframes aurora2 {
					0% {
						transform: translateX(15%) translateY(15%) rotate(8deg);
						opacity: 0.3;
					}
					50% {
						transform: translateX(-10%) translateY(-10%) rotate(-8deg);
						opacity: 0.6;
					}
					100% {
						transform: translateX(-25%) translateY(10%) rotate(3deg);
						opacity: 0.4;
					}
				}

				@keyframes aurora3 {
					0% {
						transform: translateX(-10%) translateY(5%) rotate(-10deg);
						opacity: 0.2;
					}
					50% {
						transform: translateX(20%) translateY(-15%) rotate(10deg);
						opacity: 0.5;
					}
					100% {
						transform: translateX(10%) translateY(10%) rotate(-5deg);
						opacity: 0.3;
					}
				}

				@keyframes auroraFlow {
					0% {
						transform: translateY(0) scale(1);
					}
					33% {
						transform: translateY(-20px) scale(1.1);
					}
					66% {
						transform: translateY(20px) scale(0.9);
					}
					100% {
						transform: translateY(0) scale(1);
					}
				}

				@keyframes twinkle {
					0%, 100% {
						opacity: 0.2;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.2);
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