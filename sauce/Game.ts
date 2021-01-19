import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import GRAV from "./Grav";

import App from "./App";

import Pts from "./Pts";
import Renderer from "./Renderer";

namespace Grav {

	export class World {
		objs: Obj[] = [];
		pos: Vec2 = [0, 0];
		static make() {
			return new World;
		}
		constructor() {
		}
		add(obj: Obj) {
			this.objs.push(obj);
			obj.show();
		}
		remove(obj: Obj) {
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
			if (App.keys['x']) speed *= 10;
			if (App.keys['w']) p[1] -= speed;
			if (App.keys['s']) p[1] += speed;
			if (App.keys['a']) p[0] += speed;
			if (App.keys['d']) p[0] -= speed;
			Renderer.scene.position.set(p[0], p[1], 0);
		}
		stats() {
			let crunch = ``;
			crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
			crunch += `num game objs: ${Obj.Active} / ${Obj.Num}<br />`;
			crunch += `num drawables: ${Drawable.Active} / ${Drawable.Num}<br />`;
			App.sethtml('.stats', crunch);
		}
		init() {
			let ply = new Grav.Ply;
			ply.done();
			GRAV.ply = ply;
			GRAV.wlrd.add(ply);
		}
	}

	export class Obj { // extend me
		static Num = 0;
		static Active = 0;
		drawable: Drawable | undefined;
		constructor() {
			Obj.Num++;
		}
		delete() {
			this.hide();
			Obj.Num--;
		}
		show() {
			this.drawable?.show();
			Obj.Active++;
		}
		hide() {
			this.drawable?.hide();
			Obj.Active--;
		}
		update() {
			// implement
		}
	}
	namespace Obj {
		export type Me = Obj;
	}

	export class Drawable {
		static Num = 0;
		static Active = 0;
		obj: Obj | undefined;
		shape: Shape | undefined;
		constructor() {
			Drawable.Num++;
		}
		done() {
			//this.shape = new Quad;
		}
		delete() {
			this.hide();
			Drawable.Num--;
		}
		show() {
			this.shape?.setup();
			Drawable.Active++;
		}
		hide() {
			this.shape?.dispose();
			Drawable.Active--;
		}
	}

	export class Shape {
		constructor() {

		}
		done() {
			// implement
		}
		setup() {
			// implement
		}
		dispose() {
			// implement
		}
	}
	
	export class Quad extends Shape {
		img: string = 'forgot to set';
		mesh: Mesh | undefined;
		material: MeshBasicMaterial | undefined;
		geometry: PlaneBufferGeometry | undefined;
		constructor() {
			super();
		}
		done() {
		}
		dispose() {
			this.geometry?.dispose();
			this.material?.dispose();
		}
		setup() {
			this.geometry = new PlaneBufferGeometry(100, 100, 2, 2);
			let map = Renderer.loadtexture(`img/${this.img}.png`);
			this.material = new MeshBasicMaterial({
				map: map,
				transparent: true,
				//color: 0xffffff,
				//color: 'red'
			});
			this.mesh = new Mesh(this.geometry, this.material);
			//this.mesh.frustumCulled = false;
			//this.mesh.matrixAutoUpdate = false;
			this.update();
			Renderer.scene.add(this.mesh);
		}
		update() {

		}
	}

	export class Ply extends Grav.Obj {
		constructor() {
			super();
		}
		done() {
			let drawable = new Grav.Drawable;
			drawable.obj = this;
			drawable.done();
			this.drawable = drawable;
			let quad = new Grav.Quad;
			quad.img = 'redfighter0005';
			quad.done();
			this.drawable.shape = quad;
			GRAV.ply = this;
			GRAV.wlrd.add(this);
		}
	}
}

export default Grav;