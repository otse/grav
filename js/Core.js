import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Group } from "three";
import aabb2 from "./Aabb2";
import pts from "./Pts";
import Renderer from "./Renderer";
class Countable {
    constructor(type) {
        this.type = type;
        this.active = false;
        if (!Countable.Get(type))
            Countable.Types[type] = { Num: 1, Active: 0 };
        else
            Countable.Get(type).Num++;
    }
    static Get(type) {
        return Countable.Types[type];
    }
    isActive() { return this.active; }
    ;
    on() {
        if (this.active)
            return true;
        Countable.Get(this.type).Active++;
        this.active = true;
    }
    off() {
        if (!this.active)
            return true;
        Countable.Get(this.type).Active--;
        this.active = false;
    }
    uncount() {
        Countable.Get(this.type).Num--;
    }
}
Countable.Types = {};
;
export { Countable };
var Core;
(function (Core) {
    class Galaxy {
        constructor(span) {
            this.arrays = [];
            this.grid = new Grid(3, 4, this);
        }
        update(wpos) {
            // lay out sectors in a grid
            this.grid.big = Galaxy.big(wpos);
            this.grid.offs();
            this.grid.crawl();
        }
        atnullable(x, y) {
            if (this.arrays[y] == undefined)
                this.arrays[y] = [];
            return this.arrays[y][x];
        }
        at(x, y) {
            return this.atnullable(x, y) || this.make(x, y);
        }
        atwpos(wpos) {
            let big = Galaxy.big(wpos);
            return this.at(big[0], big[1]);
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
            return pts.divide(pixel, Core.Galaxy.Unit);
        }
    }
    Galaxy.Unit = 50;
    Galaxy.SectorSpan = 10;
    Core.Galaxy = Galaxy;
    ;
    class Sector extends Countable {
        constructor(x, y, galaxy) {
            var _a;
            super('Sector');
            this.x = x;
            this.y = y;
            this.galaxy = galaxy;
            this.objs = [];
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
        swap(obj) {
            var _a;
            let sector = this.galaxy.atwpos(obj.wpos);
            if (obj.sector != sector) {
                // console.warn('obj sector not sector');
                (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
                sector.add(obj);
                if (!this.galaxy.grid.visible(sector)) {
                    obj.hide();
                }
            }
        }
        tick() {
            for (let obj of this.objs)
                obj.tick();
        }
        show() {
            if (this.on())
                return;
            Util.SectorShow(this);
            //console.log(' sector show ');
            for (let obj of this.objs)
                obj.show();
            Renderer.scene.add(this.group);
        }
        hide() {
            if (this.off())
                return;
            Util.SectorHide(this);
            //console.log(' sector hide ');
            for (let obj of this.objs)
                obj.hide();
            Renderer.scene.remove(this.group);
        }
        objs_() { return this.objs; }
    }
    Core.Sector = Sector;
    class Grid {
        constructor(spread, outside, galaxy) {
            this.spread = spread;
            this.outside = outside;
            this.galaxy = galaxy;
            this.big = [0, 0];
            this.shown = [];
        }
        visible(sector) {
            return pts.dist(sector.big, this.big) < this.spread;
        }
        crawl() {
            for (let y = -this.spread; y < this.spread; y++) {
                for (let x = -this.spread; x < this.spread; x++) {
                    let pos = pts.add(this.big, [x, y]);
                    let sector = this.galaxy.atnullable(pos[0], pos[1]);
                    if (!sector)
                        continue;
                    if (!sector.isActive()) {
                        this.shown.push(sector);
                        //console.log('vis test for minted sec ' + this.vis(sector));
                        //console.log(' cull show sector ! ');
                        sector.show();
                    }
                }
            }
        }
        offs() {
            let i = this.shown.length;
            while (i--) {
                let sector;
                sector = this.shown[i];
                sector.tick();
                if (pts.dist(sector.big, this.big) > this.outside) {
                    //console.log(' cull hide sector !');
                    sector.hide();
                    this.shown.splice(i, 1);
                }
            }
        }
    }
    Core.Grid = Grid;
    class Obj extends Countable {
        constructor() {
            super('Obj');
            this.wpos = [0, 0];
            this.rpos = [0, 0];
            this.size = [100, 100];
            this.rz = 0;
        }
        delete() {
            this.hide();
            this.uncount();
        }
        show() {
            var _a;
            if (this.on())
                return;
            console.log(' obj show ');
            this.update();
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.show();
        }
        hide() {
            var _a;
            if (this.off())
                return;
            console.log(' obj hide ');
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.hide();
        }
        wrpose() {
            this.rpos = pts.mult(this.wpos, Galaxy.Unit);
        }
        tick() {
        }
        make() {
            console.warn('obj.make');
        }
        update() {
            var _a;
            this.wrpose();
            this.bound();
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.update();
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
        galaxy() {
            var _a;
            return ((_a = this.sector) === null || _a === void 0 ? void 0 : _a.galaxy) || undefined;
        }
    }
    Core.Obj = Obj;
    class Drawable extends Countable {
        constructor(x) {
            super('Drawable');
            this.x = x;
            x.obj.drawable = this;
        }
        update() {
            var _a;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.update();
        }
        delete() {
            this.hide();
        }
        show() {
            var _a;
            if (this.on())
                return;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.create();
        }
        hide() {
            var _a;
            if (this.off())
                return;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    }
    Core.Drawable = Drawable;
    class DrawableMulti extends Drawable {
        show() {
            super.show();
        }
        hide() {
            super.hide();
        }
    }
    Core.DrawableMulti = DrawableMulti;
    ;
    class Shape {
        constructor(x) {
            this.x = x;
            x.drawable.shape = this;
        }
        update() {
            // implement
        }
        create() {
            // implement
        }
        dispose() {
            // implement
        }
    }
    Core.Shape = Shape;
    ;
    class Rectangle extends Shape {
        constructor(y) {
            super(y);
            this.y = y;
            //this.setup();
        }
        update() {
            var _a, _b;
            if (!this.mesh)
                return;
            this.mesh.rotation.z = this.y.drawable.x.obj.rz;
            (_a = this.mesh) === null || _a === void 0 ? void 0 : _a.position.fromArray([...this.y.drawable.x.obj.rpos, 0]);
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
        create() {
            let w = this.y.drawable.x.obj.size[0];
            let h = this.y.drawable.x.obj.size[1];
            this.geometry = new PlaneBufferGeometry(w, h, 2, 2);
            let map = Renderer.loadtexture(`img/${this.y.img}.png`);
            this.material = new MeshBasicMaterial({
                map: map,
                transparent: true,
            });
            this.mesh = new Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.update();
            //if (this.y.drawable.x.obj.sector)
            //	this.y.drawable.x.obj.sector.group.add(this.mesh);
            //else
            Renderer.scene.add(this.mesh);
        }
    }
    Core.Rectangle = Rectangle;
})(Core || (Core = {}));
export var Util;
(function (Util) {
    function SectorShow(sector) {
        let breadth = Core.Galaxy.Unit * Core.Galaxy.SectorSpan;
        let any = sector;
        any.geometry = new PlaneBufferGeometry(breadth, breadth, 2, 2);
        any.material = new MeshBasicMaterial({
            wireframe: true,
            transparent: true,
            color: 'red'
        });
        any.mesh = new Mesh(any.geometry, any.material);
        any.mesh.position.fromArray([sector.x * breadth + breadth / 2, sector.y * breadth + breadth / 2, 0]);
        any.mesh.updateMatrix();
        any.mesh.frustumCulled = false;
        any.mesh.matrixAutoUpdate = false;
        Renderer.scene.add(any.mesh);
    }
    Util.SectorShow = SectorShow;
    function SectorHide(sector) {
        let any = sector;
        Renderer.scene.remove(any.mesh);
    }
    Util.SectorHide = SectorHide;
})(Util || (Util = {}));
export default Core;
