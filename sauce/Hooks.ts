import Core from "./Core";
import Universe from "./Universe";
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