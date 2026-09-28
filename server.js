// ==============================================================================
// AstraVital AI - Main Express Backend Server
// NASA Space Apps Challenge 2026
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Real-time State (initialized from rich NASA spaceflight baseline)
let astronauts = [
  {
    id: 'ast-001',
    name: 'CDR Sarah Vance',
    callsign: 'Valkyrie',
    role: 'Mission Commander & Astrodynamics Lead',
    mission: 'ARES-IV Mars Expedition',
    destination: 'Mars Transit (Sol 142)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bloodType: 'O+',
    age: 39,
    heightCm: 175.5,
    weightKg: 68.2,
    vo2Max: 54.2,
    boneDensityTScore: 1.08,
    careerRadiationMsv: 84.5,
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
    },
    digitalTwin: {
      cardiovascularStiffness: 0.14,
      boneLossRatePctMonth: 0.92,
      cephalicFluidShiftMl: 820,
      sansStage: 0,
      organStress: {
        brain: 0.18,
        heart: 0.16,
        lungs: 0.12,
        spine: 0.28,
        femur: 0.24,
        opticNerve: 0.10
      }
    }
  },
  {
    id: 'ast-002',
    name: 'Dr. Marcus Thorne',
    callsign: 'Atlas',
    role: 'Chief Medical Officer & EVA Specialist',
    mission: 'ARES-IV Mars Expedition',
    destination: 'Mars Transit (Sol 142)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bloodType: 'A-',
    age: 44,
    heightCm: 182.0,
    weightKg: 79.5,
    vo2Max: 51.0,
    boneDensityTScore: 0.91,
    careerRadiationMsv: 118.3,
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
    },
    digitalTwin: {
      cardiovascularStiffness: 0.34,
      boneLossRatePctMonth: 1.48,
      cephalicFluidShiftMl: 1180,
      sansStage: 1,
      organStress: {
        brain: 0.46,
        heart: 0.58,
        lungs: 0.32,
        spine: 0.64,
        femur: 0.54,
        opticNerve: 0.40
      }
    }
  },
  {
    id: 'ast-003',
    name: 'Dr. Elena Rostova',
    callsign: 'Novacrest',
    role: 'Science Officer & Astrobiologist',
    mission: 'Artemis V Shackleton Base',
    destination: 'Lunar South Pole Surface',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bloodType: 'B+',
    age: 36,
    heightCm: 168.0,
    weightKg: 61.0,
    vo2Max: 56.4,
    boneDensityTScore: 1.18,
    careerRadiationMsv: 42.1,
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
    },
    digitalTwin: {
      cardiovascularStiffness: 0.10,
      boneLossRatePctMonth: 0.70,
      cephalicFluidShiftMl: 650,
      sansStage: 0,
      organStress: {
        brain: 0.12,
        heart: 0.14,
        lungs: 0.10,
        spine: 0.22,
        femur: 0.18,
        opticNerve: 0.08
      }
    }
  },
  {
    id: 'ast-004',
    name: 'Eng. Kenji Sato',
    callsign: 'Ronin',
    role: 'Systems Engineer & Roboticist',
    mission: 'ISS Expedition 74',
    destination: 'Low Earth Orbit (418 km)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bloodType: 'AB+',
    age: 41,
    heightCm: 172.0,
    weightKg: 66.8,
    vo2Max: 52.8,
    boneDensityTScore: 1.02,
    careerRadiationMsv: 56.7,
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
    },
    digitalTwin: {
      cardiovascularStiffness: 0.20,
      boneLossRatePctMonth: 1.02,
      cephalicFluidShiftMl: 890,
      sansStage: 0,
      organStress: {
        brain: 0.24,
        heart: 0.22,
        lungs: 0.16,
        spine: 0.38,
        femur: 0.32,
        opticNerve: 0.15
      }
    }
  }
];

let alerts = [
  {
    id: 'alt-101',
    astronautId: 'ast-002',
    astronautName: 'Dr. Marcus Thorne',
    severity: 'HIGH',
    category: 'CARDIAC',
    title: 'Sustained Tachycardia & High Cardiac Workload',
    message: 'Elevated resting HR (86 bpm) with diastolic BP rise to 88 mmHg. Correlates with microgravity vascular remodeling & post-EVA dehydration.',
    probability: 0.89,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    isAcknowledged: false
  },
  {
    id: 'alt-102',
    astronautId: 'ast-002',
    astronautName: 'Dr. Marcus Thorne',
    severity: 'MEDIUM',
    category: 'RADIATION',
    title: 'M4.2 Solar Flare Detection - SPE Warning',
    message: 'NOAA SWPC / NASA DONKI alerts solar energetic proton wave. Dosimetry predicts +18 µSv/h elevation. Recommend shelter in water-wall haven.',
    probability: 0.78,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isAcknowledged: false
  },
  {
    id: 'alt-103',
    astronautId: 'ast-001',
    astronautName: 'CDR Sarah Vance',
    severity: 'LOW',
    category: 'SLEEP',
    title: 'Circadian Rhythm Phase Shift',
    message: 'REM sleep deficiency observed over last 48 hours (-32m). Mild blue-light spectrum adjustment recommended in crew quarters.',
    probability: 0.42,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isAcknowledged: true
  }
];

let emergencyState = {
  active: false,
  protocol: null,
  severity: 'NORMAL',
  initiator: null,
  timestamp: null,
  checklist: []
};

// --------------------------------------------------------------------------
// REST API ENDPOINTS
// --------------------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AstraVital AI Deep Space Telemetry Hub',
    version: '2026.4.1-SpaceApps',
    timestamp: new Date().toISOString(),
    activeAstronauts: astronauts.length,
    activeAlerts: alerts.filter(a => !a.isAcknowledged).length
  });
});

// 2. Astronauts list
app.get('/api/astronauts', (req, res) => {
  res.json({ success: true, count: astronauts.length, data: astronauts });
});

// 3. Single Astronaut
app.get('/api/astronauts/:id', (req, res) => {
  const ast = astronauts.find(a => a.id === req.params.id);
  if (!ast) return res.status(404).json({ error: 'Astronaut not found' });
  res.json({ success: true, data: ast });
});

// 4. Update Telemetry
app.post('/api/astronauts/:id/telemetry', (req, res) => {
  const ast = astronauts.find(a => a.id === req.params.id);
  if (!ast) return res.status(404).json({ error: 'Astronaut not found' });

  ast.telemetry = { ...ast.telemetry, ...req.body };
  ast.telemetry.overallHealthScore = calculateHealthScore(ast.telemetry);
  ast.telemetry.status = getHealthScoreLabel(ast.telemetry.overallHealthScore);

  res.json({ success: true, data: ast });
});

// 5. Active Alerts
app.get('/api/alerts', (req, res) => {
  res.json({ success: true, count: alerts.length, data: alerts });
});

app.post('/api/alerts/:id/ack', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.isAcknowledged = true;
  res.json({ success: true, data: alert });
});

// 6. NASA Space Weather & Open Data Hub
app.get('/api/nasa/space-weather', async (req, res) => {
  try {
    // Attempt live fetch from NASA DONKI Solar Flare API if key is available
    const nasaData = await fetchNasaDonki();
    res.json({ success: true, source: 'NASA_DONKI_OPEN_API', data: nasaData });
  } catch (err) {
    // Robust high-fidelity space weather fallback model
    const fallback = generateSyntheticSpaceWeather();
    res.json({ success: true, source: 'ASTRA_SYNTHETIC_SPACE_WEATHER_MODEL', data: fallback });
  }
});

app.get('/api/nasa/apod', async (req, res) => {
  try {
    const apod = await fetchNasaApod();
    res.json({ success: true, data: apod });
  } catch (err) {
    res.json({
      success: true,
      data: {
        title: 'Artemis & Mars Transit Orbital Telemetry',
        url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        explanation: 'Deep space trajectory view showing high-energy solar particle belts along the Earth-Mars Hohmann transfer orbit.',
        date: '2026-09-24'
      }
    });
  }
});

// 7. Astra AI Medical Decision Support Engine
app.post('/api/ai/analyze', (req, res) => {
  const { astronautId, telemetry, prompt } = req.body;
  const ast = astronauts.find(a => a.id === astronautId) || astronauts[1];
  const t = telemetry || ast.telemetry;

  const response = runAstraClinicalInference(ast, t, prompt);
  res.json({ success: true, data: response });
});

// 8. Mars Mission Health Degradation Simulator
app.post('/api/mars-sim', (req, res) => {
  const {
    durationDays = 180,
    shieldingType = 'Polyethylene_Composite',
    exerciseHoursPerDay = 2.5,
    dietSupplementation = true,
    astronautId = 'ast-001'
  } = req.body;

  const result = runMarsSimulationEngine({
    durationDays: Number(durationDays),
    shieldingType,
    exerciseHoursPerDay: Number(exerciseHoursPerDay),
    dietSupplementation: Boolean(dietSupplementation)
  });

  res.json({ success: true, data: result });
});

// 9. Emergency Protocol Trigger
app.post('/api/emergency/trigger', (req, res) => {
  const { type, astronautId, details } = req.body;
  emergencyState = {
    active: true,
    type: type || 'HYPOXIA_CRITICAL',
    severity: 'CRITICAL',
    astronautId: astronautId || 'ast-002',
    timestamp: new Date().toISOString(),
    details: details || 'Acute drop in cabin partial oxygen or astronaut vitals',
    checklist: [
      { id: 1, step: 'Seal Suit / Helmet Visor', status: 'IN_PROGRESS' },
      { id: 2, step: 'Engage 100% Emergency O2 Scrubber Line', status: 'PENDING' },
      { id: 3, step: 'Flight Surgeon Uplink Priority Channel 1', status: 'PENDING' },
      { id: 4, step: 'Administer Epinephrine / Atropine Auto-Injector if cardiac arrest', status: 'PENDING' },
      { id: 5, step: 'Align Deep Space Network Dish to Goldstone 70m', status: 'PENDING' }
    ]
  };

  // Add critical alert
  alerts.unshift({
    id: `alt-emg-${Date.now()}`,
    astronautId: emergencyState.astronautId,
    astronautName: astronauts.find(a => a.id === emergencyState.astronautId)?.name || 'Astronaut',
    severity: 'CRITICAL',
    category: 'CARDIAC',
    title: `EMERGENCY ALERT: ${emergencyState.type}`,
    message: `Red Alert triggered by mission control. Immediate life support intervention protocol active.`,
    probability: 0.99,
    timestamp: emergencyState.timestamp,
    isAcknowledged: false
  });

  res.json({ success: true, data: emergencyState });
});

app.post('/api/emergency/resolve', (req, res) => {
  emergencyState.active = false;
  emergencyState.severity = 'RESOLVED';
  res.json({ success: true, message: 'Emergency state stood down to nominal telemetry.' });
});

app.get('/api/emergency/status', (req, res) => {
  res.json({ success: true, data: emergencyState });
});

// 10. Real-time Telemetry Server-Sent Events (SSE) Stream
app.get('/api/stream/telemetry', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send an initial packet
  const sendTick = () => {
    // Generate realistic fluctuating micro-variations
    astronauts.forEach(ast => {
      const deltaHr = (Math.random() - 0.48) * 1.8;
      ast.telemetry.heartRate = Math.max(50, Math.min(130, Number((ast.telemetry.heartRate + deltaHr).toFixed(1))));

      const deltaSpo2 = (Math.random() - 0.5) * 0.2;
      ast.telemetry.spo2 = Math.max(92, Math.min(100, Number((ast.telemetry.spo2 + deltaSpo2).toFixed(1))));

      const deltaRad = (Math.random() - 0.5) * 0.8;
      ast.telemetry.radiationDoseRateUsvH = Math.max(8, Number((ast.telemetry.radiationDoseRateUsvH + deltaRad).toFixed(2)));

      ast.telemetry.overallHealthScore = calculateHealthScore(ast.telemetry);
      ast.telemetry.status = getHealthScoreLabel(ast.telemetry.overallHealthScore);
    });

    const packet = {
      timestamp: new Date().toISOString(),
      astronauts: astronauts.map(a => ({
        id: a.id,
        name: a.name,
        telemetry: a.telemetry,
        digitalTwin: a.digitalTwin
      })),
      spaceEnv: {
        solarWindSpeedKmS: (420 + Math.random() * 40).toFixed(1),
        protonFluxPfu: (12.4 + Math.random() * 3).toFixed(2),
        cabinShieldingIntegrity: 98.4
      }
    };

    res.write(`data: ${JSON.stringify(packet)}\n\n`);
  };

  const interval = setInterval(sendTick, 1200);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// --------------------------------------------------------------------------
// HELPER LOGIC & NASA ALGORITHMS
// --------------------------------------------------------------------------

function calculateHealthScore(t) {
  let score = 100;

  // HR evaluation (optimal 60-80)
  if (t.heartRate < 55 || t.heartRate > 95) score -= 18;
  else if (t.heartRate < 60 || t.heartRate > 85) score -= 8;

  // SpO2 evaluation (optimal >= 97)
  if (t.spo2 < 94) score -= 30;
  else if (t.spo2 < 97) score -= 14;

  // Stress evaluation (optimal < 35)
  if (t.stressScore > 70) score -= 22;
  else if (t.stressScore > 50) score -= 10;

  // Radiation evaluation (> 40 µSv/h increases risk)
  if (t.radiationDoseRateUsvH > 50) score -= 16;
  else if (t.radiationDoseRateUsvH > 35) score -= 6;

  // Hydration evaluation (< 90%)
  if (t.hydrationPct < 85) score -= 15;
  else if (t.hydrationPct < 90) score -= 6;

  return Math.max(10, Math.min(100, Math.round(score)));
}

function getHealthScoreLabel(score) {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 78) return 'GOOD';
  if (score >= 60) return 'WARNING';
  return 'CRITICAL';
}

function runAstraClinicalInference(ast, t, userQuery) {
  const anomalies = [];
  const recommendations = [];

  if (t.heartRate > 85) {
    anomalies.push({
      metric: 'Cardiovascular (HR)',
      observed: `${t.heartRate} bpm`,
      normalRange: '60 - 80 bpm',
      pathophysiology: 'Microgravity cephalad fluid shift increases central venous pressure initially, causing baroreceptor recalibration and reduced cardiac stroke volume over extended durations.'
    });
    recommendations.push('Prescribe 30 minutes on cycle ergometer at 70% VO2 max with Lower Body Negative Pressure (LBNP) suit.');
  }

  if (t.spo2 < 97) {
    anomalies.push({
      metric: 'Pulmonary (SpO2)',
      observed: `${t.spo2}%`,
      normalRange: '98 - 100%',
      pathophysiology: 'Reduced ventilation-perfusion matching in microgravity combined with potential carbon dioxide pocket accumulation in sleeping module.'
    });
    recommendations.push('Inspect crew quarter cabin air scrubbers for CO2 stagnation; initiate 15m hyper-oxygenation protocol.');
  }

  if (t.stressScore > 55) {
    anomalies.push({
      metric: 'Neuro-Psychological (Stress Index)',
      observed: `${t.stressScore}/100`,
      normalRange: '< 40/100',
      pathophysiology: 'Prolonged confined isolation, disruption of circadian photoreceptors, and acoustic white-noise fatigue.'
    });
    recommendations.push('Schedule VR nature immersion session (Artemis Tranquility Protocol); administer 0.5mg melatonin 30 min before sleep cycle.');
  }

  if (t.radiationDoseRateUsvH > 40) {
    anomalies.push({
      metric: 'Ionizing Radiation Exposure',
      observed: `${t.radiationDoseRateUsvH} µSv/h`,
      normalRange: '< 25 µSv/h',
      pathophysiology: 'Galactic Cosmic Ray (GCR) background combined with low-energy solar proton surge.'
    });
    recommendations.push('Relocate sleeping quarters adjacent to potable water storage tanks to optimize hydrogen shielding.');
  }

  // If no anomalies
  if (anomalies.length === 0) {
    anomalies.push({
      metric: 'System Status',
      observed: 'All Vitals Nominal',
      normalRange: 'Within 95% NASA Medical Standards',
      pathophysiology: 'Autonomic nervous system in optimal adaptation equilibrium with microgravity environment.'
    });
    recommendations.push('Continue baseline daily 2.5-hour ARED (Advanced Resistive Exercise Device) and aerobic regimen.');
  }

  return {
    astronautName: ast.name,
    healthScore: t.overallHealthScore,
    status: t.status,
    anomalies,
    clinicalSummary: `Astra AI clinical evaluation for ${ast.name}: Astronaut exhibits ${t.status.toLowerCase()} physiological telemetry with overall biometric index of ${t.overallHealthScore}/100. Key concern revolves around ${anomalies[0].metric.toLowerCase()}.`,
    actionableProtocols: recommendations,
    aiConfidenceScore: 0.942,
    spaceMedicineCitation: 'NASA SP-2020-5007: Principles of Clinical Space Medicine for Long-Duration Exploration'
  };
}

function runMarsSimulationEngine({ durationDays, shieldingType, exerciseHoursPerDay, dietSupplementation }) {
  // NASA human research program bio-mathematical model
  // Monthly bone loss in microgravity without countermeasure is ~1.2%
  // Exercise mitigates up to 65% of loss
  const exerciseFactor = Math.min(1.0, exerciseHoursPerDay / 3.0);
  const dietFactor = dietSupplementation ? 0.2 : 0.0;
  const boneMitigation = (0.55 * exerciseFactor) + dietFactor;
  const baseMonthlyBoneLossPct = 1.35;
  const netMonthlyBoneLoss = Math.max(0.2, baseMonthlyBoneLossPct * (1 - boneMitigation));
  const months = durationDays / 30;
  const totalBoneLossPct = Number((netMonthlyBoneLoss * months).toFixed(1));

  // Radiation shielding effectiveness
  const shieldingMultipliers = {
    'Aluminum_Baseline': 1.0,
    'Polyethylene_Composite': 0.68,
    'Water_Wall_Active': 0.44,
    'Regolith_Habitat': 0.28
  };
  const shieldFactor = shieldingMultipliers[shieldingType] || 0.7;
  const baseDailyDoseMsv = 1.6; // Deep space GCR + SEP average
  const totalRadiationDoseMsv = Number((baseDailyDoseMsv * durationDays * shieldFactor).toFixed(1));

  // Cardiovascular deconditioning risk
  const cardioRisk = Math.max(5, Math.min(95, Math.round(50 * (1 - exerciseFactor) + (durationDays / 12))));

  // SANS (Spaceflight Associated Neuro-ocular Syndrome) risk
  const sansRisk = Math.min(85, Math.round(15 + (durationDays * 0.06)));

  // Excess Relative Risk of Radiation Carcinogenesis
  const cancerExcessRiskPct = Number((totalRadiationDoseMsv * 0.004).toFixed(2));

  // Trajectory timeline checkpoints
  const timeline = [
    { day: 0, label: 'Earth Departure & TMI Burn', healthScore: 98, status: 'NOMINAL' },
    { day: Math.round(durationDays * 0.25), label: 'Mid-Course Correction 1 (Deep Space)', healthScore: Math.round(98 - (totalBoneLossPct * 0.4)), status: 'MONITORED' },
    { day: Math.round(durationDays * 0.5), label: 'Hohmann Aphelion / Solar Event Zone', healthScore: Math.round(95 - (totalBoneLossPct * 0.7)), status: 'HIGH_MONITORING' },
    { day: Math.round(durationDays * 0.75), label: 'Mars Approach Insertion Prep', healthScore: Math.round(92 - totalBoneLossPct), status: 'ALERT' },
    { day: durationDays, label: 'Mars Orbit Insertion / Landing', healthScore: Math.max(50, Math.round(90 - totalBoneLossPct - (cardioRisk * 0.15))), status: 'CRITICAL_RECONDITIONING' }
  ];

  return {
    durationDays,
    shieldingType,
    exerciseHoursPerDay,
    totalBoneLossPct,
    boneRetentionPct: Number((100 - totalBoneLossPct).toFixed(1)),
    totalRadiationDoseMsv,
    cancerExcessRiskPct,
    cardiovascularAtrophyRiskPct: cardioRisk,
    sansOcularRiskPct: sansRisk,
    missionReadinessScore: Math.max(35, Math.min(99, Math.round(100 - (totalBoneLossPct * 1.5) - (totalRadiationDoseMsv * 0.08) - (cardioRisk * 0.2)))),
    timeline
  };
}

async function fetchNasaDonki() {
  return new Promise((resolve, reject) => {
    const url = `https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-05-01&api_key=${NASA_API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolve({
              recentSolarFlares: parsed.slice(0, 5),
              activeSpaceWeatherWarning: 'ACTIVE_GEO_STORM_WATCH',
              geomagneticKpIndex: 4.3,
              protonFlux: '14.2 pfu'
            });
          } else {
            reject(new Error('Invalid NASA DONKI format'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

async function fetchNasaApod() {
  return new Promise((resolve, reject) => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.title) resolve(parsed);
          else reject(new Error('Invalid APOD'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

function generateSyntheticSpaceWeather() {
  return {
    solarFlareClass: 'M4.2 / Moderate X-Ray Flux',
    solarWindVelocityKmS: 432.8,
    geomagneticKpIndex: 3.8,
    cosmicRayDoseRateUsvH: 42.6,
    protonFluxPfu: 14.1,
    status: 'ELEVATED_WATCH',
    summary: 'Coronal mass ejection (CME) shock front traveling at 680 km/s. Mars Transit corridor subject to secondary ionizing proton flux.',
    shelterRecommendation: 'Storm shelter haven alert Level 2. Cabin water shielding aligned toward solar vector.'
  };
}

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 AstraVital AI Server online at: http://localhost:${PORT}`);
    console.log(`🛰️  NASA Space Apps Challenge 2026 - Astronaut Health Platform`);
    console.log(`📡 Telemetry SSE Stream: http://localhost:${PORT}/api/stream/telemetry`);
    console.log(`================================================================`);
  });
}

module.exports = app;
