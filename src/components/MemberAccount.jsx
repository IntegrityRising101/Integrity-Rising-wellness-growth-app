import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './MemberAccount.css';

function MemberAccount() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (active && !error) setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update');
        setMessage('Choose a new password for your account.');
      } else {
        setMessage('');
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !user) {
      setDisplayName('');
      setBio('');
      return undefined;
    }

    let active = true;
    async function loadProfile() {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio')
        .eq('id', user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setMessage(`Your account is signed in, but we could not load your profile: ${error.message}`);
      } else if (data) {
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
      } else {
        setDisplayName(user.user_metadata?.display_name || '');
        setBio('');
      }
      setProfileLoading(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setMessage('');
    try {
      let result;
      if (mode === 'update') {
        result = await supabase.auth.updateUser({ password });
      } else if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() || 'Movement Member' } },
          emailRedirectTo: "https://integrityrising101.github.io/Integrity-Rising-wellness-growth-app/",
        });
      } else if (mode === 'reset') {
        const recoveryRedirect = `${window.location.origin}${import.meta.env.BASE_URL}`;
        result = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: recoveryRedirect,
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      }
      if (result.error) throw result.error;

      if (mode === 'signup' && !result.data.session) {
        setMessage('Account request received. Check your email for the confirmation link, then return here to sign in.');
      } else if (mode === 'reset') {
        setMessage('If an account exists for that email, a password reset link will be sent. Check your inbox.');
      } else if (mode === 'update') {
        setPassword('');
        setMode('signin');
        setMessage('Your password has been updated successfully.');
      } else {
        setMessage(mode === 'signup' ? 'Your account was created.' : 'You are signed in.');
      }
      if (mode !== 'update') setPassword('');
    } catch (error) {
      setMessage(error.message || 'We could not complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    if (!supabase || !user || profileBusy) return;
    const cleanName = displayName.trim();
    const cleanBio = bio.trim();
    if (!cleanName || cleanName.length > 60) {
      setMessage('Please enter a display name between 1 and 60 characters.');
      return;
    }
    if (cleanBio.length > 280) {
      setMessage('Your bio must be 280 characters or fewer.');
      return;
    }

    setProfileBusy(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, display_name: cleanName, bio: cleanBio, updated_at: new Date().toISOString() },
          { onConflict: 'id' },
        );
      if (error) throw error;
      setMessage('Your member profile has been saved.');
    } catch (error) {
      setMessage(error.message || 'We could not save your profile. Please try again.');
    } finally {
      setProfileBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : 'You have signed out.');
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage('');
    setPassword('');
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
          <p><strong>Next:</strong> Create or open the Integrity Rising Supabase project and add
            the two environment variables described in the repository's <code>.env.example</code> file.
            Never place a service-role key or database password in this app.</p>
        </div>
      ) : mode === 'update' ? (
        <form className="member-account-form" onSubmit={handleSubmit}>
          <h3>Set a new password</h3>
          <p>Choose a new password with at least 8 characters.</p>
          <label htmlFor="member-password">New password</label>
          <input
            id="member-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      ) : user ? (
        <div className="account-signed-in">
          <p>You are signed in as <strong>{user.email}</strong>.</p>
          <h3>My Member Profile</h3>
          {profileLoading ? (
            <p>Loading your profile…</p>
          ) : (
            <form className="member-account-form" onSubmit={handleSaveProfile}>
              <label htmlFor="member-display-name">Display name</label>
              <input
                id="member-display-name"
                type="text"
                maxLength={60}
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <label htmlFor="member-bio">Short bio</label>
              <textarea
                id="member-bio"
                rows={4}
                maxLength={280}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Share a little about yourself (optional)."
              />
              <p className="account-password-hint">{bio.length}/280 characters. Your profile is visible to signed-in members.</p>
              <button type="submit" disabled={profileBusy}>
                {profileBusy ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          )}
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <>
          <div className="account-mode-switch" role="group" aria-label="Account action">
            <button type="button" aria-pressed={mode === 'signin'} onClick={() => changeMode('signin')}>Sign in</button>
            <button type="button" aria-pressed={mode === 'signup'} onClick={() => changeMode('signup')}>Create account</button>
          </div>
          <form className="member-account-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <label htmlFor="member-display-name">Display name</label>
                <input
                  id="member-display-name"
                  type="text"
                  autoComplete="nickname"
                  maxLength={60}
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="How members will see you"
                />
              </>
            )}
            <label htmlFor="member-email">Email address</label>
            <input id="member-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            {mode !== 'reset' && (
              <>
                <label htmlFor="member-password">Password</label>
                <input id="member-password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
                <p className="account-password-hint">Use at least 8 characters. Choose a unique password you do not use elsewhere.</p>
              </>
            )}
            <button type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}
            </button>
          </form>
          {mode === 'signin' && (
            <button className="account-text-button" type="button" onClick={() => changeMode('reset')}>Forgot password?</button>
          )}
          {mode === 'reset' && (
            <button className="account-text-button" type="button" onClick={() => changeMode('signin')}>Back to sign in</button>
          )}
        </>
      )}
      {message && <p className="account-status" role="status">{message}</p>}
      <p className="account-privacy-note">Account sign-in is separate from emergency support. This app is not monitored.
        Do not use it to store safety-critical information. Use a safer device if someone may monitor yours.</p>
    </section>
  );
}

export default MemberAccount;
