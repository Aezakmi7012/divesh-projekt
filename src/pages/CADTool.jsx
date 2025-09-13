import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import './CADTool.css';

// CAD Tool component - converted from cad.html with React integration
const CADTool = () => {
  // Refs for Three.js objects and DOM elements
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const mainBlockRef = useRef(null);
  const sketchGroupRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const cadObjectsRef = useRef([]);

  // React state for the CAD application
  const [isSketchModeActive, setIsSketchModeActive] = useState(false);
  const [waitingForFaceSelection, setWaitingForFaceSelection] = useState(false);
  const [waitingForChamferSelection, setWaitingForChamferSelection] = useState(false);
  const [drawingTool, setDrawingTool] = useState(null);
  const [sketchPlane, setSketchPlane] = useState(null);
  const [savedCameraState, setSavedCameraState] = useState({});
  const [infoMessage, setInfoMessage] = useState("Welcome! Click 'Start Sketch' to begin.");
  const [extrudeDisabled, setExtrudeDisabled] = useState(true);

  // Initialize Three.js scene when component mounts (only once)
  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Add grid helper
    scene.add(new THREE.GridHelper(20, 20));

    // Initialize sketch group
    const sketchGroup = new THREE.Group();
    scene.add(sketchGroup);
    sketchGroupRef.current = sketchGroup;

    // Create initial main block
    createMainBlock(new THREE.BoxGeometry(4, 1, 4));

    // Start animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Add event listeners
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate useEffect for click handling that doesn't re-initialize the scene
  useEffect(() => {
    const handleClick = (event) => {
      // Skip if clicking on UI panels
      if (event.target.closest('.panel')) return;

      const mouse = mouseRef.current;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouse, cameraRef.current);

      if (waitingForFaceSelection) {
        const intersects = raycaster.intersectObjects(cadObjectsRef.current, true);
        if (intersects.length > 0) {
          setWaitingForFaceSelection(false);
          enterSketchMode(intersects[0]);
        }
      } else if (waitingForChamferSelection) {
        const intersects = raycaster.intersectObjects(cadObjectsRef.current, true);
        if (intersects.length > 0) {
          setWaitingForChamferSelection(false);
          const chamferSize = prompt("Enter chamfer size:", "0.1");
          if (chamferSize) {
            const size = parseFloat(chamferSize);
            if (!isNaN(size) && size > 0) {
              applyChamferToObject(intersects[0].object, size);
            } else {
              alert("Invalid chamfer size.");
            }
          }
        }
      } else if (isSketchModeActive && drawingTool && sketchPlane) {
        const intersects = raycaster.intersectObject(sketchPlane);
        if (intersects.length > 0) {
          drawShapeOnSketchPlane(intersects[0].point);
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [waitingForFaceSelection, waitingForChamferSelection, isSketchModeActive, drawingTool, sketchPlane]);

  // Function to create the main block (converted from original)
  const createMainBlock = (geometry) => {
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x007bff, 
      metalness: 0.1, 
      roughness: 0.6 
    });
    const mainBlock = new THREE.Mesh(geometry, material);
    mainBlock.name = "mainBlock";
    sceneRef.current.add(mainBlock);
    mainBlockRef.current = mainBlock;
    cadObjectsRef.current = [mainBlock];
  };

  // Function to enter sketch mode (converted from original)
  const enterSketchMode = (intersection) => {
    sketchGroupRef.current.clear();
    setIsSketchModeActive(true);
    controlsRef.current.enabled = false;

    // Save camera state
    const camera = cameraRef.current;
    setSavedCameraState({
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone()
    });

    // Create sketch plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
    );
    plane.position.copy(intersection.point);
    plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), intersection.face.normal);
    sceneRef.current.add(plane);
    setSketchPlane(plane);

    // Position camera
    const normal = intersection.face.normal.clone();
    camera.position.copy(intersection.point.clone().add(normal.multiplyScalar(8)));
    camera.lookAt(intersection.point);

    setInfoMessage("Sketch Mode: Select a tool to define dimensions.");
  };

  // Function to draw shapes on sketch plane (converted from original)
  const drawShapeOnSketchPlane = (point) => {
    if (!drawingTool) return;

    let geometry, sketchObject;
    const sketchMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffa500, 
      side: THREE.DoubleSide 
    });

    if (drawingTool.type === 'circle') {
      geometry = new THREE.CircleGeometry(drawingTool.radius, 32);
      sketchObject = new THREE.Mesh(geometry, sketchMaterial);
      sketchObject.userData = { 
        shapeType: 'circle', 
        radius: drawingTool.radius 
      };
    } else if (drawingTool.type === 'rect') {
      geometry = new THREE.PlaneGeometry(drawingTool.width, drawingTool.height);
      sketchObject = new THREE.Mesh(geometry, sketchMaterial);
      sketchObject.userData = { 
        shapeType: 'rect', 
        width: drawingTool.width, 
        height: drawingTool.height 
      };
    }

    if (sketchObject) {
      sketchObject.position.copy(point);
      sketchObject.quaternion.copy(sketchPlane.quaternion);
      sketchGroupRef.current.add(sketchObject);
      setDrawingTool(null);
      setInfoMessage("Shape placed. Select another tool or Finish.");
    }
  };

  // Function to finish sketch (converted from original)
  const finishSketch = () => {
    setIsSketchModeActive(false);
    controlsRef.current.enabled = true;
    setDrawingTool(null);

    if (sketchPlane) {
      sceneRef.current.remove(sketchPlane);
      setSketchPlane(null);
    }

    // Restore camera state
    const camera = cameraRef.current;
    camera.position.copy(savedCameraState.position);
    camera.quaternion.copy(savedCameraState.quaternion);

    if (sketchGroupRef.current.children.length > 0) {
      setExtrudeDisabled(false);
      setInfoMessage("Sketch finished. Ready to extrude.");
    } else {
      setInfoMessage("Sketch cancelled.");
    }
  };

  // Function to perform extrusion (converted from original)
  const performExtrusion = () => {
    if (sketchGroupRef.current.children.length === 0) {
      alert("There are no sketch elements to extrude.");
      return;
    }

    const depthStr = prompt("Enter extrusion length:", "2.0");
    if (!depthStr) return;

    const extrusionDepth = parseFloat(depthStr);
    if (isNaN(extrusionDepth) || extrusionDepth <= 0) {
      alert("Please enter a valid positive number for the length.");
      return;
    }

    for (const sketch of sketchGroupRef.current.children) {
      let toolGeometry;
      const data = sketch.userData;

      if (data.shapeType === 'circle') {
        toolGeometry = new THREE.CylinderGeometry(
          data.radius, 
          data.radius, 
          extrusionDepth, 
          32
        );
        toolGeometry.rotateX(Math.PI / 2);
      } else if (data.shapeType === 'rect') {
        toolGeometry = new THREE.BoxGeometry(
          data.width, 
          data.height, 
          extrusionDepth
        );
      }

      if (toolGeometry) {
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x007bff, 
          metalness: 0.1, 
          roughness: 0.6 
        });
        const extrudedMesh = new THREE.Mesh(toolGeometry, material);
        extrudedMesh.position.copy(sketch.position);
        extrudedMesh.quaternion.copy(sketch.quaternion);
        extrudedMesh.translateZ(extrusionDepth / 2);
        extrudedMesh.name = "extrusion";
        sceneRef.current.add(extrudedMesh);
        cadObjectsRef.current.push(extrudedMesh);
      }
    }

    sketchGroupRef.current.clear();
    setExtrudeDisabled(true);
    setInfoMessage("Extrusion complete. You can now sketch on the new shapes.");
  };

  // Function to apply chamfer (converted from original)
  const applyChamferToObject = (mesh, chamferSize) => {
    if (!(mesh.geometry instanceof THREE.BoxGeometry)) {
      alert("Chamfer is currently only supported for rectangular objects.");
      return;
    }

    const params = mesh.geometry.parameters;
    const w = params.width, h = params.height, d = params.depth;

    const shape = new THREE.Shape()
      .moveTo(-w/2, -h/2)
      .lineTo(w/2, -h/2)
      .lineTo(w/2, h/2)
      .lineTo(-w/2, h/2)
      .closePath();

    const extrudeSettings = {
      steps: 1,
      depth: d,
      bevelEnabled: true,
      bevelThickness: chamferSize,
      bevelSize: chamferSize,
      bevelOffset: -chamferSize,
      bevelSegments: 2
    };

    const newGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    newGeometry.center();

    const newMesh = new THREE.Mesh(newGeometry, mesh.material);
    newMesh.position.copy(mesh.position);
    newMesh.quaternion.copy(mesh.quaternion);
    newMesh.name = mesh.name;

    sceneRef.current.remove(mesh);
    const index = cadObjectsRef.current.indexOf(mesh);
    if (index > -1) {
      cadObjectsRef.current.splice(index, 1, newMesh);
    }
    if (mesh === mainBlockRef.current) {
      mainBlockRef.current = newMesh;
    }

    sceneRef.current.add(newMesh);
    setInfoMessage(`Chamfer of size ${chamferSize} applied.`);
  };

  // Function to export to STL (converted from original)
  const exportToSTL = () => {
    const geometries = [];
    
    cadObjectsRef.current.forEach(mesh => {
      const geometry = mesh.geometry.clone();
      mesh.updateMatrixWorld();
      geometry.applyMatrix4(mesh.matrixWorld);
      geometries.push(geometry);
    });

    if (geometries.length === 0) {
      alert("Model is empty, nothing to export.");
      return;
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    const tempMesh = new THREE.Mesh(mergedGeometry);
    
    const exporter = new STLExporter();
    const result = exporter.parse(tempMesh, { binary: false });

    saveStringAsFile(result, 'cad_model.stl');
    setInfoMessage("Model exported as cad_model.stl");
  };

  // Helper function to save file (converted from original)
  const saveStringAsFile = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Event handlers for UI buttons
  const handleStartSketch = () => {
    setWaitingForFaceSelection(true);
    setInfoMessage("Select a face on any model to begin your sketch.");
  };

  const handleChamfer = () => {
    setWaitingForChamferSelection(true);
    setInfoMessage("Select a rectangular object to apply chamfer.");
  };

  const handleDrawCircle = () => {
    const radiusStr = prompt("Enter circle radius:", "0.5");
    if (!radiusStr) return;
    
    const radius = parseFloat(radiusStr);
    if (isNaN(radius) || radius <= 0) {
      alert("Invalid radius.");
      return;
    }
    
    setDrawingTool({ type: 'circle', radius });
    setInfoMessage(`Radius set to ${radius}. Click surface to place.`);
  };

  const handleDrawRect = () => {
    const widthStr = prompt("Enter rectangle width:", "1.0");
    if (!widthStr) return;
    
    const width = parseFloat(widthStr);
    if (isNaN(width) || width <= 0) {
      alert("Invalid width.");
      return;
    }
    
    const heightStr = prompt("Enter rectangle height:", "0.75");
    if (!heightStr) return;
    
    const height = parseFloat(heightStr);
    if (isNaN(height) || height <= 0) {
      alert("Invalid height.");
      return;
    }
    
    setDrawingTool({ type: 'rect', width, height });
    setInfoMessage(`Rectangle set to ${width}x${height}. Click surface.`);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="cad-container">
      {/* 3D viewport container */}
      <div ref={mountRef} className="cad-viewport" />

      {/* UI Panel */}
      <div className="panel ui-panel">
        <h3>CAD Tools</h3>
        <button 
          className={waitingForFaceSelection ? 'active' : ''}
          onClick={handleStartSketch}
        >
          1. Start Sketch
        </button>
        <button 
          disabled={extrudeDisabled}
          onClick={performExtrusion}
        >
          2. Extrude Sketch
        </button>
        <button 
          className={waitingForChamferSelection ? 'active' : ''}
          onClick={handleChamfer}
        >
          3. Apply Chamfer
        </button>
        <hr />
        <button className="export" onClick={exportToSTL}>
          Download STL
        </button>
        <button onClick={handleReset}>
          Reset Model
        </button>
      </div>

      {/* Sketch Panel - only visible in sketch mode */}
      {isSketchModeActive && (
        <div className="panel sketch-panel">
          <h4>Sketch Tools</h4>
          <button onClick={handleDrawCircle}>Draw Circle...</button>
          <button onClick={handleDrawRect}>Draw Rectangle...</button>
          <hr />
          <button onClick={finishSketch}>Finish Sketch</button>
        </div>
      )}

      {/* Info Box */}
      <div className="info-box">
        {infoMessage}
      </div>
    </div>
  );
};

export default CADTool;