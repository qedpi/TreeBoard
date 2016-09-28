import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Circle from './Drawable.js';       // todo: {Drawable, Point, Circle} doesn't work



//Canvas

const default_radius = 10;
const default_color = 'black';
const draw_modes = new Set(['Line', 'Circle']);

let draw_mode = 'Circle';

let renderedStrokes = [];
let undoStrokes = [];

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

        let dragging = false;

        context.lineWidth = radius * 2;

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
            canvas.addEventListener('mousedown', drawCircle);
        }
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
