import { useState } from 'react';
import './StressReliefCenter.css';

const groundingSteps = [
  'Name 5 things you can see.',
  'Notice 4 things you can physically feel.',
  'Listen for 3 things you can hear.',
  'Notice 2 things you can smell, or two scents you enjoy.',
  'Name 1 thing you can taste, or one thing that helps you feel grounded.'
];

const breathingSteps = [
  { title: 'Breathe in gently', detail: 'Take a comfortable breath in through your nose, if that feels okay.' },
  { title: 'Breathe out slowly', detail: 'Let the breath leave gently. There is no need to force or hold your breath.' },
  { title: 'Pause and notice', detail: 'Notice how your body feels. Return to your normal breathing whenever you want.' }
];

const resetIdeas = [
  'Unclench your jaw and lower your shoulders.',
  'Sip a little water.',
  'Look around and name where you are and what day it is.',
  'Stretch gently or change position if comfortable.',
  'Take a short break from noise or screens if possible.',
  'Reach out to someone you trust.'
];

const affirmations = [
  'I can take this one moment at a time.',
  'I do not have to solve everything right now.',
  'A small step forward still matters.',
  'I deserve patience, care, and respect.',
  'I can pause and choose what I need next.'
];

function StressReliefCenter() {
  const [breathingStep, setBreathingStep] = useState(0);
  const [groundingChecked, setGroundingChecked] = useState({});
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const completedGrounding = Object.values(groundingChecked).filter(Boolean).length;

  function toggleGrounding(index) {
    setGroundingChecked(current => ({ ...current, [index]: !current[index] }));
  }

  function resetGrounding() {
    setGroundingChecked({});
  }

  function nextBreathingStep() {
    setBreathingStep(current => (current + 1) % breathingSteps.length);
  }

  function nextAffirmation() {
    setAffirmationIndex(current => (current + 1) % affirmations.length);
  }

  return (
    <section className="stress-relief-center" aria-labelledby="stress-relief-title">
      <div className="stress-relief-header">
        <p className="stress-relief-eyebrow">WELLNESS TOOLKIT</p>
        <h2 id="stress-relief-title">Stress Relief &amp; Grounding Center</h2>
        <p>Take a pause, find one steady point, and choose a small next step. You can stop any exercise whenever you need.</p>
      </div>

      <div className="stress-tool-grid">
        <article className="stress-tool-card">
          <span className="stress-tool-icon" aria-hidden="true">🌿</span>
          <h3>Guided Breathing</h3>
          <p className="stress-tool-intro">A gentle breathing pause. Keep your breath natural and comfortable—no breath-holding required.</p>
          <div className="breathing-step" aria-live="polite">
            <span>STEP {breathingStep + 1} OF {breathingSteps.length}</span>
            <h4>{breathingSteps[breathingStep].title}</h4>
            <p>{breathingSteps[breathingStep].detail}</p>
          </div>
          <button type="button" onClick={nextBreathingStep}>Next breathing step</button>
          <button type="button" className="stress-secondary-button" onClick={() => setBreathingStep(0)}>Start again</button>
        </article>

        <article className="stress-tool-card">
          <span className="stress-tool-icon" aria-hidden="true">🌎</span>
          <h3>5-4-3-2-1 Grounding</h3>
          <p className="stress-tool-intro">Use your senses to notice the present moment. Skip anything that does not feel comfortable or accessible.</p>
          <div className="grounding-progress"><span>{completedGrounding} of 5 noticed</span><div role="progressbar" aria-label="Grounding steps completed" aria-valuemin="0" aria-valuemax="5" aria-valuenow={completedGrounding}><i style={{ width: `${completedGrounding * 20}%` }} /></div></div>
          <ul className="grounding-list">
            {groundingSteps.map((step, index) => (
              <li key={step}>
                <label><input type="checkbox" checked={Boolean(groundingChecked[index])} onChange={() => toggleGrounding(index)} /><span>{step}</span></label>
              </li>
            ))}
          </ul>
          <button type="button" className="stress-secondary-button" onClick={resetGrounding}>Reset grounding steps</button>
        </article>

        <article className="stress-tool-card">
          <span className="stress-tool-icon" aria-hidden="true">☀️</span>
          <h3>Quick Stress Reset</h3>
          <p className="stress-tool-intro">Choose one small action. You do not need to complete the whole list.</p>
          <ul className="stress-reset-list">{resetIdeas.map(idea => <li key={idea}>{idea}</li>)}</ul>
        </article>

        <article className="stress-tool-card stress-affirmation-card">
          <span className="stress-tool-icon" aria-hidden="true">💛</span>
          <h3>Calming Affirmation</h3>
          <p className="stress-affirmation" aria-live="polite">“{affirmations[affirmationIndex]}”</p>
          <button type="button" onClick={nextAffirmation}>Show another affirmation</button>
        </article>
      </div>

      <div className="stress-calm-corner">
        <h3>Your Calm Corner</h3>
        <p>Give yourself permission to pause. Feel your feet supported, soften your shoulders if you can, and choose the next kind thing you can do for yourself.</p>
        <p><strong>Remember:</strong> You are allowed to take this at your own pace. If an exercise makes you feel more uncomfortable, stop and choose something else that feels safer.</p>
      </div>

      <p className="stress-privacy-note">These tools provide general wellness education and are not medical or mental health treatment. If you feel in immediate danger or may harm yourself or someone else, contact local emergency services or a crisis service for immediate support.</p>
    </section>
  );
}

export default StressReliefCenter;
