import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
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
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [status, setStatus] = useState('');
  const [legacyAvailable, setLegacyAvailable] = useState(false);

  useEffect(() => {
    if (!user) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* usable for this session */ }
    }
  }, [items, user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setLoading(false); return undefined; }
    let active = true;
    async function loadMilestones(currentUser) {
      if (!active) return;
      setUser(currentUser || null);
      if (!currentUser) {
        setItems(readItems());
        setLoading(false);
        setStatus('');
        setLegacyAvailable(false);
        return;
      }
      setLoading(true);
      setStatus('Loading your member milestones…');
      const { data, error } = await supabase.from('member_milestones')
        .select('id,title,category,is_completed,completed_at,created_at')
        .eq('user_id', currentUser.id).order('created_at', { ascending: true });
      if (!active) return;
      if (error) {
        setItems(readItems());
        setStatus('Account milestones could not be loaded. Your browser copy remains available. Apply migration 011 in Supabase if this is a new setup.');
        setLoading(false);
        return;
      }
      setItems((data || []).map(row => ({
        id: row.id, title: row.title, detail: 'A personal achievement worth recognizing.',
        category: row.category, done: Boolean(row.is_completed), completedAt: row.completed_at || null
      })));
      setLegacyAvailable((data || []).length === 0 && readItems().length > 0);
      setStatus('');
      setLoading(false);
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error) loadMilestones(data.session?.user || null);
      else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => loadMilestones(session?.user || null));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const completed = items.filter(item => item.done).length;
  const visibleItems = items.filter(item => filter === 'all' || (filter === 'completed' ? item.done : !item.done));
  const badges = [
    { count: 1, title: 'First Win', detail: 'You recognized a meaningful step.' },
    { count: 3, title: 'Momentum Builder', detail: 'Three milestones celebrated.' },
    { count: 5, title: 'Steady Riser', detail: 'Five moments of progress recorded.' },
    { count: 10, title: 'Legacy in Motion', detail: 'Ten milestones added to your journey.' },
  ];

  async function toggleItem(id) {
    const item = items.find(entry => entry.id === id);
    if (!item || loading) return;
    const done = !item.done;
    if (user) {
      const { error } = await supabase.from('member_milestones').update({
        is_completed: done, completed_at: done ? today() : null
      }).eq('id', id).eq('user_id', user.id);
      if (error) { setStatus('That milestone could not be updated. Please try again.'); return; }
    }
    setItems(current => current.map(entry => entry.id === id
      ? { ...entry, done, completedAt: done ? today() : null } : entry));
    setStatus('');
  }

  async function addMilestone(event) {
    event.preventDefault();
    if (!title.trim() || loading) return;
    const draft = { title: title.trim(), category, done: false, completedAt: null, detail: 'A personal achievement worth recognizing.' };
    if (user) {
      const { data, error } = await supabase.from('member_milestones')
        .insert({ user_id: user.id, title: draft.title, category }).select('id').single();
      if (error) { setStatus('Your milestone could not be saved. Apply migration 011 in Supabase if it has not been run.'); return; }
      setItems(current => [...current, { ...draft, id: data.id }]);
    } else {
      setItems(current => [...current, { ...draft, id: `milestone-${Date.now()}` }]);
    }
    setTitle('');
    setStatus('');
  }

  async function removeItem(id) {
    if (loading || !window.confirm('Remove this milestone? This cannot be undone.')) return;
    if (user) {
      const { error } = await supabase.from('member_milestones').delete().eq('id', id).eq('user_id', user.id);
      if (error) { setStatus('That milestone could not be removed. Please try again.'); return; }
    }
    setItems(current => current.filter(item => item.id !== id));
    setStatus('');
  }

  return (
    <section className="achievement-center" aria-labelledby="achievement-center-title">
      <div className="achievement-heading">
        <p className="achievement-kicker">NOTICE YOUR PROGRESS • CELEBRATE YOUR GROWTH</p>
        <h2 id="achievement-center-title">Achievement &amp; Milestone Center</h2>
        <p>Progress is not always loud or visible. Give yourself credit for the steps you choose to take.</p>
      </div>

      {status && <p className="achievement-status" role="status">{status}</p>}
      {legacyAvailable && <p className="achievement-status">Older milestones are saved in this browser and have not been copied into your member account. You can keep them on this device or add them again while signed in.</p>}
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
        <button type="submit" disabled={loading || !title.trim()}>{loading ? 'Loading…' : '＋ Add milestone'}</button>
      </form>

      <div className="achievement-list">
        <div className="achievement-list-heading"><h3>My milestones</h3><span>{completed} celebrated</span></div>
        <div className="achievement-filters" role="group" aria-label="Filter milestones">
          <button type="button" className={filter === 'all' ? 'active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All ({items.length})</button>
          <button type="button" className={filter === 'open' ? 'active' : ''} aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>In progress ({items.length - completed})</button>
          <button type="button" className={filter === 'completed' ? 'active' : ''} aria-pressed={filter === 'completed'} onClick={() => setFilter('completed')}>Celebrated ({completed})</button>
        </div>
        {items.length === 0 ? <p className="achievement-empty">Your milestones will appear here. Start by recording one moment of progress.</p> : visibleItems.length === 0 ? <p className="achievement-empty">Nothing in this view yet. Choose another filter or add a milestone.</p> : visibleItems.map(item => (
          <article className={item.done ? 'achievement-item achievement-item-done' : 'achievement-item'} key={item.id}>
            <label><input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} /><span><strong>{item.title}</strong><small>{item.category}{item.completedAt ? ` • Achieved ${item.completedAt}` : ''}</small></span></label>
            <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
          </article>
        ))}
      </div>

      <p className="achievement-privacy">{user ? 'Your milestones are saved to your signed-in member account. Database access is restricted to your own records.' : 'You are not signed in. Milestones are saved in this browser on this device only. Sign in to save new milestones to your member account. Avoid adding sensitive personal details on a shared device.'}</p>
    </section>
  );
}
