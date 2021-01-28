import Game from "./Game";
import Game2 from "./Game2";

namespace TestingChamber {
	export function start() {
		console.log('start testing chamber');

		console.log('placing squares on game area that should take up 1:1 pixels on screen...');
		console.log('...regardless of your os or browsers dpi setting');

		for (let y = 0; y < 50; y++) {
			for (let x = 0; x < 50; x++) {
				let conversion = 100 / Game.Galaxy.Unit;
				let square = TestingSquare.make();
				square.wpos = [x * conversion, y * conversion];
				square.done();
				Game2.globals.wlrd.add(square);
			}
		}
	}

	export class TestingSquare extends Game.Obj {
		quad: Game.Quad;
		static make() {
			return new TestingSquare;
		}
		constructor() {
			super();
		}
		done() {
			this.size = [100, 100];
			let drawable = new Game.Drawable(this);
			drawable.done();
			let quad = new Game.Quad(drawable);
			quad.img = 'test100';
			quad.done();
			this.drawable = drawable;
			this.drawable.shape = quad;
			this.quad = quad;
			super.done();
		}
		tick() {
			//super.update();
			return;
			if (this.moused(Game2.globals.wlrd.mpos)) {
				console.log('hover testing square');
				this.quad.material.color.set('red');
			}
			else {
				this.quad.material.color.set('white');
				//console.log('boo boo meadow');
			}
		}
	}
}

export default TestingChamber;