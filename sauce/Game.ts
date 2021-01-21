import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import aabb2 from "./Aabb2";
import Grav from "./Grav";

import Pts from "./Pts";
import Renderer from "./Renderer";

namespace Game {
	export class Obj { // extend me
		static Num = 0;
		static Active = 0;
		wpos: Vec2 = [0, 0];
		rpos: Vec2 = [0, 0];
		size: Vec2 = [100, 100];
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
			this.drawable?.update();
		}
		done() {
			// implement
			this.rpos = [...this.wpos];
			this.bound();
		}
		aabb: aabb2 | undefined;
		bound() {
			let div = Pts.divide(this.size, 2);
			this.aabb = new aabb2(Pts.inv(div), div);
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
			this.shape?.setup();
			Drawable.Active++;
		}
		hide() {
			this.shape?.dispose();
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