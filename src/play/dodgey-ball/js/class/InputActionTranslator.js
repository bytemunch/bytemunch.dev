import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
export class InputActionTranslator {
    get usingTouch() {
        let touch = false;
        for (let p of this.players) {
            if (p.controller.split('-')[0] == 'touch')
                touch = true;
        }
        return touch;
    }
    constructor(playerCount = 2) {
        this.players = [];
        this.kb = {};
        this.kbUsedKeys = ['W', 'A', 'S', 'D', 'F', 'SHIFT', 'Q', 'E', '2', '4', '6', '8', '1', '3', '5', '7', '9'];
        for (let i = 0; i < playerCount; i++) {
            this.players.push({
                direction: vec3.create(),
                target: vec3.create(),
                lastTarget: vec3.create(),
                shoot: false,
                pickup: false,
                sprint: false,
                controller: game.screenMgr.screens.controller[`controller${i + 1}`].selectedInput,
                debounceCounter: 0
            });
        }
        window.addEventListener('keydown', e => {
            if (!this.kbUsedKeys.includes(e.key.toUpperCase()))
                return;
            e.preventDefault();
            this.kb[e.key.toUpperCase()] = true;
        });
        window.addEventListener('keyup', e => {
            if (!this.kbUsedKeys.includes(e.key.toUpperCase()))
                return;
            e.preventDefault();
            this.kb[e.key.toUpperCase()] = false;
        });
    }
    update(t) {
        game.gamepadMgr.refreshStates();
        for (let playerID = 0; playerID < this.players.length; playerID++) {
            this.reset(playerID);
            this.players[playerID].debounceCounter--;
            const scheme = this.players[playerID].controller.split('-')[0];
            const id = this.players[playerID].controller.split('-')[1];
            switch (scheme) {
                case 'gamepad':
                    this.translateGamepad(playerID, id);
                    break;
                case 'keyboard':
                    this.translateKeyboard(playerID, id);
                    break;
                case 'touch':
                    this.translateTouch(playerID, id);
                    break;
                case 'default':
                    console.log('no controller for ' + playerID);
            }
        }
    }
    reset(playerID) {
        if (this.players[playerID].shoot) {
            Object.assign(this.players[playerID], { target: vec3.create(), lastTarget: vec3.create() });
        }
        Object.assign(this.players[playerID], {
            direction: vec3.create(),
            shoot: false,
            pickup: false,
            sprint: false,
            lastTarget: vec3.clone(this.players[playerID].target),
            controller: game.screenMgr.screens.controller[`controller${playerID + 1}`].selectedInput,
        });
    }
    translateGamepad(playerID, gamepadID) {
        const gamepad = game.gamepadMgr.gamepads[gamepadID];
        if (!gamepad)
            return;
        this.players[playerID].direction = vec3.fromValues(gamepad.axes[0], 0, -gamepad.axes[1]);
        this.players[playerID].target = vec3.fromValues(gamepad.axes[2] > 0.1 ? gamepad.axes[2] : gamepad.axes[2] < -0.1 ? gamepad.axes[2] : 0, 0, gamepad.axes[3] > 0.1 ? gamepad.axes[3] : gamepad.axes[3] < -0.1 ? gamepad.axes[3] : 0);
        this.players[playerID].target[2] *= -1;
        if (vec3.equals(this.players[playerID].target, [0, 0, 0]))
            this.players[playerID].target = vec3.clone(this.players[playerID].direction);
        vec3.normalize(this.players[playerID].target, this.players[playerID].target);
        vec3.scale(this.players[playerID].target, this.players[playerID].target, 50);
        this.players[playerID].sprint = gamepad.buttons[4].pressed;
        if (gamepad.buttons[6].pressed || gamepad.buttons[7].pressed) {
            if (this.players[playerID].debounceCounter <= 0) {
                this.players[playerID].debounceCounter = 20;
                this.players[playerID].shoot = true;
                this.players[playerID].pickup = true;
            }
        }
    }
    translateKeyboard(playerID, kbID) {
        if (this.kb['W'])
            this.players[playerID].direction[2] = 1;
        if (this.kb['S'])
            this.players[playerID].direction[2] = -1;
        if (this.kb['A'])
            this.players[playerID].direction[0] = -1;
        if (this.kb['D'])
            this.players[playerID].direction[0] = 1;
        if (this.kb['Q']) {
            vec3.rotateY(this.players[playerID].target, this.players[playerID].target, [0, 0, 0], -0.1);
        }
        ;
        if (this.kb['E']) {
            vec3.rotateY(this.players[playerID].target, this.players[playerID].target, [0, 0, 0], 0.1);
        }
        ;
        if (this.kb['1'])
            this.players[playerID].target = vec3.fromValues(-1, 0, -1);
        if (this.kb['2'])
            this.players[playerID].target = vec3.fromValues(0, 0, -1);
        if (this.kb['3'])
            this.players[playerID].target = vec3.fromValues(1, 0, -1);
        if (this.kb['4'])
            this.players[playerID].target = vec3.fromValues(-1, 0, 0);
        if (this.kb['6'])
            this.players[playerID].target = vec3.fromValues(1, 0, 0);
        if (this.kb['7'])
            this.players[playerID].target = vec3.fromValues(-1, 0, 1);
        if (this.kb['8'])
            this.players[playerID].target = vec3.fromValues(0, 0, 1);
        if (this.kb['9'])
            this.players[playerID].target = vec3.fromValues(1, 0, 1);
        if (vec3.equals(this.players[playerID].target, [0, 0, 0]))
            this.players[playerID].target = vec3.clone(this.players[playerID].direction);
        vec3.normalize(this.players[playerID].target, this.players[playerID].target);
        vec3.scale(this.players[playerID].target, this.players[playerID].target, 50);
        if (this.kb['SHIFT'])
            this.players[playerID].sprint = true;
        if (this.kb['F'] || this.kb['5']) {
            if (this.players[playerID].debounceCounter <= 0) {
                this.players[playerID].debounceCounter = 20;
                this.players[playerID].shoot = true;
                this.players[playerID].pickup = true;
            }
        }
    }
    translateTouch(playerID, id) {
        const touchcontroller = game.touchController;
        this.players[playerID].direction = vec3.fromValues(touchcontroller.axes[0], 0, -touchcontroller.axes[1]);
        this.players[playerID].target = vec3.fromValues(touchcontroller.axes[2] > 0.1 ? touchcontroller.axes[2] : touchcontroller.axes[2] < -0.1 ? touchcontroller.axes[2] : 0, 0, touchcontroller.axes[3] > 0.1 ? touchcontroller.axes[3] : touchcontroller.axes[3] < -0.1 ? touchcontroller.axes[3] : 0);
        this.players[playerID].target[2] *= -1;
        this.players[playerID].sprint = touchcontroller.sprint;
        if (touchcontroller.action) {
            if (this.players[playerID].debounceCounter <= 0) {
                this.players[playerID].debounceCounter = 20;
                this.players[playerID].shoot = true;
                this.players[playerID].pickup = true;
            }
        }
        if (vec3.equals(this.players[playerID].target, [0, 0, 0]) && !vec3.equals(this.players[playerID].lastTarget, [0, 0, 0])) {
            this.players[playerID].target = vec3.clone(this.players[playerID].lastTarget);
            this.players[playerID].shoot = true;
            vec3.zero(this.players[playerID].lastTarget);
        }
        vec3.normalize(this.players[playerID].target, this.players[playerID].target);
        vec3.scale(this.players[playerID].target, this.players[playerID].target, 50);
    }
}
//# sourceMappingURL=InputActionTranslator.js.map