import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import './MemberDirectory.css';

function initials(name) {
  return (name || 'Movement Member')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

function MemberDirectory() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionReady, setConnectionReady] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyMember, setBusyMember] = useState('');
  const [notice, setNotice] = useState('');

  async function loadConnections(currentUser) {
    if (!currentUser || !supabase) return;
    const { data, error } = await supabase
      .from('member_connections')
      .select('id, requester_id, recipient_id, status')
      .or(`requester_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);
    if (error) {
      setConnectionReady(false);
      setConnections([]);
      return;
    }
    setConnections(data || []);
    setConnectionReady(true);
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    // Ignore older directory requests when the signed-in account changes.
    let requestVersion = 0;

    async function loadMembers(currentUser) {
      const requestId = ++requestVersion;
      if (!currentUser) {
        setMembers([]);
        setConnections([]);
        setConnectionReady(false);
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

      if (!active || requestId !== requestVersion) return;
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

      const { data: connectionData, error: connectionError } = await supabase
        .from('member_connections')
        .select('id, requester_id, recipient_id, status')
        .or(`requester_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);

      if (!active || requestId !== requestVersion) return;
      setMembers(visibleMembers);
      setConnections(connectionData || []);
      setConnectionReady(!connectionError);
      if (connectionError) {
        setNotice('Member profiles are ready. Connection requests will be available after the community database update is applied.');
      }
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

  function connectionFor(memberId) {
    return connections.find(connection =>
      (connection.requester_id === user?.id && connection.recipient_id === memberId) ||
      (connection.requester_id === memberId && connection.recipient_id === user?.id)
    );
  }

  async function sendConnectionRequest(memberId) {
    if (!user || !connectionReady || busyMember) return;
    setBusyMember(memberId);
    setNotice('');
    const existing = connectionFor(memberId);

    if (existing?.status === 'accepted' || (existing?.status === 'pending' && existing.requester_id === user.id)) {
      setBusyMember('');
      return;
    }

    if (existing?.status === 'pending' && existing.recipient_id === user.id) {
      const { error } = await supabase
        .from('member_connections')
        .update({ status: 'accepted' })
        .eq('id', existing.id);
      if (error) setNotice('We could not accept that request. Please try again.');
    } else {
      if (existing) {
        const { error: deleteError } = await supabase
          .from('member_connections')
          .delete()
          .eq('id', existing.id);
        if (deleteError) {
          setNotice('We could not refresh that connection request. Please try again.');
          setBusyMember('');
          return;
        }
      }
      const { error } = await supabase
        .from('member_connections')
        .insert({ requester_id: user.id, recipient_id: memberId, status: 'pending' });
      if (error) setNotice('We could not send that connection request. It may already exist.');
    }

    await loadConnections(user);
    setBusyMember('');
  }

  async function declineConnectionRequest(memberId) {
    if (!user || busyMember) return;
    const existing = connectionFor(memberId);
    if (!existing || existing.recipient_id !== user.id || existing.status !== 'pending') return;
    setBusyMember(memberId);
    const { error } = await supabase
      .from('member_connections')
      .update({ status: 'declined' })
      .eq('id', existing.id);
    if (error) setNotice('We could not decline that request. Please try again.');
    await loadConnections(user);
    setBusyMember('');
  }

  function connectionActions(member) {
    if (member.id === user?.id) {
      return <span className="member-connection-self">Your profile</span>;
    }
    const connection = connectionFor(member.id);
    if (!connectionReady) {
      return <span className="member-connection-pending">Connections setting up</span>;
    }
    if (connection?.status === 'accepted') {
      return <span className="member-connection-connected">✓ Connected</span>;
    }
    if (connection?.status === 'pending' && connection.requester_id === user?.id) {
      return <span className="member-connection-pending">Request sent</span>;
    }
    if (connection?.status === 'pending' && connection.recipient_id === user?.id) {
      return (
        <div className="member-connection-actions">
          <button type="button" onClick={() => sendConnectionRequest(member.id)} disabled={busyMember === member.id}>
            {busyMember === member.id ? 'Working…' : 'Accept request'}
          </button>
          <button type="button" className="member-connection-decline" onClick={() => declineConnectionRequest(member.id)} disabled={busyMember === member.id}>
            Decline
          </button>
        </div>
      );
    }
    return (
      <button
        type="button"
        className="member-connect-button"
        onClick={() => sendConnectionRequest(member.id)}
        disabled={Boolean(busyMember) || !connectionReady}
      >
        {busyMember === member.id ? 'Sending…' : 'Connect'}
      </button>
    );
  }

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
                    <div className="member-connection-control">{connectionActions(member)}</div>
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
          <p className="member-directory-privacy">Profiles are visible only to signed-in members. Connection requests are private to the two members involved. Share only information you are comfortable showing to the community.</p>
        </>
      )}
    </section>
  );
}

export default MemberDirectory;
