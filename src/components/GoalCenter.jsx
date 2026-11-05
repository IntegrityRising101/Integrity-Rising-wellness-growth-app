import { useEffect, useMemo, useState } from 'react';
import './GoalCenter.css';

const STORAGE_KEY = 'integrity-rising-goal-center-v1';

function readGoals() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function GoalCenter() {
  const [goals, setGoals] = useState(readGoals);
  const [title, setTitle] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // The goal tracker remains usable for this page session if storage is unavailable.
    }
  }, [goals]);

  const completed = useMemo(() => goals.filter(goal => goal.done).length, [goals]);

  function addGoal(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setGoals(current => [...current, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      nextStep: nextStep.trim(),
      targetDate,
      done: false,
      createdAt: new Date().toISOString().slice(0, 10)
    }]);
    setTitle('');
    setNextStep('');
    setTargetDate('');
  }

  function toggleGoal(id) {
    setGoals(current => current.map(goal => goal.id === id ? { ...goal, done: !goal.done } : goal));
  }

  function removeGoal(id) {
    setGoals(current => current.filter(goal => goal.id !== id));
  }

  return (
    <section className="goal-center" aria-labelledby="goal-center-title">
      <div className="goal-center-heading">
        <p className="goal-center-kicker">PLAN • TAKE ACTION • GROW</p>
        <h2 id="goal-center-title">My Goal Center</h2>
        <p>Turn a big goal into one small, reachable next step. Progress is personal — steady counts.</p>
      </div>

      <div className="goal-center-summary">
        <div><strong>{goals.length}</strong><span>Goals created</span></div>
        <div><strong>{completed}</strong><span>Goals completed</span></div>
        <div><strong>{goals.length ? Math.round((completed / goals.length) * 100) : 0}%</strong><span>Completion</span></div>
      </div>
      <div className="goal-center-progress" role="progressbar" aria-label="Overall goal completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={goals.length ? Math.round((completed / goals.length) * 100) : 0}>
        <span style={{ width: `${goals.length ? (completed / goals.length) * 100 : 0}%` }} />
      </div>

      <form className="goal-center-form" onSubmit={addGoal}>
        <h3>Add a goal</h3>
        <label htmlFor="goal-title">What would you like to work toward?</label>
        <input id="goal-title" value={title} onChange={event => setTitle(event.target.value)} maxLength="100" placeholder="Example: Build a consistent morning routine" required />
        <label htmlFor="goal-next-step">One small next step</label>
        <input id="goal-next-step" value={nextStep} onChange={event => setNextStep(event.target.value)} maxLength="180" placeholder="Example: Set out what I need the night before" />
        <label htmlFor="goal-date">Target date (optional)</label>
        <input id="goal-date" type="date" value={targetDate} onChange={event => setTargetDate(event.target.value)} />
        <button type="submit">＋ Add my goal</button>
      </form>

      <div className="goal-center-list">
        <div className="goal-center-list-heading">
          <h3>My goals and next steps</h3>
          <span>{goals.length} total</span>
        </div>
        {goals.length === 0 ? (
          <p className="goal-center-empty">Your goals will appear here. Start with one that matters to you, then choose a first step small enough to begin.</p>
        ) : goals.map(goal => (
          <article className={goal.done ? 'goal-card goal-card-done' : 'goal-card'} key={goal.id}>
            <div className="goal-card-top">
              <label className="goal-card-check">
                <input type="checkbox" checked={goal.done} onChange={() => toggleGoal(goal.id)} />
                <span>{goal.title}</span>
              </label>
              <button type="button" className="goal-remove" onClick={() => removeGoal(goal.id)} aria-label={`Remove goal: ${goal.title}`}>Remove</button>
            </div>
            {goal.nextStep && <p><strong>Next step:</strong> {goal.nextStep}</p>}
            <div className="goal-card-meta">
              <span>Started {goal.createdAt}</span>
              {goal.targetDate && <span>Target {goal.targetDate}</span>}
              <span>{goal.done ? 'Completed' : 'In progress'}</span>
            </div>
            <div className="goal-card-progress" aria-label={goal.done ? 'Goal complete' : 'Goal not yet complete'}>
              <span style={{ width: goal.done ? '100%' : '0%' }} />
            </div>
            {!goal.done && <p className="goal-growth-tip">Make it reachable: break this goal into a step that takes 10–15 minutes or less.</p>}
          </article>
        ))}
      </div>
      <p className="goal-center-privacy">Your goals are saved in this browser on this device. They are not synced to an account or server. Avoid entering sensitive personal details, especially on a shared device.</p>
    </section>
  );
}

export default GoalCenter;
