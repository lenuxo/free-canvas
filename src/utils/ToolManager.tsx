import { Editor } from 'tldraw'
import {
	MousePointer2,
	Hand,
	Type,
	Image as ImageIcon,
	Globe,
	Waves
} from 'lucide-react'
import type { DynamicBackgroundShape } from '../tools/DynamicBackgroundShape'

/**
 * 单个工具的定义
 */
export interface Tool {
	id: string
	label: string
	icon: React.ReactNode
}

/**
 * 工具集的定义 - 包含多个子工具
 */
export interface Toolset {
	id: string
	label: string
	icon: React.ReactNode
	subTools: {
		id: string
		name: string
		toolId: string // 实际要激活的工具ID
	}[]
}

/**
 * 工具配置的类型 - 支持单个工具和工具集
 */
export interface ToolConfig {
	basicTools: Tool[]
	mediaTools: Tool[]
	customTools: Tool[]
	toolsets: Toolset[]
}

/**
 * 工具管理器类 - 统一管理工具状态和编辑器访问
 *
 * 设计目的：
 * - 集中管理编辑器实例，避免在多个组件中重复传递
 * - 提供统一的工具切换接口，封装Tldraw API调用细节
 * - 支持原生工具和自定义工具的混合管理
 *
 * 编辑器访问模式：
 * - 通过setEditor()方法注入编辑器实例
 * - 使用useEditor hook获取编辑器，然后传递给工具管理器
 * - 工具管理器封装所有editor API调用，提供统一接口
 */
class ToolManager {
	private editor: Editor | null = null
	private currentTool: string = 'select'

	/**
	 * 设置编辑器实例 - 来自CustomToolbar组件的注入
	 * 这是连接自定义UI与Tldraw功能的关键步骤
	 */
	setEditor(editor: Editor) {
		this.editor = editor
	}

	/**
	 * 获取当前选中的工具
	 */
	getCurrentTool(): string {
		return this.currentTool
	}

	/**
	 * 统一的工具切换接口
	 *
	 * 功能说明：
	 * - 封装Tldraw的setCurrentTool API调用
	 * - 支持原生工具（select、hand、text等）
	 * - 支持自定义工具（web-container、dynamic-background）
	 * - 提供统一的工具切换体验
	 */
	switchToTool(toolId: string) {
		if (!this.editor) return

		this.currentTool = toolId

		switch (toolId) {
			case 'select':
				this.editor.setCurrentTool('select')
				break
			case 'hand':
				this.editor.setCurrentTool('hand')
				break
			case 'text':
				this.editor.setCurrentTool('text')
				break
			case 'web-container':
				this.editor.setCurrentTool('web-container')
				break
			case 'image':
				// 图片工具 - 使用 insertMedia helper
				// 实际调用会在 CustomToolbar 组件中处理
				// 这里只需要设置工具状态即可
				break
			// 动态背景工具集
			case 'bg-gradient-flow':
				this.editor.setCurrentTool('dynamic-background')
				// 设置对应的背景类型
				this.setBackgroundType(toolId)
				break
			default:
				console.warn(`未知的工具ID: ${toolId}`)
		}
	}

	/**
	 * 设置动态背景类型 - 与工具状态集成
	 */
	private setBackgroundType(toolId: string) {
		const typeMap: Record<string, DynamicBackgroundShape['props']['backgroundType']> = {
			'bg-gradient-flow': 'gradient-flow',
		}

		const backgroundType = typeMap[toolId]
		if (backgroundType) {
			// 可以通过状态管理或其他方式传递给工具
			// 这里简化处理，实际可能需要通过全局状态或事件系统
			this.currentBackgroundType = backgroundType
		}
	}

	// 当前背景类型状态
	private currentBackgroundType: DynamicBackgroundShape['props']['backgroundType'] = 'gradient-flow'

	// 获取工具配置
	getToolConfigurations(): ToolConfig {
		return {
			basicTools: [
				{
					id: 'select',
					label: '选择工具 (V)',
					icon: <MousePointer2 size={20} />
				},
				{
					id: 'hand',
					label: '手型工具 (H)',
					icon: <Hand size={20} />
				},
				{
					id: 'text',
					label: '文本工具 (T)',
					icon: <Type size={20} />
				}
			],
			mediaTools: [
				{
					id: 'image',
					label: '图片工具 (I)',
					icon: <ImageIcon size={20} />
				}
			],
			customTools: [
				{
					id: 'web-container',
					label: '网页容器 (W)',
					icon: <Globe size={20} />
				}
			],
			// 动态背景工具集
			toolsets: [
				{
					id: 'dynamic-backgrounds',
					label: '动态背景',
					icon: <Waves size={20} />,
					subTools: [
						{
							id: 'gradient-flow',
							name: '渐变流动',
							toolId: 'bg-gradient-flow'
						}
					]
				}
			]
		}
	}
}

// 创建全局工具管理器实例
export const toolManager = new ToolManager()

// 导出工具管理器的类型
export type { ToolManager }