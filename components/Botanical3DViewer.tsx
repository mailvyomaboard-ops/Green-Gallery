"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCcw, Play, Pause, Layers, Eye, Info, Check } from "lucide-react";

export type PlantType = "tree" | "monstera" | "palm";

interface Botanical3DViewerProps {
  className?: string;
  initialPlant?: PlantType;
  enableScrollRotation?: boolean;
}

export function Botanical3DViewer({
  className = "",
  initialPlant = "tree",
  enableScrollRotation = true,
}: Botanical3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePlant, setActivePlant] = useState<PlantType>(initialPlant);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activePin, setActivePin] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const plantGroupRef = useRef<THREE.Group | null>(null);
  const leavesFieldRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: 0 });
  const autoRotateRef = useRef(isAutoRotating);
  autoRotateRef.current = isAutoRotating;

  // Hotspot annotations data
  const hotspotData = [
    {
      id: 1,
      title: "Acclimatized Foliage Canopy",
      description: "Dense, healthy chlorophyll layers acclimatized for Pune sunlight and climate.",
      positionClass: "top-[25%] left-[28%]",
    },
    {
      id: 2,
      title: "Engineered Lightweight Media",
      description: "Coco-peat, volcanic pumice, and organic compost formulated for rapid root aeration.",
      positionClass: "bottom-[28%] right-[26%]",
    },
    {
      id: 3,
      title: "Architectural Planter & Drainage",
      description: "Fiberglass weather-resistant planter with integrated sub-slab drainage reserve.",
      positionClass: "bottom-[12%] left-[46%]",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SETUP SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. LIGHTING RIG
    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xfff6e5, 3.2);
    sunLight.position.set(4, 8, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Lush Emerald Ambient Fill
    const ambientLight = new THREE.AmbientLight(0x0a2f1d, 1.4);
    scene.add(ambientLight);

    // Soft Mint Rim Light (brings out leaf edges like Apple / Awwwards 3D)
    const rimLight = new THREE.DirectionalLight(0x52b788, 2.0);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    // Hemisphere Light (sky vs ground bounce)
    const hemiLight = new THREE.HemisphereLight(0xd8f3dc, 0x081c15, 0.9);
    scene.add(hemiLight);

    // 3. MASTER PLANT GROUP
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);
    plantGroupRef.current = plantGroup;

    // 4. FLOATING 3D LEAF FIELD (20 organic leaves tumbling in 3D space)
    const floatingLeaves: THREE.Mesh[] = [];
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -0.2);
    leafShape.quadraticCurveTo(0.18, 0, 0.14, 0.25);
    leafShape.quadraticCurveTo(0, 0.42, 0, 0.45);
    leafShape.quadraticCurveTo(0, 0.42, -0.14, 0.25);
    leafShape.quadraticCurveTo(-0.18, 0, 0, -0.2);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2dd48f,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(leafGeo, leafMat.clone());
      // Randomize color slightly between rich emerald and lime
      (mesh.material as THREE.MeshStandardMaterial).color.setHSL(0.38 + Math.random() * 0.08, 0.75, 0.45 + Math.random() * 0.15);
      
      mesh.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3.5 + 0.8,
        (Math.random() - 0.5) * 3.0
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = 0.3 + Math.random() * 0.4;
      mesh.scale.set(scale, scale, scale);

      // Custom velocity attributes
      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        initialY: mesh.position.y,
        floatSpeed: 0.005 + Math.random() * 0.008,
        driftPhase: Math.random() * Math.PI * 2,
      };

      scene.add(mesh);
      floatingLeaves.push(mesh);
    }
    leavesFieldRef.current = floatingLeaves;

    // BUILD INITIAL PLANT
    buildPlantModel(activePlant, plantGroup);
    setIsLoaded(true);

    // 5. ANIMATION LOOP (120 FPS GPU Render)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Inertia damping and smooth rotation
      if (plantGroupRef.current) {
        if (!isDraggingRef.current && autoRotateRef.current) {
          targetRotationRef.current.y += 0.006;
        }

        // Apply rotational inertia
        plantGroupRef.current.rotation.y += (targetRotationRef.current.y - plantGroupRef.current.rotation.y) * 0.08;
        plantGroupRef.current.rotation.x += (targetRotationRef.current.x - plantGroupRef.current.rotation.x) * 0.08;

        // Subtle organic breathing float
        plantGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.04 - 0.4;
      }

      // Animate floating 3D leaves tumbling in wind
      leavesFieldRef.current.forEach((leaf, idx) => {
        leaf.rotation.x += leaf.userData.rotSpeedX;
        leaf.rotation.y += leaf.userData.rotSpeedY;
        leaf.rotation.z += leaf.userData.rotSpeedZ;

        // Vertical floating sine wave
        leaf.position.y = leaf.userData.initialY + Math.sin(elapsedTime * 1.8 + leaf.userData.driftPhase) * 0.18;
        // Subtle horizontal sway
        leaf.position.x += Math.cos(elapsedTime * 1.2 + idx) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. SCROLL ROTATION LINK (120fps passive)
    const handleScroll = () => {
      if (enableScrollRotation && !isDraggingRef.current) {
        targetRotationRef.current.y = window.scrollY * 0.0035;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 7. MOUSE / TOUCH DRAG ORBIT
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.35, Math.min(0.45, targetRotationRef.current.x + deltaY * 0.006));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.35, Math.min(0.45, targetRotationRef.current.x + deltaY * 0.006));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 8. RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      resizeObserver.disconnect();

      if (container && dom && dom.parentNode === container) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [enableScrollRotation]);

  // Re-build 3D plant when activePlant changes
  useEffect(() => {
    if (plantGroupRef.current) {
      buildPlantModel(activePlant, plantGroupRef.current);
    }
  }, [activePlant]);

  /**
   * Procedural High-Performance 3D Botanical Mesh Builder
   * Creates 3 distinct organic specimens:
   * 1. Architectural Canopy Tree (Ficus / Specimen Bonsai)
   * 2. Tropical Monstera Deliciosa (Lush Swiss-Cheese Foliage)
   * 3. Royal Palm (Cascading Fronds)
   */
  function buildPlantModel(type: PlantType, group: THREE.Group) {
    // Clear previous children cleanly
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      if ((obj as THREE.Mesh).material) {
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }

    // SHARED ARCHITECTURAL PLANTER POT
    const potGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.9, 32);
    const potMat = new THREE.MeshStandardMaterial({
      color: 0x181c19, // Modern charcoal matte concrete
      roughness: 0.6,
      metalness: 0.15,
    });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = -0.55;
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);

    // Pot Lip Ring
    const lipGeo = new THREE.TorusGeometry(0.72, 0.05, 16, 32);
    const lipMat = new THREE.MeshStandardMaterial({ color: 0x242b26, roughness: 0.5 });
    const lip = new THREE.Mesh(lipGeo, lipMat);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = -0.1;
    group.add(lip);

    // Dark Potting Soil Substrate
    const soilGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.1, 32);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x120e0a, roughness: 0.95 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -0.12;
    group.add(soil);

    // MATERIALS
    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3525,
      roughness: 0.85,
      metalness: 0.05,
    });

    const leafEmeraldMat = new THREE.MeshStandardMaterial({
      color: 0x1f9d55,
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const leafLimeMat = new THREE.MeshStandardMaterial({
      color: 0x2dd48f,
      roughness: 0.28,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const leafDeepMat = new THREE.MeshStandardMaterial({
      color: 0x0f5132,
      roughness: 0.38,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    if (type === "tree") {
      // 1. ARCHITECTURAL CANOPY TREE
      // Curved Main Trunk
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.15, 0),
        new THREE.Vector3(0.08, 0.4, -0.05),
        new THREE.Vector3(-0.06, 0.9, 0.04),
        new THREE.Vector3(0, 1.4, 0),
      ]);
      const trunkGeo = new THREE.TubeGeometry(trunkCurve, 24, 0.15, 12, false);
      const trunk = new THREE.Mesh(trunkGeo, barkMat);
      trunk.castShadow = true;
      group.add(trunk);

      // Branch 1: Left Arch
      const b1Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.04, 0.85, 0.03),
        new THREE.Vector3(-0.45, 1.15, 0.15),
        new THREE.Vector3(-0.85, 1.4, 0.1),
      ]);
      const b1Geo = new THREE.TubeGeometry(b1Curve, 16, 0.08, 8, false);
      const b1 = new THREE.Mesh(b1Geo, barkMat);
      b1.castShadow = true;
      group.add(b1);

      // Branch 2: Right Arch
      const b2Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.02, 1.0, -0.02),
        new THREE.Vector3(0.5, 1.25, -0.15),
        new THREE.Vector3(0.9, 1.45, -0.1),
      ]);
      const b2Geo = new THREE.TubeGeometry(b2Curve, 16, 0.08, 8, false);
      const b2 = new THREE.Mesh(b2Geo, barkMat);
      b2.castShadow = true;
      group.add(b2);

      // Branch 3: Back Center
      const b3Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.2, 0),
        new THREE.Vector3(0.1, 1.6, -0.3),
        new THREE.Vector3(-0.1, 1.9, -0.2),
      ]);
      const b3Geo = new THREE.TubeGeometry(b3Curve, 16, 0.07, 8, false);
      const b3 = new THREE.Mesh(b3Geo, barkMat);
      b3.castShadow = true;
      group.add(b3);

      // Lush Layered Foliage Cloud Clusters
      const foliageCenters = [
        { pos: new THREE.Vector3(-0.85, 1.5, 0.1), scale: 0.65, mat: leafEmeraldMat },
        { pos: new THREE.Vector3(-0.55, 1.7, 0.25), scale: 0.55, mat: leafLimeMat },
        { pos: new THREE.Vector3(0.9, 1.55, -0.1), scale: 0.7, mat: leafEmeraldMat },
        { pos: new THREE.Vector3(0.6, 1.75, -0.25), scale: 0.58, mat: leafLimeMat },
        { pos: new THREE.Vector3(0, 2.05, 0), scale: 0.85, mat: leafLimeMat },
        { pos: new THREE.Vector3(0.25, 2.25, 0.15), scale: 0.6, mat: leafEmeraldMat },
        { pos: new THREE.Vector3(-0.3, 2.2, -0.15), scale: 0.62, mat: leafDeepMat },
        { pos: new THREE.Vector3(0.1, 1.5, 0.35), scale: 0.5, mat: leafEmeraldMat },
      ];

      foliageCenters.forEach((f) => {
        const fGeo = new THREE.DodecahedronGeometry(f.scale, 2);
        const fMesh = new THREE.Mesh(fGeo, f.mat);
        fMesh.position.copy(f.pos);
        fMesh.castShadow = true;
        group.add(fMesh);
      });
    } else if (type === "monstera") {
      // 2. TROPICAL MONSTERA DELICIOSA (BROAD BIOPHILIC LEAVES)
      const leafCount = 8;
      for (let i = 0; i < leafCount; i++) {
        const angle = (i / leafCount) * Math.PI * 2 + (i % 2) * 0.2;
        const radius = 0.7 + (i % 3) * 0.25;
        const height = 0.9 + (i % 3) * 0.35;

        // Arching Stem
        const stemCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.1, 0),
          new THREE.Vector3(Math.cos(angle) * 0.3, height * 0.5, Math.sin(angle) * 0.3),
          new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius),
        ]);
        const stemGeo = new THREE.TubeGeometry(stemCurve, 16, 0.035, 8, false);
        const stem = new THREE.Mesh(stemGeo, leafEmeraldMat);
        group.add(stem);

        // Broad Fenestrated Monstera Leaf Mesh
        const mShape = new THREE.Shape();
        mShape.moveTo(0, 0);
        mShape.bezierCurveTo(0.35, 0.2, 0.55, 0.6, 0.3, 0.95);
        mShape.bezierCurveTo(0.15, 1.15, 0, 1.25, 0, 1.3);
        mShape.bezierCurveTo(0, 1.25, -0.15, 1.15, -0.3, 0.95);
        mShape.bezierCurveTo(-0.55, 0.6, -0.35, 0.2, 0, 0);

        const mGeo = new THREE.ShapeGeometry(mShape);
        const mMat = i % 2 === 0 ? leafEmeraldMat : leafLimeMat;
        const mLeaf = new THREE.Mesh(mGeo, mMat);

        mLeaf.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
        mLeaf.rotation.x = -Math.PI / 3.2;
        mLeaf.rotation.y = angle - Math.PI / 2;
        mLeaf.rotation.z = 0.2 * (i % 2 === 0 ? 1 : -1);
        mLeaf.scale.set(0.75, 0.75, 0.75);
        mLeaf.castShadow = true;
        group.add(mLeaf);
      }
    } else if (type === "palm") {
      // 3. EXOTIC ROYAL / FOXTAIL PALM
      // Slender Ringed Trunk Column
      const pCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.15, 0),
        new THREE.Vector3(0.03, 0.8, -0.02),
        new THREE.Vector3(-0.02, 1.6, 0.03),
        new THREE.Vector3(0, 2.1, 0),
      ]);
      const pTrunkGeo = new THREE.TubeGeometry(pCurve, 24, 0.11, 12, false);
      const pTrunk = new THREE.Mesh(pTrunkGeo, barkMat);
      pTrunk.castShadow = true;
      group.add(pTrunk);

      // Crown of Cascading Palm Fronds
      const frondCount = 12;
      for (let i = 0; i < frondCount; i++) {
        const fAngle = (i / frondCount) * Math.PI * 2;
        const frondCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 2.1, 0),
          new THREE.Vector3(Math.cos(fAngle) * 0.7, 2.35, Math.sin(fAngle) * 0.7),
          new THREE.Vector3(Math.cos(fAngle) * 1.4, 2.05, Math.sin(fAngle) * 1.4),
          new THREE.Vector3(Math.cos(fAngle) * 1.9, 1.4, Math.sin(fAngle) * 1.9),
        ]);
        const frondGeo = new THREE.TubeGeometry(frondCurve, 20, 0.03, 6, false);
        const frond = new THREE.Mesh(frondGeo, leafEmeraldMat);
        group.add(frond);

        // Feathered Frond Blades
        for (let j = 0.2; j < 0.95; j += 0.12) {
          const pt = frondCurve.getPoint(j);
          const bladeGeo = new THREE.PlaneGeometry(0.35, 0.08);
          const blade = new THREE.Mesh(bladeGeo, i % 2 === 0 ? leafLimeMat : leafEmeraldMat);
          blade.position.copy(pt);
          blade.rotation.y = fAngle + Math.PI / 2;
          blade.rotation.x = Math.PI / 4;
          group.add(blade);
        }
      }
    }
  }

  const resetView = () => {
    targetRotationRef.current = { x: 0.1, y: 0 };
    if (plantGroupRef.current) {
      plantGroupRef.current.rotation.set(0.1, 0, 0);
    }
  };

  return (
    <div
      className={`relative w-full h-[480px] sm:h-[550px] md:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#05180E]/70 via-[#072014]/50 to-[#030E07]/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl flex items-center justify-center select-none ${className}`}
    >
      {/* 3D CANVAS INJECTION CONTAINER */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* PINTEREST / AWWWARDS LUXURY HUD BAR (TOP LEFT) */}
      <div className="absolute top-4 left-4 z-30 pointer-events-auto flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold uppercase tracking-wider text-emerald-300">3D Botanical Lab</span>
          <span className="text-white/40">•</span>
          <span className="text-white/70">120 FPS WebGL</span>
        </div>
      </div>

      {/* MODEL SWITCHER TABS (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-xl">
        <button
          onClick={() => setActivePlant("tree")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activePlant === "tree"
              ? "bg-emerald-500 text-green-950 font-bold shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          <span>🌳 Canopy Tree</span>
        </button>
        <button
          onClick={() => setActivePlant("monstera")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activePlant === "monstera"
              ? "bg-emerald-500 text-green-950 font-bold shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          <span>🌿 Monstera</span>
        </button>
        <button
          onClick={() => setActivePlant("palm")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activePlant === "palm"
              ? "bg-emerald-500 text-green-950 font-bold shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          <span>🌴 Royal Palm</span>
        </button>
      </div>

      {/* INTERACTIVE HOTSPOT PINS OVER 3D MODEL */}
      {hotspotData.map((pin) => (
        <div
          key={pin.id}
          className={`absolute z-30 pointer-events-auto ${pin.positionClass}`}
        >
          <div className="relative group">
            <button
              onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
              className="w-7 h-7 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-green-950 flex items-center justify-center font-bold text-xs shadow-glow transition-all hover:scale-110 border-2 border-white"
              aria-label={pin.title}
            >
              <span>+</span>
            </button>

            {/* Tooltip on click or hover */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/40 text-white text-xs shadow-2xl transition-all duration-200 pointer-events-none ${
                activePin === pin.id ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
              }`}
            >
              <div className="font-bold text-emerald-300 font-display flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{pin.title}</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-light">{pin.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* BOTTOM CONTROLS & INSTRUCTIONS */}
      <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 text-[11px] font-mono">
          <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Click &amp; Drag to Orbit 360° • Scroll for Parallax Turn</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-md"
            title={isAutoRotating ? "Pause Auto Orbit" : "Resume Auto Orbit"}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-emerald-300" /> : <Play className="w-3.5 h-3.5 text-amber-300" />}
          </button>

          {/* Reset Camera View */}
          <button
            onClick={resetView}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-md"
            title="Reset 3D Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
