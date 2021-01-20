import { default as THREE, OrthographicCamera, Clock, Scene, WebGLRenderer, TextureLoader, WebGLRenderTarget, ShaderMaterial, Mesh, PlaneBufferGeometry, Color, NearestFilter, RGBAFormat } from 'three';
import App from './App';
export { THREE };
const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`;
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
        Renderer.clock = new Clock();
        Renderer.scene = new Scene();
        Renderer.scene.background = new Color('#292929');
        Renderer.scene2 = new Scene();
        Renderer.rttscene = new Scene();
        Renderer.ndpi = window.devicePixelRatio;
        console.log(`window innerWidth, innerHeight ${window.innerWidth} x ${window.innerHeight}`);
        if (Renderer.ndpi > 1) {
            console.warn('Dpi i> 1. Game may scale.');
        }
        Renderer.target = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
        });
        Renderer.renderer = new WebGLRenderer({ antialias: false });
        Renderer.renderer.setPixelRatio(Renderer.ndpi);
        Renderer.renderer.setSize(100, 100);
        Renderer.renderer.autoClear = true;
        Renderer.renderer.setClearColor(0xffffff, 0);
        document.body.appendChild(Renderer.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        Renderer.materialPost = new ShaderMaterial({
            uniforms: { tDiffuse: { value: Renderer.target.texture } },
            vertexShader: vertexScreen,
            fragmentShader: fragmentPost,
            depthWrite: false
        });
        onWindowResize();
        Renderer.quadPost = new Mesh(Renderer.plane, Renderer.materialPost);
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
        Renderer.w2 = Renderer.w; // * ndpi;
        Renderer.h2 = Renderer.h; // * ndpi;
        Renderer.w3 = Renderer.w2 - (Renderer.w2 - Renderer.w);
        Renderer.h3 = Renderer.h2 - (Renderer.h2 - Renderer.h);
        if (Renderer.w2 % 2 != 0) {
            Renderer.w2 -= 1;
        }
        if (Renderer.h2 % 2 != 0) {
            Renderer.h2 -= 1;
        }
        Renderer.target.setSize(Renderer.w2, Renderer.h2);
        Renderer.plane = new PlaneBufferGeometry(Renderer.w2, Renderer.h2);
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
        let texture = new TextureLoader().load(file + `?v=${App.salt}`, cb);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        mem[key || file] = texture;
        return texture;
    }
    Renderer.loadtexture = loadtexture;
    function rendertarget(w, h) {
        const o = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat
        };
        let target = new WebGLRenderTarget(w, h, o);
        return target;
    }
    Renderer.rendertarget = rendertarget;
    function ortographiccamera(w, h) {
        let camera = new OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
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
export default Renderer;
