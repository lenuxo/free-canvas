import { useEffect } from 'react'
import { useEditor } from 'tldraw'

/**
 * 自定义键盘快捷键处理器
 *
 * 由于项目使用 hideUi={true} 隐藏了Tldraw原生UI，导致原生键盘快捷键失效，
 * 因此需要手动实现键盘快捷键功能。
 *
 * 关键技术点：
 * 1. 使用 useEditor hook 获取编辑器实例，调用Tldraw的官方API
 * 2. 通过事件捕获阶段(true)处理，确保在Tldraw之前拦截键盘事件
 * 3. 智能焦点检测，避免与输入框等文本编辑功能冲突
 * 4. 使用 preventDefault() 和 stopPropagation() 防止事件冒泡
 */
export function KeyboardHandler() {
  const editor = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 处理删除键 - 模拟Tldraw原生的删除功能
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // 智能焦点检测 - 确保不干扰文本编辑功能
        const activeElement = document.activeElement
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        )) {
          return // 如果焦点在输入框中，优先处理文本编辑，不拦截删除键
        }

      // 获取当前选中的形状
        const selectedShapeIds = editor.getSelectedShapeIds()

        if (selectedShapeIds.length > 0) {
          e.preventDefault()
          e.stopPropagation()

          // 调用Tldraw官方API删除形状，确保与原生删除功能一致
          editor.deleteShapes(selectedShapeIds)
        }
      }
    }

    // 在事件捕获阶段添加监听器，确保在Tldraw处理之前拦截键盘事件
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      // 清理事件监听器，防止内存泄漏
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [editor])

  return null
}