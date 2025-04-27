
// Global variable
var gl= document.getElementById('gl').getContext('webgl') 
||
// Support Internet Explorer, Edge, 
Safaridocument.getElementById('gl').getContext('experimental-webgl');

var textureGL = 0;
var display = [0.0, 0.0, 0.0, 0.0];
var displayGL = 0;

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
    gl.vertexAttribPointer(c, 3, gl.FLOAT, gl.FALSE, s, o);
    gl.enableVertexAttribArray(c);

    // create shader uv
    const o2 = o * 2;
    let u = gl.getAttribLocation(program, 'UV');
    gl.vertexAttribPointer(u, 2, gl.FLOAT, gl.FALSE, s, o2);
    gl.enableVertexAttribArray(u);

}


// Global variable
var vertices = [];
var gl= document.getElementById('gl')
                .getContext('webgl') ||
                // Support Internet Explorer, Edge, Safari
        document.getElementById('gl')
                .getContext('experimental-webgl');


function AddVertex(x, y, z, r, g, b, u, v)
{   
    // get index denne vertecy fylder
    const index = vertices.length;

    // udvid array med længden af en vertecy
    vertices.length += 8;

    // sæt værdien af vertecies
    vertices[index + 0] = x;
    vertices[index + 1] = y;
    vertices[index + 2] = z;
    vertices[index + 3] = r;
    vertices[index + 4] = g;
    vertices[index + 5] = b;
    vertices[index + 6] = u;
    vertices[index + 7] = v;
}



function CreateTriangle(width, height)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddTriangle(    0.0,  h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0,
                     -w, -h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
                      w, -h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0);
}

function AddTriangle(
    // input kanter i trekant
    x1, y1, z1, r1, g1, b1, u1, v1,
    x2, y2, z2, r2, g2, b2, u2, v2,
    x3, y3, z3, r3, g3, b3, u3, v3)

{
    // tilføj vertecies til functionen
    AddVertex(x1, y1, z1, r1, g1, b1, u1, v1);
    AddVertex(x2, y2, z2, r2, g2, b2, u2, v2);
    AddVertex(x3, y3, z3, r3, g3, b3, u3, v3); 
}

             

function CreateQuad(width, height)
{
    vertices.length= 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0
            -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
             w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
             w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0);
}


function AddQuad(
    x1, y1, z1, r1, g1, b1, u1, v1,
    x2, y2, z2, r2, g2, b2, u2, v2,
    x3, y3, z3, r3, g3, b3, u3, v3,
    x4, y4, z4, r4, g4, b4, u4, v4)
{
    AddTriangle(
        x1, y1, z1, r1, g1, b1, u1, v1,
        x2, y2, z2, r2, g2, b2, u2, v2,
        x3, y3, z3, r3, g3, b3, u3, v3);

    AddTriangle(
        x3, y3, z3, r3, g3, b3, u3, v3,
        x4, y4, z4, r4, g4, b4, u4, v4,
        x1, y1, z1, r1, g1, b1, u1, v1);
}


function CreateBox(width, height, depth)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const d = depth * 0.5;

    //front
    AddQuad(-w, h, -d, 1.0, 0.0, 0.0, 
            -w,-h, -d, 1.0, 0.0, 0.0,
             w,-h, -d, 1.0, 0.0, 0.0,
             w, h, -d, 1.0, 0.0, 0.0);

    //left
    AddQuad(-w, h, d, 0.0, 1.0, 0.0,
            -w,-h, d, 0.0, 1.0, 0.0,
            -w,-h, -d, 0.0, 1.0, 0.0,
            -w, h, -d, 0.0, 1.0, 0.0,);

    //back
    AddQuad(-w, h, d, 0.0, 0.0, 1.0,
             w, h, d, 0.0, 0.0, 1.0,
             w,-h, d, 0.0, 0.0, 1.0,
            -w,-h, d, 0.0, 0.0, 1.0,)
            
    //right
    AddQuad( w, h, d, 1.0, 0.0, 1.0,
             w, h,-d, 1.0, 0.0, 1.0,
             w,-h,-d, 1.0, 0.0, 1.0,
             w,-h, d, 1.0, 0.0, 1.0,)

    //top
    AddQuad( w, h, d, 0.0, 1.0, 1.0,
            -w, h, d, 0.0, 1.0, 1.0,
            -w, h,-d, 0.0, 1.0, 1.0,
             w, h,-d, 0.0, 1.0, 1.0,)
    //borrom
    AddQuad( w,-h, d, 1.0, 1.0, 1.0,
             w,-h,-d, 1.0, 1.0, 1.0,
            -w,-h,-d, 1.0, 1.0, 1.0,
            -w,-h, d, 1.0, 1.0, 1.0,)       
    ;
}


function CreateSubdividedBox (subdiv, width, height, depth)
{

    // if positive direction is chosen, the locked plane will be in the positive side
    // fx top, right or back
    // back is a special case though

    var white = false;
    var wc = 1.0;

    var w = width / subdiv;
    var h = height / subdiv;
    var d = depth / subdiv;

    var startPointX = width * 0.5  * -1;
    var startPointY = height * 0.5 * -1;
    var startPointD = depth * 0.5  * -1;


    // makes front and back
    for (let axis1 = 0; axis1 <  subdiv; axis1++)
    {
        for (let axis2 = 0; axis2 <  subdiv; axis2++ )
        {
            white = !white;
            if (white) {wc = 1.0;}
            else { wc = 0.0}

            var x1 = startPointX + axis2 * w;
            var y1 = startPointY + axis1 * h;
            var z1 = startPointD;
    
            var x2 = startPointX + (axis2 +1) * w; 
            var y2 = startPointY + axis1 * h;
            var z2 = startPointD;
    
            var x3 = startPointX + (axis2 +1) * w; 
            var y3 = startPointY + (axis1 +1) * h;
            var z3 = startPointD;
    
            var x4 = startPointX + axis2 * w; 
            var y4 = startPointY + (axis1 +1) * h ;
            var z4 = startPointD;
    
            /*AddQuad(x1, y1, z1, axis1 /subdiv, axis2 /subdiv,  1.0,
                x2, y2, z2, axis1 /subdiv, axis2 /subdiv,  1.0,
                x3, y3, z3, axis1 /subdiv, axis2 /subdiv,  1.0,
                x4, y4, z4, axis1 /subdiv, axis2 /subdiv,  1.0);*/

            AddQuad(x1, y1, z1, wc, wc, wc,
                x2, y2, z2, wc, wc, wc,
                x3, y3, z3, wc, wc, wc,
                x4, y4, z4, wc, wc, wc);

            var x4 = startPointX + axis2 * w;
            var y4 = startPointY + axis1 * h;
            var z4 = startPointD * -1;
    
            var x3 = startPointX + (axis2 +1) * w; 
            var y3 = startPointY + axis1 * h;
            var z3 = startPointD * -1;
    
            var x2 = startPointX + (axis2 +1) * w; 
            var y2 = startPointY + (axis1 +1) * h;
            var z2 = startPointD * -1;
    
            var x1 = startPointX + axis2 * w; 
            var y1 = startPointY + (axis1 +1) * h ;
            var z1 = startPointD * -1;
    
            AddQuad(x1, y1, z1, wc, wc, wc,
                x2, y2, z2, wc, wc, wc,
                x3, y3, z3, wc, wc, wc,
                x4, y4, z4, wc, wc, wc);
        }
    }



        // makes right and left
        for (let axis1 = 0; axis1 <  subdiv; axis1++)
            {
                for (let axis2 = 0; axis2 <  subdiv; axis2++ )
                {
                    white = !white;
                    if (white) {wc = 1.0;}
                    else { wc = 0.0}

                    var x1 = startPointX * -1 ;
                    var y1 = startPointY + axis1 * h;
                    var z1 = startPointD + axis2 * w;
            
                    var x2 = startPointX * -1 ; 
                    var y2 = startPointY + axis1 * h;
                    var z2 = startPointD + (axis2 +1) * w;
            
                    var x3 = startPointX * -1 ; 
                    var y3 = startPointY + (axis1 +1) * h;
                    var z3 = startPointD + (axis2 +1) * w;
            
                    var x4 = startPointX * -1 ; 
                    var y4 = startPointY + (axis1 +1) * h ;
                    var z4 = startPointD + axis2 * w;
            
                    AddQuad(x1, y1, z1, wc, wc, wc,
                        x2, y2, z2, wc, wc, wc,
                        x3, y3, z3, wc, wc, wc,
                        x4, y4, z4, wc, wc, wc);

                    var x4 = startPointX;
                    var y4 = startPointY + axis1 * h;
                    var z4 = startPointD + axis2 * w;
            
                    var x3 = startPointX; 
                    var y3 = startPointY + axis1 * h;
                    var z3 = startPointD + (axis2 +1) * w;
            
                    var x2 = startPointX; 
                    var y2 = startPointY + (axis1 +1) * h;
                    var z2 = startPointD + (axis2 +1) * w;
            
                    var x1 = startPointX; 
                    var y1 = startPointY + (axis1 +1) * h ;
                    var z1 = startPointD + axis2 * w;
            
                    AddQuad(x1, y1, z1, wc, wc, wc,
                        x2, y2, z2, wc, wc, wc,
                        x3, y3, z3, wc, wc, wc,
                        x4, y4, z4, wc, wc, wc);
                }
            }

        // makes top and bottom
        for (let axis1 = 0; axis1 <  subdiv; axis1++)
            {
                for (let axis2 = 0; axis2 <  subdiv; axis2++ )
                {
        
                    white = !white;
                    if (white) {wc = 0.0;}
                    else { wc = 1.0}
                    
                    var x1 = startPointX + axis2 * w;
                    var y1 = startPointY * -1;
                    var z1 = startPointD + axis1 * d;
            
                    var x2 = startPointX + (axis2 +1) * w; 
                    var y2 = startPointY * -1;
                    var z2 = startPointD + axis1 * d;
            
                    var x3 = startPointX + (axis2 +1) * w; 
                    var y3 = startPointY * -1;
                    var z3 = startPointD + (axis1 +1) * d;
            
                    var x4 = startPointX + axis2 * w; 
                    var y4 = startPointY * -1;
                    var z4 = startPointD + (axis1 +1) * d;
            
                    AddQuad(x1, y1, z1, wc, wc, wc,
                        x2, y2, z2, wc, wc, wc,
                        x3, y3, z3, wc, wc, wc,
                        x4, y4, z4, wc, wc, wc);
        
                    var x4 = startPointX + axis2 * w;
                    var y4 = startPointY;
                    var z4 = startPointD + axis1 * d;
            
                    var x3 = startPointX + (axis2 +1) * w; 
                    var y3 = startPointY;
                    var z3 = startPointD + axis1 * d;
            
                    var x2 = startPointX + (axis2 +1) * w; 
                    var y2 = startPointY;
                    var z2 = startPointD + (axis1 +1) * d;
            
                    var x1 = startPointX + axis2 * w; 
                    var y1 = startPointY;
                    var z1 = startPointD + (axis1 +1) * d;
            
                    AddQuad(x1, y1, z1, wc, wc, wc,
                        x2, y2, z2, wc, wc, wc,
                        x3, y3, z3, wc, wc, wc,
                        x4, y4, z4, wc, wc, wc);
                }
            }

}





// event listener
var mouseX = 0, mouseY = 0;
var angle = [ 0.0, 0.0, 0.0, 1.0 ];
var angleGL= 0;

document.getElementById('gl')
.addEventListener('mousemove', function(e) 
    {
        if(e.buttons == 1)
            {
                // Left mouse button pressed
                angle[0] -= (mouseY-e.y) * 0.01;
                angle[1] += (mouseX-e.x) * 0.01;

                gl.uniform4fv(angleGL, new Float32Array(angle));
                Render();
            }
        mouseX = e.x;
        mouseY= e.y;
    }
);



function Render()
{
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0,vertices.length / 6);
}


function CreateGeometryUI()
{
    const ew= document.getElementById('w');
    const w = ew ? ew.value: 1.0;
    const eh = document.getElementById('h');
    const h = eh ? eh.value: 1.0;
    const ed = document.getElementById('d');
    const d = ed ? ed.value: 1.0;
    const sd = document.getElementById('sub');
    const s = sd ? sd.value: 5.0;
    
    document.getElementById('ui').innerHTML=
    'Width: <input type="number" id="w" value="'
    + w 
    +'" onchange= "InitShaders();"><br>'
    +'Height: <input type="number" id="h" value="'
    + h 
    +'" onchange= "InitShaders();"><br>'
    +'Depth: <input type="number" id="d" value="'
    + d 
    +'" onchange= "InitShaders();">'
    +'Subdivide: <input type="number" id="sub" value="'
    + s
    +'" onchange= "InitShaders();">';


    let e = document.getElementById('shape');
    switch(e.selectedIndex)
    {
        case 0: 
        CreateQuad(w, h);  
        
        break;

        case 1: CreateTriangle(w, h); 
            break;

        case 2: 
            CreateBox(w, h, d); 
            break;
        case 3:
            CreateSubdividedBox(s,w,h,d);
            break;
        }
    }

function CreateGeometryBuffers(program)
{
    // Generate selected geometry and UI
    CreateGeometryUI();

    // Create GPU buffer (VBO)
    CreateVBO(program, new Float32Array(vertices));

    // uniform shader inform
    angleGL= gl.getUniformLocation(program, 'Angle');
    CreateTexture(program, 'images/tekstur.jpg')

    // Activate shader program
    gl.useProgram(program);

    //update display options
    gl.uniform4fv(displayGL, new Float32Array(display))

    // Display geometri on screen
    Render();
}

function CreateTexture (prog, url) {
    // load tex to g-card
    const texture = LoadTexture(url);

    // flip y axis as pr norm
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // activeate texture to tex unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // add unrfomr location to fragment shader
    textureGL = gl.getUniformLocation(prog, 'Texture');

    // add uniform location to fragment shader
    displayGL = gl.getUniformLocation(prog, 'Display');
}


function LoadTexture(url) 
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const image = new Image();
    image.onload= () => 
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        SetTextureFilters(image);
    };

    image.src= url;
    return texture;
}


function SetTextureFilters(image)
{
    if (IsPow2(image.width) && IsPow2(image.height))
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
}

function IsPow2(value)
{
    return(value & (value -1)) === 0;
}

function Update()
{
    // Show texture (boolean) last element
    const t = document.getElementById('t');
    display[3] = t.checked? 1.0 : 0.0;

    // Update array to graphics card and render 
    gl.uniform4fv(displayGL, new Float32Array(display));
    Render();
}