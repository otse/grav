import { Grav } from "./Grav"

import Renderer from "./Renderer"

namespace App {
	export enum KEY {
		OFF = 0,
		PRESS,
		WAIT,
		AGAIN,
		UP
	};
	var keys = {};
	var buttons = {};
	var pos = { x: 0, y: 0 };
	export var salt = 'x';
	export var wheel = 0;
	export function onkeys(event) {
		const key = event.key.toLowerCase();
		if ('keydown' == event.type)
			keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
		else if ('keyup' == event.type)
			keys[key] = KEY.UP;
		if (event.keyCode == 114)
			event.preventDefault();
	}
	export function key(k: string) {
		return keys[k];
	}
	export function button(b: number) {
		return buttons[b];
	}
	export function mouse() {
		return pos;
	}
	export function boot(version: string) {
		salt = version;
		function onmousemove(e) { pos.x = e.clientX; pos.y = e.clientY; }
		function onmousedown(e) { buttons[e.button] = 1; }
		function onmouseup(e) { buttons[e.button] = 0; }
		function onwheel(e) { wheel = e.deltaY < 0 ? 1 : -1; }
		document.onkeydown = document.onkeyup = onkeys;
		document.onmousemove = onmousemove;
		document.onmousedown = onmousedown;
		document.onmouseup = onmouseup;
		document.onwheel = onwheel;
		Renderer.init();
		Grav.init();
		loop(0);
	}
	export function delay() {
		for (let i in keys) {
			if (KEY.PRESS == keys[i])
				keys[i] = KEY.WAIT;
			else if (KEY.UP == keys[i])
				keys[i] = KEY.OFF;
		}
	}
	export function loop(timestamp) {
		requestAnimationFrame(loop);
		Renderer.update();
		Grav.update();
		Renderer.render();
		wheel = 0;
		delay();
	}
	export function sethtml(selector, html) {
		let element = document.querySelectorAll(selector)[0];
		element.innerHTML = html;
	}
}

window['App'] = App;

export default App;