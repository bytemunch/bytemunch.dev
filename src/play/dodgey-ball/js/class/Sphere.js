import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
export class Sphere extends GameObject {
    constructor(o) {
        super(Object.assign(Object.assign({}, o), { depth: o.r * 2, height: o.r * 2, width: o.r * 2 }));
        this.is = 'sphere';
        this.thrownBy = 404;
        this.restingFrames = 0;
        this.r = o.r;
        this.color = `#0000FF`;
    }
    get atRest() {
        const restThreshold = 1.1;
        const restTime = 10;
        if (Math.abs(this.vel[0]) < restThreshold &&
            Math.abs(this.vel[1]) < restThreshold &&
            Math.abs(this.vel[2]) < restThreshold) {
            this.restingFrames++;
        }
        return this.restingFrames > restTime;
    }
    get nextPos() {
        return vec3.add([], this.pos, this.vel);
    }
    collideWithObject(o) {
        if (o == this)
            return;
        let collision = vec3.subtract([], this.pos, o.pos);
        let dist = vec3.length(collision);
        if (dist == 0) {
            collision = vec3.fromValues(1, 0, 0);
            dist = 1;
        }
        if (dist > this.r * 2)
            return;
        this.resolveCollision(o);
    }
    resolveCollision(o) {
        let collision = vec3.subtract([], this.center, o.center);
        vec3.add(this.pos, this.pos, vec3.scale([], collision, 0.25));
        vec3.normalize(collision, collision);
        let aci = vec3.dot(collision, this.vel);
        let bci = vec3.dot(collision, o.vel);
        let acf = bci;
        let bcf = aci;
        vec3.add(this.vel, this.vel, (vec3.scale([], collision, (acf - aci))));
        vec3.add(o.vel, o.vel, (vec3.scale([], collision, (bcf - bci))));
    }
    update() {
        this.collidedThisFrame = false;
        this.colliders = {
            left: vec3.add([], this.vel, vec3.add([], this.pos, [-this.r, 0, 0])),
            right: vec3.add([], this.vel, vec3.add([], this.pos, [this.r, 0, 0])),
            top: vec3.add([], this.vel, vec3.add([], this.pos, [0, -this.r, 0])),
            bottom: vec3.add([], this.vel, vec3.add([], this.pos, [0, this.r, 0])),
            back: vec3.add([], this.vel, vec3.add([], this.pos, [0, 0, -this.r])),
            front: vec3.add([], this.vel, vec3.add([], this.pos, [0, 0, this.r])),
        };
        this.checkPlayfieldCollision();
        this.checkPlayerCollision(game.gameObjects.filter(o => o.is == 'player')[0]);
        this.checkPlayerCollision(game.gameObjects.filter(o => o.is == 'player')[1]);
        if (this.atRest)
            this.thrownBy = 404;
        super.update();
    }
    checkPlayerCollision(p) {
        if (this.x > p.x && this.x < p.x + p.width
            && this.y > p.y && this.y < p.y + p.height
            && this.z > p.z && this.z < p.z + p.depth) {
            if (this.thrownBy != 404)
                p.hit(this);
            this.resolveCollision(p);
        }
    }
    checkPlayfieldCollision() {
        const playfieldPlanes = {
            left: (v) => {
                return (v[0] <= game.playfield.x);
            },
            right: (v) => {
                return v[0] >= game.playfield.x + game.playfield.width;
            },
            top: (v) => {
                return v[1] <= game.playfield.y;
            },
            bottom: (v) => {
                return v[1] >= game.playfield.y + game.playfield.height;
            },
            back: (v) => {
                return v[2] <= game.playfield.z;
            },
            front: (v) => {
                return v[2] >= game.playfield.z + game.playfield.depth;
            },
        };
        if (playfieldPlanes.left(this.colliders.left) || playfieldPlanes.right(this.colliders.right)) {
            this.bounce(0);
        }
        if (playfieldPlanes.top(this.colliders.top) || playfieldPlanes.bottom(this.colliders.bottom)) {
            this.bounce(1);
        }
        if (playfieldPlanes.back(this.colliders.back) || playfieldPlanes.front(this.colliders.front)) {
            this.bounce(2);
        }
    }
    setInPlayfieldBounds() {
        if (this.cx > game.playfield.x + game.playfield.width) {
            this.pos[0] = game.playfield.x + game.playfield.width - this.width / 2;
        }
        if (this.cx < game.playfield.x + this.width) {
            this.pos[0] = game.playfield.x + this.width - this.width / 2;
        }
        if (this.cy > game.playfield.y + game.playfield.height) {
            this.pos[1] = game.playfield.y + game.playfield.height - this.height / 2;
        }
        if (this.cy < game.playfield.y) {
            this.pos[1] = game.playfield.y - this.height / 2;
        }
        if (this.cz > game.playfield.z + game.playfield.depth) {
            this.pos[2] = game.playfield.z + game.playfield.depth - this.depth / 2;
        }
        if (this.cz < game.playfield.z + this.width) {
            this.pos[2] = game.playfield.z + this.width - this.depth / 2;
        }
    }
    bounce(axis) {
        const restitution = 0.5;
        this.vel[axis] *= -restitution;
    }
    draw(ctx) {
        game.camera.project(this);
        ctx.fillStyle = this.color;
        switch (this.thrownBy) {
            case 0:
                ctx.fillStyle = '#FFFF00';
                break;
            case 1:
                ctx.fillStyle = '#00FFFF';
                break;
        }
        if (this.atRest)
            ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(this.projectedX, this.projectedY, this.projectedScale * this.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}
//# sourceMappingURL=Sphere.js.map