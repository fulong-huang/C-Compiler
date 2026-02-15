import Shape from './Shape.tsx'
export default class Circle extends Shape {
  radius: number;
  color: string;
  constructor(x: number, y: number, radius = 50, color = 'black', lineWidth = 1) {
    super(x, y);
    this.radius = radius;
    this.color = color;
    this.lineWidth = lineWidth;

    // TODO:
    // bound
    this.bounds = {
      x1: x - this.radius, y1: y - this.radius,
      x2: x + this.radius, y2: y + this.radius
    }
  }
  exist() {
    return this.radius > 0;
  }

  setEndPoint(x: number, y: number) {
    const diffX = Math.abs(this.x - x)
    const diffY = Math.abs(this.y - y)
    // const minDiff = diffX > diffY ? diffY : diffX
    const maxDiff = diffX < diffY ? diffY : diffX
    this.radius = maxDiff
    this.bounds = {
      x1: this.x - this.radius, y1: this.y - this.radius,
      x2: this.x + this.radius, y2: this.y + this.radius
    }
  }
  moveTo(x: number, y: number, offset: [number, number] = [0, 0]) {
    const diffX = x - this.x - offset[0]
    const diffY = y - this.y - offset[1]
    this.x = x - offset[0]
    this.y = y - offset[1]
    this.bounds.x1 += diffX
    this.bounds.x2 += diffX
    this.bounds.y1 += diffY
    this.bounds.y2 += diffY
  }
  draw(ctx: CanvasRenderingContext2D, shiftedAmount: [number, number], scale: number) {
    const x = (this.x - shiftedAmount[0]) * scale;
    const y = (this.y - shiftedAmount[1]) * scale;
    ctx.beginPath();

    ctx.arc(x, y, this.radius * scale, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * scale;
    ctx.stroke();
    /*
      for filling circle
      ctx.fillStyle = this.color;
      ctx.fill();
    */
  }
};

