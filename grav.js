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
            let dy = b[1] - a[1];
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
            Renderer.renderer.setRenderTarget(null);
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

    class Toggleable {
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
    class Countable extends Toggleable {
        constructor(type) {
            super();
            this.type = type;
            if (!Countable.Get(type))
                Countable.Types[type] = { Num: 1, Active: 0 };
            else
                Countable.Get(type).Num++;
        }
        static Get(type) {
            return Countable.Types[type];
        }
        on() {
            if (super.on())
                return true;
            Countable.Get(this.type).Active++;
        }
        off() {
            if (super.off())
                return true;
            Countable.Get(this.type).Active--;
        }
        uncount() {
            Countable.Get(this.type).Num--;
        }
    }
    Countable.Types = {};
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
            lookup(x, y) {
                if (this.arrays[y] == undefined)
                    this.arrays[y] = [];
                return this.arrays[y][x];
            }
            at(x, y) {
                return this.lookup(x, y) || this.make(x, y);
            }
            atwpos(wpos) {
                let big = Galaxy.big(wpos);
                return this.at(big[0], big[1]);
            }
            make(x, y) {
                let s = this.lookup(x, y);
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
        class Sector extends Countable {
            constructor(x, y, galaxy) {
                var _a;
                super('Sector');
                this.x = x;
                this.y = y;
                this.galaxy = galaxy;
                this.objs = [];
                this.big = [x, y];
                this.group = new THREE.Group;
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
                //for (let obj of this.objs)
                //	obj.tick();
            }
            show() {
                if (this.on())
                    return;
                Util.SectorShow(this);
                //console.log(' sector show ');
                for (let obj of this.objs)
                    obj.show();
                Renderer$1.scene.add(this.group);
            }
            hide() {
                if (this.off())
                    return;
                Util.SectorHide(this);
                //console.log(' sector hide ');
                for (let obj of this.objs)
                    obj.hide();
                Renderer$1.scene.remove(this.group);
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
                        let sector = this.galaxy.lookup(pos[0], pos[1]);
                        if (!sector)
                            continue;
                        if (!sector.isActive()) {
                            this.shown.push(sector);
                            sector.show();
                        }
                    }
                }
            }
            offs() {
                let allObjs = [];
                let i = this.shown.length;
                while (i--) {
                    let sector;
                    sector = this.shown[i];
                    allObjs = allObjs.concat(sector.objs_());
                    sector.tick();
                    if (pts.dist(sector.big, this.big) > this.outside) {
                        sector.hide();
                        this.shown.splice(i, 1);
                    }
                }
                for (let obj of allObjs)
                    obj.tick();
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
                // console.log(' obj show ');
                this.update();
                (_a = this.drawable) === null || _a === void 0 ? void 0 : _a.show();
            }
            hide() {
                var _a;
                if (this.off())
                    return;
                // console.log(' obj hide ');
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
                this.geometry = new THREE.PlaneBufferGeometry(w, h, 2, 2);
                let map = Renderer$1.loadtexture(`img/${this.y.img}.png`);
                this.material = new THREE.MeshBasicMaterial({
                    map: map,
                    transparent: true,
                });
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.frustumCulled = false;
                this.mesh.matrixAutoUpdate = false;
                this.update();
                //if (this.y.drawable.x.obj.sector)
                //	this.y.drawable.x.obj.sector.group.add(this.mesh);
                //else
                Renderer$1.scene.add(this.mesh);
            }
        }
        Core.Rectangle = Rectangle;
    })(Core || (Core = {}));
    var Util;
    (function (Util) {
        function SectorShow(sector) {
            let breadth = Core.Galaxy.Unit * Core.Galaxy.SectorSpan;
            let any = sector;
            any.geometry = new THREE.PlaneBufferGeometry(breadth, breadth, 2, 2);
            any.material = new THREE.MeshBasicMaterial({
                wireframe: true,
                transparent: true,
                color: 'red'
            });
            any.mesh = new THREE.Mesh(any.geometry, any.material);
            any.mesh.position.fromArray([sector.x * breadth + breadth / 2, sector.y * breadth + breadth / 2, 0]);
            any.mesh.updateMatrix();
            any.mesh.frustumCulled = false;
            any.mesh.matrixAutoUpdate = false;
            Renderer$1.scene.add(any.mesh);
        }
        Util.SectorShow = SectorShow;
        function SectorHide(sector) {
            let any = sector;
            Renderer$1.scene.remove(any.mesh);
        }
        Util.SectorHide = SectorHide;
    })(Util || (Util = {}));
    var Core$1 = Core;

    var Objects;
    (function (Objects) {
        let globals;
        (function (globals) {
        })(globals = Objects.globals || (Objects.globals = {}));
        class Ply extends Core$1.Obj {
            static instance() {
                let ply = new Ply;
                ply.make();
                return ply;
            }
            constructor() {
                super();
            }
            make() {
                let drawable = new Core$1.Drawable({ obj: this });
                let shape = new Core$1.Rectangle({
                    drawable: drawable,
                    img: 'redfighter0005'
                });
            }
            tick() {
                super.update();
            }
        }
        Objects.Ply = Ply;
        class Ping extends Core$1.Obj {
            constructor() {
                super();
            }
            make() {
                let drawable = new Core$1.Drawable({ obj: this });
                let shape = new Core$1.Rectangle({
                    drawable: drawable,
                    img: 'redfighter0005'
                });
            }
        }
        Objects.Ping = Ping;
        class Rock extends Core$1.Obj {
            constructor() {
                super();
                this.float = pts.make((Math.random() - 0.5) / Rock.slowness, (Math.random() - 0.5) / Rock.slowness);
                this.rate = (Math.random() - 0.5) / (Rock.slowness * 6);
            }
            make() {
                this.size = [200, 200];
                let drawable = new Core$1.Drawable({ obj: this });
                let shape = new Core$1.Rectangle({
                    drawable: drawable,
                    img: 'pngwing.com'
                });
            }
            tick() {
                var _a;
                this.wpos[0] += this.float[0];
                this.wpos[1] -= this.float[1];
                this.rz += this.rate;
                super.update();
                (_a = this.sector) === null || _a === void 0 ? void 0 : _a.swap(this);
            }
        }
        Rock.slowness = 12;
        Objects.Rock = Rock;
    })(Objects || (Objects = {}));
    var Objects$1 = Objects;

    // high level game happenings
    var Hooks;
    (function (Hooks) {
        function start() {
            console.log(' hooks start ');
            Core$1.Sector.hooks = {
                onCreate: SectorOnCreate
            };
        }
        Hooks.start = start;
        function SectorOnCreate() {
        }
        Hooks.SectorOnCreate = SectorOnCreate;
    })(Hooks || (Hooks = {}));
    var Hooks$1 = Hooks;

    var Universe;
    (function (Universe) {
        let globals;
        (function (globals) {
        })(globals = Universe.globals || (Universe.globals = {}));
        function start() {
            globals.game = Game.make();
            Hooks$1.start();
        }
        Universe.start = start;
        class Game {
            constructor() {
                //objs: Game.Obj[] = [];
                this.view = [0, 0];
                this.pos = [0, 0];
                this.wpos = [0, 0];
                this.mrpos = [0, 0];
                this.galaxy = new Core$1.Galaxy(10);
            }
            static make() {
                return new Game;
            }
            chart(big) {
            }
            add(obj) {
                let sector = this.galaxy.atwpos(obj.wpos);
                sector.add(obj);
            }
            remove(obj) {
                var _a;
                (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
            }
            tick() {
                this.move();
                this.mouse();
                this.stats();
                let pos = Core$1.Galaxy.unproject(this.view);
                this.galaxy.update(pos);
            }
            mouse() {
                let mouse = App$1.mouse();
                mouse = pts.subtract(mouse, pts.divide([Renderer$1.w, Renderer$1.h], 2));
                mouse = pts.mult(mouse, Renderer$1.ndpi);
                mouse[1] = -mouse[1];
                this.mrpos = pts.add(this.view, mouse);
                if (App$1.button(0) == 1) {
                    console.log('clicked the view');
                    let rock = new Objects$1.Rock;
                    // pts.divide(this.mpos, Core.Galaxy.Unit); // Galaxy.unproject
                    rock.wpos = Core$1.Galaxy.unproject(this.mrpos);
                    rock.make();
                    this.add(rock);
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
                this.pos = Core$1.Galaxy.unproject(this.view);
                Renderer$1.scene.position.set(inv[0], inv[1], 0);
            }
            stats() {
                let crunch = ``;
                crunch += `DPI_UPSCALED_RT: ${Renderer$1.DPI_UPSCALED_RT}<br />`;
                crunch += `fps: ${Renderer$1.fps}<br />`;
                crunch += `memory: ${Renderer$1.memory}<br />`;
                crunch += `(n)dpi: ${Renderer$1.ndpi}<br />`;
                crunch += `mouse pos: ${pts.to_string(App$1.mouse())}<br /><br />`;
                crunch += `world pos: ${pts.to_string(this.view)}<br />`;
                //crunch += `world wpos: ${pts.to_string(this.pos)}<br /><br />`;
                crunch += `sectors: ${Countable.Get('Sector').Active} / ${Countable.Get('Sector').Num}<br />`;
                crunch += `game objs: ${Countable.Get('Obj').Active} / ${Countable.Get('Obj').Num}<br />`;
                crunch += `drawables: ${Countable.Get('Drawable').Active} / ${Countable.Get('Drawable').Num}<br />`;
                App$1.sethtml('.stats', crunch);
            }
            start() {
                globals.ply = Objects$1.Ply.instance();
                this.add(globals.ply);
            }
        }
        Universe.Game = Game;
        let Util;
        (function (Util) {
            function Galx_towpos(s, wpos) {
            }
            Util.Galx_towpos = Galx_towpos;
            function Sector_getobjat(s, wpos) {
                for (let obj of s.objs_())
                    if (pts.equals(obj.wpos, wpos))
                        return obj;
            }
            Util.Sector_getobjat = Sector_getobjat;
        })(Util = Universe.Util || (Universe.Util = {}));
    })(Universe || (Universe = {}));
    var Universe$1 = Universe;

    var TestingChamber;
    (function (TestingChamber) {
        function start() {
            console.log('start testing chamber');
            console.log('placing squares on game area that should take up 1:1 pixels on screen...');
            console.log('...regardless of your os or browsers dpi setting');
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    let conversion = 100 / Core$1.Galaxy.Unit;
                    let square = TestingSquare.make();
                    square.wpos = [x * conversion, y * conversion];
                    square.make();
                    Universe$1.globals.game.add(square);
                }
            }
        }
        TestingChamber.start = start;
        class TestingSquare extends Core$1.Obj {
            constructor() {
                super();
            }
            static make() {
                return new TestingSquare;
            }
            make() {
                this.size = [100, 100];
                let drawable = new Core$1.Drawable({ obj: this });
                let shape = new Core$1.Rectangle({
                    drawable: drawable,
                    img: 'test100'
                });
                this.shape = shape;
            }
            tick() {
                //super.update();
                //return;
                if (this.moused(Universe$1.globals.game.mrpos)) {
                    this.shape.material.color.set('green');
                }
                else {
                    this.shape.material.color.set('white');
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
            Universe$1.start();
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
            Universe$1.globals.game.start();
            if (window.location.href.indexOf("#testingchamber") != -1)
                TestingChamber$1.start();
            if (window.location.href.indexOf("#novar") != -1)
                Grav.NO_VAR = false;
            //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        function tick() {
            if (!started) {
                reasonable_waiter();
                return;
            }
            Universe$1.globals.game.tick();
            //Board.update();
            //Ploppables.update();
        }
        Grav.tick = tick;
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
            Grav.tick();
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
