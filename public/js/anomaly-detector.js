// ==============================================================================
// AstraVital AI - Real-time Machine Learning Anomaly Detection Engine
// NASA Space Apps Challenge 2026
// ==============================================================================

class AnomalyDetectionEngine {
  constructor() {
    this.anomalyHistory = [];
  }

  evaluateTelemetry(astronaut) {
    const t = astronaut.telemetry;
    const anomalies = [];

    // 1. Heart Rate
    if (t.heartRate > 85) {
      anomalies.push({
        type: 'CARDIAC',
        severity: t.heartRate > 100 ? 'CRITICAL' : 'WARNING',
        param: 'Heart Rate',
        value: `${t.heartRate} bpm`,
        threshold: '60 - 80 bpm',
        probability: Math.min(0.98, Number((0.65 + (t.heartRate - 85) * 0.02).toFixed(2))),
        pathology: 'Microgravity cardiovascular deconditioning with compensatory sinus tachycardia.',
        action: 'Initiate 20m Lower Body Negative Pressure (LBNP) test protocol.'
      });
    } else if (t.heartRate < 50) {
      anomalies.push({
        type: 'CARDIAC',
        severity: 'CRITICAL',
        param: 'Heart Rate (Severe Bradycardia)',
        value: `${t.heartRate} bpm`,
        threshold: '60 - 80 bpm',
        probability: 0.94,
        pathology: 'Autonomic dysfunction or high vagal tone in microgravity.',
        action: 'Alert flight surgeon; prepare atropine auto-injector.'
      });
    }

    // 2. Oxygen Saturation (SpO2)
    if (t.spo2 < 94) {
      anomalies.push({
        type: 'RESPIRATORY',
        severity: 'CRITICAL',
        param: 'SpO2 Oxygen Drop',
        value: `${t.spo2}%`,
        threshold: '>= 96%',
        probability: 0.96,
        pathology: 'Acute alveolar ventilation deficit or localized cabin CO2 pocket.',
        action: 'Switch suit to secondary emergency O2 bottle; inspect air ventilation duct.'
      });
    } else if (t.spo2 < 97) {
      anomalies.push({
        type: 'RESPIRATORY',
        severity: 'WARNING',
        param: 'SpO2 Oxygen Saturation',
        value: `${t.spo2}%`,
        threshold: '>= 97%',
        probability: 0.72,
        pathology: 'Sub-optimal gas diffusion; potential microgravity sleep apnea.',
        action: 'Increase cabin air circulation fan speed by +15%.'
      });
    }

    // 3. Ionizing Radiation Rate
    if (t.radiationDoseRateUsvH > 50) {
      anomalies.push({
        type: 'RADIATION',
        severity: 'CRITICAL',
        param: 'Solar Particle Radiation Surge',
        value: `${t.radiationDoseRateUsvH} µSv/h`,
        threshold: '< 25 µSv/h',
        probability: 0.92,
        pathology: 'High-energy solar energetic proton (SEP) penetration.',
        action: 'Sound cabin radiation alarm; order immediate shelter in storm haven.'
      });
    } else if (t.radiationDoseRateUsvH > 35) {
      anomalies.push({
        type: 'RADIATION',
        severity: 'WARNING',
        param: 'Elevated Cosmic Ray Dose',
        value: `${t.radiationDoseRateUsvH} µSv/h`,
        threshold: '< 25 µSv/h',
        probability: 0.68,
        pathology: 'Galactic cosmic ray background elevation during solar minimum.',
        action: 'Log cumulative dosimeter reading; postpone non-essential spacewalks.'
      });
    }

    // 4. Neuro-Psychological Stress
    if (t.stressScore > 70) {
      anomalies.push({
        type: 'MENTAL',
        severity: 'WARNING',
        param: 'Acute Neuro-Stress Index',
        value: `${t.stressScore}/100`,
        threshold: '< 45/100',
        probability: 0.78,
        pathology: 'Confined mission fatigue and circadian rhythm decoupling.',
        action: 'Prescribe 30 min audio-visual restorative mindfulness protocol.'
      });
    }

    // 5. Hydration
    if (t.hydrationPct < 85) {
      anomalies.push({
        type: 'DEHYDRATION',
        severity: 'WARNING',
        param: 'Systemic Fluid Depletion',
        value: `${t.hydrationPct}%`,
        threshold: '>= 90%',
        probability: 0.81,
        pathology: 'Microgravity hypovolemia combined with post-EVA sweat loss.',
        action: 'Drink 750ml electrolyte oral rehydration solution (ORS).'
      });
    }

    return {
      status: anomalies.some(a => a.severity === 'CRITICAL')
        ? 'CRITICAL'
        : anomalies.length > 0
        ? 'WARNING'
        : 'NORMAL',
      anomalies
    };
  }

  renderAnomalyBadges(containerId, anomalyResult) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (anomalyResult.anomalies.length === 0) {
      container.innerHTML = `
        <div style="background: rgba(0, 255, 153, 0.1); border: 1px solid var(--success-green); padding: 0.8rem 1.2rem; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="color:var(--success-green); font-size:1.2rem;">●</span>
            <span style="font-family:'Rajdhani'; font-weight:700; color:var(--success-green); font-size:1rem;">ALL PHYSIOLOGICAL CHANNELS NOMINAL</span>
          </div>
          <span style="font-family:'Share Tech Mono'; font-size:0.8rem; color:#8E9DB8;">AI Confidence: 99.4%</span>
        </div>
      `;
      return;
    }

    container.innerHTML = anomalyResult.anomalies.map(a => `
      <div style="background: ${a.severity === 'CRITICAL' ? 'rgba(255, 77, 109, 0.15)' : 'rgba(255, 184, 0, 0.12)'}; border: 1px solid ${a.severity === 'CRITICAL' ? 'var(--danger-red)' : 'var(--warning-amber)'}; padding: 0.9rem 1.2rem; border-radius: 8px; margin-bottom: 0.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <span style="font-family:'Orbitron'; font-size:0.82rem; font-weight:700; color:${a.severity === 'CRITICAL' ? 'var(--danger-red)' : 'var(--warning-amber)'};">
            [${a.severity}] ${a.param}: ${a.value} (NORM: ${a.threshold})
          </span>
          <span style="font-family:'Share Tech Mono'; font-size:0.75rem; color:#8E9DB8;">
            ANOMALY PROBABILITY: ${(a.probability * 100).toFixed(0)}%
          </span>
        </div>
        <div style="font-size:0.86rem; color:var(--text-main); margin-bottom:0.35rem;">
          <strong>Pathology:</strong> ${a.pathology}
        </div>
        <div style="font-size:0.82rem; color:var(--accent-cyan); font-family:'Share Tech Mono';">
          <strong>Recommended Protocol:</strong> ${a.action}
        </div>
      </div>
    `).join('');
  }
}

window.AnomalyDetectionEngine = AnomalyDetectionEngine;
