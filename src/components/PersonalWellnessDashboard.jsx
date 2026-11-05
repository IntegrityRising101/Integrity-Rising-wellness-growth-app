import { useMemo, useState } from 'react';
import './PersonalWellnessDashboard.css';

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

function PersonalWellnessDashboard() {
  const [mood, setMood] = useState('');
  const [intention, setIntention] = useState('');
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState(false);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const selectedMood = useMemo(() => moods.find(item => item.value === mood), [mood]);

  function togglePractice(item) {
    setChecked(current => ({ ...current, [item]: !current[item] }));
    setSaved(false);
  }

  function saveCheckIn(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <section className="personal-wellness" aria-labelledby="personal-wellness-title">
      <div className="personal-wellness-header">
        <p className="personal-wellness-eyebrow">YOUR DAILY SPACE</p>
        <h2 id="personal-wellness-title">Personal Wellness Dashboard</h2>
        <p>A gentle place to check in, choose an intention, and recognize small steps forward.</p>
      </div>

      <form className="wellness-checkin-card" onSubmit={saveCheckIn}>
        <h3>How are you feeling right now?</h3>
        <p>There is no right or wrong answer. You can change your selection anytime.</p>
        <div className="wellness-mood-options" role="group" aria-label="Choose your current mood">
          {moods.map(item => (
            <button
              key={item.value}
              type="button"
              className={mood === item.value ? 'wellness-mood-option selected' : 'wellness-mood-option'}
              onClick={() => { setMood(item.value); setSaved(false); }}
              aria-pressed={mood === item.value}
            >
              <span aria-hidden="true">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {selectedMood && <p className="wellness-kind-message" role="status">{selectedMood.message}</p>}

        <label htmlFor="wellness-intention">One thing I want to focus on today</label>
        <textarea
          id="wellness-intention"
          rows="3"
          maxLength="300"
          value={intention}
          onChange={event => { setIntention(event.target.value); setSaved(false); }}
          placeholder="For example: take things one step at a time..."
        />
        <div className="wellness-save-row">
          <span>{intention.length}/300</span>
          <button type="submit" disabled={!mood && !intention.trim()}>Save check-in</button>
        </div>
        {saved && <p className="wellness-saved-message" role="status">Your check-in is saved for this page session. Thank you for taking a moment for yourself.</p>}
      </form>

      <div className="wellness-practice-card">
        <div className="wellness-practice-heading">
          <div>
            <h3>Small steps for today</h3>
            <p>Choose only what feels realistic and comfortable.</p>
          </div>
          <strong>{completedCount}/{practices.length}</strong>
        </div>
        <div className="wellness-practice-progress" aria-label={`${completedCount} of ${practices.length} practices completed`}>
          <span style={{ width: `${(completedCount / practices.length) * 100}%` }} />
        </div>
        <ul>
          {practices.map(item => (
            <li key={item}>
              <label>
                <input type="checkbox" checked={Boolean(checked[item])} onChange={() => togglePractice(item)} />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="wellness-affirmation">
        <span aria-hidden="true">✦</span>
        <p>“I can move forward at my own pace. Small steps still count.”</p>
        <small>Today's reminder from Integrity Rising</small>
      </div>

      <p className="wellness-dashboard-privacy">Privacy note: this dashboard does not send your check-in to a server. Your mood, intention, and checklist are held only in the current page session and clear when you refresh or close the page. Do not enter sensitive identifying details. This tool is for general wellness support, not diagnosis or emergency care.</p>
    </section>
  );
}

export default PersonalWellnessDashboard;
