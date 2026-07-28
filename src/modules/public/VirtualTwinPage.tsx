import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Brain, Shield, Info, Volume2, Save,
  Sparkles, RefreshCw, AlertCircle, Database, Clock,
  MessageSquare, TrendingUp, ChevronDown, ChevronUp, User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'clone';
  text: string;
  audioUrl?: string;
  isTraining?: boolean;
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

// Empty string = same domain. Vercel serves /api/* routes automatically.
// Set VITE_API_URL only if pointing to a separate backend (e.g. local dev).
const API = (import.meta.env.VITE_API_URL as string) || '';

export const VirtualTwinPage: React.FC = () => {
  const [isRecording, setIsRecording]       = useState(false);
  const [status, setStatus]                 = useState<'idle' | 'recording' | 'processing' | 'speaking'>('idle');
  const [messages, setMessages]             = useState<ChatMessage[]>([]);
  const [isTrainMode, setIsTrainMode]       = useState(false);
  const [voiceAnalysis, setVoiceAnalysis]   = useState<string | null>(null);
  const [lastRecordedBlob, setLastRecordedBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

  // Memory system state
  const [memoryStats, setMemoryStats]       = useState<MemoryStats | null>(null);
  const [recentMemory, setRecentMemory]     = useState<MemoryEntry[]>([]);
  const [showMemoryLog, setShowMemoryLog]   = useState(false);
  const [autoLearnFlash, setAutoLearnFlash] = useState(false);
  const [backendOnline, setBackendOnline]   = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const audioRef         = useRef<HTMLAudioElement | null>(null);
  const chatEndRef       = useRef<HTMLDivElement | null>(null);

  // Stable session ID for this browser session
  const sessionId = useRef<string>(
    Math.random().toString(36).substring(2, 10)
  ).current;

  // ── Fetch memory stats ────────────────────────────────────────────────────
  const fetchMemoryStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/memory/stats`);
      if (res.ok) {
        const data = await res.json();
        setMemoryStats(data);
        setBackendOnline(true);
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

  // On mount: check backend + load stats
  useEffect(() => {
    fetchMemoryStats();
  }, [fetchMemoryStats]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // ── Recording ─────────────────────────────────────────────────────────────
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

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        setLastRecordedBlob(blob);
        sendAudioToTwin(blob, recorder.mimeType);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err: any) {
      setErrorMsg('Microphone access denied. Please check site permissions.');
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

  // ── Send audio to twin ────────────────────────────────────────────────────
  const sendAudioToTwin = async (audioBlob: Blob, mimeType: string) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const response = await fetch(`${API}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio:      base64Data,
            train:      isTrainMode,
            mimeType,
            session_id: sessionId
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Server error occurred');
        }

        const data = await response.json();
        handleChatResponse(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to connect to Virtual Twin backend.');
        setStatus('idle');
      }
    };
  };

  // ── Handle chat response ──────────────────────────────────────────────────
  const handleChatResponse = (data: any) => {
    // Add user message
    setMessages(prev => [...prev, {
      id:         'user_' + Date.now(),
      sender:     'user',
      text:       data.query || '[Unrecognized Voice Input]',
      isTraining: isTrainMode
    }]);

    // Add clone response
    const cloneAudioUrl = data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined;
    setMessages(prev => [...prev, {
      id:       'clone_' + Date.now(),
      sender:   'clone',
      text:     data.text,
      audioUrl: cloneAudioUrl
    }]);

    // Play speech if available
    if (cloneAudioUrl) {
      playSpeech(cloneAudioUrl);
    } else {
      setStatus('idle');
    }

    // Refresh memory stats after each chat
    fetchMemoryStats();

    // Flash the auto-learn indicator if new traits were extracted
    if (data.auto_learned) {
      setAutoLearnFlash(true);
      setTimeout(() => setAutoLearnFlash(false), 5000);
    }
  };

  const playSpeech = (audioDataUrl: string) => {
    setStatus('speaking');
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(audioDataUrl);
    audioRef.current = audio;
    audio.onended = () => setStatus('idle');
    audio.onerror = () => setStatus('idle');
    audio.play().catch(() => setStatus('idle'));
  };

  // ── Voice analysis ────────────────────────────────────────────────────────
  const analyzeLastVoiceInput = async () => {
    if (!lastRecordedBlob) {
      setErrorMsg('Please speak or record something first to analyze.');
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
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            audio:      base64Data,
            mimeType:   lastRecordedBlob.type,
            session_id: sessionId
          })
        });
        if (!response.ok) throw new Error('Analysis failed on server.');
        const data = await response.json();
        setVoiceAnalysis(data.analysis);
        // Refresh stats since analysis was logged
        fetchMemoryStats();
        setStatus('idle');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to analyze vocal characteristics.');
        setStatus('idle');
      }
    };
  };

  // ── Quick text send ───────────────────────────────────────────────────────
  const sendQuickText = async (text: string) => {
    setErrorMsg(null);
    setStatus('processing');
    setMessages(prev => [...prev, { id: 'user_' + Date.now(), sender: 'user', text }]);

    try {
      const response = await fetch(`${API}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, train: false, session_id: sessionId })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }
      const data = await response.json();
      handleChatResponse(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process request.');
      setStatus('idle');
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTimestamp = (ts: string | null) => {
    if (!ts) return 'Never';
    try {
      const d = new Date(ts);
      return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return ts;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Brain size={14} /> Amrish Singh (PE) Digital Clone
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Virtual Twin Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Interact with my unfiltered, raw digital twin. Every conversation is logged, learned from, and used to build a more accurate replica of me over time.
        </p>

        {/* Backend status indicator */}
        <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: backendOnline === false ? '#dc2626' : backendOnline === true ? '#059669' : 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: backendOnline === false ? '#dc2626' : backendOnline === true ? '#059669' : '#94a3b8', display: 'inline-block' }} />
          {backendOnline === false ? 'Backend offline — start server.py to activate' : backendOnline === true ? 'Backend online — memory active' : 'Checking backend...'}
        </div>
      </div>

      {/* Auto-learn flash banner */}
      {autoLearnFlash && (
        <div style={{
          background:    'linear-gradient(135deg, rgba(5,150,105,0.15) 0%, rgba(16,185,129,0.1) 100%)',
          border:        '1px solid rgba(5,150,105,0.4)',
          borderRadius:  'var(--radius-sm)',
          padding:       '0.75rem 1.25rem',
          display:       'flex',
          alignItems:    'center',
          gap:           '0.75rem',
          fontSize:      '0.9rem',
          color:         '#059669',
          fontWeight:    700,
          animation:     'fadeIn 0.4s ease'
        }}>
          <Sparkles size={18} />
          ✨ New personality traits auto-extracted and saved to memory!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* ── LEFT COLUMN ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Clone Orb Visualizer */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              <Shield size={12} /> DVS AUTHENTIC SECURE
            </div>

            <div style={{
              width:        '130px',
              height:       '130px',
              borderRadius: '50%',
              background:   status === 'recording'
                ? 'radial-gradient(circle, #ea580c 0%, #b45309 60%, rgba(217,119,6,0) 100%)'
                : status === 'speaking'
                ? 'radial-gradient(circle, #059669 0%, #047857 60%, rgba(5,150,105,0) 100%)'
                : 'radial-gradient(circle, #d97706 0%, #92400e 60%, rgba(184,150,105,0) 100%)',
              boxShadow:    status === 'recording'
                ? '0 0 40px rgba(234, 88, 12, 0.6)'
                : status === 'speaking'
                ? '0 0 40px rgba(5, 150, 105, 0.6)'
                : '0 0 25px rgba(217, 119, 6, 0.25)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              transition:   'all 0.5s ease',
              marginTop:    '1.5rem'
            }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={44} style={{ color: '#fff' }} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {status === 'recording' ? 'Listening...' : status === 'processing' ? 'Thinking...' : status === 'speaking' ? 'Speaking...' : 'Clone Ready'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {status === 'recording'
                  ? 'Speak clearly. Press Stop when done.'
                  : status === 'processing'
                  ? 'Reviewing knowledge base and memory...'
                  : status === 'speaking'
                  ? 'Synthesizing voice clone audio...'
                  : 'Click below to start voice command loop.'}
              </p>
            </div>

            {errorMsg && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', alignItems: 'center', width: '100%', textAlign: 'left' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              {!isRecording ? (
                <button className="btn btn-primary" style={{ flexGrow: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={startRecording} disabled={status === 'processing'}>
                  <Mic size={18} /> Start Speaking
                </button>
              ) : (
                <button className="btn" style={{ flexGrow: 1, padding: '0.75rem', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }} onClick={stopRecording}>
                  <MicOff size={18} /> Stop & Send
                </button>
              )}
            </div>
          </div>

          {/* Training & Analysis */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Training & Voice Analysis</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(184,150,105,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Save size={16} /> Train Clone Mode
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Spoken facts saved directly to manual memory.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isTrainMode} onChange={e => setIsTrainMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isTrainMode ? 'var(--accent-secondary)' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', height: '18px', width: '18px', left: isTrainMode ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }} />
                </span>
              </label>
            </div>

            <button className="btn btn-outline" style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }} onClick={analyzeLastVoiceInput} disabled={!lastRecordedBlob || status === 'processing'}>
              <Sparkles size={16} /> Analyze & Save Voice Profile
            </button>
            {!lastRecordedBlob && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem' }}>
                (Speak first to enable voice analysis)
              </div>
            )}
          </div>

          {/* Memory Brain Stats */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(5,150,105,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
                <Database size={18} /> Memory Brain
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

            {/* Stat counters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { icon: <MessageSquare size={16} />, label: 'Conversations', value: memoryStats?.total_conversations ?? '—', color: '#3b82f6' },
                { icon: <Sparkles size={16} />,      label: 'Learned Facts', value: memoryStats?.auto_learned_facts ?? '—', color: '#f59e0b' },
                { icon: <Mic size={16} />,           label: 'Voice Analyses', value: memoryStats?.total_voice_analyses ?? '—', color: '#8b5cf6' },
                { icon: <TrendingUp size={16} />,    label: 'Full Profile', value: memoryStats?.has_personality_profile ? '✓ Built' : 'Needs 20', color: memoryStats?.has_personality_profile ? '#059669' : '#94a3b8' }
              ].map((stat, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: stat.color, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {stat.icon} {stat.label}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {memoryStats?.last_active && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={13} /> Last active: {formatTimestamp(memoryStats.last_active)}
              </div>
            )}

            {!memoryStats && backendOnline === false && (
              <div style={{ fontSize: '0.8rem', color: '#dc2626', textAlign: 'center', padding: '0.5rem' }}>
                Start server.py to activate memory system
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Quick Inquiries</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'How do you feel about project planning?',
                'Tell me about the Bahraich site visit.',
                'Why do tender drawings have so many errors?',
                'Introduce yourself in character.',
                'What is stressing you out right now?'
              ].map((txt, idx) => (
                <button key={idx} className="btn btn-outline btn-sm" style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }} onClick={() => sendQuickText(txt)} disabled={status === 'processing'}>
                  {txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Chat Feed */}
          <div className="glass-panel" style={{ height: '480px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>Clone Feed Log</span>
              <button className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setMessages([])}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {messages.length === 0 ? (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem' }}>
                  <Brain size={32} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '0.9rem' }}>No conversations yet. Speak or type to start.</span>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.isTraining && (
                      <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.4rem', borderRadius: '4px', marginBottom: '0.2rem', fontWeight: 700 }}>
                        🎓 MEMORY TRAINING
                      </span>
                    )}
                    <div style={{
                      padding:      '0.85rem 1.15rem',
                      borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background:   msg.sender === 'user'
                        ? 'linear-gradient(135deg, var(--accent-primary) 0%, #b45309 100%)'
                        : 'var(--bg-tertiary)',
                      color:        msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      border:       msg.sender === 'user' ? 'none' : '1px solid var(--bg-glass-border)',
                      boxShadow:    'var(--shadow-sm)',
                      lineHeight:   1.5,
                      fontSize:     '0.92rem'
                    }}>
                      {msg.text}
                      {msg.sender === 'clone' && msg.audioUrl && (
                        <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginLeft: '0.5rem', padding: '0.2rem', verticalAlign: 'middle' }} onClick={() => playSpeech(msg.audioUrl!)}>
                          <Volume2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Memory Log (expandable) */}
          {showMemoryLog && (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(59,130,246,0.25)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                <Database size={18} /> Past Session Memory Log
              </h3>

              {recentMemory.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem' }}>
                  No past conversations logged yet. Start talking!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {recentMemory.map((entry, i) => (
                    <div key={i} style={{ padding: '0.85rem', background: 'rgba(59,130,246,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59,130,246,0.12)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={11} /> {formatTimestamp(entry.timestamp)}
                        </span>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                          #{entry.session_id}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                        <User size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-primary)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{entry.query}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                        <Brain size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-secondary)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{entry.response}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Voice Analysis Output */}
          {voiceAnalysis && (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--accent-secondary)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
                <Sparkles size={20} /> Vocal & Behavior Analysis Profile
              </h3>
              <div style={{ padding: '1rem', background: 'rgba(5,150,105,0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(5,150,105,0.25)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {voiceAnalysis}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Info size={14} />
                <span>Analysis saved to memory. Generated using multi-modal vocal pattern evaluation.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
