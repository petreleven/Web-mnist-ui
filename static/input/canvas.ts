var canvas: HTMLCanvasElement | null;
var CanvasManager: DrawManager;

if (typeof globalThis.data === "undefined") {
  globalThis.data = [];
}

class DrawManager {
  canvasEl: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  isDrawing: boolean;
  width: number;
  height: number;
  lastDraw: number;
  relPos: Array<number>;
  constructor(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl;
    this.context = canvasEl.getContext("2d");
    this.isDrawing = false;
    this.width = this.canvasEl.width;
    this.height = this.canvasEl.height;
    this.lastDraw = Date.now();
    this.relPos = [];
    if (this.context !== null) {
      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.width, this.height);
    }

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDrag = this.onMouseDrag.bind(this);
    this.computeRelPos = this.computeRelPos.bind(this);
    this.update = this.update.bind(this);
    this.singlePath = this.singlePath.bind(this);
    this.addlisteners = this.addlisteners.bind(this);
    this.addlisteners();
  }

  addlisteners() {
    this.canvasEl.addEventListener("mousedown", this.onMouseDown);
    this.canvasEl.addEventListener("mouseup", this.onMouseUp);
    this.canvasEl.addEventListener("mouseleave", this.onMouseUp);
    this.canvasEl.addEventListener("mousemove", this.onMouseDrag);
  }

  computeRelPos(ev: MouseEvent) {
    let bb = this.canvasEl.getBoundingClientRect();
    const scaleX = this.canvasEl.width / bb.width;
    const scaleY = this.canvasEl.height / bb.height;
    let xPos: number = ev.clientX;
    let yPos: number = ev.clientY;
    this.relPos = [(xPos - bb.left) * scaleX, (yPos - bb.top) * scaleY];
    return this.relPos;
  }

  onMouseDown(ev: MouseEvent) {
    this.isDrawing = true;
    let relPos = this.computeRelPos(ev);
    data.push([[relPos[0], relPos[1]]]);
  }
  onMouseUp(ev: MouseEvent) {
    this.isDrawing = false;
    //senddata();
  }

  onMouseDrag(ev: MouseEvent) {
    if (this.isDrawing) {
      let relPos = this.computeRelPos(ev);
      data[data.length - 1].push([relPos[0], relPos[1]]);
      this.update();
    }
  }

  update() {
    if (!this.context) return;
    this.context.beginPath();
    this.context.strokeStyle = "white";
    for (let path of data) {
      this.singlePath(path);
    }
  }
  singlePath(path: Array<[number, number]>) {
    if (!this.context) return;
    this.context.lineWidth = 10;
    for (let i = 0; i < path.length - 1; i++) {
      let current_coord = path[i];
      let next_coord = path[i + 1];
      this.context?.moveTo(current_coord[0], current_coord[1]);
      this.context?.lineTo(next_coord[0], next_coord[1]);
      this.context.stroke();
    }
  }
}

async function senddata() {
  fetch("/data", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
}

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
  CanvasManager = new DrawManager(canvas);
});
