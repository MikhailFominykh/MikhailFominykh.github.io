const logContainer = document.createElement('div')
document.body.appendChild(logContainer)

function log(s) {
    const div = document.createElement('div')
    div.innerHTML = s
    logContainer.appendChild(div)
}

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const gl = canvas.getContext('webgl2')


function compileShader(shaderType, shaderSource) {
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    return shader
}

function linkProgram(vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (linkStatus) {
        log('Program link success')
    } else {
        const vertexShaderLog = gl.getShaderInfoLog(vertexShader)
        const fragmentShaderLog = gl.getShaderInfoLog(fragmentShader)
        const programLog = gl.getProgramInfoLog(program)
        log(`Vertex shader log: ${vertexShaderLog}`)
        log(`Fragment shader log: ${fragmentShaderLog}`)
        log(`Program log: ${programLog}`)
    }
    return program
}

const vertexShaderSource = `#version 300 es
in vec3 position;

void main() {
    gl_Position = vec4(position, 1.0);
}
`
const fragmentShaderSource1 = `#version 300 es

precision mediump float;
out vec4 outColor0;

void main() {
}
`
const fragmentShaderSource2 = `#version 300 es

precision mediump float;

out vec4 outColor0;
void main() {
    outColor0 = vec4(1.0);
}
`

function testShader(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = linkProgram(vertexShader, fragmentShader)
}

log('Testing shader 1')
testShader(vertexShaderSource, fragmentShaderSource1)

log('Testing shader 2')
testShader(vertexShaderSource, fragmentShaderSource2)

function getDepthVertexShaderSource(useAlphaTest) {
    return `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
#else
    precision mediump float;
    precision mediump int;
#endif

#define attribute in
#define varying out
#define texture2D texture

#define ALPHA_TEST ${useAlphaTest ? 1 : 0}
uniform mat4 mvp;
attribute vec3 a_inputPosition;

#if ALPHA_TEST
attribute vec2 a_inputUV;
varying vec2 vUV;
#endif

void main() {
    gl_Position = mvp * vec4(a_inputPosition, 1.0);
    
    #if ALPHA_TEST
    vUV = a_inputUV;
    #endif
}
    `
}

function getDepthProgramFragmentSource(useAlphaTest) {
    return `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
#else
    precision mediump float;
    precision mediump int;
#endif

#define varying in
#define texture2D texture
#define textureCube texture

out vec4 outColor0;
#define gl_FragColor outColor0
#define ALPHA_TEST ${useAlphaTest ? 1 : 0}

#if ALPHA_TEST
uniform sampler2D uTexture;
varying vec2 vUV;
#endif

void main() {
    #if ALPHA_TEST
    float a = texture2D(uTexture, vUV).a;
    if (a < 0.5)
    {
        discard;
    }
    #endif
}
    `
}

log('Testing shader 3')
const v1 = getDepthVertexShaderSource(false)
const f1 = getDepthProgramFragmentSource(false)
testShader(v1, f1)

log('Testing shader 4')
const v2 = getDepthVertexShaderSource(true)
const f2 = getDepthProgramFragmentSource(true)
testShader(v2, f2)
