import pts from "./Pts";
import Core from "./Core";
var Objects;
(function (Objects) {
    let globals;
    (function (globals) {
    })(globals = Objects.globals || (Objects.globals = {}));
    class Ply extends Core.Obj {
        static instance() {
            let ply = new Ply;
            ply.make();
            return ply;
        }
        constructor() {
            super();
        }
        make() {
            let drawable = new Core.Drawable({ obj: this });
            let shape = new Core.Rectangle({
                drawable: drawable,
                img: 'redfighter0005'
            });
        }
        tick() {
            super.update();
        }
    }
    Objects.Ply = Ply;
    class Ping extends Core.Obj {
        constructor() {
            super();
        }
        make() {
            let drawable = new Core.Drawable({ obj: this });
            let shape = new Core.Rectangle({
                drawable: drawable,
                img: 'redfighter0005'
            });
        }
    }
    Objects.Ping = Ping;
    class Rock extends Core.Obj {
        constructor() {
            super();
            this.float = pts.make((Math.random() - 0.5) / Rock.slowness, (Math.random() - 0.5) / Rock.slowness);
            this.rate = (Math.random() - 0.5) / (Rock.slowness * 6);
        }
        make() {
            this.size = [200, 200];
            let drawable = new Core.Drawable({ obj: this });
            let shape = new Core.Rectangle({
                drawable: drawable,
                img: 'pngwing.com'
            });
        }
        tick() {
            var _a;
            this.wpos[0] += this.float[0];
            this.wpos[1] -= this.float[1];
            this.rz += this.rate;
            super.update();
            (_a = this.sector) === null || _a === void 0 ? void 0 : _a.swap(this);
        }
    }
    Rock.slowness = 12;
    Objects.Rock = Rock;
})(Objects || (Objects = {}));
export default Objects;
