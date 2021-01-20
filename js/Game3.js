import Game from "./Game";
var Game3;
(function (Game3) {
    let globals;
    (function (globals) {
    })(globals = Game3.globals || (Game3.globals = {}));
    class Ping extends Game.Obj {
        constructor() {
            super();
        }
        done() {
            let drawable = new Game.Drawable();
            drawable.obj = this;
            drawable.done();
            let shape = new Game.Quad();
            shape.img = 'redfighter0005';
            shape.drawable = drawable;
            shape.done();
            this.drawable = drawable;
            this.drawable.shape = shape;
        }
    }
    Game3.Ping = Ping;
})(Game3 || (Game3 = {}));
export default Game3;