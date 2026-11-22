import { useMemo, useState } from 'react';
import './GrowthProgressCenter.css';

const KEYS = {
  goals: 'integrity-rising-goal-center-v1',
  planner: 'integrity-rising-growth-planner',
  milestones: 'integrity-rising-growth-milestones',
  checkins: 'integrity-rising-wellness-checkins',
  challenge: 'integrity-rising-30-day-challenge-v1',
  promises: 'integrity-rising-daily-promises'
};

function read(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || 'null');
    return value ?? fallback;
  } catch { return fallback; }
}

function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default function GrowthProgressCenter() {
  const [refresh, setRefresh] = useState(0);
  const stats = useMemo(() => {
    const goals = read(KEYS.goals, []);
    const planner = read(KEYS.planner, []);
    const milestones = read(KEYS.milestones, []);
    const checkins = read(KEYS.checkins, []);
    const challenge = read(KEYS.challenge, null);
    const promises = read(KEYS.promises, {});
    const today = dateKey();
    const todayTasks = planner.filter(task => task.due === today);
    const todayDone = todayTasks.filter(task => task.done).length;
    const tasksDone = planner.filter(task => task.done).length;
    const goalTasks = goals.flatMap(goal => goal.tasks || []);
    const totalDone = tasksDone + goalTasks.filter(task => task.done).length;
    const totalTasks = planner.length + goalTasks.length;
    const challengeDone = challenge?.completed ? Object.values(challenge.completed).filter(Boolean).length : 0;
    const checkinDays = new Set(checkins.map(entry => entry.date)).size;
    const completedPromises = Object.values(promises.checked || {}).filter(Boolean).length;
    const nextTask = planner.find(task => !task.done) || goalTasks.find(task => !task.done);
    const progress = totalTasks ? Math.round(totalDone / totalTasks * 100) : goals.filter(goal => goal.done).length ? Math.round(goals.filter(goal => goal.done).length / Math.max(goals.length, 1) * 100) : 0;
    return { goals: goals.length, goalsDone: goals.filter(goal => goal.done).length, todayTasks: todayTasks.length, todayDone, tasksDone, totalDone, totalTasks, milestones: milestones.length, challengeDone, checkinDays, completedPromises, progress, nextTask: nextTask?.title || '' };
  }, [refresh]);

  const message = stats.totalDone > 0 || stats.goalsDone > 0 || stats.challengeDone > 0
    ? 'Your effort is adding up. Progress does not need to be perfect to be meaningful.'
    : 'Start with one small step. You can build momentum at your own pace.';

  return (
    <section className="growth-progress-center" aria-labelledby="growth-progress-title">
      <div className="growth-progress-heading">
        <p className="growth-progress-kicker">YOUR JOURNEY • YOUR PACE</p>
        <h2 id="growth-progress-title">Growth Progress Center</h2>
        <p>A simple snapshot of your goals, daily actions, and wins. Your information is read from this device's saved app data.</p>
      </div>
      <div className="growth-progress-grid">
        <article className="growth-progress-stat"><strong>{stats.progress}%</strong><span>Action progress</span></article>
        <article className="growth-progress-stat"><strong>{stats.goalsDone}/{stats.goals}</strong><span>Goals completed</span></article>
        <article className="growth-progress-stat"><strong>{stats.todayDone}/{stats.todayTasks}</strong><span>Today's tasks</span></article>
        <article className="growth-progress-stat"><strong>{stats.milestones}</strong><span>Milestones saved</span></article>
        <article className="growth-progress-stat"><strong>{stats.challengeDone}/30</strong><span>Challenge days marked</span></article>
        <article className="growth-progress-stat"><strong>{stats.checkinDays}</strong><span>Wellness check-in days</span></article>
      </div>
      <div className="growth-progress-bar" role="progressbar" aria-label="Action progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={stats.progress}><span style={{ width: stats.progress + '%' }} /></div>
      <div className="growth-progress-encouragement"><span aria-hidden="true">🌱</span><div><strong>{message}</strong><p>{stats.nextTask ? 'Next step: ' + stats.nextTask : 'Choose a goal or a task to make your next step clear.'}</p></div></div>
      <button className="growth-progress-refresh" type="button" onClick={() => setRefresh(value => value + 1)}>Refresh my progress</button>
    </section>
  );
}
