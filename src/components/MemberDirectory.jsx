import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import './MemberDirectory.css';

function initials(name) {
  return (name || 'Movement Member')
    .trim()
    .split(/\\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

function MemberDirectory() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadMembers(currentUser) {
      if (!currentUser) {
        setMembers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotice('');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, bio, avatar_path, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!active) return;
      if (error) {
        setNotice('The member directory could not be loaded. Please try again later.');
        setMembers([]);
        setLoading(false);
        return;
      }

      const visibleMembers = await Promise.all((data || []).map(async profile => {
        let avatarUrl = '';
        if (profile.avatar_path) {
          const { data: signedImage } = await supabase.storage
            .from('member-avatars')
            .createSignedUrl(profile.avatar_path, 3600);
          avatarUrl = signedImage?.signedUrl || '';
        }
        return { ...profile, avatarUrl };
      }));

      if (!active) return;
      setMembers(visibleMembers);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setNotice('We could not check your sign-in. Please refresh the page.');
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      loadMembers(currentUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      loadMembers(currentUser);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter(member =>
      (member.display_name || '').toLowerCase().includes(term) ||
      (member.bio || '').toLowerCase().includes(term)
    );
  }, [members, search]);

  return (
    <section className="member-directory" aria-labelledby="member-directory-title">
      <div className="member-directory-heading">
        <p className="member-directory-kicker">CONNECTION • COMMUNITY • GROWTH</p>
        <h3 id="member-directory-title">Meet the Members</h3>
        <p>Get to know the people growing alongside you. Every member’s journey is different, and every step forward matters.</p>
      </div>

      {!user ? (
        <div className="member-directory-message">
          <strong>Sign in to meet the community.</strong>
          <p>Member profiles are available to signed-in members only.</p>
        </div>
      ) : (
        <>
          <label className="member-directory-search-label" htmlFor="member-directory-search">Find a member</label>
          <input
            id="member-directory-search"
            className="member-directory-search"
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search names or bios"
          />
          {notice && <p className="member-directory-message" role="status">{notice}</p>}
          {loading ? (
            <p className="member-directory-message" role="status">Loading member profiles…</p>
          ) : filteredMembers.length ? (
            <div className="member-directory-grid">
              {filteredMembers.map(member => (
                <article className="member-directory-card" key={member.id}>
                  {member.avatarUrl ? (
                    <img className="member-directory-avatar" src={member.avatarUrl} alt="" />
                  ) : (
                    <div className="member-directory-avatar member-directory-avatar-placeholder" aria-hidden="true">
                      {initials(member.display_name)}
                    </div>
                  )}
                  <div className="member-directory-card-copy">
                    <h4>{member.display_name || 'Movement Member'}</h4>
                    <p>{member.bio || 'Growing, learning, and rising—one step at a time.'}</p>
                    {member.created_at && (
                      <span>Member since {new Date(member.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="member-directory-message">
              <strong>{search.trim() ? 'No matching members found.' : 'The community is just getting started.'}</strong>
              <p>{search.trim() ? 'Try another name or keyword.' : 'As members create profiles, they will appear here.'}</p>
            </div>
          )}
          <p className="member-directory-privacy">Profiles are visible only to signed-in members. Share only information you are comfortable showing to the community.</p>
        </>
      )}
    </section>
  );
}

export default MemberDirectory;
