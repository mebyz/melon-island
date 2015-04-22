var THREEx	= THREEx	|| {}

THREEx.createGrassTufts	= function(positions,t){
	var geometry	= new THREE.PlaneGeometry(40, 40)
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, geometry.parameters.height/2, 0 ) );
			
	geometry.faces.forEach(function(face){
		face.vertexNormals.forEach(function(normal){
			normal.set(0.0,1.0,0.0).normalize()
		})
	})
	
	var mergedGeo	= new THREE.Geometry();
	for(var i = 0; i < positions.length; i++){
		var position	= positions[i]			
		var baseAngle	= Math.PI*2*i/10
		var g = geometry.clone();
		var rotation = new THREE.Matrix4().makeRotationY(baseAngle);
		g.applyMatrix(rotation);
		var object3d	= new THREE.Mesh(g, material)
		THREEx.GeometryUtils.translate(object3d.geometry,position)
		//THREEx.GeometryUtils.translate(object3d.geometry,new THREE.Vector3(500,0,500))
		mergedGeo.merge( object3d.geometry, object3d.matrix)
		
	}
	if (t!=undefined)
	var textureUrl	= t
		else
	var textureUrl	= 'images/grass01.png'
	var texture	= THREE.ImageUtils.loadTexture(textureUrl)
	var material	= new THREE.MeshPhongMaterial({
		map		: texture,
		alphaTest	: 0.8,
		//side:THREE.DoubleSide
	})
	var mesh	= new THREE.Mesh(mergedGeo, material)
	return mesh	
}

THREEx.createGrassTufts.baseUrl	= "/"

