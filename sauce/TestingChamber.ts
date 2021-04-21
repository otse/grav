import Core from "./Core";
import Game from "./Game";

namespace TestingChamber {
	export function start() {
		console.log('start testing chamber');

		console.log('placing squares on game area that should take up 1:1 pixels on screen...');
		console.log('...regardless of your os or browsers dpi setting');

		for (let y = 0; y < 50; y++) {
			for (let x = 0; x < 50; x++) {
				let conversion = 100 / Core.Galaxy.Unit;
				let square = TestingSquare.make();
				square.wpos = [x * conversion, y * conversion];
				square.make();
				Game.globals.wrld.add(square);
			}
		}
	}

	export class TestingSquare extends Core.Obj {
		quad: Core.Rectangle;
		static make() {
			return new TestingSquare;
		}
		constructor() {
			super();
		}
		make() {
			this.size = [100, 100];
			let drawable = new Core.Drawable({ obj: this });
			let quad = new Core.Rectangle({
				drawable: drawable,
				img: 'test100'
			});
		}
		tick() {
			//super.update();
			return;
			if (this.moused(Game.globals.wrld.mpos)) {
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