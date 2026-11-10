import { useMemo, useState } from 'react';
import './MentalHealthServices.css';

const services = [
  {
    category: 'Therapy and counseling',
    name: 'FindTreatment.gov',
    description: 'Search mental health and substance-use treatment facilities by location, services, setting, and payment options. The search is confidential and anonymous.',
    url: 'https://findtreatment.gov/',
    source: 'SAMHSA'
  },
  {
    category: 'Low-cost care',
    name: 'HRSA Find a Health Center',
    description: 'Find community health centers that provide care in underserved communities. Ask the center about behavioral health services, insurance, and sliding-fee options.',
    url: 'https://findahealthcenter.hrsa.gov/',
    source: 'Health Resources and Services Administration'
  },
  {
    category: 'Therapy and counseling',
    name: 'FindSupport.gov',
    description: 'Learn how to get behavioral health care, understand treatment choices, and find ways to pay for care.',
    url: 'https://findsupport.gov/',
    source: 'SAMHSA'
  },
  {
    category: 'Peer and family support',
    name: 'NAMI – Find Your Local NAMI',
    description: 'Connect with local NAMI organizations for education, peer support, and family support resources.',
    url: 'https://www.nami.org/find-your-local-nami/',
    source: 'National Alliance on Mental Illness'
  },
  {
    category: 'Children, youth, and families',
    name: 'AACAP Child and Adolescent Psychiatrist Finder',
    description: 'Find child and adolescent psychiatry resources and learn about mental health care for young people.',
    url: 'https://mobile.aacap.org/AACAP/Families_and_Youth/Resources/CAP_Finder.aspx',
    source: 'American Academy of Child and Adolescent Psychiatry'
  },
  {
    category: 'Psychiatry and medication',
    name: 'American Psychiatric Association – Find a Psychiatrist',
    description: 'Use the professional association’s psychiatrist-finder resource to look for psychiatric care.',
    url: 'https://www.psychiatry.org/psychiatrists/search-directories-databases',
    source: 'American Psychiatric Association'
  },
  {
    category: 'Addiction and recovery',
    name: 'SAMHSA National Helpline',
    description: 'Free, confidential, 24/7 treatment referral and information for mental health and substance-use concerns. Call 1-800-662-HELP (4357).',
    url: 'https://www.samhsa.gov/find-help',
    source: 'SAMHSA'
  },
  {
    category: 'Veterans',
    name: 'Veterans Crisis Line',
    description: 'Veterans and people supporting them can call 988 and press 1, text 838255, or use online chat.',
    url: 'https://www.veteranscrisisline.net/',
    source: 'U.S. Department of Veterans Affairs'
  },
  {
    category: 'Crisis support',
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support 24 hours a day, 7 days a week. Call or text 988, or use online chat.',
    url: 'https://988lifeline.org/',
    source: '988 Lifeline'
  },
  {
    category: 'Crisis support',
    name: 'Disaster Distress Helpline',
    description: 'Crisis counseling for emotional distress related to natural or human-caused disasters. Call or text 1-800-985-5990.',
    url: 'https://www.samhsa.gov/find-help/disaster-distress-helpline',
    source: 'SAMHSA'
  }
];

const categories = ['All services', ...new Set(services.map((service) => service.category))];

export default function MentalHealthServices() {
  const [category, setCategory] = useState('All services');
  const [search, setSearch] = useState('');

  const visibleServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = category === 'All services' || service.category === category;
      const searchable = [service.name, service.description, service.source, service.category].join(' ').toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [category, search]);

  return (
    <section className="mental-health-services" aria-labelledby="mental-health-services-title">
      <div className="mental-health-heading">
        <p className="mental-health-kicker">CARE • SUPPORT • RECOVERY</p>
        <h2 id="mental-health-services-title">Mental Health Services Center</h2>
        <p>Explore trusted starting points for counseling, psychiatric care, affordable treatment, recovery, and support.</p>
      </div>

      <section className="urgent-support-panel" aria-labelledby="urgent-support-title">
        <p className="urgent-support-kicker">YOU DESERVE SUPPORT</p>
        <h3 id="urgent-support-title">Need Immediate Support?</h3>
        <p className="urgent-support-intro">If you or someone you know is struggling, help is available. You do not have to face a difficult moment alone.</p>
        <div className="urgent-support-grid">
          <article className="urgent-support-card urgent-support-crisis">
            <h4>Suicide & Mental Health Crisis</h4>
            <p>Call or text <strong>988</strong> any time, day or night, for free, confidential support. You do not have to be suicidal to reach out.</p>
            <div><a href="tel:988">Call 988</a><a href="sms:988">Text 988</a><a href="https://988lifeline.org/chat/" target="_blank" rel="noreferrer">Chat online ↗</a></div>
          </article>
          <article className="urgent-support-card">
            <h4>Immediate Danger</h4>
            <p>If someone is in immediate danger or needs urgent medical help, call 911 or go to the nearest emergency department.</p>
            <a href="tel:911">Call 911</a>
          </article>
          <article className="urgent-support-card">
            <h4>Domestic Violence Support</h4>
            <p>Confidential support, safety planning, and help exploring options.</p>
            <div><a href="tel:18007997233">Call 1-800-799-SAFE</a><a href="sms:88788">Text START to 88788</a><a href="https://www.thehotline.org/" target="_blank" rel="noreferrer">Visit the hotline ↗</a></div>
          </article>
          <article className="urgent-support-card">
            <h4>Substance Use & Recovery</h4>
            <p>Free, confidential treatment referral and information, available 24/7.</p>
            <a href="tel:18006624357">Call 1-800-662-HELP (4357)</a>
          </article>
          <article className="urgent-support-card">
            <h4>Local Help: Housing, Food & More</h4>
            <p>Call 211 to connect with local community services. Availability and services vary by area.</p>
            <div><a href="tel:211">Call 211</a><a href="https://www.211.org/" target="_blank" rel="noreferrer">Visit 211 ↗</a></div>
          </article>
        </div>
        <p className="urgent-support-reassurance">You are not alone. Reaching out for help is a sign of strength. You deserve support, compassion, and a chance to heal.</p>
        <p className="urgent-support-privacy">If you are concerned that someone monitors your device or messages, consider using a safer device. Do not rely on this app for emergency monitoring or crisis response.</p>
      </section>

      <div className="mental-health-search">
        <label htmlFor="mental-health-category">Filter by type of support</label>
        <select id="mental-health-category" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <label htmlFor="mental-health-search-input">Search services</label>
        <input id="mental-health-search-input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try therapy, low-cost, youth, veterans..." />
      </div>

      <p className="mental-health-count" aria-live="polite">Showing {visibleServices.length} of {services.length} services</p>
      <div className="mental-health-list">
        {visibleServices.map((service) => (
          <article className="mental-health-card" key={service.name}>
            <div className="mental-health-card-copy">
              <span className="mental-health-category">{service.category}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <small>Resource: {service.source}</small>
            </div>
            <a href={service.url} target="_blank" rel="noreferrer">Visit resource ↗</a>
          </article>
        ))}
        {visibleServices.length === 0 && <p>No matching services. Try another search or choose “All services.”</p>}
      </div>

      <div className="mental-health-start">
        <h3>Looking for care near you?</h3>
        <p>Use your city or ZIP code in these official directories to find nearby providers. Confirm availability, services, insurance acceptance, fees, and current contact details directly with each provider.</p>
        <a href="https://findtreatment.gov/" target="_blank" rel="noreferrer">Search mental health treatment by location ↗</a>
        <a href="https://findahealthcenter.hrsa.gov/" target="_blank" rel="noreferrer">Find a community health center ↗</a>
      </div>

      <div className="mental-health-disclaimer">
        <strong>Please know:</strong> This directory is educational and does not diagnose, provide treatment, or guarantee that a provider is accepting new clients. Services, costs, and eligibility can change. Contact providers directly to verify details. If privacy is a concern, consider whether your device, browser, email, or insurance account is monitored before searching or contacting a service.
      </div>
    </section>
  );
}
