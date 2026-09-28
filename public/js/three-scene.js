// ==============================================================================
// AstraVital AI - 3D Earth & Celestial Orbital Scene (Three.js)
// NASA Space Apps Challenge 2026
// ==============================================================================

class CelestialVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earthGroup = null;
    this.marsGroup = null;
    this.activeBody = 'earth'; // 'earth', 'mars', 'moon'

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.15, y: 0.3 };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050816, 0.0015);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 5, 24);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(20, 10, 15);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.8);
    rimLight.position.set(-20, -10, -15);
    this.scene.add(rimLight);

    // 5. Starfield background
    this.createStarfield();

    // 6. Earth & Mars Groups
    this.createEarth();
    this.createMars();

    // 7. Event Listeners
    this.setupInteractions();

    // 8. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createStarfield() {
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 400;
      positions[i + 1] = (Math.random() - 0.5) * 400;
      positions[i + 2] = (Math.random() - 0.5) * 400;

      const shade = 0.6 + Math.random() * 0.4;
      colors[i] = shade;
      colors[i + 1] = shade * 0.95;
      colors[i + 2] = shade * 1.1; // slight blueish tint
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  // Procedural Earth Texture
  generateEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep ocean base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#04122e');
    oceanGrad.addColorStop(0.5, '#071f4e');
    oceanGrad.addColorStop(1, '#04122e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents procedural styling
    ctx.fillStyle = '#1e4838';
    // North America
    ctx.beginPath();
    ctx.ellipse(260, 170, 90, 60, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(320, 330, 60, 90, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Eurasia
    ctx.beginPath();
    ctx.ellipse(650, 160, 160, 70, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Africa
    ctx.beginPath();
    ctx.ellipse(540, 270, 70, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(820, 360, 55, 45, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Polar caps
    ctx.fillStyle = '#e8f4fc';
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 485, 1024, 27);

    return new THREE.CanvasTexture(canvas);
  }

  // Procedural Mars Texture
  generateMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Mars Red Surface
    const rustGrad = ctx.createLinearGradient(0, 0, 0, 512);
    rustGrad.addColorStop(0, '#752514');
    rustGrad.addColorStop(0.5, '#ad3a1b');
    rustGrad.addColorStop(1, '#611f11');
    ctx.fillStyle = rustGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Dark volcanic basalt regions (Syrtis Major, etc.)
    ctx.fillStyle = '#40150b';
    ctx.beginPath();
    ctx.ellipse(450, 240, 110, 60, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(750, 280, 80, 50, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Craters and canyons
    ctx.strokeStyle = '#2b0c05';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(250, 260);
    ctx.bezierCurveTo(340, 240, 420, 280, 520, 260);
    ctx.stroke();

    // Small polar caps
    ctx.fillStyle = '#f0dcd0';
    ctx.fillRect(0, 0, 1024, 18);
    ctx.fillRect(0, 498, 1024, 14);

    return new THREE.CanvasTexture(canvas);
  }

  createEarth() {
    this.earthGroup = new THREE.Group();

    // Globe
    const globeGeometry = new THREE.SphereGeometry(6, 48, 48);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: this.generateEarthTexture(),
      roughness: 0.65,
      metalness: 0.15
    });
    this.earthMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    this.earthGroup.add(this.earthMesh);

    // Atmospheric Glow
    const atmosphereGeometry = new THREE.SphereGeometry(6.35, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.earthGroup.add(atmosphereMesh);

    // Cloud Layer
    const cloudsGeometry = new THREE.SphereGeometry(6.12, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    this.cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    this.earthGroup.add(this.cloudsMesh);

    // Orbit Ring (ISS)
    const orbitGeometry = new THREE.RingGeometry(8.2, 8.28, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    this.orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
    this.orbitRing.rotation.x = Math.PI / 2.3;
    this.orbitRing.rotation.y = Math.PI / 6;
    this.earthGroup.add(this.orbitRing);

    // ISS Satellite Marker
    const issGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const issMat = new THREE.MeshBasicMaterial({ color: 0x00ff99 });
    this.issMarker = new THREE.Mesh(issGeom, issMat);
    this.issMarker.position.set(8.24, 0, 0);
    this.orbitRing.add(this.issMarker);

    this.scene.add(this.earthGroup);
  }

  createMars() {
    this.marsGroup = new THREE.Group();
    this.marsGroup.position.set(35, 0, 0); // Placed to side initially

    const marsGeometry = new THREE.SphereGeometry(5.2, 48, 48);
    const marsMaterial = new THREE.MeshStandardMaterial({
      map: this.generateMarsTexture(),
      roughness: 0.8,
      metalness: 0.1
    });
    this.marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
    this.marsGroup.add(this.marsMesh);

    // Mars thin atmosphere
    const marsAtmoGeom = new THREE.SphereGeometry(5.45, 48, 48);
    const marsAtmoMat = new THREE.MeshBasicMaterial({
      color: 0xff7b61,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.marsGroup.add(new THREE.Mesh(marsAtmoGeom, marsAtmoMat));

    // Ares IV approach trajectory spline
    const curve = new THREE.EllipseCurve(0, 0, 7.5, 7.5, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    const trajGeom = new THREE.BufferGeometry().setFromPoints(points);
    const trajMat = new THREE.LineBasicMaterial({ color: 0x7b61ff, transparent: true, opacity: 0.5 });
    const trajLine = new THREE.Line(trajGeom, trajMat);
    trajLine.rotation.x = Math.PI / 2;
    this.marsGroup.add(trajLine);

    this.scene.add(this.marsGroup);
  }

  switchCelestialBody(body) {
    this.activeBody = body;
    if (body === 'mars') {
      gsap.to(this.camera.position, { x: 35, y: 3, z: 20, duration: 1.8, ease: 'power2.inOut' });
      document.getElementById('hud-target-name').innerText = 'TARGET: MARS (ARES-IV TRANSIT)';
      document.getElementById('hud-orbital-alt').innerText = 'DISTANCE: 78.4M KM | SOLAR DIST: 1.28 AU';
    } else {
      gsap.to(this.camera.position, { x: 0, y: 5, z: 24, duration: 1.8, ease: 'power2.inOut' });
      document.getElementById('hud-target-name').innerText = 'TARGET: EARTH (LEO & ARTEMIS)';
      document.getElementById('hud-orbital-alt').innerText = 'ISS ALTITUDE: 418 KM | INCLINATION: 51.6°';
    }
  }

  setupInteractions() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    dom.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        const targetGroup = this.activeBody === 'mars' ? this.marsGroup : this.earthGroup;
        targetGroup.rotation.y += deltaX * 0.005;
        targetGroup.rotation.x += deltaY * 0.005;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support for mobile/tablets
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        const targetGroup = this.activeBody === 'mars' ? this.marsGroup : this.earthGroup;
        targetGroup.rotation.y += deltaX * 0.005;
        targetGroup.rotation.x += deltaY * 0.005;

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.earthMesh) this.earthMesh.rotation.y += 0.0012;
    if (this.cloudsMesh) this.cloudsMesh.rotation.y += 0.0016;
    if (this.orbitRing) this.orbitRing.rotation.z += 0.004;

    if (this.marsMesh) this.marsMesh.rotation.y += 0.0010;

    this.renderer.render(this.scene, this.camera);
  }
}

window.CelestialVisualizer = CelestialVisualizer;
