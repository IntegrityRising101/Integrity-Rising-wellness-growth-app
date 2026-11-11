import { useEffect, useState } from 'react';
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

function MemberPersonalization() {
  const [interests, setInterests] = useState([]);
  const [supportStyle, setSupportStyle] = useState('practical-steps');
  const [personalGoal, setPersonalGoal] = useState('');
  const [message, setMessage] = useState('');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const preferences = JSON.parse(saved);
      if (Array.isArray(preferences.interests)) {
        setInterests(preferences.interests.filter((item) => interestOptions.includes(item)));
      }
      if (supportOptions.some((option) => option.value === preferences.supportStyle)) {
        setSupportStyle(preferences.supportStyle);
      }
      if (typeof preferences.personalGoal === 'string') {
        setPersonalGoal(preferences.personalGoal.slice(0, 160));
      }
      if (preferences.savedAt) setSavedAt(preferences.savedAt);
    } catch {
      setMessage('Your saved preferences could not be read. You can choose them again and save.');
    }
  }, []);

  function toggleInterest(interest) {
    setInterests((current) => (
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    ));
    setMessage('');
  }

  function handleSave(event) {
    event.preventDefault();
    const preferences = {
      interests,
      supportStyle,
      personalGoal: personalGoal.trim(),
      savedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSavedAt(preferences.savedAt);
      setMessage('Your preferences have been saved on this device.');
    } catch {
      setMessage('We could not save your preferences in this browser. Check your browser storage settings and try again.');
    }
  }

  function handleClear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setInterests([]);
      setSupportStyle('practical-steps');
      setPersonalGoal('');
      setSavedAt('');
      setMessage('Your saved personalization preferences have been cleared from this device.');
    } catch {
      setMessage('We could not clear the saved preferences. Please try again.');
    }
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
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
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
                  onChange={() => {
                    setSupportStyle(option.value);
                    setMessage('');
                  }}
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
            onChange={(event) => {
              setPersonalGoal(event.target.value);
              setMessage('');
            }}
            placeholder="Example: Build a healthier daily routine."
          />
          <span className="personalization-help">{personalGoal.length}/160 characters</span>
        </div>

        <div className="personalization-actions">
          <button type="submit">Save my preferences</button>
          <button type="button" className="personalization-clear-button" onClick={handleClear}>Clear saved preferences</button>
        </div>
      </form>

      {message && <p className="personalization-status" role="status">{message}</p>}
      {savedAt && <p className="personalization-help">Last saved: {new Date(savedAt).toLocaleString()}</p>}

      <p className="personalization-privacy">
        Privacy note: these personalization choices are stored only in this browser on this device. They are not added to your member profile, shared with other members, or synced across devices. Your display name and short bio can be managed in Member Account above.
      </p>
    </section>
  );
}

export default MemberPersonalization;
