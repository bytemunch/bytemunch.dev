import { game, nc, rs } from "../main.js";
import { Vector } from "./Vector.js";
import { CashDrop } from "./CashDrop.js";
import { BallDrop } from "./BallDrop.js";
import { Particle } from "./Particle.js";
import { audioMgr } from "./BallGame.js";
export class Block {
    constructor(o) {
        if (!o.sizeScale)
            o.sizeScale = 1;
        this.pos = new Vector({ x: o.x, y: o.y });
        this.width = 30 * o.sizeScale;
        this.height = 30 * o.sizeScale;
        this.health = typeof o.health == 'bigint' ? o.health : BigInt(o.health);
        this.value = this.health;
        this.collisionSides = {
            left: true,
            top: true,
            right: true,
            bottom: true
        };
    }
    get left() {
        return this.pos.x;
    }
    get right() {
        return this.pos.x + this.width;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.pos.y + this.height;
    }
    get cx() {
        return this.pos.x + this.width / 2;
    }
    get cy() {
        return this.pos.y + this.height / 2;
    }
    collides(b) {
        if (b == this)
            return;
        if (this.left == b.right && this.top == b.top)
            this.collisionSides.right = false;
        if (this.top == b.bottom && this.left == b.left)
            this.collisionSides.bottom = false;
        if (this.right == b.left && this.top == b.top)
            this.collisionSides.left = false;
        if (this.bottom == b.top && this.left == b.left)
            this.collisionSides.top = false;
    }
    update() {
        this.collisionSides = {
            left: true,
            top: true,
            right: true,
            bottom: true
        };
        for (let b of game.blocks) {
            this.collides(b);
        }
    }
    die() {
        if (this.value == 0n)
            return;
        let ballDrop = 5n + this.value / 4n;
        game.ballBank.add(ballDrop);
        game.interfaces.push(new BallDrop(this.pos.x + this.width / 2, this.pos.y + this.height / 2, ballDrop));
        let cashDrop = (this.value * 10n) / 2n;
        game.cashBank.add(cashDrop);
        game.interfaces.push(new CashDrop(this.pos.x + this.width / 2, this.pos.y + this.height, cashDrop));
        for (let i = 0; i < this.width; i++) {
            game.particles.push(new Particle({ x: this.cx, y: this.cy }));
        }
        audioMgr.play('explosion');
    }
    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 1;
        ctx.strokeRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
        ctx.fillStyle = '#696969';
        ctx.textAlign = 'center';
        ctx.font = `${rs(12)}px Arial`;
        let txSize = ctx.measureText(this.health.toString());
        ctx.fillText(nc(this.health), rs(this.pos.x + this.width / 2), rs(this.pos.y + this.height / 2) + txSize.actualBoundingBoxAscent / 2);
    }
}
//# sourceMappingURL=Block.js.map