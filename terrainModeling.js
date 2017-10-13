/**
 * Iteratively generate terrain from numeric inputs
 * @param {number} n
 * @param {number} minX Minimum X value
 * @param {number} maxX Maximum X value
 * @param {number} minY Minimum Y value
 * @param {number} maxY Maximum Y value
 * @param {Array} vertexArray Array that will contain vertices generated
 * @param {Array} faceArray Array that will contain faces generated
 * @param {Array} normalArray Array that will contain normals generated
 * @return {number}
 */
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
	
		var heightMap = terrainDiamondSquare(minX, maxX, minY, maxY, 6); 
	
    for(var i=0;i<=n;i++) { 
       for(var j=0;j<=n;j++)
       {
				 	xCoord = minX+deltaX*j;
				 yCoord = minY+deltaY*i
           vertexArray.push(xCoord);
           vertexArray.push(yCoord);
           vertexArray.push(searchHeightMap(xCoord, yCoord, heightMap));
           
       }
		}
		normalArray2 = Array(vertexArray.length).fill(0);
    var numT=0;
    for(var i=0;i<n;i++) { 
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
				 	
				 		var normal = vec3.create();
				 		var vector1 = vec3.create();
				 		var vector2 = vec3.create();
				 
				 //create two vectors from the three points, stemming from a common point
				 //todo fix normals
				 		vec3.subtract(vector1, getVertex(vid+1, vertexArray), getVertex(vid, vertexArray));
				 		vec3.subtract(vector2, getVertex(vid+n+1, vertexArray), getVertex(vid, vertexArray));
				 		vec3.cross(normal, vector1, vector2);
				 		vec3.normalize(normal, normal);
				 		//console.log(vector1);
				 		addtoArray(vid, normal, normalArray2);
				 		addtoArray(vid+1, normal, normalArray2);
				 		addtoArray(vid+n+1, normal, normalArray2);
				 
				 
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
				 
				 		vec3.subtract(vector1, getVertex(vid+1+n+1, vertexArray), getVertex(vid+1, vertexArray));
				 		vec3.subtract(vector2, getVertex(vid+n+1, vertexArray), getVertex(vid+1, vertexArray));
				 		vec3.cross(normal, vector1, vector2);
				 		vec3.normalize(normal, normal);
				 		addtoArray(vid+1, normal, normalArray2);
				 		addtoArray(vid+1+n+1, normal, normalArray2);
				 		addtoArray(vid+n+1, normal, normalArray2);
           numT+=2;
       }
		}
	//normalArray.push(1);
		//console.log(vertexArray);
		for(i = 0; i < normalArray2.length / 3; i++) {
				var combinedNormal = vec3.create();
				combinedNormal[0] = normalArray2[i*3];
				combinedNormal[1] = normalArray2[i*3+1];
				combinedNormal[2] = normalArray2[i*3+2];
			
				vec3.normalize(combinedNormal, combinedNormal);
				normalArray.push(combinedNormal[0]);
				normalArray.push(combinedNormal[1]);
				normalArray.push(combinedNormal[2]);
		}
		console.log(normalArray);
		
    return numT;
}

function addtoArray(id, normal, normalArray) {
		//console.log(normal);
		normalArray[id*3] = normalArray[id*3] + normal[0];
		normalArray[id*3 + 1] = normalArray[id*3 + 1] + normal[1];
		normalArray[id*3 + 2] = normalArray[id*3 + 2] + normal[2];
}

function DiamondSquare(a, b, c, d, numIterations, heightMap, scalar) {

    var diamondVertex = vec3.create();
		vec4.lerp(diamondVertex, a, c, 0.5);
		newScalar = scalar * numIterations;
	
		diamondVertex[2] = diamondVertex[2] + randomizer(newScalar);
		//console.log(newScalar);
	heightMap.push(diamondVertex);
    if(numIterations > 0) {

        var leftSVertex = vec3.create();
        vec4.lerp(leftSVertex, a, b, 0.5);
        leftSVertex[2] = (leftSVertex[2] * 2 + diamondVertex[2])/3 + randomizer(newScalar);
heightMap.push(leftSVertex);
        var topSVertex = vec3.create();
        vec4.lerp(topSVertex, b, c, 0.5);
        topSVertex[2] = (topSVertex[2] * 2 + diamondVertex[2])/3 + randomizer(newScalar);
heightMap.push(topSVertex);
        var rightSVertex = vec3.create();
        vec4.lerp(rightSVertex, c, d, 0.5);
        rightSVertex[2] = (rightSVertex[2] * 2 + diamondVertex[2])/3 + randomizer(newScalar);
heightMap.push(rightSVertex);
        var bottomSVertex = vec3.create();
        vec4.lerp(bottomSVertex, d, a, 0.5);
        bottomSVertex[2] = (bottomSVertex[2] * 2 + diamondVertex[2])/3 + randomizer(newScalar);

        heightMap.push(bottomSVertex);
			numIterations = numIterations - 1;
        DiamondSquare(leftSVertex, b, topSVertex, diamondVertex, numIterations, heightMap, scalar);
        DiamondSquare(diamondVertex, topSVertex, c, rightSVertex, numIterations, heightMap, scalar);
        DiamondSquare(bottomSVertex, diamondVertex, rightSVertex, d, numIterations, heightMap, scalar);
        DiamondSquare(a, leftSVertex, diamondVertex, bottomSVertex, numIterations, heightMap, scalar);

    } else {
//        heightMap.push(a);
//				heightMap.push(b);
//				heightMap.push(c);
//				heightMap.push(d);
    }
}

function terrainDiamondSquare(minX, maxX, minY, maxY, num) 
{
    //initialize corner values
		heightMap = [];
    var a = vec3.fromValues(-1.0, -1.0, 0.0);
    var b = vec3.fromValues(-1.0, 1.0, 0.0);
    var c = vec3.fromValues(1.0, 1.0, 0.0);
    var d = vec3.fromValues(1.0, -1.0, 0.0);
	      heightMap.push(a);
				heightMap.push(b);
				heightMap.push(c);
				heightMap.push(d);
    var scalar = 0.02	;
   	DiamondSquare(a, b, c, d, num, heightMap, scalar);
	console.log(heightMap);
return heightMap;
   
}

function randomizer(scalar) {
    return (Math.random() - 0.5) * scalar;
}

function searchHeightMap(x,y, heightMap) {
		for(i = 0; i < heightMap.length; i++) {
				if(heightMap[i][0] == x && heightMap[i][1] == y) {
					return heightMap[i][2];
				}
		}
	return 0;
}

function getVertex(id, vertexArray) {
		var vertex = vec3.create();
		vertex[0] = vertexArray[id * 3];
		vertex[1] = vertexArray[id * 3 + 1];
		vertex[2] = vertexArray[id * 3 + 2];
	//console.log(vertex);
	return vertex;
}

/**
 * Generates line values from faces in faceArray
 * @param {Array} faceArray array of faces for triangles
 * @param {Array} lineArray array of normals for triangles, storage location after generation
 */
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}


