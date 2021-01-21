import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import Renderer from "./Renderer";
var Game;
(function (Game) {
    class Obj {
        constructor() {
            this.wpos = [0, 0];
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
    }
    Obj.Num = 0;
    Obj.Active = 0;
    Game.Obj = Obj;
    class Drawable {
        constructor() {
            Drawable.Num++;
        }
        done() {
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
        constructor() {
            this.rpos = [0, 0];
            this.tiedToObj = true; // tied to wpos
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
        constructor() {
            super();
            this.img = 'forgot to set';
            this.w = 100;
            this.h = 100;
        }
        done() {
        }
        update() {
            var _a, _b, _c, _d;
            if (this.tiedToObj) {
                this.rpos = ((_b = (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.obj) === null || _b === void 0 ? void 0 : _b.wpos) || [0, 0];
                //console.log(`set rpos to wpos ${Pts.to_string(this.rpos)}`);
            }
            (_c = this.mesh) === null || _c === void 0 ? void 0 : _c.position.fromArray([...this.rpos, 0]);
            (_d = this.mesh) === null || _d === void 0 ? void 0 : _d.updateMatrix();
        }
        dispose() {
            var _a, _b;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        setup() {
            this.geometry = new PlaneBufferGeometry(this.w, this.h, 2, 2);
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
