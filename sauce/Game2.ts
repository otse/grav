import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import App from "./App";

import Pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";
import Game3 from "./Game3";

namespace Game2 {
	export namespace globals {
		export var wlrd: World;
		export var ply: Ply;
	}
	export class World {
		objs: Game.Obj[] = [];
		view: Vec2 = [0, 0];
		pos: Vec2 = [0, 0];
		static make() {
			globals.wlrd = new World;
		}
		constructor() {
		}
		add(obj: Game.Obj) {
			this.objs.push(obj);
			obj.show();
		}
		remove(obj: Game.Obj) {
			let i = this.objs.indexOf(obj);
			if (i != -1)
				this.objs.splice(-1, 1);
		}
		update() {
			this.click();
			this.move();
			this.stats();
			for (let obj of this.objs) {
				obj.update();
			}
		}
		click() {
			if (App.button(0) == 1) {
				console.log('clicked the view');
				let inverted = App.mouse();
				inverted = Pts.subtract(inverted, Pts.divide([Renderer.w, Renderer.h], 2))
				inverted[1] = -inverted[1];
				let unprojected = Pts.add(this.view, inverted);
				let ping = new Game3.Ping;
				ping.wpos = unprojected;
				ping.done();
				this.add(ping);
			}
		}
		move() {
			let pan = 5;
			if (App.key('x')) pan *= 10;
			if (App.key('w')) this.view[1] += pan;
			if (App.key('s')) this.view[1] -= pan;
			if (App.key('a')) this.view[0] -= pan;
			if (App.key('d')) this.view[0] += pan;
			let inv = Pts.inv(this.view);
			Renderer.scene.position.set(inv[0], inv[1], 0);
		}
		stats() {
			let crunch = ``;
			crunch += `mouse: ${Pts.to_string(App.mouse())}<br /><br />`;
			crunch += `world view: ${Pts.to_string(this.view)}<br />`;
			crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
			crunch += `num game objs: ${Game.Obj.Active} / ${Game.Obj.Num}<br />`;
			crunch += `num drawables: ${Game.Drawable.Active} / ${Game.Drawable.Num}<br />`;
			App.sethtml('.stats', crunch);
		}
		start() {
			globals.ply = this.ply();
			this.add(globals.ply);
		}
		ply() {
			let ply = new Game2.Ply;
			ply.done();
			return ply;
		}
	}
	export class Ply extends Game.Obj {
		constructor() {
			super();
		}
		done() {
			let drawable = new Game.Drawable();
			drawable.obj = this;
			drawable.done();
			let shape = new Game.Quad();
			shape.drawable = drawable;
			shape.img = 'redfighter0005';
			shape.done();
			this.drawable = drawable;
			this.drawable.shape = shape;
		}
	}
}

export default Game2;