import { saveGame, changeTool } from '../main.js';
export class Tool {
    constructor() {
        this.uses = 0;
    }
    act(x, y) {
        if (this.uses <= 0) {
            this.uses = 0;
            changeTool('hand');
            return false;
        }
        this.uses--;
        saveGame();
        return true;
    }
    addUses(n) {
        this.uses += n;
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzL1Rvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEQsTUFBTSxPQUFPLElBQUk7SUFBakI7UUFFSSxTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBa0JyQixDQUFDO0lBZkcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ0osSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNkLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVaLFFBQVEsRUFBRSxDQUFDO1FBQ1gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFDO1FBQ0wsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQztDQUNKIiwiZmlsZSI6ImNsYXNzL1Rvb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL1Nwcml0ZS5qcyc7XG5pbXBvcnQgeyBzYXZlR2FtZSwgY2hhbmdlVG9vbCB9IGZyb20gJy4uL21haW4uanMnO1xuXG5leHBvcnQgY2xhc3MgVG9vbCB7XG4gICAgaW1nOiBTcHJpdGU7XG4gICAgdXNlczogbnVtYmVyID0gMDtcbiAgICB0eXBlOiBzdHJpbmc7XG5cbiAgICBhY3QoeCwgeSkge1xuICAgICAgICBpZiAodGhpcy51c2VzIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMudXNlcyA9IDA7XG4gICAgICAgICAgICBjaGFuZ2VUb29sKCdoYW5kJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2VzLS07XG5cbiAgICAgICAgc2F2ZUdhbWUoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkVXNlcyhuKSB7XG4gICAgICAgIHRoaXMudXNlcyArPSBuO1xuICAgIH1cbn1cbiJdfQ==
