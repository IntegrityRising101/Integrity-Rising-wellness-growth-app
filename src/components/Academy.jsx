import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './Academy.css';

const courses = [
  {
    id: 'reset',
    title: '7-Day Integrity Reset',
    level: 'Beginner',
    length: '7 short lessons',
    description: 'Build a steady foundation through small daily actions, honest self-check-ins, and values-led choices.',
    lessons: [
      ['Day 1: Begin with honesty', 'Notice where life feels aligned and where it does not. Choose one area to approach with honesty and self-compassion.'],
      ['Day 2: Name your values', 'Choose three values that matter to you. Write one practical action that expresses each value.'],
      ['Day 3: Keep one small promise', 'Choose a realistic promise you can keep today. Consistency grows through achievable commitments.'],
      ['Day 4: Practice a boundary', 'Identify one limit that supports your wellbeing. Consider a clear, respectful way to communicate it.'],
      ['Day 5: Take responsibility without shame', 'Separate a behavior you can change from your worth as a person. Plan one repair or next step.'],
      ['Day 6: Choose your support', 'List people, services, or routines that help you feel supported. You decide what is safe to share.'],
      ['Day 7: Create your next step', 'Review what you learned and choose one habit to continue for the next week.']
    ]
  },
  {
    id: 'journaling',
    title: 'Healing Through Journaling',
    level: 'Self-paced',
    length: '5 guided lessons',
    description: 'Use gentle writing practices to explore emotions, recognize patterns, and notice personal strengths without pressure to revisit painful details.',
    lessons: [
      ['Create a supportive writing space', 'Choose a time and place that feels comfortable. You may skip any prompt that feels overwhelming.'],
      ['Name what you feel', 'Try: “Right now I notice…” Use simple words and remember that feelings can change.'],
      ['Recognize what helps', 'Write about one activity, person, place, or routine that helps you feel grounded.'],
      ['Notice your strengths', 'Describe a difficult moment you moved through and the skills or support that helped.'],
      ['Close with care', 'End with one kind statement to yourself and one small supportive action for today.']
    ]
  },
  {
    id: 'relationships',
    title: 'Healthy Relationships & Boundaries',
    level: 'Foundations',
    length: '5 guided lessons',
    description: 'Learn about respect, consent, communication, boundaries, and warning signs of unhealthy relationship dynamics.',
    lessons: [
      ['Respect and mutuality', 'Healthy relationships make room for both people’s needs, choices, and individuality.'],
      ['Understanding boundaries', 'A boundary describes what you will do to protect your wellbeing. It is not a tool for controlling another person.'],
      ['Consent and choice', 'Consent should be freely given, informed, specific, and reversible. Pressure and fear undermine choice.'],
      ['Recognizing unhealthy patterns', 'Patterns such as intimidation, isolation, monitoring, threats, and repeated disrespect deserve attention.'],
      ['Finding support safely', 'Consider a trusted person or qualified support service. If a device may be monitored, use a safer device when seeking help.']
    ]
  },
  {
    id: 'nervous-system',
    title: 'Reclaiming Your Nervous System',
    level: 'Wellness education',
    length: '5 guided lessons',
    description: 'An introductory, non-clinical look at stress responses, grounding skills, rest, and supportive routines.',
    lessons: [
      ['Understanding stress responses', 'Stress can affect thoughts, sleep, attention, and the body. Responses differ from person to person.'],
      ['Orient to the present', 'If it feels comfortable, slowly notice a few neutral things around you. Stop if the exercise increases distress.'],
      ['Try a gentle grounding practice', 'Feel your feet supported or hold a familiar object. Choose what feels comfortable; no technique works for everyone.'],
      ['Support rest and routine', 'Consider regular meals, hydration, rest, movement, and connection where possible. Start with one manageable step.'],
      ['Build a support plan', 'Identify a trusted support person and a qualified professional or service you could contact if needed.']
    ]
  },
  {
    id: 'integrity-check',
    title: '5-Minute Integrity Check',
    level: 'Quick practice',
    length: '1 short activity',
    description: 'A brief daily pause to check in with your values, choices, and next step.',
    lessons: [
      ['Pause, notice, choose', 'Ask yourself: What matters today? What is one choice within my control? What is one small action I can take with honesty and care?']
    ]
  },
  {
    id: 'emotional-wellness',
    title: 'Emotional Wellness Foundations',
    level: 'Beginner',
    length: '5 guided lessons',
    description: 'Build practical emotional-awareness skills, explore healthy coping options, and create a personal support routine.',
    lessons: [
      ['Notice and name emotions', 'Pause and identify what you are feeling without judging yourself. Emotions are information, not instructions.'],
      ['Understand your stress signals', 'Notice changes in your thoughts, energy, body, or behavior that may signal stress.'],
      ['Choose a healthy coping tool', 'Try a grounding activity, a short walk, journaling, music, or reaching out to someone you trust.'],
      ['Practice self-compassion', 'Speak to yourself as you would to someone you care about. You can learn without insulting yourself.'],
      ['Create a wellness routine', 'Choose one small daily action that supports rest, connection, nourishment, or movement.']
    ]
  },
  {
    id: 'recovery-resilience',
    title: 'Recovery & Resilience: One Step at a Time',
    level: 'Self-paced',
    length: '5 guided lessons',
    description: 'Explore supportive routines, setbacks, connection, and practical ways to keep moving toward the life you want.',
    lessons: [
      ['Define what progress means to you', 'Choose a meaningful goal that reflects your own values. Progress does not have to look like anyone else’s.'],
      ['Identify your supports', 'List safe people, peer groups, services, or professionals you may choose to contact.'],
      ['Plan for difficult moments', 'Identify a few warning signs and write down safe coping steps and support contacts.'],
      ['Respond to setbacks with care', 'A setback does not erase the effort you have made. Consider what support or adjustment would help next.'],
      ['Celebrate steady progress', 'Name one step you took and one realistic next step. Small actions can build momentum.']
    ]
  },
  {
    id: 'leadership-integrity',
    title: 'Leadership Through Integrity',
    level: 'Foundations',
    length: '5 guided lessons',
    description: 'Strengthen values-based decision-making, accountability, respectful communication, and service-minded leadership.',
    lessons: [
      ['Lead from your values', 'Identify the principles you want your decisions and actions to demonstrate.'],
      ['Practice accountability', 'Own your choices, acknowledge impact, and focus on constructive repair when appropriate.'],
      ['Communicate with respect', 'Listen to understand, speak clearly, and make room for different perspectives.'],
      ['Build trust through consistency', 'Follow through on realistic commitments and be honest when plans need to change.'],
      ['Use influence to serve', 'Look for a practical way to encourage, support, or make a positive contribution to others.']
    ]
  }
];

const learningPaths = [
  { id: 'personal-growth', title: 'Personal Growth', description: 'Build confidence, purpose, self-awareness, and values-led habits.', courseIds: ['reset', 'journaling'], outcome: 'Create a foundation for meaningful change.' },
  { id: 'emotional-wellness', title: 'Emotional Wellness', description: 'Explore emotional awareness, stress signals, and healthy coping skills.', courseIds: ['emotional-wellness', 'nervous-system'], outcome: 'Build a personal toolkit for everyday wellbeing.' },
  { id: 'healthy-relationships', title: 'Healthy Relationships', description: 'Learn about boundaries, communication, consent, and mutual respect.', courseIds: ['relationships'], outcome: 'Recognize healthy patterns and make room for respect.' },
  { id: 'recovery-resilience', title: 'Recovery & Resilience', description: 'Strengthen supportive routines and find your next step through challenges.', courseIds: ['recovery-resilience'], outcome: 'Move forward with practical tools and support.' },
  { id: 'leadership-integrity', title: 'Leadership & Integrity', description: 'Practice accountability, trust, respectful leadership, and positive influence.', courseIds: ['leadership-integrity', 'integrity-check'], outcome: 'Put your values into action and lead by example.' }
];

const PROGRESS_KEY = 'integrity-rising-academy-progress-v1';

function readSavedProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function Academy() {
  const [user, setUser] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [activePath, setActivePath] = useState(learningPaths[0].id);
  const [selectedCourse, setSelectedCourse] = useState(learningPaths[0].courseIds[0]);
  const [completed, setCompleted] = useState(readSavedProgress);
  const [expandedLesson, setExpandedLesson] = useState(0);

  useEffect(() => {
    if (!user) {
      try {
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
      } catch {
        // Progress remains available for this page session if browser storage is unavailable.
      }
    }
  }, [completed, user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    let active = true;
    async function loadMemberProgress(currentUser) {
      if (!active) return;
      setUser(currentUser || null);
      if (!currentUser) {
        setCompleted(readSavedProgress());
        setSyncMessage('Progress is saved on this device. Sign in to sync it to your member account.');
        return;
      }
      setSyncMessage('Loading your Academy progress…');
      const { data, error } = await supabase.from('academy_lesson_progress')
        .select('course_key, lesson_key, is_completed').eq('user_id', currentUser.id);
      if (!active) return;
      if (error) {
        setSyncMessage('Could not load account progress. Your device-saved progress is still available.');
        return;
      }
      const cloudProgress = {};
      (data || []).forEach(row => {
        if (row.is_completed) cloudProgress[`${row.course_key}-${row.lesson_key}`] = true;
      });
      const localProgress = readSavedProgress();
      setCompleted({ ...localProgress, ...cloudProgress });
      const pendingRows = Object.keys(localProgress).filter(key => localProgress[key] && !cloudProgress[key]).map(key => {
        const separator = key.lastIndexOf('-');
        return { user_id: currentUser.id, course_key: key.slice(0, separator), lesson_key: key.slice(separator + 1),
          is_completed: true, completed_at: new Date().toISOString() };
      });
      if (pendingRows.length) {
        const { error: syncError } = await supabase.from('academy_lesson_progress')
          .upsert(pendingRows, { onConflict: 'user_id,course_key,lesson_key' });
        if (!active) return;
        setSyncMessage(syncError ? 'Account progress loaded, but some earlier device progress could not sync.' : 'Academy progress synced to your member account.');
      } else {
        setSyncMessage('Academy progress synced to your member account.');
      }
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setSyncMessage('Sign-in status could not be checked. Device-saved progress remains available.');
        return;
      }
      loadMemberProgress(data.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => loadMemberProgress(session?.user || null));
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);

  const path = learningPaths.find(item => item.id === activePath) || learningPaths[0];
  const pathCourses = courses.filter(item => path.courseIds.includes(item.id));
  const course = courses.find(item => item.id === selectedCourse) || courses[0];
  const doneCount = course.lessons.filter((_, index) => completed[`${course.id}-${index}`]).length;
  const progress = Math.round((doneCount / course.lessons.length) * 100);
  const pathDone = pathCourses.reduce((total, item) => total + item.lessons.filter((_, index) => completed[`${item.id}-${index}`]).length, 0);
  const pathTotal = pathCourses.reduce((total, item) => total + item.lessons.length, 0);
  const pathProgress = pathTotal ? Math.round((pathDone / pathTotal) * 100) : 0;

  function choosePath(item) {
    setActivePath(item.id);
    setSelectedCourse(item.courseIds[0]);
    setExpandedLesson(0);
  }

  async function toggleComplete(key) {
    const nextValue = !completed[key];
    setCompleted(current => ({ ...current, [key]: nextValue }));
    if (!user || !isSupabaseConfigured || !supabase) {
      setSyncMessage('Progress saved on this device. Sign in to sync across devices.');
      return;
    }
    const separator = key.lastIndexOf('-');
    const courseKey = key.slice(0, separator);
    const lessonKey = key.slice(separator + 1);
    const { error } = await supabase.from('academy_lesson_progress').upsert({
      user_id: user.id, course_key: courseKey, lesson_key: lessonKey,
      is_completed: nextValue, completed_at: nextValue ? new Date().toISOString() : null
    }, { onConflict: 'user_id,course_key,lesson_key' });
    setSyncMessage(error
      ? 'The change is shown here, but could not be saved to your account. Please try again.'
      : 'Academy progress saved to your member account.');
  }

  return (
    <section className="academy-section" aria-labelledby="academy-title">
      <div className="academy-hero">
        <p className="academy-eyebrow">INTEGRITY RISING ACADEMY</p>
        <h2 id="academy-title">Learn • Grow • Heal • Rise</h2>
        <p>Practical learning for personal growth, emotional wellness, healthy relationships, and everyday integrity.</p>
      </div>

      <div className="academy-paths" aria-labelledby="academy-paths-title">
        <div className="academy-paths-heading">
          <div>
            <p className="academy-paths-kicker">CHOOSE YOUR NEXT STEP</p>
            <h3 id="academy-paths-title">Learning Paths</h3>
            <p>Choose the journey that feels most useful right now. You can move at your own pace and change paths whenever you like.</p>
          </div>
          <span className="academy-paths-progress">{pathProgress}% of this path complete</span>
        </div>
        <div className="academy-path-grid">
          {learningPaths.map(item => {
            const isActive = activePath === item.id;
            const itemCourses = courses.filter(courseItem => item.courseIds.includes(courseItem.id));
            const total = itemCourses.reduce((sum, courseItem) => sum + courseItem.lessons.length, 0);
            const done = itemCourses.reduce((sum, courseItem) => sum + courseItem.lessons.filter((_, index) => completed[`${courseItem.id}-${index}`]).length, 0);
            const percent = total ? Math.round((done / total) * 100) : 0;
            return (
              <button type="button" key={item.id} className={isActive ? 'academy-path-card active' : 'academy-path-card'} onClick={() => choosePath(item)} aria-pressed={isActive}>
                <span className="academy-path-card-title">{item.title}</span>
                <span className="academy-path-card-description">{item.description}</span>
                <span className="academy-path-card-outcome">{item.outcome}</span>
                <span className="academy-path-mini-track" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></span>
                <span className="academy-path-card-footer">{percent}% complete <strong>{isActive ? 'Selected' : 'Explore path →'}</strong></span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="academy-course-layout">
        <div className="academy-course-list">
          <h3>{path.title} courses</h3>
          {pathCourses.map(item => (
            <button
              type="button"
              key={item.id}
              className={selectedCourse === item.id ? 'academy-course-choice active' : 'academy-course-choice'}
              onClick={() => { setSelectedCourse(item.id); setExpandedLesson(0); }}
              aria-pressed={selectedCourse === item.id}
            >
              <span>{item.title}</span>
              <small>{item.length} · {item.level}</small>
            </button>
          ))}
        </div>

        <div className="academy-course-content">
          <span className="academy-course-level">{course.level}</span>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className="academy-progress-label">
            <span>Your course progress</span>
            <strong>{doneCount} of {course.lessons.length} complete · {progress}%</strong>
          </div>
          <div className="academy-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${course.title} progress`}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="academy-lessons">
            {course.lessons.map((lesson, index) => {
              const key = `${course.id}-${index}`;
              const isDone = Boolean(completed[key]);
              const isOpen = expandedLesson === index;
              return (
                <article className="academy-lesson" key={key}>
                  <button
                    type="button"
                    className="academy-lesson-toggle"
                    onClick={() => setExpandedLesson(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="academy-lesson-number">{isDone ? '✓' : index + 1}</span>
                    <span>{lesson[0]}</span>
                    <span className="academy-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="academy-lesson-body">
                      <p>{lesson[1]}</p>
                      <button
                        type="button"
                        className={isDone ? 'academy-complete-button completed' : 'academy-complete-button'}
                        onClick={() => toggleComplete(key)}
                      >
                        {isDone ? 'Completed — undo' : 'Mark lesson complete'}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="academy-note">
        <strong>A supportive learning space</strong>
        <p>These lessons provide general education and self-guided activities. They are not therapy, medical advice, crisis support, or a substitute for care from a qualified professional. You may pause or skip any activity. If you are in immediate danger, contact emergency services.</p>
      </aside>
      <p className="academy-storage-note" role="status">{syncMessage || (user ? "Your Academy progress is connected to your member account." : "Your lesson progress is saved in this browser on this device.")}</p>
    </section>
  );
}

export default Academy;
