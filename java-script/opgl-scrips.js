
// Global variable
var gl= document.getElementById('gl').getContext('webgl') 
||
// Support Internet Explorer, Edge, 
Safaridocument.getElementById('gl').getContext('experimental-webgl');


function InitWebGL()
{
    if(!gl)
    {
        alert('WebGL is not supported');
        return;
    }
    
    let canvas =document.getElementById('gl');
    if(canvas.width!= canvas.clientWidth||canvas.height!= canvas.clientHeight)
        {
            canvas.width= canvas.clientWidth;canvas.height= canvas.clientHeight;
        }

    InitViewport();
}


function InitViewport()
{
    // Initialize WebGL viewport
    gl.viewport(0,                  // X
                0,                  // Y
                gl.canvas.width,    // Width
                gl.canvas.height);  // Height

    // Initialize pixel buffer properties
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    InitShaders();
}


function InitShaders()
{
    // Compile vertex & fragment shaders
    const vertex = InitVertexShader();
    const fragment = InitFragmentShader();

    // Link two shaders in a shader program
    let program = InitShaderProgram(vertex, fragment);
    if (!ValidateShaderProgram(program))
        {
           return false;
        }
    // Create GPU buffers for geometry
    return CreateGeometryBuffers(program);
}


function InitVertexShader()
{
    let e = document.getElementById('vs');
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, e.value);
    gl.compileShader(vs);

    // Check if shader was compiled successfully
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            // Write error to console
            let e = gl.getShaderInfoLog(vs);
            console.error('Failed init vertex shader: ', e);
            return;
        }

    return vs;
}


function InitFragmentShader()
{
    let e = document.getElementById('fs');
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, e.value);
    gl.compileShader(fs);

    // Check if shader was compiled successfully
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            // Write error to console
            let e = gl.getShaderInfoLog(fs);
            console.error('Failed init fragmentshader:', e);
            return;
        }
    return fs;
}


function InitShaderProgram(vs, fs)
{
    let p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    // Check if shaders were linked successfully
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        {
            // Write error to console
            console.error(gl.getProgramInfoLog(p));
            alert('Failed linking program');
            return;
        }
    return p;
}

function ValidateShaderProgram(p)
{
    gl.validateProgram(p);

    // Check if validation was successful
    if (!gl.getProgramParameter(p, gl.VALIDATE_STATUS))
        {
            // Write error to console
            console.error(gl.getProgramInfoLog(p));
            alert('Errors found validating shader program');
            return false;
        }
    return true;
}

function CreateGeometryBuffers(program)
{
    // Triangle X Y Z R G B
    const vertices = [0.0, 0.5, 0.0, 1.0, 0.0, 0.0,
    -0.5,-0.5, 0.0, 0.0, 1.0, 0.0,
    0.5,-0.5, 0.0, 0.0, 0.0, 1.0];

    // Create GPU buffer (VBO)
    CreateVBO(program, new Float32Array(vertices));

    // Activate shader program
    gl.useProgram(program);

    // Display geometri on screen
    Render();
}


function CreateVBO(program, vert)
{
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER,vert,gl.STATIC_DRAW);
    const s = 6 * Float32Array.BYTES_PER_ELEMENT;

    // Create shader attribute: Pos
    let p = gl.getAttribLocation(program, 'Pos');
    gl.vertexAttribPointer(p,3,gl.FLOAT,gl.FALSE,s,0);
    gl.enableVertexAttribArray(p);

    // Create shader attribute: Color
    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, 'Color');
    gl.vertexAttribPointer(c,3,gl.FLOAT,gl.FALSE,s,o);
    gl.enableVertexAttribArray(c);
}

function Render()
{
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT |
    gl.DEPTH_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}