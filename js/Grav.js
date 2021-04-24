import Universe from "./Universe";
import TestingChamber from "./TestingChamber";
export var Grav;
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
    ;
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
        Universe.start();
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
        Universe.globals.game.start();
        if (window.location.href.indexOf("#testingchamber") != -1)
            TestingChamber.start();
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
        Universe.globals.game.tick();
        //Board.update();
        //Ploppables.update();
    }
    Grav.tick = tick;
})(Grav || (Grav = {}));
export default Grav;
