import { WorldActor } from "./WorldActor.js";
import { sprites, fElapsedTime, tileGrid, saveGame, LAYERNUMBERS } from "../main.js";
import { Item } from "./Item.js";
export const newAnimalFromJSON = JSONData => {
    switch (JSONData.type.split('-')[1]) {
        case 'chicken':
            return new Chicken([JSONData._x, JSONData._y]);
        default:
            console.error(JSONData.type, 'not found');
    }
};
export class Animal extends WorldActor {
    constructor() {
        super(...arguments);
        this.layer = LAYERNUMBERS.animal;
        this.target = [0, 0];
        this.state = 'roam';
        this.age = 0; //in frames
        this.lastBred = 0; //relative to age
        this.lastPoop = 0; //relative to age
        this.lastAte = 0; //relative to age
        this.poopTime = 5 * 60; //frames
        this.poopSize = 1;
        this.directionVec = [Math.random() - 0.5, Math.random() - 0.5];
        this.speed = 5;
    }
    roam() {
        if (this.age % (10 * 60) == 0) {
            this.directionVec = [(Math.random() - 0.5) * this.speed * fElapsedTime,
                (Math.random() - 0.5) * this.speed * fElapsedTime];
        }
        if (this.underfoot(this.nextPos(this.directionVec))?.type != 'grass') {
            this.directionVec = [(Math.random() - 0.5) * this.speed * fElapsedTime,
                (Math.random() - 0.5) * this.speed * fElapsedTime];
        }
        else {
            this._x += this.directionVec[0];
            this._y += this.directionVec[1];
        }
    }
    eat() {
        console.log('eating not implemented!');
    }
    poop() {
        let tile = this.underfoot(this.basePos);
        if (tile?.type == 'grass' && tile?.contents == null) {
            tileGrid[tile.gridX][tile.gridY].contents = new Item({
                gridPosition: { gridX: tile.gridX, gridY: tile.gridY },
                sprite: sprites[`poop-${this.poopSize}`],
                type: `poop`,
                level: this.poopSize
            });
            this.lastPoop = this.age;
            this.state = 'roam';
            saveGame();
        }
    }
    breed() {
        console.log('breeding not implemented!');
    }
    update() {
        this.age++;
        if (this.age % this.poopTime == 0)
            this.state = 'poop';
        switch (this.state) {
            case 'roam':
                this.roam();
                break;
            case 'poop':
                this.roam();
                this.poop();
                break;
        }
    }
    get basePos() {
        return [this.x + this.width / 2, this.y + this.height];
    }
    nextPos(velocity) {
        return [this.basePos[0] + velocity[0], this.basePos[1] + velocity[1]];
    }
    underfoot(position) {
        for (let gtile of tileGrid.flat()) {
            let tile = gtile.tile;
            if (tile.baseClass != 'tile')
                continue;
            if (tile.collides(position[0], position[1])) {
                return tile;
            }
        }
    }
}
export class Chicken extends Animal {
    constructor(position) {
        super({
            gridPosition: { gridX: 0, gridY: 0 },
            sprite: sprites['animal-chicken'],
            type: 'animal-chicken',
        });
        this.width = 32;
        this.height = 32;
        this._x = position[0];
        this._y = position[1];
        console.log(this);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzL0FuaW1hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVqQyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsRUFBRTtJQUN4QyxRQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2pDLEtBQUssU0FBUztZQUNWLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzlDO1lBQ0ksT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3BEO0FBQ0wsQ0FBQyxDQUFBO0FBRUQsTUFBTSxPQUFPLE1BQU8sU0FBUSxVQUFVO0lBQXRDOztRQUNJLFVBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQzVCLFdBQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQixVQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ2YsUUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFBLFdBQVc7UUFDbkIsYUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFBLGlCQUFpQjtRQUM5QixhQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUEsaUJBQWlCO1FBQzlCLFlBQU8sR0FBRyxDQUFDLENBQUMsQ0FBQSxpQkFBaUI7UUFFN0IsYUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQSxRQUFRO1FBQzFCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixpQkFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFMUQsVUFBSyxHQUFHLENBQUMsQ0FBQztJQXNFZCxDQUFDO0lBcEVHLElBQUk7UUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVk7Z0JBQ2hFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUM7U0FDNUQ7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFO1lBQ2xFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVk7Z0JBQ2hFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUM7U0FDNUQ7YUFBTTtZQUNNLElBQUksQ0FBQyxFQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsRUFBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0M7SUFDTCxDQUFDO0lBRUQsR0FBRztRQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksSUFBSSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNqRCxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDdEQsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3ZCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNwQixRQUFRLEVBQUUsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDdkQsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2hCLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU07U0FDYjtJQUNMLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN6RSxDQUFDO0lBRUQsU0FBUyxDQUFDLFFBQVE7UUFDZCxLQUFLLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3RCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNO2dCQUFFLFNBQVM7WUFDdkMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDekMsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBRUQsTUFBTSxPQUFPLE9BQVEsU0FBUSxNQUFNO0lBQy9CLFlBQVksUUFBMEI7UUFDbEMsS0FBSyxDQUFDO1lBQ0YsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUM7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtTQUN6QixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FDSiIsImZpbGUiOiJjbGFzcy9BbmltYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXb3JsZEFjdG9yIH0gZnJvbSBcIi4vV29ybGRBY3Rvci5qc1wiO1xuaW1wb3J0IHsgc3ByaXRlcywgZkVsYXBzZWRUaW1lLCB0aWxlR3JpZCwgc2F2ZUdhbWUsIExBWUVSTlVNQkVSUyB9IGZyb20gXCIuLi9tYWluLmpzXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vVGlsZS5qc1wiO1xuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL0l0ZW0uanNcIjtcblxuZXhwb3J0IGNvbnN0IG5ld0FuaW1hbEZyb21KU09OID0gSlNPTkRhdGEgPT4ge1xuICAgIHN3aXRjaCAoSlNPTkRhdGEudHlwZS5zcGxpdCgnLScpWzFdKSB7XG4gICAgICAgIGNhc2UgJ2NoaWNrZW4nOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGlja2VuKFtKU09ORGF0YS5feCwgSlNPTkRhdGEuX3ldKVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT05EYXRhLnR5cGUsJ25vdCBmb3VuZCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFuaW1hbCBleHRlbmRzIFdvcmxkQWN0b3Ige1xuICAgIGxheWVyID0gTEFZRVJOVU1CRVJTLmFuaW1hbDtcbiAgICB0YXJnZXQgPSBbMCwgMF07XG4gICAgc3RhdGUgPSAncm9hbSc7XG4gICAgYWdlID0gMDsvL2luIGZyYW1lc1xuICAgIGxhc3RCcmVkID0gMDsvL3JlbGF0aXZlIHRvIGFnZVxuICAgIGxhc3RQb29wID0gMDsvL3JlbGF0aXZlIHRvIGFnZVxuICAgIGxhc3RBdGUgPSAwOy8vcmVsYXRpdmUgdG8gYWdlXG5cbiAgICBwb29wVGltZSA9IDUgKiA2MDsvL2ZyYW1lc1xuICAgIHBvb3BTaXplID0gMTtcblxuICAgIGRpcmVjdGlvblZlYyA9IFtNYXRoLnJhbmRvbSgpIC0gMC41LCBNYXRoLnJhbmRvbSgpIC0gMC41XTtcblxuICAgIHNwZWVkID0gNTtcblxuICAgIHJvYW0oKSB7XG4gICAgICAgIGlmICh0aGlzLmFnZSAlICgxMCAqIDYwKSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvblZlYyA9IFsoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnNwZWVkICogZkVsYXBzZWRUaW1lXG4gICAgICAgICAgICAgICAgLCAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnNwZWVkICogZkVsYXBzZWRUaW1lXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy51bmRlcmZvb3QodGhpcy5uZXh0UG9zKHRoaXMuZGlyZWN0aW9uVmVjKSk/LnR5cGUgIT0gJ2dyYXNzJykge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25WZWMgPSBbKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5zcGVlZCAqIGZFbGFwc2VkVGltZVxuICAgICAgICAgICAgICAgICwgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5zcGVlZCAqIGZFbGFwc2VkVGltZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoPG51bWJlcj50aGlzLl94KSArPSB0aGlzLmRpcmVjdGlvblZlY1swXTtcbiAgICAgICAgICAgICg8bnVtYmVyPnRoaXMuX3kpICs9IHRoaXMuZGlyZWN0aW9uVmVjWzFdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZWF0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZWF0aW5nIG5vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIHBvb3AoKSB7XG4gICAgICAgIGxldCB0aWxlOiBUaWxlID0gdGhpcy51bmRlcmZvb3QodGhpcy5iYXNlUG9zKTtcbiAgICAgICAgaWYgKHRpbGU/LnR5cGUgPT0gJ2dyYXNzJyAmJiB0aWxlPy5jb250ZW50cyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aWxlR3JpZFt0aWxlLmdyaWRYXVt0aWxlLmdyaWRZXS5jb250ZW50cyA9IG5ldyBJdGVtKHtcbiAgICAgICAgICAgICAgICBncmlkUG9zaXRpb246IHsgZ3JpZFg6IHRpbGUuZ3JpZFgsIGdyaWRZOiB0aWxlLmdyaWRZIH0sXG4gICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzW2Bwb29wLSR7dGhpcy5wb29wU2l6ZX1gXSxcbiAgICAgICAgICAgICAgICB0eXBlOiBgcG9vcGAsXG4gICAgICAgICAgICAgICAgbGV2ZWw6IHRoaXMucG9vcFNpemVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9vcCA9IHRoaXMuYWdlO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdyb2FtJztcbiAgICAgICAgICAgIHNhdmVHYW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBicmVlZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2JyZWVkaW5nIG5vdCBpbXBsZW1lbnRlZCEnKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuYWdlKys7XG4gICAgICAgIGlmICh0aGlzLmFnZSAlIHRoaXMucG9vcFRpbWUgPT0gMCkgdGhpcy5zdGF0ZSA9ICdwb29wJztcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICdyb2FtJzpcbiAgICAgICAgICAgICAgICB0aGlzLnJvYW0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvb3AnOlxuICAgICAgICAgICAgICAgIHRoaXMucm9hbSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucG9vcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGJhc2VQb3MoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0XTtcbiAgICB9XG5cbiAgICBuZXh0UG9zKHZlbG9jaXR5KSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5iYXNlUG9zWzBdICsgdmVsb2NpdHlbMF0sIHRoaXMuYmFzZVBvc1sxXSArIHZlbG9jaXR5WzFdXVxuICAgIH1cblxuICAgIHVuZGVyZm9vdChwb3NpdGlvbikge1xuICAgICAgICBmb3IgKGxldCBndGlsZSBvZiB0aWxlR3JpZC5mbGF0KCkpIHtcbiAgICAgICAgICAgIGxldCB0aWxlID0gZ3RpbGUudGlsZTtcbiAgICAgICAgICAgIGlmICh0aWxlLmJhc2VDbGFzcyAhPSAndGlsZScpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRpbGUuY29sbGlkZXMocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hpY2tlbiBleHRlbmRzIEFuaW1hbCB7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0pIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uOiB7IGdyaWRYOiAwLCBncmlkWTogMCB9LFxuICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzWydhbmltYWwtY2hpY2tlbiddLFxuICAgICAgICAgICAgdHlwZTogJ2FuaW1hbC1jaGlja2VuJyxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLndpZHRoID0gMzI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMzI7XG5cbiAgICAgICAgdGhpcy5feCA9IHBvc2l0aW9uWzBdO1xuICAgICAgICB0aGlzLl95ID0gcG9zaXRpb25bMV07XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgfVxufSJdfQ==
