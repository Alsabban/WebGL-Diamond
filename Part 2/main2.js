const canvas = document.querySelector('canvas');
const drawing_t = canvas.getContext('webgl');
if (!drawing_t) {
    throw new Error('WebGL not supported');
}

drawing_t.clearColor(0.2, 0.2, 0.2, 1.0);
drawing_t.clear(drawing_t.COLOR_BUFFER_BIT | drawing_t.DEPTH_BUFFER_BIT);

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

//load texture
function loadTexture(url) {
    const texture = drawing_t.createTexture()
    const image = new Image();

    image.crossOrigin = `anonymous`;
    
    image.onload = e=> {
        drawing_t.bindTexture(drawing_t.TEXTURE_2D, texture);

        drawing_t.texImage2D(drawing_t.TEXTURE_2D, 0, drawing_t.RGBA, drawing_t.RGBA, drawing_t.UNSIGNED_BYTE, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            drawing_t.generateMipmap(drawing_t.TEXTURE_2D);
         } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            drawing_t.texParameteri(drawing_t.TEXTURE_2D, drawing_t.TEXTURE_WRAP_S, drawing_t.CLAMP_TO_EDGE);
            drawing_t.texParameteri(drawing_t.TEXTURE_2D, drawing_t.TEXTURE_WRAP_T, drawing_t.CLAMP_TO_EDGE);
            drawing_t.texParameteri(drawing_t.TEXTURE_2D, drawing_t.TEXTURE_MIN_FILTER, drawing_t.LINEAR);
         }

        drawing_t.drawArrays(drawing_t.TRIANGLES, 0, 6);
    };

    image.src = url;
    return texture;
}

const tt = loadTexture(`Part 2/wood.png`);
drawing_t.activeTexture(drawing_t.TEXTURE0);
drawing_t.bindTexture(drawing_t.TEXTURE_2D, tt);

const uvData = [
    0, 0.5,
    0.5, 0,
    1, 0.5, 
    
    1, 0.5,
    0.5, 1,
    0, 0.5,


];

const vertexData = [
   -0.5, 0, 0,     // V3.position
   0, 1, 0,        // V1.position
    0.5, 0, 0,      // V2.position
    0.5, 0, 0,      // V2.position
    0, -1, 0,       // V4.position
    -0.5, 0, 0,     // V3.position
];


const vertexShader = drawing_t.createShader(drawing_t.VERTEX_SHADER);
drawing_t.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec2 uv;
varying vec2 vUV;

void main() {
    vUV = uv;
    gl_Position = vec4(position, 1);
}
`);
drawing_t.compileShader(vertexShader);

const fragmentShader = drawing_t.createShader(drawing_t.FRAGMENT_SHADER);
drawing_t.shaderSource(fragmentShader, `
precision mediump float;

varying vec2 vUV;
uniform sampler2D textureID;

void main() {
    gl_FragColor = texture2D(textureID, vUV);
}
`);
drawing_t.compileShader(fragmentShader);
console.log(drawing_t.getShaderInfoLog(fragmentShader));

const program = drawing_t.createProgram();
drawing_t.attachShader(program, vertexShader);
drawing_t.attachShader(program, fragmentShader);

drawing_t.linkProgram(program);

const positionBuffer = drawing_t.createBuffer();
drawing_t.bindBuffer(drawing_t.ARRAY_BUFFER, positionBuffer);
drawing_t.bufferData(drawing_t.ARRAY_BUFFER, new Float32Array(vertexData), drawing_t.STATIC_DRAW);

const uvBuffer = drawing_t.createBuffer();
drawing_t.bindBuffer(drawing_t.ARRAY_BUFFER, uvBuffer);
drawing_t.bufferData(drawing_t.ARRAY_BUFFER, new Float32Array(uvData), drawing_t.STATIC_DRAW);

const positionLocation = drawing_t.getAttribLocation(program, `position`);
drawing_t.enableVertexAttribArray(positionLocation);
drawing_t.bindBuffer(drawing_t.ARRAY_BUFFER, positionBuffer);
drawing_t.vertexAttribPointer(positionLocation, 3, drawing_t.FLOAT, false, 0, 0);


const uvLocation = drawing_t.getAttribLocation(program, `uv`);
drawing_t.enableVertexAttribArray(uvLocation);
drawing_t.bindBuffer(drawing_t.ARRAY_BUFFER, uvBuffer);
drawing_t.vertexAttribPointer(uvLocation, 2, drawing_t.FLOAT, false, 0, 0);

drawing_t.useProgram(program);


uniformLocations ={
    textureID: drawing_t.getUniformLocation(program, `textureID`),
};

    drawing_t.uniform1i(uniformLocations.textureID, 0);
