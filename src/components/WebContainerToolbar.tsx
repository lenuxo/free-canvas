import React, { useState } from 'react'
import { useEditor, useValue } from 'tldraw'

/**
 * WebContainer自定义工具栏组件 - 模仿视频组件的alt text编辑功能
 *
 * 设计原理：
 * 1. 选中WebContainer组件时显示悬浮工具栏
 * 2. 提供"编辑URL"按钮，点击后打开URL编辑对话框
 * 3. 使用Tailwind CSS样式，与项目整体风格保持一致
 * 4. 模仿Tldraw原生组件的交互模式
 */

function WebContainerToolbar() {
  const editor = useEditor()
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [tempUrl, setTempUrl] = useState('')

  // 使用 useValue 监听选中形状，确保只有 WebContainer 被选中时才显示
  const selectedWebContainer = useValue(
    'selectedWebContainer',
    () => {
      const selectedShapeIds = editor.getSelectedShapeIds()
      if (selectedShapeIds.length !== 1) return null
      const shape = editor.getShape(selectedShapeIds[0])
      return shape?.type === 'web-container' ? shape : null
    },
    [editor]
  )

  // 如果没有选中 WebContainer，返回 null
  if (!selectedWebContainer) {
    return null
  }

  // 获取选中形状的边界框
  const selectionBounds = editor.getSelectionPageBounds()
  if (!selectionBounds) {
    return null
  }

  // 计算工具栏位置：在选中形状上方居中
  const centerPoint = {
    x: selectionBounds.x + selectionBounds.w / 2,
    y: selectionBounds.y - 10 // 在形状上方10px
  }

  // 转换为屏幕坐标
  const screenPoint = editor.pageToScreen(centerPoint)

  const currentUrl = selectedWebContainer.props?.url || ''

  const handleEditUrlStart = () => {
    setTempUrl(currentUrl)
    setIsEditingUrl(true)
  }

  const handleUrlSave = () => {
    editor.updateShape({
      id: selectedWebContainer.id,
      type: 'web-container',
      props: {
        ...selectedWebContainer.props,
        url: tempUrl,
      },
    })
    setIsEditingUrl(false)
  }

  const handleUrlCancel = () => {
    setIsEditingUrl(false)
    setTempUrl('')
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUrl(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSave()
    } else if (e.key === 'Escape') {
      handleUrlCancel()
    }
  }

  // URL验证函数
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true // 允许空URL
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const urlError = tempUrl && !isValidUrl(tempUrl) ? '请输入有效的网页地址' : ''

  return (
    <div
      className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-2 pointer-events-auto"
      style={{
        position: 'absolute',
        left: screenPoint.x,
        top: screenPoint.y,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 1000,
      }}
    >
      {!isEditingUrl ? (
        <>
          {/* 显示当前URL或提示 */}
          <div className="flex items-center gap-2 min-w-0 max-w-xs">
            <span className="text-xs text-gray-600 truncate">
              {currentUrl || '未设置URL'}
            </span>
          </div>

          {/* 编辑按钮 */}
          <button
            onClick={handleEditUrlStart}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
            title="编辑网页地址"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            编辑URL
          </button>
        </>
      ) : (
        <>
          {/* URL输入框 */}
          <div className="flex flex-col gap-1">
            <input
              type="url"
              value={tempUrl}
              onChange={handleUrlChange}
              onKeyDown={handleKeyDown}
              placeholder="输入网页地址..."
              className={`px-2 py-1 text-xs border rounded w-48 outline-none transition-colors ${
                urlError
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
              }`}
              autoFocus
            />
            {urlError && (
              <span className="text-xs text-red-500">{urlError}</span>
            )}
          </div>

          {/* 取消按钮 */}
          <button
            onClick={handleUrlCancel}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            title="取消编辑"
          >
            取消
          </button>

          {/* 保存按钮 */}
          <button
            onClick={handleUrlSave}
            disabled={!!urlError}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              urlError
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            title="保存URL"
          >
            保存
          </button>
        </>
      )}
    </div>
  )
}

export default WebContainerToolbar