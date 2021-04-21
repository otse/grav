import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import App from "./App";

import pts from "./Pts";
import Renderer from "./Renderer";
import Core from "./Core";

namespace Game3 {
	export namespace globals {
		export var ping: Ping;
	}
	export class Ping extends Core.Obj {
		constructor() {
			super();
		}
		done() {
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'redfighter0005'
			});
			super.done();
		}
	}
	export class Rock extends Core.Obj {
		constructor() {
			super();
		}
		done() {
			this.size = [200, 200];
			let drawable = new Core.Drawable({ obj: this });
			let shape = new Core.Rectangle({
				drawable: drawable,
				img: 'pngwing.com'
			});
			super.done();
		}
		tick() {
			this.rz += 0.002;
			super.update();
		}
	}
}

export default Game3;