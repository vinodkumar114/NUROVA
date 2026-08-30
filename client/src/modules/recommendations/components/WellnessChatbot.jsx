import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/recommendationApi';

export const WellnessChatbot = ({ userHealthContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! I am your Nurova AI Wellness Guide. How can I support your mind, body, and energy today?',
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: userMessage.text,
        history: messages,
        userHealthContext,
      });

      if (res.success) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: res.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'I am having trouble connecting right now. Please check your connection and API key.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button
          className="chatbot-fab font-highlight"
          onClick={() => setIsOpen(true)}
          title="Open AI Wellness Guide"
        >
          <span className="fab-icon">🌿</span>
          <span className="fab-text">AI Guide</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="ai-avatar">🌱</span>
              <div>
                <h4>Nurova AI</h4>
                <span className="ai-status font-highlight">Online • Ayurvedic Guide</span>
              </div>
            </div>
            <button className="chat-close-btn font-highlight" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
              >
                <div className={`chat-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Ayurvedic Glowing Pulse Dots */}
            {loading && (
              <div className="chat-bubble-row ai-row">
                <div className="chat-bubble ai ai-typing-bubble">
                  <div className="pulse-dots">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot dot-3"></span>
                  </div>
                  <span className="typing-label font-highlight">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-bar">
            <input
              type="text"
              placeholder="Ask about stress, sleep, routines..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading || !input.trim()} className="chat-send-btn">
              ↑
            </button>
          </form>
        </div>
      )}
    </div>
  );
};