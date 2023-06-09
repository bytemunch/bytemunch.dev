import { game } from "../main.js";
export class Camera {
    constructor(cnv) {
        this.cnv = cnv;
    }
    update(sr) {
        this.perspective = (game.playfield.width) * 0.8;
        this.projectionCx = (game.playfield.width / 2) * sr;
        this.projectionCy = (game.playfield.height / 4) * sr;
        this.camZ = 320;
        this.sr = sr;
    }
    project(o) {
        o.projectedScale = (this.perspective / (this.perspective + o.z + this.camZ + o.depth / 2)) * this.sr;
        o.projectedX = ((o.x * o.projectedScale) + this.projectionCx);
        o.projectedY = ((o.y * o.projectedScale) + this.projectionCy);
    }
    vProject(vector) {
        const projScale = (this.perspective / (this.perspective + vector[2] + this.camZ)) * this.sr;
        return {
            size: projScale,
            x: (vector[0] * projScale + this.projectionCx),
            y: (vector[1] * projScale + this.projectionCy)
        };
    }
}
//# sourceMappingURL=Camera.js.map