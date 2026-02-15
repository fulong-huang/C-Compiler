export default class Shape {
  x: number;
  y: number;
  bounds: { x1: number, y1: number, x2: number, y2: number };
  lineWidth: number = 0;
  flip: number = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.bounds = {
      x1: x, y1: y, x2: x, y2: y
    }
  }
  drawBoundingBox(
    ctx: CanvasRenderingContext2D,
    shiftedAmount: [number, number],
    scale: number
  ) {

    const x = (this.bounds.x1 - shiftedAmount[0] - this.lineWidth / 2) * scale;
    const y = (this.bounds.y1 - shiftedAmount[1] - this.lineWidth / 2) * scale;
    const width = (this.bounds.x2 - this.bounds.x1 + this.lineWidth) * scale;
    const height = (this.bounds.y2 - this.bounds.y1 + this.lineWidth) * scale;

    this.flip += 2;
    this.flip %= 6;
    ctx.setLineDash([8 + this.flip])

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([0])
  }
  draw(ctx: CanvasRenderingContext2D,
    shiftedAmount: [number, number],
    scale: number,
  ) {
    const x = (this.x - shiftedAmount[0]) * scale;
    const y = (this.y - shiftedAmount[1]) * scale;
    const width = 500 * scale;
    const height = 500 * scale;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, width, height);
  }
  exist() {
    return false;
  }
  moveTo(x: number, y: number, offset: [number, number] = [0, 0]) {
    this.x = x + offset[0]
    this.y = y + offset[1]
  }

  getPosition(): [number, number] {
    return [this.x, this.y]
  }

  isClicked(x: number, y: number) {
    const leftX = this.bounds.x1 - this.lineWidth / 2
    const topY = this.bounds.y1 - this.lineWidth / 2
    const rightX = this.bounds.x2 + this.lineWidth / 2
    const botY = this.bounds.y2 + this.lineWidth / 2
    return leftX < x && x < rightX &&
      topY < y && y < botY
  }

}

