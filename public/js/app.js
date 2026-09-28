// ==============================================================================
// AstraVital AI - Master Application Controller & Telemetry Event Stream Hub
// NASA Space Apps Challenge 2026
// ==============================================================================

class AstraVitalApp {
  constructor() {
    this.astronauts = [];
    this.currentAstronaut = null;
    this.currentRole = 'flight_surgeon';
    this.currentView = 'hero';
    this.eventSource = null;

    // Sub-systems
    this.chartsManager = null;
    this.celestialScene = null;
    this.digitalTwin3d = null;
    this.anomalyEngine = null;
    this.marsSim = null;
    this.wearableSim = null;
    this.missionControl = null;
    this.nasaCenter = null;
    this.astraAI = null;

    // Cognitive Reaction Game State
    this.reactionGameState = 'IDLE'; // IDLE, WAITING, READY
    this.reactionStartTime = 0;
    this.reactionTimeout = null;

    this.init();
  }

  async init() {
    this.initMissionClock();
    this.initNavigation();
    this.initRoleSelector();
    this.initCognitiveGame();

    // Initialize 3D celestial hero scene
    if (window.CelestialVisualizer) {
      this.celestialScene = new CelestialVisualizer('three-hero-canvas');
    }

    // Load astronauts
    await this.loadAstronauts();

    // Initialize Charts
    if (window.TelemetryChartsManager) {
      this.chartsManager = new TelemetryChartsManager();
      this.chartsManager.initAllCharts();
    }

    // Initialize Anomaly Engine
    if (window.AnomalyDetectionEngine) {
      this.anomalyEngine = new AnomalyDetectionEngine();
    }

    // Initialize Wearable Simulator
    if (window.WearableSensorSimulator) {
      this.wearableSim = new WearableSensorSimulator('ecg-canvas');
    }

    // Initialize Mars Simulation
    if (window.MarsMissionSimulator) {
      this.marsSim = new MarsMissionSimulator();
    }

    // Initialize Mission Control Wall
    if (window.MissionControlWall) {
      this.missionControl = new MissionControlWall();
    }

    // Initialize NASA Center
    if (window.NasaEnvironmentCenter) {
      this.nasaCenter = new NasaEnvironmentCenter();
    }

    // Initialize Astra AI
    if (window.AstraAIAssistant) {
      this.astraAI = new AstraAIAssistant();
      window.astraAI = this.astraAI;
    }

    // Connect to Real-time Telemetry SSE Stream
    this.connectTelemetryStream();

    // Render Initial State
    this.renderActiveAstronaut();
  }

  initMissionClock() {
    const clockEl = document.getElementById('mission-master-clock');
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      if (clockEl) {
        clockEl.innerText = `MET SOL 142 • ${h}:${m}:${s} UTC`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  initNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Audio toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioBtn.classList.toggle('active', !isMuted);
        audioBtn.innerText = isMuted ? '🔇' : '🔊';
      });
    }

    // Celestial toggle buttons on 3D Earth
    document.querySelectorAll('.celestial-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.celestial-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        if (this.celestialScene) {
          this.celestialScene.switchCelestialBody(target);
        }
      });
    });
  }

  switchView(viewName) {
    if (this.currentView === viewName) return;
    this.currentView = viewName;

    if (window.soundEngine) {
      window.soundEngine.playTelemetryBeep(1200, 0.04);
    }

    // Update active nav button
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Hide all view sections, show targeted section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Lazy initialize 3D digital twin when digital-twin view opens
    if (viewName === 'digital-twin' && !this.digitalTwin3d) {
      setTimeout(() => {
        if (window.DigitalTwinVisualizer) {
          this.digitalTwin3d = new DigitalTwinVisualizer('three-twin-canvas');
          window.digitalTwin3d = this.digitalTwin3d;
        }
      }, 50);
    }

    // If Mission Control view is opened, refresh crew grid
    if (viewName === 'mission-control' && this.missionControl) {
      this.missionControl.renderCrewStatusGrid(this.astronauts);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initRoleSelector() {
    const roleSelect = document.getElementById('user-role-select');
    if (!roleSelect) return;

    roleSelect.addEventListener('change', (e) => {
      this.currentRole = e.target.value;
      if (window.soundEngine) window.soundEngine.playConfirmChime();

      const roleBadge = document.getElementById('user-role-badge');
      if (roleBadge) {
        roleBadge.innerText = this.currentRole.toUpperCase().replace('_', ' ');
      }

      // Update role-based permissions display
      if (this.currentRole === 'astronaut') {
        this.selectAstronaut('ast-001'); // CDR Sarah Vance
      } else if (this.currentRole === 'flight_surgeon') {
        this.selectAstronaut('ast-002'); // Dr. Marcus Thorne (patient under care)
      }
    });
  }

  async loadAstronauts() {
    try {
      const res = await fetch('/api/astronauts');
      if (!res.ok) throw new Error('API failed');
      const json = await res.json();
      this.astronauts = json.data;
    } catch (e) {
      // Fallback data
      this.astronauts = [
        {
          id: 'ast-001',
          name: 'CDR Sarah Vance',
          callsign: 'Valkyrie',
          role: 'Mission Commander',
          mission: 'ARES-IV Mars Expedition',
          destination: 'Mars Transit (Sol 142)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          telemetry: {
            heartRate: 68,
            spo2: 98.6,
            bpSystolic: 118,
            bpDiastolic: 76,
            bodyTemp: 36.8,
            respirationRate: 14,
            stressScore: 24,
            sleepQuality: 88,
            hydrationPct: 94.2,
            radiationDoseRateUsvH: 42.5,
            overallHealthScore: 94,
            status: 'EXCELLENT'
          }
        },
        {
          id: 'ast-002',
          name: 'Dr. Marcus Thorne',
          callsign: 'Atlas',
          role: 'Chief Medical Officer',
          mission: 'ARES-IV Mars Expedition',
          destination: 'Mars Transit (Sol 142)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          telemetry: {
            heartRate: 86,
            spo2: 95.8,
            bpSystolic: 134,
            bpDiastolic: 88,
            bodyTemp: 37.4,
            respirationRate: 18,
            stressScore: 68,
            sleepQuality: 61,
            hydrationPct: 88.0,
            radiationDoseRateUsvH: 49.2,
            overallHealthScore: 73,
            status: 'WARNING'
          }
        },
        {
          id: 'ast-003',
          name: 'Dr. Elena Rostova',
          callsign: 'Novacrest',
          role: 'Science Officer',
          mission: 'Artemis V Shackleton Base',
          destination: 'Lunar South Pole Surface',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
          telemetry: {
            heartRate: 72,
            spo2: 99.1,
            bpSystolic: 115,
            bpDiastolic: 74,
            bodyTemp: 36.7,
            respirationRate: 13,
            stressScore: 30,
            sleepQuality: 92,
            hydrationPct: 96.5,
            radiationDoseRateUsvH: 18.4,
            overallHealthScore: 96,
            status: 'EXCELLENT'
          }
        },
        {
          id: 'ast-004',
          name: 'Eng. Kenji Sato',
          callsign: 'Ronin',
          role: 'Systems Engineer',
          mission: 'ISS Expedition 74',
          destination: 'Low Earth Orbit (418 km)',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          telemetry: {
            heartRate: 75,
            spo2: 97.5,
            bpSystolic: 122,
            bpDiastolic: 80,
            bodyTemp: 36.9,
            respirationRate: 15,
            stressScore: 42,
            sleepQuality: 78,
            hydrationPct: 91.2,
            radiationDoseRateUsvH: 12.8,
            overallHealthScore: 86,
            status: 'GOOD'
          }
        }
      ];
    }

    this.currentAstronaut = this.astronauts[1]; // default to Dr. Thorne for interesting warning telemetry
    this.renderCrewSelector();
  }

  renderCrewSelector() {
    const container = document.getElementById('crew-selector-container');
    if (!container) return;

    container.innerHTML = this.astronauts.map(ast => {
      const isSelected = this.currentAstronaut && this.currentAstronaut.id === ast.id;
      const score = ast.telemetry.overallHealthScore;
      const statusClass = score >= 85 ? 'score-badge-green' : score >= 65 ? 'score-badge-amber' : 'score-badge-red';
      const ringClass = score >= 85 ? 'status-ring-excellent' : score >= 65 ? 'status-ring-warning' : 'status-ring-critical';

      return `
        <div class="glass-panel crew-card ${isSelected ? 'active' : ''}" onclick="window.app.selectAstronaut('${ast.id}')">
          <div class="crew-avatar-wrapper">
            <img src="${ast.avatar}" alt="${ast.name}">
            <div class="crew-status-ring ${ringClass}"></div>
          </div>
          <div class="crew-info-wrap">
            <div class="crew-name-row">
              <span class="crew-name">${ast.name}</span>
              <span class="crew-badge-score ${statusClass}">${score}/100</span>
            </div>
            <div class="crew-meta">${ast.callsign} • ${ast.role}</div>
            <div class="crew-destination">📍 ${ast.destination || ast.mission}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  selectAstronaut(id) {
    const ast = this.astronauts.find(a => a.id === id);
    if (!ast) return;
    this.currentAstronaut = ast;

    if (window.soundEngine) window.soundEngine.playTelemetryBeep(1000, 0.04);

    this.renderCrewSelector();
    this.renderActiveAstronaut();
  }

  renderActiveAstronaut() {
    if (!this.currentAstronaut) return;
    const ast = this.currentAstronaut;
    const t = ast.telemetry;

    // Update Vitals Cards
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setTxt('val-heart-rate', t.heartRate);
    setTxt('val-spo2', t.spo2);
    setTxt('val-blood-pressure', `${t.bpSystolic}/${t.bpDiastolic}`);
    setTxt('val-body-temp', t.bodyTemp);
    setTxt('val-stress', t.stressScore);
    setTxt('val-sleep', t.sleepQuality);
    setTxt('val-hydration', t.hydrationPct);
    setTxt('val-radiation', t.radiationDoseRateUsvH);
    setTxt('val-overall-score', t.overallHealthScore);
    setTxt('val-health-status', t.status);

    // Active astronaut name in header banner
    setTxt('active-crew-name-banner', `${ast.name} (${ast.callsign})`);
    setTxt('active-mission-banner', ast.mission);

    // Evaluate Anomalies
    if (this.anomalyEngine) {
      const evalResult = this.anomalyEngine.evaluateTelemetry(ast);
      this.anomalyEngine.renderAnomalyBadges('anomaly-alerts-tray', evalResult);
    }
  }

  connectTelemetryStream() {
    try {
      this.eventSource = new EventSource('/api/stream/telemetry');

      this.eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet.astronauts) {
            packet.astronauts.forEach(incoming => {
              const local = this.astronauts.find(a => a.id === incoming.id);
              if (local) {
                local.telemetry = incoming.telemetry;
              }
            });

            // Update live telemetry in charts
            if (this.currentAstronaut && this.chartsManager) {
              const liveAst = this.astronauts.find(a => a.id === this.currentAstronaut.id);
              if (liveAst) {
                this.chartsManager.pushLiveTelemetry(liveAst.telemetry.heartRate, liveAst.telemetry.spo2);
              }
            }

            // Update DOM metrics
            this.renderActiveAstronaut();

            // If mission control view is open, refresh
            if (this.currentView === 'mission-control' && this.missionControl) {
              this.missionControl.renderCrewStatusGrid(this.astronauts);
            }
          }
        } catch (e) {
          console.error('Error parsing SSE packet', e);
        }
      };

      this.eventSource.onerror = () => {
        // SSE connection fallback to interval simulator
        this.eventSource.close();
        this.startFallbackTelemetryGenerator();
      };
    } catch (e) {
      this.startFallbackTelemetryGenerator();
    }
  }

  startFallbackTelemetryGenerator() {
    setInterval(() => {
      this.astronauts.forEach(ast => {
        const delta = (Math.random() - 0.49) * 1.5;
        ast.telemetry.heartRate = Math.max(50, Math.min(125, Number((ast.telemetry.heartRate + delta).toFixed(1))));
        const deltaSpo2 = (Math.random() - 0.5) * 0.15;
        ast.telemetry.spo2 = Math.max(93, Math.min(100, Number((ast.telemetry.spo2 + deltaSpo2).toFixed(1))));
      });

      if (this.currentAstronaut && this.chartsManager) {
        const liveAst = this.astronauts.find(a => a.id === this.currentAstronaut.id);
        if (liveAst) {
          this.chartsManager.pushLiveTelemetry(liveAst.telemetry.heartRate, liveAst.telemetry.spo2);
        }
      }

      this.renderActiveAstronaut();
    }, 1500);
  }

  // Cognitive Reaction Time Test Game (Psychomotor Vigilance Task)
  initCognitiveGame() {
    const gameBox = document.getElementById('cognitive-reaction-box');
    const msgEl = document.getElementById('cognitive-game-msg');
    const resEl = document.getElementById('cognitive-game-result');
    if (!gameBox) return;

    gameBox.addEventListener('click', () => {
      if (this.reactionGameState === 'IDLE') {
        // Start waiting state
        this.reactionGameState = 'WAITING';
        gameBox.className = 'reaction-game-box waiting';
        if (msgEl) msgEl.innerText = 'WAIT FOR GREEN FLASH...';
        if (resEl) resEl.innerText = '';

        const delay = 1500 + Math.random() * 2500;
        this.reactionTimeout = setTimeout(() => {
          this.reactionGameState = 'READY';
          this.reactionStartTime = Date.now();
          gameBox.className = 'reaction-game-box ready';
          if (msgEl) msgEl.innerText = '⚡ CLICK NOW!';
          if (window.soundEngine) window.soundEngine.playTelemetryBeep(1400, 0.08);
        }, delay);

      } else if (this.reactionGameState === 'WAITING') {
        // Clicked too early
        clearTimeout(this.reactionTimeout);
        this.reactionGameState = 'IDLE';
        gameBox.className = 'reaction-game-box';
        if (msgEl) msgEl.innerText = 'TOO EARLY! Click to try again.';
        if (window.soundEngine) window.soundEngine.playWarningBeep();

      } else if (this.reactionGameState === 'READY') {
        // Successful reaction
        const reactionTimeMs = Date.now() - this.reactionStartTime;
        this.reactionGameState = 'IDLE';
        gameBox.className = 'reaction-game-box';
        if (window.soundEngine) window.soundEngine.playConfirmChime();

        let rating = 'EXCELLENT';
        let color = '#00FF99';
        if (reactionTimeMs > 320) {
          rating = 'FATIGUED';
          color = '#FF4D6D';
        } else if (reactionTimeMs > 260) {
          rating = 'MODERATE';
          color = '#FFB800';
        }

        if (msgEl) msgEl.innerText = `Click to test again`;
        if (resEl) {
          resEl.innerHTML = `
            <div style="font-family:'Orbitron'; font-size:1.6rem; color:${color}; margin-top:0.4rem;">
              ${reactionTimeMs} ms [${rating}]
            </div>
            <div style="font-family:'Share Tech Mono'; font-size:0.75rem; color:#8E9DB8; margin-top:0.2rem;">
              NASA Baseline: 235ms • Microgravity Fatigue Delta: ${reactionTimeMs > 235 ? `+${reactionTimeMs - 235}ms` : 'Nominal'}
            </div>
          `;
        }
      }
    });
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AstraVitalApp();
  window.appState = window.app;
});
