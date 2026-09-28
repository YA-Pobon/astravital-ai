-- ==============================================================================
-- AstraVital AI - Supabase Seed Data
-- ==============================================================================

-- 1. Insert Missions
INSERT INTO missions (id, mission_code, mission_name, destination, status, launch_date, target_arrival_date, duration_days, trajectory_vector)
VALUES 
('11111111-1111-1111-1111-111111111111', 'ARES-IV', 'Ares IV Mars Expedition', 'Mars_Transit', 'ACTIVE', '2026-03-15 09:30:00Z', '2026-11-20 18:00:00Z', 540, '{"velocity_km_s": 24.6, "distance_from_earth_mkm": 78.4, "solar_distance_au": 1.28}'),
('22222222-2222-2222-2222-222222222222', 'ARTEMIS-V', 'Artemis V Shackleton Crater Base', 'Moon_Surface', 'ACTIVE', '2026-06-01 12:00:00Z', '2026-06-05 20:00:00Z', 180, '{"velocity_km_s": 1.4, "distance_from_earth_mkm": 0.384, "lunar_orbit": "NRO"}'),
('33333333-3333-3333-3333-333333333333', 'EXP-74', 'ISS Expedition 74', 'LEO_ISS', 'ACTIVE', '2026-01-10 04:15:00Z', '2026-07-28 14:00:00Z', 200, '{"velocity_km_s": 7.66, "altitude_km": 418, "inclination_deg": 51.64}')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Users
INSERT INTO users (id, email, full_name, role, callsign, avatar_url)
VALUES
('aaaa1111-aaaa-1111-aaaa-111111111111', 'sarah.vance@nasa.gov', 'CDR Sarah Vance', 'astronaut', 'Valkyrie', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
('aaaa2222-aaaa-2222-aaaa-222222222222', 'marcus.thorne@nasa.gov', 'Dr. Marcus Thorne', 'astronaut', 'Atlas', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
('aaaa3333-aaaa-3333-aaaa-333333333333', 'elena.rostova@esa.int', 'Dr. Elena Rostova', 'astronaut', 'Novacrest', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
('aaaa4444-aaaa-4444-aaaa-444444444444', 'kenji.sato@jaxa.jp', 'Eng. Kenji Sato', 'astronaut', 'Ronin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
('bbbb1111-bbbb-1111-bbbb-111111111111', 'alistair.chen@nasa.gov', 'Dr. Alistair Chen, MD', 'flight_surgeon', 'Stethoscope-1', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
('cccc1111-cccc-1111-cccc-111111111111', 'gene.kranz.jr@nasa.gov', 'Flight Dir. Gene Holbrook', 'mission_control', 'Flight', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Astronaut Profiles
INSERT INTO astronaut_profiles (id, user_id, crew_role, mission_id, blood_type, age, height_cm, weight_kg, baseline_vo2_max, baseline_bone_density, radiation_career_cumulative_msv, emergency_contact, medical_history)
VALUES
('99991111-9999-1111-9999-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Commander / Astrodynamics Lead', '11111111-1111-1111-1111-111111111111', 'O+', 39, 175.5, 68.2, 54.2, 1.15, 84.5, '{"name": "James Vance", "relation": "Spouse", "secure_comm_id": "COMM-TX-9901"}', '{"allergies": ["Penicillin"], "surgeries": ["Appendectomy 2018"], "countermeasures": ["ARED 2.5h/day", "T2 Treadmill 45m/day"]}'),
('99992222-9999-2222-9999-222222222222', 'aaaa2222-aaaa-2222-aaaa-222222222222', 'Chief Medical Officer / EVA Specialist', '11111111-1111-1111-1111-111111111111', 'A-', 44, 182.0, 79.5, 51.0, 0.98, 112.3, '{"name": "Dr. Clara Thorne", "relation": "Spouse", "secure_comm_id": "COMM-MD-4412"}', '{"allergies": ["None"], "surgeries": ["ACL repair left 2015"], "countermeasures": ["Bisphosphonates cycle", "Ergometer 1h/day"]}'),
('99993333-9999-3333-9999-333333333333', 'aaaa3333-aaaa-3333-aaaa-333333333333', 'Science Officer / Planetary Geologist', '22222222-2222-2222-2222-222222222222', 'B+', 36, 168.0, 61.0, 56.4, 1.20, 42.1, '{"name": "Dmitri Rostov", "relation": "Brother", "secure_comm_id": "COMM-EU-8812"}', '{"allergies": ["None"], "surgeries": ["None"], "countermeasures": ["Resistance bands", "Fluid load protocol"]}'),
('99994444-9999-4444-9999-444444444444', 'aaaa4444-aaaa-4444-aaaa-444444444444', 'Systems Engineer / Avionics Specialist', '33333333-3333-3333-3333-333333333333', 'AB+', 41, 172.0, 66.8, 52.8, 1.05, 56.7, '{"name": "Aoi Sato", "relation": "Spouse", "secure_comm_id": "COMM-TY-2026"}', '{"allergies": ["Sulfa"], "surgeries": ["None"], "countermeasures": ["ARED resistance", "Melatonin protocol"]}')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Health Metrics
INSERT INTO health_metrics (astronaut_id, heart_rate, oxygen_saturation, blood_pressure_systolic, blood_pressure_diastolic, body_temperature, respiration_rate, stress_score, sleep_quality_score, hydration_level_pct, bone_density_index, muscle_loss_risk_pct, overall_health_score, health_status)
VALUES
('99991111-9999-1111-9999-111111111111', 68.4, 98.6, 118, 76, 36.8, 14.2, 28, 86, 94.2, 1.08, 12.4, 92, 'EXCELLENT'),
('99992222-9999-2222-9999-222222222222', 84.1, 95.8, 134, 88, 37.4, 18.0, 68, 62, 88.0, 0.91, 24.8, 74, 'WARNING'),
('99993333-9999-3333-9999-333333333333', 71.0, 99.1, 115, 74, 36.7, 13.5, 32, 91, 96.5, 1.18, 8.5, 95, 'EXCELLENT'),
('99994444-9999-4444-9999-444444444444', 74.5, 97.2, 122, 80, 36.9, 15.0, 44, 78, 91.0, 1.02, 16.0, 85, 'GOOD');

-- 5. Active Alerts
INSERT INTO alerts (astronaut_id, mission_id, severity, category, title, message, anomaly_probability, is_acknowledged)
VALUES
('99992222-9999-2222-9999-222222222222', '11111111-1111-1111-1111-111111111111', 'HIGH', 'CARDIAC', 'Elevated Resting HR & Mild Dehydration', 'Dr. Thorne shows sustained tachycardia (88 bpm resting) and mild peripheral fluid shift post-EVA maintenance.', 0.88, false),
('99992222-9999-2222-9999-222222222222', '11111111-1111-1111-1111-111111111111', 'MEDIUM', 'RADIATION', 'Solar Energetic Particle (SEP) Advisory', 'DONKI model predicts elevated flux arriving within 4.5 hours. Recommended: Shelter in Storm Haven Module.', 0.76, false),
('99991111-9999-1111-9999-111111111111', '11111111-1111-1111-1111-111111111111', 'LOW', 'RESPIRATORY', 'Nominal SpO2 Post-Cycle Protocol', 'CDR Vance concluded 45m high-intensity interval training. Oxygen recovery rate within upper decile.', 0.05, true);

-- 6. Digital Twin State
INSERT INTO digital_twins (astronaut_id, twin_model_version, biomechanical_state, metabolic_rate_cal_day, cumulative_microgravity_hours, organ_stress_map, mars_simulation_scenarios)
VALUES
('99991111-9999-1111-9999-111111111111', 'v3.2-AstraSim', '{"cardiovascular_stiffness": 0.14, "bone_mineral_loss_pct_month": 0.95, "cephalic_fluid_shift_ml": 820, "lens_edema_sans_stage": 0}', 2840, 4680, '{"heart": 0.18, "lungs": 0.12, "spine": 0.28, "femur": 0.22, "optic_nerve": 0.10, "brain": 0.15}', '{"mission_365d_predicted_bone_loss_pct": 11.2, "solar_flare_exposure_msv": 210, "readiness_score": 88}'),
('99992222-9999-2222-9999-222222222222', 'v3.2-AstraSim', '{"cardiovascular_stiffness": 0.32, "bone_mineral_loss_pct_month": 1.45, "cephalic_fluid_shift_ml": 1180, "lens_edema_sans_stage": 1}', 3150, 4680, '{"heart": 0.58, "lungs": 0.34, "spine": 0.62, "femur": 0.55, "optic_nerve": 0.42, "brain": 0.48}', '{"mission_365d_predicted_bone_loss_pct": 16.8, "solar_flare_exposure_msv": 235, "readiness_score": 68}');
