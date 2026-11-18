import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './MoodTracker.css';

const moods = [
  { label: 'Great', emoji: '😊', color: 'great' },
  { label: 'Good', emoji: '🙂', color: 'good' },
  { label: 'Okay', emoji: '😐', color: 'okay' },
  { label: 'Low', emoji: '😔', color: 'low' },
  { label: 'Overwhelmed', emoji: '😣', color: 'overwhelmed' },
];

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadEntries(id) {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('id, mood, note, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!active) return;

      if (error) {
        setSavedMessage('We could not load your saved check-ins. Please try again later.');
      } else {
        setEntries(data || []);
      }
      setIsLoading(false);
    }

    if (!isSupabaseConfigured || !supabase) {
      setSavedMessage('Mood check-ins are not available until the app is connected to Supabase.');
      setIsLoading(false);
      return () => { active = false; };
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) {
        setUserId(null);
        setSavedMessage('Please sign in to save private mood check-ins to your account.');
        setIsLoading(false);
        return;
      }
      setUserId(data.user.id);
      loadEntries(data.user.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const id = session?.user?.id || null;
      setUserId(id);
      setEntries([]);
      if (id) {
        setIsLoading(true);
        setSavedMessage('');
        loadEntries(id);
      } else {
        setIsLoading(false);
        setSavedMessage('Please sign in to save private mood check-ins to your account.');
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function saveCheckIn(event) {
    event.preventDefault();
    if (!selectedMood || !userId || !supabase || isSaving) return;

    setIsSaving(true);
    setSavedMessage('');

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: userId,
        mood: selectedMood,
        note: note.trim() || null,
      })
      .select('id, mood, note, created_at')
      .single();

    setIsSaving(false);

    if (error) {
      setSavedMessage('Your check-in could not be saved. Please try again.');
      return;
    }

    setEntries((current) => [data, ...current].slice(0, 30));
    setSelectedMood('');
    setNote('');
    setSavedMessage('Your check-in was saved securely to your account.');
  }

  function formatDate(value) {
    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  return (
    <section className="mood-tracker" aria-labelledby="mood-tracker-title">
      <div className="mood-tracker-heading">
        <p className="mood-tracker-kicker">DAILY WELLNESS</p>
        <h2 id="mood-tracker-title">Your Mood Tracker</h2>
        <p>Pause, notice how you feel, and check in with yourself. Every feeling deserves care.</p>
      </div>

      <form onSubmit={saveCheckIn}>
        <fieldset className="mood-choice-group">
          <legend>How are you feeling right now?</legend>
          <div className="mood-choice-grid">
            {moods.map((mood) => (
              <button
                className={`mood-choice ${selectedMood === mood.label ? 'is-selected' : ''}`}
                type="button"
                key={mood.label}
                aria-pressed={selectedMood === mood.label}
                onClick={() => {
                  setSelectedMood(mood.label);
                  setSavedMessage('');
                }}
              >
                <span className="mood-emoji" aria-hidden="true">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mood-note-label" htmlFor="mood-note">
          Optional: What might be affecting your mood?
        </label>
        <textarea
          id="mood-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Write a few words for yourself. Avoid names or identifying details."
          rows="3"
          maxLength="300"
        />
        <button className="mood-save-button" type="submit" disabled={!selectedMood || !userId || isSaving}>
          {isSaving ? 'Saving…' : 'Save check-in'}
        </button>
        {savedMessage && <p className="mood-saved-message" role="status">{savedMessage}</p>}
      </form>

      <div className="mood-history">
        <h3>Your saved check-ins</h3>
        {isLoading ? (
          <p>Loading your check-ins…</p>
        ) : !userId ? (
          <p>Sign in to view your private mood history.</p>
        ) : entries.length === 0 ? (
          <p>Your saved check-ins will appear here. Your first entry is a good place to start.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <strong>{moods.find((mood) => mood.label === entry.mood)?.emoji} {entry.mood}</strong>
                <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
                {entry.note && <p>{entry.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mood-privacy-note">
        Privacy: your check-ins are saved to your signed-in account. Only you can view or delete your entries. This is a wellness tool, not a diagnosis or substitute for professional care.
      </p>
    </section>
  );
}

export default MoodTracker;
