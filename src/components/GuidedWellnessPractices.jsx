import { useState } from 'react';

const practices = [
  {
    slug: 'values-action',
    category: 'Values & motivation',
    title: 'Values-Based Action',
    duration: '5 minutes',
    intro: 'Choose one small action that reflects the kind of person you want to be, even if your mood is not perfect.',
    steps: [
      'Choose a value that matters to you today: honesty, courage, kindness, learning, health, or connection.',
      'Ask yourself: “What would this value look like in one small action today?”',
      'Make the action specific and realistic. For example: send one supportive message, take a short walk, or complete one task.',
      'Decide when or where you will try it. You can make the action smaller if needed.'
    ],
    note: 'This is a self-guided activity, not a test. You can skip it or choose a different value at any time.'
  },
  {
    slug: 'thought-record',
    category: 'Thought skills',
    title: 'Reframe a Thought',
    duration: '5 minutes',
    intro: 'A CBT-informed thought record can help you look at a difficult thought from more than one angle.',
    steps: [
      'Name the situation briefly: what happened?',
      'Notice the thought that showed up. What did your mind say?',
      'Name the feeling, if you can, and its intensity from 0 to 10.',
      'Ask: “What facts support this thought? What facts might not fit it?”',
      'Write a more balanced thought that makes room for the facts and for uncertainty.'
    ],
    note: 'You do not have to force a positive thought. Aim for a fairer, more balanced one. Skip any prompt that feels upsetting.'
  },
  {
    slug: 'grounding-54321',
    category: 'Mindfulness',
    title: '5-4-3-2-1 Grounding',
    duration: '2 minutes',
    intro: 'If it feels comfortable, gently notice your surroundings one sense at a time.',
    steps: [
      'Name 5 things you can see.',
      'Notice 4 things you can feel, such as your feet on the floor or fabric against your skin.',
      'Listen for 3 sounds.',
      'Notice 2 scents, or name two smells you enjoy.',
      'Notice 1 thing you can taste, or take one comfortable sip of water.'
    ],
    note: 'You can keep your eyes open, skip any sense, or stop whenever you want. Grounding does not work the same way for everyone.'
  },
  {
    slug: 'self-compassion',
    category: 'Self-kindness',
    title: 'Self-Compassion Pause',
    duration: '3 minutes',
    intro: 'Take a brief pause and respond to yourself with the care you would offer someone you respect.',
    steps: [
      'Pause and notice what is difficult right now, without judging yourself for having a hard moment.',
      'Try saying: “This is difficult right now.”',
      'Remind yourself: “Struggling is part of being human. I am not the only one who has hard days.”',
      'Ask: “What is one kind and realistic thing I can do for myself next?”',
      'Choose one small action, such as resting, drinking water, asking for help, or taking a break.'
    ],
    note: 'Use words that feel genuine to you. You do not need to pretend everything is okay.'
  }
];

function GuidedWellnessPractices() {
  const [activeSlug, setActiveSlug] = useState(practices[0].slug);
  const [completed, setCompleted] = useState([]);
  const active = practices.find((practice) => practice.slug === activeSlug);
  const isComplete = completed.includes(activeSlug);

  function toggleComplete() {
    setCompleted((current) =>
      current.includes(activeSlug)
        ? current.filter((slug) => slug !== activeSlug)
        : [...current, activeSlug]
    );
  }

  return (
    <section className="guided-practices" aria-labelledby="guided-practices-title">
      <style>{`
        .guided-practices{max-width:900px;margin:32px auto;padding:28px;background:#fff;border:1px solid #d9e5e1;border-radius:18px;box-shadow:0 4px 14px rgba(0,0,0,.05)}
        .guided-practices h2,.guided-practices h3{color:#075e60}
        .guided-practices-heading{text-align:center;margin-bottom:22px}
        .guided-practices-kicker{color:#a17c25;font-size:.76rem;font-weight:800;letter-spacing:.13em}
        .guided-practices-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:20px 0}
        .guided-practices-tabs button{min-height:58px;padding:12px;border:1px solid #b8ceca;border-radius:12px;background:#f7faf9;color:#075e60;font:inherit;font-weight:700;text-align:left;cursor:pointer}
        .guided-practices-tabs button[aria-pressed=true]{background:#075e60;color:#fff;border-color:#075e60}
        .guided-practices-tabs button:focus-visible,.guided-practices-done:focus-visible{outline:3px solid #c9a64b;outline-offset:3px}
        .guided-practice-meta{display:flex;gap:10px;flex-wrap:wrap;color:#6b7775;font-size:.88rem}
        .guided-practice-meta span{background:#eef5f3;padding:5px 10px;border-radius:999px}
        .guided-practice-steps{padding-left:24px;line-height:1.65}
        .guided-practice-steps li{padding:7px 0}
        .guided-practice-note{padding:14px 16px;background:#fff8e8;border-left:4px solid #c9a64b;border-radius:9px;line-height:1.55}
        .guided-practices-done{border:0;border-radius:999px;background:#075e60;color:#fff;padding:12px 20px;font:inherit;font-weight:700;cursor:pointer}
        .guided-practices-status{color:#075e60;font-weight:700;margin-left:12px}
        .guided-practices-footer{color:#566461;font-size:.88rem;line-height:1.55;margin-top:20px}
        @media(max-width:600px){.guided-practices{margin:22px 12px;padding:20px 16px}.guided-practices-tabs{grid-template-columns:1fr}.guided-practices-status{display:block;margin:10px 0 0}}
      `}</style>
      <div className="guided-practices-heading">
        <p className="guided-practices-kicker">INTEGRITY RISING • GUIDED WELLNESS</p>
        <h2 id="guided-practices-title">Four Practices for Your Well-Being</h2>
        <p>Short, self-guided activities to help you reflect, reconnect, and choose a manageable next step.</p>
      </div>

      <div className="guided-practices-tabs" role="group" aria-label="Choose a guided wellness practice">
        {practices.map((practice) => (
          <button
            key={practice.slug}
            type="button"
            aria-pressed={activeSlug === practice.slug}
            onClick={() => setActiveSlug(practice.slug)}
          >
            {practice.title}
            <small style={{ display: 'block', fontWeight: 400, opacity: .85 }}>{practice.duration}</small>
          </button>
        ))}
      </div>

      <article aria-live="polite">
        <p className="guided-practices-kicker">{active.category}</p>
        <h3>{active.title}</h3>
        <div className="guided-practice-meta">
          <span>{active.duration}</span>
          <span>{completed.length} of 4 practices completed in this visit</span>
        </div>
        <p>{active.intro}</p>
        <ol className="guided-practice-steps">
          {active.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="guided-practice-note">{active.note}</p>
        <button className="guided-practices-done" type="button" onClick={toggleComplete}>
          {isComplete ? 'Mark as not completed' : 'Mark practice complete'}
        </button>
        <span className="guided-practices-status" role="status">
          {isComplete ? '✓ Completed during this visit' : ''}
        </span>
      </article>

      <p className="guided-practices-footer">
        These educational exercises are not therapy, diagnosis, or emergency support. Completion is kept only in this page session and is cleared when the page is refreshed or closed. Avoid entering private or identifying information.
      </p>
    </section>
  );
}

export default GuidedWellnessPractices;
