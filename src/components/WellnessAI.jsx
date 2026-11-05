import { useState } from 'react';
import './WellnessAI.css';

const tools = {
  grounding: {
    label: '5-4-3-2-1 grounding',
    title: 'Reconnect with the present',
    steps: [
      'Name 5 things you can see.',
      'Notice 4 things you can physically feel.',
      'Listen for 3 sounds.',
      'Identify 2 things you can smell, or two scents you enjoy.',
      'Notice 1 thing you can taste, or take one comfortable sip of water.',
    ],
    note: 'You can skip any step that feels uncomfortable. This is an option, not a test.',
  },
  breathing: {
    label: 'Gentle breathing',
    title: 'Make room for a steadier breath',
    steps: [
      'Sit or stand in a comfortable position.',
      'Breathe in gently, without forcing or holding your breath.',
      'Let your exhale be a little slower if that feels comfortable.',
      'Repeat for a few cycles, then return to your normal breathing.',
    ],
    note: 'Stop if you feel dizzy, short of breath, or uncomfortable. You do not need to change your breathing to use this app.',
  },
  emotions: {
    label: 'Understand a feeling',
    title: 'Notice the feeling without judging yourself',
    steps: [
      'Give the feeling a name, if you can: anger, fear, sadness, relief, or something else.',
      'Notice where you feel it in your body, without forcing yourself to explore.',
      'Ask: “What might I need right now?”',
      'Choose one safe, small response to that need.',
    ],
    note: 'Feelings are information, not instructions. You can pause before deciding what to do.',
  },
  boundaries: {
    label: 'Boundaries & relationships',
    title: 'A boundary can protect your well-being',
    steps: [
      'Identify what behavior or situation is not okay for you.',
      'Decide what you can control: your response, availability, or next step.',
      'Use a clear statement when it is safe: “I am not comfortable with that.”',
      'You do not owe someone a confrontation. If setting a boundary could put you at risk, prioritize safety and seek confidential support.',
    ],
    note: 'Controlling, threatening, or abusive behavior is not your fault. Safety planning with an advocate can help.',
  },
  journal: {
    label: 'Journaling prompt',
    title: 'A few words can help organize your thoughts',
    steps: [
      'What has been taking up the most space in my mind today?',
      'What is one thing I need more of right now?',
      'What is one small step I can take that feels safe and realistic?',
    ],
    note: 'You do not need to save or share your answers here. Avoid writing identifying details on a shared or monitored device.',
  },
  support: {
    label: 'Find human support',
    title: 'You do not have to handle everything alone',
    steps: [
      'Think of one person or service that feels safe and respectful.',
      'Choose what you want to ask for: listening, practical help, information, or company.',
      'You can say: “I am having a difficult time. Could you stay with me or help me find support?”',
      'If the first person is not helpful, it is okay to try another trusted person or professional.',
    ],
    note: 'This app is not monitored. A real person or qualified professional can provide support this tool cannot.',
  },
};

const moodGuidance = {
  Calm: 'Notice what is supporting your calm today. Is there one healthy routine you would like to keep?',
  Anxious: 'Try grounding yourself in the room around you. Focus on one manageable next step rather than the whole problem.',
  Overwhelmed: 'Pause where you can. Separate what needs attention now from what can wait, and ask for help with one specific task.',
  Sad: 'You deserve care on difficult days. Consider water, food, fresh air, rest, or reaching out to someone you trust.',
  Angry: 'If it is safe, create some space before responding. A short walk, stretching, or quiet time may help you decide what comes next.',
  Lonely: 'Connection can start small. Consider sending a simple message to someone safe or finding a supportive community or professional.',
  Numb: 'You do not have to force yourself to feel differently. Notice your surroundings and consider one gentle, basic act of care.',
};

function WellnessAI() {
  const [mood, setMood] = useState('');
  const [activeTool, setActiveTool] = useState('grounding');
  const [showTool, setShowTool] = useState(false);
  const selectedTool = tools[activeTool];

  return (
    <section className="wellness-ai" aria-labelledby="wellness-title">
      <div className="wellness-ai-heading">
        <span className="wellness-kicker">INTEGRITY RISING • WELLNESS SUPPORT</span>
        <h2 id="wellness-title">Wellness AI Support Center</h2>
        <p>A guided space for emotional wellness, coping skills, and your next small step.</p>
      </div>

      <div className="wellness-ai-panel">
        <h3>How are you feeling right now?</h3>
        <p className="wellness-ai-hint">Choose the word that feels closest. You can change it at any time.</p>
        <div className="wellness-ai-moods" role="group" aria-label="Choose your current feeling">
          {Object.keys(moodGuidance).map((option) => (
            <button
              type="button"
              key={option}
              className={mood === option ? 'wellness-ai-choice selected' : 'wellness-ai-choice'}
              aria-pressed={mood === option}
              onClick={() => setMood(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {mood && (
          <div className="wellness-ai-response" aria-live="polite">
            <h4>A supportive next step</h4>
            <p>{moodGuidance[mood]}</p>
            <button type="button" className="wellness-ai-text-button" onClick={() => setMood('')}>Clear check-in</button>
          </div>
        )}
      </div>

      <div className="wellness-ai-panel">
        <h3>Choose a coping tool</h3>
        <p className="wellness-ai-hint">Explore a practical exercise at your own pace.</p>
        <div className="wellness-ai-tools">
          {Object.entries(tools).map(([key, tool]) => (
            <button
              type="button"
              key={key}
              className={activeTool === key ? 'wellness-ai-tool selected' : 'wellness-ai-tool'}
              aria-pressed={activeTool === key}
              onClick={() => { setActiveTool(key); setShowTool(true); }}
            >
              {tool.label}
            </button>
          ))}
        </div>
        <div className="wellness-ai-response">
          <h4>{selectedTool.title}</h4>
          <ol>
            {selectedTool.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="wellness-ai-note">{selectedTool.note}</p>
          <button type="button" className="wellness-ai-text-button" onClick={() => setShowTool(!showTool)}>
            {showTool ? 'Hide exercise details' : 'I’m ready to try this'}
          </button>
          {showTool && <p className="wellness-ai-encouragement" aria-live="polite">Take your time. You can stop, skip a step, or choose another tool whenever you need.</p>}
        </div>
      </div>

      <div className="wellness-ai-crisis">
        <h3>When you need immediate or personal support</h3>
        <p><strong>Immediate danger:</strong> Call 911 if you are in the U.S. and it is safe to do so.</p>
        <p><strong>Emotional or suicide crisis:</strong> Call or text 988 in the U.S. for the Suicide &amp; Crisis Lifeline.</p>
        <p><strong>Domestic violence support:</strong> Call the National Domestic Violence Hotline at 1-800-799-SAFE (7233), or text START to 88788. If you think your device may be monitored, use a safer device when possible.</p>
        <p>If someone may be monitoring your device, consider whether it is safe to continue using it. Quick Exit may not erase browser history or activity.</p>
      </div>

      <p className="wellness-ai-disclaimer">
        <strong>Important:</strong> This is a guided prototype, not a live AI service, therapist,
        medical provider, or emergency service. It does not diagnose or monitor messages.
        Selections stay in this page session and are not sent to an AI service by this component.
        Avoid entering private or identifying information. A future AI connection will require
        secure backend services, privacy safeguards, and clear user consent.
      </p>
    </section>
  );
}

export default WellnessAI;
