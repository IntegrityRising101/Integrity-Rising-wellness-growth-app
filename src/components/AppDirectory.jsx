import { useMemo, useState } from 'react';
import './AppDirectory.css';

const destinations = [
  { title: 'My Account & Dashboard', category: 'Personal', target: 'dashboard', description: 'Sign in, view your personal dashboard, and access your check-ins.', keywords: 'account profile member progress' },
  { title: 'Mood Tracker', category: 'Wellness', target: 'dashboard', description: 'Record a mood check-in and notice patterns over time.', keywords: 'feelings emotions mood mental health' },
  { title: 'Wellness Support', category: 'Wellness', target: 'wellness', description: 'Explore guided coping tools and supportive wellness conversations.', keywords: 'stress anxiety grounding journaling' },
  { title: 'AI Tools & Providers', category: 'Wellness', target: 'wellness', description: 'Find the AI resource hub and review privacy information before using external tools.', keywords: 'chatgpt meta muse grok gemini manus deepseek' },
  { title: 'Women’s Wellness', category: 'Wellness', target: 'wellness', description: 'Open women’s wellness check-in resources.', keywords: 'women health wellbeing' },
  { title: 'Community Discussions', category: 'Community', target: 'community', description: 'Connect, share support, and take part in moderated discussions.', keywords: 'posts comments connection support' },
  { title: 'Integrity Rising Academy', category: 'Learning', target: 'academy', description: 'Explore learning resources, courses, and personal growth tools.', keywords: 'courses workbook education learn grow' },
  { title: 'Mental Health Services', category: 'Safety & Support', target: 'safety', description: 'Find mental health and crisis support information.', keywords: 'therapy counseling crisis help' },
  { title: 'Find Local Support', category: 'Safety & Support', target: 'safety', description: 'Look for shelters, counseling, legal help, housing, and family services.', keywords: 'shelter housing legal services local' },
  { title: 'State Resource Directory', category: 'Safety & Support', target: 'safety', description: 'Browse domestic violence resources by state.', keywords: 'domestic violence hotline state directory' },
  { title: 'Personal Safety Plan', category: 'Safety & Support', target: 'safety', description: 'Review practical safety-planning steps and considerations.', keywords: 'safety plan trusted people essentials' },
  { title: 'Incident & Documentation Tools', category: 'Safety & Support', target: 'safety', description: 'Find the incident documentation area and read its privacy considerations.', keywords: 'incident record document evidence vault' },
];

const categories = ['All', 'Personal', 'Wellness', 'Community', 'Learning', 'Safety & Support'];

function AppDirectory() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredDestinations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return destinations.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = !term || `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section className="app-directory" aria-labelledby="directory-title">
      <div className="directory-heading">
        <p className="section-kicker">QUICK ACCESS</p>
        <h2 id="directory-title">What are you looking for?</h2>
        <p>Search the app or choose a section below. You can come back here whenever you need a shortcut.</p>
      </div>

      <label className="directory-search-label" htmlFor="app-directory-search">Search Integrity Rising</label>
      <input
        id="app-directory-search"
        className="directory-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Try “mood”, “shelter”, “courses” or “community”"
      />

      <div className="directory-filters" aria-label="Filter app sections">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? 'directory-filter active' : 'directory-filter'}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="directory-result-count" aria-live="polite">
        {filteredDestinations.length} {filteredDestinations.length === 1 ? 'resource' : 'resources'} found
      </p>

      {filteredDestinations.length > 0 ? (
        <div className="directory-grid">
          {filteredDestinations.map((item) => (
            <a className="directory-card" href={`#${item.target}`} key={item.title}>
              <span className="directory-card-category">{item.category}</span>
              <span className="directory-card-title">{item.title}</span>
              <span className="directory-card-description">{item.description}</span>
              <span className="directory-card-link">Go to section <span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      ) : (
        <div className="directory-empty">
          <strong>No matching sections found.</strong>
          <p>Try a different word or choose “All”.</p>
          <button type="button" onClick={() => { setSearch(''); setCategory('All'); }}>Clear search</button>
        </div>
      )}
    </section>
  );
}

export default AppDirectory;
