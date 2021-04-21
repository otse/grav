import Core from "./Core";
var Game3;
(function (Game3) {
    let globals;
    (function (globals) {
    })(globals = Game3.globals || (Game3.globals = {}));
    class Ping extends Core.Obj {
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
    Game3.Ping = Ping;
    class Rock extends Core.Obj {
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
    Game3.Rock = Rock;
})(Game3 || (Game3 = {}));
export default Game3;
