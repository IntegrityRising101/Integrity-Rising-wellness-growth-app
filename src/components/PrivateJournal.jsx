import { useState } from 'react';
import './PrivateJournal.css';

const STORAGE_KEY = 'integrity-rising-private-journal-v1';

function readEntries() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(entry => entry && entry.id && entry.body) : [];
  } catch {
    return [];
  }
}

function localDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function PrivateJournal() {
  const [entries, setEntries] = useState(readEntries);
  const [date, setDate] = useState(localDate());
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  function persist(next) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setEntries(next);
      setMessage('Entry saved on this device.');
    } catch {
      setMessage('Could not save. Please check device storage and try again.');
    }
  }

  function saveEntry(event) {
    event.preventDefault();
    if (!body.trim()) return;
    const entry = { id: editingId || String(Date.now()), date, title: title.trim() || 'Journal Entry', mood, body: body.trim() };
    const next = [entry, ...entries.filter(item => item.id !== entry.id)].sort((a, b) => b.date.localeCompare(a.date));
    persist(next);
    setEditingId(null);
    setTitle('');
    setMood('');
    setBody('');
  }

  function editEntry(entry) {
    setEditingId(entry.id);
    setDate(entry.date);
    setTitle(entry.title || '');
    setMood(entry.mood || '');
    setBody(entry.body || '');
    setMessage('Editing a saved entry. Save changes when you are ready.');
    document.getElementById('private-journal-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteEntry(id) {
    if (!window.confirm('Delete this journal entry from this device?')) return;
    persist(entries.filter(entry => entry.id !== id));
    if (editingId === id) resetForm();
  }

  function resetForm() {
    setEditingId(null);
    setDate(localDate());
    setTitle('');
    setMood('');
    setBody('');
    setMessage('');
  }

  return (
    <section className="private-journal" aria-labelledby="private-journal-title">
      <header className="private-journal-header">
        <p className="private-journal-kicker">A SPACE THAT BELONGS TO YOU</p>
        <h2 id="private-journal-title">My Private Journal</h2>
        <p>Write freely, sort through your thoughts, or capture a moment from your day. You can write as much—or as little—as you need.</p>
      </header>

      <form id="private-journal-editor" className="private-journal-editor" onSubmit={saveEntry}>
        <label htmlFor="private-journal-date">Date</label>
        <input id="private-journal-date" type="date" max={localDate()} value={date} onChange={e => setDate(e.target.value)} required />
        <label htmlFor="private-journal-title-input">Entry title (optional)</label>
        <input id="private-journal-title-input" type="text" maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="Give today's entry a title" />
        <label htmlFor="private-journal-mood">How are you feeling? (optional)</label>
        <select id="private-journal-mood" value={mood} onChange={e => setMood(e.target.value)}>
          <option value="">Choose a mood (optional)</option>
          <option>Calm</option><option>Hopeful</option><option>Grateful</option><option>Happy</option><option>Motivated</option><option>Okay</option><option>Overwhelmed</option><option>Sad</option><option>Anxious</option><option>Angry</option><option>Not sure</option>
        </select>
        <label htmlFor="private-journal-body">Your thoughts</label>
        <textarea id="private-journal-body" rows="8" maxLength={5000} value={body} onChange={e => setBody(e.target.value)} placeholder="This is your space. Start wherever you are…" />
        <div className="private-journal-editor-footer">
          <small>{body.length}/5000 characters</small>
          <div className="private-journal-actions">
            {editingId && <button type="button" className="private-journal-secondary" onClick={resetForm}>Cancel edit</button>}
            <button type="submit" disabled={!body.trim()}>{editingId ? 'Save changes' : 'Save entry'}</button>
          </div>
        </div>
        {message && <p className="private-journal-status" role="status">{message}</p>}
      </form>

      <div className="private-journal-entries">
        <div className="private-journal-entries-heading"><h3>Your saved entries</h3><span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span></div>
        {entries.length === 0 ? <p className="private-journal-empty">Your entries will appear here after you save your first note.</p> : (
          <ul>
            {entries.map(entry => <li key={entry.id}>
              <div className="private-journal-entry-top">
                <div><strong>{new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong><h4>{entry.title || 'Journal Entry'}</h4>{entry.mood && <span className="private-journal-mood">Mood: {entry.mood}</span>}</div>
                <div className="private-journal-entry-buttons"><button type="button" onClick={() => editEntry(entry)}>Edit</button><button type="button" onClick={() => deleteEntry(entry.id)}>Delete</button></div>
              </div>
              <p className="private-journal-entry-body">{entry.body}</p>
            </li>)}
          </ul>
        )}
      </div>
      <p className="private-journal-privacy"><strong>Privacy note:</strong> Entries are stored only in this browser on this device. They are not sent to Integrity Rising or synced to your account. This journal is not password-protected; anyone who can access your browser profile may be able to read it. Avoid storing identifying details or highly sensitive information, and use a safer device if privacy is a concern.</p>
    </section>
  );
}
