import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color, RedFormat } from "three";

import App from "./App";

import pts from "./Pts";
import Renderer from "./Renderer";

import Core, { Countable } from "./Core";
import Objects from "./Objects";
import Hooks from "./Hooks";

namespace Universe {
	export namespace globals {
		export var game: Game;
		export var ply: Objects.Ply;
	}
	export function start() {
		globals.game = Game.make();
		Hooks.start();
	}
	export class Game {
		galaxy: Core.Galaxy;
		//objs: Game.Obj[] = [];
		view: vec2 = [0, 0];
		pos: vec2 = [0, 0];
		wpos: vec2 = [0, 0];
		mrpos: vec2 = [0, 0];
		static make() {
			return new Game;
		}
		chart(big: vec2) {
		}
		constructor() {
			this.galaxy = new Core.Galaxy(10);
		}
		add(obj: Core.Obj) {
			let sector = this.galaxy.atwpos(obj.wpos);
			sector.add(obj);
		}
		remove(obj: Core.Obj) {
			obj.sector?.remove(obj);
		}
		tick() {
			this.move();
			this.mouse();
			this.stats();
			let pos = Core.Galaxy.unproject(this.view);
			this.galaxy.update(pos);
		}
		mouse() {
			let mouse = App.mouse();
			mouse = pts.subtract(mouse, pts.divide([Renderer.w, Renderer.h], 2))
			mouse = pts.mult(mouse, Renderer.ndpi);
			mouse[1] = -mouse[1];
			this.mrpos = pts.add(this.view, mouse);
			if (App.button(0) == 1) {
				console.log('clicked the view');
				let rock = new Objects.Rock;
				// pts.divide(this.mpos, Core.Galaxy.Unit); // Galaxy.unproject
				rock.wpos = Core.Galaxy.unproject(this.mrpos);
				rock.make();
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
			this.pos = Core.Galaxy.unproject(this.view);
			Renderer.scene.position.set(inv[0], inv[1], 0);
		}
		stats() {
			let crunch = ``;
			crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br />`;
			crunch += `fps: ${Renderer.fps}<br />`;
			crunch += `memory: ${Renderer.memory}<br />`;
			crunch += `(n)dpi: ${Renderer.ndpi}<br />`;
			crunch += `mouse pos: ${pts.to_string(App.mouse())}<br /><br />`;
			crunch += `world pos: ${pts.to_string(this.view)}<br />`;
			//crunch += `world wpos: ${pts.to_string(this.pos)}<br /><br />`;
			crunch += `sectors: ${Countable.Get('Sector').Active} / ${Countable.Get('Sector').Num}<br />`;
			crunch += `game objs: ${Countable.Get('Obj').Active} / ${Countable.Get('Obj').Num}<br />`;
			crunch += `drawables: ${Countable.Get('Drawable').Active} / ${Countable.Get('Drawable').Num}<br />`;
			App.sethtml('.stats', crunch);
		}
		start() {
			globals.ply = Objects.Ply.instance();
			this.add(globals.ply);
		}
	}
	
	export namespace Util {
		export function Galx_towpos(s: Core.Sector, wpos: vec2) {
		}

		export function Sector_getobjat(s: Core.Sector, wpos: vec2) {
			for (let obj of s.objs_())
				if (pts.equals(obj.wpos, wpos))
					return obj;
		}
	}
}

export default Universe;