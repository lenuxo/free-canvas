import {
	StateNode,
	TLClickEventInfo,
	TLPointerEventInfo,
	TLKeyboardEventInfo,
	createShapeId,
	TLBaseShape,
} from 'tldraw'

/**
 * 通用拖拽创建工具配置接口
 */
export interface DraggableShapeToolConfig<T extends TLBaseShape<string, any>> {
	/** 形状类型标识符 */
	shapeType: string
	/** 默认尺寸 */
	defaultSize: { width: number; height: number }
	/** 最小尺寸限制 */
	minimumSize: { width: number; height: number }
	/** 预览透明度 */
	previewOpacity: number
	/** 创建形状属性的回调函数 */
	createShapeProps: (x: number, y: number, width: number, height: number) => T['props']
	/** 可选：自定义预览样式 */
	customPreviewStyle?: React.CSSProperties
}

/**
 * 通用拖拽创建工具基类
 *
 * ✨ 推荐所有新的拖拽工具都基于此类开发
 * ✨ 参考使用示例：WebContainerToolUtil.tsx
 * ✨ 开发指南：dev-notes/draggable-shape-tool-usage-example.md
 *
 * 设计原理：
 * - 提供统一的拖拽创建交互体验
 * - 支持实时预览和尺寸限制
 * - 可配置的行为和样式
 * - 处理坐标转换和状态管理
 *
 * 核心功能：
 * 1. 拖拽创建：用户可拖拽出任意尺寸的形状
 * 2. 点击创建：快速点击创建默认大小组件
 * 3. 实时预览：拖拽过程中显示半透明预览
 * 4. 智能过滤：避免意外创建过小组件
 * 5. 完善的用户体验：ESC退出、自动切换工具等
 */
export abstract class DraggableShapeTool<T extends TLBaseShape<string, any>> extends StateNode {
	// 状态管理
	protected startPagePoint: { x: number; y: number } | null = null
	protected isDragging = false
	protected previewShapeId: string | null = null

	/**
	 * 子类必须实现的配置方法
	 */
	abstract getConfig(): DraggableShapeToolConfig<T>

	/**
	 * 工具激活时的初始化
	 */
	override onEnter() {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	/**
	 * 工具退出时的清理
	 */
	override onExit() {
		this.editor.setCursor({ type: 'default', rotation: 0 })
		this.cleanup()
	}

	/**
	 * 清理状态和预览形状
	 */
	protected cleanup() {
		this.startPagePoint = null
		this.isDragging = false
		if (this.previewShapeId) {
			this.editor.deleteShapes([this.previewShapeId as any])
			this.previewShapeId = null
		}
	}

	/**
	 * 鼠标按下事件处理 - 开始拖拽创建
	 */
	override onPointerDown: (info: TLPointerEventInfo) => void = (info) => {
		this.startPagePoint = { ...info.point }
		this.isDragging = true
		this.createPreviewShape()
	}

	/**
	 * 鼠标移动事件处理 - 更新预览形状
	 */
	override onPointerMove: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return
		this.updatePreviewShape(info.point)
	}

	/**
	 * 鼠标释放事件处理 - 创建最终形状
	 */
	override onPointerUp: (info: TLPointerEventInfo) => void = (info) => {
		if (!this.isDragging || !this.startPagePoint) return

		const config = this.getConfig()
		const endPoint = this.editor.screenToPage(info.point)
		const startPoint = this.editor.screenToPage(this.startPagePoint)

		const width = Math.abs(endPoint.x - startPoint.x)
		const height = Math.abs(endPoint.y - startPoint.y)

		// 清理预览形状
		this.cleanupPreview()

		// 只有当拖拽距离超过最小尺寸时才创建形状
		if (width >= config.minimumSize.width && height >= config.minimumSize.height) {
			this.createShape(
				Math.min(startPoint.x, endPoint.x),
				Math.min(startPoint.y, endPoint.y),
				width,
				height
			)
		}

		this.isDragging = false
		this.startPagePoint = null
	}

	/**
	 * 点击事件处理 - 创建默认大小组件
	 */
	onClick: (info: TLClickEventInfo) => void = (info) => {
		const config = this.getConfig()
		const pagePoint = this.editor.screenToPage(info.point)

		this.createShape(
			pagePoint.x - config.defaultSize.width / 2,
			pagePoint.y - config.defaultSize.height / 2,
			config.defaultSize.width,
			config.defaultSize.height
		)
	}

	/**
	 * 键盘事件处理 - ESC退出
	 */
	override onKeyDown?: (info: TLKeyboardEventInfo) => void = (info) => {
		if (info.code === 'Escape') {
			this.cleanup()
			this.editor.setCurrentTool('select')
		}
	}

	/**
	 * 创建预览形状
	 */
	protected createPreviewShape() {
		if (!this.startPagePoint) return

		const config = this.getConfig()
		const previewId = createShapeId()
		this.previewShapeId = previewId

		const startPoint = this.editor.screenToPage(this.startPagePoint)

		this.editor.createShape<T>({
			id: previewId,
			type: config.shapeType as T['type'],
			x: startPoint.x,
			y: startPoint.y,
			props: config.createShapeProps(startPoint.x, startPoint.y, 1, 1),
			opacity: config.previewOpacity,
			index: previewId as any,
			isLocked: false,
			parentId: 'page:page',
		})
	}

	/**
	 * 更新预览形状的大小和位置
	 */
	protected updatePreviewShape(currentPoint: { x: number; y: number }) {
		if (!this.previewShapeId || !this.startPagePoint) return

		const config = this.getConfig()
		const startPoint = this.editor.screenToPage(this.startPagePoint)
		const endPoint = this.editor.screenToPage(currentPoint)

		const x = Math.min(startPoint.x, endPoint.x)
		const y = Math.min(startPoint.y, endPoint.y)
		const width = Math.abs(endPoint.x - startPoint.x)
		const height = Math.abs(endPoint.y - startPoint.y)

		this.editor.updateShapes([{
			id: this.previewShapeId as any,
			type: config.shapeType,
			x,
			y,
			props: config.createShapeProps(x, y, width, height),
			opacity: config.previewOpacity,
		}])
	}

	/**
	 * 清理预览形状
	 */
	protected cleanupPreview() {
		if (this.previewShapeId) {
			this.editor.deleteShapes([this.previewShapeId as any])
			this.previewShapeId = null
		}
	}

	/**
	 * 创建最终形状
	 */
	protected createShape(x: number, y: number, width: number, height: number) {
		const config = this.getConfig()
		const shapeId = createShapeId()

		const shape: T = {
			id: shapeId,
			type: config.shapeType as T['type'],
			x,
			y,
			props: config.createShapeProps(x, y, width, height),
			opacity: 1,
			index: shapeId as any,
			isLocked: false,
			parentId: 'page:page',
		} as T

		this.editor.createShape(shape)

		// 创建后自动切换到选择工具
		this.editor.setCurrentTool('select')
	}

	/**
	 * 工具取消处理
	 */
	override onCancel = () => {
		this.cleanup()
		this.editor.setCurrentTool('select')
	}
}