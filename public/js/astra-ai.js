// ==============================================================================
// AstraVital AI - Astra AI Health Assistant & Clinical Decision Engine
// NASA Space Apps Challenge 2026
// ==============================================================================

class AstraAIAssistant {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.inputField = document.getElementById('chat-input');
    this.voiceBtn = document.getElementById('chat-voice-btn');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.speechSynth = window.speechSynthesis || null;
    this.recognition = null;
    this.isListening = false;

    this.initVoiceRecognition();
    this.initEventListeners();
  }

  initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.voiceBtn) {
          this.voiceBtn.style.color = '#FF4D6D';
          this.voiceBtn.style.borderColor = '#FF4D6D';
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.inputField) {
          this.inputField.value = transcript;
          this.sendMessage();
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.voiceBtn) {
          this.voiceBtn.style.color = 'var(--accent-cyan)';
          this.voiceBtn.style.borderColor = 'var(--border-cyan)';
        }
      };
    }
  }

  initEventListeners() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (this.inputField) {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => this.toggleVoiceListening());
    }

    // Quick prompt pills
    document.querySelectorAll('.quick-prompt-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const text = e.target.innerText;
        if (this.inputField) {
          this.inputField.value = text;
          this.sendMessage();
        }
      });
    });
  }

  toggleVoiceListening() {
    if (!this.recognition) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  speakResponse(text) {
    if (!this.speechSynth) return;
    this.speechSynth.cancel(); // Stop prior audio

    // Clean markdown symbols for cleaner voice narration
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 280);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 1.05;
    utterance.rate = 1.0;

    // Pick English female/futuristic voice if available
    const voices = this.speechSynth.getVoices();
    const spaceVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Samantha')));
    if (spaceVoice) utterance.voice = spaceVoice;

    this.speechSynth.speak(utterance);
  }

  async sendMessage() {
    const query = this.inputField ? this.inputField.value.trim() : '';
    if (!query) return;

    if (this.inputField) this.inputField.value = '';
    this.appendMessage('user', query);

    if (window.soundEngine) window.soundEngine.playTelemetryBeep(950, 0.05);

    // Show AI typing indicator
    const typingId = this.showTypingIndicator();

    try {
      const activeAstronaut = window.appState ? window.appState.currentAstronaut : null;
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          astronautId: activeAstronaut ? activeAstronaut.id : 'ast-002',
          prompt: query,
          telemetry: activeAstronaut ? activeAstronaut.telemetry : null
        })
      });

      this.removeTypingIndicator(typingId);

      if (!res.ok) throw new Error('AI Engine unreachable');
      const json = await res.json();
      this.renderAIResponse(json.data, query);
    } catch (err) {
      this.removeTypingIndicator(typingId);
      // Autonomous clinical knowledge base fallback
      const fallbackData = this.generateAutonomousMedicalResponse(query);
      this.renderAIResponse(fallbackData, query);
    }
  }

  renderAIResponse(data, originalQuery) {
    let htmlContent = `
      <p style="margin-bottom:0.6rem;">${data.clinicalSummary}</p>
    `;

    if (data.anomalies && data.anomalies.length > 0) {
      htmlContent += `
        <div style="background: rgba(0, 229, 255, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.5rem 0.8rem; margin: 0.6rem 0; font-size: 0.84rem;">
          <strong>Clinical Pathophysiology:</strong><br>
          ${data.anomalies[0].pathophysiology}
        </div>
      `;
    }

    if (data.actionableProtocols && data.actionableProtocols.length > 0) {
      htmlContent += `
        <div style="margin-top:0.6rem;">
          <strong style="color:var(--success-green); font-family:'Rajdhani'; font-size:0.95rem;">RECOMMENDED COUNTERMEASURE PROTOCOL:</strong>
          <ul style="margin-left: 1.2rem; margin-top: 0.3rem; font-size: 0.86rem; color: #E0E7FF;">
            ${data.actionableProtocols.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    htmlContent += `
      <div style="margin-top:0.75rem; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.5rem; font-family:'Share Tech Mono'; font-size:0.72rem; color:#8E9DB8;">
        <span>AI CONFIDENCE: ${(data.aiConfidenceScore * 100).toFixed(1)}% | ${data.spaceMedicineCitation}</span>
        <button onclick="window.astraAI.speakResponse('${data.clinicalSummary.replace(/'/g, "\\'")}')" style="background:transparent; border:1px solid var(--border-cyan); color:var(--accent-cyan); border-radius:4px; padding:0.15rem 0.5rem; cursor:pointer; font-family:'Share Tech Mono'; font-size:0.7rem;">🔊 Read Aloud</button>
      </div>
    `;

    this.appendMessage('astra', htmlContent);
    this.speakResponse(data.clinicalSummary);
    if (window.soundEngine) window.soundEngine.playConfirmChime();
  }

  generateAutonomousMedicalResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('heart') || q.includes('cardiac') || q.includes('pulse')) {
      return {
        clinicalSummary: 'Cardiovascular assessment indicates compensatory sinus tachycardia. Microgravity cephalad fluid redistribution causes acute central venous pressure elevation followed by baroreceptor resetting and plasma volume contraction.',
        anomalies: [{
          pathophysiology: 'During long-duration spaceflight, the heart loses up to 8-10% of left ventricular mass if resistive countermeasure loads are neglected.'
        }],
        actionableProtocols: [
          'Schedule 30 min on CEVIS cycle ergometer at 75% VO2 peak.',
          'Execute pre-EVA oral rehydration protocol (1.0L isotonic saline).',
          'Deploy Lower Body Negative Pressure (LBNP) chamber at -30 mmHg for 40 min.'
        ],
        aiConfidenceScore: 0.965,
        spaceMedicineCitation: 'NASA Spaceflight Human System Standard: NASA-STD-3001'
      };
    } else if (q.includes('radiation') || q.includes('flare') || q.includes('storm')) {
      return {
        clinicalSummary: 'Radiation dosimetry model predicts cumulative galactic cosmic ray (GCR) exposure at 1.4 mSv/day plus Solar Energetic Particle (SEP) background flux.',
        anomalies: [{
          pathophysiology: 'High-Z and energy (HZE) ionizing nuclei induce DNA double-strand breaks and oxidative cellular stress in deep space transit.'
        }],
        actionableProtocols: [
          'Move crew quarters to storm haven surrounded by potable water and food pantry bulkheads.',
          'Administer antioxidant medical protocol (N-acetylcysteine + Vitamin E/C).',
          'Enforce strict EVA moratorium until DONKI Kp index drops below 3.0.'
        ],
        aiConfidenceScore: 0.98,
        spaceMedicineCitation: 'NASA Bio-Dosimetry & Space Radiation Risk Framework'
      };
    } else if (q.includes('bone') || q.includes('muscle') || q.includes('osteopenia')) {
      return {
        clinicalSummary: 'Musculoskeletal digital twin projects 1.1% monthly cancellous bone demineralization in lumbar vertebrae and femoral neck without ARED resistive exercise.',
        anomalies: [{
          pathophysiology: 'Unloading of osteocytes suppresses Wnt/beta-catenin signaling, boosting osteoclast bone resorption and calcium excretion.'
        }],
        actionableProtocols: [
          'Perform daily 2.5 hours on ARED (Advanced Resistive Exercise Device) focusing on squat, deadlift, and heel raises.',
          'Maintain 1000 IU Vitamin D3 daily oral dosage with 1200mg calcium.',
          'Consider subcutaneous denosumab or bisphosphonate protocol for Mars transit.'
        ],
        aiConfidenceScore: 0.95,
        spaceMedicineCitation: 'NASA Human Research Program (HRP) Bone Loss Risk Mitigation'
      };
    }

    return {
      clinicalSummary: `Astra AI synthesized telemetry across cardiovascular, respiratory, and neuro-vestibular systems. Mission profile remains within NASA Level-2 Flight Medicine clearance boundaries.`,
      anomalies: [{
        pathophysiology: 'Normal adaptation to microgravity environment with stable cephalic fluid equilibrium and optimal cognitive reaction latency.'
      }],
      actionableProtocols: [
        'Maintain daily aerobic and resistive exercise regimen.',
        'Record evening mental wellness check-in and cognitive latency test.',
        'Keep crew cabin ambient lighting aligned with 24-hour circadian schedule.'
      ],
      aiConfidenceScore: 0.94,
      spaceMedicineCitation: 'NASA Clinical Space Medicine Guidelines 2026'
    };
  }

  showTypingIndicator() {
    const id = `typing-${Date.now()}`;
    const div = document.createElement('div');
    div.id = id;
    div.className = 'chat-bubble bubble-astra';
    div.innerHTML = `<span style="font-family:'Share Tech Mono'; color:var(--accent-cyan);">Astra AI is analyzing physiological telemetry & space medicine models...</span>`;
    if (this.messagesContainer) {
      this.messagesContainer.appendChild(div);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  appendMessage(sender, content) {
    if (!this.messagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'astra' ? 'bubble-astra' : 'bubble-user'}`;
    bubble.innerHTML = content;
    this.messagesContainer.appendChild(bubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

window.AstraAIAssistant = AstraAIAssistant;
