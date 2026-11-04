import { useState } from 'react';

export default function IncidentVault() {
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentType, setIncidentType] = useState('Other');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!notes.trim()) return;

    setEntries((current) => [
      {
        id: `${Date.now()}-${current.length}`,
        date: incidentDate || 'Date not provided',
        type: incidentType,
        notes: notes.trim(),
      },
      ...current,
    ]);

    setIncidentDate('');
    setIncidentType('Other');
    setNotes('');
  }

  function deleteEntry(id) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  return (
    <section className="incident-vault" aria-labelledby="incident-vault-title">
      <h3 id="incident-vault-title">Incident notes</h3>
      <p>
        Use this space to make a temporary note for yourself. You can remove
        an entry at any time.
      </p>

      <div className="vault-notice" role="note">
        <strong>Privacy notice:</strong> These notes stay only in this page's
        current memory and disappear when you refresh, close, or leave the page.
        This is not an encrypted vault or a secure evidence-storage service.
        Avoid entering names, addresses, or details that could put you at risk
        on a shared or monitored device.
      </div>

      <form onSubmit={handleSubmit} className="incident-form">
        <label htmlFor="incident-date">Date (optional)</label>
        <input
          id="incident-date"
          type="date"
          value={incidentDate}
          onChange={(event) => setIncidentDate(event.target.value)}
        />

        <label htmlFor="incident-type">Type of incident</label>
        <select
          id="incident-type"
          value={incidentType}
          onChange={(event) => setIncidentType(event.target.value)}
        >
          <option>Other</option>
          <option>Emotional or verbal abuse</option>
          <option>Threats or intimidation</option>
          <option>Physical harm</option>
          <option>Stalking or monitoring</option>
          <option>Financial control</option>
          <option>Property damage</option>
          <option>Safety concern</option>
        </select>

        <label htmlFor="incident-notes">Notes</label>
        <textarea
          id="incident-notes"
          rows="5"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Write only what is safe for you to record..."
        />

        <button type="submit" disabled={!notes.trim()}>
          Add temporary note
        </button>
      </form>

      <div className="incident-entries" aria-live="polite">
        <h4>Notes in this session ({entries.length})</h4>
        {entries.length === 0 ? (
          <p>No notes added.</p>
        ) : (
          entries.map((entry) => (
            <article className="incident-entry" key={entry.id}>
              <p><strong>{entry.type}</strong> · {entry.date}</p>
              <p className="incident-entry-notes">{entry.notes}</p>
              <button type="button" onClick={() => deleteEntry(entry.id)}>
                Delete note
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
