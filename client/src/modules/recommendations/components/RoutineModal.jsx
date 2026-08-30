import React, { useState, useEffect } from 'react';

const ROUTINE_STEPS = {
  'Mindful Morning Routine': [
    { title: 'Step 1: Pranayama (3 Mins)', desc: 'Sit comfortably with a straight spine. Inhale deeply for 4 counts, hold for 4, and exhale for 6.' },
    { title: 'Step 2: Gentle Neck & Shoulder Rolls (2 Mins)', desc: 'Slowly rotate your shoulders backwards 5 times, then forwards to release built-up tension.' },
    { title: 'Step 3: Mindful Hydration', desc: 'Sip a glass of warm water infused with ginger or lemon before breakfast.' },
  ],
  'Gentle Yoga Flow': [
    { title: 'Step 1: Cat-Cow Stretch (2 Mins)', desc: 'On all fours, inhale as you arch your back (Cow), exhale as you round your spine (Cat).' },
    { title: 'Step 2: Child’s Pose / Balasana (3 Mins)', desc: 'Sink your hips back onto your heels and rest your forehead on the mat to ground your energy.' },
    { title: 'Step 3: Gentle Spinal Twist', desc: 'Lie on your back, drop both knees gently to the right for 5 breaths, then repeat on the left.' },
  ],
  'Better Sleep Ritual': [
    { title: 'Step 1: Screen Disconnect', desc: 'Dim bright overhead lights and put away digital screens 30 minutes before resting.' },
    { title: 'Step 2: Golden Milk / Chamomile Tea', desc: 'Drink a warm cup of spiced milk (nutmeg & turmeric) or chamomile tea.' },
    { title: 'Step 3: 4-7-8 Relaxing Breath', desc: 'Inhale for 4 seconds, hold breath for 7 seconds, exhale completely for 8 seconds. Repeat 4 times.' },
  ],
  'Digestive Reset Ritual': [
    { title: 'Step 1: CCF Herbal Infusion (3 Mins)', desc: 'Sip warm Cumin, Coriander, and Fennel seed tea to kindle digestive Agni.' },
    { title: 'Step 2: Vajrasana Seated Posture (5 Mins)', desc: 'Kneel upright with toes tucked to promote healthy circulation to digestive organs.' },
    { title: 'Step 3: Gentle Abdominal Massage', desc: 'Perform light clockwise circular motions on the abdomen with warm sesame oil.' },
  ],
  'Mental Clarity & Focus Break': [
    { title: 'Step 1: Ayurvedic Palming (2 Mins)', desc: 'Rub palms briskly until warm and gently cup over closed eyes to soothe visual strain.' },
    { title: 'Step 2: Trataka Gazing Practice', desc: 'Rest your eyes by looking at a distant green point or open horizon for 60 seconds.' },
    { title: 'Step 3: Bhramari Humming Breath (3 Mins)', desc: 'Inhale deeply and exhale with a gentle humming bee vibration to calm overthinking.' },
  ],
  'Evening Spinal Decompression': [
    { title: 'Step 1: Legs-Up-The-Wall / Viparita Karani (5 Mins)', desc: 'Elevate your legs against a wall to drain venous pooling and relax the lower back.' },
    { title: 'Step 2: Supported Bridge Lift (3 Mins)', desc: 'Lie on your back, lift your pelvis gently, and breathe into your lower abdominal cavity.' },
    { title: 'Step 3: Full Body Savasana Reset', desc: 'Lay flat, release all muscle control, and take 10 slow grounding belly breaths.' },
  ],
};

export const RoutineModal = ({ routine, allRoutines = [], onSelectRoutine, onMarkComplete, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCompletedSteps([]);
    setIsFinished(false);
  }, [routine]);

  if (!routine) return null;

  const steps = ROUTINE_STEPS[routine.title] || [
    { title: 'Step 1: Preparation', desc: 'Find a calm, quiet place to sit comfortably.' },
    { title: 'Step 2: Mindful Practice', desc: 'Focus on slow, deep breathing for 5 minutes.' },
    { title: 'Step 3: Reflection', desc: 'Notice how your body feels and drink warm water.' },
  ];

  const allStepsDone = completedSteps.length === steps.length;

  const toggleStep = (idx) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const currentIndex = allRoutines.findIndex((r) => r._id === routine._id);
  const nextRoutine =
    currentIndex !== -1 && currentIndex < allRoutines.length - 1
      ? allRoutines[currentIndex + 1]
      : allRoutines[0];

  const handleFinish = () => {
    if (!allStepsDone) return;
    setIsFinished(true);
    if (onMarkComplete) {
      onMarkComplete(routine._id);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="symptom-modal routine-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="recommendations-eyebrow font-highlight">{routine.category}</span>
          <button className="close-btn font-highlight" onClick={onClose}>✕</button>
        </div>

        <h2 className="modal-title">{routine.title}</h2>
        <p className="modal-subtitle">{routine.description}</p>

        {!isFinished ? (
          <div className="routine-steps-list">
            {steps.map((step, idx) => {
              const done = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  className={`routine-step-item ${done ? 'step-completed' : ''}`}
                  onClick={() => toggleStep(idx)}
                >
                  <div className="step-checkbox font-highlight">
                    {done ? '✓' : idx + 1}
                  </div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="recommendation-card__button"
              onClick={handleFinish}
              disabled={!allStepsDone}
              style={{
                marginTop: '20px',
                opacity: allStepsDone ? 1 : 0.6,
                cursor: allStepsDone ? 'pointer' : 'not-allowed',
              }}
            >
              <span>
                {allStepsDone
                  ? 'Finish Routine'
                  : `Complete all steps (${completedSteps.length}/${steps.length})`}
              </span>
              <span className="font-highlight">{allStepsDone ? '✓' : '•'}</span>
            </button>
          </div>
        ) : (
          <div className="routine-success-state">
            <div className="success-icon">🌱</div>
            <h3>Routine Completed!</h3>
            <p>You have taken a mindful step for your well-being today.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {nextRoutine && nextRoutine._id !== routine._id && (
                <button
                  type="button"
                  className="recommendation-card__button"
                  onClick={() => onSelectRoutine(nextRoutine)}
                >
                  <span>Continue to Next: {nextRoutine.title}</span>
                  <span className="font-highlight">→</span>
                </button>
              )}

              <button
                type="button"
                className="recommendations-filter"
                onClick={onClose}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineModal;