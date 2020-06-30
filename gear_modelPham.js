//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
// function createGear() {
// 	var numTeeth = 40;
// 	var numSpokes = 20;
// 	var gear = phucphamGear(numTeeth, numSpokes);
// 	return gear;
// }

function phucphamGear(numTeeth, numSpokes) {
	const vertices = [];
	const colors = [];
	const normals = [];

	var rad = 1.0;
	var outRad = 1.2 * rad;
	var inRad = 0.8 * rad;
	var smallCircleRad = 0.3 * rad;
	var arrColor = [0.71875, 0.44922, 0.19922];
	var angInc = (2 * 3.14159) / numTeeth;
	var angSpokeInc = (2 * 3.14159) / numSpokes;
	var ang = 0;
	var z = 0.1;
	var zRoof = 0.03;

	var i, r;	
	for (r = 0 ; r < 2; r++) {
		ang = 0;
		for (i = 0; i < numTeeth; i++) {	
			// small circle face			
			vertices.push(0,0,z,
				smallCircleRad*Math.cos(ang),smallCircleRad*Math.sin(ang),z,
				smallCircleRad*Math.cos(ang+angInc),smallCircleRad*Math.sin(ang+angInc),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			if (z > 0)
				normals.push(0,0,1,0,0,1,0,0,1);    
			else
				normals.push(0,0,-1,0,0,-1,0,0,-1);


			/// big circle face (created by two triangles)
			// left triangle
			vertices.push(inRad*Math.cos(ang),inRad*Math.sin(ang),z,
							inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),z,
							rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z); 

			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			if (z > 0)
				normals.push(0,0,1,0,0,1,0,0,1);    
			else
				normals.push(0,0,-1,0,0,-1,0,0,-1);   
			
			// right triangle
			vertices.push(inRad*Math.cos(ang), inRad*Math.sin(ang), z,
							rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
							rad*Math.cos(ang), rad*Math.sin(ang), z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			if (z > 0)
				normals.push(0,0,1,0,0,1,0,0,1);    
			else
				normals.push(0,0,-1,0,0,-1,0,0,-1);    
			ang += angInc;
		}
		z = -z;
	}

	/// edges
	ang = 0;                      
	for (i = 0; i < numTeeth; i++) {
		// normal vector of small circle's edge
		var norm = [smallCircleRad*Math.cos(ang+angInc/2),smallCircleRad*Math.sin(ang+angInc/2),0];	
		
		// above triangle of small circle's edge
        vertices.push(
            smallCircleRad*Math.cos(ang),smallCircleRad*Math.sin(ang),-z,
            smallCircleRad*Math.cos(ang+angInc),smallCircleRad*Math.sin(ang+angInc),-z,
            smallCircleRad*Math.cos(ang+angInc),smallCircleRad*Math.sin(ang+angInc),z); 
        colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]); 
		
		// below triangle of small circle's edge
        vertices.push(
            smallCircleRad*Math.cos(ang),smallCircleRad*Math.sin(ang),-z,
            smallCircleRad*Math.cos(ang+angInc),smallCircleRad*Math.sin(ang+angInc),z,
            smallCircleRad*Math.cos(ang),smallCircleRad*Math.sin(ang),z); 
        colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]); 
		
		// normal vector of inner coin's edge
		var norm = calcNormal(inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),-z,
								inRad*Math.cos(ang),inRad*Math.sin(ang),-z,								
								inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),z
							); 

		// above triangle of inner coin's edge
        vertices.push(
            inRad*Math.cos(ang),inRad*Math.sin(ang),-z,
            inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),-z,
            inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),z); 
        colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]); 
		
		// below triangle of inner coin's edge
        vertices.push(
            inRad*Math.cos(ang),inRad*Math.sin(ang),-z,
            inRad*Math.cos(ang+angInc),inRad*Math.sin(ang+angInc),z,
            inRad*Math.cos(ang),inRad*Math.sin(ang),z); 
        colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]); 
		ang += angInc;
	}
		
	/// teeth face 
	var r;
    for (r = 0; r < 2; r++) {
		ang = 0;
		var drawTooth = false;
	  
		for ( i = 0; i < numTeeth; i++) {
			drawTooth = !drawTooth;
			if (drawTooth) {
				if(r == 0){    
                    var norm = calcNormal(outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zRoof,
                                       rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                                       rad*Math.cos(ang), rad*Math.sin(ang), z
				                    );
                } else {                    
				    var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
                                       rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                                       outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zRoof
				                    );
                }
				vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
								rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
								outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zRoof); 
				colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
				normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

				vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
								outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zRoof,
								outRad*Math.cos(ang), outRad*Math.sin(ang), zRoof);


			    colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);

				normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

			}
			ang += angInc;
		}
		z = -z;
		zRoof = -zRoof;
	}

   // coin edge
   ang = 0;
   var drawTooth = true;
   for (i = 0; i < numTeeth; i++) {
        drawTooth = !drawTooth;
	    var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2),0];
        if (drawTooth) {          
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),-z,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z); 
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]); 
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),-z,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z,
				rad*Math.cos(ang),rad*Math.sin(ang),z); 
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
        }
	    ang += angInc;
   }

	ang = 0;                          
	var drawTooth = false;
	for (i = 0; i < numTeeth; i++) {
		drawTooth = !drawTooth;		
		if (drawTooth) {
			/// tooth roof 
			var norm = [outRad*Math.cos(ang+angInc/2),outRad*Math.sin(ang+angInc/2),0];
			vertices.push(
				outRad*Math.cos(ang),outRad*Math.sin(ang),-zRoof,
					outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zRoof,
					outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zRoof);
		
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
	
			vertices.push(
				  outRad*Math.cos(ang),outRad*Math.sin(ang),-zRoof,
				  outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zRoof,
				  outRad*Math.cos(ang),outRad*Math.sin(ang),zRoof);
	
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);    

			/// tooth walls
			// BUG 3   norm vs. normal  
			var norm = calcNormal( rad*Math.cos(ang), rad*Math.sin(ang),-z,
						outRad*Math.cos(ang),outRad*Math.sin(ang),-z,
						outRad*Math.cos(ang),outRad*Math.sin(ang),z);
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),-z,
				outRad*Math.cos(ang),outRad*Math.sin(ang),-zRoof,
				rad*Math.cos(ang),rad*Math.sin(ang),-zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),-zRoof,
				outRad*Math.cos(ang),outRad*Math.sin(ang),-zRoof,
				outRad*Math.cos(ang),   outRad*Math.sin(ang),zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),zRoof,
				rad*Math.cos(ang),rad*Math.sin(ang),-zRoof,
				outRad*Math.cos(ang),outRad*Math.sin(ang),zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang),rad*Math.sin(ang),zRoof,
				outRad*Math.cos(ang),outRad*Math.sin(ang),zRoof,
				rad*Math.cos(ang),rad*Math.sin(ang),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

			var norm = calcNormal( rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc),-z,
						outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z,
						outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z);
			vertices.push(
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
				outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zRoof,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-zRoof,
				outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zRoof,
				outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);;
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),zRoof,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-zRoof,
				outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zRoof);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
			vertices.push(
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),zRoof,
				outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zRoof,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

		}
		ang += angInc;
    }

	// spokes face
	var r;
    for (r = 0; r < 2; r++) {
		ang = 0;
		var drawTooth = false;	  
		for ( i = 0; i < numSpokes; i++) {
			drawTooth = !drawTooth;
			if (drawTooth) {
				// left triangle
				vertices.push(smallCircleRad*Math.cos(ang), smallCircleRad*Math.sin(ang), z,
								rad*Math.cos(ang), rad*Math.sin(ang), z,
								rad*Math.cos(ang+angSpokeInc), rad*Math.sin(ang+angSpokeInc), z); 
				colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
					  
				if (z > 0)
					normals.push(0,0,1,0,0,1,0,0,1);    
				else
					normals.push(0,0,-1,0,0,-1,0,0,-1);    

				// right triangle
				vertices.push(smallCircleRad*Math.cos(ang), smallCircleRad*Math.sin(ang), z,
								smallCircleRad*Math.cos(ang+angSpokeInc), smallCircleRad*Math.sin(ang+angSpokeInc), z,
								rad*Math.cos(ang+angSpokeInc), rad*Math.sin(ang+angSpokeInc), z);
			    colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);

				if (z > 0)
					normals.push(0,0,1,0,0,1,0,0,1);    
				else
					normals.push(0,0,-1,0,0,-1,0,0,-1);    

			}
			ang += angSpokeInc;
		}
		z = -z;
	}

	ang = 0;
	drawTooth = false;
	for ( i = 0; i < numSpokes; i++) {   
		drawTooth = !drawTooth;
		if (drawTooth) {
			// BUG 3   norm vs. normal  
			// normal vector of spoke walls
			var norm = calcNormal( smallCircleRad*Math.cos(ang), smallCircleRad*Math.sin(ang),-z,
									inRad*Math.cos(ang),inRad*Math.sin(ang),-z,
									inRad*Math.cos(ang),inRad*Math.sin(ang),z);
			
			// right triangle of spoke walls
			vertices.push(
				smallCircleRad*Math.cos(ang), smallCircleRad*Math.sin(ang),-z,
				inRad*Math.cos(ang),inRad*Math.sin(ang),-z,
				inRad*Math.cos(ang),inRad*Math.sin(ang),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

			// left triangle of spoke walls
			vertices.push(
				smallCircleRad*Math.cos(ang),smallCircleRad*Math.sin(ang),-z,
				inRad*Math.cos(ang),inRad*Math.sin(ang),z,
				smallCircleRad*Math.cos(ang),   smallCircleRad*Math.sin(ang),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

			// normal vector of 
			var norm = calcNormal( smallCircleRad*Math.cos(ang+angSpokeInc), smallCircleRad*Math.sin(ang+angSpokeInc),-z,									
									inRad*Math.cos(ang+angSpokeInc),inRad*Math.sin(ang+angSpokeInc),z,
									inRad*Math.cos(ang+angSpokeInc),inRad*Math.sin(ang+angSpokeInc),-z);
			
			// right triangle of spoke walls - opposite side
			vertices.push(
				smallCircleRad*Math.cos(ang+angSpokeInc), smallCircleRad*Math.sin(ang+angSpokeInc),-z,
				inRad*Math.cos(ang+angSpokeInc),inRad*Math.sin(ang+angSpokeInc),-z,
				inRad*Math.cos(ang+angSpokeInc),inRad*Math.sin(ang+angSpokeInc),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);

			// left triangle of spoke walls - opposite side
			vertices.push(
				smallCircleRad*Math.cos(ang+angSpokeInc),smallCircleRad*Math.sin(ang+angSpokeInc),-z,
				inRad*Math.cos(ang+angSpokeInc),inRad*Math.sin(ang+angSpokeInc),z,
				smallCircleRad*Math.cos(ang+angSpokeInc),   smallCircleRad*Math.sin(ang+angSpokeInc),z);
			colors.push(arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2],arrColor[0],arrColor[1],arrColor[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]);
		}
		ang += angSpokeInc;
	}
	return [vertices, colors, normals];
}

function calcNormal(x1, y1,  z1,
					x2,  y2,  z2,
					x3,  y3,  z3) {
			  
	var ux = x2-x1, uy = y2-y1, uz = z2-z1;
	var vx = x3-x1, vy = y3-y1, vz = z3-z1;

	return [ uy * vz - uz * vy,
			 uz * vx - ux * vz,
			 ux * vy - uy * vx];
}