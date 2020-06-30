// Portions of code based on http://learnwebgl.brown37.net/
// Used alex_gear_model, babcock_model, gear_modelHeimbuch, gear_modelPham, gearmodel_Saelee provided by instructor
// and classmates, in addition to my own gear.
// Thank you to Nicholas Babcock, Alex Larsen, Nathan Heimbuch, David Saelee, Phuc Pham for your gears.


main();


function main() {

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl', {antialias: true}  );


  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  let time = 0;
  let time_control = 2500;
  let speedIncrement = 1;

  let angle_x = 0;
  let angle_y = 0;
  let angle_z = 0;
  let reverse_angle_z = 0;

    // Vertex shader program, runs on GPU, once per vertex

  const vsSource = `
// Vertex Shader
precision mediump int;
precision mediump float;

// Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform
uniform mat4 u_VM_transform;  // View, model transform

// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;
uniform vec3 u_Ambient_color;

// Original model data
attribute vec3 a_vertex;
attribute vec3 a_color;
attribute vec3 a_vertex_normal;

// Data (to be interpolated) that is passed on to the fragment shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;

void main() {

  // Perform the model and view transformations on the vertex and pass this
  // location to the fragment shader.
  v_Vertex = vec3( u_VM_transform * vec4(a_vertex, 1.0) );

  // Perform the model and view transformations on the vertex's normal vector
  // and pass this normal vector to the fragment shader.
  v_Normal = vec3( u_VM_transform * vec4(a_vertex_normal, 0.0) );

  // Pass the vertex's color to the fragment shader.
  v_Color = vec4(a_color, 1.0);

  // Transform the location of the vertex for the rest of the graphics pipeline
  gl_Position = u_PVM_transform * vec4(a_vertex, 1.0);
}
  `;

  // Fragment shader program, runs on GPU, once per potential pixel

  const fsSource = `
  // Fragment shader program
precision mediump int;
precision mediump float;

// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;
uniform vec3 u_Ambient_color;

// Data coming from the vertex shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;

void main() {

  vec3 to_light;
  vec3 vertex_normal;
  vec3 reflection;
  vec3 to_camera;
  float cos_angle;
  vec3 diffuse_color;
  vec3 specular_color;
  vec3 ambient_color;
  vec3 color;

  // Calculate the ambient color as a percentage of the surface color
  ambient_color = u_Ambient_color * vec3(v_Color);

  // Calculate a vector from the fragment location to the light source
  to_light = u_Light_position - v_Vertex;
  to_light = normalize( to_light );

  // The vertex's normal vector is being interpolated across the primitive
  // which can make it un-normalized. So normalize the vertex's normal vector.
  vertex_normal = normalize( v_Normal );

  // Calculate the cosine of the angle between the vertex's normal vector
  // and the vector going to the light.
  cos_angle = dot(vertex_normal, to_light);
  cos_angle = clamp(cos_angle, 0.0, 1.0);

  // Scale the color of this fragment based on its angle to the light.
  diffuse_color = vec3(v_Color) * cos_angle;

  // Calculate the reflection vector
  reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;

  // Calculate a vector from the fragment location to the camera.
  // The camera is at the origin, so negating the vertex location gives the vector
  to_camera = -1.0 * v_Vertex;

  // Calculate the cosine of the angle between the reflection vector
  // and the vector going to the camera.
  reflection = normalize( reflection );
  to_camera = normalize( to_camera );
  cos_angle = dot(reflection, to_camera);
  cos_angle = clamp(cos_angle, 0.0, 1.0);
  cos_angle = pow(cos_angle, u_Shininess);

  // The specular color is from the light source, not the object
  if (cos_angle > 0.0) {
    specular_color = u_Light_color * cos_angle;
    diffuse_color = diffuse_color * (1.0 - cos_angle);
  } else {
    specular_color = vec3(0.0, 0.0, 0.0);
  }

  color = ambient_color + diffuse_color + specular_color;

  gl_FragColor = vec4(color, v_Color.a);
}
  `;

  // Initialize a shader program; this is where all
  // the lighting for the objects, if any, is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Tell WebGL to use our program when drawing
  gl.useProgram(shaderProgram);

  // Collect all the info needed to use the shader program.
  // Look up locations of attributes and uniforms used by
  // our shader program
  const programInfo = {
    program: shaderProgram,
    locations: {
        a_vertex: gl.getAttribLocation(shaderProgram, 'a_vertex'),
        a_color: gl.getAttribLocation(shaderProgram, 'a_color'),
        a_normal: gl.getAttribLocation(shaderProgram, 'a_vertex_normal'),
        u_transform: gl.getUniformLocation(shaderProgram, 'u_transform'),

        //Added the missing uniform and attributes after copying shader 23 code.
        u_Ambient_color: gl.getUniformLocation(shaderProgram, 'u_Ambient_color'),
        u_Light_position: gl.getUniformLocation(shaderProgram, 'u_Light_position'),
        u_Light_color: gl.getUniformLocation(shaderProgram, 'u_Light_color'),
        u_Shininess: gl.getUniformLocation(shaderProgram, 'u_Shininess'),
        u_PVM_transform: gl.getUniformLocation(shaderProgram, 'u_PVM_transform'),
        u_VM_transform: gl.getUniformLocation(shaderProgram, 'u_VM_transform')
    },
  };

  // add an event handler so we can interactively rotate the model
  document.addEventListener('keydown',

      function key_event(event) {
        if (event.keyCode === 83) {
            if (speedIncrement > 0.1) {
                speedIncrement -= 0.05;
            } else {
                speedIncrement = 0.1;
            }
        } else if (event.keyCode === 70) {
            if (speedIncrement < 2.0) {
                speedIncrement += 0.05;
            } else {
                speedIncrement = 2.0;
            }
        }
         // if(event.keyCode == 37) {   //left
         //     angle_y -= 3;
         // } else if(event.keyCode == 38) {  //top
         //     angle_x -= 3;
         // } else if(event.keyCode == 39) {  //right
         //     angle_y += 3;
         // } else if(event.keyCode == 40) {  //bottom
         //     angle_x += 3;
         // }





          drawScene(gl, programInfo, buffersCollection, time, time_control, angle_x, angle_y, angle_z, reverse_angle_z);


        return false;
  });


  // build the object(s) we'll be drawing, put the data in buffers
  const buffers1 = initBuffers(gl,programInfo, patrickMoyGear(25, 5));
  const buffers2 = initBuffers(gl,programInfo, dSaeleeGear(40, 20));
  const buffers3 = initBuffers(gl,programInfo, dSaeleeGear(40, 20));
  const buffers4 = initBuffers(gl,programInfo, dSaeleeGear(40, 20));
  const buffers5 = initBuffers(gl,programInfo, babcockGear(40, 6, 4));
  const buffers6 = initBuffers(gl, programInfo, nheimb(40, 20, 0.1));
  const buffers7 = initBuffers(gl,programInfo, phucphamGear(60, 20));
  const buffers8 = initBuffers(gl, programInfo, phucphamGear(60, 20));
  const buffers9 = initBuffers(gl, programInfo, patrickMoyGear(25, 5));
  const buffers10 = initBuffers(gl, programInfo, alexGear(40, 15, 0.3, 1.0));

  let buffersCollection = {};
  buffersCollection.gear1 = buffers1;
  buffersCollection.gear2 = buffers2;
  buffersCollection.gear3 = buffers3;
  buffersCollection.gear4 = buffers4;
  buffersCollection.gear5 = buffers5;
  buffersCollection.gear6 = buffers6;
  buffersCollection.gear7 = buffers7;
  buffersCollection.gear8 = buffers8;
  buffersCollection.gear9 = buffers9;
  buffersCollection.gear10 = buffers10;

  self.animate = function() {
      time+= speedIncrement;
      angle_z++;
      reverse_angle_z = reverse_angle_z + 2;
      if (time >= time_control) {
          time = 0;
      }
      drawScene(gl, programInfo, buffersCollection, time, time_control, angle_x, angle_y, angle_z, reverse_angle_z);
      requestAnimationFrame(self.animate);
  };
  animate();

  // Draw the scene
  drawScene(gl, programInfo, buffersCollection, time, time_control, angle_x, angle_y, angle_z, reverse_angle_z);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl,programInfo, gearData) {

  //let gearData = patrickMoyGear(40, 25);
  let vertices = gearData[0];
  let colors = gearData[1];
  let normals = gearData[2];

  // Create  buffers for the object's vertex positions
  const vertexBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Now pass the list of vertices to the GPU to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(vertices),
                gl.STATIC_DRAW);


  // do likewise for colors
  const colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(colors),
                gl.STATIC_DRAW);


const normalBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(normals),
                gl.STATIC_DRAW);

  return {
    // each vertex in buffer has 3 floats
    num_vertices: vertices.length / 3,
    vertex: vertexBuffer,
    color: colorBuffer,
    normal: normalBuffer
  };

}



function enableAttributes(gl,buffers,programInfo) {

    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

  // Tell WebGL how to pull vertex positions from the vertex
  // buffer. These positions will be fed into the shader program's
  // "a_vertex" attribute.

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(
        programInfo.locations.a_vertex,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_vertex);


    // likewise connect the colors buffer to the "a_color" attribute
    // in the shader program
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.locations.a_color,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_color);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.locations.a_normal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_normal);

}


//
// Draw the scene.
//
function drawScene(gl, programInfo, buffersCollection, time, time_control, angle_x, angle_y, angle_z, reverse_angle_z) {
    const vecMake = new Learn_webgl_vector3();

    const camera_location = [0, 0, 0];
    //Test perspective
    // const control_points = [
    //     [10, 10, 10],
    //     [10, 0, 10],
    //     [10, 10, 0],
    //     [10, 10, 0],
    // ];
    const control_points = [
        [0, -2, 10],
        [4, -9, -15],
        [0, 0.95, -11],
        [-1, 5, -3.5],
    ];


    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to white, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  //make transform to implement interactive rotation

  let matrix = new Learn_webgl_matrix();

  let rotate_x_matrix = matrix.create();
  let rotate_y_matrix = matrix.create();
  let rotate_z_matrix = matrix.create();
  let reverse_rotate_z_matrix = matrix.create();
  let lookAt = matrix.create();

  let transform = matrix.create();
  let scale = matrix.create();
  matrix.scale(scale,0.8,0.8,0.8);

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
  matrix.rotate(reverse_rotate_z_matrix, reverse_angle_z, 0, 0, -1);

  function weight(t) {
        return [Math.pow(1 - t, 3), 3 * Math.pow(1 - t, 2) * t, 3 * (1 - t) * Math.pow(t, 2), Math.pow(t, 3)];
  }

  let weights = weight(time / time_control);

  for (cp = 0; cp < 4; cp++) {
      camera_location[0] += weights[cp] * control_points[cp][0];
      camera_location[1] += weights[cp] * control_points[cp][1];
      camera_location[2] += weights[cp] * control_points[cp][2];
  }

  matrix.lookAt(lookAt, camera_location[0], camera_location[1], camera_location[2],0, 0, 0,
        0, 1, 0);

    const proj = matrix.createFrustum(-1, 1, -1, 1, 3, 75);

    let buffers1 = buffersCollection.gear1;
    let buffers2 = buffersCollection.gear2;
    let buffers3 = buffersCollection.gear3;
    let buffers4 = buffersCollection.gear4;
    let buffers5 = buffersCollection.gear5;
    let buffers6 = buffersCollection.gear6;
    let buffers7 = buffersCollection.gear7;
    let buffers8 = buffersCollection.gear8;
    let buffers9 = buffersCollection.gear9;
    let buffers10 = buffersCollection.gear10;


    const translate = matrix.create();


    // Gear 1
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, 0, 0, 0);
    enableAttributes(gl, buffers1, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers1, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 2
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, 0, 0, 1.5);
    enableAttributes(gl, buffers2, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers2, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 3
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, 0, 0, -1.5);
    enableAttributes(gl, buffers3, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers3, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 4
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, -1);
    matrix.translate(translate, 1.25, 1.25, -1.5);
    enableAttributes(gl, buffers4, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers4, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 5
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, -1);
    matrix.translate(translate, -1.25, -1.25, 1.5);
    enableAttributes(gl, buffers5, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers5, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 6
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, -1);
    matrix.translate(translate, -1.25, 1.25, 1.5);
    enableAttributes(gl, buffers6, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers6, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 7
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, -3.0, 1.7, 1.5);
    enableAttributes(gl, buffers7, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers7, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 8
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, -1);
    matrix.translate(translate, 1.25, .75, 0);
    enableAttributes(gl, buffers8, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers8, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 9
    matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, 1, 2.8, -1.5);
    enableAttributes(gl, buffers9, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers9, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);

    // Gear 9
       matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);
    matrix.translate(translate, 1.2, 1.8, 0);
    enableAttributes(gl, buffers10, programInfo);

    gearHelper(0, programInfo, gl, matrix, buffers10, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);



    const p4 = new Learn_webgl_point4();
    const light_position = p4.create(0, 0, 2, 1);

    const light_in_camera_space = p4.create(0, 0, 0, 0);
    matrix.multiplyP4(light_in_camera_space, lookAt, light_position);


    // // Set the shader program's uniform
    // gl.uniformMatrix4fv(programInfo.locations.u_transform, false, transform);
    //
    // gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, vm_transform);
    //
    // gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, pvm_transform);
    gl.uniform3f(programInfo.locations.u_Light_position,
        light_in_camera_space[0],
        light_in_camera_space[1],
        light_in_camera_space[2]);

    gl.uniform3f(programInfo.locations.u_Light_color, .9, 1.0, 1.0);
    gl.uniform1f(programInfo.locations.u_Shininess, 80);
    gl.uniform3f(programInfo.locations.u_Ambient_color, 0.2, 0.2, 0.2);

    if (time * .005 < 1.75) {
        gl.uniform1f(programInfo.locations.u_Shininess, 78 + time * .005);
        gl.uniform3f(programInfo.locations.u_Ambient_color, -1.5 + (time * .005), -1.5 + (time * .005), -1.5 + (time * .005));
    }


    // // gl.uniform3f(programInfo.locations.u_Light_position, 0, 0, -4.5);
    // gl.uniform3fv(programInfo.locations.u_Light_position, vecMake.create(0.0, 0.0, -4.1));
    //
    // // gl.uniform3f(programInfo.locations.u_Light_color, .6, .6, .6);
    // gl.uniform3fv(programInfo.locations.u_Light_color, vecMake.create(.4, .4, .4));
    //
    // gl.uniform1f(programInfo.locations.u_Shininess, 3);
    //
    // gl.uniform3f(programInfo.locations.u_Ambient_color, .4, .4, .4);

}

//
// Initialize a shader program, so WebGL knows how to draw our data
// BOILERPLATE CODE, COPY AND PASTE
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.  BOILERPLATE CODE, COPY AND PASTE
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function gearHelper(offset, programInfo, gl, matrix, buffers, transform, proj, lookAt, translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale) {
    gl.drawArrays(gl.TRIANGLES, offset, buffers.num_vertices);
    matrix.multiplySeries(transform, proj, lookAt,
        translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);
    gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform,
        false, transform);
    gl.uniformMatrix4fv(programInfo.locations.u_VM_transform,
        false, transform);
    matrix.multiplySeries(transform, lookAt,
        translate, rotate_x_matrix, rotate_y_matrix, rotate_z_matrix, scale);
}
