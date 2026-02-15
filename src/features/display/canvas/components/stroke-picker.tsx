import "./stroke-picker.css"
import { canvasSetStrokeWidth } from "../canvasFunction"
import { useState } from 'react'

export default function StrokePicker() {
  const [selected, setSelected] = useState(6);
  return (
    <div className="stroke-picker">
      <div
        onClick={
          () => {
            canvasSetStrokeWidth(6)
            setSelected(6)
          }
        }
      >
        <div
          className={`stroke-picker-width-6 ${selected == 6 && 'stroke-picker-selected'}`}
        />
      </div>
      <div
        onClick={
          () => {
            canvasSetStrokeWidth(10)
            setSelected(10)
          }
        }
      >
        <div
          className={`stroke-picker-width-10 ${selected == 10 && 'stroke-picker-selected'}`}
        />
      </div>
      <div
        onClick={
          () => {
            canvasSetStrokeWidth(14)
            setSelected(14)
          }
        }
      >
        <div
          className={`stroke-picker-width-14 ${selected == 14 && 'stroke-picker-selected'}`}
        />
      </div>
      <div
        onClick={
          () => {
            canvasSetStrokeWidth(22)
            setSelected(22)
          }
        }
      >
        <div
          className={`stroke-picker-width-22 ${selected == 22 && 'stroke-picker-selected'}`}
        />
      </div>
      <div
        onClick={
          () => {
            canvasSetStrokeWidth(30)
            setSelected(30)
          }
        }
      >
        <div
          className={`stroke-picker-width-30 ${selected == 30 && 'stroke-picker-selected'}`}
        />
      </div>
    </div>
  )
}


