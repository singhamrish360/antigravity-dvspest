import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Brain, Shield, Info, Volume2, Save, Sparkles, RefreshCw, AlertCircle, Heart } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'clone';
  text: string;
  audioUrl?: string;
  isTraining?: boolean;
}

export const VirtualTwinPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'speaking'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTrainMode, setIsTrainMode] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState<string | null>(null);
  const [lastRecordedBlob, setLastRecordedBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Browsers default to webm
      const options = { mimeType: 'audio/webm' };
      let recorder;
      
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        setLastRecordedBlob(audioBlob);
        sendAudioToTwin(audioBlob, recorder.mimeType);
        
        // Stop all track streams
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err: any) {
      console.error('Mic access error:', err);
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

  const sendAudioToTwin = async (audioBlob: Blob, mimeType: string) => {
    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      
      try {
        const response = await fetch('http://localhost:8001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Data,
            train: isTrainMode,
            mimeType: mimeType
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Server error occurred');
        }

        const data = await response.json();
        
        // Add transcribed user question to chat
        const userMsgId = 'user_' + Date.now();
        setMessages(prev => [
          ...prev,
          {
            id: userMsgId,
            sender: 'user',
            text: data.query || '[Unrecognized Voice Input]',
            isTraining: isTrainMode
          }
        ]);

        // Add digital twin response to chat
        const cloneMsgId = 'clone_' + Date.now();
        const cloneAudioUrl = data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined;
        
        setMessages(prev => [
          ...prev,
          {
            id: cloneMsgId,
            sender: 'clone',
            text: data.text,
            audioUrl: cloneAudioUrl
          }
        ]);

        if (cloneAudioUrl) {
          playSpeech(cloneAudioUrl);
        } else {
          setStatus('idle');
        }

      } catch (err: any) {
        console.error('API Error:', err);
        setErrorMsg(err.message || 'Failed to connect to Virtual Twin backend.');
        setStatus('idle');
      }
    };
  };

  const playSpeech = (audioDataUrl: string) => {
    setStatus('speaking');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(audioDataUrl);
    audioRef.current = audio;
    audio.onended = () => {
      setStatus('idle');
    };
    audio.onerror = () => {
      setStatus('idle');
    };
    audio.play().catch(e => {
      console.warn('Auto-play failed due to browser policies:', e);
      setStatus('idle');
    });
  };

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
        const response = await fetch('http://localhost:8001/api/analyze-voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Data,
            mimeType: lastRecordedBlob.type
          })
        });

        if (!response.ok) {
          throw new Error('Analysis failed on server.');
        }

        const data = await response.json();
        setVoiceAnalysis(data.analysis);
        setStatus('idle');
      } catch (err: any) {
        console.error('Analysis error:', err);
        setErrorMsg(err.message || 'Failed to analyze vocal characteristics.');
        setStatus('idle');
      }
    };
  };

  const sendQuickText = async (text: string) => {
    setErrorMsg(null);
    setStatus('processing');
    
    // Add user text
    const userMsgId = 'user_' + Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: text
      }
    ]);

    try {
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          train: false
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error occurred');
      }

      const data = await response.json();
      
      const cloneMsgId = 'clone_' + Date.now();
      const cloneAudioUrl = data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined;
      
      setMessages(prev => [
        ...prev,
        {
          id: cloneMsgId,
          sender: 'clone',
          text: data.text,
          audioUrl: cloneAudioUrl
        }
      ]);

      if (cloneAudioUrl) {
        playSpeech(cloneAudioUrl);
      } else {
        setStatus('idle');
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process request.');
      setStatus('idle');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Brain size={14} /> Amrish Singh (PE) Digital Clone
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Virtual Twin Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Interact with my unfiltered, raw digital twin. Deployed to capture the authentic light and shadow of my professional expressway reports and real life struggles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'stretch' }}>
        
        {/* Left Control Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Interactive Clone Orb Visualizer */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              <Shield size={12} /> DVS AUTHENTIC SECURE
            </div>

            {/* Pulsating Glowing Orb */}
            <div 
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: status === 'recording' 
                  ? 'radial-gradient(circle, #ea580c 0%, #b45309 60%, rgba(217,119,6,0) 100%)' 
                  : status === 'speaking' 
                  ? 'radial-gradient(circle, #059669 0%, #047857 60%, rgba(5,150,105,0) 100%)'
                  : 'radial-gradient(circle, #d97706 0%, #92400e 60%, rgba(184,150,105,0) 100%)',
                boxShadow: status === 'recording' 
                  ? '0 0 40px rgba(234, 88, 12, 0.6)' 
                  : status === 'speaking' 
                  ? '0 0 40px rgba(5, 150, 105, 0.6)'
                  : '0 0 25px rgba(217, 119, 6, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s ease',
                marginTop: '1.5rem'
              }}
            >
              <div 
                className={status !== 'idle' ? 'animate-ping' : ''} 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Brain size={44} style={{ color: '#fff' }} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {status === 'recording' ? 'Listening...' : status === 'processing' ? 'Thinking...' : status === 'speaking' ? 'Speaking...' : 'Clone Ready'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {status === 'recording' 
                  ? 'Speak clearly. Press Stop when you are done.' 
                  : status === 'processing' 
                  ? 'Reviewing knowledge base and struggles...' 
                  : status === 'speaking' 
                  ? 'Synthesizing voice clone audio...' 
                  : 'Click the button below to start voice command loop.'}
              </p>
            </div>

            {/* Error Message banner */}
            {errorMsg && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', alignItems: 'center', width: '100%', textAlign: 'left' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Continuous Speaking Trigger Button */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              {!isRecording ? (
                <button 
                  className="btn btn-primary" 
                  style={{ flexGrow: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={startRecording}
                  disabled={status === 'processing'}
                >
                  <Mic size={18} /> Start Speaking
                </button>
              ) : (
                <button 
                  className="btn" 
                  style={{ flexGrow: 1, padding: '0.75rem', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }}
                  onClick={stopRecording}
                >
                  <MicOff size={18} /> Stop & Send
                </button>
              )}
            </div>
          </div>

          {/* Controls Panel: Training Mode & Voice Analysis Button */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Digital Clone Training & Analysis</h3>
            
            {/* Training Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(184, 150, 105, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Save size={16} className="text-amber-600" />
                  Train Clone Mode
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Spoken facts will be appended directly to memory.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isTrainMode} 
                  onChange={(e) => setIsTrainMode(e.target.checked)} 
                  style={{ opacity: 0, width: 0, height: 0 }} 
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: isTrainMode ? 'var(--accent-secondary)' : '#cbd5e1',
                  transition: '.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px', width: '18px',
                    left: isTrainMode ? '26px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '.4s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>

            {/* Voice Analysis trigger */}
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
              onClick={analyzeLastVoiceInput}
              disabled={!lastRecordedBlob || status === 'processing'}
            >
              <Sparkles size={16} /> Analyze Last Spoken Sentence
            </button>
            
            {!lastRecordedBlob && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem' }}>
                (Disabled: Speak to record a voice clip first)
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Quick Inquiries</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                "How do you feel about project planning?",
                "Tell me about the Bahraich site visit.",
                "Why do tender drawings have so many errors?",
                "Introduce yourself in character."
              ].map((txt, idx) => (
                <button 
                  key={idx} 
                  className="btn btn-outline btn-sm"
                  style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}
                  onClick={() => sendQuickText(txt)}
                  disabled={status === 'processing'}
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Chat feed & Voice analysis panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Chat Feed */}
          <div className="glass-panel" style={{ height: '480px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>Clone Feed Log</span>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setMessages([])}
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Conversation bubbles scrollarea */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {messages.length === 0 ? (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem' }}>
                  <Brain size={32} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '0.9rem' }}>No conversations yet. Speak or type to start.</span>
                </div>
              ) : (
                messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {/* Training mode banner */}
                    {msg.isTraining && (
                      <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.4rem', borderRadius: '4px', marginBottom: '0.2rem', fontWeight: 700 }}>
                        🎓 MEMORY TRAINING
                      </span>
                    )}
                    
                    <div 
                      style={{ 
                        padding: '0.85rem 1.15rem', 
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.sender === 'user' 
                          ? 'linear-gradient(135deg, var(--accent-primary) 0%, #b45309 100%)' 
                          : 'var(--bg-tertiary)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--bg-glass-border)',
                        boxShadow: 'var(--shadow-sm)',
                        lineHeight: 1.5,
                        fontSize: '0.92rem',
                        position: 'relative'
                      }}
                    >
                      {msg.text}
                      
                      {/* Replay audio trigger */}
                      {msg.sender === 'clone' && msg.audioUrl && (
                        <button 
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginLeft: '0.5rem',
                            padding: '0.2rem',
                            verticalAlign: 'middle'
                          }}
                          onClick={() => playSpeech(msg.audioUrl!)}
                        >
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

          {/* Voice Analysis Report Output Panel */}
          {voiceAnalysis && (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--accent-secondary)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
                <Sparkles size={20} /> Vocal & Behavior Analysis Profile
              </h3>
              
              <div style={{ padding: '1rem', background: 'rgba(5, 150, 105, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(5, 150, 105, 0.25)', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {voiceAnalysis}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Info size={14} />
                <span>Generated dynamically using multi-modal vocal pattern evaluation.</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
