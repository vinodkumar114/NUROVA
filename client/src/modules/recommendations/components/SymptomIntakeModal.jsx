import React, { useState } from 'react';

const SYMPTOM_OPTIONS = [
  'Stress & Anxiety',
  'Poor Sleep / Insomnia',
  'Muscle Tension',
  'Low Energy / Fatigue',
  'Digestive Discomfort',
  'Brain Fog',
];

const GOAL_OPTIONS = [
  'Relaxation',
  'Deep Sleep',
  'Flexibility & Movement',
  'Mental Clarity',
  'Vitality & Energy',
];

// Descriptive anchor helpers for user self-awareness
const getStressDescriptor = (val) => {
  if (val <= 3) return 'Calm';
  if (val <= 6) return 'Moderate';
  if (val <= 8) return 'High';
  return 'Burnout';
};

const getEnergyDescriptor = (val) => {
  if (val <= 3) return 'Low';
  if (val <= 6) return 'Steady';
  if (val <= 8) return 'Active';
  return 'Vibrant';
};

export const SymptomIntakeModal = ({ isOpen, onClose, onAssessmentComplete }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [primaryGoal, setPrimaryGoal] = useState('Relaxation');
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.includes(symptom);
      const updated = exists ? prev.filter((s) => s !== symptom) : [...prev, symptom];

      // Smart auto-assist baseline nudges
      if (!exists) {
        if (symptom === 'Stress & Anxiety' || symptom === 'Brain Fog') {
          setStressLevel((lvl) => Math.max(lvl, 7));
        }
        if (symptom === 'Low Energy / Fatigue') {
          setEnergyLevel((lvl) => Math.min(lvl, 3));
        }
        if (symptom === 'Poor Sleep / Insomnia') {
          setPrimaryGoal('Deep Sleep');
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const assessmentData = {
      symptoms: selectedSymptoms,
      goal: primaryGoal,
      stressLevel,
      energyLevel,
    };

    // Simulate AI processing transition
    setTimeout(() => {
      onAssessmentComplete(assessmentData);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="symptom-modal clay-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="recommendations-eyebrow font-highlight">
            AI Assessment
          </span>
          <button className="close-btn font-highlight" onClick={onClose}>
            ✕
          </button>
        </div>

        <h2 className="modal-title">How are you feeling today?</h2>
        <p className="modal-subtitle">
          Select what you are experiencing so our AI can personalize your daily
          routines and care practices.
        </p>

        <form onSubmit={handleSubmit} className="intake-form">
          {/* Symptoms Multi-Select */}
          <div className="form-group">
            <label className="form-label">Current Symptoms / Feelings</label>
            <div className="chip-grid">
              {SYMPTOM_OPTIONS.map((item) => {
                const active = selectedSymptoms.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    className={`intake-chip ${active ? 'active' : ''}`}
                    onClick={() => toggleSymptom(item)}
                  >
                    <span>{active ? '✓' : '+'}</span> {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders with Descriptive Anchors */}
          <div className="form-row">
            <div className="form-group slider-group">
              <div className="slider-header">
                <label className="form-label">Stress Level</label>
                <span className="slider-value font-highlight">
                  {stressLevel}/10 ({getStressDescriptor(stressLevel)})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="clay-slider"
              />
            </div>

            <div className="form-group slider-group">
              <div className="slider-header">
                <label className="form-label">Energy Level</label>
                <span className="slider-value font-highlight">
                  {energyLevel}/10 ({getEnergyDescriptor(energyLevel)})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="clay-slider"
              />
            </div>
          </div>

          {/* Primary Goal */}
          <div className="form-group">
            <label className="form-label">Primary Daily Goal</label>
            <div className="chip-grid">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={`intake-chip ${primaryGoal === goal ? 'active' : ''}`}
                  onClick={() => setPrimaryGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="modal-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="recommendation-card__button modal-submit-btn"
            >
              <span>{isSubmitting ? 'Analyzing profile...' : 'Generate My Wellness Plan'}</span>
              <span className="font-highlight">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};