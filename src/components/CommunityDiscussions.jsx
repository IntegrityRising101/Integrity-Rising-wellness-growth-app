import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './CommunityDiscussions.css';

const categories = [
  'Introductions',
  'Encouragement',
  'Healing & Growth',
  'Healthy Relationships',
  'Accountability',
  'General'
];

const reportReasons = [
  ['harassment', 'Harassment'],
  ['threat', 'Threats'],
  ['hate', 'Hate speech'],
  ['personal_information', 'Personal information'],
  ['spam', 'Spam'],
  ['other', 'Other']
];

function CommunityDiscussions() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [mySubmissions, setMySubmissions] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [category, setCategory] = useState(categories[0]);
  const [feedCategory, setFeedCategory] = useState('All topics');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [reportChoices, setReportChoices] = useState({});
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadCommunity() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError) {
        setNotice('We could not check your sign-in. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const [ownPostsResult, ownRepliesResult] = await Promise.all([
        supabase.from('community_posts')
          .select('id, title, body, status, created_at')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.from('community_comments')
          .select('id, body, status, created_at')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (!active) return;
      if (ownPostsResult.error || ownRepliesResult.error) {
        setNotice('Your submission status could not be loaded. Your community access is not affected.');
      } else {
        const ownItems = [
          ...(ownPostsResult.data || []).map(item => ({ ...item, kind: 'Post' })),
          ...(ownRepliesResult.data || []).map(item => ({ ...item, kind: 'Reply' }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
        setMySubmissions(ownItems);
      }

      const { data: blockData, error: blockError } = await supabase
        .from('user_blocks')
        .select('blocked_id')
        .eq('blocker_id', currentUser.id);
      if (!active) return;
      if (blockError) {
        setNotice('Your safety settings could not be loaded. Please refresh before using community controls.');
      }
      const blockedIds = (blockData || []).map(item => item.blocked_id);
      setBlockedUsers(blockedIds);

      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('id, user_id, category, title, body, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!active) return;
      if (postError) {
        setNotice('Community posts could not be loaded. Please try again later.');
        setLoading(false);
        return;
      }

      const visiblePosts = (postData || []).filter(post => !blockedIds.includes(post.user_id));
      setPosts(visiblePosts);

      if (visiblePosts.length) {
        const { data: commentData, error: commentError } = await supabase
          .from('community_comments')
          .select('id, post_id, user_id, body, created_at')
          .in('post_id', visiblePosts.map(post => post.id))
          .eq('status', 'published')
          .order('created_at', { ascending: true });

        if (!active) return;
        if (!commentError) {
          const grouped = {};
          (commentData || []).filter(comment => !blockedIds.includes(comment.user_id)).forEach(comment => {
            grouped[comment.post_id] = [...(grouped[comment.post_id] || []), comment];
          });
          setComments(grouped);
        }
      }
      setLoading(false);
    }

    loadCommunity();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setPosts([]);
      setComments({});
      setNotice('');
      if (!session?.user) setLoading(false);
      else {
        setLoading(true);
        loadCommunity();
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function publishPost(event) {
    event.preventDefault();
    if (!user || busy) return;
    if (!title.trim() || !body.trim()) {
      setNotice('Add a title and message before sharing.');
      return;
    }

    setBusy(true);
    setNotice('');
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        category,
        title: title.trim(),
        body: body.trim()
      })
      .select('id, user_id, category, title, body, status, created_at')
      .single();

    if (error) {
      setNotice('Your post could not be submitted. Please try again.');
    } else {
      setTitle('');
      setBody('');
      setMySubmissions(current => [{ ...data, kind: 'Post' }, ...current].slice(0, 10));
      setNotice('Your post was submitted for moderator review. It will appear in the community after approval.');
    }
    setBusy(false);
  }

  async function addReply(postId) {
    const message = (replyDrafts[postId] || '').trim();
    if (!message || !user || busy) return;

    setBusy(true);
    setNotice('');
    const { data, error } = await supabase
      .from('community_comments')
      .insert({ post_id: postId, user_id: user.id, body: message })
      .select('id, post_id, user_id, body, status, created_at')
      .single();

    if (error) {
      setNotice('Your reply could not be submitted. Please try again.');
    } else {
      setReplyDrafts(current => ({ ...current, [postId]: '' }));
      setMySubmissions(current => [{ ...data, kind: 'Reply' }, ...current].slice(0, 10));
      setNotice('Your reply was submitted for moderator review. It will appear after approval.');
    }
    setBusy(false);
  }

  async function blockMember(memberId) {
    if (!user || !memberId || memberId === user.id || busy || blockedUsers.includes(memberId)) return;
    setBusy(true);
    setNotice('');
    const { error } = await supabase.from('user_blocks').insert({ blocker_id: user.id, blocked_id: memberId });
    if (error) {
      setNotice('That member could not be blocked. Please try again.');
    } else {
      setBlockedUsers(current => [...current, memberId]);
      setPosts(current => current.filter(post => post.user_id !== memberId));
      setComments(current => Object.fromEntries(Object.entries(current).map(([postId, items]) => [postId, items.filter(item => item.user_id !== memberId)])));
      setNotice('Member blocked. Their community posts and replies are now hidden from your view.');
    }
    setBusy(false);
  }

  async function unblockMember(memberId) {
    if (!user || busy) return;
    setBusy(true);
    const { error } = await supabase.from('user_blocks').delete().eq('blocker_id', user.id).eq('blocked_id', memberId);
    if (error) setNotice('That member could not be unblocked. Please try again.');
    else {
      setBlockedUsers(current => current.filter(id => id !== memberId));
      setNotice('Member unblocked. Refresh the community to see any available conversations.');
    }
    setBusy(false);
  }

  async function reportPost(postId) {
    const reason = reportChoices[postId] || 'other';
    if (!user || busy) return;

    setBusy(true);
    setNotice('');
    const { error } = await supabase
      .from('community_reports')
      .insert({ reporter_id: user.id, post_id: postId, reason });

    setNotice(error
      ? 'We could not submit that report. Please try again.'
      : 'Thank you. Your report was submitted privately for review.');
    setBusy(false);
  }

  const filteredPosts = feedCategory === 'All topics'
    ? posts
    : posts.filter(post => post.category === feedCategory);

  if (!isSupabaseConfigured) {
    return (
      <section className="discussions-section" aria-labelledby="discussions-title">
        <div className="discussions-heading">
          <div>
            <p className="discussions-eyebrow">THE INTEGRITY MOVEMENT</p>
            <h2 id="discussions-title">Community Discussions</h2>
            <p>A supportive space for encouragement, shared learning, and respectful conversation.</p>
          </div>
          <span className="discussion-status">Setup needed</span>
        </div>
        <div className="discussion-guidelines">
          <h3>Community is being connected</h3>
          <p>Secure community posting requires the Supabase project URL and public client key to be configured. No posts or replies are being collected on this screen yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="discussions-section" aria-labelledby="discussions-title">
      <div className="discussions-heading">
        <div>
          <p className="discussions-eyebrow">THE INTEGRITY MOVEMENT</p>
          <h2 id="discussions-title">Community Discussions</h2>
          <p>Encouragement, shared learning, and respectful conversation—at your own pace.</p>
        </div>
        <span className="discussion-status">Members</span>
      </div>

      <section className="community-welcome-card" aria-labelledby="community-welcome-title">
        <p className="community-welcome-kicker">YOU BELONG HERE</p>
        <h3 id="community-welcome-title">A community built on encouragement, respect, and growth.</h3>
        <p>Whether you are taking your first step or continuing a long journey, you are welcome to learn, share, listen, and grow at your own pace.</p>
        <div className="community-welcome-prompts">
          <strong>New here? Start with an introduction.</strong>
          <span>Share only what feels comfortable: what name you would like members to use, one thing you are working toward, or what kind of encouragement helps you feel supported.</span>
        </div>
        <p className="community-welcome-reminder">You never have to share your personal history, contact details, location, or anything that does not feel safe.</p>
      </section>

      <section className="daily-encouragement-card" aria-labelledby="daily-encouragement-title">
        <p className="daily-encouragement-kicker">A LITTLE HOPE FOR TODAY</p>
        <h3 id="daily-encouragement-title">Daily Encouragement</h3>
        <blockquote>“You do not have to have it all figured out. One honest step forward is still progress.”</blockquote>
        <p>What is one kind word, helpful reminder, or small victory you could share to encourage someone today?</p>
        {user ? (
          <button type="button" onClick={() => {
            setCategory('Encouragement');
            document.getElementById('discussion-title')?.focus();
            document.getElementById('discussion-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}>Share an encouraging message</button>
        ) : (
          <p className="daily-encouragement-signin">Sign in above to share an encouraging message with the community.</p>
        )}
      </section>

      {!user ? (
        <div className="discussion-guidelines">
          <h3>Sign in to join the community</h3>
          <p>Community posts and replies are available to signed-in members. Use the Member Account section above to sign in or create an account.</p>
        </div>
      ) : (
        <>
          <form className="discussion-composer" onSubmit={publishPost}>
            <h3>Start a conversation</h3>
            <label htmlFor="discussion-category">Choose a topic</label>
            <select id="discussion-category" value={category} onChange={event => setCategory(event.target.value)}>
              {categories.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <label htmlFor="discussion-title">Post title</label>
            <input id="discussion-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={120} required placeholder="What would you like to talk about?" />
            <label htmlFor="discussion-body">Your message</label>
            <textarea id="discussion-body" value={body} onChange={event => setBody(event.target.value)} maxLength={3000} rows={4} required placeholder="Share only what feels safe and comfortable..." />
            <div className="discussion-compose-footer">
              <span>{body.length}/3000</span>
              <button type="submit" disabled={busy}>{busy ? 'Sharing…' : 'Share post'}</button>
            </div>
          </form>

          <section className="member-safety-controls" aria-labelledby="member-safety-title">
            <div>
              <h3 id="member-safety-title">My safety controls</h3>
              <p>Blocked members’ posts and replies are hidden from your community view. Blocking does not notify the other member.</p>
            </div>
            {blockedUsers.length === 0 ? <p>You have not blocked any members.</p> : (
              <ul>
                {blockedUsers.map(memberId => (
                  <li key={memberId}>
                    <span>Blocked member · {memberId.slice(0, 8)}…</span>
                    <button type="button" disabled={busy} onClick={() => unblockMember(memberId)}>Unblock</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="my-submissions" aria-labelledby="my-submissions-title">
            <div className="discussion-feed-heading">
              <h3 id="my-submissions-title">My submissions</h3>
              <span>Only you can see this list</span>
            </div>
            {mySubmissions.length === 0 ? (
              <p>Your posts and replies will appear here with their review status.</p>
            ) : (
              <ul>
                {mySubmissions.map(item => (
                  <li key={`${item.kind}-${item.id}`}>
                    <div>
                      <strong>{item.kind}: {item.kind === 'Post' ? item.title : item.body}</strong>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`submission-status submission-status-${item.status || 'pending'}`}>
                      {item.status === 'published' ? 'Approved · Published' : item.status === 'rejected' ? 'Not approved' : item.status === 'hidden' ? 'Hidden by moderators' : 'Pending review'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="discussion-feed">
            <div className="discussion-feed-heading">
              <h3>Community conversations</h3>
              <span>{filteredPosts.length} recent posts</span>
            </div>
            <div className="discussion-feed-filter">
              <label htmlFor="community-feed-category">Browse conversations by topic</label>
              <select id="community-feed-category" value={feedCategory} onChange={event => setFeedCategory(event.target.value)}>
                <option>All topics</option>
                {categories.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            {loading ? (
              <p role="status">Loading community conversations…</p>
            ) : filteredPosts.length === 0 ? (
              <p>{posts.length === 0 ? 'There are no posts yet. You can start the first conversation.' : 'No conversations in this topic yet. Choose another topic or view all topics.'}</p>
            ) : filteredPosts.map(post => (
              <article className="discussion-post" key={post.id}>
                <div className="discussion-post-meta">
                  <span className="discussion-category">{post.category}</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="discussion-author">{post.user_id === user.id ? 'You' : 'Movement member'}</p>
                <p className="discussion-post-body">{post.body}</p>

                {(comments[post.id] || []).length > 0 && (
                  <div className="discussion-replies">
                    <strong>Replies</strong>
                    {comments[post.id].map(comment => (
                      <p key={comment.id}>
                        <strong>{comment.user_id === user.id ? 'You: ' : 'Member: '}</strong>
                        {comment.body}
                      </p>
                    ))}
                  </div>
                )}

                <div className="discussion-reply-form">
                  <label htmlFor={`reply-${post.id}`}>Add a supportive reply</label>
                  <div>
                    <input
                      id={`reply-${post.id}`}
                      value={replyDrafts[post.id] || ''}
                      maxLength={1200}
                      onChange={event => setReplyDrafts(current => ({ ...current, [post.id]: event.target.value }))}
                      placeholder="Offer encouragement..."
                    />
                    <button type="button" disabled={busy || !(replyDrafts[post.id] || '').trim()} onClick={() => addReply(post.id)}>Reply</button>
                  </div>
                </div>

                {post.user_id !== user.id && (
                  <div className="discussion-member-actions">
                    <button type="button" className="discussion-block-button" disabled={busy || blockedUsers.includes(post.user_id)} onClick={() => blockMember(post.user_id)}>
                      {blockedUsers.includes(post.user_id) ? 'Member blocked' : 'Block member'}
                    </button>
                  </div>
                )}

                {post.user_id !== user.id && (
                  <div className="discussion-report">
                    <label htmlFor={`report-${post.id}`}>Report a concern</label>
                    <div>
                      <select
                        id={`report-${post.id}`}
                        value={reportChoices[post.id] || 'other'}
                        onChange={event => setReportChoices(current => ({ ...current, [post.id]: event.target.value }))}
                      >
                        {reportReasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <button type="button" disabled={busy} onClick={() => reportPost(post.id)}>Submit report</button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      <aside className="discussion-guidelines">
        <h3>Our community commitments</h3>
        <ul>
          <li>Lead with respect, empathy, and accountability.</li>
          <li>No harassment, threats, hate speech, or victim-blaming.</li>
          <li>Never post addresses, phone numbers, identifying details, or another person's private information.</li>
          <li>Share from your own experience; do not diagnose or pressure others.</li>
          <li>Reports are private. This app is not monitored around the clock.</li>
        </ul>
        <p><strong>Need urgent help?</strong> If you are in immediate danger in the U.S., call 911. For confidential domestic violence support, contact the National Domestic Violence Hotline at 1-800-799-SAFE (7233) or text START to 88788.</p>
      </aside>
      {notice && <p className="discussion-notice" role="status">{notice}</p>}
      <p className="discussion-privacy">Community content is available to signed-in members. Reports are private to the person submitting them. A trained, actively available moderation team must be in place before this community is opened to the public. Do not share sensitive identifying information.</p>
    </section>
  );
}

export default CommunityDiscussions;
