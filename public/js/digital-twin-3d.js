// ==============================================================================
// AstraVital AI - 3D Digital Twin System (Three.js)
// NASA Space Apps Challenge 2026
// ==============================================================================

class DigitalTwinVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mannequinGroup = null;
    this.hotspots = [];
    this.selectedHotspot = 'cardiac';

    this.hotspotData = {
      brain: {
        title: 'Cerebrovascular & Neuro-Vestibular (SANS)',
        organ: 'Brain & Optic Nerve Sheath',
        stressPct: 46,
        status: 'MONITORED',
        color: '#7B61FF',
        findings: 'Optic nerve sheath diameter: 5.8mm (slight distension). Cephalad fluid shift has increased intracranial venous pressure by +12%. Vestibular adaptation complete.',
        countermeasure: 'Apply Lower Body Negative Pressure (LBNP) for 45 min at -25 mmHg; optical coherence tomography scan in 48 hours.'
      },
      cardiac: {
        title: 'Cardiovascular Hemodynamics',
        organ: 'Left Ventricle & Myocardium',
        stressPct: 58,
        status: 'ELEVATED WORKLOAD',
        color: '#FF4D6D',
        findings: 'Resting cardiac output elevated. Stroke volume down 8% due to blood volume contraction in microgravity. Left ventricular mass reduction risk index: Moderate.',
        countermeasure: 'Prescribe 35 min on Cycle Ergometer with Vibration Isolation (CEVIS) at 75% VO2 peak, with 1.2L isotonic fluid loading prior to EVA.'
      },
      lungs: {
        title: 'Pulmonary Ventilation & Gas Exchange',
        organ: 'Bronchial & Alveolar Tree',
        stressPct: 24,
        status: 'NOMINAL',
        color: '#00E5FF',
        findings: 'SpO2 stable at 98.2%. Ventilation-perfusion matching optimal. No micro-particulate lunar dust inhalation signs detected.',
        countermeasure: 'Maintain standard cabin partial oxygen at 21.0% (34.0 kPa total pressure).'
      },
      spine: {
        title: 'Axial Spine & Intervertebral Discs',
        organ: 'Lumbar & Thoracic Spine',
        stressPct: 64,
        status: 'DEGENERATION RISK',
        color: '#FFB800',
        findings: 'Spinal height elongated by +4.2 cm due to disc hydration in microgravity. Paraspinal muscle cross-sectional area decreased by 6.4%. Back pain score: 3/10.',
        countermeasure: 'Deploy Skinsuit compressive axial loading garment (0.8G equivalent); 20 min core stabilization exercises on ARED.'
      },
      femur: {
        title: 'Femoral Trabecular Bone Demineralization',
        organ: 'Femoral Neck & Cortical Bone',
        stressPct: 54,
        status: 'PROGRESSIVE LOSS',
        color: '#FFB800',
        findings: 'Bone mineral resorption rate: 1.15% per 30 days in microgravity. Urinary calcium excretion elevated (+22%).',
        countermeasure: 'Administer intravenous zoledronic acid booster; maintain daily 200kg deadlift loads on Advanced Resistive Exercise Device (ARED).'
      }
    };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 550;
    const height = this.container.clientHeight || 520;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 5.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Ambient & Accent Lights
    const amb = new THREE.AmbientLight(0x0b1026, 2.0);
    this.scene.add(amb);

    const cyanPoint = new THREE.PointLight(0x00e5ff, 2.5, 30);
    cyanPoint.position.set(3, 4, 4);
    this.scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0x7b61ff, 2.0, 30);
    purplePoint.position.set(-3, -2, 3);
    this.scene.add(purplePoint);

    // Build Hologram Mannequin & Hotspots
    this.createHolographicMannequin();
    this.setupHotspots();

    // Event listeners
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    this.setupInteractions();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Initial render of default hotspot
    this.selectHotspot('cardiac');
  }

  createHolographicMannequin() {
    this.mannequinGroup = new THREE.Group();

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x082040,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65
    });

    // 1. Head
    const headGeom = new THREE.SphereGeometry(0.38, 24, 24);
    const headMesh = new THREE.Mesh(headGeom, wireMat);
    headMesh.position.y = 2.1;
    this.mannequinGroup.add(headMesh);

    // Visor HUD ring
    const visorGeom = new THREE.TorusGeometry(0.34, 0.04, 16, 32, Math.PI);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x7b61ff });
    const visor = new THREE.Mesh(visorGeom, visorMat);
    visor.position.set(0, 2.1, 0.15);
    this.mannequinGroup.add(visor);

    // 2. Neck
    const neckGeom = new THREE.CylinderGeometry(0.14, 0.16, 0.22, 16);
    const neck = new THREE.Mesh(neckGeom, wireMat);
    neck.position.y = 1.74;
    this.mannequinGroup.add(neck);

    // 3. Chest / Torso
    const chestGeom = new THREE.CylinderGeometry(0.55, 0.42, 1.0, 20);
    const chest = new THREE.Mesh(chestGeom, wireMat);
    chest.position.y = 1.15;
    this.mannequinGroup.add(chest);

    // 4. Abdomen & Pelvis
    const pelvisGeom = new THREE.CylinderGeometry(0.42, 0.48, 0.55, 20);
    const pelvis = new THREE.Mesh(pelvisGeom, wireMat);
    pelvis.position.y = 0.45;
    this.mannequinGroup.add(pelvis);

    // 5. Arms (Left & Right)
    [-1, 1].forEach(side => {
      const shoulderGeom = new THREE.SphereGeometry(0.18, 16, 16);
      const shoulder = new THREE.Mesh(shoulderGeom, wireMat);
      shoulder.position.set(side * 0.72, 1.5, 0);
      this.mannequinGroup.add(shoulder);

      const upperArmGeom = new THREE.CylinderGeometry(0.13, 0.11, 0.7, 16);
      const upperArm = new THREE.Mesh(upperArmGeom, wireMat);
      upperArm.position.set(side * 0.82, 1.05, 0);
      upperArm.rotation.z = side * -0.15;
      this.mannequinGroup.add(upperArm);

      const foreArmGeom = new THREE.CylinderGeometry(0.10, 0.08, 0.65, 16);
      const foreArm = new THREE.Mesh(foreArmGeom, wireMat);
      foreArm.position.set(side * 0.94, 0.42, 0);
      this.mannequinGroup.add(foreArm);
    });

    // 6. Legs (Thighs & Calves)
    [-1, 1].forEach(side => {
      const thighGeom = new THREE.CylinderGeometry(0.20, 0.15, 0.95, 16);
      const thigh = new THREE.Mesh(thighGeom, wireMat);
      thigh.position.set(side * 0.28, -0.25, 0);
      this.mannequinGroup.add(thigh);

      const kneeGeom = new THREE.SphereGeometry(0.14, 16, 16);
      const knee = new THREE.Mesh(kneeGeom, wireMat);
      knee.position.set(side * 0.28, -0.75, 0);
      this.mannequinGroup.add(knee);

      const calfGeom = new THREE.CylinderGeometry(0.14, 0.10, 0.95, 16);
      const calf = new THREE.Mesh(calfGeom, wireMat);
      calf.position.set(side * 0.28, -1.25, 0);
      this.mannequinGroup.add(calf);
    });

    // Circular Holographic Base Pedestal
    const baseGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 36);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true });
    const pedestal = new THREE.Mesh(baseGeom, baseMat);
    pedestal.position.y = -1.8;
    this.mannequinGroup.add(pedestal);

    // Glowing coordinate rings on ground
    const ringGeom = new THREE.RingGeometry(1.9, 1.95, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7b61ff, side: THREE.DoubleSide });
    const floorRing = new THREE.Mesh(ringGeom, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = -1.82;
    this.mannequinGroup.add(floorRing);

    this.scene.add(this.mannequinGroup);
  }

  setupHotspots() {
    const coords = [
      { id: 'brain', pos: [0, 2.15, 0.25], color: 0x7b61ff },
      { id: 'cardiac', pos: [0.12, 1.25, 0.35], color: 0xff4d6d },
      { id: 'lungs', pos: [-0.15, 1.35, 0.32], color: 0x00e5ff },
      { id: 'spine', pos: [0, 0.75, -0.22], color: 0xffb800 },
      { id: 'femur', pos: [0.28, -0.25, 0.22], color: 0xffb800 }
    ];

    coords.forEach(c => {
      const group = new THREE.Group();
      group.position.set(...c.pos);

      // Core pulsating sphere
      const sphereGeom = new THREE.SphereGeometry(0.09, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: c.color });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      group.add(sphere);

      // Outer aura ring
      const ringGeom = new THREE.RingGeometry(0.12, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: c.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      group.add(ring);

      group.userData = { id: c.id, ring: ring };
      this.hotspots.push(group);
      this.mannequinGroup.add(group);
    });
  }

  setupInteractions() {
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    dom.addEventListener('mousemove', (e) => {
      if (isDragging && this.mannequinGroup) {
        const dx = e.clientX - prevMouse.x;
        this.mannequinGroup.rotation.y += dx * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support for mobile/tablets
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (isDragging && this.mannequinGroup && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevMouse.x;
        this.mannequinGroup.rotation.y += dx * 0.008;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  selectHotspot(hotspotId) {
    this.selectedHotspot = hotspotId;
    const data = this.hotspotData[hotspotId];
    if (!data) return;

    if (window.soundEngine) {
      window.soundEngine.playTelemetryBeep(1100, 0.05);
    }

    // Update active UI buttons
    document.querySelectorAll('.hotspot-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.hotspot === hotspotId);
    });

    // Update clinical panel text
    const titleEl = document.getElementById('twin-panel-title');
    const organEl = document.getElementById('twin-organ-name');
    const stressEl = document.getElementById('twin-stress-bar');
    const stressValEl = document.getElementById('twin-stress-val');
    const findingsEl = document.getElementById('twin-findings');
    const counterEl = document.getElementById('twin-countermeasure');

    if (titleEl) titleEl.innerText = data.title;
    if (organEl) organEl.innerText = data.organ;
    if (stressValEl) stressValEl.innerText = `${data.stressPct}% STRESS INDEX`;
    if (stressEl) {
      stressEl.style.width = `${data.stressPct}%`;
      stressEl.style.background = data.color;
    }
    if (findingsEl) findingsEl.innerText = data.findings;
    if (counterEl) counterEl.innerText = data.countermeasure;

    // Smoothly focus camera towards anatomical level
    let targetY = 1.2;
    if (hotspotId === 'brain') targetY = 2.1;
    else if (hotspotId === 'cardiac' || hotspotId === 'lungs') targetY = 1.3;
    else if (hotspotId === 'spine') targetY = 0.8;
    else if (hotspotId === 'femur') targetY = -0.1;

    gsap.to(this.camera.position, { y: targetY, z: 4.8, duration: 1.0, ease: 'power2.out' });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Subtle breathing / idle floating rotation
    if (this.mannequinGroup) {
      this.mannequinGroup.rotation.y += 0.003;
    }

    // Pulse hotspot rings
    const time = Date.now() * 0.003;
    this.hotspots.forEach(h => {
      if (h.userData.ring) {
        const scale = 1 + Math.sin(time * 2) * 0.18;
        h.userData.ring.scale.set(scale, scale, scale);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

window.DigitalTwinVisualizer = DigitalTwinVisualizer;
