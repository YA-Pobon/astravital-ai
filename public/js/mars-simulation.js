// ==============================================================================
// AstraVital AI - Mars Mission Health Degradation Simulator
// NASA Space Apps Challenge 2026
// ==============================================================================

class MarsMissionSimulator {
  constructor() {
    this.durationDays = 180;
    this.shielding = 'Polyethylene_Composite';
    this.exerciseHours = 2.5;
    this.dietSupplements = true;

    this.initEventListeners();
    this.runSimulation();
  }

  initEventListeners() {
    const daysSlider = document.getElementById('mars-duration-slider');
    const exerciseSlider = document.getElementById('mars-exercise-slider');
    const shieldingSelect = document.getElementById('mars-shielding-select');
    const dietCheck = document.getElementById('mars-diet-check');

    if (daysSlider) {
      daysSlider.addEventListener('input', (e) => {
        this.durationDays = parseInt(e.target.value);
        document.getElementById('mars-duration-val').innerText = `${this.durationDays} Days`;
        this.runSimulation();
      });
    }

    if (exerciseSlider) {
      exerciseSlider.addEventListener('input', (e) => {
        this.exerciseHours = parseFloat(e.target.value);
        document.getElementById('mars-exercise-val').innerText = `${this.exerciseHours} hrs/day`;
        this.runSimulation();
      });
    }

    if (shieldingSelect) {
      shieldingSelect.addEventListener('change', (e) => {
        this.shielding = e.target.value;
        this.runSimulation();
      });
    }

    if (dietCheck) {
      dietCheck.addEventListener('change', (e) => {
        this.dietSupplements = e.target.checked;
        this.runSimulation();
      });
    }

    // Preset quick buttons (30d, 90d, 180d, 365d, 1000d)
    document.querySelectorAll('.mars-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const days = parseInt(e.target.dataset.days);
        if (daysSlider) {
          daysSlider.value = days;
          document.getElementById('mars-duration-val').innerText = `${days} Days`;
        }
        this.durationDays = days;
        this.runSimulation();
      });
    });
  }

  async runSimulation() {
    try {
      const res = await fetch('/api/mars-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationDays: this.durationDays,
          shieldingType: this.shielding,
          exerciseHoursPerDay: this.exerciseHours,
          dietSupplementation: this.dietSupplements
        })
      });

      if (!res.ok) throw new Error('API failed');
      const json = await res.json();
      this.renderResults(json.data);
    } catch (err) {
      // Local mathematical fallback model
      const fallback = this.computeLocalSimulation();
      this.renderResults(fallback);
    }
  }

  computeLocalSimulation() {
    const exerciseFactor = Math.min(1.0, this.exerciseHours / 3.0);
    const dietFactor = this.dietSupplements ? 0.2 : 0.0;
    const mitigation = (0.55 * exerciseFactor) + dietFactor;
    const baseLoss = 1.35;
    const netLoss = Math.max(0.2, baseLoss * (1 - mitigation));
    const totalBoneLoss = Number((netLoss * (this.durationDays / 30)).toFixed(1));

    const shieldRatios = {
      'Aluminum_Baseline': 1.0,
      'Polyethylene_Composite': 0.68,
      'Water_Wall_Active': 0.44,
      'Regolith_Habitat': 0.28
    };
    const sFactor = shieldRatios[this.shielding] || 0.68;
    const totalRad = Number((1.6 * this.durationDays * sFactor).toFixed(1));
    const cardioRisk = Math.max(5, Math.min(95, Math.round(50 * (1 - exerciseFactor) + (this.durationDays / 12))));
    const sansRisk = Math.min(85, Math.round(15 + (this.durationDays * 0.06)));
    const cancerRisk = Number((totalRad * 0.004).toFixed(2));
    const readiness = Math.max(35, Math.min(99, Math.round(100 - (totalBoneLoss * 1.5) - (totalRad * 0.08) - (cardioRisk * 0.2))));

    return {
      durationDays: this.durationDays,
      totalBoneLossPct: totalBoneLoss,
      boneRetentionPct: Number((100 - totalBoneLoss).toFixed(1)),
      totalRadiationDoseMsv: totalRad,
      cancerExcessRiskPct: cancerRisk,
      cardiovascularAtrophyRiskPct: cardioRisk,
      sansOcularRiskPct: sansRisk,
      missionReadinessScore: readiness,
      timeline: [
        { day: 0, label: 'Earth Departure & TMI Burn', healthScore: 98, status: 'NOMINAL' },
        { day: Math.round(this.durationDays * 0.25), label: 'Mid-Course Correction 1', healthScore: Math.round(98 - (totalBoneLoss * 0.4)), status: 'MONITORED' },
        { day: Math.round(this.durationDays * 0.5), label: 'Deep Space Aphelion / Solar Zone', healthScore: Math.round(95 - (totalBoneLoss * 0.7)), status: 'ATTENTION' },
        { day: Math.round(this.durationDays * 0.75), label: 'Mars Approach Prep', healthScore: Math.round(92 - totalBoneLoss), status: 'RESTRICTED' },
        { day: this.durationDays, label: 'Mars Orbit Insertion / Surface Landing', healthScore: Math.max(45, Math.round(90 - totalBoneLoss - (cardioRisk * 0.15))), status: 'RECONDITIONING' }
      ]
    };
  }

  renderResults(data) {
    const readinessEl = document.getElementById('mars-readiness-score');
    const boneLossEl = document.getElementById('mars-bone-loss');
    const radDoseEl = document.getElementById('mars-rad-dose');
    const cardioEl = document.getElementById('mars-cardio-risk');
    const sansEl = document.getElementById('mars-sans-risk');
    const cancerEl = document.getElementById('mars-cancer-risk');
    const timelineContainer = document.getElementById('mars-timeline-list');

    if (readinessEl) {
      readinessEl.innerText = `${data.missionReadinessScore}%`;
      readinessEl.style.color = data.missionReadinessScore > 80 ? '#00FF99' : data.missionReadinessScore > 65 ? '#FFB800' : '#FF4D6D';
    }
    if (boneLossEl) boneLossEl.innerText = `-${data.totalBoneLossPct}%`;
    if (radDoseEl) radDoseEl.innerText = `${data.totalRadiationDoseMsv} mSv`;
    if (cardioEl) cardioEl.innerText = `${data.cardiovascularAtrophyRiskPct}% Risk`;
    if (sansEl) sansEl.innerText = `${data.sansOcularRiskPct}% Risk`;
    if (cancerEl) cancerEl.innerText = `+${data.cancerExcessRiskPct}%`;

    // Render interactive timeline
    if (timelineContainer && data.timeline) {
      timelineContainer.innerHTML = data.timeline.map((item, idx) => `
        <div class="timeline-step-row" style="display:flex; justify-content:space-between; align-items:center; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Share Tech Mono'; font-size: 0.82rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="color:var(--accent-cyan); font-weight:bold;">DAY ${item.day}</span>
            <span style="color:var(--text-main); font-family:'Rajdhani'; font-size:0.95rem;">${item.label}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.8rem;">
            <span style="color:${item.healthScore > 80 ? '#00FF99' : '#FFB800'};">Vitals Index: ${item.healthScore}</span>
            <span style="font-size:0.7rem; padding:0.15rem 0.4rem; border-radius:3px; background:rgba(255,255,255,0.08);">${item.status}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

window.MarsMissionSimulator = MarsMissionSimulator;
