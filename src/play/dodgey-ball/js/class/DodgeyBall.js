import { vec3 } from "../lib/gl-matrix/index.js";
import { animationInterval } from "../lib/timer/1.js";
import { Ballswap } from "./Ballswap.js";
import { Countdown } from "./Countdown.js";
import { Game } from "./Game.js";
import { Line } from "./Line.js";
import { Player } from "./Player.js";
import { Scoreboard } from "./Scoreboard.js";
import { Sphere } from "./Sphere.js";
import { Timer } from "./Timer.js";
import { TouchController } from "./TouchController.js";
export class DodgeyBall extends Game {
    constructor() {
        super();
        this.gravity = vec3.fromValues(0, 0.8, 0);
        this.scores = {
            0: 0,
            1: 0
        };
        this.scoreLimit = 0;
        this.timeLimit = Infinity;
        this.countdown = 3;
        this.ballSize = 20;
        this.ballOneSidedTimeLimit = 5000;
        this.controllerDebounce = [0, 0, 0, 0];
        this.playfield = {
            x: -568 / 2,
            y: -320 / 5,
            z: -320 / 2,
            width: 568,
            height: 320,
            depth: 320,
            floor: (-320 / 5) + 320
        };
    }
    postInit() {
        super.postInit();
        this.touchController = new TouchController;
    }
    onResize() {
        super.onResize();
    }
    setupGame(gameOptions) {
        this.scoreLimit = gameOptions.scoreLimit;
        this.timeLimit = gameOptions.timeLimit;
        this.uiObjects = [];
        this.addUi();
        this.resetMatch();
    }
    resetMatch() {
        if (this.matchTimerController)
            this.matchTimerController.abort();
        this.gameObjects = [
            new Player({ x: this.playfield.x, y: this.playfield.floor - 60, z: -30, team: 0 }),
            new Player({ x: this.playfield.x + this.playfield.width, y: this.playfield.floor - 60, z: -30, team: 1 }),
            new Sphere({ x: 0, y: 0, z: 0, r: this.ballSize }),
            new Sphere({ x: 0, y: 0, z: 100, r: this.ballSize }),
            new Sphere({ x: 0, y: 0, z: -100, r: this.ballSize }),
        ];
        this.addCourtLines();
        this.scores = { 0: 0, 1: 0 };
        this.matchTimerController = new AbortController();
        this.countdown = 3;
        animationInterval(1000, this.matchTimerController.signal, time => {
            if (this.paused)
                return;
            if (this.countdown < 0) {
                this.timeLimit--;
            }
            else if (this.countdown == 1) {
                this.inplay = true;
                this.countdown--;
            }
            else {
                this.countdown--;
            }
        });
    }
    addCourtLines() {
        this.gameObjects.push(...[
            new Line([
                this.playfield.x,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ], [
                this.playfield.x + this.playfield.width,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ]),
            new Line([
                this.playfield.x,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ], [
                this.playfield.x,
                this.playfield.y,
                this.playfield.z + this.playfield.depth
            ]),
            new Line([
                this.playfield.x + this.playfield.width,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ], [
                this.playfield.x + this.playfield.width,
                this.playfield.y,
                this.playfield.z + this.playfield.depth
            ]),
            new Line([
                this.playfield.x + this.playfield.width,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ], [
                this.playfield.x + this.playfield.width,
                this.playfield.y + this.playfield.height,
                this.playfield.z
            ]),
            new Line([
                this.playfield.x + this.playfield.width,
                this.playfield.y + this.playfield.height,
                this.playfield.z
            ], [
                this.playfield.x,
                this.playfield.y + this.playfield.height,
                this.playfield.z
            ]),
            new Line([
                this.playfield.x,
                this.playfield.y + this.playfield.height,
                this.playfield.z
            ], [
                this.playfield.x,
                this.playfield.y + this.playfield.height,
                this.playfield.z + this.playfield.depth
            ]),
            new Line([this.playfield.x + this.playfield.width / 2, this.playfield.y + this.playfield.height, this.playfield.z], [this.playfield.x + this.playfield.width / 2, this.playfield.y + this.playfield.height, this.playfield.z + this.playfield.depth])
        ]);
        const numLines = 20;
        for (let i = 0; i < numLines; i++) {
            this.gameObjects.push(new Line([this.playfield.x, this.playfield.y + this.playfield.height, this.playfield.z + (this.playfield.depth / numLines) * i], [this.playfield.x + this.playfield.width, this.playfield.y + this.playfield.height, this.playfield.z + (this.playfield.depth / numLines) * i], '#FFFFFF69'));
        }
    }
    addUi() {
        document.querySelector('#touch-target').style.display = this.iAT.usingTouch ? 'block' : 'none';
        this.uiObjects.push(new Scoreboard({ pos: [this.playfield.x + 48, this.playfield.y - 64], team: 0 }));
        this.uiObjects.push(new Scoreboard({ pos: [-1 * (this.playfield.x) - 48 * 2, this.playfield.y - 64], team: 1 }));
        this.uiObjects.push(new Timer({ pos: [(this.playfield.x + this.playfield.width / 2) - 48 / 2, this.playfield.y - 64] }));
        this.uiObjects.push(new Ballswap({ pos: [0, 0] }));
        this.uiObjects.push(new Countdown({ pos: [0, 0] }));
    }
    addToScore(team, points) {
        this.scores[team] += points;
        if (this.scores[team] >= this.scoreLimit) {
            this.gameOver('score');
        }
    }
    gameOver(reason) {
        let winner;
        if (this.scores[0] > this.scores[1]) {
            winner = 0;
        }
        if (this.scores[0] < this.scores[1]) {
            winner = 1;
        }
        if (this.scores[0] == this.scores[1]) {
            winner = 2;
        }
        this.inplay = false;
        this.matchTimerController.abort();
        this.timeLimit = Infinity;
        let txt = winner == 2 ? `It's a draw!` : `${winner ? 'Cyan' : 'Yellow'} Wins by ${reason == 'score' ? `reaching the score limit of ${this.scoreLimit}` : `running out the clock`}!`;
        this.screenMgr.gameOver(txt);
    }
    get allBallsLeft() {
        if (this.gameObjects.filter(v => v.is == 'player')[0].hasBall)
            return false;
        let left = true;
        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => { if (v.x <= this.playfield.x + this.playfield.width / 2)
            left = false; });
        return left;
    }
    get allBallsRight() {
        if (this.gameObjects.filter(v => v.is == 'player')[1].hasBall)
            return false;
        let right = true;
        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => { if (v.x >= this.playfield.x + this.playfield.width / 2)
            right = false; });
        return right;
    }
    get players() {
        return this.gameObjects.filter(o => o.is == 'player');
    }
    moveAllBallsToSide() {
        let xPos = this.allBallsLeft ? -150 : 150;
        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => v.toBeRemoved = true);
        this.gameObjects.filter(v => v.is == 'player')[this.allBallsLeft ? 1 : 0].hasBall = false;
        this.gameObjects.push(new Sphere({ x: xPos, y: 0, z: 0, r: this.ballSize }), new Sphere({ x: xPos, y: 0, z: 100, r: this.ballSize }), new Sphere({ x: xPos, y: 0, z: -100, r: this.ballSize }));
    }
    gamepadMenuInput() {
        var _a, _b;
        const debounceTime = 20;
        if (this.gamepadMgr.gamepads[0]) {
            if (this.controllerDebounce[0] <= 0) {
                if (this.gamepadMgr.gamepads[0].buttons[12].pressed) {
                    this.screenMgr.currentScreenElement.gamepadMove('up');
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[13].pressed) {
                    this.screenMgr.currentScreenElement.gamepadMove('down');
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[14].pressed) {
                    this.screenMgr.currentScreenElement.gamepadMove('left');
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[15].pressed) {
                    this.screenMgr.currentScreenElement.gamepadMove('right');
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[0].pressed) {
                    (_a = this.screenMgr.currentScreenElement.shadowRoot.activeElement) === null || _a === void 0 ? void 0 : _a.click();
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[1].pressed) {
                    this.screenMgr.back();
                    this.controllerDebounce[0] = debounceTime;
                }
                if (this.gamepadMgr.gamepads[0].buttons[2].pressed) {
                    (_b = this.screenMgr.currentScreenElement) === null || _b === void 0 ? void 0 : _b.testButtonPressed(0);
                    this.controllerDebounce[0] = debounceTime;
                }
            }
            else {
                this.controllerDebounce[0]--;
            }
        }
        if (this.screenMgr.currentPage == 'controller') {
            const controllerScreen = this.screenMgr.currentScreenElement;
            for (let g of this.gamepadMgr.gamepads) {
                if (g.buttons[2].pressed && !controllerScreen.getGamepadConnected(g.index)) {
                    const nextInput = controllerScreen.getNextAvailableInput();
                    if (nextInput) {
                        nextInput.setInput('gamepad-' + g.index);
                    }
                }
                const connectedTo = controllerScreen.getGamepadConnected(g.index);
                if (connectedTo) {
                    if (g.buttons[3].pressed) {
                        connectedTo.setInput('none');
                    }
                    if (this.controllerDebounce[g.index] <= 0) {
                        if (g.buttons[14].pressed) {
                            connectedTo.nextCharacter(-1);
                            this.controllerDebounce[g.index] = debounceTime;
                        }
                        if (g.buttons[15].pressed) {
                            connectedTo.nextCharacter(1);
                            this.controllerDebounce[g.index] = debounceTime;
                        }
                    }
                    else {
                        this.controllerDebounce[g.index]--;
                    }
                }
            }
        }
    }
    gameLoop(t) {
        this.gamepadMenuInput();
        for (let s of this.gameObjects.filter(o => o.is == 'sphere')) {
            for (let s2 of this.gameObjects.filter(o => o.is == 'sphere')) {
                s.collideWithObject(s2);
            }
        }
        for (let o of this.gameObjects) {
            o.update(t);
        }
        if (this.inplay) {
            if (this.allBallsLeft || this.allBallsRight) {
                if (!this.ballsOneSidedSince)
                    this.ballsOneSidedSince = t;
                if (t > this.ballsOneSidedSince + this.ballOneSidedTimeLimit) {
                    this.ballsOneSidedSince = 0;
                    this.moveAllBallsToSide();
                }
            }
            else {
                this.ballsOneSidedSince = 0;
            }
            if (this.timeLimit <= 0) {
                this.gameOver('time');
                this.timeLimit = Infinity;
            }
        }
        for (let o of this.uiObjects) {
            o.update(t);
        }
        for (let o of this.allObjects.sort((a, b) => b.cz - a.cz).sort((a, b) => 0 - Number(a.is == 'line'))) {
            o.draw(this.ctx);
        }
    }
}
//# sourceMappingURL=DodgeyBall.js.map