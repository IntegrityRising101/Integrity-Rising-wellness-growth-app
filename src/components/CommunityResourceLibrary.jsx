import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
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
  const [user, setUser] = useState(null);
  const [savedResources, setSavedResources] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [busyResource, setBusyResource] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    async function loadSaved(currentUser) {
      setUser(currentUser || null);
      if (!currentUser) {
        setSavedResources([]);
        return;
      }
      const { data, error } = await supabase
        .from('saved_resources')
        .select('resource_key')
        .eq('user_id', currentUser.id)
        .order('saved_at', { ascending: false });
      if (!active) return;
      if (error) {
        setMessage('We could not load your saved resources. Please refresh and try again.');
        return;
      }
      setSavedResources((data || []).map((row) => row.resource_key));
      setMessage('');
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setMessage('We could not check your sign-in status.');
        return;
      }
      loadSaved(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSaved(session?.user || null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const visibleResources = useMemo(() => resources.filter((resource) => {
    const matchesCategory = category === 'All resources' || resource.category === category;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [resource.title, resource.category, resource.description, resource.source].some((value) => value.toLowerCase().includes(term));
    const matchesSaved = !savedOnly || savedResources.includes(resource.url);
    return matchesCategory && matchesSearch && matchesSaved;
  }), [category, search, savedOnly, savedResources]);

  async function toggleSaved(resource) {
    if (!supabase || !user || busyResource) {
      if (!user) setMessage('Sign in to your member account to save resources privately.');
      return;
    }
    setBusyResource(resource.url);
    setMessage('');
    const isSaved = savedResources.includes(resource.url);
    const result = isSaved
      ? await supabase.from('saved_resources').delete().eq('user_id', user.id).eq('resource_key', resource.url)
      : await supabase.from('saved_resources').insert({ user_id: user.id, resource_key: resource.url, resource_type: 'community' });
    if (result.error) {
      setMessage('We could not update your saved resources. Please try again.');
    } else {
      setSavedResources((current) => isSaved
        ? current.filter((key) => key !== resource.url)
        : [...current, resource.url]);
      setMessage(isSaved ? 'Resource removed from your saved list.' : 'Resource saved to your member account.');
    }
    setBusyResource('');
  }

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
      <div className="resource-library-actions">
        <button type="button" className={savedOnly ? 'resource-saved-filter active' : 'resource-saved-filter'} onClick={() => setSavedOnly((current) => !current)} disabled={!user}>
          {savedOnly ? 'Show all resources' : `My saved resources (${savedResources.length})`}
        </button>
        {!user && <span>Sign in to save resources to your member account.</span>}
      </div>
      {message && <p className="resource-library-status" role="status">{message}</p>}
      <p className="resource-library-count" aria-live="polite">{visibleResources.length} {visibleResources.length === 1 ? 'resource' : 'resources'} found</p>
      <div className="resource-library-grid">
        {visibleResources.map((resource) => {
          const isSaved = savedResources.includes(resource.url);
          return <article className="resource-library-card" key={resource.title}>
            <span className="resource-library-category">{resource.category}</span><h3>{resource.title}</h3><p>{resource.description}</p>
            <span className="resource-library-source">Provided by {resource.source}</span>
            <div className="resource-library-card-actions">
              <a href={resource.url} target="_blank" rel="noopener noreferrer">Visit resource <span aria-hidden="true">↗</span></a>
              <button type="button" className={isSaved ? 'resource-save-button is-saved' : 'resource-save-button'} onClick={() => toggleSaved(resource)} disabled={!user || busyResource === resource.url}>
                {busyResource === resource.url ? 'Saving…' : isSaved ? '♥ Saved' : '＋ Save'}
              </button>
            </div>
          </article>;
        })}
      </div>
      {visibleResources.length === 0 && <p className="resource-library-empty">{savedOnly ? 'You have no saved resources matching these filters yet.' : 'No resources match that search. Try another word or choose All resources.'}</p>}
      <div className="resource-library-note"><strong>A note about support:</strong> These links lead to independent organizations and are shared for education and connection. Integrity Rising does not control their services or guarantee their availability. If someone is in immediate danger, call 911. In the U.S., call or text 988 for suicide or emotional crisis support. This library is not monitored for emergencies.</div>
    </section>
  );
}
export default CommunityResourceLibrary;
