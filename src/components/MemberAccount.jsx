import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './MemberAccount.css';

function MemberAccount() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (active && !error) setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) {
        setMessage('Check your email for the confirmation link, then return here to sign in.');
      } else {
        setMessage(mode === 'signup' ? 'Your account was created.' : 'You are signed in.');
      }
      setPassword('');
    } catch (error) {
      setMessage(error.message || 'We could not complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : 'You have signed out.');
  }

  return (
    <section className="member-account" aria-labelledby="member-account-title">
      <span className="member-account-kicker">THE INTEGRITY MOVEMENT</span>
      <h2 id="member-account-title">Member Account</h2>
      {!isSupabaseConfigured ? (
        <div className="account-setup-notice">
          <h3>Account setup is being prepared</h3>
          <p>The secure sign-in screen is ready, but it is not connected to a database yet.
            No account can be created until the project URL and public client key are added
            to the hosting environment.</p>
          <p><strong>Next:</strong> Create a Supabase project and add the two environment
            variables described in the repository's <code>.env.example</code> file.
            Never place a service-role key or database password in this app.</p>
        </div>
      ) : user ? (
        <div className="account-signed-in">
          <p>You are signed in as <strong>{user.email}</strong>.</p>
          <p>Your account is active. Saved wellness features will be connected in a later step.</p>
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <>
          <div className="account-mode-switch" role="group" aria-label="Account action">
            <button type="button" aria-pressed={mode === 'signin'} onClick={() => { setMode('signin'); setMessage(''); }}>Sign in</button>
            <button type="button" aria-pressed={mode === 'signup'} onClick={() => { setMode('signup'); setMessage(''); }}>Create account</button>
          </div>
          <form className="member-account-form" onSubmit={handleSubmit}>
            <label htmlFor="member-email">Email address</label>
            <input id="member-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="member-password">Password</label>
            <input id="member-password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            <p className="account-password-hint">Use at least 8 characters. Choose a unique password you do not use elsewhere.</p>
            <button type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
          </form>
          {message && <p className="account-status" role="status">{message}</p>}
        </>
      )}
      <p className="account-privacy-note">Account sign-in is separate from emergency support. This app is not monitored.
        Do not use it to store safety-critical information. Use a safer device if someone may monitor yours.</p>
    </section>
  );
}

export default MemberAccount;
