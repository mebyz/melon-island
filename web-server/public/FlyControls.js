/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

  var scope = this;
  scope.rY = 0;
  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y = movementX * 0.002;
    scope.rY+=event.movementX/100* PI_2

    if (blendMesh.position !=undefined) {
                controls.getObject().position.x= blendMesh.position.x+Math.cos(event.offsetX)-10
    
                controls.getObject().position.z=blendMesh.position.z+Math.sin(event.offsetX)-10
                var lookAtVector = new THREE.Vector3(0,0, -1);
lookAtVector.applyQuaternion(blendMesh.quaternion);
controls.getObject().lookAt(lookAtVector)
            }
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

    $('#pos2').html(scope.rY)
    if (blendMesh.position != undefined) {
      blendMesh.rotation.y = -scope.rY
    }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );

  this.enabled = false;

  this.getObject = function () {

    return yawObject;

  };

  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( v ) {

      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    }

  }();

};