import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import App from "./App";
import GRAV from "./Grav";
import Pts from "./Pts";
import Renderer from "./Renderer";
var Grav;
(function (Grav) {
    class World {
        constructor() {
            this.objs = [];
            this.pos = [0, 0];
        }
        static make() {
            return new World;
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
            crunch += `num game objs: ${Obj.Active} / ${Obj.Num}<br />`;
            crunch += `num drawables: ${Drawable.Active} / ${Drawable.Num}<br />`;
            App.sethtml('.stats', crunch);
        }
        init() {
            let ply = new Obj;
            let drawable = new Drawable;
            drawable.obj = ply;
            drawable.done();
            ply.drawable = drawable;
            let quad = new Quad;
            quad.img = 'redfighter0005';
            quad.done();
            ply.drawable.shape = quad;
            GRAV.ply = ply;
            GRAV.wlrd.add(ply);
        }
    }
    Grav.World = World;
    class Obj {
        constructor() {
            Obj.Num++;
        }
        delete() {
            this.hide();
            Obj.Num--;
        }
        show() {
            var _a;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.show();
            Obj.Active++;
        }
        hide() {
            var _a;
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.hide();
            Obj.Active--;
        }
        update() {
            // implement
        }
    }
    Obj.Num = 0;
    Obj.Active = 0;
    Grav.Obj = Obj;
    class Drawable {
        constructor() {
            Drawable.Num++;
        }
        done() {
            //this.shape = new Quad;
        }
        delete() {
            this.hide();
            Drawable.Num--;
        }
        show() {
            var _a;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.setup();
            Drawable.Active++;
        }
        hide() {
            var _a;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.dispose();
            Drawable.Active--;
        }
    }
    Drawable.Num = 0;
    Drawable.Active = 0;
    Grav.Drawable = Drawable;
    class Shape {
        constructor() {
        }
        done() {
            // implement
        }
        setup() {
            // implement
        }
        dispose() {
            // implement
        }
    }
    Grav.Shape = Shape;
    class Quad extends Shape {
        constructor() {
            super();
            this.img = 'forgot to set';
        }
        done() {
        }
        dispose() {
            var _a, _b;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        setup() {
            this.geometry = new PlaneBufferGeometry(30, 30, 2, 2);
            let map = Renderer.loadtexture(`img/${this.img}.png`);
            this.material = new MeshBasicMaterial({
                map: map,
                transparent: true,
                //color: 0xffffff,
                color: 'red'
            });
            this.mesh = new Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.update();
            Renderer.scene.add(this.mesh);
        }
        update() {
        }
    }
    Grav.Quad = Quad;
})(Grav || (Grav = {}));
export default Grav;
