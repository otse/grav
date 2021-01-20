import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import Grav from "./Grav";

import Pts from "./Pts";
import Renderer from "./Renderer";

namespace Game {
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
}

export default Game;