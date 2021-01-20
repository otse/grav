import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import Renderer from "./Renderer";
var Game;
(function (Game) {
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
    Game.Obj = Obj;
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
    Game.Drawable = Drawable;
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
    Game.Shape = Shape;
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
            this.geometry = new PlaneBufferGeometry(100, 100, 2, 2);
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
        update() {
        }
    }
    Game.Quad = Quad;
})(Game || (Game = {}));
export default Game;
