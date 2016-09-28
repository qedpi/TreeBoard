/* Drawable objects on canvas */

class Drawable {
    constructor() {
        // metadata
        this.timeCreated = new Date().getTime();    // utc time in seconds, exclude .getTime for proper time object
        this.user = 0;                              // todo: set by session id?
        this.session = 0;                           // todo: set by session id?
        this.branch = 0;                            // primary, todo: set by interaction
    }

    toString() {
        return `session ${this.session}, user ${this.user}, branch ${this.branch}, at ${this.timeCreated}, `;
    }
}

class Point extends Drawable {
    constructor(x, y) {
        super();

        // spatial
        this.x = x;
        this.y = y;
    }

    toString() {
        //let detatils = '(' + this.x + ', ' + this.y + ')' + ' ' + this.color;
        let details = `(${this.x}, ${this.y}), `;
        return super.toString() + details;
    }
}

class Circle extends Point {
    constructor(x, y, r, color) {
        super(x, y);

        // aesthetics
        this.r = r;                 // todo: allow using default radius, color
        this.color = color;
    }

    toString() {
        let details = `r: ${this.r}, color: ${this.color}, `;
        return super.toString() + details;
    }
}


/*
 class ColorPoint extends Point {
 constructor(x, y, color) {
 super(x, y);
 this.color = color;
 }
 toString() {
 return super.toString() + ' in ' + this.color;
 }
 }
 */

export default {Drawable, Point, Circle};