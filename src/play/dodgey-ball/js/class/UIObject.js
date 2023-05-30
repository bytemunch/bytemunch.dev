import { vec2 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
export class UIObject {
    constructor(o) {
        this.cz = Infinity;
        this.pos = o.pos;
        this.size = vec2.fromValues(48, 48);
    }
    update(t) {
    }
    draw(ctx) {
        game.cameraXY.project2D(this);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(this.projectedX, this.projectedY, this.size[0] * this.projectedScale, this.size[1] * this.projectedScale);
    }
}
//# sourceMappingURL=UIObject.js.map