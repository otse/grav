var Grav = (function (THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

    class pts {
        static pt(a) {
            return { x: a[0], y: a[1] };
        }
        static clone(zx) {
            return [zx[0], zx[1]];
        }
        static make(n, m) {
            return [n, m];
        }
        static area_every(bb, callback) {
            let y = bb.min[1];
            for (; y <= bb.max[1]; y++) {
                let x = bb.max[0];
                for (; x >= bb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        static project(a) {
            return [a[0] / 2 + a[1] / 2, a[1] / 4 - a[0] / 4];
        }
        static unproject(a) {
            return [a[0] - a[1] * 2, a[1] * 2 + a[0]];
        }
        static to_string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        static equals(a, b) {
            return a[0] == b[0] && a[1] == b[1];
        }
        static floor(a) {
            return [Math.floor(a[0]), Math.floor(a[1])];
        }
        static ceil(a) {
            return [Math.ceil(a[0]), Math.ceil(a[1])];
        }
        static inv(a) {
            return [-a[0], -a[1]];
        }
        static mult(a, n, m) {
            return [a[0] * n, a[1] * (m || n)];
        }
        static divide(a, n, m) {
            return [a[0] / n, a[1] / (m || n)];
        }
        static subtract(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
        static add(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
        static abs(a) {
            return [Math.abs(a[0]), Math.abs(a[1])];
        }
        static min(a, b) {
            return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
        }
        static max(a, b) {
            return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
        }
        static together(zx) {
            return zx[0] + zx[1];
        }
        // https://vorg.github.io/pex/docs/pex-geom/Vec2.html
        static dist(a, b) {
            let dx = b[0] - a[0];
            let dy = b[1] - b[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
        static distsimple(a, b) {
            let dx = Math.abs(b[0] - a[0]);
            let dy = Math.abs(b[1] - a[1]);
            return Math.min(dx, dy);
        }
        ;
    }

    const fragmentPost = `
// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	clr.rgb = mix(clr.rgb, vec3(0.5), 0.0);
	gl_FragColor = clr;
}`;
    const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
    // three quarter
    var Renderer;
    (function (Renderer) {
        Renderer.DPI_UPSCALED_RT = true;
        Renderer.delta = 0;
        //export var ambientLight: AmbientLight
        //export var directionalLight: DirectionalLight
        function update() {
            Renderer.delta = Renderer.clock.getDelta();
            //filmic.composer.render();
        }
        Renderer.update = update;
        var reset = 0;
        var frames = 0;
        // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
        function calc() {
            const s = Date.now() / 1000;
            frames++;
            if (s - reset >= 1) {
                reset = s;
                Renderer.fps = frames;
                frames = 0;
            }
            Renderer.memory = window.performance.memory;
        }
        Renderer.calc = calc;
        function render() {
            calc();
            Renderer.renderer.setRenderTarget(Renderer.target);
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scene, Renderer.camera);
            Renderer.renderer.setRenderTarget(null); // Naar scherm
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scene2, Renderer.camera);
        }
        Renderer.render = render;
        function init() {
            console.log('ThreeQuarter Init');
            Renderer.clock = new THREE.Clock();
            Renderer.scene = new THREE.Scene();
            Renderer.scene.background = new THREE.Color('#292929');
            Renderer.scene2 = new THREE.Scene();
            Renderer.rttscene = new THREE.Scene();
            Renderer.ndpi = window.devicePixelRatio;
            if (!Renderer.DPI_UPSCALED_RT)
                Renderer.ndpi = 1;
            Renderer.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE__default['default'].NearestFilter,
                magFilter: THREE__default['default'].NearestFilter,
                format: THREE__default['default'].RGBFormat
            });
            Renderer.renderer = new THREE.WebGLRenderer({ antialias: false });
            Renderer.renderer.setPixelRatio(Renderer.ndpi);
            Renderer.renderer.setSize(100, 100);
            Renderer.renderer.autoClear = true;
            Renderer.renderer.setClearColor(0xffffff, 0);
            document.body.appendChild(Renderer.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
            Renderer.materialPost = new THREE.ShaderMaterial({
                uniforms: { tDiffuse: { value: Renderer.target.texture } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentPost,
                depthWrite: false
            });
            onWindowResize();
            Renderer.quadPost = new THREE.Mesh(Renderer.plane, Renderer.materialPost);
            Renderer.quadPost.position.z = -100;
            //quadPost.position.x = (-(w2 - w)) / 2;
            //quadPost.position.y = (h2 - h) / 2;
            console.log('neg -(w2 - w)', Renderer.quadPost.position.x);
            Renderer.scene2.add(Renderer.quadPost);
            window.Renderer = Renderer;
        }
        Renderer.init = init;
        function onWindowResize() {
            Renderer.w = Renderer.w2 = window.innerWidth;
            Renderer.h = Renderer.h2 = window.innerHeight;
            if (Renderer.DPI_UPSCALED_RT) {
                Renderer.w2 = Renderer.w * Renderer.ndpi;
                Renderer.h2 = Renderer.h * Renderer.ndpi;
                if (Renderer.w2 % 2 != 0) {
                    Renderer.w2 -= 1;
                }
                if (Renderer.h2 % 2 != 0) {
                    Renderer.h2 -= 1;
                }
            }
            console.log(`window inner [${Renderer.w}, ${Renderer.h}], new is [${Renderer.w2}, ${Renderer.h2}]`);
            Renderer.target.setSize(Renderer.w2, Renderer.h2);
            Renderer.plane = new THREE.PlaneBufferGeometry(Renderer.w2, Renderer.h2);
            if (Renderer.quadPost)
                Renderer.quadPost.geometry = Renderer.plane;
            Renderer.camera = ortographiccamera(Renderer.w2, Renderer.h2);
            Renderer.camera.updateProjectionMatrix();
            Renderer.renderer.setSize(Renderer.w, Renderer.h);
            //renderer.domElement.width = renderer.domElement.clientWidth;// * ndpi;
            //renderer.domElement.height = renderer.domElement.clientHeight;// * ndpi;
        }
        let mem = [];
        function loadtexture(file, key, cb) {
            if (mem[key || file])
                return mem[key || file];
            let texture = new THREE.TextureLoader().load(file + `?v=${App$1.salt}`, cb);
            texture.magFilter = THREE__default['default'].NearestFilter;
            texture.minFilter = THREE__default['default'].NearestFilter;
            mem[key || file] = texture;
            return texture;
        }
        Renderer.loadtexture = loadtexture;
        function rendertarget(w, h) {
            const o = {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            };
            let target = new THREE.WebGLRenderTarget(w, h, o);
            return target;
        }
        Renderer.rendertarget = rendertarget;
        function ortographiccamera(w, h) {
            let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
            camera.updateProjectionMatrix();
            return camera;
        }
        Renderer.ortographiccamera = ortographiccamera;
        function erase_children(group) {
            while (group.children.length > 0)
                group.remove(group.children[0]);
        }
        Renderer.erase_children = erase_children;
    })(Renderer || (Renderer = {}));
    var Renderer$1 = Renderer;

    var TEST;
    (function (TEST) {
        TEST[TEST["Outside"] = 0] = "Outside";
        TEST[TEST["Inside"] = 1] = "Inside";
        TEST[TEST["Overlap"] = 2] = "Overlap";
    })(TEST || (TEST = {}));
    class aabb2 {
        constructor(a, b) {
            this.min = this.max = [...a];
            if (b) {
                this.extend(b);
            }
        }
        static dupe(bb) {
            return new aabb2(bb.min, bb.max);
        }
        extend(v) {
            this.min = pts.min(this.min, v);
            this.max = pts.max(this.max, v);
        }
        diagonal() {
            return pts.subtract(this.max, this.min);
        }
        center() {
            return pts.add(this.min, pts.mult(this.diagonal(), 0.5));
        }
        translate(v) {
            this.min = pts.add(this.min, v);
            this.max = pts.add(this.max, v);
        }
        test(b) {
            if (this.max[0] < b.min[0] || this.min[0] > b.max[0] ||
                this.max[1] < b.min[1] || this.min[1] > b.max[1])
                return 0;
            if (this.min[0] <= b.min[0] && this.max[0] >= b.max[0] &&
                this.min[1] <= b.min[1] && this.max[1] >= b.max[1])
                return 1;
            return 2;
        }
    }
    aabb2.TEST = TEST;

    var Game;
    (function (Game) {
        class Galaxy {
            constructor(span) {
                this.arrays = [];
                this.sectorSpan = span;
                this.center = new Center(this);
            }
            update(wpos) {
                // lay out sectors in a grid
                this.center.big = wpos;
                this.center.off();
                this.center.crawl();
            }
            big(wpos) {
                return pts.floor(pts.divide(wpos, this.sectorSpan));
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
                let ig = this.big(wpos);
                return this.at(ig[0], ig[1]);
            }
            make(x, y) {
                let s = this.atnullable(x, y);
                if (s)
                    return s;
                s = this.arrays[y][x] = new Sector(x, y, this);
                return s;
            }
        }
        Galaxy.Unit = 50;
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
                    return;
                for (let obj of this.objs)
                    obj.show();
                this.active = true;
                Sector.Active++;
                return true;
            }
            hide() {
                if (!this.active)
                    return;
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
                    //if (pts.distsimple(big, s.big) > 2)
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
            update() {
                var _a;
                (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.update();
            }
            tickupdate() {
                this.update();
            }
            done() {
                this.rpos = pts.mult(this.wpos, Galaxy.Unit);
                this.bound();
            }
            bound() {
                let div = pts.divide(this.size, 2);
                this.aabb = new aabb2(pts.inv(div), div);
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
                this.geometry = new THREE.PlaneBufferGeometry(w, h, 2, 2);
                let map = Renderer$1.loadtexture(`img/${this.img}.png`);
                this.material = new THREE.MeshBasicMaterial({
                    map: map,
                    transparent: true,
                });
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                //this.mesh.frustumCulled = false;
                //this.mesh.matrixAutoUpdate = false;
                this.update();
                Renderer$1.scene.add(this.mesh);
            }
        }
        Game.Quad = Quad;
    })(Game || (Game = {}));
    var Game$1 = Game;

    var Game3;
    (function (Game3) {
        let globals;
        (function (globals) {
        })(globals = Game3.globals || (Game3.globals = {}));
        class Ping extends Game$1.Obj {
            constructor() {
                super();
            }
            done() {
                let drawable = new Game$1.Drawable(this);
                drawable.done();
                let shape = new Game$1.Quad(drawable);
                shape.img = 'redfighter0005';
                shape.done();
                this.drawable = drawable;
                this.drawable.shape = shape;
                super.done();
            }
        }
        Game3.Ping = Ping;
    })(Game3 || (Game3 = {}));
    var Game3$1 = Game3;

    var Game2;
    (function (Game2) {
        let globals;
        (function (globals) {
        })(globals = Game2.globals || (Game2.globals = {}));
        function start() {
            globals.wlrd = Game2.World.make();
            globals.galaxy = new Game$1.Galaxy(10);
        }
        Game2.start = start;
        class World {
            constructor() {
                //objs: Game.Obj[] = [];
                this.view = [0, 0];
                this.pos = [0, 0];
                this.wpos = [0, 0];
                this.mpos = [0, 0];
            }
            static make() {
                return new World;
            }
            chart(big) {
            }
            add(obj) {
                globals.galaxy.atsmall(obj.wpos).add(obj);
                //this.objs.push(obj);
                //obj.show();
            }
            remove(obj) {
                var _a;
                (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
            }
            update() {
                this.move();
                this.mouse();
                this.stats();
                globals.galaxy.update(pts.divide(this.pos, Game$1.Galaxy.Unit));
            }
            mouse() {
                let mouse = App$1.mouse();
                mouse = pts.subtract(mouse, pts.divide([Renderer$1.w, Renderer$1.h], 2));
                mouse = pts.mult(mouse, Renderer$1.ndpi);
                mouse[1] = -mouse[1];
                this.mpos = pts.add(this.view, mouse);
                if (App$1.button(0) == 1) {
                    console.log('clicked the view');
                    let ping = new Game3$1.Ping;
                    ping.wpos = pts.divide(this.mpos, Game$1.Galaxy.Unit);
                    ping.done();
                    this.add(ping);
                }
            }
            move() {
                let pan = 5;
                if (App$1.key('x'))
                    pan *= 10;
                if (App$1.key('w'))
                    this.view[1] += pan;
                if (App$1.key('s'))
                    this.view[1] -= pan;
                if (App$1.key('a'))
                    this.view[0] -= pan;
                if (App$1.key('d'))
                    this.view[0] += pan;
                let inv = pts.inv(this.view);
                Renderer$1.scene.position.set(inv[0], inv[1], 0);
            }
            stats() {
                let crunch = ``;
                crunch += `DPI_UPSCALED_RT: ${Renderer$1.DPI_UPSCALED_RT}<br />`;
                crunch += `(n)dpi: ${Renderer$1.ndpi}<br />`;
                crunch += `mouse: ${pts.to_string(App$1.mouse())}<br /><br />`;
                crunch += `world view: ${pts.to_string(this.view)}<br />`;
                crunch += `world pos: ${pts.to_string(this.pos)}<br /><br />`;
                crunch += `sectors: ${Game$1.Sector.Active} / ${Game$1.Sector.Num}<br />`;
                crunch += `num game objs: ${Game$1.Obj.Active} / ${Game$1.Obj.Num}<br />`;
                crunch += `num drawables: ${Game$1.Drawable.Active} / ${Game$1.Drawable.Num}<br />`;
                App$1.sethtml('.stats', crunch);
            }
            start() {
                globals.ply = Ply.make();
                this.add(globals.ply);
            }
        }
        Game2.World = World;
        class Ply extends Game$1.Obj {
            static make() {
                let ply = new Ply;
                ply.done();
                return ply;
            }
            constructor() {
                super();
            }
            done() {
                let drawable = new Game$1.Drawable(this);
                drawable.done();
                let quad = new Game$1.Quad(drawable);
                quad.img = 'redfighter0005';
                quad.done();
                this.drawable = drawable;
                this.drawable.shape = quad;
                super.done();
            }
            update() {
            }
        }
        Game2.Ply = Ply;
        let Util;
        (function (Util) {
            function Sector_getobjat(s, wpos) {
                for (let obj of s.objs_())
                    if (pts.equals(obj.wpos, wpos))
                        return obj;
            }
            Util.Sector_getobjat = Sector_getobjat;
        })(Util = Game2.Util || (Game2.Util = {}));
    })(Game2 || (Game2 = {}));
    var Game2$1 = Game2;

    var TestingChamber;
    (function (TestingChamber) {
        function start() {
            console.log('start testing chamber');
            console.log('placing squares on game area that should take up 1:1 pixels on screen...');
            console.log('...regardless of your os or browsers dpi setting');
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    let square = TestingSquare.make();
                    square.wpos = [x * 100, y * 100];
                    square.done();
                    Game2$1.globals.wlrd.add(square);
                }
            }
        }
        TestingChamber.start = start;
        class TestingSquare extends Game$1.Obj {
            constructor() {
                super();
            }
            static make() {
                return new TestingSquare;
            }
            done() {
                this.size = [100, 100];
                let drawable = new Game$1.Drawable(this);
                drawable.done();
                let quad = new Game$1.Quad(drawable);
                quad.img = 'test100';
                quad.done();
                this.drawable = drawable;
                this.drawable.shape = quad;
                this.quad = quad;
                super.done();
            }
            update() {
                if (this.moused(Game2$1.globals.wlrd.mpos)) {
                    console.log('hover testing square');
                    this.quad.material.color.set('red');
                }
                else {
                    this.quad.material.color.set('white');
                    //console.log('boo boo meadow');
                }
            }
        }
        TestingChamber.TestingSquare = TestingSquare;
    })(TestingChamber || (TestingChamber = {}));
    var TestingChamber$1 = TestingChamber;

    var Grav;
    (function (Grav) {
        Grav.NO_VAR = false;
        Grav.SOME_OTHER_SETTING = false;
        Grav.EVEN = 24; // very evenly divisible
        Grav.HALVE = Grav.EVEN / 2;
        Grav.YUM = Grav.EVEN;
        const MAX_WAIT = 1500;
        var started = false;
        function sample(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        Grav.sample = sample;
        function clamp(val, min, max) {
            return val > max ? max : val < min ? min : val;
        }
        Grav.clamp = clamp;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
            RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
            RESOURCES[RESOURCES["CANT_FIND"] = 2] = "CANT_FIND";
            RESOURCES[RESOURCES["READY"] = 3] = "READY";
            RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
        })(RESOURCES = Grav.RESOURCES || (Grav.RESOURCES = {}));
        let time;
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        Grav.resourced = resourced;
        function try_start() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                if (resources_loaded & 0b1 << i)
                    count++;
            if (count == RESOURCES.COUNT)
                start();
        }
        function reasonable_waiter() {
            if (time + MAX_WAIT < new Date().getTime()) {
                console.warn(`passed reasonable wait time for resources lets start anyway`);
                start();
            }
        }
        Grav.reasonable_waiter = reasonable_waiter;
        function critical(mask) {
            // Couldn't load
            console.error('resource', mask);
        }
        Grav.critical = critical;
        function init() {
            console.log('grav init');
            Game2$1.start();
            time = new Date().getTime();
            resourced('RC_UNDEFINED');
            resourced('POPULAR_ASSETS');
            resourced('READY');
            window['GRAV'] = Grav;
        }
        Grav.init = init;
        function start() {
            if (started)
                return;
            console.log('grav starting');
            Game2$1.globals.wlrd.start();
            if (window.location.href.indexOf("#testingchamber") != -1)
                TestingChamber$1.start();
            if (window.location.href.indexOf("#novar") != -1)
                Grav.NO_VAR = false;
            //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        function update() {
            if (!started) {
                reasonable_waiter();
                return;
            }
            Game2$1.globals.wlrd.update();
            //Board.update();
            //Ploppables.update();
        }
        Grav.update = update;
    })(Grav || (Grav = {}));

    var App;
    (function (App) {
        let KEY;
        (function (KEY) {
            KEY[KEY["OFF"] = 0] = "OFF";
            KEY[KEY["PRESS"] = 1] = "PRESS";
            KEY[KEY["WAIT"] = 2] = "WAIT";
            KEY[KEY["AGAIN"] = 3] = "AGAIN";
            KEY[KEY["UP"] = 4] = "UP";
        })(KEY = App.KEY || (App.KEY = {}));
        var keys = {};
        var buttons = {};
        var pos = [0, 0];
        App.salt = 'x';
        App.wheel = 0;
        function onkeys(event) {
            const key = event.key.toLowerCase();
            if ('keydown' == event.type)
                keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
            else if ('keyup' == event.type)
                keys[key] = KEY.UP;
            if (event.keyCode == 114)
                event.preventDefault();
        }
        App.onkeys = onkeys;
        function key(k) {
            return keys[k];
        }
        App.key = key;
        function button(b) {
            return buttons[b];
        }
        App.button = button;
        function mouse() {
            return [...pos];
        }
        App.mouse = mouse;
        function boot(version) {
            App.salt = version;
            function onmousemove(e) { pos[0] = e.clientX; pos[1] = e.clientY; }
            function onmousedown(e) { buttons[e.button] = 1; }
            function onmouseup(e) { buttons[e.button] = 0; }
            function onwheel(e) { App.wheel = e.deltaY < 0 ? 1 : -1; }
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
            Renderer$1.init();
            Grav.init();
            loop();
        }
        App.boot = boot;
        function delay() {
            for (let i in keys) {
                if (KEY.PRESS == keys[i])
                    keys[i] = KEY.WAIT;
                else if (KEY.UP == keys[i])
                    keys[i] = KEY.OFF;
            }
        }
        App.delay = delay;
        function loop(timestamp) {
            requestAnimationFrame(loop);
            Renderer$1.update();
            Grav.update();
            Renderer$1.render();
            App.wheel = 0;
            for (let b of [0, 1])
                if (buttons[b] == 1)
                    buttons[b] = 2;
            delay();
        }
        App.loop = loop;
        function sethtml(selector, html) {
            let element = document.querySelectorAll(selector)[0];
            element.innerHTML = html;
        }
        App.sethtml = sethtml;
    })(App || (App = {}));
    window['App'] = App;
    var App$1 = App;

    return App$1;

}(THREE));
