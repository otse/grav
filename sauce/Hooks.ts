import Core from "./Core";
import Game from "./Game";
import Objects from "./Objects";

// high level game happenings

namespace Hooks {
	export function start() {
		console.log(' hooks start ');
		
		Core.Sector.hooks = {
			onCreate: SectorOnCreate
		};
		
	}
	export function SectorOnCreate() {
		
	}
}

export default Hooks;