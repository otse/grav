import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import App from "./App";

import pts from "./Pts";
import Core from "./Core";
import Renderer from "./Renderer";
import Universe from "./Universe";

namespace Objects {
	export namespace globals {
		export var ping: Ping;
	}
	export class Ply extends Core.Obj {
		static instance() {
			let ply = new Ply;
			ply.make();
			return ply;
		}
		constructor() {
			super();
		}
		make() {
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'redfighter0005'
			});
		}
		tick() {
			super.update();
		}
	}
	export class Ping extends Core.Obj {
		constructor() {
			super();
		}
		make() {
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'redfighter0005'
			});
		}
	}
	export class Rock extends Core.Obj {
		static slowness = 12;
		rate: number
		float: vec2
		constructor() {
			super();
			this.float = pts.make(
				(Math.random() - 0.5) / Rock.slowness,
				(Math.random() - 0.5) / Rock.slowness
			);
			this.rate = (Math.random() - 0.5) / (Rock.slowness * 6);
		}
		make() {
			this.size = [200, 200];
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'pngwing.com'
			});
		}
		tick() {
			this.wpos[0] += this.float[0];
			this.wpos[1] -= this.float[1];
			this.rz += this.rate;
			super.update();
			this.sector?.swap(this);
		}
	}
}

export default Objects;