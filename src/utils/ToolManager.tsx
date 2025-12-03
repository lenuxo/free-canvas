import { Editor } from 'tldraw'
import {
	MousePointer2,
	Hand,
	Type,
	Image as ImageIcon,
	Globe
} from 'lucide-react'

// 工具管理器类
class ToolManager {
	private editor: Editor | null = null

	// 设置编辑器实例
	setEditor(editor: Editor) {
		this.editor = editor
	}

	// 切换到指定工具
	switchToTool(toolId: string) {
		if (!this.editor) return

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
			default:
				console.warn(`未知的工具ID: ${toolId}`)
		}
	}

	// 获取工具配置
	getToolConfigurations() {
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
			]
		}
	}
}

// 创建全局工具管理器实例
export const toolManager = new ToolManager()

// 导出工具管理器的类型
export type { ToolManager }