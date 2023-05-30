import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";
export class GameOverScreen extends FullscreenMenu {
    constructor() {
        super();
        this.tempID = 'gameover';
        this.gamepadDirections = { 'continue': {} };
    }
    set txt(txt) {
        this.shadowRoot.querySelector('h2').textContent = txt;
    }
    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.querySelector('#continue').addEventListener('click', () => this.doneButtonPressed());
    }
    doneButtonPressed() {
        game.screenMgr.open('setup');
    }
}
customElements.define('ce-gameover-screen', GameOverScreen);
//# sourceMappingURL=GameOverScreen.js.map