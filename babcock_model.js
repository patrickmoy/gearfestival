
//sets up number of teeth, spokes, and the spoke angle
function babcockGear(numTeeth = 32, spokes = 6, innerAng = 2 / spokes) {
    const vertices = [];
    const colors = [];
    const normals = [];



    
    var n = numTeeth * 2;
    var innerRad = 0.2;
    var innerRad2 = 0.8
    var rad = 1.0;
    var outRad = 1.1;
    var angInc = 2 * 3.145 / n;
    var ang = 0;
    var innerAngInc =2 * 3.145 / spokes;
    var z = 0.1;
    
    var red = 0.722;
    var green = 0.451;
    var blue = 0.21;


    var i;     
    var r;

    //starts all of the logic to build the gear
    //essentially draw an inner circle, then the outer circle using the radius and an offset, then do the teeth which are basically an extension of 
    // the outer ring
    for (r = 0; r < 2; r++) {
        ang = 0;
        var drawTooth = false;

        for (i = 0; i < n; i++) {
            vertices.push(0, 0, -z,
                innerRad * Math.cos(ang), innerRad * Math.sin(ang), -z,
                innerRad * Math.cos(ang + angInc), innerRad * Math.sin(ang + angInc), -z);

            colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

            if (z < 0) {
                normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            } else {
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
            }

            vertices.push(innerRad2 * Math.cos(ang), innerRad2 * Math.sin(ang), -z,
                innerRad2 * Math.cos(ang + angInc), innerRad2 * Math.sin(ang + angInc), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

            if (z < 0) {
                normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            } else {
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
            }

            vertices.push(innerRad2 * Math.cos(ang), innerRad2 * Math.sin(ang), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                rad * Math.cos(ang), rad * Math.sin(ang), -z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

            if (z < 0) {
                normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            } else {
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
            }

          
            drawTooth = !drawTooth;
            if (drawTooth) {

                vertices.push(rad * Math.cos(ang), rad * Math.sin(ang), z,
                    rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z,
                    outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2);

               colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

                if (z > 0) {
                    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                } else {
                    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
                }

                vertices.push(rad * Math.cos(ang), rad * Math.sin(ang), z,
                    outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2,
                    outRad * Math.cos(ang), outRad * Math.sin(ang), z / 2);


               colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

                if (z > 0) {
                    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                } else {
                    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
                }
            }

            ang += angInc;
        }
        z = -z;
    }

    z = -z;


    ang = 0;
    drawTooth = true;
    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
        var vectorNormals = [rad * Math.cos(ang + angInc / 2), rad * Math.sin(ang + angInc / 2), 0];
        if (drawTooth) {

            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2]);

            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z,
                rad * Math.cos(ang), rad * Math.sin(ang), z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])
        }

        ang += angInc;
    }

    
    ang = 0;
    for (i = 0; i < n; i++) {


        var norm = [innerRad * Math.cos(ang + angInc / 2), innerRad * Math.sin(ang + angInc / 2), 0];
        vertices.push(
            innerRad * Math.cos(ang), innerRad * Math.sin(ang), -z,
            innerRad * Math.cos(ang + angInc), innerRad * Math.sin(ang + angInc), -z,
            innerRad * Math.cos(ang + angInc), innerRad * Math.sin(ang + angInc), z);



       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])



        vertices.push(
            innerRad * Math.cos(ang), innerRad * Math.sin(ang), -z,
            innerRad * Math.cos(ang + angInc), innerRad * Math.sin(ang + angInc), z,
            innerRad * Math.cos(ang), innerRad * Math.sin(ang), z);



       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])



        ang += angInc;
    }

  
    ang = 0;
    for (i = 0; i < n; i++) {

        var norm = [innerRad2 * -Math.cos(ang + angInc / 2), innerRad2 * -Math.sin(ang + angInc / 2), 0];
        vertices.push(

            innerRad2 * Math.cos(ang), innerRad2 * Math.sin(ang), -z,
            innerRad2 * Math.cos(ang + angInc), innerRad2 * Math.sin(ang + angInc), -z,
            innerRad2 * Math.cos(ang + angInc), innerRad2 * Math.sin(ang + angInc), z);


         colors.push(red, green, blue,  red,green,blue    ,red,green,blue);


        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])



        vertices.push(
            innerRad2 * Math.cos(ang), innerRad2 * Math.sin(ang), -z,
            innerRad2 * Math.cos(ang + angInc), innerRad2 * Math.sin(ang + angInc), z,
            innerRad2 * Math.cos(ang), innerRad2 * Math.sin(ang), z);



       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);


        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])

        ang += angInc;
    }

    
    ang = 0;
    drawTooth = false;
    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
        if (drawTooth) {

            var norm = [outRad * Math.cos(ang + angInc / 2), outRad * Math.sin(ang + angInc / 2), 0];
            vertices.push(


                outRad * Math.cos(ang), outRad * Math.sin(ang), -z / 2,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z / 2,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2)


           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);


            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])



            vertices.push(
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z / 2,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z / 2)

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);


            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])

        }
        ang += angInc;
    }

    ang = 0;

    let vector = new Learn_webgl_vector3();


    drawTooth = false;
    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
        if (drawTooth) {
            let v1 = vector.create(rad * Math.cos(ang), rad * Math.sin(ang), -z);
            let v2 = vector.create(outRad * Math.cos(ang), outRad * Math.sin(ang), -z);
            let v3 = vector.create(outRad * Math.cos(ang), outRad * Math.sin(ang), z);
            let u = vector.create(); vector.subtract(u, v2, v1);
            let v = vector.create(); vector.subtract(v, v3, v1);
            let vectorNormals = vector.create(); vector.crossProduct(norm, u, v); vector.normalize(norm);

            vertices.push(

                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z / 2,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z / 2);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

            normals.push(-vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2])


            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z / 2,
                rad * Math.cos(ang), rad * Math.sin(ang), z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);

            normals.push(-vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2])

            v1 = vector.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z);
            v2 = vector.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z);
            v3 = vector.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z);


            u = vector.create(); vector.subtract(u, v2, v1);
            v = vector.create(); vector.subtract(v, v3, v1);


            norm = vector.create(); 
            vector.crossProduct(norm, u, v);
             vector.normalize(norm);

            vertices.push(
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z / 2,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2);
           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])


            vertices.push(
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z / 2,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z);
           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
            normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2])
        }
        ang += angInc;
    }

    for (r = 0; r < 2; r++) {
        ang = 4;
        var drawTooth = false;

        for (i = 0; i < spokes; i++) {
            vertices.push(0, 0, -z,
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                rad * Math.cos(ang + innerAng), rad * Math.sin(ang + innerAng), -z);

           colors.push(red, green, blue,  red,green,blue    ,red,green,blue);


            if (z < 0) {
                normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            } else {
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
            }



            ang += innerAngInc;
        }
        z = -z;
    }

    ang = 4;
    for (i = 0; i < spokes; i++) {
        let v1 = vector.create(rad * Math.cos(ang), rad * Math.sin(ang), -z);
        let v2 = vector.create(outRad * Math.cos(ang), outRad * Math.sin(ang), -z);
        let v3 = vector.create(outRad * Math.cos(ang), outRad * Math.sin(ang), z);
        let u = vector.create(); vector.subtract(u, v2, v1);
        let v = vector.create(); vector.subtract(v, v3, v1);
        let vectorNormals = vector.create(); 
        vector.crossProduct(norm, u, v);
         vector.normalize(norm);

        vertices.push(0, 0, z,
            0, 0, -z,
            rad * Math.cos(ang + innerAng), rad * Math.sin(ang + innerAng), -z);
       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2]);

        vertices.push(0, 0, z,
            rad * Math.cos(ang + innerAng), rad * Math.sin(ang + innerAng), z,
            rad * Math.cos(ang + innerAng), rad * Math.sin(ang + innerAng), -z);
       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2], vectorNormals[0], vectorNormals[1], vectorNormals[2]);

        vertices.push(0, 0, z,
            0, 0, -z,
            rad * Math.cos(ang), rad * Math.sin(ang), -z);
       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(-vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2]);

        vertices.push(0, 0, z,
            rad * Math.cos(ang), rad * Math.sin(ang), z,
            rad * Math.cos(ang), rad * Math.sin(ang), -z);
       colors.push(red, green, blue,  red,green,blue    ,red,green,blue);
        normals.push(-vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2], -vectorNormals[0], -vectorNormals[1], -vectorNormals[2]);

        ang += innerAngInc;

    }

    return [vertices, colors, normals]
}