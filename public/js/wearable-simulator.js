// ==============================================================================
// AstraVital AI - Wearable Sensor Simulator & ECG Canvas Waveform Engine
// NASA Space Apps Challenge 2026
// ==============================================================================

class WearableSensorSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.animationFrame = null;
    this.isRunning = true;

    // Simulation params
    this.cursorX = 0;
    this.speed = 2.4;
    this.mode = 'NOMINAL'; // 'NOMINAL', 'TACHYCARDIA', 'HYPOXIA', 'RADIATION_SPIKE'
    this.sampleIndex = 0;
    this.prevY = null;

    // Waveform buffer
    this.initCanvasSize();
    this.startLoop();
  }

  initCanvasSize() {
    this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    this.canvas.height = 200;
    this.ctx.fillStyle = '#000c14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement.clientWidth || 600;
      this.canvas.height = 200;
      this.ctx.fillStyle = '#000c14';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.cursorX = 0;
    });
  }

  // Generates mathematical ECG voltage at phase t
  getEcgVoltage(phase) {
    // phase between 0 and 1
    // Baseline
    let v = 0;

    // P-wave (Atrial depolarization) around 0.15 - 0.25
    if (phase >= 0.12 && phase <= 0.22) {
      const p = (phase - 0.12) / 0.10;
      v += Math.sin(p * Math.PI) * 0.15;
    }

    // Q-dip around 0.32
    if (phase >= 0.30 && phase <= 0.33) {
      v -= 0.18;
    }

    // R-spike (Ventricular depolarization) around 0.35 - 0.39
    if (phase >= 0.33 && phase <= 0.37) {
      const r = (phase - 0.33) / 0.04;
      v += Math.sin(r * Math.PI) * 1.35;
    }

    // S-dip around 0.38 - 0.42
    if (phase >= 0.37 && phase <= 0.41) {
      v -= 0.35;
    }

    // T-wave (Ventricular repolarization) around 0.52 - 0.70
    if (phase >= 0.52 && phase <= 0.70) {
      const t = (phase - 0.52) / 0.18;
      v += Math.sin(t * Math.PI) * 0.32;
    }

    // Add slight physiological sinus noise
    v += (Math.random() - 0.5) * 0.04;
    return v;
  }

  startLoop() {
    const render = () => {
      if (!this.isRunning) return;

      const w = this.canvas.width;
      const h = this.canvas.height;
      const midY = h * 0.52;

      // Period duration depending on mode
      let cycleLength = 70; // 70 samples per beat = ~75 bpm
      if (this.mode === 'TACHYCARDIA') cycleLength = 45; // ~115 bpm
      else if (this.mode === 'HYPOXIA') cycleLength = 85;

      const phase = (this.sampleIndex % cycleLength) / cycleLength;
      const voltage = this.getEcgVoltage(phase);
      const currentY = midY - (voltage * (h * 0.38));

      // Erase ahead of cursor (green sweep effect)
      this.ctx.fillStyle = 'rgba(0, 12, 20, 0.4)';
      this.ctx.fillRect(this.cursorX, 0, 24, h);

      // Draw ECG line segment
      if (this.prevY !== null) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX - this.speed, this.prevY);
        this.ctx.lineTo(this.cursorX, currentY);

        if (this.mode === 'TACHYCARDIA') {
          this.ctx.strokeStyle = '#FF4D6D';
          this.ctx.shadowColor = '#FF4D6D';
        } else {
          this.ctx.strokeStyle = '#00FF99';
          this.ctx.shadowColor = '#00FF99';
        }
        this.ctx.shadowBlur = 6;
        this.ctx.lineWidth = 2.2;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      }

      this.prevY = currentY;
      this.cursorX += this.speed;
      this.sampleIndex++;

      // Wrap around canvas width
      if (this.cursorX >= w) {
        this.cursorX = 0;
        this.prevY = null;
      }

      this.animationFrame = requestAnimationFrame(render);
    };

    render();
  }

  setCondition(condition) {
    this.mode = condition;
    if (window.soundEngine) {
      if (condition === 'TACHYCARDIA') {
        window.soundEngine.playWarningBeep();
      } else {
        window.soundEngine.playConfirmChime();
      }
    }

    const modeTag = document.getElementById('ecg-mode-tag');
    if (modeTag) {
      modeTag.innerText = `RHYTHM: ${condition.replace('_', ' ')}`;
      modeTag.style.color = condition === 'TACHYCARDIA' ? '#FF4D6D' : '#00FF99';
    }
  }
}

window.WearableSensorSimulator = WearableSensorSimulator;
