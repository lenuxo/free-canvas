import { HTMLContainer, BaseBoxShapeUtil, TLBaseShape, useEditor, Rectangle2d } from 'tldraw'
import React, { useState, useCallback } from 'react'

// 定义网页容器形状的类型
export type WebContainerShape = TLBaseShape<'web-container', {
  w: number
  h: number
  url: string
}>

// 网页容器组件
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

  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    // 如果不是点击输入框，允许拖拽
    if (!isEditing && e.target === e.currentTarget) {
      e.stopPropagation()
      e.preventDefault()
      // 让Tldraw处理拖拽
      if (editor) {
        // 切换到选择工具来处理拖拽
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

      {/* iframe 容器 */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#fafafa',
        padding: '8px',
        minHeight: '80px' // 确保有足够的空间可以拖拽
      }}>
        {inputUrl && isValidUrl(inputUrl) ? (
          <>
            {/* 拖拽提示层 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                cursor: 'move',
                backgroundColor: 'rgba(0,0,0,0.02)',
                transition: 'opacity 0.2s',
                opacity: isEditing ? 0 : 1
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="拖拽移动容器，双击进入编辑模式"
            />
            {/* iframe层 */}
            <iframe
              src={inputUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '4px',
                position: 'relative',
                zIndex: 0
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="网页容器"
            />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px' }}>
            {inputUrl ? '请输入有效的网页地址' : '请输入网页地址'}
          </div>
        )}
      </div>
    </div>
  )
}

// 网页容器形状工具类 - 使用BaseBoxShapeUtil
export class WebContainerShapeUtil extends BaseBoxShapeUtil<WebContainerShape> {
  static override type = 'web-container' as const

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

  // 渲染形状的组件
  component(shape: WebContainerShape) {
    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: 'all',
        }}
      >
        <WebContainerComponent shape={shape} />
      </HTMLContainer>
    )
  }

  // 形状选中时的指示器
  indicator(shape: WebContainerShape) {
    const { w, h } = shape.props
    return <rect width={w} height={h} fill="none" stroke="#007AFF" strokeWidth={2} />
  }
}