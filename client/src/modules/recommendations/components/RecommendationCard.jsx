import React from 'react';

function RecommendationCard({
  title,
  category,
  description,
  icon,
  accent,
  targetSymptoms = [],
  isCompleted = false,
  onStartRoutine,
}) {
  return (
    <article className={`recommendation-card ${isCompleted ? 'card--completed' : ''}`}>
      {/* Completed Pill Badge */}
      {isCompleted && (
        <div className="card-completed-badge font-highlight">
          <span>✓</span> Done Today
        </div>
      )}

      <div className={`recommendation-icon recommendation-icon--${accent || 'forest'}`}>
        <span>{icon || '🌿'}</span>
      </div>

      <div className="recommendation-card__content">
        <span className="recommendation-card__category font-highlight">
          {category}
        </span>

        <h3 className="recommendation-card__title">{title}</h3>

        <p className="recommendation-card__description">{description}</p>

        {targetSymptoms.length > 0 && (
          <div className="recommendation-card__tags">
            {targetSymptoms.map((symptom, idx) => (
              <span key={idx} className="symptom-tag font-highlight">
                #{symptom}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onStartRoutine}
          className={`recommendation-card__button ${isCompleted ? 'btn--completed' : ''}`}
        >
          <span>{isCompleted ? 'Replay Routine' : 'Start Routine'}</span>
          <span className="font-highlight">{isCompleted ? '↺' : '→'}</span>
        </button>
      </div>
    </article>
  );
}

export default RecommendationCard;