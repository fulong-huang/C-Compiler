import Shape from "../shape/Shape.tsx";
import Rectangle from "../shape/Rectangle.tsx";
import Circle from "../shape/Circle.tsx";
import Line from "../shape/Line.tsx";
import Sketch from "../shape/Sketch.tsx";

import { addHistory, redoHistory, undoHistory, EditHistoryCreateShape, EditHistoryMoveShape, EditHistoryRemoveShape } from "./editHistory.tsx";
let selectedElementPosition: [number, number] = [0, 0];

const canvasScaleAmount: number = 1.1;
let canvasCurrScale: number = 1;
let canvasShiftedAmount: [number, number] = [0, 0];

let CANVAS!: HTMLCanvasElement;
// = document.getElementById("canvas")! as HTMLCanvasElement;
let canvasCtx!: CanvasRenderingContext2D;
// = canvasCanvas.getContext('2d')!;
let canvasWidth: number = 0;
let canvasHeight: number = 0;

let strokeColor: string = "white";
let strokeWidth: number = 5;

export const canvasElements: Array<Shape> = [];
let canvasIsMouseDown: boolean = false;
let canvasMouseMoved: boolean = false;
let canvasCurrShape: Sketch | Line | Rectangle | Circle | null;
let canvasSelectedShapeIdx: number = -1;
let canvasIsMovingShape: boolean = false;
let canvasMovementOffset: [number, number] = [0, 0];
let canvasSelectedShape:
  | typeof Sketch
  | typeof Rectangle
  | typeof Line
  | typeof Circle = Sketch;

let canvasMode: "Pointer" | "Draw" = "Draw";

const canvasMouseDownHandler = (e: MouseEvent) => canvasHandleMouseDown(e);
const canvasMouseUpHandler = (e: MouseEvent) => canvasHandleMouseUp(e);
const canvasMouseMoveHandler = (e: MouseEvent) => canvasHandleMouseMovement(e);

const canvasWheelScrollHandler = (e: WheelEvent) => canvasHandleWheelScroll(e);

const canvasKeydownHandler = (e: KeyboardEvent) => canvasHandleKeydown(e);

export function canvasCleanUp() {
  CANVAS.removeEventListener("mousedown", canvasMouseDownHandler);
  CANVAS.removeEventListener("mouseup", canvasMouseUpHandler);
  CANVAS.removeEventListener("mousemove", canvasMouseMoveHandler);

  CANVAS.removeEventListener("wheel", canvasWheelScrollHandler);

  window.removeEventListener("keydown", canvasKeydownHandler);
}

export function canvasInit() {
  CANVAS = document.getElementById("canvas")! as HTMLCanvasElement;
  canvasCtx = CANVAS.getContext("2d")!;
  CANVAS.addEventListener("mousedown", canvasMouseDownHandler);
  CANVAS.addEventListener("mouseup", canvasMouseUpHandler);
  CANVAS.addEventListener("mousemove", canvasMouseMoveHandler);

  CANVAS.addEventListener("wheel", canvasWheelScrollHandler, { passive: true });

  window.addEventListener("keydown", canvasKeydownHandler, true);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvasResize(width, height);
}

function canvasHandleKeydown(event: KeyboardEvent) {
  const key = event.key;
  switch (key) {
    case "Backspace":
    case "Delete": {
      if (canvasSelectedShapeIdx >= 0) {
        const newHistory = new EditHistoryRemoveShape(canvasElements[canvasSelectedShapeIdx]);
        newHistory.perform();
        addHistory(newHistory);
        canvasUpdateCanvas();
        //         canvasElements.splice(canvasSelectedShapeIdx, 1);
        //         canvasSelectedShapeIdx = -1;
        //         canvasUpdateCanvas();
      }
      break;
    }
    case "z":
      canvasSelectedShapeIdx = -1;
      undoHistory();
      canvasUpdateCanvas();
      break;
    case "r":
      canvasSelectedShapeIdx = -1;
      redoHistory();
      canvasUpdateCanvas();
      break;
  }
}

export function canvasResize(width: number, height: number) {
  CANVAS.style.width = width + "px";
  CANVAS.style.height = height + "px";
  CANVAS.width = width;
  CANVAS.height = height;
  canvasWidth = width;
  canvasHeight = height;

  canvasUpdateCanvas();
}

export function canvasUpdateCanvas() {
  canvasClear();
  canvasDrawElements(canvasElements);
  if (canvasCurrShape) canvasDraw(canvasCurrShape);
  if (canvasSelectedShapeIdx >= 0) {
    canvasElements[canvasSelectedShapeIdx].drawBoundingBox(
      canvasCtx,
      canvasShiftedAmount,
      canvasCurrScale,
    );
  }
}

export function canvasCalculateMovementOffset(mouseX: number, mouseY: number) {
  const [objX, objY] = canvasElements[canvasSelectedShapeIdx].getPosition();
  canvasMovementOffset = [mouseX - objX, mouseY - objY];
}
export function canvasGetActualCoordinate(x: number, y: number): [number, number] {
  x = x / canvasCurrScale + canvasShiftedAmount[0];
  y = y / canvasCurrScale + canvasShiftedAmount[1];
  return [x, y];
}

function canvasHandleMouseMovement(event: MouseEvent) {
  if (!canvasIsMouseDown) return;
  canvasMouseMoved = true;
  const [mousePosX, mousePosY] = canvasGetActualCoordinate(
    event.offsetX,
    event.offsetY,
  );
  if (canvasMode == "Pointer") {
    if (canvasIsMovingShape) {
      canvasElements[canvasSelectedShapeIdx].moveTo(
        mousePosX,
        mousePosY,
        canvasMovementOffset,
      );
    } else {
      // Use mouse event to calculate shifted amount instead
      canvasShiftedAmount[0] -= event.movementX * (1 / canvasCurrScale);
      canvasShiftedAmount[1] -= event.movementY * (1 / canvasCurrScale);
    }
  } else if (canvasMode == "Draw") {
    if (canvasCurrShape instanceof Sketch) {
      canvasCurrShape.addPoint(mousePosX, mousePosY);
    } else if (canvasCurrShape instanceof Rectangle) {
      canvasCurrShape.setDiagonal(mousePosX, mousePosY);
    } else if (canvasCurrShape instanceof Line) {
      canvasCurrShape.movePoint2(mousePosX, mousePosY);
    } else if (canvasCurrShape instanceof Circle) {
      canvasCurrShape.setEndPoint(mousePosX, mousePosY);
    } else {
      console.log("else");
    }
  }
  canvasUpdateCanvas();
}
function canvasHandleMouseDown(event: MouseEvent) {
  if (canvasIsMouseDown) return;

  canvasIsMouseDown = true;
  const [mousePosX, mousePosY] = canvasGetActualCoordinate(
    event.offsetX,
    event.offsetY,
  );
  canvasMouseMoved = false;

  if (canvasMode == "Pointer") {
    if (
      canvasSelectedShapeIdx >= 0 &&
      canvasElements[canvasSelectedShapeIdx].isClicked(mousePosX, mousePosY)
    ) {
      canvasIsMovingShape = true;
      canvasCalculateMovementOffset(mousePosX, mousePosY);
    } else {
      canvasIsMovingShape = false;
      //
    }
  } else if (canvasMode == "Draw") {
    canvasSelectedShapeIdx = -1;
    if (canvasSelectedShape == Sketch) {
      canvasCurrShape = new Sketch(mousePosX, mousePosY, strokeColor, [], strokeWidth / canvasCurrScale);
    } else if (canvasSelectedShape == Rectangle) {
      canvasCurrShape = new Rectangle(mousePosX, mousePosY, 0, 0, strokeColor, strokeWidth / canvasCurrScale);
    } else if (canvasSelectedShape == Line) {
      canvasCurrShape = new Line(mousePosX, mousePosY, mousePosX, mousePosY, strokeColor, strokeWidth / canvasCurrScale);
    } else if (canvasSelectedShape == Circle) {
      canvasCurrShape = new Circle(mousePosX, mousePosY, 0, strokeColor, strokeWidth / canvasCurrScale);
    }
  }
}
function canvasHandleMouseUp(event: MouseEvent) {
  canvasIsMouseDown = false;
  const [mousePosX, mousePosY] = canvasGetActualCoordinate(
    event.offsetX,
    event.offsetY,
  );

  if (canvasMode == "Pointer") {
    if (!canvasMouseMoved) {
      canvasIsMovingShape = false;
      canvasSelectedShapeIdx = -1;
      for (let i = canvasElements.length - 1; i >= 0; i--) {
        if (canvasElements[i].isClicked(mousePosX, mousePosY)) {
          canvasSelectedShapeIdx = i;
          selectedElementPosition = canvasElements[canvasSelectedShapeIdx].getPosition();
          break;
        }
      }
    }
    else if (canvasIsMovingShape) {
      const newHistory = new EditHistoryMoveShape(
        canvasElements[canvasSelectedShapeIdx],
        selectedElementPosition,
        [mousePosX, mousePosY],
        canvasMovementOffset
      );
      newHistory.perform();
      addHistory(newHistory);
      canvasUpdateCanvas();
    }
  } else if (canvasMode == "Draw") {
    if (canvasCurrShape && canvasCurrShape.exist()) {
      const newHistory = new EditHistoryCreateShape(canvasCurrShape);
      newHistory.perform();
      addHistory(newHistory);
      canvasCurrShape = null;
      // canvasElements.push(canvasCurrShape);
    } else {
      // TODO:
      // displace image
    }
  }
  canvasUpdateCanvas();
}

function canvasHandleWheelScroll(event: WheelEvent) {
  let scale: number;
  if (event.deltaY < 0) scale = canvasCurrScale * canvasScaleAmount;
  else scale = canvasCurrScale / canvasScaleAmount;
  canvasZoom(event.offsetX, event.offsetY, scale);
}
export function canvasSetSelectedTool(
  toolSelected: "Sketch" | "Line" | "Rectangle" | "Circle" | "Pointer",
) {
  canvasMode = "Draw";
  if (toolSelected == "Sketch") {
    canvasSelectedShape = Sketch;
  } else if (toolSelected == "Line") {
    canvasSelectedShape = Line;
  } else if (toolSelected == "Rectangle") {
    canvasSelectedShape = Rectangle;
  } else if (toolSelected == "Circle") {
    canvasSelectedShape = Circle;
  } else if (toolSelected == "Pointer") {
    canvasMode = "Pointer";
    canvasSelectedShape = Rectangle;
  } else {
    // TODO:
    // User not drawing
  }
}

export function canvasGetCurrSclae() {
  return canvasCurrScale;
}
export function canvasGetWidth() {
  return canvasWidth;
}
export function canvasGetHeight() {
  return canvasHeight;
}
export function canvasGetContext() {
  return canvasCtx;
}
export function canvasGetCanvas() {
  return CANVAS;
}

export function canvasResetZoom() {
  // TODO:
  // Elements should still be shifted,
  // reset scale to 1 and change to appropriate values
  canvasShiftedAmount = [0, 0];

  canvasCurrScale = 1;
  canvasUpdateCanvas();
}
export function canvasZoom(x: number, y: number, newScale: number) {
  canvasShiftedAmount[0] -= x * (1 / newScale - 1 / canvasCurrScale);
  canvasShiftedAmount[1] -= y * (1 / newScale - 1 / canvasCurrScale);
  canvasCurrScale = newScale;
  canvasUpdateCanvas();
}

export function canvasClear() {
  canvasCtx.clearRect(0, 0, CANVAS.width, CANVAS.height);
}
export function canvasDraw(elements: Shape) {
  elements.draw(canvasCtx, canvasShiftedAmount, canvasCurrScale);
}
function canvasDrawElements(elements: Shape[]) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].draw(canvasCtx, canvasShiftedAmount, canvasCurrScale);
  }
}

export function canvasTest() {
  canvasSetSelectedTool("Pointer");
}

export function canvasSetStrokeColor(color: string) {
  strokeColor = color;
}
export function canvasSetStrokeWidth(width: number) {
  strokeWidth = width;
}


