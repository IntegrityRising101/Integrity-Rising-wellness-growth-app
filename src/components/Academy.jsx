import { useState } from 'react';
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
  }
];

function Academy() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const [completed, setCompleted] = useState({});
  const [expandedLesson, setExpandedLesson] = useState(0);

  const course = courses.find(item => item.id === selectedCourse) || courses[0];
  const doneCount = course.lessons.filter((_, index) => completed[`${course.id}-${index}`]).length;
  const progress = Math.round((doneCount / course.lessons.length) * 100);

  function toggleComplete(key) {
    setCompleted(current => ({ ...current, [key]: !current[key] }));
  }

  return (
    <section className="academy-section" aria-labelledby="academy-title">
      <div className="academy-hero">
        <p className="academy-eyebrow">INTEGRITY RISING ACADEMY</p>
        <h2 id="academy-title">Learn • Grow • Heal • Rise</h2>
        <p>Practical learning for personal growth, emotional wellness, healthy relationships, and everyday integrity.</p>
      </div>

      <div className="academy-course-layout">
        <div className="academy-course-list">
          <h3>Explore courses</h3>
          {courses.map(item => (
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
            <span>Your progress</span>
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
      <p className="academy-storage-note">Progress is stored only in this page session and resets when you refresh or close the page. Sign-in and secure progress saving can be added in a later phase.</p>
    </section>
  );
}

export default Academy;
