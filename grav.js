var Grav = (function (THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

    class Pts {
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
            console.log(`window innerWidth, innerHeight ${window.innerWidth} x ${window.innerHeight}`);
            if (Renderer.ndpi > 1) {
                console.warn('Dpi i> 1. Game may scale.');
            }
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
            Renderer.w = window.innerWidth;
            Renderer.h = window.innerHeight;
            Renderer.w2 = Renderer.w * Renderer.ndpi;
            Renderer.h2 = Renderer.h * Renderer.ndpi;
            Renderer.w3 = Renderer.w2 - (Renderer.w2 - Renderer.w);
            Renderer.h3 = Renderer.h2 - (Renderer.h2 - Renderer.h);
            if (Renderer.w2 % 2 != 0) {
                Renderer.w2 -= 1;
            }
            if (Renderer.h2 % 2 != 0) {
                Renderer.h2 -= 1;
            }
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
                this.geometry = new THREE.PlaneBufferGeometry(100, 100, 2, 2);
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
            update() {
            }
        }
        Game.Quad = Quad;
    })(Game || (Game = {}));
    var Game$1 = Game;

    //import GRAV from "./Grav";
    var Game2;
    (function (Game2) {
        let globals;
        (function (globals) {
        })(globals = Game2.globals || (Game2.globals = {}));
        class World {
            constructor() {
                this.objs = [];
                this.pos = [0, 0];
            }
            static make() {
                globals.wlrd = new World;
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
                if (App$1.key('x'))
                    speed *= 10;
                if (App$1.key('w'))
                    p[1] -= speed;
                if (App$1.key('s'))
                    p[1] += speed;
                if (App$1.key('a'))
                    p[0] += speed;
                if (App$1.key('d'))
                    p[0] -= speed;
                Renderer$1.scene.position.set(p[0], p[1], 0);
            }
            stats() {
                let crunch = ``;
                crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
                crunch += `num game objs: ${Game$1.Obj.Active} / ${Game$1.Obj.Num}<br />`;
                crunch += `num drawables: ${Game$1.Drawable.Active} / ${Game$1.Drawable.Num}<br />`;
                App$1.sethtml('.stats', crunch);
            }
            start() {
                globals.ply = this.ply();
                this.add(globals.ply);
            }
            ply() {
                let ply = new Game2.Ply;
                ply.done();
                return ply;
            }
        }
        Game2.World = World;
        class Ply extends Game$1.Obj {
            constructor() {
                super();
            }
            done() {
                let drawable = new Game$1.Drawable;
                drawable.obj = this;
                drawable.done();
                this.drawable = drawable;
                let quad = new Game$1.Quad;
                quad.img = 'redfighter0005';
                quad.done();
                this.drawable.shape = quad;
            }
        }
        Game2.Ply = Ply;
    })(Game2 || (Game2 = {}));
    var Game2$1 = Game2;

    var TestingChamber;
    (function (TestingChamber) {
        function Adept() {
            console.log('start testing chamber');
        }
        TestingChamber.Adept = Adept;
    })(TestingChamber || (TestingChamber = {}));
    var TestingChamber$1 = TestingChamber;

    var Grav;
    (function (Grav) {
        Grav.NO_VAR = false;
        Grav.SOME_OTHER_SETTING = false;
        Grav.EVEN = 24; // very evenly divisible
        Grav.HALVE = Grav.EVEN / 2;
        Grav.YUM = Grav.EVEN;
        const MAX_WAIT = 3000;
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
            Game2$1.World.make();
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
                TestingChamber$1.Adept();
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
        var pos = { x: 0, y: 0 };
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
            return pos;
        }
        App.mouse = mouse;
        function boot(version) {
            App.salt = version;
            function onmousemove(e) { pos.x = e.clientX; pos.y = e.clientY; }
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
