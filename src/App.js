import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

import {Drawable, Point, Circle, Pair, Stroke} from './Drawable.js';

/*  todo: module import not working, new Circle -> Uncaught TypeError: _Drawable.Circle is not a constructor
import Circle from './Drawable.js';       // todo: {Drawable, Point, Circle} doesn't work
import Point from './Drawable.js';
import Drawable from './Drawable.js';
*/


// Tools
const zip = rows => rows[0].map((_,c)=>rows.map(row=>row[c]));

// Canvas

const default_radius = 10;
const default_color = 'black';
const background_color = 'antiquewhite';
const line_default_radius = 5;
const eraser_default_radius = 80;

const sample_rate = 1;                              // 1 in n points stored in a stroke, for efficiency
                                                    // 5 is still noticeable
const sample_min_dist = Math.ceil(line_default_radius / 20);                          // todo: find a good value, also sample_rate might not be useful, if dist can always be used instead

const draw_modes = new Set(['Line', 'Circle', 'Erase']);

let draw_mode = 'Line';

let renderedStrokes = [];
let undoStrokes = [];

let strokeBuffer = [];      // list of points


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

        const infPair = new Pair(-1000, -1000);

        context.lineWidth = radius * 2;

        const pairDist = (P, Q) => {
            let dx = P.x - Q.x, dy = P.y - Q.y;
            return Math.sqrt(dx * dx + dy * dy);
        };


        const samplePoints = (Pts) => {
            let sampled = [];
            let referencePt = infPair;
            Pts.forEach( (Pt, i, _) => {            // take only every nth point, and if its far enough away from previous point
                if (i % sample_rate === 0) {
                    if (pairDist(Pt, referencePt) >= sample_min_dist) {
                        sampled.push(Pt);
                        referencePt = Pt;
                    }
                }
            });
            return sampled;
        };

        const clearCanvas = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        const drawPath = e => {
            if (dragging) {
                let x = e.offsetX, y = e.offsetY;
                //draw line from previous to current point
                // offset is relative to object, whereas clientX -> window
                context.lineTo(x, y);
                context.stroke();

                context.beginPath(); // move to new point
                context.moveTo(x, y);

                strokeBuffer.push(new Pair(x, y));
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

        // todo: generalize into push drawable
        const pushCircle = e => {
            renderedStrokes.push(new Circle(e.offsetX, e.offsetY, radius * 10, 'black'));
            console.log(renderedStrokes.map(x => x.toString()));
            drawCircle(e);
            undoStrokes.length = 0;  // clears redo buffer

            undoButton.className = 'undo action-possible';
        };

        const undo = () => {
            if (renderedStrokes.length > 0)
                undoStrokes.push(renderedStrokes.pop());
        };

        const redo = () => {
            if (undoStrokes.length > 0)
                renderedStrokes.push(undoStrokes.pop());
        };

        const drawStackLine = S => {
            let points = S.pairs;
            context.beginPath();

            points.map( P => {
                let x = P.x, y = P.y;
                context.lineTo(x, y);
                context.stroke();

                context.beginPath(); // move to new point
                context.moveTo(x, y);
            });
            context.beginPath();    // ends path
        };



        const renderStack = () => {
            renderedStrokes.map(S => {
                if (S.type === 'Circle') {
                    drawStackCircle(S)
                } else {
                    drawStackLine(S)
                }
            });
        };

        const undoStroke = () => {
            clearCanvas();
            undo();
            renderStack();
        };

        const redoStroke = () => {
            redo();
            let last = renderedStrokes[renderedStrokes.length - 1];
            let type = last.type;

            if (type === 'Circle') {
                drawStackCircle(last);      // todo: if i render the whole stack, would react optimize it away?
            } else {
                drawStackLine(last);
            }
        };

        const trashAll = () => {
            renderedStrokes.length = 0;
            undoStrokes.length = 0;
            clearCanvas();
        };

        const removeListeners = () => {                                 // todo: dont use, refreshes whole canvas
            let new_canvas = canvas.cloneNode(true);
            canvas.parentNode.replaceChild(new_canvas, canvas);
        };

        const lineButton = document.getElementById('line-mode');
        const circleButton = document.getElementById('circle-mode');
        const eraseButton = document.getElementById('erase-mode');

        const undoButton = document.getElementById('undo');
        const redoButton = document.getElementById('redo');
        const trashButton = document.getElementById('trash');

        lineButton.addEventListener('click', () => {
            draw_mode = 'Line';
            this.updateCanvas()
        });
        circleButton.addEventListener('click', () => {
            draw_mode = 'Circle';
            this.updateCanvas()
        });
        eraseButton.addEventListener('click', () => {
            draw_mode = 'Erase';
            this.updateCanvas()
        });
        undoButton.addEventListener('click', undoStroke);
        redoButton.addEventListener('click', redoStroke);
        trashButton.addEventListener('click', trashAll);

        // todo: refactor into map notation if too many cases
        if (draw_mode === 'Line' || draw_mode === 'Erase') {

            if (draw_mode === 'Erase') {
                context.strokeStyle = background_color;
                context.lineWidth = eraser_default_radius;
            } else {
                context.strokeStyle = default_color;
                context.lineWidth = line_default_radius;
            }

            canvas.addEventListener('mousedown', () => dragging = true);
            canvas.addEventListener('mouseup', () => {
                dragging = false;
                context.beginPath();
                renderedStrokes.push(new Stroke(samplePoints(strokeBuffer)));     // add stroke to rendered
                //console.log('before sample', (new Stroke(strokeBuffer)).toString());
                //console.log('after sample', (new Stroke(samplePoints(strokeBuffer))).toString());
                console.log(renderedStrokes.map(x => x.toString()));

                strokeBuffer.length = 0;                            // reset points stored
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

        const tool_ids = ['line-mode', 'circle-mode', 'erase-mode', 'undo', 'redo', 'trash'];
        const tool_icons = ['pencil', 'circle-o', 'eraser', 'undo', 'repeat', 'trash-o'];
        /*const tool_listeners = [() => draw_mode = 'Line', () => draw_mode = 'Circle', () => draw_mode = 'Erase',
                                undoStroke, redoStroke, trashAll];*/
        const tools = zip([tool_ids, tool_icons/*, tool_listeners*/]);

        let tool_LIs = tools.map( (tool, i) => {
            return <li><a key={'tool_' + i} id={tool[0]}><i className={'fa fa-' + tool[1]}>|</i></a></li>;
        });

        console.log(tool_LIs);

        let navbar =
            (<nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand">Whiteboard</a></div>
                    <ul className="nav navbar-nav">{tool_LIs}</ul></div></nav>);

        return (
            <div>
                {navbar}
                <canvas id="canvas" width={width} height={height}>Your browser does not support Canvas</canvas></div>
        );
    }
}

export default App;
