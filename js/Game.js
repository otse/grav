import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import aabb2 from "./Aabb2";
import Pts from "./Pts";
import Renderer from "./Renderer";
var Game;
(function (Game) {
    class Obj {
        constructor() {
            this.wpos = [0, 0];
            this.rpos = [0, 0];
            this.size = [100, 100];
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
            var _a;
            // implement
            (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.update();
        }
        done() {
            // implement
            this.rpos = [...this.wpos];
            this.bound();
        }
        bound() {
            let div = Pts.divide(this.size, 2);
            this.aabb = new aabb2(Pts.inv(div), div);
            this.aabb.translate(this.wpos);
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
