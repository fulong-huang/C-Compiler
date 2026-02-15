import "./color-picker.css"
import { canvasSetStrokeColor } from "../canvasFunction.tsx"
import { useState } from 'react';

export default function ColorPicker() {
  const [selected, setSelected] = useState("white");
  return (
    <div className="color-picker">
      <div
        className={`background-white ${selected == 'white' && 'color-picker-selected'}`}
        onClick={
          () => {
            canvasSetStrokeColor("white")
            setSelected("white")
          }
        }
      />
      <div
        className={`background-black ${selected == 'black' && 'color-picker-selected'}`}
        onClick={
          () => {
            canvasSetStrokeColor("black")
            setSelected("black")
          }
        }
      />
      <div
        className={`background-red ${selected == 'red' && 'color-picker-selected'}`}
        onClick={
          () => {
            canvasSetStrokeColor("red")
            setSelected("red")
          }
        }
      />
      <div
        className={`background-green ${selected == 'green' && 'color-picker-selected'}`}
        onClick={
          () => {
            canvasSetStrokeColor("green")
            setSelected("green")
          }
        }
      />
      <div
        className={`background-blue ${selected == 'blue' && 'color-picker-selected'}`}
        onClick={
          () => {
            canvasSetStrokeColor("blue")
            setSelected("blue")
          }
        }
      />
    </div>
  )
}

