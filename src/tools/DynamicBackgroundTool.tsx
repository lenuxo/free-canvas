import {
	StateNode,
	TLClickEventInfo,
	TLPointerEventInfo,
	TLKeyboardEventInfo,
} from 'tldraw'
import { createShapeId } from 'tldraw'
import type { DynamicBackgroundShape } from './DynamicBackgroundShape'
import { toolManager } from '../utils/ToolManager'

/**
 * 动态背景工具状态
 */
class DynamicBackgroundToolState extends StateNode {
	static override id = 'dynamic-background'

	private backgroundType: DynamicBackgroundShape['props']['backgroundType'] = 'gradient-flow'
	private startPagePoint: { x: number; y: number } | null = null
	private isDragging = false

	/**
	 * 设置背景类型
	 */
	setBackgroundType(type: DynamicBackgroundShape['props']['backgroundType']) {
		this.backgroundType = type
	}

	override onEnter() {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	override onExit() {
		this.editor.setCursor({ type: 'default', rotation: 0 })
		this.startPagePoint = null
		this.isDragging = false
	}

	override onPointerDown: (info: TLPointerEventInfo) => void = (info) => {
		this.startPagePoint = { ...info.point }
		this.isDragging = true
	}

	override onPointerMove: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return
		// 可以在这里添加拖拽预览
	}

	override onPointerUp: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return

		const endPoint = info.point
		const width = Math.abs(endPoint.x - this.startPagePoint.x)
		const height = Math.abs(endPoint.y - this.startPagePoint.y)

		// 只有当拖拽距离超过一定阈值时才创建形状
		if (width > 50 && height > 50) {
			this.createBackground(
				Math.min(this.startPagePoint.x, endPoint.x),
				Math.min(this.startPagePoint.y, endPoint.y),
				width,
				height
			)
		}

		this.isDragging = false
		this.startPagePoint = null
	}

	override onClick: (info: TLClickEventInfo) => void = (info) => {
		// 快速点击创建默认大小的背景
		this.createBackground(info.point.x - 300, info.point.y - 200, 600, 400)
	}

	private createBackground(x: number, y: number, width: number, height: number) {
		const shapeId = createShapeId()

		// 从工具管理器获取当前应该创建的背景类型
		const backgroundType = toolManager.getCurrentBackgroundType()

		const shape: DynamicBackgroundShape = {
			id: shapeId,
			type: 'dynamic-background',
			x,
			y,
			props: {
				w: width,
				h: height,
				backgroundType: backgroundType,
			},
			opacity: 1,
			index: 'a1',
			isLocked: false,
			parentId: 'page:page',
		}

		this.editor.createShape(shape)

		// 创建后自动切换到选择工具
		this.editor.setCurrentTool('select')
	}

	override onKeyDown?: (info: TLKeyboardEventInfo) => void = (info) => {
		// ESC键退出工具
		if (info.code === 'Escape') {
			this.editor.setCurrentTool('select')
		}
	}
}

// 导出工具状态类供Tldraw使用
export { DynamicBackgroundToolState as DynamicBackgroundTool }