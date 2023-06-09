import { game, rs, rs2 } from "../main.js";
import { Ball } from "./Ball.js";
import { audioMgr, lowerGameBound } from "./BallGame.js";
import { Vector } from "./Vector.js";
export class BallGun {
    constructor() {
        this.size = 60;
        this.pos = new Vector({ x: 160, y: lowerGameBound });
        this.target = new Vector({ a: Math.PI * 1.5, m: this.size / 2 });
        this.reloadSpeed = 60;
        this.reloadProgress = 60;
    }
    setTarget(x, y) {
        if (this.firing)
            return;
        this.target.setXY(rs2(x) - this.pos.x, rs2(y) - this.pos.y);
        this.target.setMag(this.size / 2);
        this.target.setAngle(this.fireAngle);
    }
    get fireAngle() {
        return Math.min(Math.max(this.target.a, Math.PI * 1.1), (Math.PI * 2 - Math.PI * 0.1));
    }
    get reloaded() {
        return this.reloadProgress >= this.reloadSpeed;
    }
    update() {
        if (!this.firing)
            this.reloadProgress++;
        if (this.reloadProgress > this.reloadSpeed)
            this.reloadProgress = this.reloadSpeed;
    }
    fire(ballArray, count, inMagazine) {
        if (!this.reloaded && !inMagazine)
            return;
        if (count <= 0)
            return;
        this.firing = true;
        this.reloadProgress = 0;
        if (game.ballBank.use(1)) {
            ballArray.push(new Ball({
                x: this.pos.x + this.target.x,
                y: this.pos.y + this.target.y,
                a: this.fireAngle
            }));
            audioMgr.play('fire');
        }
        else {
            this.firing = false;
            return;
        }
        if (count - 1 > 0) {
            game.queue(66, () => this.fire(ballArray, count - 1, true));
        }
        else {
            this.firing = false;
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = rs(1);
        ctx.beginPath();
        ctx.arc(rs(this.pos.x), rs(this.pos.y), rs(this.size / 2), Math.PI, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rs(this.pos.x + this.target.x), rs(this.pos.y + this.target.y), rs(this.size / 6), 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.lineWidth = rs(5);
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(rs(this.pos.x - this.size), rs(this.pos.y + this.size / 6));
        ctx.lineTo(rs(this.pos.x - this.size) + rs(this.size * 2) * (this.reloadProgress / this.reloadSpeed), rs(this.pos.y + this.size / 6));
        ctx.closePath();
        ctx.stroke();
    }
}
//# sourceMappingURL=BallGun.js.map