import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';


//Canvas
const default_margin = 10;
const radius = 2;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var dragging = false;

width = window.innerWidth - default_margin * 2;
height = window.innerHeight - default_margin * 2;

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

class App extends Component {
    componentDidMount() {
        this.updateCanvas;
    },

    updateCanvas() {
        const
    },

    render() {
        return (
            <canvas id="canvas" width={width} height={height}>Hello</canvas>
        );
    }
}

export default App;
