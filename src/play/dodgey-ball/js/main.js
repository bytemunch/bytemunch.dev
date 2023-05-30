import { DodgeyBall } from "./class/DodgeyBall.js";
import './elements/AudioToggle.js';
export let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new DodgeyBall;
    game.postInit();
});
//# sourceMappingURL=main.js.map