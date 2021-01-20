import { Grav } from "./Grav";
import Renderer from "./Renderer";
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
        Renderer.init();
        Grav.init();
        loop(0);
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
        Renderer.update();
        Grav.update();
        Renderer.render();
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
export default App;
