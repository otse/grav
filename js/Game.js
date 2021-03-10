import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Group } from "three";
import aabb2 from "./Aabb2";
import pts from "./Pts";
import Renderer from "./Renderer";
class Countable {
    constructor() {
        this.active = false;
    }
    isActive() { return this.active; }
    ;
    on() {
        if (this.active)
            return true;
        this.active = true;
    }
    off() {
        if (!this.active)
            return true;
        this.active = false;
    }
}
Countable.Num = 0;
Countable.Active = 0;
;
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
            this.center.offs();
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
        atw(wpos) {
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
    ;
    class Sector extends Countable {
        constructor(x, y, galaxy) {
            var _a;
            super();
            this.span = 2000;
            this.objs = [];
            Sector.Num++;
            this.big = [x, y];
            this.group = new Group;
            (_a = Sector.hooks) === null || _a === void 0 ? void 0 : _a.onCreate();
        }
        add(obj) {
            let i = this.objs.indexOf(obj);
            if (i == -1) {
                this.objs.push(obj);
                obj.sector = this;
                if (this.isActive())
                    obj.show();
            }
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1) {
                obj.sector = undefined;
                return !!this.objs.splice(i, 1).length;
            }
        }
        tick() {
            for (let obj of this.objs)
                obj.tick();
        }
        show() {
            if (this.on())
                return;
            Sector.Active++;
            for (let obj of this.objs)
                obj.show();
            Renderer.scene.add(this.group);
        }
        hide() {
            if (this.off())
                return;
            Sector.Active--;
            for (let obj of this.objs)
                obj.hide();
            Renderer.scene.remove(this.group);
        }
        objs_() { return this.objs; }
    }
    Game.Sector = Sector;
    class Center {
        constructor(galaxy) {
            this.galaxy = galaxy;
            this.big = [0, 0];
            this.shown = [];
        }
        crawl() {
            const spread = 3; // this is * 2
            for (let y = -spread; y < spread; y++) {
                for (let x = -spread; x < spread; x++) {
                    let pos = pts.add(this.big, [x, y]);
                    let s = this.galaxy.atnullable(pos[0], pos[1]);
                    if (!s)
                        continue;
                    if (!s.isActive()) {
                        this.shown.push(s);
                        console.log(' show ! ');
                        s.show();
                    }
                }
            }
        }
        offs() {
            const outside = 4;
            let i = this.shown.length;
            while (i--) {
                let s;
                s = this.shown[i];
                s.tick();
                if (pts.dist(s.big, this.big) > outside) {
                    console.log(' hide !');
                    s.hide();
                    this.shown.splice(i, 1);
                }
            }
        }
    }
    Game.Center = Center;
    class Obj extends Countable {
        constructor() {
            super();
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
            if (this.on())
                return;
            Obj.Active++;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.show();
        }
        hide() {
            var _a;
            if (this.off())
                return;
            Obj.Active--;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.hide();
        }
        pose() {
            this.rpos = pts.mult(this.wpos, Galaxy.Unit);
        }
        tick() {
        }
        update() {
            var _a;
            this.pose();
            this.bound();
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.update();
        }
        done() {
            this.pose();
            this.bound();
        }
        bound() {
            let div = pts.divide(this.size, 2);
            this.aabb = new aabb2(pts.inv(div), div);
            this.aabb.translate(this.rpos);
        }
        moused(mouse) {
            var _a;
            if ((_a = this.aabb) === null || _a === void 0 ? void 0 : _a.test(new aabb2(mouse, mouse)))
                return true;
        }
    }
    Game.Obj = Obj;
    class Drawable extends Countable {
        constructor(obj) {
            super();
            this.obj = obj;
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
            if (this.on())
                return;
            Drawable.Active++;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.setup();
        }
        hide() {
            var _a;
            if (this.off())
                return;
            Drawable.Active--;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    }
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
            var _a, _b, _c;
            if (!this.mesh)
                return;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this.mesh.parent) === null || _c === void 0 ? void 0 : _c.remove(this.mesh);
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
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.update();
            if (this.drawable.obj.sector)
                this.drawable.obj.sector.group.add(this.mesh);
            else
                Renderer.scene.add(this.mesh);
        }
    }
    Game.Quad = Quad;
})(Game || (Game = {}));
export default Game;
