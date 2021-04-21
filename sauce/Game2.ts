import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color, RedFormat } from "three";

import App from "./App";

import pts from "./Pts";
import Renderer from "./Renderer";

import Core from "./Core";
import Game3 from "./Game3";
import Hooks from "./Hooks";

namespace Game2 {
	export namespace globals {
		export var wlrd: World;
		export var ply: Ply;
		export var galaxy: Core.Galaxy;
	}
	export function start() {
		globals.wlrd = Game2.World.make();
		globals.galaxy = new Core.Galaxy(10);
		Hooks.start();
	}
	export class World {
		//objs: Game.Obj[] = [];
		view: Vec2 = [0, 0];
		pos: Vec2 = [0, 0];
		wpos: Vec2 = [0, 0];
		mpos: Vec2 = [0, 0];
		static make() {
			return new World;
		}
		chart(big: Vec2) {
		}
		constructor() {
		}
		add(obj: Core.Obj) {
			let s = globals.galaxy.atw(obj.wpos);
			s.add(obj);
		}
		remove(obj: Core.Obj) {
			obj.sector?.remove(obj);
		}
		update() {
			this.move();
			this.mouse();
			this.stats();
			let pos = Core.Galaxy.unproject(this.view);
			globals.galaxy.update(pos);
		}
		mouse() {
			let mouse = App.mouse();
			mouse = pts.subtract(mouse, pts.divide([Renderer.w, Renderer.h], 2))
			mouse = pts.mult(mouse, Renderer.ndpi);
			mouse[1] = -mouse[1];
			this.mpos = pts.add(this.view, mouse);
			if (App.button(0) == 1) {
				console.log('clicked the view');
				let rock = new Game3.Rock;
				rock.wpos = pts.divide(this.mpos, Core.Galaxy.Unit); // Galaxy.unproject
				rock.done();
				this.add(rock);
			}
		}
		move() {
			let pan = 5;
			if (App.key('x')) pan *= 10;
			if (App.key('w')) this.view[1] += pan;
			if (App.key('s')) this.view[1] -= pan;
			if (App.key('a')) this.view[0] -= pan;
			if (App.key('d')) this.view[0] += pan;
			let inv = pts.inv(this.view);
			Renderer.scene.position.set(inv[0], inv[1], 0);
		}
		stats() {
			let crunch = ``;
			crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br />`;
			crunch += `fps: ${Renderer.fps}<br />`;
			crunch += `memory: ${Renderer.memory}<br />`;
			crunch += `(n)dpi: ${Renderer.ndpi}<br />`;
			crunch += `mouse: ${pts.to_string(App.mouse())}<br /><br />`;
			crunch += `world view: ${pts.to_string(this.view)}<br />`;
			crunch += `world pos: ${pts.to_string(this.pos)}<br /><br />`;
			crunch += `sectors: ${Core.Sector.Active} / ${Core.Sector.Num}<br />`;
			crunch += `game objs: ${Core.Obj.Active} / ${Core.Obj.Num}<br />`;
			crunch += `drawables: ${Core.Drawable.Active} / ${Core.Drawable.Num}<br />`;
			App.sethtml('.stats', crunch);
		}
		start() {
			globals.ply = Ply.make();
			this.add(globals.ply);
		}
	}
	export class Ply extends Core.Obj {
		static make() {
			let ply = new Ply;
			ply.done();
			return ply;
		}
		constructor() {
			super();
		}
		done() {
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'redfighter0005'
			});
			super.done();
		}
		tick() {
			super.update();
		}
	}
	export namespace Util {
		export function Galx_towpos(s: Core.Sector, wpos: Vec2) {
		}

		export function Sector_getobjat(s: Core.Sector, wpos: Vec2) {
			for (let obj of s.objs_())
				if (pts.equals(obj.wpos, wpos))
					return obj;
		}
	}
}

export default Game2;