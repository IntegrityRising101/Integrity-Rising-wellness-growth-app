import { useEffect, useState } from 'react';
import './GratitudeJournal.css';

const STORAGE_KEY = 'integrity-rising-gratitude-journal-v1';

function getLocalDate() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function readEntries() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter(entry => entry && typeof entry.id === 'string' && typeof entry.date === 'string')
      : [];
  } catch {
    return [];
  }
}

function GratitudeJournal() {
  const [entries, setEntries] = useState(readEntries);
  const [date, setDate] = useState(getLocalDate);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [entries]);

  function saveEntry(event) {
    event.preventDefault();
    const answers = [first, second, third].map(value => value.trim());
    if (!answers.some(Boolean)) return;
    const entry = {
      id: `${date}-${Date.now()}`,
      date,
      answers
    };
    setEntries(current => [entry, ...current.filter(item => item.date !== date)]
      .sort((a, b) => b.date.localeCompare(a.date)));
    setSavedMessage('Your gratitude entry has been saved on this device.');
  }

  function deleteEntry(id) {
    setEntries(current => current.filter(entry => entry.id !== id));
  }

  function loadEntry(entry) {
    setDate(entry.date);
    setFirst(entry.answers?.[0] || '');
    setSecond(entry.answers?.[1] || '');
    setThird(entry.answers?.[2] || '');
    setSavedMessage('You are viewing this saved entry. Save again to update it.');
  }

  return (
    <section className="gratitude-journal" aria-labelledby="gratitude-journal-title">
      <div className="gratitude-journal-heading">
        <p className="gratitude-journal-kicker">NOTICE THE GOOD • HONOR YOUR JOURNEY</p>
        <h2 id="gratitude-journal-title">My Gratitude Journal</h2>
        <p>A few quiet moments to notice what matters. Gratitude does not mean every day is easy; it means making room to recognize the good alongside everything else.</p>
      </div>

      <form className="gratitude-entry-form" onSubmit={saveEntry}>
        <label htmlFor="gratitude-date">Journal date</label>
        <input id="gratitude-date" type="date" value={date} max={getLocalDate()} onChange={event => { setDate(event.target.value); setSavedMessage(''); }} required />
        <label htmlFor="gratitude-one">1. What is one thing you are grateful for today?</label>
        <textarea id="gratitude-one" rows="2" maxLength="500" value={first} onChange={event => { setFirst(event.target.value); setSavedMessage(''); }} placeholder="It can be something big or something small..." />
        <label htmlFor="gratitude-two">2. Who or what helped you feel supported?</label>
        <textarea id="gratitude-two" rows="2" maxLength="500" value={second} onChange={event => { setSecond(event.target.value); setSavedMessage(''); }} placeholder="A person, a kind moment, a resource, or your own effort..." />
        <label htmlFor="gratitude-three">3. What is something about yourself you appreciate?</label>
        <textarea id="gratitude-three" rows="2" maxLength="500" value={third} onChange={event => { setThird(event.target.value); setSavedMessage(''); }} placeholder="A strength, choice, boundary, or step forward..." />
        <div className="gratitude-form-footer">
          <span>{first.length + second.length + third.length}/1500 characters</span>
          <button type="submit" disabled={!first.trim() && !second.trim() && !third.trim()}>Save journal entry</button>
        </div>
        {savedMessage && <p className="gratitude-saved-message" role="status">{savedMessage}</p>}
        {storageError && <p className="gratitude-error" role="alert">Your browser could not save this entry. Check available device storage and try again.</p>}
      </form>

      <div className="gratitude-history">
        <div className="gratitude-history-heading">
          <div><h3>My gratitude memories</h3><p>Revisit the moments you chose to remember.</p></div>
          <strong>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</strong>
        </div>
        {entries.length === 0 ? (
          <p className="gratitude-empty">Your saved entries will appear here. Start with one thing, no matter how small.</p>
        ) : (
          <ul>
            {entries.map(entry => (
              <li key={entry.id}>
                <div className="gratitude-entry-top">
                  <strong>{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                  <div><button type="button" onClick={() => loadEntry(entry)}>View / edit</button><button type="button" className="gratitude-delete" onClick={() => deleteEntry(entry.id)} aria-label={`Delete entry from ${entry.date}`}>Delete</button></div>
                </div>
                {(entry.answers || []).map((answer, index) => answer && <p key={index}><span>{['Grateful for', 'Support', 'I appreciate'][index]}:</span> {answer}</p>)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="gratitude-reminder"><span aria-hidden="true">✦</span><p>“I can honor the hard days and still notice the moments that give me hope.”</p><small>Learn • Grow • Heal • Rise</small></div>
      <p className="gratitude-privacy">Privacy: journal entries are saved only in this browser on this device. They are not sent to Integrity Rising or synced across devices. Anyone with access to this browser profile may be able to view them. Avoid entering identifying or highly sensitive details, especially on a shared device.</p>
    </section>
  );
}

export default GratitudeJournal;
