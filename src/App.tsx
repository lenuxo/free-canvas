import { Tldraw, Editor } from 'tldraw'
import { useState, useCallback } from 'react'
import { CustomToolbar } from './components/CustomToolbar'
import { KeyboardHandler } from './components/KeyboardHandler'
import { WebContainerShapeUtil } from './tools/FinalWebContainer'
import { WebContainerTool } from './tools/WebContainerToolUtil'

/**
 * 主应用组件 - 集成自定义工具和UI的入口点
 *
 * 关键配置说明：
 * - hideUi={true}: 隐藏Tldraw原生UI，启用完全自定义界面
 * - shapeUtils: 注册自定义形状工具类
 * - tools: 注册自定义工具状态管理
 * - onMount: 获取编辑器实例，传递给自定义组件使用
 */
function App() {
	const [selectedTool, setSelectedTool] = useState<string>('select')
	const [editor, setEditor] = useState<Editor | null>(null)

	/**
	 * 编辑器挂载回调 - 获取编辑器实例并进行初始化
	 * editor实例是连接自定义组件与Tldraw功能的关键桥梁
	 */
	const handleMount = useCallback((editor: Editor) => {
		setEditor(editor)
		// 设置初始工具为选择工具，符合用户操作习惯
		editor.setCurrentTool('select')
	}, [])

	const handleToolSelect = useCallback((tool: string) => {
		setSelectedTool(tool)
	}, [])

	// 注册自定义形状工具类 - Tldraw需要知道哪些自定义形状可用
	const customShapes = [WebContainerShapeUtil]

	return (
		// 全屏容器 - 确保白板占满整个视窗
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				onMount={handleMount}
				hideUi={true} // 关键：启用完全自定义UI模式
				shapeUtils={customShapes} // 注册自定义形状
				tools={[WebContainerTool]} // 注册自定义工具
			>
				{/* 自定义工具栏 - 替代Tldraw原生工具栏 */}
				<CustomToolbar
					selectedTool={selectedTool}
					onToolSelect={handleToolSelect}
					editor={editor}
				/>
				{/* 自定义键盘处理器 - 解决hideUi模式下快捷键失效问题 */}
				<KeyboardHandler />
			</Tldraw>
		</div>
	)
}

export default App
