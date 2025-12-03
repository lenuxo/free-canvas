import { StateNode, TLPointerEventInfo, createShapeId } from 'tldraw'
import type { WebContainerShape } from './FinalWebContainer'

/**
 * 网页容器工具状态管理类 - Tldraw自定义工具的标准实现模式
 *
 * 设计原理：
 * - 继承StateNode类，实现工具的状态管理和用户交互
 * - 处理鼠标点击事件，在画布上创建新的网页容器形状
 * - 创建后自动切换到选择工具，提供流畅的用户体验
 *
 * Tldraw工具开发要点：
 * 1. static override id: 定义工具的唯一标识符
 * 2. onEnter(): 工具激活时的初始化操作
 * 3. onPointerDown(): 处理鼠标点击事件的核心逻辑
 * 4. onCancel(): 工具取消时的清理操作
 */
export class WebContainerTool extends StateNode {
  static override id = 'web-container'

  /**
   * 工具激活时的初始化
   * - 设置鼠标光标为十字准星，提示用户点击创建
   */
  override onEnter = () => {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  /**
   * 处理鼠标点击事件 - 创建网页容器的核心逻辑
   *
   * 流程说明：
   * 1. 只处理左键点击，忽略右键等其他按钮
   * 2. 使用createShapeId()生成唯一标识符
   * 3. 调用editor.createShape()创建新形状
   * 4. 自动切换到选择工具并选中新建的形状
   *
   * 用户体验优化：
   * - 创建后立即切换到选择工具，用户可以直接调整大小或编辑URL
   * - 自动选中新建形状，提供直观的操作反馈
   */
  override onPointerDown = (info: TLPointerEventInfo) => {
    if (info.button !== 0) return // 只处理左键点击，符合用户习惯

    // 生成唯一的形状标识符
    const id = createShapeId()

    // 在点击位置创建新的网页容器形状
    this.editor.createShape<WebContainerShape>({
      id,
      type: 'web-container',
      x: info.point.x, // 使用点击位置的X坐标
      y: info.point.y, // 使用点击位置的Y坐标
      props: {
        w: 400, // 默认宽度
        h: 300, // 默认高度
        url: 'https://www.example.com', // 默认示例URL，用户可修改
      },
    })

    // 用户体验优化：创建后立即切换到选择工具并选中形状
    this.editor.setCurrentTool('select')
    this.editor.select(id)
  }

  /**
   * 工具取消处理 - 用户按下ESC键或其他取消操作
   * - 自动切换回选择工具，确保用户不会停留在工具模式下
   */
  override onCancel = () => {
    this.editor.setCurrentTool('select')
  }
}