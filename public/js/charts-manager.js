// ==============================================================================
// AstraVital AI - Chart.js Telemetry Data Visualizer Engine
// NASA Space Apps Challenge 2026
// ==============================================================================

class TelemetryChartsManager {
  constructor() {
    this.vitalsLineChart = null;
    this.biometricRadarChart = null;
    this.radiationAreaChart = null;
    this.metabolicDoughnutChart = null;

    this.maxDataPoints = 20;
    this.timeLabels = [];
    this.hrStreamData = [];
    this.spo2StreamData = [];

    // Pre-populate 15 timestamps
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const t = new Date(now - i * 1500);
      this.timeLabels.push(t.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }));
      this.hrStreamData.push(68 + Math.round((Math.random() - 0.5) * 6));
      this.spo2StreamData.push(98.4 + Number(((Math.random() - 0.5) * 0.6).toFixed(1)));
    }
  }

  initAllCharts() {
    this.initVitalsLineChart();
    this.initBiometricRadarChart();
    this.initRadiationAreaChart();
    this.initMetabolicDoughnutChart();
  }

  initVitalsLineChart() {
    const ctx = document.getElementById('vitals-line-chart');
    if (!ctx) return;

    this.vitalsLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...this.timeLabels],
        datasets: [
          {
            label: 'Heart Rate (BPM)',
            data: [...this.hrStreamData],
            borderColor: '#FF4D6D',
            backgroundColor: 'rgba(255, 77, 109, 0.12)',
            borderWidth: 2.2,
            tension: 0.35,
            fill: true,
            yAxisID: 'yHr',
            pointRadius: 2,
            pointHoverRadius: 5
          },
          {
            label: 'SpO2 Oxygen (%)',
            data: [...this.spo2StreamData],
            borderColor: '#00E5FF',
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            yAxisID: 'ySpo2',
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#8E9DB8',
              font: { family: 'Share Tech Mono', size: 11 },
              boxWidth: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(5, 8, 22, 0.92)',
            titleColor: '#00E5FF',
            borderColor: 'rgba(0, 229, 255, 0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#546481', font: { family: 'Share Tech Mono', size: 10 } }
          },
          yHr: {
            type: 'linear',
            position: 'left',
            min: 45,
            max: 120,
            grid: { color: 'rgba(255, 77, 109, 0.08)' },
            ticks: { color: '#FF4D6D', font: { family: 'Share Tech Mono', size: 10 } }
          },
          ySpo2: {
            type: 'linear',
            position: 'right',
            min: 90,
            max: 100,
            grid: { drawOnChartArea: false },
            ticks: { color: '#00E5FF', font: { family: 'Share Tech Mono', size: 10 } }
          }
        }
      }
    });
  }

  initBiometricRadarChart() {
    const ctx = document.getElementById('biometric-radar-chart');
    if (!ctx) return;

    this.biometricRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Cardiovascular',
          'Bone Density',
          'Neuro-Cognitive',
          'Radiation Reserve',
          'Hydration Index',
          'Circadian Sleep'
        ],
        datasets: [
          {
            label: 'CDR Vance (Artemis IV)',
            data: [92, 88, 95, 85, 94, 90],
            borderColor: '#00E5FF',
            backgroundColor: 'rgba(0, 229, 255, 0.25)',
            borderWidth: 2,
            pointBackgroundColor: '#00E5FF'
          },
          {
            label: 'Dr. Thorne (Mars Transit)',
            data: [72, 70, 68, 62, 78, 64],
            borderColor: '#FF4D6D',
            backgroundColor: 'rgba(255, 77, 109, 0.25)',
            borderWidth: 2,
            pointBackgroundColor: '#FF4D6D'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#8E9DB8', font: { family: 'Share Tech Mono', size: 11 } }
          }
        },
        scales: {
          r: {
            min: 20,
            max: 100,
            grid: { color: 'rgba(0, 229, 255, 0.12)' },
            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: {
              color: '#8E9DB8',
              font: { family: 'Rajdhani', size: 11, weight: 'bold' }
            },
            ticks: { display: false }
          }
        }
      }
    });
  }

  initRadiationAreaChart() {
    const ctx = document.getElementById('radiation-area-chart');
    if (!ctx) return;

    const sols = ['Sol 10', 'Sol 30', 'Sol 60', 'Sol 90', 'Sol 120', 'Sol 150', 'Sol 180'];
    const cumulativeMsv = [8.4, 22.1, 44.8, 69.2, 94.6, 121.0, 148.5];
    const solarStormSpikes = [0, 0, 12.5, 0, 18.2, 0, 0];

    this.radiationAreaChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sols,
        datasets: [
          {
            type: 'line',
            label: 'Cumulative Mission Dose (mSv)',
            data: cumulativeMsv,
            borderColor: '#7B61FF',
            backgroundColor: 'rgba(123, 97, 255, 0.15)',
            fill: true,
            tension: 0.4,
            yAxisID: 'yCumul'
          },
          {
            type: 'bar',
            label: 'Solar Flare Event Spike (mSv)',
            data: solarStormSpikes,
            backgroundColor: 'rgba(255, 184, 0, 0.65)',
            borderColor: '#FFB800',
            borderWidth: 1,
            yAxisID: 'yDaily'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#8E9DB8', font: { family: 'Share Tech Mono', size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#546481', font: { family: 'Share Tech Mono' } }
          },
          yCumul: {
            position: 'left',
            grid: { color: 'rgba(123, 97, 255, 0.08)' },
            ticks: { color: '#7B61FF', font: { family: 'Share Tech Mono' } }
          },
          yDaily: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#FFB800', font: { family: 'Share Tech Mono' } }
          }
        }
      }
    });
  }

  initMetabolicDoughnutChart() {
    const ctx = document.getElementById('metabolic-doughnut-chart');
    if (!ctx) return;

    this.metabolicDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Basal Metabolism', 'ARED Resistive', 'Cycle Ergometer', 'EVA Extravehicular'],
        datasets: [
          {
            data: [1950, 480, 360, 280],
            backgroundColor: ['#00E5FF', '#7B61FF', '#00FF99', '#FFB800'],
            borderColor: '#050816',
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#8E9DB8', font: { family: 'Rajdhani', size: 11 } }
          }
        }
      }
    });
  }

  pushLiveTelemetry(hr, spo2) {
    if (!this.vitalsLineChart) return;

    const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
    this.timeLabels.push(timeStr);
    this.hrStreamData.push(hr);
    this.spo2StreamData.push(spo2);

    if (this.timeLabels.length > this.maxDataPoints) {
      this.timeLabels.shift();
      this.hrStreamData.shift();
      this.spo2StreamData.shift();
    }

    this.vitalsLineChart.data.labels = [...this.timeLabels];
    this.vitalsLineChart.data.datasets[0].data = [...this.hrStreamData];
    this.vitalsLineChart.data.datasets[1].data = [...this.spo2StreamData];
    this.vitalsLineChart.update('none'); // silent fast update
  }
}

window.TelemetryChartsManager = TelemetryChartsManager;
