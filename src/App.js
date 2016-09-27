import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';


//Canvas

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
