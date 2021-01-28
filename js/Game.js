import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import aabb2 from "./Aabb2";
import pts from "./Pts";
import Renderer from "./Renderer";
var Game;
(function (Game) {
    class Galaxy {
        constructor(span) {
            this.arrays = [];
            this.center = new Center(this);
        }
        update(wpos) {
            // lay out sectors in a grid
            this.center.big = Galaxy.big(wpos);
            this.center.off();
            this.center.crawl();
        }
        atnullable(x, y) {
            if (this.arrays[y] == undefined)
                this.arrays[y] = [];
            return this.arrays[y][x];
        }
        at(x, y) {
            return this.atnullable(x, y) || this.make(x, y);
        }
        atsmall(wpos) {
            let ig = Galaxy.big(wpos);
            return this.at(ig[0], ig[1]);
        }
        make(x, y) {
            let s = this.atnullable(x, y);
            if (s)
                return s;
            s = this.arrays[y][x] = new Sector(x, y, this);
            return s;
        }
        static big(wpos) {
            return pts.floor(pts.divide(wpos, Galaxy.SectorSpan));
        }
        static unproject(pixel) {
            return pts.divide(pixel, Game.Galaxy.Unit);
        }
    }
    Galaxy.Unit = 50;
    Galaxy.SectorSpan = 10;
    Game.Galaxy = Galaxy;
    class Sector {
        constructor(x, y, galaxy) {
            this.active = false;
            this.span = 2000;
            this.objs = [];
            this.big = [x, y];
            Sector.Num++;
        }
        add(obj) {
            let i = this.objs.indexOf(obj);
            if (i == -1)
                this.objs.push(obj);
            if (this.active)
                obj.show();
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1)
                return !!this.objs.splice(i, 1);
        }
        updates() {
            for (let obj of this.objs)
                obj.tickupdate();
        }
        show() {
            if (this.active)
                return false;
            for (let obj of this.objs)
                obj.show();
            this.active = true;
            Sector.Active++;
            return true;
        }
        hide() {
            if (!this.active)
                return false;
            for (let obj of this.objs)
                obj.hide();
            this.active = false;
            Sector.Active--;
            return true;
        }
        objs_() { return this.objs; }
    }
    Sector.Num = 0;
    Sector.Active = 0;
    Game.Sector = Sector;
    class Center {
        constructor(galaxy) {
            this.galaxy = galaxy;
            this.big = [0, 0];
            this.shown = [];
        }
        crawl() {
            let radius = 4;
            let half = Math.ceil(radius / 2);
            for (let y = -half; y < half; y++) {
                for (let x = -half; x < half; x++) {
                    let pos = pts.add(this.big, [x, y]);
                    let s = this.galaxy.atnullable(pos[0], pos[1]);
                    if (!s)
                        continue;
                    if (!s.active)
                        this.shown.push(s);
                    s.show();
                }
            }
        }
        off() {
            let i = this.shown.length;
            while (i--) {
                let s;
                s = this.shown[i];
                s.updates();
                if ( /*s hides*/false || pts.dist(s.big, this.big) > 2) {
                    console.log(' hide !');
                    s.hide();
                    this.shown.splice(i, 1);
                }
            }
        }
    }
    Game.Center = Center;
    class Obj {
        constructor() {
            this.active = false;
            this.wpos = [0, 0];
            this.rpos = [0, 0];
            this.size = [100, 100];
            this.rz = 0;
            Obj.Num++;
        }
        delete() {
            this.hide();
            Obj.Num--;
        }
        show() {
            var _a;
            if (this.active)
                return;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.show();
            this.active = true;
            Obj.Active++;
        }
        hide() {
            var _a;
            if (!this.active)
                return;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.hide();
            this.active = false;
            Obj.Active--;
        }
        pose() {
            this.rpos = pts.mult(this.wpos, Galaxy.Unit);
        }
        update() {
            var _a;
            this.pose();
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.update();
        }
        tickupdate() {
            this.update();
        }
        done() {
            this.pose();
            this.bound();
        }
        bound() {
            let div = pts.divide(this.size, 2);
            this.aabb = new aabb2(pts.inv(div), div);
            this.aabb.translate(pts.mult(this.wpos, Game.Galaxy.Unit));
        }
        moused(mouse) {
            var _a;
            if ((_a = this.aabb) === null || _a === void 0 ? void 0 : _a.test(new aabb2(mouse, mouse)))
                return true;
        }
    }
    Obj.Num = 0;
    Obj.Active = 0;
    Game.Obj = Obj;
    class Drawable {
        constructor(obj) {
            this.obj = obj;
            this.active = false;
            Drawable.Num++;
        }
        done() {
            // leave empty
        }
        update() {
            var _a;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.update();
        }
        delete() {
            this.hide();
            Drawable.Num--;
        }
        show() {
            var _a;
            if (this.active)
                return;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.setup();
            this.active = true;
            Drawable.Active++;
        }
        hide() {
            var _a;
            if (!this.active)
                return;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.dispose();
            this.active = false;
            Drawable.Active--;
        }
    }
    Drawable.Num = 0;
    Drawable.Active = 0;
    Game.Drawable = Drawable;
    class Shape {
        constructor(drawable) {
            this.drawable = drawable;
        }
        done() {
            // implement
        }
        update() {
            // implement
        }
        setup() {
            // implement
        }
        dispose() {
            // implement
        }
    }
    Game.Shape = Shape;
    class Quad extends Shape {
        constructor(drawable) {
            super(drawable);
            this.img = 'forgot to set';
        }
        done() {
        }
        update() {
            var _a, _b;
            if (!this.mesh)
                return;
            this.mesh.rotation.z = this.drawable.obj.rz;
            (_a = this.mesh) === null || _a === void 0 ? void 0 : _a.position.fromArray([...this.drawable.obj.rpos, 0]);
            (_b = this.mesh) === null || _b === void 0 ? void 0 : _b.updateMatrix();
        }
        dispose() {
            var _a, _b;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        setup() {
            let w = this.drawable.obj.size[0];
            let h = this.drawable.obj.size[1];
            this.geometry = new PlaneBufferGeometry(w, h, 2, 2);
            let map = Renderer.loadtexture(`img/${this.img}.png`);
            this.material = new MeshBasicMaterial({
                map: map,
                transparent: true,
            });
            this.mesh = new Mesh(this.geometry, this.material);
            //this.mesh.frustumCulled = false;
            //this.mesh.matrixAutoUpdate = false;
            this.update();
            Renderer.scene.add(this.mesh);
        }
    }
    Game.Quad = Quad;
})(Game || (Game = {}));
export default Game;
