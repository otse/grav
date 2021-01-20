//import GRAV from "./Grav";
import App from "./App";
import Pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";
var Game2;
(function (Game2) {
    let globals;
    (function (globals) {
    })(globals = Game2.globals || (Game2.globals = {}));
    class World {
        constructor() {
            this.objs = [];
            this.pos = [0, 0];
        }
        static make() {
            globals.wlrd = new World;
            globals.wlrd.init();
        }
        add(obj) {
            this.objs.push(obj);
            obj.show();
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i != -1)
                this.objs.splice(-1, 1);
        }
        update() {
            this.move();
            this.stats();
            for (let obj of this.objs) {
                obj.update();
            }
        }
        move() {
            let speed = 5;
            let p = this.pos;
            if (App.keys['x'])
                speed *= 10;
            if (App.keys['w'])
                p[1] -= speed;
            if (App.keys['s'])
                p[1] += speed;
            if (App.keys['a'])
                p[0] += speed;
            if (App.keys['d'])
                p[0] -= speed;
            Renderer.scene.position.set(p[0], p[1], 0);
        }
        stats() {
            let crunch = ``;
            crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
            crunch += `num game objs: ${Game.Obj.Active} / ${Game.Obj.Num}<br />`;
            crunch += `num drawables: ${Game.Drawable.Active} / ${Game.Drawable.Num}<br />`;
            App.sethtml('.stats', crunch);
        }
        init() {
            globals.ply = this.ply();
            this.add(globals.ply);
        }
        ply() {
            let ply = new Game2.Ply;
            ply.done();
            return ply;
        }
    }
    Game2.World = World;
    class Ply extends Game.Obj {
        constructor() {
            super();
        }
        done() {
            let drawable = new Game.Drawable;
            drawable.obj = this;
            drawable.done();
            this.drawable = drawable;
            let quad = new Game.Quad;
            quad.img = 'redfighter0005';
            quad.done();
            this.drawable.shape = quad;
        }
    }
    Game2.Ply = Ply;
})(Game2 || (Game2 = {}));
export default Game2;
