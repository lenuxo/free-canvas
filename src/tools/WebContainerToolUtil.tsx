import { StateNode, TLPointerEventInfo, createShapeId } from 'tldraw'
import type { WebContainerShape } from './FinalWebContainer'

// 网页容器工具的状态管理
export class WebContainerTool extends StateNode {
  static override id = 'web-container'

  override onEnter = () => {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown = (info: TLPointerEventInfo) => {
    if (info.button !== 0) return // 只处理左键点击

    // 创建新的网页容器形状
    const id = createShapeId()

    this.editor.createShape<WebContainerShape>({
      id,
      type: 'web-container',
      x: info.point.x,
      y: info.point.y,
      props: {
        w: 400,
        h: 300,
        url: 'https://www.example.com',
      },
    })

    // 立即切换到选择工具，让用户可以直接编辑形状
    this.editor.setCurrentTool('select')
    this.editor.select(id)
  }

  override onCancel = () => {
    this.editor.setCurrentTool('select')
  }
}