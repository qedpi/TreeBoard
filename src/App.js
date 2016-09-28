import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

/*  todo: module import not working, new Circle -> Uncaught TypeError: _Drawable.Circle is not a constructor
import Circle from './Drawable.js';       // todo: {Drawable, Point, Circle} doesn't work
import Point from './Drawable.js';
import Drawable from './Drawable.js';
*/

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


//Canvas

const default_radius = 10;
const default_color = 'black';
const draw_modes = new Set(['Line', 'Circle']);

let draw_mode = 'Circle';

let renderedStrokes = [];
let undoStrokes = [];


class App extends Component {
    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        console.log('do something to update Canvas');
        const radius = 2;

        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        let dragging = false;

        context.lineWidth = radius * 2;

        const clearCanvas = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        const drawPath = e => {
            if (dragging) {
                //draw line from previous to current point
                // offset is relative to object, whereas clientX -> window
                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();

                context.beginPath(); // move to new point
                context.moveTo(e.offsetX, e.offsetY);
            }
        };

        const drawCircle = e => {
            context.beginPath();
            context.arc(e.offsetX, e.offsetY, radius * 10, 0, Math.PI * 2);
            context.fill();
        };

        const drawStackCircle = (C) => {
            context.beginPath();
            context.arc(C.x, C.y, radius * 10, 0, Math.PI * 2);
            context.fill();
        };

        // todo: generalize into general push
        const pushCircle = e => {
            renderedStrokes.push(new Circle(e.offsetX, e.offsetY, radius * 10, 'black'));
            console.log(renderedStrokes.map(x => x.toString()));
            drawCircle(e);
            undoStrokes.length = 0;  // clears redo buffer
        };

        const undo = () => {
            if (renderedStrokes.length > 0)
                console.log('undo');
                undoStrokes.push(renderedStrokes.pop());
        };

        const redo = () => {
            if (undoStrokes.length > 0)
                renderedStrokes.push(undoStrokes.pop());
        };

        const renderStack = e => {
            renderedStrokes.map(drawStackCircle);
        };

        const undoStroke = () => {
            clearCanvas();
            undo();
            renderStack();
        };

        const undoButton = document.getElementById('undo');
        const redoButton = document.getElementById('redo');

        undoButton.addEventListener('click', undoStroke);

        // todo: refactor into map notation if too many cases
        if (draw_mode === 'Line') {
            canvas.addEventListener('mousedown', () => dragging = true);
            canvas.addEventListener('mouseup', () => {
                dragging = false;
                context.beginPath();
            });
            canvas.addEventListener('mousemove', drawPath);
        } else if (draw_mode === 'Circle') {
            console.log('circle mode');
            canvas.addEventListener('mousedown', pushCircle);
        }
    }

    render() {
        const default_margin = 10;
        const navbar_height = 40;       // todo: fix this guestimate
        let width = window.innerWidth - default_margin * 2;
        let height = window.innerHeight - default_margin * 2 - navbar_height;

        return (
            <canvas id="canvas" width={width} height={height}>Hello</canvas>
        );
    }
}

export default App;
