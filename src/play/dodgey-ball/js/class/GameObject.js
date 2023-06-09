import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
export class GameObject {
    constructor(o) {
        this.is = 'gameobject';
        this.toBeRemoved = false;
        this.pos = vec3.fromValues(o.x, o.y, o.z);
        this.vel = vec3.create();
        this.acc = vec3.create();
        this.size = vec3.fromValues(o.width, o.height, o.depth);
        this.maxSpeed = Infinity;
        this.color = '#FF00FF';
        this.affectedByPhysics = true;
    }
    get grounded() {
        return this.bottom >= game.playfield.floor;
    }
    applyForce(f) {
        vec3.add(this.acc, this.acc, f);
    }
    update(t) {
        if (this.affectedByPhysics) {
            this.applyForce(game.gravity);
            if (this.grounded) {
                const friction = vec3.clone(this.vel);
                vec3.normalize(friction, friction);
                vec3.scale(friction, friction, -1);
                vec3.scale(friction, friction, 0.5);
                this.applyForce(friction);
            }
            const sAcc = vec3.clone(this.acc);
            vec3.scale(sAcc, this.acc, game.timestep);
            vec3.add(this.vel, this.vel, sAcc);
            if (vec3.distance([0, 0, 0], this.vel) > this.maxSpeed) {
                vec3.normalize(this.vel, this.vel);
                vec3.scale(this.vel, this.vel, this.maxSpeed);
            }
            const sVel = vec3.clone(this.vel);
            vec3.scale(sVel, this.vel, game.timestep);
            vec3.add(this.pos, this.pos, sVel);
            vec3.zero(this.acc);
            this.setInPlayfieldBounds();
        }
    }
    setInPlayfieldBounds() {
        if (this.right > game.playfield.x + game.playfield.width) {
            this.pos[0] = game.playfield.x + game.playfield.width - this.width;
        }
        if (this.left < game.playfield.x) {
            this.pos[0] = game.playfield.x;
        }
        if (this.bottom > game.playfield.y + game.playfield.height) {
            this.pos[1] = game.playfield.y + game.playfield.height - this.height;
        }
        if (this.top < game.playfield.y) {
            this.pos[1] = game.playfield.y;
        }
        if (this.back > game.playfield.z + game.playfield.depth) {
            this.pos[2] = game.playfield.z + game.playfield.depth - this.depth;
        }
        if (this.front < game.playfield.z) {
            this.pos[2] = game.playfield.z;
        }
    }
    get x() {
        return this.pos[0];
    }
    get y() {
        return this.pos[1];
    }
    get z() {
        return this.pos[2];
    }
    get width() {
        return this.size[0];
    }
    get height() {
        return this.size[1];
    }
    get depth() {
        return this.size[2];
    }
    get cx() {
        return this.pos[0] + this.width / 2;
    }
    get cy() {
        return this.pos[1] + this.height / 2;
    }
    get cz() {
        return this.pos[2] + this.depth / 2;
    }
    get top() {
        return this.y;
    }
    get bottom() {
        return this.y + this.height;
    }
    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get front() {
        return this.z;
    }
    get back() {
        return this.z + this.depth;
    }
    get center() {
        return vec3.fromValues(this.cx, this.cy, this.cz);
    }
    draw(ctx) {
        game.camera.project(this);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.projectedX, this.projectedY, this.width * this.projectedScale, this.height * this.projectedScale);
    }
}
//# sourceMappingURL=GameObject.js.map