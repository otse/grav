import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import aabb2 from "./Aabb2";
import Grav from "./Grav";

import pts from "./Pts";
import Renderer from "./Renderer";

namespace Game {
	export class Galaxy {
		static readonly Unit = 50;
		readonly sectorSpan: number;
		arrays: Sector[][] = [];
		readonly center: Center;
		constructor(span) {
			this.sectorSpan = span;
			this.center = new Center(this);
		}
		update(wpos: Vec2) {
			// lay out sectors in a grid
			this.center.big = wpos;
			this.center.off();
			this.center.crawl();
		}
		big(wpos: Vec2): Vec2 {
			return pts.floor(pts.divide(wpos, this.sectorSpan));
		}
		atnullable(x, y): Sector | undefined { // nullable
			if (this.arrays[y] == undefined)
				this.arrays[y] = [];
			return this.arrays[y][x];
		}
		at(x, y): Sector {
			return this.atnullable(x, y) || this.make(x, y);
		}
		atsmall(wpos: Vec2): Sector {
			let ig = this.big(wpos);
			return this.at(ig[0], ig[1]);
		}
		make(x, y): Sector {
			let s = this.atnullable(x, y);
			if (s)
				return s;
			//console.log('galaxy make', [x, y]);
			s = this.arrays[y][x] = new Sector(x, y, this);
			return s;
		}
	}
	export class Sector {
		static Num = 0;
		active = false
		readonly span = 2000;
		readonly big: Vec2;
		private readonly objs: Obj[] = [];
		constructor(x, y, galaxy) {
			this.big = [x, y];
			Sector.Num++;
		}
		add(obj: Obj) {
			let i = this.objs.indexOf(obj);
			if (i == -1)
				this.objs.push(obj);
			if (this.active)
				obj.show();
		}
		remove(obj: Obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1)
				return !!this.objs.splice(i, 1);
		}
		updates() {
			for (let obj of this.objs) obj.tickupdate();
		}
		show() {
			if (this.active) return;
			for (let obj of this.objs) obj.show();
			return this.active = true;
		}
		hide() {
			if (!this.active) return;
			for (let obj of this.objs) obj.hide();
			return this.active = false;
		}
		objs_(): ReadonlyArray<Obj> { return this.objs; }
	}
	export class Center {
		big: Vec2 = [0, 0];
		public shown: Sector[] = [];
		constructor(private readonly galaxy: Galaxy) {
		}
		crawl() {
			let radius = 4;
			let half = Math.ceil(radius / 2);
			for (let y = -half; y < half; y++) {
				for (let x = -half; x < half; x++) {
					let pos = pts.add(this.big, [x, y]);
					let s = this.galaxy.atnullable(pos[0], pos[1]);
					if (s?.show()) {
						this.shown.push(s);
					}
				}
			}

		}
		off() {
			let i = this.shown.length;
			while (i--) {
				let s: Sector;
				s = this.shown[i];
				s.updates();
				//if (pts.distsimple(big, s.big) > 2)

			}
		}
	}
	export class Obj { // extend me
		static Num = 0;
		static Active = 0;
		wpos: Vec2 = [0, 0];
		rpos: Vec2 = [0, 0];
		size: Vec2 = [100, 100];
		drawable: Drawable | undefined;
		sector: Sector | undefined;
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
		update() { // implement
			this.drawable?.update();
		}
		tickupdate() {
			this.update();
		}
		done() { // implement
			this.rpos = pts.mult(this.wpos, Galaxy.Unit);
			this.bound();
		}
		aabb: aabb2 | undefined;
		bound() {
			let div = pts.divide(this.size, 2);
			this.aabb = new aabb2(pts.inv(div), div);
			this.aabb.translate(this.wpos);
		}
		moused(mouse: Vec2) {
			if (this.aabb?.test(new aabb2(mouse, mouse)))
				return true;
		}
	}
	export class Drawable {
		static Num = 0;
		static Active = 0;
		active = false;
		shape: Shape | undefined;
		constructor(public readonly obj: Obj) {
			Drawable.Num++;
		}
		done() {
			// leave empty
		}
		update() {
			this.shape?.update();
		}
		delete() {
			this.hide();
			Drawable.Num--;
		}
		show() {
			if (this.active) return;
			this.shape?.setup();
			this.active = true;
			Drawable.Active++;
		}
		hide() {
			if (!this.active) return;
			this.shape?.dispose();
			this.active = false;
			Drawable.Active--;
		}

	}
	export class Shape {
		constructor(public readonly drawable: Drawable) {

		}
		done() {
			// implement
		}
		update() {
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
		material: MeshBasicMaterial;
		geometry: PlaneBufferGeometry;
		constructor(drawable: Drawable) {
			super(drawable);
		}
		done() {
		}
		update() {
			this.mesh?.position.fromArray([...this.drawable.obj.rpos, 0]);
			this.mesh?.updateMatrix();
		}
		dispose() {
			this.geometry?.dispose();
			this.material?.dispose();
		}
		setup() {
			let w = this.drawable.obj.size[0];
			let h = this.drawable.obj.size[1];
			this.geometry = new PlaneBufferGeometry(w, h, 2, 2);
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
	}
}

export default Game;