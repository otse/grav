import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import Grav from "./Grav";

import Pts from "./Pts";
import Renderer from "./Renderer";

namespace Game {
	export class Obj { // extend me
		static Num = 0;
		static Active = 0;
		wpos: Vec2 = [0, 0]
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
		rpos: Vec2 = [0, 0];
		tiedToObj = true; // tied to wpos
		drawable: Drawable | undefined;
		constructor() {

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
		material: MeshBasicMaterial | undefined;
		geometry: PlaneBufferGeometry | undefined;
		w = 100;
		h = 100;
		constructor() {
			super();
		}
		done() {
		}
		update() {			
			if (this.tiedToObj) {
				this.rpos = this.drawable?.obj?.wpos || [0, 0];
				//console.log(`set rpos to wpos ${Pts.to_string(this.rpos)}`);
			}
			this.mesh?.position.fromArray([...this.rpos, 0]);
			this.mesh?.updateMatrix();
		}
		dispose() {
			this.geometry?.dispose();
			this.material?.dispose();
		}
		setup() {
			this.geometry = new PlaneBufferGeometry(this.w, this.h, 2, 2);
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