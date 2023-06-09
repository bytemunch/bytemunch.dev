import { rs } from "../main.js";
import { prevFrameTime, timestep } from "./BallGame.js";
import { Vector } from "./Vector.js";
export class CashDrop {
    constructor(x, y, value) {
        this.lifespan = 1000;
        this.birth = prevFrameTime;
        this.dead = false;
        this.pos = new Vector({ x, y });
        this.value = value;
        this.offset = 0;
        if (this.value == 0) {
            this.dead = true;
            this.age = this.lifespan;
        }
    }
    die() {
        this.dead = true;
    }
    update() {
        this.age = prevFrameTime - this.birth;
        this.offset -= timestep * 0.1;
        if (this.age >= this.lifespan)
            this.die();
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(0,255,0,${1 - this.age / this.lifespan})`;
        ctx.font = `${rs(12)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`+$${this.value}`, rs(this.pos.x), rs(this.pos.y + this.offset));
    }
}
//# sourceMappingURL=CashDrop.js.map