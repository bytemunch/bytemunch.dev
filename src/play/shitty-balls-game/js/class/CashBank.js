import { game, nc2, rs, rs2 } from "../main.js";
import { audioMgr } from "./BallGame.js";
import { Vector } from "./Vector.js";
export class CashBank {
    constructor(o) {
        this.pos = new Vector({ x: o.x, y: game.naturalGameBB.interfaceTop + 6 });
        this.width = 48;
        this.height = 48;
        this.count = 0n;
    }
    update() {
    }
    pointCollides(x, y) {
        x = rs2(x);
        y = rs2(y);
        return (x > this.pos.x && x < this.pos.x + this.width &&
            y > this.pos.y && y < this.pos.y + this.height);
    }
    click() {
        game.pause();
    }
    use(amt) {
        if (typeof amt == 'number')
            amt = BigInt(Math.floor(amt));
        if (this.count - amt < 0) {
            audioMgr.play('nope');
            return false;
        }
        this.count = this.count - amt;
        audioMgr.play('coin');
        return true;
    }
    add(amt) {
        if (typeof amt == 'number')
            amt = BigInt(Math.floor(amt));
        this.count += amt;
    }
    draw(ctx) {
        ctx.fillStyle = this.count > 0 ? '#242424' : '#ff2424';
        ctx.strokeStyle = '#696969';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText('$' + nc2(this.count), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.4));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${rs(12)}px Arial`;
        ctx.fillText('Pause', rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height * 0.7));
    }
}
//# sourceMappingURL=CashBank.js.map