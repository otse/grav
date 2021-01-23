import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import App from "./App";

import pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";

namespace Game3 {
	export namespace globals {
		export var ping: Ping;
	}
	export class Ping extends Game.Obj {
		constructor() {
			super();
		}
		done() {
			let drawable = new Game.Drawable(this);
			drawable.done();
			let shape = new Game.Quad(drawable);
			shape.img = 'redfighter0005';
			shape.done();
			this.drawable = drawable;
			this.drawable.shape = shape;
			super.done();
		}
	}
}

export default Game3;