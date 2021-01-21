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
        Renderer.CORRECT_OS_DPI = false;
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
                this.geometry = new THREE.PlaneBufferGeometry(this.w, this.h, 2, 2);
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
                let drawable = new Game$1.Drawable();
                drawable.obj = this;
                drawable.done();
                let shape = new Game$1.Quad();
                shape.img = 'redfighter0005';
                shape.drawable = drawable;
                shape.done();
                this.drawable = drawable;
                this.drawable.shape = shape;
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
        class World {
            constructor() {
                this.objs = [];
                this.view = [0, 0];
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
                this.click();
                this.move();
                this.stats();
                for (let obj of this.objs) {
                    obj.update();
                }
            }
            click() {
                if (App$1.button(0) == 1) {
                    console.log('clicked the view');
                    let mouse = App$1.mouse();
                    mouse = Pts.subtract(mouse, Pts.divide([Renderer$1.w, Renderer$1.h], 2));
                    mouse = Pts.mult(mouse, Renderer$1.ndpi);
                    mouse[1] = -mouse[1];
                    let unprojected = Pts.add(this.view, mouse);
                    let ping = new Game3$1.Ping;
                    ping.wpos = unprojected;
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
                let inv = Pts.inv(this.view);
                Renderer$1.scene.position.set(inv[0], inv[1], 0);
            }
            stats() {
                let crunch = ``;
                crunch += `CORRECT_DPI_SCALE: ${Renderer$1.CORRECT_OS_DPI}<br />`;
                crunch += `(n)dpi: ${Renderer$1.ndpi}<br /><br/>`;
                crunch += `mouse: ${Pts.to_string(App$1.mouse())}<br /><br />`;
                crunch += `world view: ${Pts.to_string(this.view)}<br />`;
                crunch += `world pos: ${Pts.to_string(this.pos)}<br />`;
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
                let drawable = new Game$1.Drawable();
                drawable.obj = this;
                drawable.done();
                let shape = new Game$1.Quad();
                shape.drawable = drawable;
                shape.img = 'redfighter0005';
                shape.done();
                this.drawable = drawable;
                this.drawable.shape = shape;
            }
        }
        Game2.Ply = Ply;
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
            static make() {
                return new TestingSquare;
            }
            constructor() {
                super();
            }
            done() {
                let drawable = new Game$1.Drawable();
                drawable.obj = this;
                drawable.done();
                let shape = new Game$1.Quad();
                shape.w = 100;
                shape.h = 100;
                shape.drawable = drawable;
                shape.img = 'test100';
                shape.done();
                this.drawable = drawable;
                this.drawable.shape = shape;
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
