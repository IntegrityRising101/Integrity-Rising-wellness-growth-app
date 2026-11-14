import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './GoalCenter.css';

const STORAGE_KEY = 'integrity-rising-goal-center-v1';

function today() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function readGoals() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function fromDatabase(goalRows, taskRows) {
  return (goalRows || []).map(goal => ({
    id: goal.id,
    title: goal.title,
    nextStep: goal.first_step || '',
    targetDate: goal.target_date || '',
    done: Boolean(goal.is_completed),
    completedAt: goal.completed_at?.slice(0, 10) || null,
    createdAt: goal.created_on || goal.created_at?.slice(0, 10) || today(),
    tasks: (taskRows || []).filter(task => task.goal_id === goal.id).map(task => ({
      id: task.id,
      title: task.title,
      done: Boolean(task.is_completed),
      completedAt: task.completed_at?.slice(0, 10) || null
    }))
  }));
}

function getReachabilityTip(goal, tasks, taskDone) {
  if (goal.done) return 'You completed this goal. Take a moment to recognize the effort it took to get here.';
  if (goal.targetDate && goal.targetDate < today()) return 'Your target date has passed. Choose a new realistic date and adjust the next step—changing the plan is progress, not failure.';
  if (tasks.length === 0) return 'Make this goal easier: add one action you can finish in about 10–15 minutes.';
  if (taskDone === tasks.length) return 'All action steps are complete. Review your goal and mark it complete if you have reached it.';
  return 'Focus on the next unchecked action. Keep it small enough to complete in about 10–15 minutes.';
}

function GoalCenter() {
  const [goals, setGoals] = useState(readGoals);
  const [title, setTitle] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [taskDrafts, setTaskDrafts] = useState({});
  const [user, setUser] = useState(null);
  const [accountReady, setAccountReady] = useState(!isSupabaseConfigured);
  const [message, setMessage] = useState('');
  const [localGoalsAvailable, setLocalGoalsAvailable] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    let active = true;

    async function loadAccountGoals(currentUser) {
      if (!active) return;
      setUser(currentUser || null);
      if (!currentUser) {
        setGoals(readGoals());
        setLocalGoalsAvailable(false);
        setMessage('');
        setAccountReady(true);
        return;
      }

      setAccountReady(false);
      setMessage('Loading your member goals…');
      const [goalResult, taskResult] = await Promise.all([
        supabase.from('member_goals').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
        supabase.from('goal_tasks').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: true })
      ]);

      if (!active) return;
      if (goalResult.error || taskResult.error) {
        setMessage('We could not load your account goals. Your browser-saved goals have been kept safe.');
        setGoals(readGoals());
        setAccountReady(true);
        return;
      }

      setGoals(fromDatabase(goalResult.data, taskResult.data));
      setLocalGoalsAvailable((goalResult.data || []).length === 0 && readGoals().length > 0);
      setMessage('');
      setAccountReady(true);
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setMessage('We could not check your sign-in status. Your browser-saved goals remain available.');
        setAccountReady(true);
        return;
      }
      loadAccountGoals(data.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadAccountGoals(session?.user || null);
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      } catch {
        // Keep the tracker usable for this page session if browser storage is unavailable.
      }
    }
  }, [goals, user]);

  const completedGoals = goals.filter(goal => goal.done).length;
  const allTasks = goals.flatMap(goal => (goal.tasks || []).map(task => ({ ...task, goalTitle: goal.title })));
  const completedTasks = allTasks.filter(task => task.done).length;
  const weekStart = new Date();
  weekStart.setHours(12, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);
  const weekStartKey = [weekStart.getFullYear(), String(weekStart.getMonth() + 1).padStart(2, '0'), String(weekStart.getDate()).padStart(2, '0')].join('-');
  const weeklyCompleted = allTasks.filter(task => task.done && task.completedAt >= weekStartKey && task.completedAt <= today()).length;
  const overallProgress = allTasks.length
    ? Math.round((completedTasks / allTasks.length) * 100)
    : goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  async function addGoal(event) {
    event.preventDefault();
    if (!title.trim() || !accountReady) return;
    const draft = {
      title: title.trim(),
      nextStep: nextStep.trim(),
      targetDate,
      done: false,
      completedAt: null,
      createdAt: today(),
      tasks: []
    };

    if (user) {
      const { data, error } = await supabase.from('member_goals').insert({
        user_id: user.id,
        title: draft.title,
        first_step: draft.nextStep,
        target_date: draft.targetDate || null,
        created_on: draft.createdAt
      }).select().single();
      if (error) {
        setMessage('Your goal could not be saved to your account. Please try again.');
        return;
      }
      setGoals(current => [{ ...draft, id: data.id }, ...current]);
    } else {
      setGoals(current => [...current, { ...draft, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }]);
    }
    setTitle('');
    setNextStep('');
    setTargetDate('');
    setMessage('');
  }

  async function addTask(event, goalId) {
    event.preventDefault();
    const taskTitle = (taskDrafts[goalId] || '').trim();
    if (!taskTitle || !accountReady) return;

    if (user) {
      const { data, error } = await supabase.from('goal_tasks').insert({
        goal_id: goalId,
        user_id: user.id,
        title: taskTitle
      }).select().single();
      if (error) {
        setMessage('That action step could not be saved. Please try again.');
        return;
      }
      setGoals(current => current.map(goal => goal.id === goalId
        ? { ...goal, tasks: [...(goal.tasks || []), { id: data.id, title: taskTitle, done: false, completedAt: null }] }
        : goal));
    } else {
      setGoals(current => current.map(goal => goal.id === goalId
        ? { ...goal, tasks: [...(goal.tasks || []), { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: taskTitle, done: false, completedAt: null }] }
        : goal));
    }
    setTaskDrafts(current => ({ ...current, [goalId]: '' }));
    setMessage('');
  }

  async function toggleTask(goalId, taskId) {
    const goal = goals.find(item => item.id === goalId);
    const task = goal?.tasks?.find(item => item.id === taskId);
    if (!task) return;
    const done = !task.done;
    const completedAt = done ? today() : null;

    if (user) {
      const { error } = await supabase.from('goal_tasks').update({
        is_completed: done,
        completed_at: done ? new Date().toISOString() : null
      }).eq('id', taskId).eq('user_id', user.id);
      if (error) {
        setMessage('That action step could not be updated. Please try again.');
        return;
      }
    }
    setGoals(current => current.map(item => item.id === goalId
      ? { ...item, tasks: item.tasks.map(row => row.id === taskId ? { ...row, done, completedAt } : row) }
      : item));
    setMessage('');
  }

  async function toggleGoal(id) {
    const goal = goals.find(item => item.id === id);
    if (!goal) return;
    const done = !goal.done;

    if (user) {
      const { error } = await supabase.from('member_goals').update({
        is_completed: done,
        completed_at: done ? new Date().toISOString() : null
      }).eq('id', id).eq('user_id', user.id);
      if (error) {
        setMessage('That goal could not be updated. Please try again.');
        return;
      }
    }
    setGoals(current => current.map(item => item.id === id ? { ...item, done, completedAt: done ? today() : null } : item));
    setMessage('');
  }

  async function removeGoal(id) {
    if (user) {
      const { error } = await supabase.from('member_goals').delete().eq('id', id).eq('user_id', user.id);
      if (error) {
        setMessage('That goal could not be removed. Please try again.');
        return;
      }
    }
    setGoals(current => current.filter(goal => goal.id !== id));
    setMessage('');
  }

  return (
    <section className="goal-center" aria-labelledby="goal-center-title">
      <div className="goal-center-heading">
        <p className="goal-center-kicker">PLAN • TAKE ACTION • GROW</p>
        <h2 id="goal-center-title">My Goal Center</h2>
        <p>Turn big goals into small, reachable actions. Every step forward counts.</p>
      </div>

      {message && <p className="goal-center-status" role="status">{message}</p>}
      {user && localGoalsAvailable && (
        <p className="goal-center-status" role="status">
          You have older goals saved in this browser. They have not been moved into your account. Your original browser copy is safe; you can keep using it on this device or recreate any goals you want in your member account.
        </p>
      )}

      <div className="goal-center-summary">
        <div><strong>{goals.length}</strong><span>Goals created</span></div>
        <div><strong>{completedTasks}</strong><span>Steps completed</span></div>
        <div><strong>{overallProgress}%</strong><span>Overall progress</span></div>
      </div>
      <div className="goal-center-progress" role="progressbar" aria-label="Overall goal step completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={overallProgress}>
        <span style={{ width: `${overallProgress}%` }} />
      </div>

      <div className="goal-weekly-card">
        <div><span className="goal-weekly-label">LAST 7 DAYS</span><strong>{weeklyCompleted}</strong><span>steps completed this week</span></div>
        <p>Small, consistent actions build lasting progress. Choose one useful step for today.</p>
      </div>

      <form className="goal-center-form" onSubmit={addGoal}>
        <h3>Add a goal</h3>
        <label htmlFor="goal-title">What would you like to work toward?</label>
        <input id="goal-title" value={title} onChange={event => setTitle(event.target.value)} maxLength="100" placeholder="Example: Build a consistent morning routine" required />
        <label htmlFor="goal-next-step">Your first small step (optional)</label>
        <input id="goal-next-step" value={nextStep} onChange={event => setNextStep(event.target.value)} maxLength="180" placeholder="Example: Set out what I need the night before" />
        <label htmlFor="goal-date">Target date (optional)</label>
        <input id="goal-date" type="date" min={today()} value={targetDate} onChange={event => setTargetDate(event.target.value)} />
        <button type="submit" disabled={!accountReady}>{accountReady ? '＋ Add my goal' : 'Loading goals…'}</button>
      </form>

      <div className="goal-center-list">
        <div className="goal-center-list-heading"><h3>My goals and action plans</h3><span>{goals.length} total</span></div>
        {goals.length === 0 ? (
          <p className="goal-center-empty">Your goals will appear here. Start with one that matters to you, then add a small action you can take today.</p>
        ) : goals.map(goal => {
          const tasks = goal.tasks || [];
          const taskDone = tasks.filter(task => task.done).length;
          const progress = tasks.length ? Math.round((taskDone / tasks.length) * 100) : goal.done ? 100 : 0;
          return (
            <article className={goal.done ? 'goal-card goal-card-done' : 'goal-card'} key={goal.id}>
              <div className="goal-card-top">
                <label className="goal-card-check"><input type="checkbox" checked={goal.done} onChange={() => toggleGoal(goal.id)} /><span>{goal.title}</span></label>
                <button type="button" className="goal-remove" onClick={() => removeGoal(goal.id)} aria-label={`Remove goal: ${goal.title}`}>Remove</button>
              </div>
              {goal.nextStep && <p><strong>First step:</strong> {goal.nextStep}</p>}
              <div className="goal-card-meta"><span>Started {goal.createdAt}</span>{goal.targetDate && <span>Target {goal.targetDate}</span>}<span>{goal.done ? `Goal completed${goal.completedAt ? ` · ${goal.completedAt}` : ''}` : 'In progress'}</span></div>
              <div className="goal-progress-line"><span>{progress}% complete</span><span>{taskDone} of {tasks.length} actions</span></div>
              <div className="goal-card-progress" role="progressbar" aria-label={`${goal.title} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
              <div className="goal-task-list">
                <h4>Action steps</h4>
                {tasks.length === 0 && <p className="goal-task-empty">No action steps yet. Add one small task to make this goal easier to reach.</p>}
                {tasks.map(task => <label className={task.done ? 'goal-task goal-task-done' : 'goal-task'} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(goal.id, task.id)} /><span>{task.title}</span>{task.done && <small>Done {task.completedAt || ''}</small>}</label>)}
                <form className="goal-task-form" onSubmit={event => addTask(event, goal.id)}>
                  <input aria-label={`New action step for ${goal.title}`} value={taskDrafts[goal.id] || ''} onChange={event => setTaskDrafts(current => ({ ...current, [goal.id]: event.target.value }))} maxLength="140" placeholder="Add a small action step…" />
                  <button type="submit" disabled={!accountReady}>Add step</button>
                </form>
              </div>
              <p className="goal-growth-tip">Reachability tip: {getReachabilityTip(goal, tasks, taskDone)}</p>
            </article>
          );
        })}
      </div>
      <p className="goal-center-privacy">
        {user
          ? 'Your goals and action steps are saved to your signed-in member account. Account-level database policies restrict access to your own records.'
          : 'You are not signed in. Goals are saved in this browser on this device only. Sign in to save new goals to your member account. Avoid entering sensitive personal details, especially on a shared device.'}
      </p>
    </section>
  );
}

export default GoalCenter;
