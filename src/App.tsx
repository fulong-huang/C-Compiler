import { useState, useEffect } from 'react'
import './App.css'
import { managerInit, managerCleanUp } from './features/manager.tsx'
import Canvas from './features/display/canvas/canvas.tsx'
import CodeInput from './features/logics/code-input.tsx'

function App() {
  useEffect(() => {
		managerInit();
    return () => {
      managerCleanUp();
    }
  }, [])

	const [tab, setTab] = useState('input');

  return (
    <>
			<div className='tab'>
				<div className={tab=='input'? 'tab-selected':''} onClick={()=>setTab('input')}> input </div>
				<div className={tab=='canvas'? 'tab-selected':''} onClick={()=>setTab('canvas')}> canvas </div>
			</div>
      <span className={tab == 'input'? '':'display-none'}>{<CodeInput/>}</span>
      <span className={tab == 'canvas'? '':'display-none'}>{<Canvas />}</span>
    </>
  )
}

export default App
