import { HTMLContainer, BaseBoxShapeUtil, TLBaseShape, useEditor, Rectangle2d } from 'tldraw'
import React, { useCallback } from 'react'

// 定义网页容器形状的类型
export type WebContainerShape = TLBaseShape<'web-container', {
  w: number
  h: number
  url: string
}>

/**
 * 网页容器组件 - 核心功能是支持在白板中嵌入外部网页
 *
 * iframe交互问题解决方案：
 * 1. 层级分离(z-index): 透明拖拽层(z-index: 1) + iframe层(z-index: 0)
 * 2. 智能交互模式：通过tooltip编辑URL，避免在组件内部处理复杂状态
 * 3. 事件处理优化: 正确处理事件冒泡，避免与Tldraw冲突
 *
 * 关键技术点：
 * - 使用HTMLContainer包装，支持复杂交互组件
 * - 透明拖拽层解决iframe拦截鼠标事件的问题
 * - URL编辑通过选中时的tooltip处理，简化组件逻辑
 */
function WebContainerComponent({ shape }: { shape: WebContainerShape }) {
  const editor = useEditor()
  const { url } = shape.props

  /**
   * 容器拖拽处理 - 解决iframe拦截拖拽事件的核心逻辑
   *
   * 技术要点：
   * 1. 使用stopPropagation()阻止事件冒泡到Tldraw
   * 2. 切换到选择工具让Tldraw处理拖拽操作
   */
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation()
      e.preventDefault()
      // 切换到选择工具，让Tldraw的原生拖拽机制接管
      if (editor) {
        editor.setCurrentTool('select')
      }
    }
  }, [editor])

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div
      className="web-container w-full h-full border border-gray-300 rounded overflow-hidden bg-white flex flex-col cursor-move"
      onMouseDown={handleContainerMouseDown}
    >
      {/* iframe容器 - 核心的分层交互区域 */}
      <div className="flex-1 relative bg-gray-50" style={{ minHeight: '120px' }}>
        {url && isValidUrl(url) ? (
          <>
            {/* 透明拖拽层 - 解决iframe事件拦截问题的关键组件
                * z-index: 1 确保在iframe之上
                * 透明背景不影响视觉效果
            */}
            <div
              className="absolute inset-0 z-10 cursor-move bg-black bg-opacity-5 transition-opacity duration-200 opacity-100 hover:bg-opacity-10"
              onMouseDown={(e) => e.stopPropagation()}
              title="拖拽移动容器，选中后点击工具按钮编辑URL"
            />

            {/* iframe层 - 实际的网页内容显示区域
                * z-index: 0 确保在拖拽层之下
                * sandbox属性确保安全性
            */}
            <iframe
              src={url}
              className="w-full h-full border-0 rounded relative"
              style={{ zIndex: 0 }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="网页容器"
            />
          </>
        ) : (
          // 空状态提示
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            {url ? '请输入有效的网页地址' : '选中容器后编辑URL'}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 网页容器形状工具类 - 继承BaseBoxShapeUtil简化开发
 *
 * 设计选择：
 * - 使用BaseBoxShapeUtil而非ShapeUtil，因为它内置了矩形框的基本功能
 * - 自动支持调整大小、旋转等标准操作，无需手动实现
 * - HTMLContainer包装支持复杂交互组件（iframe）
 */
export class WebContainerShapeUtil extends BaseBoxShapeUtil<WebContainerShape> {
  static override type = 'web-container' as const

  /**
   * 定义形状的默认属性
   * - 设置合理的初始尺寸
   * - URL初始为空，等待用户输入
   */
  getDefaultProps(): WebContainerShape['props'] {
    return {
      w: 400,
      h: 300,
      url: '',
    }
  }

  getGeometry(shape: WebContainerShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  /**
   * 渲染形状的React组件
   * - 使用HTMLContainer包装，支持iframe等复杂HTML元素
   * - pointerEvents: 'all' 确保组件可以接收鼠标事件
   */
  component(shape: WebContainerShape) {
    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
        }}
        className="pointer-events-auto"
      >
        <WebContainerComponent shape={shape} />
      </HTMLContainer>
    )
  }

  /**
   * 形状选中时的指示器（边框高亮）
   * - 使用SVG rect元素绘制选中边框
   * - 蓝色边框(#007AFF)与Tldraw原生选中效果一致
   */
  indicator(shape: WebContainerShape) {
    const { w, h } = shape.props
    return <rect width={w} height={h} fill="none" stroke="#007AFF" strokeWidth={2} />
  }
}