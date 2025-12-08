import { Tldraw, Editor } from 'tldraw'
import { useState, useCallback } from 'react'
import { CustomToolbar } from './components/CustomToolbar'
import { WebContainerShapeUtil } from './tools/FinalWebContainer'
import { WebContainerTool } from './tools/WebContainerToolUtil'
import WebContainerToolbar from './components/WebContainerToolbar'

/**
 * 主应用组件 - 集成自定义工具和UI的入口点
 *
 * 关键配置说明：
 * - components: 覆盖特定UI组件，隐藏原生工具栏但保留其他UI元素
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
		<div className="fixed inset-0">
			<Tldraw
				onMount={handleMount}
				shapeUtils={customShapes} // 注册自定义形状
				tools={[WebContainerTool]} // 注册自定义工具
				components={{
					// 隐藏原生工具栏，但保留其他UI组件（菜单、样式面板等）
					Toolbar: null,

					// 覆盖图片工具栏，为WebContainer显示自定义URL编辑工具栏
					ImageToolbar: () => <WebContainerToolbar />,

					// 其他可以配置的UI组件（设为null可隐藏）：

					// 主要UI组件（具有依赖关系）：
					// MenuPanel: null,           // 菜单面板 - 包含文件操作、编辑等
					// NavigationPanel: null,     // 导航面板 - 包含页面管理、缩略图等
					// StylePanel: null,          // 样式面板 - 包含颜色、线条、填充等样式设置

					// 依赖组件（当父组件被隐藏时，这些组件会自动隐藏）：
					// Minimap: null,             // 小地图 - 依赖NavigationPanel，显示整个画布的缩略图
					// SharePanel: null,          // 分享面板 - 依赖MenuPanel，协作和分享功能
					// PageMenu: null,            // 页面菜单 - 依赖NavigationPanel

					// 独立对话框和菜单组件：
					// ActionsMenu: null,         // 操作菜单 - 快速操作菜单
					// ContextMenu: null,         // 右键上下文菜单
					// MainMenu: null,            // 主菜单
					// HelpMenu: null,            // 帮助菜单
					// KeyboardShortcutsDialog: null, // 快捷键对话框
					// Dialogs: null,             // 所有对话框（包含各种模态框）

					// 内容相关工具栏：
					// RichTextToolbar: null,     // 富文本工具栏 - 编辑文本时显示
					// ImageToolbar: null,        // 图片工具栏 - 选择图片时显示

					// 辅助和调试组件：
					// QuickActions: null,        // 快速操作 - 悬浮操作按钮
					// HelperButtons: null,       // 辅助按钮 - 缩放、全屏等
					// DebugPanel: null,          // 调试面板 - 开发调试信息

					// 协作和无障碍功能：
					// A11y: null,                // 无障碍功能
					// FollowingIndicator: null,  // 跟随指示器 - 协作时显示其他用户位置
					// CursorChatBubble: null,    // 光标聊天气泡 - 协作时的聊天功能
				}}
			>
				{/* 自定义工具栏 - 替代Tldraw原生工具栏 */}
				<CustomToolbar
					selectedTool={selectedTool}
					onToolSelect={handleToolSelect}
					editor={editor}
				/>
			</Tldraw>
		</div>
	)
}

export default App
