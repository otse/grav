import Game from "./Game";
import Game2 from "./Game2";
var TestingChamber;
(function (TestingChamber) {
    function start() {
        console.log('start testing chamber');
        console.log('placing squares on game area that should take up 1:1 pixels on screen...');
        console.log('...regardless of your os or browsers dpi setting');
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                let square = TestingSquare.make();
                square.wpos = [x * 100, y * 100];
                square.done();
                Game2.globals.wlrd.add(square);
            }
        }
    }
    TestingChamber.start = start;
    class TestingSquare extends Game.Obj {
        static make() {
            return new TestingSquare;
        }
        constructor() {
            super();
        }
        done() {
            let drawable = new Game.Drawable();
            drawable.obj = this;
            drawable.done();
            let shape = new Game.Quad();
            shape.w = 100;
            shape.h = 100;
            shape.drawable = drawable;
            shape.img = 'test100';
            shape.done();
            this.drawable = drawable;
            this.drawable.shape = shape;
        }
    }
    TestingChamber.TestingSquare = TestingSquare;
})(TestingChamber || (TestingChamber = {}));
export default TestingChamber;
