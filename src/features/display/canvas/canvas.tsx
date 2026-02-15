import { canvasElements, canvasSetSelectedTool, canvasUpdateCanvas } from './canvasFunction.tsx';
import Sketch from '../shape/Sketch.tsx';
import { undoHistory, redoHistory } from './editHistory.tsx';
import ToolBox from './components/tool-box.tsx';
import ColorPicker from './components/color-picker.tsx';
import StrokePicker from './components/stroke-picker.tsx';
import './canvas.css'

export default function Canvas() {
  const position: Array<Array<number>> = [
    [0, 2], [0, 8],
    [1, 3], [1, 7],
    [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
    [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [3, 8], [3, 9],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10],
    [5, 0], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 10],
    [6, 0], [6, 2], [6, 8], [6, 10],
    [7, 3], [7, 4], [7, 6], [7, 7],
  ]

  const pointSize = 30;
  const gap = 3;
  const pointColor = '#f6c015';
  for (let x = 0; x < 3; x++) {
    const indentX = x * (10 + gap) * pointSize + pointSize;
    for (let i = 0; i < position.length; i++) {
      const point = new Sketch(indentX + position[i][1] * pointSize,
        position[i][0] * pointSize, pointColor, [], pointSize);
      canvasElements.push(point);
    }
  }
  for (let x = 1; x < 3; x++) {
    const indentX = x * (10 + gap) * pointSize + pointSize - (7 * pointSize);
    const indentY = 9 * pointSize + pointSize;
    for (let i = 0; i < position.length; i++) {
      const point = new Sketch(indentX + position[i][1] * pointSize,
        indentY + position[i][0] * pointSize, pointColor, [], pointSize);
      canvasElements.push(point);
    }
  }
  const indentX = (10 + gap) * pointSize + pointSize;
  const indentY = 18 * pointSize + pointSize;
  for (let i = 0; i < position.length; i++) {
    const point = new Sketch(indentX + position[i][1] * pointSize,
      indentY + position[i][0] * pointSize, pointColor, [], pointSize);
    canvasElements.push(point);
  }


  const toolList: ('Sketch' | 'Line' | 'Rectangle' | 'Circle' | 'Pointer')[] = [
    'Pointer',
    'Sketch',
    'Line',
    'Circle',
    'Rectangle',
  ]

  // @ts-expect-error varuable only used during testing
  // eslint-disable-next-line
  const test = (
    <div
      className='test'
      onClick={() => {
        // CANVAS.test()
      }}
    >
      test
    </div>
  )
  return (
    <>
      <div className='canvas-container'>

        <div className='tool-box-container'>
          {
            // test
          }
          <div className='tool-box'>
            <ToolBox
              toolList={toolList}
              onToolSelect={canvasSetSelectedTool}
            />
            <ColorPicker
            />
            <StrokePicker
            />
          </div>
        </div>

        <canvas id='canvas' className='canvas'>
        </canvas>
        <div className='canvas-history-button'>
          <div onClick={() => { undoHistory(); canvasUpdateCanvas() }}>Undo</div>
          <div onClick={() => { redoHistory(); canvasUpdateCanvas() }}>Redo</div>
        </div>
      </div>
    </>
  )
}


