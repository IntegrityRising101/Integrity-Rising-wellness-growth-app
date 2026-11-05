import { useState } from 'react';
import './AIPrivacyNotice.css';

export default function AIPrivacyNotice() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <section className="ai-privacy-notice" aria-labelledby="ai-privacy-title">
      <div className="ai-privacy-heading">
        <p className="ai-privacy-kicker">PRIVACY • TRANSPARENCY • CHOICE</p>
        <h2 id="ai-privacy-title">Your Privacy & AI Choices</h2>
        <p>Integrity Rising is building wellness tools with privacy and safety in mind. You should know what happens before sharing personal information.</p>
      </div>

      <div className="ai-privacy-status" role="status">
        <strong>Current app status: No live AI connection</strong>
        <p>The Wellness Support Chat is a limited, rule-based prototype. Its messages are handled in your current page session and are not sent to an AI provider by this component.</p>
      </div>

      <div className="ai-privacy-grid">
        <article>
          <h3>What a future AI feature may process</h3>
          <p>If a live AI service is added later, the text you choose to submit may be sent to that service to generate a response. The provider, purpose, retention, and security details must be disclosed before activation.</p>
        </article>
        <article>
          <h3>Your choices</h3>
          <ul>
            <li>Using non-AI wellness tools should remain possible.</li>
            <li>Do not share names, addresses, passwords, or identifying details.</li>
            <li>You should be able to decline AI processing without losing access to other app features.</li>
            <li>Do not use this app as an emergency or crisis-monitoring service.</li>
          </ul>
        </article>
        <article>
          <h3>Special care for safety information</h3>
          <p>Do not enter abuse disclosures, safety plans, medical details, or other highly sensitive information into a future AI feature until its privacy protections have been reviewed and clearly explained. A monitored device may expose activity even when an app does not save it.</p>
        </article>
      </div>

      <label className="ai-privacy-acknowledgment">
        <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} />
        <span>I have read this privacy notice.</span>
      </label>
      <p className="ai-privacy-ack-note" aria-live="polite">
        {acknowledged
          ? 'Acknowledgment applies only to this page session. It does not enable AI, create an account preference, or authorize sharing data with an AI provider.'
          : 'You can read this notice without checking the box. No AI processing is enabled by this control.'}
      </p>

      <p className="ai-privacy-footer"><strong>Before launch:</strong> A live AI integration must have a reviewed privacy policy, clear opt-in consent, a documented provider and data-flow explanation, secure server-side credentials, retention/deletion rules, and a tested crisis escalation plan. This prototype does not yet provide those features.</p>
    </section>
  );
}
