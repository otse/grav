import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import App from "./App";

import Pts from "./Pts";
import Renderer from "./Renderer";

namespace Grav {

	export class World {
		pos: Vec2 = [0, 0];
		static make() {
			return new World;
		}

		constructor() {
		}
		add(obj: Obj) {

		}
		remove(obj: Obj) {
		}
		update() {
			this.move();
			this.stats();
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
		stats()
		{
			let crunch = ``;
			crunch += `world pos: ${Pts.to_string(this.pos)}`;
			App.sethtml('.stats', crunch);
		}
	}

	export class Obj {
		static Num = 0;
		constructor() {
			Obj.Num++;
		}
	}
	namespace Obj {
		export type Me = Obj;
	}

	export class Draw {
		static Num = 0;
		static Active = 0;
		element: Element | null;
		constructor() {
			Draw.Num++;
		}
		delete() {
			Draw.Num--;
			this.despawn();
		}
		spawn() {
			Draw.Active++;
			this.element?.create();
		}
		despawn() {
			Draw.Active--;
			this.element?.destroy();
		}
	}
	export namespace Draw {
		export type Me = Draw;
	}

	export class Element {
		img: string;
		mesh: Mesh | null;
		material: MeshBasicMaterial | null;
		geometry: PlaneBufferGeometry | null;
		constructor() {

		}
		build() {

		}
		destroy() {
			this.geometry?.dispose();
			this.material?.dispose();
		}
		create() {
			this.geometry = new PlaneBufferGeometry(30, 30, 2, 2);
			let map = Renderer.loadtexture(`img/${this.img}.png`);
			this.material = new MeshBasicMaterial({
				map: map,
				transparent: true,
				//color: 0xffffff,
				color: 'red'
			});
			this.mesh = new Mesh(this.geometry, this.material);
			this.mesh.frustumCulled = false;
			this.mesh.matrixAutoUpdate = false;
			this.update();
			Renderer.scene.add(this.mesh);
		}
		update() {

		}
	}
	export namespace Element {
		export type Me = Element;
	}
}

export default Grav;