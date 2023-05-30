import { AudioManager } from "./AudioManager.js";
import { Camera } from "./Camera.js";
import { CameraXY } from "./CameraXY.js";
import { GamepadManager } from "./GamepadManager.js";
import { InputActionTranslator } from "./InputActionTranslator.js";
import { ScreenManager } from "./ScreenManager.js";
export class Game {
    constructor() {
        this.timeFactor = 0;
        this.prevFrameTime = 0;
        this.timestep = 0;
        this.deltaTime = 0;
        this.framecount = 0;
        this.sizeRatio = 0;
        this.paused = true;
        this.containerDiv = document.querySelector('#main-game');
        this.touchTarget = document.querySelector('#touch-target');
        this.createCanvas();
        this.containerDiv.appendChild(this.cnv);
        this.containerDiv.appendChild(this.iCnv);
        this.gameObjects = [];
        this.uiObjects = [];
        this.audioMgr = new AudioManager;
        this.gamepadMgr = new GamepadManager;
        window.addEventListener('resize', e => {
            this.onResize();
        });
    }
    postInit() {
        this.loadData();
        this.camera = new Camera(this.cnv);
        this.cameraXY = new CameraXY(this.cnv);
        this.onResize();
        this.screenMgr = new ScreenManager;
        this.screenMgr.init();
        this.iAT = new InputActionTranslator(2);
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
    }
    createCanvas() {
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';
        this.ctx = this.cnv.getContext('2d');
        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';
        this.iCtx = this.iCnv.getContext('2d');
    }
    onResize() {
        this.containerBB = this.containerDiv.getBoundingClientRect();
        this.iCnv.width = this.containerBB.width;
        this.iCnv.height = this.containerBB.height;
        this.cnv.width = this.containerBB.width;
        this.cnv.height = this.containerBB.height;
        this.sizeRatio = this.containerBB.width / this.playfield.width;
        this.camera.update(this.sizeRatio);
        this.cameraXY.update(this.sizeRatio);
    }
    clearData() {
        const emptySaveData = {
            'empty': 'save'
        };
        localStorage.setItem('save-data', JSON.stringify(emptySaveData));
        this.loadData();
    }
    saveData() {
        const saveData = {
            'empty': 'save'
        };
        localStorage.setItem('save-data', JSON.stringify(saveData));
    }
    loadData() {
        const data = JSON.parse(localStorage.getItem('save-data'));
        if (data) {
        }
        else {
            this.clearData();
        }
    }
    btnToggleAudio() {
        if (this.audioMgr.muted) {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.remove('disabled'));
            this.audioMgr.muted = false;
        }
        else {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.add('disabled'));
            this.audioMgr.muted = true;
        }
    }
    btnClearData() {
        this.audioMgr.play('click');
        this.clearData();
        console.log('data cleared!');
    }
    btnSaveQuit() {
        this.audioMgr.play('click');
        this.saveData();
        console.log('saved, now quit.');
    }
    async btnPlay() {
        await this.audioMgr.init();
    }
    btnResume() {
        this.unpause();
    }
    pause() {
        this.audioMgr.play('click');
        this.paused = true;
        this.timeFactor = 0;
    }
    unpause() {
        this.audioMgr.play('click');
        this.timeFactor = 1;
        this.paused = false;
    }
    async advert() {
        let countdown = 5;
        const adDiv = this.containerDiv.querySelector('#advert');
        const adTxt = adDiv.querySelector('#countdown');
        adDiv.style.display = 'block';
        this.audioMgr.play('click');
        let adProm = new Promise((res) => {
            let ivl = setInterval(() => { countdown--; adTxt.textContent = `Skipping in ${countdown}...`; if (countdown <= 0) {
                clearInterval(ivl);
                res(1);
            } }, 1000);
        });
        await adProm;
        adDiv.style.display = 'none';
        adTxt.textContent = `Skipping in 5...`;
        return;
    }
    get allObjects() {
        return [...this.gameObjects, ...this.uiObjects];
    }
    async loop(t) {
        this.framecount++;
        this.deltaTime = (t - this.prevFrameTime) / 20;
        this.timestep = this.deltaTime * this.timeFactor;
        this.prevFrameTime = t;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iAT.update(t);
        for (let i = this.gameObjects.length - 1; i > 0; i--) {
            if (this.gameObjects[i].toBeRemoved == true)
                this.gameObjects.splice(i, 1);
        }
        this.gameLoop(t);
        requestAnimationFrame(this.loop.bind(this));
    }
    gameLoop(t) {
    }
}
//# sourceMappingURL=Game.js.map