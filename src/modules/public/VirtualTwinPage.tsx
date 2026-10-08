import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Brain, Info, Volume2, Sparkles, RefreshCw, AlertCircle, Database, Clock,
  MessageSquare, TrendingUp, ChevronDown, ChevronUp, User, Send, Phone, MessageCircle,
  Shield, Settings2, CalendarCheck
} from 'lucide-react';
import { store } from '../../core/store';

type ChatMode = 'dvs' | 'twin';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
  isTraining?: boolean;
  isError?: boolean;   // excluded from the history sent to the API
  isWelcome?: boolean; // excluded from the history sent to the API
}

interface MemoryStats {
  total_conversations: number;
  total_voice_analyses: number;
  auto_learned_facts: number;
  last_active: string | null;
  has_personality_profile: boolean;
}

interface MemoryEntry {
  timestamp: string;
  session_id: string;
  query: string;
  response: string;
}

interface Props {
  /** Opens the full "Book Inspection" form (wired from App.tsx). */
  onBookClick?: () => void;
}

// Empty string = same domain. Vercel serves /api/* routes automatically.
const API = '';

const DVS_CHIPS: { label: string; prompt: string }[] = [
  { label: '🪳 Cockroach', prompt: 'I have a cockroach problem at home. What treatment do you do and what is the rate?' },
  { label: '🐜 Termite',   prompt: 'I think I have termites (deemak). How does your termite treatment and warranty work?' },
  { label: '🦟 Mosquito',  prompt: 'Mosquitoes are a big problem at my place. What do you offer for mosquito control?' },
  { label: '₹ Rates',      prompt: 'Please share your pest control rates for a 2 BHK flat in Lucknow.' },
  { label: '📅 Book inspection', prompt: 'I want to book a pest inspection.' }
];

const TWIN_CHIPS: { label: string; prompt: string }[] = [
  { label: 'Project planning', prompt: 'How do you feel about project planning?' },
  { label: 'Bahraich visit',   prompt: 'Tell me about the Bahraich site visit.' },
  { label: 'Tender drawings',  prompt: 'Why do tender drawings have so many errors?' },
  { label: 'Introduce yourself', prompt: 'Introduce yourself in character.' },
  { label: 'Stress',           prompt: 'What is stressing you out right now?' }
];

const toWhatsAppNumber = (phone: string) => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

const makeWelcome = (mode: ChatMode, phone: string): ChatMessage => ({
  id: `welcome_${mode}_${Date.now()}`,
  sender: 'bot',
  isWelcome: true,
  text: mode === 'dvs'
    ? `Namaste! 🙏 I'm the DVS Pest Assistant for Lucknow. Tell me your pest problem (cockroach, termite, mosquito, rats, bed bugs…) and I'll share treatment options and ₹ rates, or help you book an inspection. Prefer talking? Call/WhatsApp ${phone}.`
    : `Twin mode: you're now chatting with Amrish Singh's digital replica (experimental). Switch back to the DVS assistant anytime under Advanced.`
});

export const VirtualTwinPage: React.FC<Props> = ({ onBookClick }) => {
  const settings = store.getSettings();
  const phone = settings.contactPhone || '+91 93304 78897';
  const waLink = `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent('Hi DVS, I need pest control service in Lucknow.')}`;
  const telLink = `tel:${phone.replace(/\s/g, '')}`;

  const [mode, setMode]                     = useState<ChatMode>('dvs');
  const [messages, setMessages]             = useState<ChatMessage[]>(() => [makeWelcome('dvs', phone)]);
  const [input, setInput]                   = useState('');
  const [status, setStatus]                 = useState<'idle' | 'recording' | 'processing' | 'speaking'>('idle');
  const [isRecording, setIsRecording]       = useState(false);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

  // Advanced lab (memory / train / voice profile / twin mode)
  const [showAdvanced, setShowAdvanced]     = useState(false);
  const [isTrainMode, setIsTrainMode]       = useState(false);
  const [voiceAnalysis, setVoiceAnalysis]   = useState<string | null>(null);
  const [lastRecordedBlob, setLastRecordedBlob] = useState<Blob | null>(null);
  const [memoryStats, setMemoryStats]       = useState<MemoryStats | null>(null);
  const [recentMemory, setRecentMemory]     = useState<MemoryEntry[]>([]);
  const [showMemoryLog, setShowMemoryLog]   = useState(false);
  const [autoLearnFlash, setAutoLearnFlash] = useState(false);
  const [backendOnline, setBackendOnline]   = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const audioRef         = useRef<HTMLAudioElement | null>(null);
  const listRef          = useRef<HTMLDivElement | null>(null);
  const inputRef         = useRef<HTMLInputElement | null>(null);
  const messagesRef      = useRef<ChatMessage[]>(messages);
  messagesRef.current    = messages;

  // Stable session ID for this browser session
  const sessionId = useRef<string>(Math.random().toString(36).substring(2, 10)).current;

  const busy = status === 'processing' || status === 'recording';

  // ── Memory (Advanced only) ────────────────────────────────────────────────
  const fetchMemoryStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/memory/stats`);
      if (res.ok) {
        setMemoryStats(await res.json());
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  }, []);

  const fetchRecentMemory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/memory/recent`);
      if (res.ok) {
        const data = await res.json();
        setRecentMemory(data.conversations || []);
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    if (showAdvanced && backendOnline === null) fetchMemoryStats();
  }, [showAdvanced, backendOnline, fetchMemoryStats]);

  // Keep the chat scrolled to the newest message (scroll the list, not the page)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => () => { if (audioRef.current) audioRef.current.pause(); }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildHistory = () =>
    messagesRef.current
      .filter(m => !m.isError && !m.isWelcome && !m.isTraining)
      .slice(-10)
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', text: m.text }));

  const playSpeech = (audioDataUrl: string) => {
    setStatus('speaking');
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(audioDataUrl);
    audioRef.current = audio;
    audio.onended = () => setStatus('idle');
    audio.onerror = () => setStatus('idle');
    audio.play().catch(() => setStatus('idle'));
  };

  const addBotFallback = (fallbackText?: string | null) => {
    const text = mode === 'dvs'
      ? (fallbackText || `Sorry, I couldn't reply just now. Please call or WhatsApp DVS at ${phone} and our Lucknow team will help you right away.`)
      : 'The twin backend did not respond. Please try again in a moment.';
    setMessages(prev => [...prev, { id: 'err_' + Date.now(), sender: 'bot', text, isError: true }]);
  };

  /** Shared request to /api/chat. The user bubble for typed text is added by the caller,
   *  so the response handler only adds the user bubble for voice input (fixes duplicate bubbles). */
  const callChat = async (body: Record<string, unknown>, opts: { fromVoice: boolean; train: boolean }) => {
    setErrorMsg(null);
    setStatus('processing');
    try {
      const response = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, mode, train: opts.train, session_id: sessionId, history: buildHistory() })
      });
      let data: any = {};
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok || data.error) {
        setErrorMsg(data.error || `Server error (${response.status})`);
        if (opts.fromVoice && data.query) {
          setMessages(prev => [...prev, { id: 'user_' + Date.now(), sender: 'user', text: data.query }]);
        }
        addBotFallback(data.fallback);
        setStatus('idle');
        return;
      }

      const botAudio = data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined;
      setMessages(prev => {
        const next = [...prev];
        if (opts.fromVoice) {
          next.push({ id: 'user_' + Date.now(), sender: 'user', text: data.query || '[Unrecognized voice input]', isTraining: opts.train });
        }
        next.push({ id: 'bot_' + Date.now(), sender: 'bot', text: data.text, audioUrl: botAudio, isError: !!data.fallback });
        return next;
      });

      // Auto-play only when the user spoke; typed chats show a speaker button instead.
      if (botAudio && opts.fromVoice) playSpeech(botAudio);
      else setStatus('idle');

      if (showAdvanced) fetchMemoryStats();
      if (data.auto_learned) {
        setAutoLearnFlash(true);
        setTimeout(() => setAutoLearnFlash(false), 5000);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error');
      addBotFallback();
      setStatus('idle');
    }
  };

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const train = mode === 'twin' && isTrainMode;
    setMessages(prev => [...prev, { id: 'user_' + Date.now(), sender: 'user', text, isTraining: train }]);
    setInput('');
    callChat({ text }, { fromVoice: false, train });
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input);
  };

  // ── Voice (optional) ──────────────────────────────────────────────────────
  const sendAudio = (audioBlob: Blob, mimeType: string) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      callChat({ audio: base64Data, mimeType }, { fromVoice: true, train: mode === 'twin' && isTrainMode });
    };
  };

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    if (audioRef.current) audioRef.current.pause();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } catch {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        setLastRecordedBlob(blob);
        sendAudio(blob, recorder.mimeType);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
      setStatus('recording');
    } catch {
      setErrorMsg('Microphone access denied. You can type your question instead.');
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('processing');
    }
  };

  // ── Voice profile analysis (Advanced) ─────────────────────────────────────
  const analyzeLastVoiceInput = () => {
    if (!lastRecordedBlob) {
      setErrorMsg('Please record something with the mic first to analyze.');
      return;
    }
    setVoiceAnalysis(null);
    setErrorMsg(null);
    setStatus('processing');
    const reader = new FileReader();
    reader.readAsDataURL(lastRecordedBlob);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const response = await fetch(`${API}/api/analyze-voice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Data, mimeType: lastRecordedBlob.type, session_id: sessionId })
        });
        if (!response.ok) throw new Error('Analysis failed on server.');
        const data = await response.json();
        setVoiceAnalysis(data.analysis);
        fetchMemoryStats();
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to analyze vocal characteristics.');
      } finally {
        setStatus('idle');
      }
    };
  };

  const switchMode = (next: ChatMode) => {
    if (next === mode) return;
    setMode(next);
    if (next === 'dvs') setIsTrainMode(false);
    setErrorMsg(null);
    setMessages([makeWelcome(next, phone)]);
  };

  const resetChat = () => {
    if (audioRef.current) audioRef.current.pause();
    setErrorMsg(null);
    setStatus('idle');
    setMessages([makeWelcome(mode, phone)]);
  };

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return 'Never';
    try {
      return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return ts;
    }
  };

  const chips = mode === 'dvs' ? DVS_CHIPS : TWIN_CHIPS;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dvs-chat-page" style={{ maxWidth: '920px', margin: '0 auto', padding: '2.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .dvs-typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--accent-primary); display: inline-block; animation: dvsTyping 1.2s infinite ease-in-out; }
        .dvs-typing span:nth-child(2) { animation-delay: 0.15s; }
        .dvs-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dvsTyping { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        .dvs-chips { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; scrollbar-width: thin; }
        .dvs-chip { flex-shrink: 0; border: 1px solid var(--bg-glass-border); background: var(--bg-tertiary); color: var(--text-primary); border-radius: var(--radius-full); padding: 0.45rem 0.9rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; }
        .dvs-chip:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); background: #fffbeb; }
        .dvs-chip:disabled { opacity: 0.55; cursor: not-allowed; }
        .dvs-chat-list { height: min(58vh, 520px); }
        .dvs-input { flex: 1; min-width: 0; border: 1px solid var(--bg-glass-border); border-radius: var(--radius-full); padding: 0.8rem 1.1rem; font-size: 1rem; background: #fff; color: var(--text-primary); outline: none; }
        .dvs-input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(217,119,6,0.15); }
        .dvs-contact-row { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        .dvs-adv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 640px) {
          .dvs-chat-page { padding: 1.25rem 0.75rem !important; }
          .dvs-chat-page h1 { font-size: 1.75rem !important; }
          .dvs-chat-list { height: 56vh; }
          .dvs-adv-grid { grid-template-columns: 1fr; }
          .dvs-send-label { display: none; }
        }
      `}} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shield size={14} /> DVS Pest Assistant • Lucknow
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.6rem', fontWeight: 800 }}>
          Chat with <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DVS</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 1.25rem' }}>
          Ask about cockroach, termite, mosquito, rodent or bed bug treatment, get ₹ rates, and book an inspection anywhere in Lucknow. Hindi, English or Hinglish — all fine.
        </p>
        <div className="dvs-contact-row">
          <a href={telLink} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            <Phone size={16} /> Call {phone}
          </a>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}>
            <MessageCircle size={16} /> WhatsApp
          </a>
          {onBookClick && (
            <button className="btn btn-outline btn-sm" onClick={onBookClick}>
              <CalendarCheck size={16} /> Booking form
            </button>
          )}
        </div>
      </div>

      {autoLearnFlash && (
        <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.4)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#059669', fontWeight: 700 }}>
          <Sparkles size={18} /> New personality traits auto-extracted and saved to memory!
        </div>
      )}

      {/* Chat panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
        {/* Chat header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--bg-glass-border)', background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              {mode === 'dvs' ? <Shield size={20} /> : <Brain size={20} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{mode === 'dvs' ? 'DVS Pest Assistant' : 'Amrish Singh — Digital Twin'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {status === 'processing' ? 'Typing…' : status === 'recording' ? 'Listening…' : status === 'speaking' ? 'Speaking…'
                  : mode === 'dvs' ? '₹ rates • 2-4 hr dispatch in Lucknow • 8 AM - 9 PM' : 'Experimental persona mode'}
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" title="Start a new chat" aria-label="Start a new chat" style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={resetChat}>
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="dvs-chat-list" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem', background: 'var(--bg-primary)' }} aria-live="polite">
          {messages.map(msg => (
            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.isTraining && (
                <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.4rem', borderRadius: '4px', marginBottom: '0.2rem', fontWeight: 700 }}>
                  🎓 MEMORY TRAINING
                </span>
              )}
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-primary) 0%, #b45309 100%)' : msg.isError ? '#fff7ed' : '#ffffff',
                color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                border: msg.sender === 'user' ? 'none' : msg.isError ? '1px solid #fdba74' : '1px solid var(--bg-glass-border)',
                boxShadow: 'var(--shadow-sm)',
                lineHeight: 1.5,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.text}
                {msg.sender === 'bot' && msg.audioUrl && (
                  <button aria-label="Play reply" style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginLeft: '0.5rem', padding: '0.2rem', verticalAlign: 'middle' }} onClick={() => playSpeech(msg.audioUrl!)}>
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
              {msg.isError && mode === 'dvs' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <a href={telLink} className="btn btn-primary btn-sm" style={{ textDecoration: 'none', fontSize: '0.8rem' }}><Phone size={14} /> Call</a>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ textDecoration: 'none', fontSize: '0.8rem', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}><MessageCircle size={14} /> WhatsApp</a>
                </div>
              )}
            </div>
          ))}

          {status === 'processing' && (
            <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid var(--bg-glass-border)', borderRadius: '18px 18px 18px 4px', padding: '0.8rem 1rem', boxShadow: 'var(--shadow-sm)' }} aria-label="Assistant is typing">
              <div className="dvs-typing" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><span /><span /><span /></div>
            </div>
          )}
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#fee2e2', color: '#b91c1c', fontSize: '0.8rem', alignItems: 'center', borderTop: '1px solid #fca5a5' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>
              {mode === 'dvs' ? `Chat is having trouble right now (${errorMsg}). Please call or WhatsApp ${phone}.` : errorMsg}
            </span>
            <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* Chips + input (always visible) */}
        <div style={{ padding: '0.9rem 1.25rem 1.1rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#ffffff' }}>
          <div className="dvs-chips">
            {chips.map(chip => (
              <button key={chip.label} type="button" className="dvs-chip" disabled={busy} onClick={() => sendText(chip.prompt)}>
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!isRecording ? (
              <button type="button" className="btn btn-outline" title="Speak (optional)" aria-label="Speak your question" style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={startRecording} disabled={busy}>
                <Mic size={18} />
              </button>
            ) : (
              <button type="button" className="btn" title="Stop and send" aria-label="Stop recording and send" style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%', background: '#dc2626', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={stopRecording}>
                <MicOff size={18} />
              </button>
            )}
            <input
              ref={inputRef}
              className="dvs-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isRecording ? 'Listening… tap stop to send' : mode === 'dvs' ? 'Type your pest problem or question…' : (isTrainMode ? 'Type a fact to teach the twin…' : 'Ask the twin anything…')}
              disabled={isRecording}
              maxLength={1000}
              aria-label="Type your message"
              enterKeyHint="send"
            />
            <button type="submit" className="btn btn-primary" style={{ height: '46px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }} disabled={busy || !input.trim()}>
              <Send size={16} /> <span className="dvs-send-label">Send</span>
            </button>
          </form>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {mode === 'dvs'
              ? <>Bookings are confirmed by our team on call. Final price after inspection. Urgent? <a href={telLink} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Call {phone}</a></>
              : 'Twin mode is experimental and not customer support.'}
          </div>
        </div>
      </div>

      {/* Advanced lab (collapsed by default) */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          aria-expanded={showAdvanced}
          style={{ width: '100%', padding: '0.9rem 1.25rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings2 size={16} /> Advanced (memory, training, voice lab, twin mode)</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Mode switch */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Chat mode:</span>
              <button type="button" className={`btn btn-sm ${mode === 'dvs' ? 'btn-primary' : 'btn-outline'}`} onClick={() => switchMode('dvs')}>
                <Shield size={14} /> DVS assistant
              </button>
              <button type="button" className={`btn btn-sm ${mode === 'twin' ? 'btn-primary' : 'btn-outline'}`} onClick={() => switchMode('twin')}>
                <Brain size={14} /> Amrish twin
              </button>
              {mode === 'twin' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isTrainMode} onChange={e => setIsTrainMode(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
                  Train mode (save messages as facts — local server.py only)
                </label>
              )}
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: backendOnline === false ? '#dc2626' : backendOnline === true ? '#059669' : 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: backendOnline === false ? '#dc2626' : backendOnline === true ? '#059669' : '#94a3b8', display: 'inline-block' }} />
              {backendOnline === false ? 'Memory backend offline — start server.py to activate' : backendOnline === true ? 'Memory backend reachable' : 'Checking memory backend…'}
            </div>

            <div className="dvs-adv-grid">
              {/* Memory Brain */}
              <div style={{ padding: '1.25rem', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.9rem', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
                    <Database size={16} /> Memory Brain
                  </h3>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                    onClick={() => { setShowMemoryLog(!showMemoryLog); if (!showMemoryLog) fetchRecentMemory(); }}
                  >
                    {showMemoryLog ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showMemoryLog ? 'Hide' : 'View'} Log
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {[
                    { icon: <MessageSquare size={14} />, label: 'Conversations', value: memoryStats?.total_conversations ?? '—', color: '#3b82f6' },
                    { icon: <Sparkles size={14} />,      label: 'Learned Facts', value: memoryStats?.auto_learned_facts ?? '—', color: '#f59e0b' },
                    { icon: <Mic size={14} />,           label: 'Voice Analyses', value: memoryStats?.total_voice_analyses ?? '—', color: '#8b5cf6' },
                    { icon: <TrendingUp size={14} />,    label: 'Full Profile', value: memoryStats?.has_personality_profile ? '✓ Built' : 'Needs 20', color: memoryStats?.has_personality_profile ? '#059669' : '#94a3b8' }
                  ].map((stat, i) => (
                    <div key={i} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ color: stat.color, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 600 }}>{stat.icon} {stat.label}</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                {memoryStats?.last_active && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} /> Last active: {formatTimestamp(memoryStats.last_active)}
                  </div>
                )}
              </div>

              {/* Voice profile */}
              <div style={{ padding: '1.25rem', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.9rem', background: '#fff' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mic size={16} /> Voice Profile Lab
                </h3>
                <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }} onClick={analyzeLastVoiceInput} disabled={!lastRecordedBlob || busy}>
                  <Sparkles size={14} /> Analyze & Save Voice Profile
                </button>
                {!lastRecordedBlob && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>(Use the mic in the chat first to enable analysis)</div>
                )}
              </div>
            </div>

            {showMemoryLog && (
              <div style={{ padding: '1.25rem', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.9rem', background: '#fff' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                  <Database size={16} /> Past Session Memory Log
                </h3>
                {recentMemory.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.75rem' }}>No past conversations logged (memory needs the local server.py).</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {recentMemory.map((entry, i) => (
                      <div key={i} style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59,130,246,0.12)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} /> {formatTimestamp(entry.timestamp)}</span>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>#{entry.session_id}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.4rem' }}><User size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-primary)' }} /><span style={{ color: 'var(--text-secondary)' }}>{entry.query}</span></div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.4rem' }}><Brain size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-secondary)' }} /><span>{entry.response}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {voiceAnalysis && (
              <div style={{ padding: '1.25rem', border: '1px solid var(--accent-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fff' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
                  <Sparkles size={16} /> Vocal & Behavior Analysis Profile
                </h3>
                <div style={{ padding: '0.9rem', background: 'rgba(5,150,105,0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(5,150,105,0.25)', fontSize: '0.9rem', lineHeight: 1.6 }}>{voiceAnalysis}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Info size={14} /> Analysis saved to memory (local server only).
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
