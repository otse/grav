import Core from "./Core";
import Game2 from "./Game2";
var TestingChamber;
(function (TestingChamber) {
    function start() {
        console.log('start testing chamber');
        console.log('placing squares on game area that should take up 1:1 pixels on screen...');
        console.log('...regardless of your os or browsers dpi setting');
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                let conversion = 100 / Core.Galaxy.Unit;
                let square = TestingSquare.make();
                square.wpos = [x * conversion, y * conversion];
                square.done();
                Game2.globals.wlrd.add(square);
            }
        }
    }
    TestingChamber.start = start;
    class TestingSquare extends Core.Obj {
        constructor() {
            super();
        }
        static make() {
            return new TestingSquare;
        }
        done() {
            this.size = [100, 100];
            let drawable = new Core.Drawable({ obj: this });
            let quad = new Core.Rectangle({
                drawable: drawable,
                img: 'test100'
            });
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
    TestingChamber.TestingSquare = TestingSquare;
})(TestingChamber || (TestingChamber = {}));
export default TestingChamber;
