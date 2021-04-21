import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color, Group } from "three";
import aabb2 from "./Aabb2";
import Grav from "./Grav";

import pts from "./Pts";
import Renderer from "./Renderer";

class Countable {
	static Num = 0;
	static Active = 0;
	protected active = false;
	isActive() { return this.active };
	protected on() {
		if (this.active)
			return true;
		this.active = true;
	}
	protected off() {
		if (!this.active)
			return true;
		this.active = false;
	}
};

namespace Core {
	export class Galaxy {
		static readonly Unit = 50;
		static readonly SectorSpan = 10;
		arrays: Sector[][] = [];
		readonly center: Center;
		constructor(span) {
			this.center = new Center(this);
		}
		update(wpos: Vec2) {
			// lay out sectors in a grid
			this.center.big = Galaxy.big(wpos);
			this.center.offs();
			this.center.crawl();
		}
		atnullable(x, y): Sector | undefined {
			if (this.arrays[y] == undefined)
				this.arrays[y] = [];
			return this.arrays[y][x];
		}
		at(x, y): Sector {
			return this.atnullable(x, y) || this.make(x, y);
		}
		atw(wpos: Vec2): Sector {
			let ig = Galaxy.big(wpos);
			return this.at(ig[0], ig[1]);
		}
		protected make(x, y): Sector {
			let s = this.atnullable(x, y);
			if (s)
				return s;
			s = this.arrays[y][x] = new Sector(x, y, this);
			return s;
		}
		static big(wpos: Vec2): Vec2 {
			return pts.floor(pts.divide(wpos, Galaxy.SectorSpan));
		}
		static unproject(pixel: Vec2): Vec2 { // wpos
			return pts.divide(pixel, Core.Galaxy.Unit);
		}
	}
	interface SectorHooks {
		onCreate: () => any;
	};
	export class Sector extends Countable {
		static hooks?: SectorHooks | undefined;
		group: Group;
		readonly span = 2000;
		readonly big: Vec2;
		private readonly objs: Obj[] = [];
		constructor(x, y, galaxy) {
			super();
			Sector.Num++;
			this.big = [x, y];
			this.group = new Group;
			Sector.hooks?.onCreate();
		}
		add(obj: Obj) {
			let i = this.objs.indexOf(obj);
			if (i == -1) {
				this.objs.push(obj);
				obj.sector = this;
				if (this.isActive())
					obj.show();
			}
		}
		remove(obj: Obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1) {
				obj.sector = undefined;
				return !!this.objs.splice(i, 1).length;
			}
		}
		tick() {
			for (let obj of this.objs)
				obj.tick();
		}
		show() {
			if (this.on())
				return;
			Sector.Active++;
			for (let obj of this.objs)
				obj.show();
			Renderer.scene.add(this.group);
		}
		hide() {
			if (this.off())
				return;
			Sector.Active--;
			for (let obj of this.objs)
				obj.hide();
			Renderer.scene.remove(this.group);
		}
		objs_(): ReadonlyArray<Obj> { return this.objs; }
	}
	export class Center {
		big: Vec2 = [0, 0];
		public shown: Sector[] = [];
		constructor(private readonly galaxy: Galaxy) {
		}
		crawl() {
			const spread = 3; // this is * 2
			for (let y = -spread; y < spread; y++) {
				for (let x = -spread; x < spread; x++) {
					let pos = pts.add(this.big, [x, y]);
					let sector = this.galaxy.atnullable(pos[0], pos[1]);
					if (!sector)
						continue;
					if (!sector.isActive()) {
						this.shown.push(sector);
						console.log(' show ! ');
						sector.show();
					}
				}
			}

		}
		offs() {
			const outside = 4;
			let i = this.shown.length;
			while (i--) {
				let sector: Sector;
				sector = this.shown[i];
				sector.tick();
				if (pts.dist(sector.big, this.big) > outside) {
					console.log(' hide !');
					sector.hide();
					this.shown.splice(i, 1);
				}
			}
		}
	}
	export class Obj extends Countable {
		wpos: Vec2 = [0, 0];
		rpos: Vec2 = [0, 0];
		size: Vec2 = [100, 100];
		drawable: Drawable | undefined;
		sector: Sector | undefined;
		rz = 0;
		constructor() {
			super();
			Obj.Num++;
		}
		delete() {
			this.hide();
			Obj.Num--;
		}
		show() {
			if (this.on())
				return;
			Obj.Active++;
			this.update();
			this.drawable?.show();
		}
		hide() {
			if (this.off())
				return;
			Obj.Active--;
			this.drawable?.hide();
		}
		wrpose() {
			this.rpos = pts.mult(this.wpos, Galaxy.Unit);
		}
		tick() { // implement
		}
		make() {  // implement
			console.warn('obj.make');
		}
		update() {
			this.wrpose();
			this.bound();
			this.drawable?.update();
		}
		aabb: aabb2 | undefined;
		bound() {
			let div = pts.divide(this.size, 2);
			this.aabb = new aabb2(pts.inv(div), div);
			this.aabb.translate(this.rpos);
		}
		moused(mouse: Vec2) {
			if (this.aabb?.test(new aabb2(mouse, mouse)))
				return true;
		}
	}
	export class Drawable extends Countable {
		shape: Shape | undefined;
		constructor(public readonly x: { obj: Obj }) {
			super();
			Drawable.Num++;
			x.obj.drawable = this;
		}
		update() {
			this.shape?.update();
		}
		delete() {
			this.hide();
			Drawable.Num--;
		}
		show() {
			if (this.on())
				return;
			Drawable.Active++;
			this.shape?.setup();
		}
		hide() {
			if (this.off())
				return;
			Drawable.Active--;
			this.shape?.dispose();
		}

	}
	export class DrawableMulti extends Drawable {
		show() {
			super.show();
		}
		hide() {
			super.hide()
		}
	};
	export class Shape {
		test: number;
		constructor(public readonly x: { drawable: Drawable }) {
			x.drawable.shape = this;
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
	export namespace Shape {
		export type X = Shape['x'];
	};
	export class Rectangle extends Shape {
		mesh: Mesh | undefined;
		material: MeshBasicMaterial;
		geometry: PlaneBufferGeometry;

		constructor(public readonly y: { img: string } & Shape.X) {
			super(y);
			this.setup();
		}
		update() {
			if (!this.mesh)
				return;
			this.mesh.rotation.z = this.y.drawable.x.obj.rz;
			this.mesh?.position.fromArray([...this.y.drawable.x.obj.rpos, 0]);
			this.mesh?.updateMatrix();
		}
		dispose() {
			if (!this.mesh)
				return;
			this.geometry?.dispose();
			this.material?.dispose();
			this.mesh.parent?.remove(this.mesh);
		}
		setup() {
			let w = this.y.drawable.x.obj.size[0];
			let h = this.y.drawable.x.obj.size[1];
			this.geometry = new PlaneBufferGeometry(w, h, 2, 2);
			let map = Renderer.loadtexture(`img/${this.y.img}.png`);
			this.material = new MeshBasicMaterial({
				map: map,
				transparent: true,
				//color: 0xffffff,
				//color: 'red'
			});
			this.mesh = new Mesh(this.geometry, this.material);
			this.mesh.frustumCulled = false;
			this.mesh.matrixAutoUpdate = false;
			this.update();
			if (this.y.drawable.x.obj.sector)
				this.y.drawable.x.obj.sector.group.add(this.mesh);
			else
				Renderer.scene.add(this.mesh);
		}
	}
}

export default Core;