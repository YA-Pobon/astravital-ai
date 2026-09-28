// ==============================================================================
// AstraVital AI - NASA Open Data & Space Weather Intelligence Center
// NASA Space Apps Challenge 2026
// ==============================================================================

class NasaEnvironmentCenter {
  constructor() {
    this.spaceWeatherData = null;
    this.apodData = null;
    this.init();
  }

  async init() {
    await this.fetchSpaceWeather();
    await this.fetchApod();
  }

  async fetchSpaceWeather() {
    try {
      const res = await fetch('/api/nasa/space-weather');
      const json = await res.json();
      this.spaceWeatherData = json.data;
      this.renderSpaceWeather(this.spaceWeatherData);
    } catch (e) {
      console.warn('Failed to load space weather', e);
    }
  }

  async fetchApod() {
    try {
      const res = await fetch('/api/nasa/apod');
      const json = await res.json();
      this.apodData = json.data;
      this.renderApod(this.apodData);
    } catch (e) {
      console.warn('Failed to load APOD', e);
    }
  }

  renderSpaceWeather(data) {
    if (!data) return;

    const flareEl = document.getElementById('space-solar-flare');
    const windEl = document.getElementById('space-solar-wind');
    const kpEl = document.getElementById('space-kp-index');
    const radEl = document.getElementById('space-cosmic-dose');
    const summaryEl = document.getElementById('space-weather-summary');
    const shelterEl = document.getElementById('space-shelter-recommendation');

    if (flareEl) flareEl.innerText = data.solarFlareClass || 'M4.2 / Moderate';
    if (windEl) windEl.innerText = `${data.solarWindVelocityKmS || '432.8'} km/s`;
    if (kpEl) kpEl.innerText = `Kp ${data.geomagneticKpIndex || '3.8'}`;
    if (radEl) radEl.innerText = `${data.cosmicRayDoseRateUsvH || '42.6'} µSv/h`;

    if (summaryEl) {
      summaryEl.innerText = data.summary || 'Coronal mass ejection (CME) shock front traveling along interplanetary magnetic field lines. Mars Transit corridor subject to secondary ionizing proton flux.';
    }

    if (shelterEl) {
      shelterEl.innerText = data.shelterRecommendation || 'Storm shelter haven alert Level 2. Potable water tanks positioned toward solar vector.';
    }
  }

  renderApod(data) {
    if (!data) return;
    const apodImg = document.getElementById('nasa-apod-img');
    const apodTitle = document.getElementById('nasa-apod-title');
    const apodDate = document.getElementById('nasa-apod-date');

    if (apodImg && data.url) apodImg.src = data.url;
    if (apodTitle) apodTitle.innerText = data.title || 'NASA Orbital Telemetry';
    if (apodDate) apodDate.innerText = data.date || '2026-09-24';
  }
}

window.NasaEnvironmentCenter = NasaEnvironmentCenter;
