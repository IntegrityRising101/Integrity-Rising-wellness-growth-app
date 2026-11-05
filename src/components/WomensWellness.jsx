import { useState } from 'react';
import './WomensWellness.css';

function WomensWellness() {
  const [tab, setTab] = useState('cycle');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const choices = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Mood changes', 'Hot flashes', 'Night sweats', 'Sleep changes', 'Brain fog'];

  function toggle(item) {
    setSymptoms((old) => old.includes(item) ? old.filter((x) => x !== item) : [...old, item]);
    setSaved(false);
  }

  return (
    <section className="womens-wellness" aria-labelledby="womens-wellness-title">
      <header className="womens-wellness-heading">
        <p className="womens-wellness-kicker">INTEGRITY RISING WELLNESS</p>
        <h2 id="womens-wellness-title">Women's Wellness</h2>
        <p>A supportive space to learn about your body and note changes over time.</p>
      </header>
      <div className="wellness-stage-tabs" role="group" aria-label="Wellness topic">
        <button type="button" className={tab === 'cycle' ? 'active' : ''} onClick={() => setTab('cycle')}>Cycle health</button>
        <button type="button" className={tab === 'menopause' ? 'active' : ''} onClick={() => setTab('menopause')}>Perimenopause & menopause</button>
      </div>
      {tab === 'cycle' ? (
        <div className="women-info-panel">
          <h3>Menstrual cycle notes</h3>
          <p>Cycle timing varies. Recording dates and symptoms may help you discuss changes with a healthcare professional.</p>
          <label htmlFor="last-period">First day of last period (optional)</label>
          <input id="last-period" type="date" value={lastPeriod} onChange={(e) => { setLastPeriod(e.target.value); setSaved(false); }} />
          <label htmlFor="cycle-length">Typical cycle length in days (optional)</label>
          <input id="cycle-length" type="number" min="15" max="60" value={cycleLength} onChange={(e) => { setCycleLength(e.target.value); setSaved(false); }} />
          <p className="women-small-note">This prototype does not predict periods, ovulation, or fertility.</p>
        </div>
      ) : (
        <div className="women-info-panel">
          <h3>Perimenopause & menopause support</h3>
          <p>Perimenopause may involve changes in periods, sleep, mood, and body temperature. Menopause is generally reached after 12 consecutive months without a menstrual period, when there is no other medical cause.</p>
          <p>Experiences differ. A healthcare professional can help assess symptoms and discuss support options.</p>
        </div>
      )}
      <fieldset className="women-symptoms">
        <legend>What have you noticed? (Optional)</legend>
        <div className="women-symptom-grid">
          {choices.map((item) => <label key={item} className={symptoms.includes(item) ? 'checked' : ''}>
            <input type="checkbox" checked={symptoms.includes(item)} onChange={() => toggle(item)} />{item}
          </label>)}
        </div>
      </fieldset>
      <label className="women-notes-label" htmlFor="women-notes">Additional notes (optional)</label>
      <textarea id="women-notes" rows="3" maxLength="400" value={notes} onChange={(e) => { setNotes(e.target.value); setSaved(false); }} placeholder="Note questions or changes to discuss with a clinician." />
      <button className="women-save-button" type="button" onClick={() => setSaved(true)}>Save this check-in</button>
      {saved && <p className="women-saved" role="status">Your check-in is saved for this page session only.</p>}
      <p className="women-privacy-note">Privacy: information stays only in this page session and clears when you refresh or close the page. Nothing is sent to a server. Avoid identifying details. This educational tool does not diagnose or replace medical care. Seek urgent help for severe pain, very heavy bleeding, fainting, chest pain, or other alarming symptoms.</p>
    </section>
  );
}
export default WomensWellness;
