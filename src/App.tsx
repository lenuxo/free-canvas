import { Tldraw, Editor } from 'tldraw'
import { useState, useCallback } from 'react'
import { CustomToolbar } from './components/CustomToolbar'

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

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				onMount={handleMount}
				hideUi={true}
			>
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
