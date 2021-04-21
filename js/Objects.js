import Core from "./Core";
var Objects;
(function (Objects) {
    let globals;
    (function (globals) {
    })(globals = Objects.globals || (Objects.globals = {}));
    class Ply extends Core.Obj {
        static make() {
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
            this.rz += 0.002;
            super.update();
        }
    }
    Objects.Rock = Rock;
})(Objects || (Objects = {}));
export default Objects;
