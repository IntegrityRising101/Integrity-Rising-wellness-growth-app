import { useEffect, useState } from 'react';
import './AchievementCenter.css';

const STORAGE_KEY = 'integrity-rising-achievements-v1';
const today = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
};
const starterMilestones = [
  { id: 'first-step', title: 'I took my first step', detail: 'I began working toward something that matters to me.', category: 'Personal growth' },
  { id: 'showed-up', title: 'I showed up for myself', detail: 'I made time for my well-being, even in a small way.', category: 'Wellness' },
  { id: 'kept-going', title: 'I kept going', detail: 'I continued after a difficult day or setback.', category: 'Resilience' },
];

function readItems() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterMilestones.map(item => ({ ...item, done: false, completedAt: null }));
  } catch {
    return starterMilestones.map(item => ({ ...item, done: false, completedAt: null }));
  }
}

export default function AchievementCenter() {
  const [items, setItems] = useState(readItems);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal growth');

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* usable for this session */ }
  }, [items]);

  const completed = items.filter(item => item.done).length;
  const badges = [
    { count: 1, title: 'First Win', detail: 'You recognized a meaningful step.' },
    { count: 3, title: 'Momentum Builder', detail: 'Three milestones celebrated.' },
    { count: 5, title: 'Steady Riser', detail: 'Five moments of progress recorded.' },
    { count: 10, title: 'Legacy in Motion', detail: 'Ten milestones added to your journey.' },
  ];

  function toggleItem(id) {
    setItems(current => current.map(item => item.id === id
      ? { ...item, done: !item.done, completedAt: item.done ? null : today() }
      : item));
  }

  function addMilestone(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setItems(current => [...current, {
      id: `milestone-${Date.now()}`,
      title: title.trim(),
      detail: 'A personal achievement worth recognizing.',
      category,
      done: false,
      completedAt: null
    }]);
    setTitle('');
  }

  function removeItem(id) {
    setItems(current => current.filter(item => item.id !== id));
  }

  return (
    <section className="achievement-center" aria-labelledby="achievement-center-title">
      <div className="achievement-heading">
        <p className="achievement-kicker">NOTICE YOUR PROGRESS • CELEBRATE YOUR GROWTH</p>
        <h2 id="achievement-center-title">Achievement &amp; Milestone Center</h2>
        <p>Progress is not always loud or visible. Give yourself credit for the steps you choose to take.</p>
      </div>

      <div className="achievement-summary">
        <div><strong>{completed}</strong><span>Milestones achieved</span></div>
        <div><strong>{items.length}</strong><span>Milestones recorded</span></div>
      </div>

      <div className="achievement-badges" aria-label="Achievement badges">
        {badges.map(badge => {
          const unlocked = completed >= badge.count;
          return (
            <article className={unlocked ? 'achievement-badge unlocked' : 'achievement-badge'} key={badge.title}>
              <span className="achievement-badge-symbol" aria-hidden="true">{unlocked ? '★' : '☆'}</span>
              <div><h3>{badge.title}</h3><p>{badge.detail}</p><small>{unlocked ? 'Unlocked' : `${badge.count - completed} more to unlock`}</small></div>
            </article>
          );
        })}
      </div>

      <form className="achievement-form" onSubmit={addMilestone}>
        <h3>Add a personal milestone</h3>
        <label htmlFor="achievement-title">What would you like to recognize?</label>
        <input id="achievement-title" value={title} onChange={event => setTitle(event.target.value)} maxLength="100" placeholder="Example: I asked for the support I needed" required />
        <label htmlFor="achievement-category">Category</label>
        <select id="achievement-category" value={category} onChange={event => setCategory(event.target.value)}>
          <option>Personal growth</option><option>Wellness</option><option>Resilience</option><option>Relationships</option><option>Learning</option><option>Community</option><option>Other</option>
        </select>
        <button type="submit">＋ Add milestone</button>
      </form>

      <div className="achievement-list">
        <div className="achievement-list-heading"><h3>My milestones</h3><span>{completed} celebrated</span></div>
        {items.length === 0 ? <p className="achievement-empty">Your milestones will appear here. Start by recording one moment of progress.</p> : items.map(item => (
          <article className={item.done ? 'achievement-item achievement-item-done' : 'achievement-item'} key={item.id}>
            <label><input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} /><span><strong>{item.title}</strong><small>{item.category}{item.completedAt ? ` • Achieved ${item.completedAt}` : ''}</small></span></label>
            <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
          </article>
        ))}
      </div>

      <p className="achievement-privacy">Your milestones are saved in this browser on this device only. They are not synced to an account or server. Avoid adding sensitive personal details on a shared device.</p>
    </section>
  );
}
