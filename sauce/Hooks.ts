import Game from "./Game";
import Game2 from "./Game2";
import Game3 from "./Game3";

// high level game happenings

namespace Hooks {
	export function start() {
		console.log(' hooks start ');
		
		Game.Sector.hooks = {
			onCreate: SectorOnCreate
		};
		
	}
	export function SectorOnCreate() {
		
	}
}

export default Hooks;