var Grav = (function (THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

    //import World from "./lod/World";
    //import Obj from "./objrekt/Obj";
    //import { Board } from "./nested/Board";
    //import { Ploppables } from "./lod/Ploppables";
    var GRAV;
    (function (GRAV) {
        GRAV.NO_VAR = false;
        GRAV.SOME_OTHER_SETTING = false;
        GRAV.EVEN = 24; // very evenly divisible
        GRAV.HALVE = GRAV.EVEN / 2;
        GRAV.YUM = GRAV.EVEN;
        //export var wlrd: World;
        //export var ply: Obj;
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
                (resources_loaded & 0b1 << i) ? count++ : void (0);
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
            //wlrd = World.rig();
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
            if (window.location.href.indexOf("#novar") != -1)
                GRAV.NO_VAR = false;
            //wlrd.populate();
            //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        function update() {
            if (!started)
                return;
            //wlrd.update();
            //Board.update();
            //Ploppables.update();
        }
        GRAV.update = update;
    })(GRAV || (GRAV = {}));

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
    })(App || (App = {}));
    window['App'] = App;
    var App$1 = App;

    return App$1;

}(THREE));
