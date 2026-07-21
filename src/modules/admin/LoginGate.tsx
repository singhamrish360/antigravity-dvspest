import React, { useState, useEffect } from 'react';
import { emailSignIn, emailSignUp, signInWithGoogle, signInWithPhone, setupPhoneRecaptcha } from '../../core/auth';
import { Shield, Key, Mail, Phone, Lock, Eye, EyeOff, Smartphone, Chrome } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { security } from '../../core/security';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const LoginGate: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneStep, setPhoneStep] = useState<'send' | 'verify'>('send');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Initialize invisible recaptcha for phone auth
  useEffect(() => {
    if (authMethod === 'phone' && phoneStep === 'send') {
      try {
        const verifier = setupPhoneRecaptcha('recaptcha-container');
        (window as any).recaptchaVerifier = verifier;
      } catch (err) {
        console.error('Recaptcha init error:', err);
      }
    }
  }, [authMethod, phoneStep]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const normalizedEmail = email.trim().toLowerCase();
      // Master credentials override check
      if ((normalizedEmail === 'admin' || normalizedEmail === 'admin@dvspestcontrol.in') && password === 'Sahil@123') {
        security.forceAdminSession("Sahil");
        onSuccess();
        return;
      }

      if (isSignUp) {
        await emailSignUp(email, password);
      } else {
        await emailSignIn(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-in encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const verifier = (window as any).recaptchaVerifier;
      if (!verifier) {
        throw new Error('reCAPTCHA verification engine failed to initialize.');
      }
      const result = await signInWithPhone(phoneNumber, verifier);
      setConfirmationResult(result);
      setPhoneStep('verify');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification SMS.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await confirmationResult.confirm(verificationCode);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid SMS verification code entered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(44, 36, 29, 0.65)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Logo and Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '0.75rem', boxShadow: 'var(--shadow-glow)' }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>DVS Secure Operator Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Lucknow Headquarters • Identity Verification</p>
        </div>

        {/* Evasion/Error notification */}
        {errorMsg && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'block', fontSize: '0.8rem', textAlign: 'center' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '0.25rem', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', background: authMethod === 'email' ? '#ffffff' : 'transparent', color: 'var(--text-primary)', fontWeight: authMethod === 'email' ? 700 : 500, borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Email Access
          </button>
          <button 
            type="button" 
            onClick={() => { setAuthMethod('phone'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', background: authMethod === 'phone' ? '#ffffff' : 'transparent', color: 'var(--text-primary)', fontWeight: authMethod === 'phone' ? 700 : 500, borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Phone SMS Code
          </button>
        </div>

        {/* Form Elements */}
        {authMethod === 'email' ? (
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  placeholder="name@dvspestcontrol.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  className="form-control" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : isSignUp ? 'Create Operator Account' : 'Authenticate Console'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Already registered? ' : 'First time deploying? '}
              </span>
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                {isSignUp ? 'Sign In Instead' : 'Register Operator'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {phoneStep === 'send' ? (
              <form onSubmit={handleSendSMS} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number (with country code)</label>
                  <input 
                    type="tel" 
                    required 
                    className="form-control" 
                    placeholder="e.g. +919839012345"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                {/* Invisible reCAPTCHA Anchor */}
                <div id="recaptcha-container"></div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Sending SMS Code...' : 'Dispatch Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit Verification Code</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6} 
                    className="form-control" 
                    placeholder="e.g. 123456"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Launch Console'}
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => setPhoneStep('send')}
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--bg-glass-border)' }}></div>
          <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR SIGN IN WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--bg-glass-border)' }}></div>
        </div>

        {/* Social Authentication */}
        <button 
          type="button" 
          onClick={handleGoogleSignIn} 
          className="btn btn-secondary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}
          disabled={loading}
        >
          <Chrome size={18} /> Google Authenticator
        </button>

        {/* Cancel Button */}
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-outline" 
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Cancel & Return
        </button>

      </div>
    </div>
  );
};
