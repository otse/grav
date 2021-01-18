import World from "./lod/World";
import { Board } from "./nested/Board";
import { Ploppables } from "./lod/Ploppables";
export var LUMBER;
(function (LUMBER) {
    LUMBER.USE_CHUNK_RT = false;
    LUMBER.OFFSET_CHUNK_OBJ_REKT = false;
    LUMBER.PAINT_OBJ_TICK_RATE = false;
    LUMBER.MINIMUM_REKTS_BEFORE_RT = 0;
    LUMBER.EVEN = 24; // very evenly divisible
    LUMBER.HALVE = LUMBER.EVEN / 2;
    LUMBER.YUM = LUMBER.EVEN;
    var started = false;
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    LUMBER.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    LUMBER.clamp = clamp;
    let RESOURCES;
    (function (RESOURCES) {
        RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
        RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
        RESOURCES[RESOURCES["READY"] = 2] = "READY";
        RESOURCES[RESOURCES["COUNT"] = 3] = "COUNT";
    })(RESOURCES = LUMBER.RESOURCES || (LUMBER.RESOURCES = {}));
    ;
    let resources_loaded = 0b0;
    function resourced(word) {
        resources_loaded |= 0b1 << RESOURCES[word];
        try_start();
    }
    LUMBER.resourced = resourced;
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
    LUMBER.critical = critical;
    function init() {
        console.log('egyt init');
        LUMBER.wlrd = World.rig();
        resourced('RC_UNDEFINED');
        resourced('READY');
        window['Lumber'] = LUMBER;
    }
    LUMBER.init = init;
    function start() {
        if (started)
            return;
        console.log('lumber starting');
        if (window.location.href.indexOf("#nochunkrt") != -1)
            LUMBER.USE_CHUNK_RT = false;
        LUMBER.wlrd.populate();
        Board.init();
        Board.raw(`
		<!-- <div>May have to reload for latest version<br/> -->
		<br />
		<div class="region small">
			<a>Tutorial</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Hold <key>X</key> to go faster. Scrollwheel to zoom. 
			</div>

			<a>World editing</a>
			<div>
				Very simple. Once you got an object following the curor, you can use scrollwheel to change it.
				<br/><br/>
				<key>b</key> structure<br/>
				<key>t</key> tree<br/>
				<key>y</key> tile<br/>
				<key>u</key> tile area<br/>
				<key>x</key> delete<br/>
				<key>esc</key> cancel<br/>
			</div>

			<a>Settings</a>
			<div>
				Nothing here yet
			</div>

			<a collapse>Stats</a>
			<div class="stats">
				<span id="fpsStat">xx</span><br/>
				<!-- <span id="memoryStat">xx</span><br/> -->
				<br/>
				<span id="gameZoom"></span><br/>
				<span id="gameAabb"></span><br/>
				<br/>
				<span id="numChunks"></span><br/>
				<span id="numObjs"></span><br/>
				<span id="numRekts"></span><br/>
				<br/>
				<span id="square"></span><br/>
				<span id="squareChunk"></span><br/>
				<span id="squareChunkRt">xx</span><br/>
				<br />
				<span id="snakeTurns"></span><br/>
				<span id="snakeTotal"></span><br/>
				<br/>
				<span id="USE_CHUNK_RTT">USE_CHUNK_RTT: ${LUMBER.USE_CHUNK_RT}</span><br/>
				<span id="OFFSET_CHUNK_OBJ_REKT">OFFSET_CHUNK_OBJ_REKT: ${LUMBER.OFFSET_CHUNK_OBJ_REKT}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">PAINT_OBJ_TICK_RATE: ${LUMBER.PAINT_OBJ_TICK_RATE}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">MINIMUM_REKTS_BEFORE_RT: ${LUMBER.MINIMUM_REKTS_BEFORE_RT}</span><br/>
			</div>`);
        //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
        started = true;
    }
    function update() {
        if (!started)
            return;
        LUMBER.wlrd.update();
        Board.update();
        Ploppables.update();
    }
    LUMBER.update = update;
})(LUMBER || (LUMBER = {}));
export default LUMBER;
