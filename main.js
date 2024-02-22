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

function testShader(fragmentShaderSource) {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = linkProgram(vertexShader, fragmentShader)
}

log('Testing shader 1')
testShader(fragmentShaderSource1)

log('Testing shader 2')
testShader(fragmentShaderSource2)
