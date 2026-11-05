import { useState } from 'react';

const guidance = {
  stress: {
    title: 'Let’s make this moment a little more manageable.',
    text: 'Try relaxing your shoulders, placing both feet on the floor, and taking a few comfortable, unforced breaths. Then choose just one small thing that needs your attention. You do not have to solve everything at once.',
  },
  sad: {
    title: 'You deserve kindness, especially on difficult days.',
    text: 'A hard feeling does not mean you are failing. If it feels right, try a small act of care: drink some water, eat something nourishing, step outside, or contact someone you trust. If this feeling persists or becomes hard to manage, a mental health professional can help.',
  },
  relationships: {
    title: 'Healthy relationships should allow room for safety and respect.',
    text: 'You have a right to boundaries, privacy, and the freedom to make choices without fear. If you feel unsafe with someone, consider speaking with a trusted support person or a domestic violence advocate. Avoid confronting someone if doing so could put you at risk.',
  },
  confidence: {
    title: 'Confidence can grow through small, consistent steps.',
    text: 'Think of one choice you made recently that reflects your values. Give yourself credit for that step. You do not need to have everything figured out to keep moving forward.',
  },
  sleep: {
    title: 'Let’s support your rest without adding pressure.',
    text: 'If possible, dim the lights, reduce screen stimulation, and choose a quiet activity before bed. If sleep problems continue or affect your daily life, consider discussing them with a healthcare professional.',
  },
  default: {
    title: 'Thank you for checking in.',
    text: 'I can offer general wellness information and practical coping ideas. Choose one topic below, or describe what kind of support you are looking for without sharing names, addresses, or other identifying details.',
  },
};

const topics = [
  { label: 'Stress', key: 'stress' },
  { label: 'Feeling sad', key: 'sad' },
  { label: 'Relationships & boundaries', key: 'relationships' },
  { label: 'Confidence', key: 'confidence' },
  { label: 'Sleep', key: 'sleep' },
];

function getResponse(message) {
  const normalized = message.toLowerCase();

  if (/suicid|kill myself|end my life|self[- ]harm|hurt myself/.test(normalized)) {
    return {
      title: 'You deserve immediate, human support.',
      text: 'If you may act on thoughts of suicide or self-harm, call or text 988 in the U.S. now. If you are in immediate danger or have already harmed yourself, call 911 or go to the nearest emergency department. If possible, move near a trusted person and away from anything you could use to hurt yourself.',
    };
  }

  if (/danger|unsafe|abuse|hit me|threaten|violence|afraid of (him|her|them|my partner)/.test(normalized)) {
    return {
      title: 'Your safety comes first.',
      text: 'If you are in immediate danger, call 911 if it is safe to do so. In the U.S., the National Domestic Violence Hotline is 1-800-799-SAFE (7233), or text START to 88788. Use a safer device if you think someone may monitor this one. You do not have to confront the person to seek help.',
    };
  }

  if (/stress|anxious|panic|overwhelm|worried/.test(normalized)) return guidance.stress;
  if (/sad|lonely|grief|depress/.test(normalized)) return guidance.sad;
  if (/relationship|partner|boundary|controlling|trust/.test(normalized)) return guidance.relationships;
  if (/confidence|self esteem|believe in myself|motivat/.test(normalized)) return guidance.confidence;
  if (/sleep|tired|insomnia/.test(normalized)) return guidance.sleep;
  return guidance.default;
}

function WellnessChat() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState(null);

  function sendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setReply(getResponse(message.trim()));
    setMessage('');
  }

  function chooseTopic(key) {
    setReply(guidance[key]);
  }

  return (
    <section className="wellness-chat" aria-labelledby="wellness-chat-title">
      <div className="wellness-chat-heading">
        <span className="wellness-kicker">A SUPPORTIVE SPACE</span>
        <h2 id="wellness-chat-title">Wellness Support Chat</h2>
        <p>Explore general coping ideas and supportive information at your own pace.</p>
      </div>

      <div className="wellness-topic-list" aria-label="Choose a support topic">
        {topics.map((topic) => (
          <button type="button" key={topic.key} onClick={() => chooseTopic(topic.key)}>
            {topic.label}
          </button>
        ))}
      </div>

      <form className="wellness-chat-form" onSubmit={sendMessage}>
        <label htmlFor="wellness-message">What would you like support with?</label>
        <textarea
          id="wellness-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share a general question. Please don't include names, addresses, or private identifying details."
          rows={3}
          maxLength={500}
        />
        <button type="submit" disabled={!message.trim()}>Get support</button>
      </form>

      {reply && (
        <div className="wellness-chat-reply" aria-live="polite">
          <h3>{reply.title}</h3>
          <p>{reply.text}</p>
        </div>
      )}

      <p className="wellness-chat-note">
        <strong>Prototype notice:</strong> This is a rule-based preview, not a live AI,
        therapist, emergency service, or medical provider. Messages are handled in this
        page component and are not saved or sent to an AI service. Avoid entering sensitive
        personal information.
      </p>
    </section>
  );
}

export default WellnessChat;
