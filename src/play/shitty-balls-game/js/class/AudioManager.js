export class AudioManager {
    constructor() {
        this.actx = new AudioContext;
        this.actx.resume();
        this.muted = false;
        this.buffers = {};
    }
    async init() {
        this.actx.resume();
        this.buffers['noise'] = new AudioBuffer({
            length: this.actx.sampleRate / 2,
            sampleRate: this.actx.sampleRate
        });
        var nowBuffering = this.buffers['noise'].getChannelData(0);
        for (var i = 0; i < this.buffers['noise'].length; i++) {
            nowBuffering[i] = Math.random() * 2 - 1;
        }
        this.buffers['fire'] = await this.actx.decodeAudioData(await (await fetch('sounds/shoot.wav')).arrayBuffer());
        this.buffers['bounce'] = await this.actx.decodeAudioData(await (await fetch('sounds/bounce.wav')).arrayBuffer());
        this.buffers['explosion'] = await this.actx.decodeAudioData(await (await fetch('sounds/explosion.wav')).arrayBuffer());
        this.buffers['explosion2'] = await this.actx.decodeAudioData(await (await fetch('sounds/explosion2.wav')).arrayBuffer());
        this.buffers['click'] = await this.actx.decodeAudioData(await (await fetch('sounds/click.wav')).arrayBuffer());
        this.buffers['coin'] = await this.actx.decodeAudioData(await (await fetch('sounds/coin.wav')).arrayBuffer());
        this.buffers['level'] = await this.actx.decodeAudioData(await (await fetch('sounds/level.wav')).arrayBuffer());
        this.buffers['lose'] = await this.actx.decodeAudioData(await (await fetch('sounds/lose.wav')).arrayBuffer());
        this.buffers['nope'] = await this.actx.decodeAudioData(await (await fetch('sounds/nope.wav')).arrayBuffer());
    }
    play(soundID) {
        if (this.muted)
            return;
        const source = this.actx.createBufferSource();
        source.buffer = this.buffers[soundID];
        source.connect(this.actx.destination);
        source.start();
    }
}
//# sourceMappingURL=AudioManager.js.map