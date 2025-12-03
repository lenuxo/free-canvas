import { HTMLContainer, BaseBoxShapeUtil, TLBaseShape, useEditor, Rectangle2d } from 'tldraw'
import React, { useState, useCallback } from 'react'

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
 * 2. 智能编辑/交互模式切换: 编辑时隐藏拖拽层，交互时显示拖拽层
 * 3. 事件处理优化: 正确处理事件冒泡，避免与Tldraw冲突
 *
 * 关键技术点：
 * - 使用HTMLContainer包装，支持复杂交互组件
 * - 透明拖拽层解决iframe拦截鼠标事件的问题
 * - 智能状态管理，区分编辑模式和拖拽模式
 */
function WebContainerComponent({ shape }: { shape: WebContainerShape }) {
  const editor = useEditor()
  const { url } = shape.props
  const [inputUrl, setInputUrl] = useState(url)
  const [isEditing, setIsEditing] = useState(false)

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const newUrl = e.target.value
    setInputUrl(newUrl)

    // 更新形状的URL属性
    if (editor) {
      editor.updateShape({
        id: shape.id,
        type: shape.type,
        props: {
          ...shape.props,
          url: newUrl,
        },
      })
    }
  }, [editor, shape.id, shape.props])

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  /**
   * 容器拖拽处理 - 解决iframe拦截拖拽事件的核心逻辑
   *
   * 技术要点：
   * 1. 只在非编辑模式下处理拖拽，避免干扰URL输入
   * 2. 使用stopPropagation()阻止事件冒泡到Tldraw
   * 3. 切换到选择工具让Tldraw处理拖拽操作
   */
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditing && e.target === e.currentTarget) {
      e.stopPropagation()
      e.preventDefault()
      // 切换到选择工具，让Tldraw的原生拖拽机制接管
      if (editor) {
        editor.setCurrentTool('select')
      }
    }
  }, [editor, isEditing])

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
      className="web-container"
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        cursor: isEditing ? 'text' : 'move'
      }}
      onMouseDown={handleContainerMouseDown}
    >
      {/* URL 输入框 */}
      <div style={{ padding: '8px', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5', cursor: 'text' }}>
        <input
          type="url"
          value={inputUrl}
          placeholder="输入网页地址..."
          style={{ width: '100%', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '12px', outline: 'none' }}
          onClick={handleInputClick}
          onChange={handleUrlChange}
          onBlur={handleInputBlur}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

      {/* iframe容器 - 核心的分层交互区域 */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#fafafa',
        padding: '8px',
        minHeight: '80px' // 确保有足够的拖拽区域
      }}>
        {inputUrl && isValidUrl(inputUrl) ? (
          <>
            {/* 透明拖拽层 - 解决iframe事件拦截问题的关键组件
                * z-index: 1 确保在iframe之上
                * 透明背景不影响视觉效果
                * 编辑时自动隐藏，避免干扰URL输入
            */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1, // 关键：确保在iframe(z-index: 0)之上
                cursor: 'move',
                backgroundColor: 'rgba(0,0,0,0.02)', // 几乎透明的背景
                transition: 'opacity 0.2s',
                opacity: isEditing ? 0 : 1 // 编辑时隐藏，交互时显示
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="拖拽移动容器，点击输入框编辑URL"
            />

            {/* iframe层 - 实际的网页内容显示区域
                * z-index: 0 确保在拖拽层之下
                * sandbox属性确保安全性
            */}
            <iframe
              src={inputUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '4px',
                position: 'relative',
                zIndex: 0 // 关键：确保在拖拽层(z-index: 1)之下
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="网页容器"
            />
          </>
        ) : (
          // 空状态提示
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}>
            {inputUrl ? '请输入有效的网页地址' : '请输入网页地址'}
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
          pointerEvents: 'all', // 关键：确保鼠标事件能正确传递给组件
        }}
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