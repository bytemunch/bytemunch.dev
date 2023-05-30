import { CustomElement } from "./CustomElement.js";
export class FullscreenMenu extends CustomElement {
    constructor() {
        super();
        window.addEventListener('keydown', e => {
            if (!this.isCurrentScreen)
                return;
            console.log(e.key);
            if (e.key == 'ArrowLeft') {
                this.gamepadMove('left');
                e.preventDefault();
            }
            if (e.key == 'ArrowRight') {
                this.gamepadMove('right');
                e.preventDefault();
            }
            if (e.key == 'ArrowUp') {
                this.gamepadMove('up');
                e.preventDefault();
            }
            if (e.key == 'ArrowDown') {
                this.gamepadMove('down');
                e.preventDefault();
            }
            if (e.key == ' ' || e.key == 'Enter') {
                this.shadowRoot.activeElement.click();
                e.preventDefault();
            }
        });
    }
    get isCurrentScreen() {
        return this.style.display == 'block';
    }
    connectedCallback() {
        super.connectedCallback();
        this.classList.add('fs-menu');
    }
    show() {
        this.style.display = 'block';
    }
    hide() {
        var _a;
        this.style.display = 'none';
        (_a = this.shadowRoot.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
    }
    gamepadMove(direction) {
        var _a;
        const focused = (_a = this.shadowRoot.activeElement) === null || _a === void 0 ? void 0 : _a.id;
        if (!focused) {
            this.shadowRoot.querySelector('#' + Object.keys(this.gamepadDirections)[0]).focus();
            return;
        }
        if (!this.gamepadDirections[focused][direction])
            return;
        this.shadowRoot.querySelector('#' + this.gamepadDirections[focused][direction]).focus();
    }
}
;
//# sourceMappingURL=FullscreenMenu.js.map