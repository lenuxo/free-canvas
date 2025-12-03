import { Tldraw, Editor } from 'tldraw'
import { useState, useCallback } from 'react'
import { CustomToolbar } from './components/CustomToolbar'
import { KeyboardHandler } from './components/KeyboardHandler'
import { WebContainerShapeUtil } from './tools/FinalWebContainer'
import { WebContainerTool } from './tools/WebContainerToolUtil'

function App() {
	const [selectedTool, setSelectedTool] = useState<string>('select')
	const [editor, setEditor] = useState<Editor | null>(null)

	const handleMount = useCallback((editor: Editor) => {
		setEditor(editor)
		// 设置默认工具为选择工具
		editor.setCurrentTool('select')
	}, [])

	const handleToolSelect = useCallback((tool: string) => {
		setSelectedTool(tool)
	}, [])

	// 定义自定义形状和工具
	const customShapes = [WebContainerShapeUtil]

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				onMount={handleMount}
				hideUi={true}
				shapeUtils={customShapes}
				tools={[WebContainerTool]}
			>
				<CustomToolbar
					selectedTool={selectedTool}
					onToolSelect={handleToolSelect}
					editor={editor}
				/>
				<KeyboardHandler />
			</Tldraw>
		</div>
	)
}

export default App
