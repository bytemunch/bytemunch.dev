export class GamepadManager {
    constructor() {
        this.gamepads = [];
        console.log('Ready for gamepad...');
        window.addEventListener('gamepadconnected', this.connect.bind(this));
        window.addEventListener('gamepaddisconnected', this.disconnect.bind(this));
    }
    connect(e) {
        console.log('Gamepad %s connected!', e.gamepad.index);
    }
    disconnect(e) {
        console.log('Gamepad %s disconnected!', e.gamepad.index);
    }
    refreshStates() {
        this.gamepads = [...navigator.getGamepads()].filter(Boolean);
    }
}
//# sourceMappingURL=GamepadManager.js.map