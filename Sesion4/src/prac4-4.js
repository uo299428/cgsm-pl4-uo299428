import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

if ( WEBGL.isWebGLAvailable() ) {
    // WebGL is available
    console.log('soporta');
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 500 );
    const listener = new THREE.AudioListener();
    camera.add( listener );
    
    //Stats
    const stats = new Stats( );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );
    

    //LeftBox
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const regularFaceMaterial  = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick.jpg" ),
        bumpMap: textureLoader.load( "../textures/brick-map.jpg" )
    } );
    const specialFaceMaterial  = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load( "../textures/Box.png" ),
            bumpMap: textureLoader.load( "../textures/Box-Map.png" )
        } );
    const soundActiveFaceMaterial  = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load( "../textures/Box-sound-active.png" ),
            bumpMap: textureLoader.load( "../textures/Box-Map.png" )
        } );
    //sound
    const audioLoader = new THREE.AudioLoader();
    const sound = new THREE.PositionalAudio( listener );
    audioLoader.load( "../audios/Skullbeatz.ogg", ( buffer ) => {
        sound.setBuffer( buffer );
        sound.setRefDistance( 300 );
        sound.setLoop( true );
        sound.setRolloffFactor( 1 );
        sound.play(); // Modern browsers do not allow sound to start without user interaction
    });

        const materials = [
            soundActiveFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
        ];

    const box = new THREE.Mesh( geometry, materials );
    box.name = "LeftBox";
    box.position.x=-300;
    box.position.z=-100;
    scene.add( box );
    box.add(sound);


  //RightBox
    const geometryRight = new THREE.BoxGeometry( 100, 100, 100 );
    const textureLoaderRight = new THREE.TextureLoader( );  // The object used to load textures
    const regularFaceMaterialRight  = new THREE.MeshPhongMaterial(
    {
        map: textureLoaderRight.load( "../textures/brick.jpg" ),
        bumpMap: textureLoaderRight.load( "../textures/brick-map.jpg" )
    } );
    const specialFaceMaterialRight  = new THREE.MeshPhongMaterial(
        {
            map: textureLoaderRight.load( "../textures/Box.png" ),
            bumpMap: textureLoaderRight.load( "../textures/Box-Map.png" )
      } );
    const soundActiveFaceMaterialRight  = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load( "../textures/Box-sound-active.png" ),
            bumpMap: textureLoader.load( "../textures/Box-Map.png" )
        } );

      const materialsRight = [
          soundActiveFaceMaterialRight,
          regularFaceMaterialRight,
          regularFaceMaterialRight,
          regularFaceMaterialRight,
          regularFaceMaterialRight,
          regularFaceMaterialRight,
      ];

      //sound
    const audioLoaderRight = new THREE.AudioLoader();
    const soundRight = new THREE.PositionalAudio( listener );
    audioLoaderRight.load( "../audios/dog.ogg", ( buffer ) => {
        soundRight.setBuffer( buffer );
        soundRight.setRefDistance( 300 );
        soundRight.setLoop( true );
        soundRight.setRolloffFactor( 1 );
        soundRight.play(); // Modern browsers do not allow sound to start without user interaction
    });

    const boxRight = new THREE.Mesh( geometryRight, materialsRight );
    boxRight.name = "RightBox";
    boxRight.position.x=300;
    boxRight.position.z=-100;
    boxRight.rotation.y += -Math.PI;
    scene.add( boxRight );
    boxRight.add(soundRight);

    
  //Rack
    const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
    helper.position.y = -50.1;
    helper.name = "rack";
    scene.add(helper)

    //Camera Controls
    const controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;
    // scene.add(controls);
    
    //  Light
     const light = new THREE.DirectionalLight(0xffffff, 2, 0, 0);
     light.position.set(0, 0.5, 100);
     scene.add( light );

     const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xf0f0f0, 1 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    //Mouse position
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    //define movements in X and Z edges
    const movements = [
        new THREE.Vector3(0, 0, 1),   // Forward
        new THREE.Vector3(1, 0, 1),   // Forward-left
        new THREE.Vector3(1, 0, 0),   // Left
        new THREE.Vector3(1, 0, -1),  // Backward-left
        new THREE.Vector3(0, 0, -1),  // Backward
        new THREE.Vector3(-1, 0, -1), // Backward-right
        new THREE.Vector3(-1, 0, 0),  // Right
        new THREE.Vector3(-1, 0, 1)   // Forward-right
    ];
    


    renderer.render( scene, camera );

    setInterval(animate, 1000);

    const clock = new THREE.Clock( );

    function animate( ) {

        const delta = clock.getDelta( ); // Elapsed time in seconds
        controls.update( delta );   
        stats.update( );
        //added code in functions to organize them
        intersectObject();   
        detectCollisions(delta);
        // Render the scene
        renderer.render( scene, camera );

        // Request the browser to execute the animation-rendering loop
        requestAnimationFrame( animate );
    };

    document.body.addEventListener( 'keydown', ( event ) => {

        // Space key code
        const spaceKeyCode = 32;
    
        // Space pressed and intersected object
        if ( event.keyCode === spaceKeyCode && intersectedObject ) {
    
            if(intersectedObject.name == box.name){
            if ( sound.isPlaying === true ){
                sound.pause();
                box.material[ 0 ] = specialFaceMaterial;
                box.material.needsUpdate = true;
            }
            else{
                sound.play();
                box.material[ 0 ] = soundActiveFaceMaterial;
                box.material.needsUpdate = true;
            }
            }
            else{
                if(intersectedObject.name == boxRight.name){
                    if ( soundRight.isPlaying === true ){
                        soundRight.pause();
                        boxRight.material[ 0 ] = specialFaceMaterialRight;
                        boxRight.material.needsUpdate = true;
                    }
                    else{
                        soundRight.play();
                        boxRight.material[ 0 ] = soundActiveFaceMaterialRight;
                        boxRight.material.needsUpdate = true;
                    }
            }
        }

        }
    }, false );

    document.body.addEventListener( 'mousemove', ( event ) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );

function detectCollisions(delta){
    movements.forEach(direction => {
        let collisions;
        const distance = 20; // Maximum distance of a collision
    
        rayCaster.set( camera.position, direction );
        collisions = rayCaster.intersectObjects( scene.children );
        if ( collisions.length > 0 && collisions[0].distance <= distance ) {
    
            controls.update( -delta );
        }
        });
}
function intersectObject(){
    rayCaster.setFromCamera( mouse, camera );
    // Look for all the intersected objects
    const intersects = rayCaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        // Sorted by Z (close to the camera)
        if ( intersectedObject != intersects[ 0 ].object ) {

            intersectedObject = intersects[ 0 ].object;
            console.log( 'New intersected object: ' + intersectedObject.name );
        }
    } else {

        intersectedObject = null;
    }
}
}
