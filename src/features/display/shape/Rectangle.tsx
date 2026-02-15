import Shape from './Shape.tsx'
export default class Rectangle extends Shape {
  width: number;
  height: number;
  color: string;
  constructor(x: number, y: number, width = 50, height = 20, color = 'black', lineWidth = 1) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineWidth = lineWidth;

    this.bounds = {
      x1: x, y1: y,
      x2: x + width, y2: y + height
    }
    if (width < 0) {
      this.bounds.x1 = x + width;
      this.bounds.x2 = x;
    }
    if (height < 0) {
      this.bounds.y1 = y + height;
      this.bounds.y2 = y;
    }
  }
  exist() {
    return this.width != 0 && this.height != 0;
  }
  setDiagonal(x2: number, y2: number) {
    this.width = x2 - this.x;
    this.height = y2 - this.y;
    if (this.x > x2) {
      this.bounds.x1 = x2
      this.bounds.x2 = this.x
    }
    if (this.x < x2) {
      this.bounds.x1 = this.x
      this.bounds.x2 = x2
    }
    if (this.y > y2) {
      this.bounds.y1 = y2
      this.bounds.y2 = this.y
    }
    if (this.y < y2) {
      this.bounds.y1 = this.y
      this.bounds.y2 = y2
    }
  }
  changeDimension(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (width > 0) {
      this.bounds.x1 = this.x
      this.bounds.x2 = this.x + width
    }
    if (width < 0) {
      this.bounds.x1 = this.x + width
      this.bounds.x2 = this.x
    }
    if (height > 0) {
      this.bounds.y1 = this.y
      this.bounds.y2 = this.y + height
    }
    if (height < 0) {
      this.bounds.y1 = this.y + height
      this.bounds.y2 = this.y
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
    const width = this.width * scale;
    const height = this.height * scale;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * scale;
    ctx.strokeRect(x, y, width, height);


    /*
      create fill rectangle
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, width, height);
    */
  }
};

