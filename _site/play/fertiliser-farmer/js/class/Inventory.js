export class Inventory {
    constructor() {
        this.contents = {};
    }
    addItem(item) {
        this.addByTypeAndLevel(item.type, item.level);
    }
    removeItem(item) {
        this.removeByTypeAndLevel(item.type, item.level);
    }
    addByTypeAndLevel(type, level) {
        let typeStr = type + '-' + level;
        if (!this.contents[typeStr])
            this.contents[typeStr] = 0;
        this.contents[typeStr]++;
    }
    removeByTypeAndLevel(type, level) {
        let typeStr = type + '-' + level;
        if (!this.contents[typeStr])
            this.contents[typeStr] = 0;
        this.contents[typeStr]--;
        if (this.contents[typeStr] <= 0)
            delete this.contents[typeStr];
    }
    toJSON() {
        return this.contents;
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLE9BQU8sU0FBUztJQUF0QjtRQUNJLGFBQVEsR0FBdUIsRUFBRSxDQUFDO0lBNkJ0QyxDQUFDO0lBM0JHLE9BQU8sQ0FBQyxJQUFVO1FBQ2QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxVQUFVLENBQUMsSUFBVTtRQUNqQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLO1FBQ3pCLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELG9CQUFvQixDQUFDLElBQUksRUFBRSxLQUFLO1FBQzVCLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDM0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7Q0FDSiIsImZpbGUiOiJjbGFzcy9JbnZlbnRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi9JdGVtLmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBJSW52ZW50b3J5Q29udGVudHMge1xuICAgIFtpdGVtVHlwZUFuZExldmVsOiBzdHJpbmddOiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIEludmVudG9yeSB7XG4gICAgY29udGVudHM6IElJbnZlbnRvcnlDb250ZW50cyA9IHt9O1xuXG4gICAgYWRkSXRlbShpdGVtOiBJdGVtKSB7XG4gICAgICAgIHRoaXMuYWRkQnlUeXBlQW5kTGV2ZWwoaXRlbS50eXBlLCBpdGVtLmxldmVsKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGl0ZW06IEl0ZW0pIHtcbiAgICAgICAgdGhpcy5yZW1vdmVCeVR5cGVBbmRMZXZlbChpdGVtLnR5cGUsIGl0ZW0ubGV2ZWwpO1xuICAgIH1cblxuICAgIGFkZEJ5VHlwZUFuZExldmVsKHR5cGUsIGxldmVsKSB7XG4gICAgICAgIGxldCB0eXBlU3RyID0gdHlwZSArICctJyArIGxldmVsO1xuICAgICAgICBpZiAoIXRoaXMuY29udGVudHNbdHlwZVN0cl0pXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzW3R5cGVTdHJdID0gMDtcbiAgICAgICAgdGhpcy5jb250ZW50c1t0eXBlU3RyXSsrO1xuICAgIH1cblxuICAgIHJlbW92ZUJ5VHlwZUFuZExldmVsKHR5cGUsIGxldmVsKSB7XG4gICAgICAgIGxldCB0eXBlU3RyID0gdHlwZSArICctJyArIGxldmVsO1xuICAgICAgICBpZiAoIXRoaXMuY29udGVudHNbdHlwZVN0cl0pXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzW3R5cGVTdHJdID0gMDtcbiAgICAgICAgdGhpcy5jb250ZW50c1t0eXBlU3RyXS0tO1xuICAgICAgICBpZiAodGhpcy5jb250ZW50c1t0eXBlU3RyXSA8PSAwKVxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29udGVudHNbdHlwZVN0cl07XG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50cztcbiAgICB9XG59XG4iXX0=
