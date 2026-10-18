import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BiomeCanvas3DProps {
  forestCondition: number;
  fireRisk: number;
  waterSecurity: number;
  activeLayer: 'standard' | 'firms' | 'ndvi' | 'hydrology' | 'indigenous';
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspotId: string | null) => void;
  className?: string;
}

export interface HotspotLocation {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  description: string;
  satelliteData: string;
  groundStatus: string;
}

export const BIOME_HOTSPOTS: HotspotLocation[] = [
  {
    id: 'firms_clearcut_front',
    name: 'BR-163 Deforestation Front',
    category: 'NASA FIRMS Alert',
    position: [12, 1.4, -6],
    description: 'Active pasture slash-and-burn front advancing toward primary forest margin.',
    satelliteData: 'VIIRS 375m detection: 48.2 MW Fire Radiative Power (Thermal Alert)',
    groundStatus: 'High risk of runaway understory ignition into adjacent canopy.',
  },
  {
    id: 'tapajos_river_basin',
    name: 'Tapajós River Mainstem',
    category: 'Hydrology & Fisheries',
    position: [-2, 0.2, 0],
    description: 'Primary freshwater artery supporting migratory pirarucu, river turtles, and riverine transport.',
    satelliteData: 'Landsat / Sentinel surface reflectance: Baseflow clarity within normal bounds',
    groundStatus: 'Riparian buffer stabilizes stream banks and curbs agricultural sediment wash.',
  },
  {
    id: 'indigenous_territory',
    name: 'Munduruku Indigenous Reserve',
    category: 'Demarcated Territory',
    position: [-16, 2.2, -14],
    description: 'Autonomous territorial stewardship territory with intact high-biomass canopy.',
    satelliteData: 'GEDI RH98 canopy height: 42.1m (High biomass preservation)',
    groundStatus: 'Autonomous drone rangers actively patrol demarcation borders.',
  },
  {
    id: 'agroforestry_collective',
    name: 'Belterra Agroforestry Zone',
    category: 'Bio-Economy Cooperative',
    position: [6, 1.2, 14],
    description: 'Syntropic polyculture combining shade-grown cocoa, açaí palms, and native timber trees.',
    satelliteData: 'Continuous high photosynthetic activity across dry season (NDVI 0.74)',
    groundStatus: 'Local cooperatives report steady harvest income without forest burning.',
  },
  {
    id: 'corridor_reforestation',
    name: 'Central Biodiversity Corridor',
    category: 'Restoration Plot',
    position: [-8, 1.8, 10],
    description: 'Multi-species native planting linking fragmented forest islands across legacy cattle pasture.',
    satelliteData: 'Canopy closure accelerating (Landsat time-series: +22% NDVI over 3 years)',
    groundStatus: 'Young saplings establishing taproots; camera traps record returning fauna.',
  },
  {
    id: 'carbon_flux_tower',
    name: 'Eddy-Covariance Carbon Tower',
    category: 'Ground Telemetry Lab',
    position: [2, 3.2, -16],
    description: 'Solar-powered 65-meter atmospheric flux tower and bioacoustic audio station.',
    satelliteData: 'Ground-truthing data stream calibrating NASA GEDI spaceborne lidar waveforms',
    groundStatus: 'Telemetry active: continuous measurements of net ecosystem CO₂ exchange.',
  },
];

export const BiomeCanvas3D: React.FC<BiomeCanvas3DProps> = ({
  forestCondition,
  fireRisk,
  waterSecurity,
  activeLayer,
  selectedHotspotId,
  onSelectHotspot,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    forestCondition,
    fireRisk,
    waterSecurity,
    activeLayer,
    selectedHotspotId,
  });

  // Keep stateRef in sync with props without tearing down Three.js canvas
  useEffect(() => {
    stateRef.current = {
      forestCondition,
      fireRisk,
      waterSecurity,
      activeLayer,
      selectedHotspotId,
    };
  }, [forestCondition, fireRisk, waterSecurity, activeLayer, selectedHotspotId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a1610');
    scene.fog = new THREE.FogExp2('#0a1610', 0.016);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 32, 42);

    const isHeadless = typeof navigator !== 'undefined' && (/HeadlessChrome/i.test(navigator.userAgent) || navigator.webdriver);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting Rig ---
    const hemiLight = new THREE.HemisphereLight('#8ee4af', '#173620', 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff4e0', 2.4);
    keyLight.position.set(30, 45, 25);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 120;
      const d = 36;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#4ea8de', 0.8);
    rimLight.position.set(-30, 20, -30);
    scene.add(rimLight);

    // --- 3. Procedural Terrain Generation ---
    const terrainWidth = 64;
    const terrainDepth = 64;
    const segments = 90;
    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const vertexCount = posAttr.count;

    // Generate elevation profile: river canyon carved through center + gentle undulating plateaus
    const heights = new Float32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Meandering river trough along diagonal
      const riverPathX = Math.sin(z * 0.12) * 6 + Math.cos(z * 0.05) * 3;
      const distToRiver = Math.abs(x - riverPathX);

      // Plateaus and hills
      const hills = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.8 + Math.sin(x * 0.18 + z * 0.14) * 1.2;

      let y = hills + 2.5;

      // Carve river channel
      if (distToRiver < 7.5) {
        const factor = distToRiver / 7.5;
        const valley = Math.pow(factor, 1.8) * y;
        y = valley - 0.2;
      }

      // Taper edges to horizon
      const edgeDist = Math.max(Math.abs(x) / (terrainWidth * 0.5), Math.abs(z) / (terrainDepth * 0.5));
      if (edgeDist > 0.75) {
        const taper = 1 - (edgeDist - 0.75) / 0.25;
        y *= Math.max(0, taper);
      }

      posAttr.setY(i, y);
      heights[i] = y;
    }
    terrainGeo.computeVertexNormals();

    // Procedural terrain texture via canvas
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      // Base oxisol brown and deep rainforest green
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#1c4224');
      grad.addColorStop(0.35, '#245a32');
      grad.addColorStop(0.7, '#1b3f23');
      grad.addColorStop(1, '#2d4d29');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Soil and silt speckles
      for (let j = 0; j < 3000; j++) {
        const px = Math.random() * 512;
        const py = Math.random() * 512;
        const size = Math.random() * 3 + 1;
        ctx.fillStyle = Math.random() > 0.5 ? '#152e1a' : '#3c2817';
        ctx.fillRect(px, py, size, size);
      }
    }
    const terrainTexture = new THREE.CanvasTexture(texCanvas);
    terrainTexture.colorSpace = THREE.SRGBColorSpace;
    terrainTexture.wrapS = THREE.RepeatWrapping;
    terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set(4, 4);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTexture,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isHeadless;
    scene.add(terrainMesh);

    // --- 4. Meandering River Water Mesh ---
    const waterGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, 40, 40);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#1b4965',
      roughness: 0.12,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.5;
    waterMesh.receiveShadow = !isHeadless;
    scene.add(waterMesh);

    // --- 5. Composite Procedural Trees (InstancedMesh) ---
    // Multi-species trees: Emergent Kapok and Açaí palm shapes
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 1.8, 6);
    trunkGeo.translate(0, 0.9, 0);
    const canopyGeo = new THREE.DodecahedronGeometry(0.9, 1);
    canopyGeo.translate(0, 2.2, 0);

    const treePartsMat = new THREE.MeshStandardMaterial({
      color: '#2e7d32',
      roughness: 0.75,
      metalness: 0.05,
    });

    const maxTrees = 450;
    const treeInstanced = new THREE.InstancedMesh(canopyGeo, treePartsMat, maxTrees);
    treeInstanced.castShadow = !isHeadless;
    treeInstanced.receiveShadow = !isHeadless;

    const dummy = new THREE.Object3D();
    const treePositions: Array<{ x: number; y: number; z: number; scale: number; baseColor: THREE.Color }> = [];

    // Helper: sample terrain height at (x, z)
    function getTerrainHeightAt(tx: number, tz: number): number {
      const u = (tx + terrainWidth * 0.5) / terrainWidth;
      const v = (tz + terrainDepth * 0.5) / terrainDepth;
      if (u < 0 || u > 1 || v < 0 || v > 1) return 0;

      const col = Math.floor(u * segments);
      const row = Math.floor(v * segments);
      const idx = row * (segments + 1) + col;
      if (idx >= 0 && idx < vertexCount) {
        return heights[idx] || 0;
      }
      return 0;
    }

    let treeCount = 0;
    let attempts = 0;
    while (treeCount < maxTrees && attempts < 1500) {
      attempts++;
      const rx = (Math.random() - 0.5) * (terrainWidth - 8);
      const rz = (Math.random() - 0.5) * (terrainDepth - 8);
      const ry = getTerrainHeightAt(rx, rz);

      // Only place trees above water line and outside deforestation front (x > 8 && z < 0 is clearcut front)
      if (ry > 0.85) {
        const isClearcutZone = rx > 6 && rz < -2 && rx < 20 && rz > -16;
        if (!isClearcutZone || Math.random() > 0.8) {
          const s = 0.65 + Math.random() * 0.7;
          dummy.position.set(rx, ry, rz);
          dummy.scale.set(s, s * (0.85 + Math.random() * 0.4), s);
          dummy.rotation.y = Math.random() * Math.PI * 2;
          dummy.updateMatrix();

          treeInstanced.setMatrixAt(treeCount, dummy.matrix);

          // Hue variations: deep emerald, olive, lush jade
          const greenVariations = ['#1e5631', '#2d6a4f', '#40916c', '#52b788', '#1b4332'];
          const pickedColor = new THREE.Color(greenVariations[Math.floor(Math.random() * greenVariations.length)]);
          treeInstanced.setColorAt(treeCount, pickedColor);

          treePositions.push({ x: rx, y: ry, z: rz, scale: s, baseColor: pickedColor });
          treeCount++;
        }
      }
    }
    treeInstanced.instanceMatrix.needsUpdate = true;
    if (treeInstanced.instanceColor) treeInstanced.instanceColor.needsUpdate = true;
    treeInstanced.computeBoundingSphere();
    scene.add(treeInstanced);

    // --- 6. Deforestation Scar Patches (Bare Earth) ---
    const scarGeo = new THREE.PlaneGeometry(16, 14, 16, 16);
    scarGeo.rotateX(-Math.PI / 2);
    const scarMat = new THREE.MeshStandardMaterial({
      color: '#8b4513',
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.75,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const scarMesh = new THREE.Mesh(scarGeo, scarMat);
    scarMesh.position.set(13, 1.45, -8);
    scarMesh.receiveShadow = !isHeadless;
    scene.add(scarMesh);

    // --- 7. NASA FIRMS Active Fire Particles ---
    const fireParticleCount = 120;
    const fireGeo = new THREE.BufferGeometry();
    const firePositions = new Float32Array(fireParticleCount * 3);
    const fireColors = new Float32Array(fireParticleCount * 3);
    const fireSpeeds = new Float32Array(fireParticleCount);

    for (let f = 0; f < fireParticleCount; f++) {
      firePositions[f * 3] = 10 + (Math.random() - 0.5) * 12;
      firePositions[f * 3 + 1] = 1.4 + Math.random() * 2.5;
      firePositions[f * 3 + 2] = -6 + (Math.random() - 0.5) * 10;

      // Orange to bright yellow flame
      const c = Math.random() > 0.4 ? new THREE.Color('#ff5400') : new THREE.Color('#ffbd00');
      fireColors[f * 3] = c.r;
      fireColors[f * 3 + 1] = c.g;
      fireColors[f * 3 + 2] = c.b;

      fireSpeeds[f] = 0.04 + Math.random() * 0.08;
    }
    fireGeo.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
    fireGeo.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));

    const fireMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fireParticles = new THREE.Points(fireGeo, fireMat);
    scene.add(fireParticles);

    // --- 8. Atmospheric Cloud Puffs ---
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({
      color: '#e2f0d9',
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    for (let c = 0; c < 8; c++) {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5 + Math.random() * 2.5, 1), cloudMat);
      puff.position.set((Math.random() - 0.5) * 48, 14 + Math.random() * 4, (Math.random() - 0.5) * 48);
      puff.scale.set(1.6, 0.45, 1.2);
      cloudGroup.add(puff);
    }
    scene.add(cloudGroup);

    // --- 9. Interactive Hotspot Markers ---
    const hotspotGroup = new THREE.Group();
    const hotspotMeshes: Array<{ id: string; mesh: THREE.Group; markerRing: THREE.Mesh }> = [];

    BIOME_HOTSPOTS.forEach((spot) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(...spot.position);

      // Vertical beacon pin
      const pinGeo = new THREE.ConeGeometry(0.5, 1.6, 8);
      pinGeo.rotateX(Math.PI);
      pinGeo.translate(0, 1.2, 0);

      const isFire = spot.id === 'firms_clearcut_front';
      const pinColor = isFire ? '#ff4d4d' : '#2ec4b6';
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        roughness: 0.3,
        metalness: 0.7,
        emissive: pinColor,
        emissiveIntensity: 0.35,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      hGroup.add(pinMesh);

      // Rotating ground target ring
      const ringGeo = new THREE.RingGeometry(0.7, 0.95, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.08;
      hGroup.add(ringMesh);

      hGroup.userData = { hotspotId: spot.id };
      hotspotGroup.add(hGroup);
      hotspotMeshes.push({ id: spot.id, mesh: hGroup, markerRing: ringMesh });
    });
    scene.add(hotspotGroup);

    // --- 10. Raycasting & Click Handling ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotGroup.children, true);

      if (intersects.length > 0) {
        let parent: THREE.Object3D | null = intersects[0].object;
        while (parent && !parent.userData.hotspotId && parent !== scene) {
          parent = parent.parent;
        }
        if (parent && parent.userData.hotspotId) {
          onSelectHotspot(parent.userData.hotspotId);
          return;
        }
      }
      // Clicked ground or empty space
      onSelectHotspot(null);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handleClick);

    // --- 11. Mouse Drag Orbit Controls (Custom silky smooth damping) ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetAzimuth = 0;
    let currentAzimuth = 0;
    let targetElevation = 0.68; // Radians
    let currentElevation = 0.68;
    let targetDistance = 50;
    let currentDistance = 50;
    const targetLookAt = new THREE.Vector3(0, 2, 0);
    const currentLookAt = new THREE.Vector3(0, 2, 0);

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetAzimuth -= dx * 0.006;
      targetElevation = Math.max(0.18, Math.min(1.42, targetElevation + dy * 0.005));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistance = Math.max(20, Math.min(85, targetDistance + e.deltaY * 0.04));
    };

    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard navigation (WASD orbit)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') targetAzimuth += 0.08;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') targetAzimuth -= 0.08;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') targetElevation = Math.min(1.42, targetElevation - 0.06);
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') targetElevation = Math.max(0.18, targetElevation + 0.06);
    };
    window.addEventListener('keydown', handleKeyDown);

    // --- 12. Animation & Render Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(rawDt, 0.05);

      const {
        forestCondition: currForest,
        fireRisk: currFire,
        waterSecurity: currWater,
        activeLayer: currLayer,
        selectedHotspotId: currHotspot,
      } = stateRef.current;

      // 1. Damped camera positioning
      currentAzimuth = THREE.MathUtils.damp(currentAzimuth, targetAzimuth, 8, dt);
      currentElevation = THREE.MathUtils.damp(currentElevation, targetElevation, 8, dt);
      currentDistance = THREE.MathUtils.damp(currentDistance, targetDistance, 8, dt);

      // If a hotspot is selected, subtly glide target look-at to its position
      if (currHotspot) {
        const spot = BIOME_HOTSPOTS.find(h => h.id === currHotspot);
        if (spot) {
          targetLookAt.set(spot.position[0], spot.position[1], spot.position[2]);
        }
      } else {
        targetLookAt.set(0, 2, 0);
      }
      currentLookAt.lerp(targetLookAt, dt * 3.5);

      const cx = currentLookAt.x + currentDistance * Math.cos(currentElevation) * Math.sin(currentAzimuth);
      const cy = currentLookAt.y + currentDistance * Math.sin(currentElevation);
      const cz = currentLookAt.z + currentDistance * Math.cos(currentElevation) * Math.cos(currentAzimuth);

      camera.position.set(cx, cy, cz);
      camera.lookAt(currentLookAt);

      // 2. Dynamic visual reactions to state variables
      // Re-greening: scar mesh fades as forestCondition rises (48 -> 80+)
      const targetScarOpacity = Math.max(0.1, (100 - currForest) / 100 * 0.9);
      scarMat.opacity = THREE.MathUtils.damp(scarMat.opacity, targetScarOpacity, 3, dt);

      // Water river clarity & brightness based on waterSecurity
      const targetWaterColor = currWater > 60 ? new THREE.Color('#2a9d8f') : new THREE.Color('#1b4965');
      waterMat.color.lerp(targetWaterColor, dt * 2);

      // Fire particles intensity based on fireRisk (diminishes when fireRisk drops)
      const targetFireOpacity = Math.max(0.1, (currFire / 100) * 0.95);
      fireMat.opacity = THREE.MathUtils.damp(fireMat.opacity, targetFireOpacity, 3, dt);

      // Animate fire embers rising
      const fPos = fireGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < fireParticleCount; i++) {
        fPos[i * 3 + 1] += fireSpeeds[i];
        if (fPos[i * 3 + 1] > 4.5) {
          fPos[i * 3 + 1] = 1.3;
          fPos[i * 3] = 10 + (Math.random() - 0.5) * 12;
          fPos[i * 3 + 2] = -6 + (Math.random() - 0.5) * 10;
        }
      }
      fireGeo.attributes.position.needsUpdate = true;

      // Animate cloud drift
      cloudGroup.children.forEach((cloud, idx) => {
        cloud.position.x += 0.35 * dt * (1 + idx * 0.2);
        if (cloud.position.x > 36) cloud.position.x = -36;
      });

      // Layer visualization overrides
      if (currLayer === 'firms') {
        fireMat.size = 1.4;
        fireMat.opacity = 1.0;
        scarMat.opacity = 0.9;
      } else if (currLayer === 'ndvi') {
        fireMat.size = 0.5;
        scarMat.opacity = 0.6;
      } else {
        fireMat.size = 0.85;
      }

      // Animate hotspot beacon pulses and hovering
      hotspotMeshes.forEach((h) => {
        h.mesh.position.y = BIOME_HOTSPOTS.find(s => s.id === h.id)!.position[1] + Math.sin(time * 0.003 + h.mesh.position.x) * 0.2;
        h.markerRing.rotation.z += 0.02;

        const isSelected = h.id === currHotspot;
        const scale = isSelected ? 1.4 : 1.0;
        h.mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- 13. Window Resize Observer ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // --- 14. Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('click', handleClick);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      terrainGeo.dispose();
      terrainMat.dispose();
      terrainTexture.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      trunkGeo.dispose();
      canopyGeo.dispose();
      treePartsMat.dispose();
      treeInstanced.dispose();
      scarGeo.dispose();
      scarMat.dispose();
      fireGeo.dispose();
      fireMat.dispose();
      cloudMat.dispose();

      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};
