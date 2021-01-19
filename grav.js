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
                if (App$1.keys['x'])
                    speed *= 10;
                if (App$1.keys['w'])
                    p[1] -= speed;
                if (App$1.keys['s'])
                    p[1] += speed;
                if (App$1.keys['a'])
                    p[0] += speed;
                if (App$1.keys['d'])
                    p[0] -= speed;
                Renderer$1.scene.position.set(p[0], p[1], 0);
            }
            stats() {
                let crunch = ``;
                crunch += `world pos: ${Pts.to_string(this.pos)}`;
                App$1.sethtml('.stats', crunch);
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
                this.geometry = new THREE.PlaneBufferGeometry(30, 30, 2, 2);
                let map = Renderer$1.loadtexture(`img/${this.img}.png`);
                this.material = new THREE.MeshBasicMaterial({
                    map: map,
                    transparent: true,
                    //color: 0xffffff,
                    color: 'red'
                });
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.frustumCulled = false;
                this.mesh.matrixAutoUpdate = false;
                this.update();
                Renderer$1.scene.add(this.mesh);
            }
            update() {
            }
        }
        Grav.Element = Element;
    })(Grav || (Grav = {}));
    var Grav$1 = Grav;

    var TestingChamber;
    (function (TestingChamber) {
        function Adept() {
            console.log('start testing chamber');
        }
        TestingChamber.Adept = Adept;
    })(TestingChamber || (TestingChamber = {}));
    var TestingChamber$1 = TestingChamber;

    var GRAV;
    (function (GRAV) {
        GRAV.NO_VAR = false;
        GRAV.SOME_OTHER_SETTING = false;
        GRAV.EVEN = 24; // very evenly divisible
        GRAV.HALVE = GRAV.EVEN / 2;
        GRAV.YUM = GRAV.EVEN;
        var started = false;
        function sample(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        GRAV.sample = sample;
        function clamp(val, min, max) {
            return val > max ? max : val < min ? min : val;
        }
        GRAV.clamp = clamp;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
            RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
            RESOURCES[RESOURCES["READY"] = 2] = "READY";
            RESOURCES[RESOURCES["COUNT"] = 3] = "COUNT";
        })(RESOURCES = GRAV.RESOURCES || (GRAV.RESOURCES = {}));
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        GRAV.resourced = resourced;
        function try_start() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                if (resources_loaded & 0b1 << i)
                    count++;
            if (count == RESOURCES.COUNT)
                start();
        }
        function critical(mask) {
            // Couldn't load
            console.error('resource', mask);
        }
        GRAV.critical = critical;
        function init() {
            console.log('grav init');
            GRAV.wlrd = Grav$1.World.make();
            resourced('RC_UNDEFINED');
            resourced('POPULAR_ASSETS');
            resourced('READY');
            window['GRAV'] = GRAV;
        }
        GRAV.init = init;
        function start() {
            if (started)
                return;
            console.log('grav start');
            if (window.location.href.indexOf("#testingchamber") != -1)
                TestingChamber$1.Adept();
            if (window.location.href.indexOf("#novar") != -1)
                GRAV.NO_VAR = false;
            //wlrd.populate();
            //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        function update() {
            if (!started)
                return;
            GRAV.wlrd.update();
            //Board.update();
            //Ploppables.update();
        }
        GRAV.update = update;
    })(GRAV || (GRAV = {}));

    var App;
    (function (App) {
        let KEY;
        (function (KEY) {
            KEY[KEY["Off"] = 0] = "Off";
            KEY[KEY["Press"] = 1] = "Press";
            KEY[KEY["Wait"] = 2] = "Wait";
            KEY[KEY["Again"] = 3] = "Again";
            KEY[KEY["Up"] = 4] = "Up";
        })(KEY = App.KEY || (App.KEY = {}));
        App.keys = {};
        App.buttons = {};
        App.pos = { x: 0, y: 0 };
        App.salt = 'x';
        App.wheel = 0;
        function onkeys(event) {
            const key = event.key.toLowerCase();
            if ('keydown' == event.type)
                App.keys[key] = App.keys[key] ? KEY.Again : KEY.Press;
            else if ('keyup' == event.type)
                App.keys[key] = KEY.Up;
            if (event.keyCode == 114)
                event.preventDefault();
            return;
        }
        App.onkeys = onkeys;
        function boot(a) {
            App.salt = a;
            function onmousemove(e) { App.pos.x = e.clientX; App.pos.y = e.clientY; }
            function onmousedown(e) { App.buttons[e.button] = 1; }
            function onmouseup(e) { App.buttons[e.button] = 0; }
            function onwheel(e) { App.wheel = e.deltaY < 0 ? 1 : -1; }
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
            Renderer$1.init();
            GRAV.init();
            loop();
        }
        App.boot = boot;
        function delay() {
            for (let i in App.keys) {
                if (KEY.Press == App.keys[i])
                    App.keys[i] = KEY.Wait;
                else if (KEY.Up == App.keys[i])
                    App.keys[i] = KEY.Off;
            }
        }
        App.delay = delay;
        function loop(timestamp) {
            requestAnimationFrame(loop);
            Renderer$1.update();
            GRAV.update();
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
