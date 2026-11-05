import { useMemo, useState } from 'react';
import './PersonalSafetyPlan.css';

const planSections = [
  {
    title: 'Immediate safety',
    items: [
      'Identify a place I could go if I needed to leave quickly.',
      'Think about safer areas with exits and fewer potential hazards.',
      'Choose a code word I could use with someone I trust.',
      'Consider when it may be safest to contact an advocate.',
    ],
  },
  {
    title: 'Trusted support',
    items: [
      'Identify one person I may be able to contact safely.',
      'Decide how and when it is safe for that person to contact me.',
      'Consider a local domestic violence advocate or shelter.',
      'Make a plan for children or dependents, if applicable.',
    ],
  },
  {
    title: 'Essentials and practical needs',
    items: [
      'Consider what essential medication or medical supplies I may need.',
      'Think about access to identification and important documents.',
      'Consider keys, transportation, money, and basic necessities.',
      'Plan for pets or service animals, if applicable.',
    ],
  },
  {
    title: 'Digital and device privacy',
    items: [
      'Consider whether someone else can access this device or account.',
      'Review location sharing and shared account access when safe.',
      'Use a safer device to seek help if I think this one is monitored.',
      'Avoid saving this plan if doing so could increase risk.',
    ],
  },
];

export default function PersonalSafetyPlan() {
  const [checkedItems, setCheckedItems] = useState({});
  const [showResources, setShowResources] = useState(false);

  const totalItems = useMemo(
    () => planSections.reduce((total, section) => total + section.items.length, 0),
    []
  );
  const completedItems = Object.values(checkedItems).filter(Boolean).length;

  function toggleItem(key) {
    setCheckedItems((current) => ({ ...current, [key]: !current[key] }));
  }

  function clearChecklist() {
    setCheckedItems({});
  }

  return (
    <section className="personal-safety-plan" aria-labelledby="personal-safety-title">
      <div className="safety-plan-heading">
        <p className="safety-plan-kicker">YOUR CHOICES • YOUR PACE</p>
        <h2 id="personal-safety-title">Personal Safety Planning Center</h2>
        <p>A private, practical checklist to help you think through support and next steps.</p>
      </div>

      <div className="safety-plan-warning" role="note">
        <strong>Before you begin:</strong> Your safety comes first. This checklist is not saved
        to an account or sent to a server; it stays in this page's current memory and clears
        when you refresh or leave. If someone may monitor your device, consider not using this
        tool and seek help from a safer device. A quick-exit button cannot erase browser history,
        network records, or monitoring software.
      </div>

      <div className="safety-plan-progress" aria-live="polite">
        <span>{completedItems} of {totalItems} considerations checked</span>
        <div className="safety-plan-progress-track" aria-label={`${completedItems} of ${totalItems} checked`}>
          <span style={{ width: `${(completedItems / totalItems) * 100}%` }} />
        </div>
      </div>

      {planSections.map((section, sectionIndex) => (
        <fieldset className="safety-plan-group" key={section.title}>
          <legend>{section.title}</legend>
          {section.items.map((item, itemIndex) => {
            const key = `${sectionIndex}-${itemIndex}`;
            return (
              <label className="safety-plan-check" key={key}>
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[key])}
                  onChange={() => toggleItem(key)}
                />
                <span>{item}</span>
              </label>
            );
          })}
        </fieldset>
      ))}

      <div className="safety-plan-actions">
        <button type="button" onClick={clearChecklist} disabled={completedItems === 0}>
          Clear checklist
        </button>
        <button type="button" onClick={() => setShowResources((value) => !value)}>
          {showResources ? 'Hide support contacts' : 'Show support contacts'}
        </button>
      </div>

      {showResources && (
        <div className="safety-plan-resources">
          <h3>U.S. support options</h3>
          <p><strong>Immediate danger:</strong> Call 911 if it is safe to do so.</p>
          <p><strong>National Domestic Violence Hotline:</strong> 1-800-799-SAFE (7233)</p>
          <p><strong>Text:</strong> START to 88788</p>
          <p><strong>Website:</strong> <a href="https://www.thehotline.org/" target="_blank" rel="noreferrer">thehotline.org</a></p>
          <p>Advocates can help you consider options and make a plan that fits your situation. Contact may not be safe from a monitored device.</p>
        </div>
      )}

      <p className="safety-plan-disclaimer">
        This tool is educational and does not replace an individualized safety plan with a
        trained domestic violence advocate. You do not need to complete every item, and you
        can stop at any time.
      </p>
    </section>
  );
}
