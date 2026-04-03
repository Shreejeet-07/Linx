import { useState, useEffect, useRef, useCallback } from 'react';
import { googleAuth } from '../store';
import './AuthModal.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function AuthModal({ mode, onClose, onToggle, onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleStep, setGoogleStep] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    setError(''); setUsername(''); setPassword('');
    setGoogleStep(false); setGoogleCredential(null); setGoogleEmail('');
  }, [mode]);

  const handleGoogleResponse = useCallback(async (response) => {
    setError('');
    const result = await googleAuth({ credential: response.credential });
    if (result.error) { setError(result.error); return; }
    if (result.newUser) {
      setGoogleCredential(response.credential);
      setGoogleEmail(result.email);
      setGoogleStep(true);
      return;
    }
    onAuth(result.user);
    onClose();
  }, [onAuth, onClose]);

  // Load GSI script and render the real Google button
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || googleStep) return;

    function initAndRender() {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        width: btnRef.current.offsetWidth || 352,
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
      });
      setGsiReady(true);
    }

    const existing = document.getElementById('google-gsi');
    if (existing && window.google) {
      initAndRender();
      return;
    }
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'google-gsi';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initAndRender;
      document.body.appendChild(script);
    } else {
      // script tag exists but not loaded yet — wait
      existing.addEventListener('load', initAndRender);
    }
  }, [mode, googleStep, handleGoogleResponse]);

  // Re-render button when ref becomes available
  useEffect(() => {
    if (!btnRef.current || !window.google || googleStep) return;
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: 'large',
      width: btnRef.current.offsetWidth || 352,
      text: mode === 'signup' ? 'signup_with' : 'signin_with',
    });
    setGsiReady(true);
  }, [googleStep, mode]);

  async function handleGoogleSetup(e) {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    const result = await googleAuth({ credential: googleCredential, password, username });
    if (result.error) { setError(result.error); return; }
    onAuth(result.user);
    onClose();
  }

  // ── Step 2: username + password setup after Google ────────
  if (googleStep) {
    return (
      <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <button type="button" className="modal-close" onClick={onClose}>×</button>
          <h2>Almost there!</h2>
          <p className="modal-sub">Setting up your Linx for <strong>{googleEmail}</strong></p>
          <form onSubmit={handleGoogleSetup}>
            <div className="field">
              <label>Username</label>
              <div className="username-row">
                <span>linx.app/</span>
                <input type="text" placeholder="yourname" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
              </div>
            </div>
            <div className="field">
              <label>Set a Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ flex: 1, paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '0.7rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--muted)' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {error && <p className="modal-error">{error}</p>}
            <button type="submit" className="btn btn-primary modal-submit">Create my Linx →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main modal: Google only ───────────────────────────────
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <h2>{mode === 'signup' ? 'Create Account' : 'Welcome back'}</h2>
        <p className="modal-sub">
          {mode === 'signup'
            ? 'Sign up with your Google account — free, no credit card needed.'
            : 'Log in with your Google account.'}
        </p>

        {/* Google renders its own button into this div */}
        <div ref={btnRef} className="google-btn-container" />
        {!gsiReady && <p className="modal-loading">Loading Google sign-in…</p>}

        {error && <p className="modal-error">{error}</p>}

        <p className="modal-toggle">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => onToggle(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
