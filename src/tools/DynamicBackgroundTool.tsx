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
 *
 * 🚨 提醒：新建拖拽工具时，建议使用 DraggableShapeTool 基类
 * - 参考示例：WebContainerToolUtil.tsx
 * - 可以减少70%的重复代码
 * - 提供统一的拖拽创建体验
 */
class DynamicBackgroundToolState extends StateNode {
	static override id = 'dynamic-background'

	private backgroundType: DynamicBackgroundShape['props']['backgroundType'] = 'gradient-flow'
	private startPagePoint: { x: number; y: number } | null = null
	private isDragging = false
	private previewShapeId: string | null = null

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
		// 清理预览形状
		if (this.previewShapeId) {
			this.editor.deleteShape(this.previewShapeId)
			this.previewShapeId = null
		}
	}

	override onPointerDown: (info: TLPointerEventInfo) => void = (info) => {
		this.startPagePoint = { ...info.point }
		this.isDragging = true

		// 创建预览形状
		this.createPreviewShape()
	}

	override onPointerMove: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return

		// 更新预览形状的大小和位置
		this.updatePreviewShape(info.point)
	}

	/**
	 * 创建预览形状
	 */
	private createPreviewShape() {
		if (!this.startPagePoint) return

		const previewId = createShapeId()
		this.previewShapeId = previewId

		// 将屏幕坐标转换为画板坐标
		const startPoint = this.editor.screenToPage(this.startPagePoint)

		// 创建预览形状（初始为最小尺寸）
		this.editor.createShape<DynamicBackgroundShape>({
			id: previewId,
			type: 'dynamic-background',
			x: startPoint.x,
			y: startPoint.y,
			props: {
				w: 1,
				h: 1,
				backgroundType: this.backgroundType,
			},
			opacity: 0.3, // 更透明的预览，触发简化的预览样式
			index: 'a1',
			isLocked: false,
			parentId: 'page:page',
		})
	}

	/**
	 * 更新预览形状的大小和位置
	 */
	private updatePreviewShape(currentPoint: { x: number; y: number }) {
		if (!this.previewShapeId || !this.startPagePoint) return

		// 转换坐标
		const startPoint = this.editor.screenToPage(this.startPagePoint)
		const endPoint = this.editor.screenToPage(currentPoint)

		// 计算矩形的位置和大小
		const x = Math.min(startPoint.x, endPoint.x)
		const y = Math.min(startPoint.y, endPoint.y)
		const width = Math.abs(endPoint.x - startPoint.x)
		const height = Math.abs(endPoint.y - startPoint.y)

		// 更新预览形状
		this.editor.updateShape<DynamicBackgroundShape>({
			id: this.previewShapeId,
			type: 'dynamic-background',
			x,
			y,
			props: {
				w: width,
				h: height,
				backgroundType: this.backgroundType,
			},
			opacity: 0.3, // 保持预览透明度
		})
	}

	override onPointerUp: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return

		// 将屏幕坐标转换为画板坐标
		const endPoint = this.editor.screenToPage(info.point)
		const startPoint = this.editor.screenToPage(this.startPagePoint)

		const width = Math.abs(endPoint.x - startPoint.x)
		const height = Math.abs(endPoint.y - startPoint.y)

		// 清理预览形状
		if (this.previewShapeId) {
			this.editor.deleteShape(this.previewShapeId)
			this.previewShapeId = null
		}

		// 只有当拖拽距离超过一定阈值时才创建形状
		if (width > 50 && height > 50) {
			this.createBackground(
				Math.min(startPoint.x, endPoint.x),
				Math.min(startPoint.y, endPoint.y),
				width,
				height
			)
		}

		this.isDragging = false
		this.startPagePoint = null
	}

	override onClick: (info: TLClickEventInfo) => void = (info) => {
		// 将屏幕坐标转换为画板坐标
		const pagePoint = this.editor.screenToPage(info.point)
		// 快速点击创建默认大小的背景
		this.createBackground(pagePoint.x - 300, pagePoint.y - 200, 600, 400)
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
			// 清理预览形状
			if (this.previewShapeId) {
				this.editor.deleteShape(this.previewShapeId)
				this.previewShapeId = null
			}
			this.editor.setCurrentTool('select')
		}
	}
}

// 导出工具状态类供Tldraw使用
export { DynamicBackgroundToolState as DynamicBackgroundTool }