import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
//import GRAV from "./Grav";

import App from "./App";

import Pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";

namespace Game2 {
	export namespace globals {
		export var wlrd: World;
		export var ply: Ply;
	}
	export class World {
		objs: Game.Obj[] = [];
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
			this.move();
			this.stats();
			for (let obj of this.objs) {
				obj.update();
			}
		}
		move() {
			let speed = 5;
			let p = this.pos;
			if (App.key('x')) speed *= 10;
			if (App.key('w')) p[1] -= speed;
			if (App.key('s')) p[1] += speed;
			if (App.key('a')) p[0] += speed;
			if (App.key('d')) p[0] -= speed;
			Renderer.scene.position.set(p[0], p[1], 0);
		}
		stats() {
			let crunch = ``;
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
			let drawable = new Game.Drawable;
			drawable.obj = this;
			drawable.done();
			this.drawable = drawable;
			let quad = new Game.Quad;
			quad.img = 'redfighter0005';
			quad.done();
			this.drawable.shape = quad;
		}
	}
}

export default Game2;