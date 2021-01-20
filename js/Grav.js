import Game2 from "./Game2";
import TestingChamber from "./TestingChamber";
export var Grav;
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
    ;
    let timer;
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
        clearTimeout(timer);
        timer = setTimeout(start_anyway, MAX_WAIT);
    }
    function start_anyway() {
        console.warn('couldnt load everything, starting anyway');
        start();
    }
    Grav.start_anyway = start_anyway;
    function critical(mask) {
        // Couldn't load
        console.error('resource', mask);
    }
    Grav.critical = critical;
    function init() {
        console.log('grav init');
        Game2.World.make();
        resourced('RC_UNDEFINED');
        resourced('POPULAR_ASSETS');
        resourced('READY');
        window['GRAV'] = Grav;
    }
    Grav.init = init;
    function start() {
        if (started)
            return;
        console.log('grav start');
        if (window.location.href.indexOf("#testingchamber") != -1)
            TestingChamber.Adept();
        if (window.location.href.indexOf("#novar") != -1)
            Grav.NO_VAR = false;
        //wlrd.populate();
        //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
        clearTimeout(timer);
        started = true;
    }
    function update() {
        if (!started)
            return;
        Game2.globals.wlrd.update();
        //Board.update();
        //Ploppables.update();
    }
    Grav.update = update;
})(Grav || (Grav = {}));
export default Grav;
