import Shape from './Shape.tsx'
export default class Sketch extends Shape {
  color: string;
  points: number[];
  constructor(x: number, y: number, color: string = 'red', points: number[] = [], lineWidth: number = 20) {
    super(x, y);
    this.color = color;
    this.lineWidth = lineWidth;
    this.points = points;
    this.bounds = {
      x1: x, y1: y,
      x2: x, y2: y
    }
  }
  addPoint(x: number, y: number) {
    this.points.push(x);
    this.points.push(y);
    if (x < this.bounds.x1) {
      this.bounds.x1 = x
    }
    else if (x > this.bounds.x2) {
      this.bounds.x2 = x
    }
    if (y < this.bounds.y1) {
      this.bounds.y1 = y
    }
    else if (y > this.bounds.y2) {
      this.bounds.y2 = y
    }
  }

  exist() {
    return true;
  }

  moveTo(x: number, y: number, offset: [number, number] = [0, 0]) {
    const diffX = x - this.x - offset[0]
    const diffY = y - this.y - offset[1]
    this.x = x - offset[0]
    this.y = y - offset[1]
    for (let i = 0; i < this.points.length; i += 2) {
      this.points[i] += diffX
      this.points[i + 1] += diffY
    }
    this.bounds.x1 += diffX
    this.bounds.x2 += diffX
    this.bounds.y1 += diffY
    this.bounds.y2 += diffY
  }

  draw(ctx: CanvasRenderingContext2D, shiftedAmount: [number, number], scale: number) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * scale;
    ctx.beginPath();
    const x = (this.x - shiftedAmount[0]) * scale
    const y = (this.y - shiftedAmount[1]) * scale
    ctx.moveTo(x, y);
    if (this.points.length == 0) {
      ctx.moveTo(x - this.lineWidth / 2, y);
      ctx.lineTo(x + this.lineWidth / 2, y);
    }
    else {
      for (let i = 0; i < this.points.length; i += 2) {
        const x2 = (this.points[i] - shiftedAmount[0]) * scale
        const y2 = (this.points[i + 1] - shiftedAmount[1]) * scale
        ctx.lineTo(x2, y2);
      }
    }
    ctx.stroke();
  }
}

