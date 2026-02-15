import Shape from './Shape.tsx'
export default class Line extends Shape {
  x2: number;
  y2: number
  color: string;
  constructor(x: number, y: number, x2: number, y2: number,
    color = 'white', lineWidth: number = 5) {
    super(x, y);
    this.x2 = x2;
    this.y2 = y2;
    this.lineWidth = lineWidth;
    this.color = color;

    this.bounds = {
      x1: x, y1: y, x2: x2, y2: y2
    }

    if (x > x2) {
      this.bounds.x1 = x2
      this.bounds.x2 = x
    }
    if (y > y2) {
      this.bounds.y1 = y2
      this.bounds.y2 = y
    }
  }
  exist() {
    return this.x != this.x2, this.y != this.y2
  }
  movePoint2(x2: number, y2: number) {
    this.x2 = x2
    this.y2 = y2

    if (this.x > x2) {
      this.bounds.x1 = x2
      this.bounds.x2 = this.x
    }
    else {
      this.bounds.x1 = this.x
      this.bounds.x2 = x2
    }
    if (this.y > y2) {
      this.bounds.y1 = y2
      this.bounds.y2 = this.y
    }
    else {
      this.bounds.y1 = this.y
      this.bounds.y2 = y2
    }
  }
  setColor(color: string) {
    this.color = color;
  }
  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }
  moveTo(x: number, y: number, offset: [number, number] = [0, 0]) {
    const diffX = x - this.x - offset[0]
    const diffY = y - this.y - offset[1]
    this.x2 += diffX
    this.y2 += diffY
    this.x = x - offset[0]
    this.y = y - offset[1]
    this.bounds.x1 += diffX
    this.bounds.x2 += diffX
    this.bounds.y1 += diffY
    this.bounds.y2 += diffY
  }
  draw(ctx: CanvasRenderingContext2D, shiftedAmount: [number, number], scale: number) {
    const x1 = (this.x - shiftedAmount[0]) * scale
    const y1 = (this.y - shiftedAmount[1]) * scale
    const x2 = (this.x2 - shiftedAmount[0]) * scale
    const y2 = (this.y2 - shiftedAmount[1]) * scale
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * scale;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};

