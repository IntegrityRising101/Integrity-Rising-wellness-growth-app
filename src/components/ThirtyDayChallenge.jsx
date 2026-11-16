import { useEffect, useMemo, useState } from 'react';
import './ThirtyDayChallenge.css';

const STORAGE_KEY = 'integrity-rising-30-day-challenge-v1';
const days = [
  ['Start where you are', 'Write one honest sentence about what you want more of in your life.'],
  ['Name your values', 'Choose three values you want your choices to reflect.'],
  ['Keep one promise', 'Choose one small promise you can realistically keep today.'],
  ['Notice your strengths', 'Name one strength you have used during a difficult time.'],
  ['Make room to pause', 'Take five quiet minutes to pause, breathe comfortably, or sit in stillness.'],
  ['Choose supportive words', 'Replace one harsh thought with a fairer, kinder statement.'],
  ['Review your first week', 'Notice one thing you learned and one step you want to continue.'],
  ['Practice a healthy boundary', 'Identify one limit that supports your wellbeing.'],
  ['Ask for support', 'Think of one safe person, service, or resource you could reach out to.'],
  ['Create a steady routine', 'Choose one small routine that could make your day easier.'],
  ['Move at your pace', 'Break one challenging task into a first step that takes 10 minutes or less.'],
  ['Make a values-led choice', 'Choose one action today that reflects what matters most to you.'],
  ['Notice what drains you', 'Identify one avoidable stressor and one adjustment within your control.'],
  ['Celebrate the effort', 'Recognize one effort you made, even if the result was not perfect.'],
  ['Review your second week', 'Write down one boundary, habit, or choice that helped you.'],
  ['Practice listening', 'Give someone your attention, or listen to your own needs without judgment.'],
  ['Learn something useful', 'Spend ten minutes learning a skill or idea that supports your growth.'],
  ['Make a repair if needed', 'If appropriate and safe, consider one constructive step to take responsibility.'],
  ['Choose a healthy reset', 'Try music, journaling, stretching, fresh air, or another supportive activity.'],
  ['Protect your energy', 'Decide what can wait and give yourself permission to focus on one priority.'],
  ['Notice your progress', 'Compare how you feel now with where you began, without judging either point.'],
  ['Practice gratitude', 'Name one thing, person, or moment you appreciate today.'],
  ['Strengthen connection', 'Take one small step toward a healthy, respectful connection.'],
  ['Plan for a hard day', 'Write down one coping action and one support option for a difficult moment.'],
  ['Review your third week', 'Name a lesson you want to carry into the final week.'],
  ['Choose your next goal', 'Set one realistic goal for the next month.'],
  ['Make the next step clear', 'Write the first action, when you will do it, and what could help.'],
  ['Give yourself credit', 'Name three ways you have shown effort, courage, or persistence.'],
  ['Define your legacy', 'Write one sentence about the kind of impact you want your choices to have.'],
  ['Celebrate and continue', 'Recognize completing this challenge. Choose one practice to keep using.']
];

function localDateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function readChallenge() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    return saved && typeof saved.startDate === 'string' && saved.completed && typeof saved.completed === 'object'
      ? saved : null;
  } catch {
    return null;
  }
}

export default function ThirtyDayChallenge() {
  const [challenge, setChallenge] = useState(readChallenge);
  const [expandedDay, setExpandedDay] = useState(0);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    if (!challenge) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(challenge));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [challenge]);

  const dayNumber = useMemo(() => {
    if (!challenge) return 1;
    const start = new Date(`${challenge.startDate}T12:00:00`);
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return Math.min(30, Math.max(1, Math.floor((now - start) / 86400000) + 1));
  }, [challenge]);

  const completedCount = challenge ? Object.values(challenge.completed).filter(Boolean).length : 0;
  const percent = Math.round((completedCount / 30) * 100);

  function startChallenge() {
    setChallenge({ startDate: localDateKey(new Date()), completed: {} });
    setExpandedDay(0);
  }

  function toggleDay(index) {
    if (!challenge) return;
    setChallenge(current => ({
      ...current,
      completed: { ...current.completed, [index]: !current.completed[index] }
    }));
  }

  function resetChallenge() {
    if (!window.confirm('Start the 30-day challenge over? Your current challenge progress on this device will be replaced.')) return;
    startChallenge();
  }

  return (
    <section className="thirty-day-challenge" aria-labelledby="thirty-day-challenge-title">
      <div className="thirty-day-heading">
        <p className="thirty-day-kicker">SMALL STEPS • LASTING CHANGE</p>
        <h2 id="thirty-day-challenge-title">30-Day Integrity Growth Challenge</h2>
        <p>Thirty practical actions to help you build self-awareness, healthy habits, confidence, and purpose. Go at your own pace. You can skip or adapt any activity.</p>
      </div>

      {!challenge ? (
        <div className="thirty-day-start">
          <strong>Your next chapter can begin with one small step.</strong>
          <p>Start when you are ready. Your progress will be saved in this browser on this device.</p>
          <button type="button" onClick={startChallenge}>Start my 30-day challenge</button>
        </div>
      ) : (
        <>
          <div className="thirty-day-summary">
            <div><strong>{completedCount}/30</strong><span>actions completed</span></div>
            <div><strong>Day {dayNumber}</strong><span>of your challenge</span></div>
            <div><strong>{percent}%</strong><span>overall progress</span></div>
          </div>
          <div className="thirty-day-progress" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label="30-day challenge progress">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="thirty-day-current">Today's suggested action: <strong>Day {dayNumber} — {days[dayNumber - 1][0]}</strong></p>
          <div className="thirty-day-list">
            {days.map((day, index) => {
              const done = Boolean(challenge.completed[index]);
              const open = expandedDay === index;
              return (
                <article className={done ? 'thirty-day-item is-done' : 'thirty-day-item'} key={day[0]}>
                  <button type="button" className="thirty-day-toggle" onClick={() => setExpandedDay(open ? -1 : index)} aria-expanded={open}>
                    <span className="thirty-day-number">{done ? '✓' : index + 1}</span>
                    <span className="thirty-day-title">{day[0]}</span>
                    <span className="thirty-day-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <div className="thirty-day-detail">
                      <p>{day[1]}</p>
                      <button type="button" onClick={() => toggleDay(index)}>{done ? 'Mark as not complete' : 'Mark this action complete'}</button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {completedCount === 30 && <p className="thirty-day-finished" role="status">You completed all 30 actions. Celebrate the effort you put into your growth! You can keep revisiting these practices or start again when you choose.</p>}
          <button type="button" className="thirty-day-reset" onClick={resetChallenge}>Restart challenge</button>
        </>
      )}
      <p className="thirty-day-privacy">Privacy: challenge progress is stored locally in this browser only. It is not synced to your member account. Avoid entering sensitive personal details.</p>
      {storageWarning && <p className="thirty-day-warning" role="status">Your browser could not save this change. Progress may be lost if you close this page.</p>}
    </section>
  );
}
