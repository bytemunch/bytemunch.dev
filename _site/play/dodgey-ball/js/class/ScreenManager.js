import { ControllerScreen } from "../elements/ControllerScreen.js";
import { GameOverScreen } from "../elements/GameOverScreen.js";
import { PauseScreen } from "../elements/PauseScreen.js";
import { SetupScreen } from "../elements/SetupScreen.js";
import { SplashScreen } from "../elements/SplashScreen.js";
import { game } from "../main.js";
export class ScreenManager {
    get currentScreenElement() {
        return this.screens[this.currentPage];
    }
    constructor() {
        this.screens = {
            setup: new SetupScreen,
            pause: new PauseScreen,
            gameover: new GameOverScreen,
            splash: new SplashScreen,
            controller: new ControllerScreen,
        };
        window.addEventListener('hashchange', e => {
            e.preventDefault();
            let newHash = location.hash.replace('#', '');
            if (this.currentPage == 'gameover') {
                newHash = 'setup';
            }
            if (this.currentPage == 'play' && newHash != 'gameover') {
                newHash = 'pause';
                game.pause();
            }
            if (this.currentPage == 'setup' && newHash == 'pause') {
                newHash = 'controller';
            }
            history.replaceState(null, 'unused', '#' + newHash);
            this.openScreen(newHash);
        });
    }
    init() {
        for (let s in this.screens) {
            game.containerDiv.appendChild(this.screens[s]);
        }
        this.closeAll();
        location.hash = 'splash';
        this.openScreen('splash');
    }
    gameOver(txt) {
        this.screens.gameover.txt = txt;
        this.open('gameover');
    }
    open(screenID) {
        location.hash = screenID;
    }
    openScreen(screenID) {
        this.closeAll();
        this.currentPage = screenID;
        if (screenID == 'play')
            return;
        this.screens[screenID].show();
    }
    closeAll() {
        for (let s in this.screens) {
            this.screens[s].hide();
        }
    }
    back() {
        let prev;
        switch (this.currentPage) {
            case 'splash':
                console.log('back to where?');
                prev = 'splash';
                break;
            case 'controller':
                prev = 'splash';
                break;
            case 'setup':
                prev = 'controller';
                break;
            case 'gameover':
                prev = 'setup';
                break;
            case 'play':
                game.pause();
                break;
            default:
                prev = 'splash';
        }
        if (prev)
            this.open(prev);
    }
}
//# sourceMappingURL=ScreenManager.js.map