// ==============================================================================
// AstraVital AI - Procedural Web Audio API Sound Synthesizer
// NASA Space Apps Challenge 2026
// ==============================================================================

class SpaceAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Futuristic telemetry chirp for data arrival & button clicks
  playTelemetryBeep(freq = 880, duration = 0.06) {
    if (this.isMuted) return;
    try {
      this.init();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Mission Control Confirmation Chime
  playConfirmChime() {
    if (this.isMuted) return;
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = this.audioCtx.currentTime + (idx * 0.05);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {}
  }

  // Warning Sound
  playWarningBeep() {
    if (this.isMuted) return;
    try {
      this.init();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, this.audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  // Critical Emergency Klaxon (NASA Red Alert Siren)
  playEmergencyKlaxon() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.audioCtx.currentTime;
      for (let i = 0; i < 2; i++) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = now + (i * 0.35);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, start);
        osc.frequency.exponentialRampToValueAtTime(400, start + 0.3);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      }
    } catch (e) {}
  }
}

window.soundEngine = new SpaceAudioSynthesizer();
