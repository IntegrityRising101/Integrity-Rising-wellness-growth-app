import { useMemo, useState } from 'react';

const questions = [
  {
    id: 'mood',
    title: 'How would you describe your mood today?',
    options: ['Steady or positive', 'A little up and down', 'Low or discouraged', 'Overwhelmed or tense', 'Not sure yet']
  },
  {
    id: 'energy',
    title: 'How is your energy right now?',
    options: ['I have enough energy', 'A little tired', 'Very low', 'Restless or wired', 'It changes throughout the day']
  },
  {
    id: 'stress',
    title: 'How manageable does today feel?',
    options: ['Manageable', 'Some things feel difficult', 'I feel stretched thin', 'I need support with what is happening', 'I cannot tell right now']
  },
  {
    id: 'connection',
    title: 'How connected do you feel to supportive people?',
    options: ['I feel supported', 'I have someone I could reach out to', 'I feel somewhat alone', 'I would like more support', 'Prefer not to say']
  },
  {
    id: 'values',
    title: 'What would help you feel more aligned with your values today?',
    options: ['Being honest with myself', 'Taking one healthy step', 'Setting a boundary', 'Asking for or accepting support', 'Resting without judging myself', 'I am still figuring that out']
  }
];

const suggestions = {
  mood: {
    'Steady or positive': 'Notice what is helping today and consider one small way to keep it going.',
    'A little up and down': 'Choose one manageable task and give yourself room to adjust.',
    'Low or discouraged': 'Try a gentle activity, a basic need, or a check-in with someone you trust.',
    'Overwhelmed or tense': 'Pause if you can. Reduce the next step to something small and grounding.',
    'Not sure yet': 'You do not have to label your mood. Simply notice what you need next.'
  },
  energy: {
    'I have enough energy': 'Use some of that energy for one meaningful, realistic action.',
    'A little tired': 'Choose a lighter task and make room for rest.',
    'Very low': 'Focus on a basic need and consider asking someone supportive for help.',
    'Restless or wired': 'Try a comfortable grounding activity or gentle movement if it feels right.',
    'It changes throughout the day': 'Plan flexibly and choose a step you can pause or adapt.'
  },
  stress: {
    'Manageable': 'Keep your plan simple and recognize the progress you make.',
    'Some things feel difficult': 'Separate what you can influence today from what can wait.',
    'I feel stretched thin': 'Consider what can be postponed, simplified, or shared with someone else.',
    'I need support with what is happening': 'Reach out to a trusted person or qualified support service.',
    'I cannot tell right now': 'Take a moment to pause and identify just one immediate need.'
  },
  connection: {
    'I feel supported': 'Consider acknowledging someone who helps you feel supported.',
    'I have someone I could reach out to': 'A short message can be enough to begin a connection.',
    'I feel somewhat alone': 'Think of one safe person, group, or community resource you could contact.',
    'I would like more support': 'You deserve support. Consider a trusted person or a qualified local service.',
    'Prefer not to say': 'You can skip this area and focus on what feels useful to you.'
  }
};

function SelfReflectionCheck() {
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const answeredCount = Object.keys(answers).length;

  const summary = useMemo(() => {
    return [
      answers.mood && suggestions.mood[answers.mood],
      answers.energy && suggestions.energy[answers.energy],
      answers.stress && suggestions.stress[answers.stress],
      answers.connection && suggestions.connection[answers.connection],
      answers.values && `A values-based next step could be: ${answers.values.toLowerCase()}.`
    ].filter(Boolean);
  }, [answers]);

  function chooseAnswer(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setShowSummary(false);
  }

  function resetCheck() {
    setAnswers({});
    setShowSummary(false);
  }

  return (
    <section className="self-reflection-check" aria-labelledby="self-reflection-title">
      <style>{`
        .self-reflection-check{max-width:900px;margin:32px auto;padding:28px;background:#fff;border:1px solid #d9e5e1;border-radius:18px;box-shadow:0 4px 14px rgba(0,0,0,.05)}
        .self-reflection-check h2,.self-reflection-check h3{color:#075e60}
        .reflection-kicker{color:#a17c25;font-size:.76rem;font-weight:800;letter-spacing:.13em}
        .reflection-question{padding:18px 0;border-bottom:1px solid #e5eeeb}
        .reflection-question h3{font-size:1.05rem;margin:0 0 12px}
        .reflection-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
        .reflection-options button{padding:11px 13px;min-height:46px;text-align:left;border:1px solid #b8ceca;border-radius:10px;background:#f7faf9;color:#075e60;font:inherit;cursor:pointer}
        .reflection-options button[aria-pressed=true]{background:#075e60;color:#fff;border-color:#075e60}
        .reflection-options button:focus-visible,.reflection-primary:focus-visible,.reflection-secondary:focus-visible{outline:3px solid #c9a64b;outline-offset:3px}
        .reflection-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
        .reflection-primary,.reflection-secondary{border:0;border-radius:999px;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer}
        .reflection-primary{background:#075e60;color:#fff}
        .reflection-primary:disabled{opacity:.45;cursor:not-allowed}
        .reflection-secondary{background:#eef5f3;color:#075e60}
        .reflection-summary{margin-top:22px;padding:18px;background:#f2f8f6;border-left:4px solid #c9a64b;border-radius:10px}
        .reflection-summary li{margin:9px 0;line-height:1.5}
        .reflection-note{color:#566461;font-size:.88rem;line-height:1.55;margin-top:18px}
        @media(max-width:600px){.self-reflection-check{margin:22px 12px;padding:20px 16px}.reflection-options{grid-template-columns:1fr}}
      `}</style>

      <p className="reflection-kicker">INTEGRITY RISING • SELF-REFLECTION</p>
      <h2 id="self-reflection-title">Pause & Check In With Yourself</h2>
      <p>Take a moment to notice how things are going. Answer only what feels comfortable. You can skip any question.</p>
      <p><strong>{answeredCount} of {questions.length}</strong> questions answered</p>

      {questions.map((question) => (
        <div className="reflection-question" key={question.id}>
          <h3>{question.title}</h3>
          <div className="reflection-options" role="group" aria-label={question.title}>
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={answers[question.id] === option}
                onClick={() => chooseAnswer(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="reflection-actions">
        <button className="reflection-primary" type="button" disabled={answeredCount === 0} onClick={() => setShowSummary(true)}>
          Show my gentle next steps
        </button>
        <button className="reflection-secondary" type="button" onClick={resetCheck}>Start over</button>
      </div>

      {showSummary && (
        <div className="reflection-summary" aria-live="polite">
          <h3>Your check-in, without judgment</h3>
          <p>There are no scores or labels here. Based on the areas you chose to answer, consider these gentle next steps:</p>
          <ul>{summary.map((item, index) => <li key={index}>{item}</li>)}</ul>
          <p><strong>One step at a time.</strong> You decide what feels useful and what you want to leave for another day.</p>
        </div>
      )}

      <p className="reflection-note">
        This is a voluntary self-reflection activity, not a mental-health screening, diagnosis, or treatment. Your selections stay in this page session and are not sent to a server; they clear when you refresh or close the page. This app is not monitored. If you are in immediate danger, contact emergency services if it is safe to do so.
      </p>
    </section>
  );
}

export default SelfReflectionCheck;
