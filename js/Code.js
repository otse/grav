import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import App from "./App";
import Pts from "./Pts";
import Renderer from "./Renderer";
var Grav;
(function (Grav) {
    class World {
        constructor() {
            this.pos = [0, 0];
        }
        static make() {
            return new World;
        }
        add(obj) {
        }
        remove(obj) {
        }
        update() {
            this.move();
            this.stats();
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
            crunch += `world pos: ${Pts.to_string(this.pos)}`;
            App.sethtml('.stats', crunch);
        }
    }
    Grav.World = World;
    class Obj {
        constructor() {
            Obj.Num++;
        }
    }
    Obj.Num = 0;
    Grav.Obj = Obj;
    class Draw {
        constructor() {
            Draw.Num++;
        }
        delete() {
            Draw.Num--;
            this.despawn();
        }
        spawn() {
            var _a;
            Draw.Active++;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.create();
        }
        despawn() {
            var _a;
            Draw.Active--;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.destroy();
        }
    }
    Draw.Num = 0;
    Draw.Active = 0;
    Grav.Draw = Draw;
    class Element {
        constructor() {
        }
        build() {
        }
        destroy() {
            var _a, _b;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        create() {
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
    Grav.Element = Element;
})(Grav || (Grav = {}));
export default Grav;
