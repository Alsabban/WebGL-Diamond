const canvas = document.querySelector('canvas');
const drawing = canvas.getContext('webgl');

if (!drawing) {
    throw new Error('WebGL not supported');
}


const vertexData = [
    0, 1, 0,    // V1.position
    0.5, 0, 0,   // V2.position
    -0.5, 0, 0,  // V3.position
    0, -1, 0     //V4.position
];

const colorData = [
    0, 0.7, 0.7,    // V1.color
    0, 1, 0,    // V2.color
    1, 0, 0, // V3.color
    0.5, 0.5, 0  //V4.color
];

const positionBuffer = drawing.createBuffer();
drawing.bindBuffer(drawing.ARRAY_BUFFER, positionBuffer);
drawing.bufferData(drawing.ARRAY_BUFFER, new Float32Array(vertexData), drawing.STATIC_DRAW);

const colorBuffer = drawing.createBuffer();
drawing.bindBuffer(drawing.ARRAY_BUFFER, colorBuffer);
drawing.bufferData(drawing.ARRAY_BUFFER, new Float32Array(colorData), drawing.STATIC_DRAW);

const vertexShader = drawing.createShader(drawing.VERTEX_SHADER);
drawing.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
void main() {
    vColor = color;
    gl_Position = vec4(position, 1);
}
`);
drawing.compileShader(vertexShader);

const fragmentShader = drawing.createShader(drawing.FRAGMENT_SHADER);
drawing.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
drawing.compileShader(fragmentShader);
console.log(drawing.getShaderInfoLog(fragmentShader));

const program = drawing.createProgram();
drawing.attachShader(program, vertexShader);
drawing.attachShader(program, fragmentShader);

drawing.linkProgram(program);

const positionLocation = drawing.getAttribLocation(program, `position`);
drawing.enableVertexAttribArray(positionLocation);
drawing.bindBuffer(drawing.ARRAY_BUFFER, positionBuffer);
drawing.vertexAttribPointer(positionLocation, 3, drawing.FLOAT, false, 0, 0);

const colorLocation = drawing.getAttribLocation(program, `color`);
drawing.enableVertexAttribArray(colorLocation);
drawing.bindBuffer(drawing.ARRAY_BUFFER, colorBuffer);
drawing.vertexAttribPointer(colorLocation, 3, drawing.FLOAT, false, 0, 0);

drawing.useProgram(program);
drawing.drawArrays(drawing.TRIANGLE_STRIP, 0, 4);