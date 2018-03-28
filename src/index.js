import Veda from 'vedajs';
import 'babel-polyfill';

import CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

import shader from './shader.frag';

const $ = s => document.querySelector(s);

// Setup Veda
const canvas = $('#canvas');
const veda = new Veda(canvas);
veda.setCanvas(canvas);
veda.loadFragmentShader(shader);
veda.setPixelRatio(1);
veda.setFrameskip(1);
veda.play();

// Setup resize event
const $width = $('#width');
const $height = $('#height');
const resize = () => {
  const width = $width.value;
  const height = $height.value;
  canvas.width = width;
  canvas.height = height;
  veda.resize(width, height);
};
$width.addEventListener('change', resize);
$height.addEventListener('change', resize);

// Setup textarea
const $t = $('#textarea');
$t.value = shader;
const editor = CodeMirror.fromTextArea($t, {
  mode: 'clike',
  lineNumbers: true,
  indentUnit: 4,
});
editor.on('change', (change) => {
  editor.save();
  veda.loadFragmentShader($t.value);
});

// Capture the canvas
const capture = (format) => {
  const framerate = $('#fps').value;
  const timeLimit = $('#length').value;
  const workersPath = './';
  const cap = new CCapture({ format, framerate, timeLimit, workersPath });
  cap.start();

  const start = Date.now() / 1000;

  const frame = () => {
    const now = Date.now() / 1000;
    if (now - start <= timeLimit) {
      requestAnimationFrame(frame);
      veda.play();
      cap.capture(canvas);
      veda.stop();

    }
    else {
      try {
        cap.stop();
        cap.save();
      } catch (e) {
        console.error(e);
      }
      veda.play();
    }
  }

  frame();
}

$('#webm').addEventListener('click', () => capture('webm'));
$('#gif').addEventListener('click', () => capture('gif'));
