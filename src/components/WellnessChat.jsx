import { useState } from 'react';
import './WellnessChat.css';

const guidance = {
  stress: {
    title: 'Let’s make this moment a little more manageable.',
    text: 'If it feels comfortable, place both feet on the floor and notice the support beneath you. Choose one small next step; the whole situation does not need to be solved at once.',
  },
  sad: {
    title: 'You deserve kindness, especially on difficult days.',
    text: 'A difficult feeling does not mean you are failing. Consider one gentle act of care, such as water, food, rest, or contacting someone you trust. If sadness persists or disrupts daily life, a qualified mental health professional may help.',
  },
  relationships: {
    title: 'Healthy relationships should allow room for safety and respect.',
    text: 'You have a right to boundaries, privacy, and choices without fear. If you feel unsafe, consider speaking with a trusted support person or domestic violence advocate. Do not confront someone if doing so could put you at risk.',
  },
  confidence: {
    title: 'Confidence can grow through small, consistent steps.',
    text: 'Think of one choice you made recently that reflects your values. Give yourself credit for that step. You do not need to have everything figured out to keep moving forward.',
  },
  sleep: {
    title: 'Let’s support your rest without adding pressure.',
    text: 'If possible, reduce screen stimulation and choose a quiet activity before bed. If sleep problems continue or affect daily life, consider discussing them with a healthcare professional.',
  },
  default: {
    title: 'Thank you for checking in.',
    text: 'I can offer general wellness information and practical coping ideas. Choose a topic below, or ask a general question without sharing names, addresses, or other identifying details.',
  },
};

const topics = [
  { label: 'Stress', key: 'stress' },
  { label: 'Feeling sad', key: 'sad' },
  { label: 'Relationships & boundaries', key: 'relationships' },
  { label: 'Confidence', key: 'confidence' },
  { label: 'Sleep', key: 'sleep' },
];

const crisisReply = {
  title: 'Please connect with immediate, human support.',
  text: 'This chat is not monitored and cannot contact emergency services. If you may act on thoughts of suicide or self-harm, call or text 988 in the U.S. now. If you are in immediate danger, have seriously harmed yourself, or may have overdosed, call 911 or go to an emergency department. If possible, move near a trusted person and away from anything you could use to hurt yourself. If calling is unsafe, consider texting 988 or asking someone you trust to stay with you.',
};

const violenceReply = {
  title: 'Your safety comes first. You deserve support.',
  text: 'If you are in immediate danger, call 911 if it is safe. In the U.S., contact the National Domestic Violence Hotline at 1-800-799-SAFE (7233), text START to 88788, or visit thehotline.org. For sexual assault support, RAINN is available at 1-800-656-HOPE (4673) and rainn.org. Use a safer device if you think yours may be monitored. You do not have to confront the person to seek help.',
};

function getResponse(message) {
  const normalized = message.toLowerCase();

  // Escalation checks run before general wellness topic matching.
  const suicideOrSelfHarm = /suicid|kill myself|end my life|take my life|self[- ]harm|hurt myself|cut myself|overdos|want to die|don't want to live|do not want to live|can't go on|cannot go on/.test(normalized);
  const immediatePhysicalRisk = /in immediate danger|right now.{0,20}(danger|unsafe)|about to hurt|going to hurt me|has a weapon|threatening me now|being attacked|can't breathe|cannot breathe/.test(normalized);
  const abuseOrViolence = /domestic violence|sexual assault|abuse|being abused|hit me|hitting me|threaten|threatening|violence|afraid of (him|her|them|my partner)|stalking|controlling partner|forced me/.test(normalized);

  if (suicideOrSelfHarm || immediatePhysicalRisk) return crisisReply;
  if (abuseOrViolence) return violenceReply;

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

      <div className="wellness-chat-safety" role="note">
        <strong>Important safety information</strong>
        <p>This chat is automated, not monitored by a person, and cannot assess danger or contact emergency services. If you may hurt yourself or someone else, or someone is in immediate danger, call 911 in the U.S. if safe. For suicide or emotional crisis support, call or text 988.</p>
        <p>For domestic violence support, call 1-800-799-SAFE (7233) or text START to 88788. If your device may be monitored, use a safer device when possible.</p>
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
          placeholder="Ask a general question. Please do not include names, addresses, or private identifying details."
          rows={3}
          maxLength={500}
        />
        <button type="submit" disabled={!message.trim()}>Get support</button>
      </form>

      {reply && (
        <div className="wellness-chat-reply" aria-live="polite">
          <h3>{reply.title}</h3>
          <p>{reply.text}</p>
          <p><strong>If this response does not fit your situation, seek help from a qualified person. This tool can misunderstand what you write.</strong></p>
        </div>
      )}

      <p className="wellness-chat-note">
        <strong>Prototype notice:</strong> This is a limited, rule-based demonstration, not a live AI,
        therapist, emergency service, or medical provider. It cannot diagnose, reliably detect every
        crisis, or guarantee a safe response. Messages are processed in this page component and are
        not saved or sent to an AI service. Avoid entering sensitive personal information.
      </p>
    </section>
  );
}

export default WellnessChat;
