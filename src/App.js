import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';


//Canvas

const default_radius = 10;


class Drawable {
    constructor() {
        //metadata
        this.timeCreated = new Date().getTime();    // utc time in seconds, exclude .getTime for proper time object
        this.user = 1;                              // todo: set by session id?
        this.session = 1;                           // todo: set by session id?
        this.branch = 0;                            // primary, todo: set by interaction
    }

    toString() {
        return `session: ${this.session}, user: ${this.user}, branch: ${this.branch}, at ${this.timeCreated}`;
    }
}

class Point extends Drawable {
    constructor(x, y) {
        super.constructor();

        //spatial
        this.x = x;
        this.y = y;

        //aesthetics
        this.r = default_radius;
        this.color = 'black';
    }
    toString() {
        //let detatils = '(' + this.x + ', ' + this.y + ')' + ' ' + this.color;
        let details = `(${this.x}, ${this.y}) ${this.color}`;
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

var renderedStrokes = [];
var undoStrokes = [];

function undo() {
    if (renderedStrokes.length > 0)
        undoStrokes.push(renderedStrokes.pop());
}

function redo() {
    if (undoStrokes.length > 0)
        renderedStrokes.push(undoStrokes.pop());
}


class App extends Component {
    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
      console.log('do something to update Canvas');
      const radius = 2;

      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');

      var dragging = false;

      context.lineWidth = radius * 2;

      var putPoint = e => {
        if (dragging) {
          //draw line from previous to current point
          context.lineTo(e.offsetX, e.offsetY);
          context.stroke();

          context.beginPath(); // move to new point
          context.moveTo(e.offsetX, e.offsetY);
        }
      };

      canvas.addEventListener('mousedown', () => dragging = true);
      canvas.addEventListener('mouseup', () => {
        dragging = false;
        context.beginPath();
      });
      canvas.addEventListener('mousemove', putPoint);

    }

    render() {
      const default_margin = 10;
      let width = window.innerWidth - default_margin * 2;
      let height = window.innerHeight - default_margin * 2;
        return (
            <canvas id="canvas" width={width} height={height}>Hello</canvas>
        );
    }
}

export default App;
