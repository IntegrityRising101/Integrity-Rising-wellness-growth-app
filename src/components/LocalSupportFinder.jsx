import { useMemo, useState } from 'react';
import './LocalSupportFinder.css';

const serviceOptions = [
  ['domestic violence shelter', 'Emergency shelter'],
  ['domestic violence counseling', 'Counseling and support groups'],
  ['domestic violence legal aid', 'Legal help and protection orders'],
  ['domestic violence financial assistance housing', 'Housing and financial support'],
  ['domestic violence children family services', 'Children and family support'],
  ['sexual assault support services', 'Sexual assault services'],
];

export default function LocalSupportFinder() {
  const [location, setLocation] = useState('');
  const [service, setService] = useState(serviceOptions[0][0]);
  const [searched, setSearched] = useState(false);

  const searchUrl = useMemo(() => {
    const query = [service, location].filter(Boolean).join(' ');
    return 'https://www.google.com/search?q=' + encodeURIComponent(query + ' official nonprofit hotline services');
  }, [service, location]);

  function submitSearch(event) {
    event.preventDefault();
    if (!location.trim()) return;
    setSearched(true);
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <section className="local-support-finder" aria-labelledby="local-support-title">
      <div className="local-support-heading">
        <p className="local-support-kicker">LOCAL CONNECTIONS • PRACTICAL SUPPORT</p>
        <h2 id="local-support-title">Local Shelter & Support Finder</h2>
        <p>Search for nearby services by city, state, or ZIP code. You choose what information to enter; it is not saved in this app.</p>
      </div>

      <div className="local-support-alert" role="note">
        <strong>Need help right now?</strong>
        <p>Call 911 if you are in immediate danger and it is safe to do so. In the U.S., call <a href="tel:18007997233">1-800-799-SAFE (7233)</a>, text <strong>START</strong> to <a href="sms:88788">88788</a>, or use <a href="https://www.thehotline.org/" target="_blank" rel="noreferrer">the National Domestic Violence Hotline website</a>.</p>
        <p>For broader local social services, call <a href="tel:211">211</a> or visit <a href="https://www.211.org/" target="_blank" rel="noreferrer">211.org</a>. Availability and eligibility vary by location.</p>
      </div>

      <form className="local-support-form" onSubmit={submitSearch}>
        <label htmlFor="support-location">City, state, or ZIP code</label>
        <input id="support-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Example: St. Paul, MN or 55102" autoComplete="postal-code" required />
        <label htmlFor="support-service">What kind of support are you looking for?</label>
        <select id="support-service" value={service} onChange={(event) => setService(event.target.value)}>
          {serviceOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="submit">Search local support resources ↗</button>
        {searched && <p className="local-support-note" aria-live="polite">A search page was opened in a new tab. Confirm that each organization is legitimate, currently operating, and safe to contact before sharing personal information.</p>}
      </form>

      <div className="local-support-links">
        <h3>Trusted starting points</h3>
        <a href="https://www.thehotline.org/get-help/domestic-violence-local-resources/" target="_blank" rel="noreferrer">National Domestic Violence Hotline – local resources</a>
        <a href="https://www.211.org/" target="_blank" rel="noreferrer">211 – local housing, food, health, and social services</a>
        <a href="https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help" target="_blank" rel="noreferrer">Legal Services Corporation – find civil legal aid</a>
        <a href="https://www.hud.gov/findshelter" target="_blank" rel="noreferrer">HUD – find shelter and housing assistance</a>
      </div>

      <p className="local-support-privacy"><strong>Privacy reminder:</strong> If someone monitors your device, browser, phone, or accounts, searching or contacting services may leave traces. Consider using a safer device and ask an advocate about safe ways to follow up. This finder does not verify live bed availability and is not an emergency dispatch service.</p>
    </section>
  );
}
