import { useEffect } from 'react'
import { useEditor } from 'tldraw'

export function KeyboardHandler() {
  const editor = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 处理删除键
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // 检查焦点是否在输入框中
        const activeElement = document.activeElement
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        )) {
          return // 如果在输入框中，不处理删除键
        }

        // 获取选中的形状ID
        const selectedShapeIds = editor.getSelectedShapeIds()

        if (selectedShapeIds.length > 0) {
          e.preventDefault()
          e.stopPropagation()

          // 使用Tldraw的deleteShapes方法删除选中形状
          editor.deleteShapes(selectedShapeIds)
        }
      }
    }

    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [editor])

  return null
}