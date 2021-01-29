import App from "./App";
import pts from "./Pts";
import Renderer from "./Renderer";
import Game from "./Game";
import Game3 from "./Game3";
import Hooks from "./Hooks";
var Game2;
(function (Game2) {
    let globals;
    (function (globals) {
    })(globals = Game2.globals || (Game2.globals = {}));
    function start() {
        globals.wlrd = Game2.World.make();
        globals.galaxy = new Game.Galaxy(10);
        Hooks.start();
    }
    Game2.start = start;
    class World {
        constructor() {
            //objs: Game.Obj[] = [];
            this.view = [0, 0];
            this.pos = [0, 0];
            this.wpos = [0, 0];
            this.mpos = [0, 0];
        }
        static make() {
            return new World;
        }
        chart(big) {
        }
        add(obj) {
            let s = globals.galaxy.atw(obj.wpos);
            s.add(obj);
        }
        remove(obj) {
            var _a;
            (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
        }
        update() {
            this.move();
            this.mouse();
            this.stats();
            let pos = Game.Galaxy.unproject(this.view);
            globals.galaxy.update(pos);
        }
        mouse() {
            let mouse = App.mouse();
            mouse = pts.subtract(mouse, pts.divide([Renderer.w, Renderer.h], 2));
            mouse = pts.mult(mouse, Renderer.ndpi);
            mouse[1] = -mouse[1];
            this.mpos = pts.add(this.view, mouse);
            if (App.button(0) == 1) {
                console.log('clicked the view');
                let rock = new Game3.Rock;
                rock.wpos = pts.divide(this.mpos, Game.Galaxy.Unit); // Galaxy.unproject
                rock.done();
                this.add(rock);
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
            let inv = pts.inv(this.view);
            Renderer.scene.position.set(inv[0], inv[1], 0);
        }
        stats() {
            let crunch = ``;
            crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br />`;
            crunch += `fps: ${Renderer.fps}<br />`;
            crunch += `memory: ${Renderer.memory}<br />`;
            crunch += `(n)dpi: ${Renderer.ndpi}<br />`;
            crunch += `mouse: ${pts.to_string(App.mouse())}<br /><br />`;
            crunch += `world view: ${pts.to_string(this.view)}<br />`;
            crunch += `world pos: ${pts.to_string(this.pos)}<br /><br />`;
            crunch += `sectors: ${Game.Sector.Active} / ${Game.Sector.Num}<br />`;
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
        tick() {
            super.update();
        }
    }
    Game2.Ply = Ply;
    let Util;
    (function (Util) {
        function Galx_towpos(s, wpos) {
        }
        Util.Galx_towpos = Galx_towpos;
        function Sector_getobjat(s, wpos) {
            for (let obj of s.objs_())
                if (pts.equals(obj.wpos, wpos))
                    return obj;
        }
        Util.Sector_getobjat = Sector_getobjat;
    })(Util = Game2.Util || (Game2.Util = {}));
})(Game2 || (Game2 = {}));
export default Game2;
