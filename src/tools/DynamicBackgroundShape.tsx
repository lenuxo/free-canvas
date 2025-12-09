import {
	HTMLContainer,
	BaseBoxShapeUtil,
	TLBaseBoxShape,
	TLImageExportOptions,
	T,
} from 'tldraw'
import {
	GradientFlowBackground,
} from '../components/dynamic-backgrounds'
import {
	backgroundTypeStyle,
	animationSpeedStyle,
	primaryColorStyle,
	secondaryColorStyle,
	type BackgroundType,
	type AnimationSpeed,
	type PrimaryColor,
	type SecondaryColor,
} from '../styles/dynamic-background-styles'

/**
 * 动态背景形状类型定义
 */
export interface DynamicBackgroundShape extends TLBaseBoxShape<'dynamic-background'> {
	backgroundType: BackgroundType
	animationSpeed: AnimationSpeed
	primaryColor: PrimaryColor
	secondaryColor: SecondaryColor
}

/**
 * 动态背景形状工具类
 *
 * 设计目的：
 * - 在Tldraw画布上创建动态背景容器
 * - 每个容器显示不同的CSS动画背景效果
 * - 作为其他白板元素的视觉背景层
 * - 支持拖拽、缩放、删除等基本操作
 */
export class DynamicBackgroundShapeUtil extends BaseBoxShapeUtil<DynamicBackgroundShape> {
	static override type = 'dynamic-background' as const

	// 使用新的样式系统定义形状属性
	static override props = {
		w: T.number,
		h: T.number,
		backgroundType: backgroundTypeStyle,
		animationSpeed: animationSpeedStyle,
		primaryColor: primaryColorStyle,
		secondaryColor: secondaryColorStyle,
	}

	// 形状是否可以选择和编辑
	override canBind = () => false
	override canEdit = () => false
	override canUnmount = () => false

	// 默认形状属性
	override getDefaultProps(): DynamicBackgroundShape['props'] {
		return {
			w: 600,
			h: 400,
			backgroundType: 'gradient-flow',
			animationSpeed: 1.0,
			primaryColor: '#3b82f6',
			secondaryColor: '#8b5cf6',
		}
	}

	// 获取组件，用于渲染React组件
	override component(shape: DynamicBackgroundShape) {
		return (
			<HTMLContainer
				id={shape.id}
				style={{
					width: shape.props.w,
					height: shape.props.h,
					pointerEvents: shape.isLocked ? 'none' : 'auto',
					opacity: shape.opacity,
				}}
			>
				<div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
					{this.renderBackgroundComponent(shape)}
				</div>
			</HTMLContainer>
		)
	}

	// 获取背景组件的渲染函数
	private renderBackgroundComponent(shape: DynamicBackgroundShape) {
		const { animationSpeed, primaryColor, secondaryColor } = shape.props

		// 目前只支持渐变流动背景
		return <GradientFlowBackground animationSpeed={animationSpeed} primaryColor={primaryColor} secondaryColor={secondaryColor} />
	}

	// 获取指示器（选中时显示的边框和调整手柄）
	override indicator(shape: DynamicBackgroundShape) {
		const { w, h } = shape.props
		return <rect width={w} height={h} fill="none" stroke="#007AFF" strokeWidth={2} />
	}

	// 导出为图片时的处理
	override async toImage(
		shape: DynamicBackgroundShape,
		opts: TLImageExportOptions
	): Promise<HTMLImageElement | null> {
		// 动态背景导出为静态图片（截图）
		const element = document.querySelector(`[data-shape="${shape.id}"]`) as HTMLElement
		if (!element) return null

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		if (!ctx) return null

		// 创建一个简单的渐变背景作为静态导出
		const gradient = ctx.createLinearGradient(0, 0, shape.props.w, shape.props.h)
		gradient.addColorStop(0, '#667eea')
		gradient.addColorStop(1, '#764ba2')
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, shape.props.w, shape.props.h)

		const image = new Image()
		image.src = canvas.toDataURL()
		return image
	}

	// 处理形状属性更新
	override onResize = (shape: DynamicBackgroundShape, info: any) => {
		return {
			...shape,
			props: {
				...shape.props,
				w: Math.max(200, shape.props.w + info.deltaX),
				h: Math.max(150, shape.props.h + info.deltaY),
			},
		}
	}

	// 处理背景类型变更（通过工具管理器调用）
	changeBackgroundType(shape: DynamicBackgroundShape, backgroundType: DynamicBackgroundShape['props']['backgroundType']) {
		return {
			...shape,
			props: {
				...shape.props,
				backgroundType,
			},
		}
	}
}