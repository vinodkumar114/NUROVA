const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getRecommendations = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/recommendations${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load recommendations');
  return res.json();
};

export const sendChatMessage = async ({ message, history, userHealthContext }) => {
  const res = await fetch(`${API_BASE}/recommendations/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, userHealthContext }),
  });
  if (!res.ok) throw new Error('Failed to get AI response');
  return res.json();
};