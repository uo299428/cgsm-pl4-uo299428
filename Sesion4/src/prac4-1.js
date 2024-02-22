import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

if ( WEBGL.isWebGLAvailable() ) {
    // WebGL is available
    console.log('soporta')
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
            specialFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
            regularFaceMaterial,
        ];

    const box = new THREE.Mesh( geometry, materials );
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

      const materialsRight = [
          specialFaceMaterialRight,
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
  boxRight.position.x=300;
  boxRight.position.z=-100;
  boxRight.rotation.y += -Math.PI;
  scene.add( boxRight );
  boxRight.add(soundRight);


  //Rack
    const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
    helper.position.y = -50.1;
    scene.add(helper)

    //Camera Controls
    const controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;
    // scene.add(controls);
    
     //Light
    //  const light = new THREE.DirectionalLight(0xffffff, 2, 0, 0);
    //  light.position.set(0, 0.5, 100);
    //  scene.add( light );

     const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xf0f0f0, 0.6 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );


    renderer.render( scene, camera );

    setInterval(rotate, 1000);

    const clock = new THREE.Clock( );

    function rotate( ) {

        const delta = clock.getDelta( ); // Elapsed time in seconds
        controls.update( delta );

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        const rotation = ( delta * Math.PI * 2 ) / 24;
        

        // specialFaceMaterial.bumpScale = controlData.bumpScale;
        // regularFaceMaterial.bumpScale = controlDataReg.bumpScale;

        // specialFaceMaterialRight.bumpScale = controlDataRight.bumpScale;
        // regularFaceMaterialRight.bumpScale = controlDataRegRight.bumpScale;

        stats.update( );

        // Render the scene
        renderer.render( scene, camera );

        // Request the browser to execute the animation-rendering loop
        requestAnimationFrame( rotate );
    };


    window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );
}
