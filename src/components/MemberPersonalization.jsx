import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './MemberPersonalization.css';

const STORAGE_KEY = 'integrity-rising-member-preferences-v1';

const interestOptions = [
  'Emotional wellness',
  'Healthy relationships & boundaries',
  'Recovery & resilience',
  'Personal growth',
  'Leadership & integrity',
  'Community connection',
  'Practical support',
];

const supportOptions = [
  { value: 'practical-steps', label: 'Practical steps and action plans' },
  { value: 'encouragement', label: 'Encouragement and positive reminders' },
  { value: 'self-paced-learning', label: 'Self-paced learning and education' },
  { value: 'community', label: 'Community connection and shared growth' },
];

function readLocalPreferences() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function cleanPreferences(value = {}) {
  return {
    interests: Array.isArray(value.interests)
      ? value.interests.filter((item) => interestOptions.includes(item))
      : [],
    supportStyle: supportOptions.some((option) => option.value === value.supportStyle)
      ? value.supportStyle
      : 'practical-steps',
    personalGoal: typeof value.personalGoal === 'string' ? value.personalGoal.slice(0, 160) : '',
    savedAt: value.savedAt || '',
  };
}

function MemberPersonalization() {
  const [interests, setInterests] = useState([]);
  const [supportStyle, setSupportStyle] = useState('practical-steps');
  const [personalGoal, setPersonalGoal] = useState('');
  const [message, setMessage] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [saving, setSaving] = useState(false);

  function applyPreferences(value) {
    const preferences = cleanPreferences(value);
    setInterests(preferences.interests);
    setSupportStyle(preferences.supportStyle);
    setPersonalGoal(preferences.personalGoal);
    setSavedAt(preferences.savedAt);
  }

  useEffect(() => {
    applyPreferences(readLocalPreferences() || {});
    if (!isSupabaseConfigured || !supabase) {
      setMessage('Preferences are saved on this device. Sign-in syncing is not configured yet.');
      return undefined;
    }

    let active = true;
    async function loadMemberPreferences(currentUser) {
      if (!active) return;
      setUser(currentUser || null);
      if (!currentUser) {
        setReady(true);
        setMessage('Sign in to keep your preferences with your member account. Your device copy remains available here.');
        return;
      }

      setReady(false);
      setMessage('Loading your member preferences…');
      const { data, error } = await supabase
        .from('member_preferences')
        .select('preferences')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setMessage('We could not load account preferences. Your device copy is still available.');
        setReady(true);
        return;
      }

      if (data?.preferences && Object.keys(data.preferences).length > 0) {
        applyPreferences(data.preferences);
        setMessage('Your preferences were loaded from your member account.');
      } else {
        const local = readLocalPreferences();
        if (local) {
          const migrated = { ...cleanPreferences(local), savedAt: local.savedAt || new Date().toISOString() };
          const { error: saveError } = await supabase.from('member_preferences').upsert({
            user_id: currentUser.id,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago',
            preferences: migrated,
          }, { onConflict: 'user_id' });
          if (!active) return;
          if (saveError) {
            applyPreferences(local);
            setMessage('Your device preferences are available, but could not yet be copied to your member account.');
          } else {
            applyPreferences(migrated);
            setMessage('Your existing device preferences have been copied to your member account.');
          }
        } else {
          applyPreferences({});
          setMessage('Choose your preferences and save them to your member account.');
        }
      }
      setReady(true);
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (active) {
          setMessage('We could not check your sign-in status. Your device preferences remain available.');
          setReady(true);
        }
        return;
      }
      loadMemberPreferences(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadMemberPreferences(session?.user || null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function toggleInterest(interest) {
    setInterests((current) => (
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    ));
    setMessage('');
  }

  async function handleSave(event) {
    event.preventDefault();
    if (saving || !ready) return;
    setSaving(true);
    const preferences = {
      interests,
      supportStyle,
      personalGoal: personalGoal.trim(),
      savedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      if (!user) {
        setMessage('We could not save your preferences in this browser. Check your browser storage settings and try again.');
        setSaving(false);
        return;
      }
    }

    if (user && supabase) {
      const { error } = await supabase.from('member_preferences').upsert({
        user_id: user.id,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago',
        preferences,
      }, { onConflict: 'user_id' });
      if (error) {
        setMessage('Your device copy was saved, but account syncing failed. Please try saving again.');
        setSaving(false);
        return;
      }
      setMessage('Your preferences are saved to your member account and this device.');
    } else {
      setMessage('Your preferences have been saved on this device. Sign in to sync them across devices.');
    }
    setSavedAt(preferences.savedAt);
    setSaving(false);
  }

  async function handleClear() {
    if (saving) return;
    setSaving(true);
    if (user && supabase) {
      const { error } = await supabase.from('member_preferences').delete().eq('user_id', user.id);
      if (error) {
        setMessage('We could not clear your account preferences. Please try again.');
        setSaving(false);
        return;
      }
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      applyPreferences({});
      setMessage(user
        ? 'Your saved preferences have been cleared from your member account and this device.'
        : 'Your saved personalization preferences have been cleared from this device.');
    } catch {
      setMessage('Your account preferences were cleared, but this device could not clear its local copy.');
    }
    setSaving(false);
  }

  return (
    <section className="member-personalization" aria-labelledby="member-personalization-title">
      <div className="personalization-heading">
        <span className="personalization-kicker">MAKE THIS SPACE YOURS</span>
        <h2 id="member-personalization-title">My Personalization Center</h2>
        <p>Choose the areas that matter to you and the kind of support you find most helpful. You can change these choices whenever your needs change.</p>
      </div>

      <form onSubmit={handleSave}>
        <fieldset className="personalization-fieldset">
          <legend>What would you like to focus on?</legend>
          <p className="personalization-help">Choose as many areas as you like.</p>
          <div className="personalization-interest-grid">
            {interestOptions.map((interest) => (
              <label className="personalization-choice" key={interest}>
                <input type="checkbox" checked={interests.includes(interest)} onChange={() => toggleInterest(interest)} />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="personalization-fieldset">
          <legend>What kind of support feels most helpful?</legend>
          <div className="personalization-support-list">
            {supportOptions.map((option) => (
              <label className="personalization-choice" key={option.value}>
                <input
                  type="radio"
                  name="preferred-support-style"
                  value={option.value}
                  checked={supportStyle === option.value}
                  onChange={() => { setSupportStyle(option.value); setMessage(''); }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="personalization-goal">
          <label htmlFor="personalization-goal-input">One thing I would like to work toward (optional)</label>
          <textarea
            id="personalization-goal-input"
            rows={3}
            maxLength={160}
            value={personalGoal}
            onChange={(event) => { setPersonalGoal(event.target.value); setMessage(''); }}
            placeholder="Example: Build a healthier daily routine."
          />
          <span className="personalization-help">{personalGoal.length}/160 characters</span>
        </div>

        <div className="personalization-actions">
          <button type="submit" disabled={!ready || saving}>{saving ? 'Saving…' : 'Save my preferences'}</button>
          <button type="button" className="personalization-clear-button" onClick={handleClear} disabled={saving}>Clear saved preferences</button>
        </div>
      </form>

      {message && <p className="personalization-status" role="status">{message}</p>}
      {savedAt && <p className="personalization-help">Last saved: {new Date(savedAt).toLocaleString()}</p>}

      <p className="personalization-privacy">
        Privacy note: when you are signed in, these choices are stored in your private member account and on this device. Account access is restricted to you. When signed out, they are stored only in this browser on this device. Your display name and short bio can be managed in Member Account above.
      </p>
    </section>
  );
}

export default MemberPersonalization;
