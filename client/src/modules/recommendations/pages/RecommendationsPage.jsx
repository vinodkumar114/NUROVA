import { useState, useEffect } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { SymptomIntakeModal } from '../components/SymptomIntakeModal';
import { RoutineModal } from '../components/RoutineModal';
import { WellnessChatbot } from '../components/WellnessChatbot';
import { getRecommendations } from '../services/recommendationApi';
import '../recommendations.css';

const FALLBACK_RECOMMENDATIONS = [
  {
    _id: 'rec_1',
    title: 'Mindful Morning Routine',
    category: 'Mental Wellness',
    description: 'Start your day with a simple combination of breathing, mindfulness, and gentle movement.',
    icon: '🧘',
    accent: 'forest',
    targetSymptoms: ['stress', 'anxiety'],
  },
  {
    _id: 'rec_2',
    title: 'Gentle Yoga Flow',
    category: 'Movement',
    description: 'A calm movement routine designed to support flexibility, relaxation, and everyday wellbeing.',
    icon: '🌿',
    accent: 'orange',
    targetSymptoms: ['tension', 'stress'],
  },
  {
    _id: 'rec_3',
    title: 'Better Sleep Ritual',
    category: 'Sleep & Recovery',
    description: 'Create a relaxing evening routine that helps you transition from a busy day into restful sleep.',
    icon: '🌙',
    accent: 'forest',
    targetSymptoms: ['poor sleep', 'stress'],
  },
  {
    _id: 'rec_4',
    title: 'Digestive Reset Ritual',
    category: 'Diet & Digestion',
    description: 'Support gut health and ease bloating with Ayurvedic herbal infusion and seated rest.',
    icon: '🍵',
    accent: 'orange',
    targetSymptoms: ['digestion', 'bloating'],
  },
  {
    _id: 'rec_5',
    title: 'Mental Clarity & Focus Break',
    category: 'Mental Wellness',
    description: 'A 5-minute cognitive refresh to relieve digital eyestrain and clear mental brain fog.',
    icon: '👁️',
    accent: 'forest',
    targetSymptoms: ['brain fog', 'stress'],
  },
  {
    _id: 'rec_6',
    title: 'Evening Spinal Decompression',
    category: 'Movement',
    description: 'Release deep lower-back tension caused by long sitting hours with restorative poses.',
    icon: '🌱',
    accent: 'forest',
    targetSymptoms: ['tension', 'posture'],
  },
];

function RecommendationsPage() {
  const [allItems, setAllItems] = useState(FALLBACK_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterBar, setShowFilterBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [userProfileBanner, setUserProfileBanner] = useState(null);
  const [completedRoutines, setCompletedRoutines] = useState([]);

  // Added 'digestion' to the filter options
  const filterOptions = ['all', 'stress', 'yoga', 'sleep', 'digestion'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getRecommendations();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAllItems(res.data);
      }
    } catch (err) {
      console.warn('Using fallback recommendations:', err);
    }
  };

  const handleAssessmentComplete = (assessmentData) => {
    setUserProfileBanner(assessmentData);

    const goal = assessmentData.goal.toLowerCase();
    if (goal.includes('sleep')) {
      setActiveFilter('sleep');
    } else if (goal.includes('flexibility') || goal.includes('movement')) {
      setActiveFilter('yoga');
    } else if (goal.includes('vitality') || goal.includes('digestion')) {
      setActiveFilter('digestion');
    } else {
      setActiveFilter('stress');
    }
  };

  const handleMarkComplete = (routineId) => {
    setCompletedRoutines((prev) =>
      prev.includes(routineId) ? prev : [...prev, routineId]
    );
  };

  const displayedItems = allItems.filter((item) => {
    if (activeFilter === 'all') return true;

    const cat = (item.category || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (activeFilter === 'stress') {
      return cat.includes('mental') || title.includes('morning') || title.includes('clarity');
    }
    if (activeFilter === 'yoga') {
      return cat.includes('movement') || title.includes('yoga') || title.includes('spinal');
    }
    if (activeFilter === 'sleep') {
      return cat.includes('sleep') || title.includes('sleep');
    }
    if (activeFilter === 'digestion') {
      return cat.includes('diet') || cat.includes('digestion') || title.includes('digestive');
    }

    return true;
  });

  return (
    <main className="recommendations-page">
      {/* Hero Section */}
      <section className="recommendations-hero">
        <div className="recommendations-hero__content">
          <span className="recommendations-eyebrow font-highlight">
            Personalized wellness
          </span>

          <h1 className="recommendations-title">
            Recommendations
            <span> made for you.</span>
          </h1>

          <p className="recommendations-subtitle">
            Discover wellness practices and resources selected to
            support your personal health journey.
          </p>

          <button
            type="button"
            className="ai-launch-banner font-highlight"
            onClick={() => setIsModalOpen(true)}
          >
            <span>✦</span>
            {userProfileBanner
              ? `Plan Updated: ${userProfileBanner.goal} (Retake Assessment)`
              : 'Take 1-Min AI Health Assessment'}
          </button>

          <div className="recommendations-hero__meta">
            <div className="recommendations-meta-item">
              <span className="recommendations-meta-icon font-highlight">✦</span>
              <div>
                <strong>Personalized</strong>
                <small>
                  {userProfileBanner
                    ? `Stress: ${userProfileBanner.stressLevel}/10 • Goal: ${userProfileBanner.goal}`
                    : 'Based on your profile'}
                </small>
              </div>
            </div>

            <div className="recommendations-meta-item">
              <span className="recommendations-meta-icon font-highlight">✓</span>
              <div>
                <strong>Wellness streak</strong>
                <small>
                  {completedRoutines.length > 0
                    ? `${completedRoutines.length} routine(s) done today`
                    : 'Designed for everyday wellbeing'}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="recommendations-hero__visual">
          <div className="clay-orb clay-orb--large">
            <span>🌱</span>
          </div>
          <div className="clay-orb clay-orb--small font-highlight">
            <span>✦</span>
          </div>
          <div className="hero-quote-card">
            <span className="hero-quote-card__mark">“</span>
            <p>
              Small, consistent choices can create meaningful
              changes in your wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Filter Section */}
      <section className="recommendations-section">
        <div className="recommendations-section__header">
          <div>
            <span className="recommendations-eyebrow font-highlight">
              Your wellness guide
            </span>
            <h2>Explore your recommendations</h2>
          </div>

          <div className="filter-controls-wrapper">
            <button
              type="button"
              className={`recommendations-filter ${showFilterBar ? 'active' : ''}`}
              onClick={() => setShowFilterBar((prev) => !prev)}
            >
              <span>☷</span>
              Filter
            </button>

            {showFilterBar && (
              <div className="filter-chips">
                {filterOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveFilter(tag)}
                    className={`filter-chip-btn ${activeFilter === tag ? 'active' : ''}`}
                  >
                    <span className="font-highlight">{tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="recommendations-grid">
          {loading ? (
            <p className="loading-text">Loading recommendations...</p>
          ) : displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <RecommendationCard
                key={item._id}
                title={item.title}
                category={item.category}
                description={item.description}
                icon={item.icon}
                accent={item.accent}
                targetSymptoms={item.targetSymptoms}
                isCompleted={completedRoutines.includes(item._id)}
                onStartRoutine={() => setSelectedRoutine(item)}
              />
            ))
          ) : (
            <p className="empty-text">No recommendations found for this category.</p>
          )}
        </div>
      </section>

      {/* AI Symptom Assessment Modal */}
      <SymptomIntakeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssessmentComplete={handleAssessmentComplete}
      />

      {/* Interactive Routine Step Viewer Modal with Chaining */}
      <RoutineModal
        routine={selectedRoutine}
        allRoutines={allItems}
        onSelectRoutine={(next) => setSelectedRoutine(next)}
        onMarkComplete={handleMarkComplete}
        onClose={() => setSelectedRoutine(null)}
      />

      {/* Real AI Wellness Chatbot */}
      <WellnessChatbot userHealthContext={userProfileBanner} />
    </main>
  );
}

export default RecommendationsPage;