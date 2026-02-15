import { canvasInit, canvasCleanUp, canvasResize } from "./display/canvas/canvasFunction.tsx";
import "./manager.css";

export function managerInit() {
	canvasInit();
	window.addEventListener('resize', handleResize);
	handleResize()
}


export function managerCleanUp() {
  canvasCleanUp();
	window.removeEventListener('resize', handleResize);
}

function handleResize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	canvasResize(width, height);
}

