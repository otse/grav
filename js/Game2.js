import App from "./App";
import Pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";
import Game3 from "./Game3";
var Game2;
(function (Game2) {
    let globals;
    (function (globals) {
    })(globals = Game2.globals || (Game2.globals = {}));
    class World {
        constructor() {
            this.objs = [];
            this.view = [0, 0];
            this.pos = [0, 0];
            this.mpos = [0, 0];
        }
        static make() {
            globals.wlrd = new World;
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
            this.mouse();
            this.stats();
            for (let obj of this.objs) {
                obj.update();
            }
        }
        mouse() {
            let mouse = App.mouse();
            mouse = Pts.subtract(mouse, Pts.divide([Renderer.w, Renderer.h], 2));
            mouse = Pts.mult(mouse, Renderer.ndpi);
            mouse[1] = -mouse[1];
            this.mpos = Pts.add(this.view, mouse);
            if (App.button(0) == 1) {
                console.log('clicked the view');
                let ping = new Game3.Ping;
                ping.wpos = this.mpos;
                ping.done();
                this.add(ping);
            }
        }
        move() {
            let pan = 5;
            if (App.key('x'))
                pan *= 10;
            if (App.key('w'))
                this.view[1] += pan;
            if (App.key('s'))
                this.view[1] -= pan;
            if (App.key('a'))
                this.view[0] -= pan;
            if (App.key('d'))
                this.view[0] += pan;
            let inv = Pts.inv(this.view);
            Renderer.scene.position.set(inv[0], inv[1], 0);
        }
        stats() {
            let crunch = ``;
            crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br />`;
            crunch += `(n)dpi: ${Renderer.ndpi}<br /><br/>`;
            crunch += `mouse: ${Pts.to_string(App.mouse())}<br /><br />`;
            crunch += `world view: ${Pts.to_string(this.view)}<br />`;
            crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
            crunch += `num game objs: ${Game.Obj.Active} / ${Game.Obj.Num}<br />`;
            crunch += `num drawables: ${Game.Drawable.Active} / ${Game.Drawable.Num}<br />`;
            App.sethtml('.stats', crunch);
        }
        start() {
            globals.ply = Ply.make();
            this.add(globals.ply);
        }
    }
    Game2.World = World;
    class Ply extends Game.Obj {
        static make() {
            let ply = new Ply;
            ply.done();
            return ply;
        }
        constructor() {
            super();
        }
        done() {
            let drawable = new Game.Drawable(this);
            drawable.done();
            let quad = new Game.Quad(drawable);
            quad.img = 'redfighter0005';
            quad.done();
            this.drawable = drawable;
            this.drawable.shape = quad;
            super.done();
        }
        update() {
        }
    }
    Game2.Ply = Ply;
})(Game2 || (Game2 = {}));
export default Game2;
