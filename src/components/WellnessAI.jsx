import { useState } from 'react';

const support = {
  Calm: {
    title: 'Protect the calm you have found',
    steps: [
      'Take a moment to notice what is helping you feel steady.',
      'Choose one small thing you can do today that supports your well-being.',
      'Give yourself permission to rest without having to earn it.',
    ],
  },
  Anxious: {
    title: 'Let’s slow this moment down',
    steps: [
      'Place both feet on the floor and gently notice the support beneath you.',
      'Breathe in comfortably, then make your exhale a little longer. Repeat a few times.',
      'Name five things you can see around you to reconnect with the present.',
    ],
  },
  Overwhelmed: {
    title: 'You only need to take the next small step',
    steps: [
      'Pause and set aside anything that does not need your attention right now.',
      'Choose one task that can be completed in five minutes or less.',
      'If possible, reach out to someone safe and ask for one specific kind of help.',
    ],
  },
  Sad: {
    title: 'You deserve care while you are having a hard day',
    steps: [
      'Try to speak to yourself with the kindness you would offer a friend.',
      'Consider a small comfort: water, a snack, fresh air, music, or rest.',
      'If the sadness feels heavy or keeps returning, consider talking with a trusted person or mental health professional.',
    ],
  },
  Angry: {
    title: 'Make room for the feeling without letting it steer',
    steps: [
      'If it is safe, step away from the situation for a few minutes.',
      'Release some tension with a slow walk, stretching, or unclenching your hands.',
      'Wait until you feel steadier before responding to a difficult conversation.',
    ],
  },
};

function WellnessAI() {
  const [mood, setMood] = useState('');
  const currentSupport = mood ? support[mood] : null;

  return (
    <section className="wellness-ai" aria-labelledby="wellness-title">
      <div className="wellness-ai-heading">
        <span className="wellness-kicker">INTEGRITY RISING WELLNESS</span>
        <h2 id="wellness-title">Your Wellness Check-In</h2>
        <p>Take a moment for yourself. There is no right or wrong answer.</p>
      </div>

      <h3>How are you feeling right now?</h3>
      <div className="mood-options" role="group" aria-label="Choose how you feel">
        {Object.keys(support).map((option) => (
          <button
            className={mood === option ? 'mood-button selected' : 'mood-button'}
            type="button"
            key={option}
            aria-pressed={mood === option}
            onClick={() => setMood(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {currentSupport && (
        <div className="wellness-suggestion" aria-live="polite">
          <h3>{currentSupport.title}</h3>
          <ol>
            {currentSupport.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <button className="reset-checkin" type="button" onClick={() => setMood('')}>
            Start over
          </button>
        </div>
      )}

      <p className="wellness-disclaimer">
        <strong>About this preview:</strong> This is a guided wellness check-in, not a live AI
        service, diagnosis, or replacement for professional care. Your selection is not sent
        to a server by this component.
      </p>

      <div className="wellness-help">
        <h3>Need help right now?</h3>
        <p>If you are in immediate danger, call 911. In the U.S., call or text 988 for
          mental health or suicide crisis support. For domestic violence support, call
          1-800-799-SAFE (7233) or text START to 88788.</p>
      </div>
    </section>
  );
}

export default WellnessAI;
