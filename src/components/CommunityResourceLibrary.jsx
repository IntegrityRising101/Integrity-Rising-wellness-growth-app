import { useMemo, useState } from 'react';
import './CommunityResourceLibrary.css';

const resources = [
  { title: '988 Suicide & Crisis Lifeline', category: 'Crisis support', description: 'Free, confidential support by call or text for people experiencing emotional distress or a suicidal crisis.', url: 'https://988lifeline.org/', source: '988 Lifeline' },
  { title: 'SAMHSA National Helpline', category: 'Recovery', description: 'Confidential treatment referral and information for mental health and substance use concerns.', url: 'https://www.samhsa.gov/find-help/helplines/national-helpline', source: 'SAMHSA' },
  { title: 'NAMI — Mental Health Information', category: 'Mental wellness', description: 'Learn about mental health conditions, support, treatment, and ways to help someone you care about.', url: 'https://www.nami.org/about-mental-illness/', source: 'National Alliance on Mental Illness' },
  { title: 'Mental Health America — Self-Help Tools', category: 'Mental wellness', description: 'Explore educational tools, screening resources, and practical ways to support mental well-being.', url: 'https://mhanational.org/mental-health-screening-tools/', source: 'Mental Health America' },
  { title: 'The National Domestic Violence Hotline', category: 'Healthy relationships & safety', description: 'Confidential support, safety planning, and information for people affected by domestic violence.', url: 'https://www.thehotline.org/', source: 'The Hotline' },
  { title: 'Love Is Respect', category: 'Healthy relationships & safety', description: 'Understand healthy relationships, boundaries, warning signs, and ways to get support.', url: 'https://www.loveisrespect.org/', source: 'Love Is Respect' },
  { title: '211 — Find Local Help', category: 'Practical support', description: 'Connect with local help for housing, food, bills, transportation, and other essential needs.', url: 'https://www.211.org/', source: '211' },
  { title: 'MedlinePlus — Mental Health', category: 'Learning & personal growth', description: 'Reliable, plain-language health information from the U.S. National Library of Medicine.', url: 'https://medlineplus.gov/mentalhealth.html', source: 'MedlinePlus' },
  { title: 'CDC — Coping with Stress', category: 'Learning & personal growth', description: 'Evidence-informed information about stress, coping, and caring for emotional well-being.', url: 'https://www.cdc.gov/mental-health/living-with/index.html', source: 'Centers for Disease Control and Prevention' }
];
const categories = ['All resources', ...new Set(resources.map((resource) => resource.category))];

function CommunityResourceLibrary() {
  const [category, setCategory] = useState('All resources');
  const [search, setSearch] = useState('');
  const visibleResources = useMemo(() => resources.filter((resource) => {
    const matchesCategory = category === 'All resources' || resource.category === category;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [resource.title, resource.category, resource.description, resource.source].some((value) => value.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  }), [category, search]);

  return (
    <section className="community-resource-library" aria-labelledby="community-resource-title">
      <div className="resource-library-heading">
        <p className="section-kicker">LEARN • CONNECT • FIND SUPPORT</p>
        <h2 id="community-resource-title">Community Resource Library</h2>
        <p>A carefully organized starting point for trusted information, practical support, and personal growth. Explore at your own pace.</p>
      </div>
      <div className="resource-library-controls">
        <label><span>Search resources</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try stress, recovery, relationships..." /></label>
        <label><span>Choose a topic</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <p className="resource-library-count" aria-live="polite">{visibleResources.length} {visibleResources.length === 1 ? 'resource' : 'resources'} found</p>
      <div className="resource-library-grid">
        {visibleResources.map((resource) => <article className="resource-library-card" key={resource.title}>
          <span className="resource-library-category">{resource.category}</span><h3>{resource.title}</h3><p>{resource.description}</p>
          <span className="resource-library-source">Provided by {resource.source}</span>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">Visit resource <span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
      {visibleResources.length === 0 && <p className="resource-library-empty">No resources match that search. Try another word or choose All resources.</p>}
      <div className="resource-library-note"><strong>A note about support:</strong> These links lead to independent organizations and are shared for education and connection. Integrity Rising does not control their services or guarantee their availability. If someone is in immediate danger, call 911. In the U.S., call or text 988 for suicide or emotional crisis support. This library is not monitored for emergencies.</div>
    </section>
  );
}
export default CommunityResourceLibrary;
