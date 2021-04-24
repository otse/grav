import App from "./App";
import pts from "./Pts";
import Renderer from "./Renderer";
import Core from "./Core";
import Objects from "./Objects";
import Hooks from "./Hooks";
var Universe;
(function (Universe) {
    let globals;
    (function (globals) {
    })(globals = Universe.globals || (Universe.globals = {}));
    function start() {
        globals.game = Game.make();
        Hooks.start();
    }
    Universe.start = start;
    class Game {
        constructor() {
            //objs: Game.Obj[] = [];
            this.view = [0, 0];
            this.pos = [0, 0];
            this.wpos = [0, 0];
            this.mrpos = [0, 0];
            this.galaxy = new Core.Galaxy(10);
        }
        static make() {
            return new Game;
        }
        chart(big) {
        }
        add(obj) {
            let sector = this.galaxy.atwpos(obj.wpos);
            sector.add(obj);
        }
        remove(obj) {
            var _a;
            (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
        }
        tick() {
            this.move();
            this.mouse();
            this.stats();
            let pos = Core.Galaxy.unproject(this.view);
            this.galaxy.update(pos);
        }
        mouse() {
            let mouse = App.mouse();
            mouse = pts.subtract(mouse, pts.divide([Renderer.w, Renderer.h], 2));
            mouse = pts.mult(mouse, Renderer.ndpi);
            mouse[1] = -mouse[1];
            this.mrpos = pts.add(this.view, mouse);
            if (App.button(0) == 1) {
                console.log('clicked the view');
                let rock = new Objects.Rock;
                // pts.divide(this.mpos, Core.Galaxy.Unit); // Galaxy.unproject
                rock.wpos = Core.Galaxy.unproject(this.mrpos);
                rock.make();
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
            this.pos = Core.Galaxy.unproject(this.view);
            Renderer.scene.position.set(inv[0], inv[1], 0);
        }
        stats() {
            let crunch = ``;
            crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br />`;
            crunch += `fps: ${Renderer.fps}<br />`;
            crunch += `memory: ${Renderer.memory}<br />`;
            crunch += `(n)dpi: ${Renderer.ndpi}<br />`;
            crunch += `mouse pos: ${pts.to_string(App.mouse())}<br /><br />`;
            crunch += `world pos: ${pts.to_string(this.view)}<br />`;
            //crunch += `world wpos: ${pts.to_string(this.pos)}<br /><br />`;
            crunch += `sectors: ${Core.Sector.Active} / ${Core.Sector.Num}<br />`;
            crunch += `game objs: ${Core.Obj.Active} / ${Core.Obj.Num}<br />`;
            crunch += `drawables: ${Core.Drawable.Active} / ${Core.Drawable.Num}<br />`;
            App.sethtml('.stats', crunch);
        }
        start() {
            globals.ply = Objects.Ply.instance();
            this.add(globals.ply);
        }
    }
    Universe.Game = Game;
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
    })(Util = Universe.Util || (Universe.Util = {}));
})(Universe || (Universe = {}));
export default Universe;
