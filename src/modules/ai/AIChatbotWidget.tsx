import React, { useState } from 'react';
import { Bot, X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { store } from '../../core/store';

export const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am the Anti-Gravity AI Assistant. How can I help protect your commercial or residential property today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      let reply = 'Our technician dispatch engine is available 24/7. You can book an automated inspection right here or explore our Solutions Matrix.';
      if (userMsg.toLowerCase().includes('termite')) {
        reply = 'For subterranean termites, we recommend our Subterranean Termite Shield which comes with thermal imaging scans and a renewable 5-Year Warranty!';
      } else if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        reply = 'Our general pest extermination starts at $299, and full hospital-grade disinfection starts at $899. You can lock in an exact quote via our interactive Property Calculator!';
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 300 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Bot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{ width: '360px', height: '500px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'var(--gradient-surface)', borderBottom: '1px solid var(--bg-glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Anti-Gravity AI Agent</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)' }}>Online • Enterprise Assistant</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '0.75rem 1rem',
                  borderRadius: '14px',
                  background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} style={{ padding: '0.85rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Ask AI Assistant..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 0.85rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
