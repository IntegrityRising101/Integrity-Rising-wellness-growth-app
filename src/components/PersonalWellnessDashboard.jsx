import { useEffect, useMemo, useState } from 'react';
import './PersonalWellnessDashboard.css';

const STORAGE_KEY = 'integrity-rising-wellness-checkins';

const moods = [
  { value: 'great', label: 'Great', emoji: '🌞', message: 'Enjoy what is going well. You deserve to notice the good.' },
  { value: 'good', label: 'Good', emoji: '🌿', message: 'Build on what is helping you feel steady today.' },
  { value: 'okay', label: 'Okay', emoji: '🌤️', message: 'You do not have to solve everything today. One step is enough.' },
  { value: 'low', label: 'Low', emoji: '🌧️', message: 'Be gentle with yourself. Rest and reaching out are meaningful steps.' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '💛', message: 'Pause if you can. Focus on one small, manageable thing at a time.' }
];

const practices = [
  'Drink some water',
  'Take a few comfortable, steady breaths',
  'Eat something nourishing if available',
  'Step outside or stretch if it feels safe and comfortable',
  'Connect with someone supportive'
];

function getToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function readHistory() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.date === 'string') : [];
  } catch {
    return [];
  }
}

function PersonalWellnessDashboard() {
  const [history, setHistory] = useState(readHistory);
  const [mood, setMood] = useState('');
  const [stress, setStress] = useState('3');
  const [energy, setEnergy] = useState('3');
  const [intention, setIntention] = useState('');
  const [note, setNote] = useState('');
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState(false);
  const [storageError, setStorageError] = useState(false);

  const today = getToday();
  const completedCount = Object.values(checked).filter(Boolean).length;
  const selectedMood = useMemo(() => moods.find(item => item.value === mood), [mood]);
  const recentHistory = useMemo(() => [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7), [history]);

  useEffect(() => {
    const todayEntry = history.find(item => item.date === today);
    if (todayEntry) {
      setMood(todayEntry.mood || '');
      setStress(String(todayEntry.stress ?? 3));
      setEnergy(String(todayEntry.energy ?? 3));
      setIntention(todayEntry.intention || '');
      setNote(todayEntry.note || '');
      setSaved(true);
    }
  }, []);

  function togglePractice(item) {
    setChecked(current => ({ ...current, [item]: !current[item] }));
  }

  function saveCheckIn(event) {
    event.preventDefault();
    if (!mood) return;
    const entry = {
      date: today,
      mood,
      stress: Number(stress),
      energy: Number(energy),
      intention: intention.trim(),
      note: note.trim()
    };
    const updated = [entry, ...history.filter(item => item.date !== today)]
      .sort((a, b) => b.date.localeCompare(a.date));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setHistory(updated);
      setSaved(true);
      setStorageError(false);
    } catch {
      setStorageError(true);
      setSaved(false);
    }
  }

  function clearHistory() {
    if (!window.confirm('Delete all saved wellness check-ins from this browser? This cannot be undone.')) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      setMood('');
      setStress('3');
      setEnergy('3');
      setIntention('');
      setNote('');
      setSaved(false);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  return (
    <section className="personal-wellness" aria-labelledby="personal-wellness-title">
      <div className="personal-wellness-header">
        <p className="personal-wellness-eyebrow">YOUR DAILY SPACE</p>
        <h2 id="personal-wellness-title">Personal Wellness Dashboard</h2>
        <p>A gentle place to check in, choose an intention, and recognize small steps forward.</p>
      </div>

      <div className="dashboard-quick-actions" aria-label="Dashboard shortcuts">
        <a href="#wellness" className="dashboard-action-card"><span className="dashboard-action-icon" aria-hidden="true">✦</span><span><strong>Wellness & AI</strong><small>Explore guided support</small></span><span className="dashboard-action-arrow" aria-hidden="true">→</span></a>
        <a href="#community" className="dashboard-action-card"><span className="dashboard-action-icon" aria-hidden="true">♡</span><span><strong>Community</strong><small>Connect with others</small></span><span className="dashboard-action-arrow" aria-hidden="true">→</span></a>
        <a href="#academy" className="dashboard-action-card"><span className="dashboard-action-icon" aria-hidden="true">▤</span><span><strong>Academy</strong><small>Learn at your pace</small></span><span className="dashboard-action-arrow" aria-hidden="true">→</span></a>
        <a href="#safety" className="dashboard-action-card"><span className="dashboard-action-icon" aria-hidden="true">⌂</span><span><strong>Safety & Support</strong><small>Find practical resources</small></span><span className="dashboard-action-arrow" aria-hidden="true">→</span></a>
      </div>

      <form className="wellness-checkin-card" onSubmit={saveCheckIn}>
        <h3>Daily Wellness Check-In</h3>
        <p>Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}. There is no right or wrong answer.</p>
        <fieldset className="wellness-fieldset">
          <legend>How are you feeling today?</legend>
          <div className="wellness-mood-options" role="group" aria-label="Choose your current mood">
            {moods.map(item => <button key={item.value} type="button" className={mood === item.value ? 'wellness-mood-option selected' : 'wellness-mood-option'} onClick={() => { setMood(item.value); setSaved(false); }} aria-pressed={mood === item.value}><span aria-hidden="true">{item.emoji}</span><span>{item.label}</span></button>)}
          </div>
        </fieldset>
        {selectedMood && <p className="wellness-kind-message" role="status">{selectedMood.message}</p>}

        <div className="wellness-rating-grid">
          <label htmlFor="wellness-stress">Stress level <strong>{stress}/5</strong><input id="wellness-stress" type="range" min="1" max="5" value={stress} onChange={event => { setStress(event.target.value); setSaved(false); }} /><small>1 = very low · 5 = very high</small></label>
          <label htmlFor="wellness-energy">Energy level <strong>{energy}/5</strong><input id="wellness-energy" type="range" min="1" max="5" value={energy} onChange={event => { setEnergy(event.target.value); setSaved(false); }} /><small>1 = very low · 5 = very high</small></label>
        </div>

        <label htmlFor="wellness-intention">One thing I want to focus on today</label>
        <textarea id="wellness-intention" rows="2" maxLength="300" value={intention} onChange={event => { setIntention(event.target.value); setSaved(false); }} placeholder="For example: take things one step at a time..." />
        <label htmlFor="wellness-note">A note about my day (optional)</label>
        <textarea id="wellness-note" rows="3" maxLength="600" value={note} onChange={event => { setNote(event.target.value); setSaved(false); }} placeholder="Write anything you would like to remember about today..." />
        <div className="wellness-save-row"><span>{intention.length}/300 · {note.length}/600</span><button type="submit" disabled={!mood}>Save today's check-in</button></div>
        {saved && <div className="wellness-saved-summary" role="status" aria-live="polite"><div className="wellness-saved-summary-heading"><span aria-hidden="true">✓</span><strong>Today's check-in is saved on this device</strong></div><p><strong>Feeling:</strong> {selectedMood?.emoji} {selectedMood?.label}</p><p><strong>Stress:</strong> {stress}/5 · <strong>Energy:</strong> {energy}/5</p></div>}
        {storageError && <p className="wellness-storage-error" role="alert">Your browser could not save this check-in. Check available device storage and try again.</p>}
      </form>

      <div className="wellness-practice-card">
        <div className="wellness-practice-heading"><div><h3>Small steps for today</h3><p>Choose only what feels realistic and comfortable.</p></div><strong>{completedCount}/{practices.length}</strong></div>
        <div className="wellness-practice-progress" aria-label={`${completedCount} of ${practices.length} practices completed`}><span style={{ width: `${(completedCount / practices.length) * 100}%` }} /></div>
        <ul>{practices.map(item => <li key={item}><label><input type="checkbox" checked={Boolean(checked[item])} onChange={() => togglePractice(item)} /><span>{item}</span></label></li>)}</ul>
      </div>

      <div className="wellness-history-card">
        <div className="wellness-practice-heading"><div><h3>My recent check-ins</h3><p>Your latest seven saved entries on this device.</p></div><strong>{history.length} saved</strong></div>
        {recentHistory.length ? <ul className="wellness-history-list">{recentHistory.map(entry => { const entryMood = moods.find(item => item.value === entry.mood); return <li key={entry.date}><div><strong>{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><span>{entryMood?.emoji} {entryMood?.label || 'Check-in'}</span></div><small>Stress {entry.stress ?? '—'}/5 · Energy {entry.energy ?? '—'}/5</small>{entry.intention && <p>{entry.intention}</p>}</li>; })}</ul> : <p className="wellness-history-empty">Your saved check-ins will appear here after your first entry.</p>}
        {history.length > 0 && <button type="button" className="wellness-clear-history" onClick={clearHistory}>Clear my saved check-ins</button>}
      </div>

      <div className="wellness-affirmation"><span aria-hidden="true">✦</span><p>“I can move forward at my own pace. Small steps still count.”</p><small>Today's reminder from Integrity Rising</small></div>
      <p className="wellness-dashboard-privacy">Privacy: check-ins are stored only in this browser on this device. They are not sent to Integrity Rising or synced across devices. Anyone with access to this browser profile may be able to view them. Avoid entering identifying or highly sensitive details, especially on a shared device. This tool is for general wellness support, not diagnosis or emergency care.</p>
    </section>
  );
}

export default PersonalWellnessDashboard;
