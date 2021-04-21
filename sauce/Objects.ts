import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import App from "./App";

import pts from "./Pts";
import Renderer from "./Renderer";
import Core from "./Core";

namespace Objects {
	export namespace globals {
		export var ping: Ping;
	}
	export class Ply extends Core.Obj {
		static make() {
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
		constructor() {
			super();
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
			this.rz += 0.002;
			super.update();
		}
	}
}

export default Objects;