import React from 'react'
import { Tooltip } from './Tooltip'
import {
	MousePointer2,
	Hand,
	Type,
	Image as ImageIcon,
	Globe,
	Circle,
	Square,
	Triangle
} from 'lucide-react'

/**
 * Tooltip 演示组件 - 展示不同位置和配置的 Tooltip 效果
 *
 * 演示内容：
 * - 不同位置的 Tooltip 效果
 * - 不同延迟时间的 Tooltip
 * - 自定义样式的 Tooltip
 * - 模拟工具栏的使用场景
 */
export function TooltipDemo() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-8">Tooltip 组件演示</h1>

				{/* 基础示例 */}
				<div className="mb-12">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">基础示例</h2>
					<div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg shadow">
						<Tooltip content="顶部提示" position="top">
							<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
								顶部 Tooltip
							</button>
						</Tooltip>

						<Tooltip content="底部提示" position="bottom">
							<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
								底部 Tooltip
							</button>
						</Tooltip>

						<Tooltip content="左侧提示" position="left">
							<button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
								左侧 Tooltip
							</button>
						</Tooltip>

						<Tooltip content="右侧提示" position="right">
							<button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
								右侧 Tooltip
							</button>
						</Tooltip>
					</div>
				</div>

				{/* 延迟时间示例 */}
				<div className="mb-12">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">延迟时间对比</h2>
					<div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg shadow">
						<Tooltip content="立即显示 (0ms)" delay={0}>
							<button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
								立即显示
							</button>
						</Tooltip>

						<Tooltip content="快速显示 (300ms)" delay={300}>
							<button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
								快速显示
							</button>
						</Tooltip>

						<Tooltip content="标准延迟 (600ms)" delay={600}>
							<button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
								标准延迟
							</button>
						</Tooltip>

						<Tooltip content="慢速显示 (1200ms)" delay={1200}>
							<button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
								慢速显示
							</button>
						</Tooltip>
					</div>
				</div>

				{/* 工具栏模拟示例 */}
				<div className="mb-12">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">工具栏模拟示例</h2>
					<div className="p-6 bg-white rounded-lg shadow">
						<div className="inline-flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
							<Tooltip content="选择工具 (V)" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<MousePointer2 size={20} />
								</button>
							</Tooltip>

							<Tooltip content="手型工具 (H)" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Hand size={20} />
								</button>
							</Tooltip>

							<Tooltip content="文本工具 (T)" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Type size={20} />
								</button>
							</Tooltip>

							<div className="w-px h-6 bg-gray-300 mx-1" />

							<Tooltip content="图片工具 (I)" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<ImageIcon size={20} />
								</button>
							</Tooltip>

							<Tooltip content="网页容器 (W)" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Globe size={20} />
								</button>
							</Tooltip>

							<div className="w-px h-6 bg-gray-300 mx-1" />

							<Tooltip content="圆形工具" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Circle size={20} />
								</button>
							</Tooltip>

							<Tooltip content="矩形工具" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Square size={20} />
								</button>
							</Tooltip>

							<Tooltip content="三角形工具" position="bottom">
								<button className="p-2 rounded hover:bg-gray-200 transition-colors">
									<Triangle size={20} />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>

				{/* 边界测试示例 */}
				<div className="mb-12">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">边界自动调整测试</h2>
					<div className="p-6 bg-white rounded-lg shadow">
						<div className="flex justify-between items-start h-48">
							{/* 左上角 - 应该调整为右侧或底部 */}
							<Tooltip content="左上角 - 会自动调整位置" position="top">
								<div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white font-bold">
									LT
								</div>
							</Tooltip>

							{/* 右上角 - 应该调整为左侧或底部 */}
							<Tooltip content="右上角 - 会自动调整位置" position="right">
								<div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
									RT
								</div>
							</Tooltip>

							{/* 左下角 - 应该调整为右侧或顶部 */}
							<Tooltip content="左下角 - 会自动调整位置" position="left">
								<div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white font-bold">
									LB
								</div>
							</Tooltip>

							{/* 右下角 - 应该调整为左侧或顶部 */}
							<Tooltip content="右下角 - 会自动调整位置" position="bottom">
								<div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center text-white font-bold">
									RB
								</div>
							</Tooltip>
						</div>
					</div>
				</div>

				{/* 使用说明 */}
				<div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-800 mb-3">使用说明</h3>
					<ul className="space-y-2 text-blue-700">
						<li>• 鼠标悬停在元素上 600ms 后显示 Tooltip（可配置延迟时间）</li>
						<li>• 支持上下左右四个方向的 Tooltip 定位</li>
						<li>• 智能边界检测，自动调整位置避免超出视窗</li>
						<li>• 平滑的显示/隐藏动画效果</li>
						<li>• 完全可定制的样式和内容</li>
						<li>• 适合用于工具提示、操作说明等场景</li>
					</ul>
				</div>
			</div>
		</div>
	)
}