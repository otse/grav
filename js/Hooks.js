import Game from "./Game";
// high level game happenings
var Hooks;
(function (Hooks) {
    function start() {
        console.log(' hooks start ');
        Game.Sector.hooks = {
            onCreate: SectorOnCreate
        };
    }
    Hooks.start = start;
    function SectorOnCreate() {
    }
    Hooks.SectorOnCreate = SectorOnCreate;
})(Hooks || (Hooks = {}));
export default Hooks;
