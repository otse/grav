//import World from "./lod/World";
//import Obj from "./objrekt/Obj";

//import { Board } from "./nested/Board";
//import { Ploppables } from "./lod/Ploppables";


export namespace GRAV {

	export var NO_VAR = false;
	export var SOME_OTHER_SETTING = false;


	export const EVEN = 24; // very evenly divisible
	export const HALVE = EVEN / 2;
	export const YUM = EVEN;

	//export var wlrd: World;
	//export var ply: Obj;

	var started = false;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export enum RESOURCES {
		RC_UNDEFINED = 0,
		POPULAR_ASSETS,
		READY,
		COUNT
	};

	let resources_loaded = 0b0;

	export function resourced(word: string) {
		resources_loaded |= 0b1 << RESOURCES[word];
		try_start();
	}
	function try_start() {
		let count = 0;
		let i = 0;
		for (; i < RESOURCES.COUNT; i++)
			(resources_loaded & 0b1 << i) ? count++ : void (0);
		if (count == RESOURCES.COUNT)
			start();
	}
	export function critical(mask: string) {
		// Couldn't load
		console.error('resource', mask);
	}
	export function init() {
		console.log('grav init');
		//wlrd = World.rig();

		resourced('RC_UNDEFINED');
		resourced('POPULAR_ASSETS');
		resourced('READY');
		window['GRAV'] = GRAV;
	}
	function start() {
		if (started)
			return;
		console.log('grav start');

		if (window.location.href.indexOf("#novar") != -1)
			NO_VAR = false;

		//wlrd.populate();

		//setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);

		started = true;
	}

	export function update() {

		if (!started)
			return;

		//wlrd.update();

		//Board.update();

		//Ploppables.update();
	}

}

export default GRAV;