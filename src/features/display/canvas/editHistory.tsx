import Shape from "../shape/Shape";
import { canvasElements } from "./canvasFunction";

const History: Array<EditHistory> = [];
let HistoryIdx: number = -1;

export function addHistory(history: EditHistory) {
  if (HistoryIdx == History.length - 1) {
    History.push(history);
  }
  else {
    History.splice(HistoryIdx + 1);
    History.push(history);
  }
  HistoryIdx++;
}
export function undoHistory() {
  if (HistoryIdx >= 0) {
    History[HistoryIdx].undo();
    HistoryIdx--;
  }
}
export function redoHistory() {
  HistoryIdx++;
  if (HistoryIdx < History.length) {
    History[HistoryIdx].perform();
  }
  else {
    HistoryIdx--;
  }
}

export class EditHistory {
  shape!: Shape;
  constructor(shape: Shape) {
    this.shape = shape;
  }

  perform() {
    console.error("DEFAULT PERFORM FUNCTION")
  }
  undo() {
    console.error("DEFAULT UNDO FUNCTION")
  }
};

export class EditHistoryCreateShape extends EditHistory {
  perform() {
    canvasElements.push(this.shape);
  }
  undo() {
    canvasElements.splice(canvasElements.indexOf(this.shape), 1);
  }
}

export class EditHistoryRemoveShape extends EditHistory {
  perform() {
    canvasElements.splice(canvasElements.indexOf(this.shape), 1);
  }
  undo() {
    canvasElements.push(this.shape);
  }
}

export class EditHistoryMoveShape extends EditHistory {
  from: [number, number];
  to: [number, number];
  offset: [number, number];
  constructor(shape: Shape, from: [number, number], to: [number, number], offset: [number, number]) {
    super(shape);
    this.from = from;
    this.to = to;
    this.offset = offset;
  }
  perform() {
    this.shape.moveTo(this.to[0], this.to[1], this.offset);
  }
  undo() {
    this.shape.moveTo(this.from[0], this.from[1]);
  }
}



