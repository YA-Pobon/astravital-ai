# 🚀 AstraVital AI
### Intelligent Astronaut Health Monitoring & Decision Support Platform
**NASA Space Apps Challenge 2026 Global Finalist Entry**  
*Challenge: "Create Health Monitoring Software for Astronauts on Space Missions"*

---

## 🌌 Overview

**AstraVital AI** is a mission-critical, full-stack healthcare intelligence platform engineered for astronauts, flight surgeons, biomedical researchers, and NASA mission control flight directors. Designed specifically for long-duration deep space exploration—such as the **Artemis Lunar Base** and **Ares IV Mars Expeditions**—AstraVital AI bridges terrestrial medicine and interplanetary survival.

The platform unites real-time wearable telemetry streams, bio-mathematical digital twins, NASA DONKI space weather intelligence, and an autonomous AI clinical assistant capable of diagnosing complex spaceflight pathologies (including Spaceflight Associated Neuro-ocular Syndrome - SANS, microgravity cardiovascular remodeling, and cosmic radiation accumulation).

---

## 🛰️ Key System Modules

### 1. 📊 Astronaut Health Command Center
* Continuous streaming telemetry monitoring:
  * **Heart Rate (BPM)** with resting microgravity baseline drift
  * **Blood Oxygen Saturation (SpO2 %)** with alveolar diffusion modeling
  * **Blood Pressure (Systolic/Diastolic mmHg)** tracking cephalad fluid shift
  * **Core Body Temperature (°C)** with circadian rhythm tracking
  * **Autonomic Stress Score (0–100)**
  * **Sleep Quality Architecture & REM Latency**
  * **Hydration Index (%) & Intravascular Volume**
  * **Deep Space Ionizing Radiation Rate (µSv/h)**
* Real-time Line Graphs, Physiological Resilience Radar, and Metabolic Doughnut Charts powered by Chart.js.

### 2. 🧬 3D Holographic Astronaut Digital Twin
* Interactive 3D humanoid avatar rendered in **Three.js** with vertical telemetry scanlines.
* Anatomical hotspot layers with dynamic camera focus:
  * **Cardiac Hemodynamics**: Left ventricular mass atrophy, stroke volume reduction.
  * **Cerebrovascular & Neuro-Vestibular (SANS)**: Optic nerve sheath edema and intracranial pressure (ICP) elevation.
  * **Axial Spine**: Microgravity disc elongation (+4.2 cm) and paraspinal atrophy.
  * **Femur Trabecular Bone Demineralization**: Resorption rate tracking (~1.1% per 30 days).
  * **Pulmonary Gas Exchange**: Cabin partial pressure and CO2 pocket diffusion.
* Dynamic organ stress indexes and clinical countermeasure recommendations.

### 3. 🤖 Astra AI Clinical Assistant & Decision Support
* Mission-control styled medical conversational assistant.
* Powered by bio-astronautics models citing **NASA SP-2020-5007** and **NASA-STD-3001**.
* **Voice Interaction Ready**:
  * Voice synthesis via Web Speech API (`speechSynthesis`) narrates diagnoses in an AI voice.
  * Speech recognition (`SpeechRecognition`) for hands-free query input during EVAs.
* Automated generation of clinical countermeasures, exercise dosages, and medication protocols.

### 4. ⚠️ AI-Powered Anomaly Detection Engine
* Multi-variate real-time evaluation of biosensor streams against NASA medical thresholds.
* Classifies physiological state into **NORMAL**, **WARNING**, or **CRITICAL**.
* Computes anomaly probability vectors and generates automated clinical advisory tickets.

### 5. 🔴 Long-Duration Mars Mission Simulation Mode
* Interactive sandbox testing mission durations from **30 to 1,000 Days**.
* Configurable shielding materials: *Aluminum Baseline, Polyethylene Composite, Active Water Wall, Martian Regolith*.
* Adjustable daily resistive exercise (ARED) and pharmacological countermeasures (bisphosphonates).
* Bio-mathematical projections:
  * Total bone mineral density loss (%)
  * Cumulative ionizing radiation dose (mSv)
  * Cancer Excess Relative Risk (ERR %)
  * Cardiovascular atrophy index
  * Mission Readiness Score (0–100%)
* Interactive Hohmann Transfer trajectory milestone checkpoints.

### 6. ⌚ Wearable Biosensor Simulator
* Dynamic, 60fps HTML5 Canvas **ECG Lead II Waveform Generator** showing realistic P-Q-R-S-T complexes and baseline wander.
* Cardiac condition toggle: *Normal Sinus Rhythm*, *Sinus Tachycardia (115 bpm)*, *Hypoxic Desaturation*.
* Emulated hardware health for AstraBand Smartwatch, BioHarness Chest Strap, and RadBadge Dosimeter.

### 7. ☀️ Space Environment Intelligence Center (Real NASA Open Data)
* Direct integration with NASA Open APIs:
  * **NASA DONKI** (Database of Notifications, Knowledge, Information): Real-time solar flare tracking (e.g. M4.2, X1.0), Coronal Mass Ejections (CME), and Solar Energetic Particle (SEP) alerts.
  * **NASA APOD** (Astronomy Picture of the Day).
  * Planetary geomagnetic Kp-index and proton flux.
* Automated storm haven shelter advisories and shielding alignments.

### 8. 🧠 Crew Mental Wellness & Cognitive Center
* Interactive **Psychomotor Vigilance Task (PVT)** cognitive reaction time test game: measures astronaut reaction latency in milliseconds compared with NASA 235ms baseline.
* Psychological mood scores, isolation tracking, and acoustic voice sentiment feedback.

### 9. 📡 NASA Mission Control Wall Dashboard
* Fleet-wide 4-astronaut monitoring grid (Green Safe, Yellow Warning, Red Critical).
* Active telemetry alerts triage queue with one-click **Acknowledge** actions.
* Telemetry marquee ticker streaming real-time orbital updates.

### 10. 🚨 Emergency Red Alert Operations System
* Procedural audio klaxon siren synthesized in-browser via **Web Audio API**.
* Red flashing emergency cockpit HUD border.
* Automated 5-step life support intervention checklist (100% O2 line purge, flight surgeon priority uplink, DSN dish alignment).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3 (Custom Cyber-Tech NASA Theme), JavaScript ES6+ |
| **3D Rendering** | Three.js (r128) - Procedural Earth, Mars, & Hologram Mannequin |
| **Animations** | GSAP (GreenSock), CSS Keyframes, Web Audio API procedural sound engine |
| **Data Visualization** | Chart.js 4.4 (Line, Radar, Bar/Area, Doughnut) |
| **Backend & APIs** | Node.js (v24), Express.js (v5), Server-Sent Events (SSE) telemetry feed |
| **Database & Auth** | Supabase PostgreSQL schema with 13 tables, RLS, and seed data |
| **External APIs** | NASA DONKI Space Weather, NASA APOD, NOAA SWPC Models |

---

## 📂 Project Structure

```
nasa-space-2026/
├── package.json               # Node.js project manifest & dependencies
├── server.js                  # Express backend, REST APIs, SSE stream, NASA proxy & AI engine
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive platform documentation
├── DEPLOYMENT.md              # Cloud deployment guide (Vercel, Railway, Render)
├── supabase/
│   ├── schema.sql             # Complete Supabase PostgreSQL schema with 13 tables & RLS
│   └── seed.sql               # Rich seed data for astronauts, telemetry, missions, and alerts
└── public/
    ├── index.html             # Single-page application cockpit interface
    ├── css/
    │   ├── style.css          # NASA / SpaceX glassmorphism cyber-tech design system
    │   └── animations.css     # Keyframe animations (scanners, radar, pulses, sirens)
    └── js/
        ├── audio-synthesizer.js  # Web Audio API procedural sound engine
        ├── three-scene.js        # 3D interactive Earth, Mars & orbital trajectory
        ├── digital-twin-3d.js    # 3D holographic astronaut mannequin with hotspots
        ├── charts-manager.js     # Chart.js telemetry visualization
        ├── wearable-simulator.js # ECG Lead II canvas waveform renderer
        ├── mars-simulation.js    # Mars mission degradation simulation engine
        ├── anomaly-detector.js   # Machine learning physiological anomaly classifier
        ├── astra-ai.js           # Astra AI assistant with speech synthesis & voice input
        ├── nasa-api.js           # NASA open data integration
        ├── mission-control.js    # Large screen wall dashboard & emergency triage
        └── app.js                # Master application controller & SSE stream subscriber
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
* Node.js v18+ (tested on Node v24.11.0)
* npm v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, `DEMO_KEY` is pre-configured and connects seamlessly to NASA open data APIs.)*

### 3. Launch AstraVital AI
```bash
npm start
```
Navigate in your browser to: **`http://localhost:3000`**

---

## 🗄️ Database Architecture (Supabase SQL)

A complete production-ready schema is located in `supabase/schema.sql`, featuring:
1. `users`: Crew, Flight Surgeons, Mission Directors, Admins.
2. `missions`: Interplanetary flight vectors, destination codes, and timeline metadata.
3. `astronaut_profiles`: Physiological baselines, VO2 max, bone mineral density, cumulative radiation.
4. `health_metrics`: Real-time and historical multi-variate telemetry series.
5. `sensor_data`: High-frequency raw biosensor packets (ECG, PPG, RadBadge, Temp).
6. `mental_health_logs`: Psychomotor vigilance results, subjective mood, and sleep staging.
7. `space_environment_data`: NASA DONKI solar flare classes, CME speeds, and proton flux.
8. `alerts`: Telemetry anomalies with severity classifications.
9. `risk_predictions`: AI predictive models for cardiovascular atrophy, SANS, and carcinogenesis.
10. `digital_twins`: Organ-specific stress matrices and biomechanical states.
11. `emergency_events`: Red Alert protocols and automated action checklists.
12. `ai_recommendations`: Astra AI clinical countermeasures and citations.
13. `mission_reports`: Automated flight readiness evaluations.

---

## 🏆 NASA Space Apps 2026 Presentation Highlights

* **Real Space Medicine Clinical Rigor**: Models based on published spaceflight physiological research from NASA Johnson Space Center (JSC) and Human Research Program (HRP).
* **Zero Dependencies for 3D & Procedural Audio**: Works offline with built-in procedural Earth/Mars textures, synthetic fallback space weather models, and Web Audio API synthesis.
* **Autonomous Decision Support**: Crucial for Mars missions where communication latency to Earth ranges from 4 to 24 minutes each way.

---

## 📜 License
Developed under the MIT License for the NASA Space Apps Challenge 2026.
