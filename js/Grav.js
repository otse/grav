//import World from "./lod/World";
//import Obj from "./objrekt/Obj";
//import { Board } from "./nested/Board";
//import { Ploppables } from "./lod/Ploppables";
export var GRAV;
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
    ;
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
export default GRAV;
