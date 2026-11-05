import { useState } from 'react';
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
  const [savedMessage, setSavedMessage] = useState('');

  function saveCheckIn(event) {
    event.preventDefault();
    if (!selectedMood) return;

    const entry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toLocaleString(),
    };

    setEntries((current) => [entry, ...current]);
    setSelectedMood('');
    setNote('');
    setSavedMessage('Your check-in has been added to this session.');
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
        <button className="mood-save-button" type="submit" disabled={!selectedMood}>
          Save check-in
        </button>
        {savedMessage && <p className="mood-saved-message" role="status">{savedMessage}</p>}
      </form>

      <div className="mood-history">
        <h3>Check-ins this session ({entries.length})</h3>
        {entries.length === 0 ? (
          <p>Your check-ins will appear here while this page stays open.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <strong>{moods.find((mood) => mood.label === entry.mood)?.emoji} {entry.mood}</strong>
                <time>{entry.date}</time>
                {entry.note && <p>{entry.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mood-privacy-note">
        Privacy note: check-ins are kept only in this page session and are cleared when you refresh or close the page. This prototype does not send them to a server. It is a wellness tool, not a diagnosis or substitute for professional care.
      </p>
    </section>
  );
}

export default MoodTracker;
