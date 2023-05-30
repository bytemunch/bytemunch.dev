import { game } from "../main.js";
import { UIObject } from "./UIObject.js";
export class Scoreboard extends UIObject {
    constructor(o) {
        super(o);
        this.team = o.team;
    }
    get score() {
        return game.scores[this.team];
    }
    draw(ctx) {
        game.cameraXY.project2D(this);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(this.projectedX, this.projectedY, this.size[0] * this.projectedScale, this.size[1] * this.projectedScale);
        ctx.fillStyle = '#ffffff';
        ctx.font = `${32 * this.projectedScale}px monospace`;
        ctx.fillText(this.score.toString(), this.projectedX + this.size[0] * .25 * this.projectedScale, this.projectedY + this.size[1] * .75 * this.projectedScale);
    }
}
//# sourceMappingURL=Scoreboard.js.map