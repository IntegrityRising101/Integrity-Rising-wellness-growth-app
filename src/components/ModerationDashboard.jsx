import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './ModerationDashboard.css';

function ModerationDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadQueue = useCallback(async () => {
    if (!supabase) return;
    const [postResult, commentResult, reportResult] = await Promise.all([
      supabase.from('community_posts')
        .select('id, category, title, body, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(100),
      supabase.from('community_comments')
        .select('id, post_id, body, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(100),
      supabase.from('community_reports')
        .select('id, post_id, comment_id, reason, details, status, created_at')
        .in('status', ['open', 'reviewing'])
        .order('created_at', { ascending: true })
        .limit(100)
    ]);

    if (postResult.error || commentResult.error || reportResult.error) {
      setNotice('The review queue could not be loaded. Check that the moderation database migration has been applied.');
      return;
    }
    setPosts(postResult.data || []);
    setComments(commentResult.data || []);
    setReports(reportResult.data || []);
  }, []);

  useEffect(() => {
    let active = true;
    async function verifyModerator() {
      if (!isSupabaseConfigured || !supabase) {
        if (active) setChecked(true);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;
      if (!sessionData.session?.user) {
        setChecked(true);
        return;
      }
      const { data, error } = await supabase.rpc('is_community_moderator');
      if (!active) return;
      if (!error && data === true) {
        setAuthorized(true);
        await loadQueue();
      }
      setChecked(true);
    }
    verifyModerator();
    return () => { active = false; };
  }, [loadQueue]);

  async function updateStatus(kind, id, status) {
    if (!authorized || busyId) return;
    setBusyId(id);
    setNotice('');
    const table = kind === 'post' ? 'community_posts' : 'community_comments';
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (error) {
      setNotice('That moderation action could not be saved. Please try again.');
    } else {
      setNotice(status === 'published' ? 'Content approved and published.' : 'Content moved out of the review queue.');
      await loadQueue();
    }
    setBusyId('');
  }

  async function updateReportStatus(id, status) {
    if (!authorized || busyId) return;
    setBusyId(id);
    setNotice('');
    const { error } = await supabase.from('community_reports').update({ status }).eq('id', id);
    if (error) {
      setNotice('The report status could not be updated. Please try again.');
    } else {
      setNotice(`Report marked ${status}.`);
      await loadQueue();
    }
    setBusyId('');
  }

  if (!checked || !authorized) return null;

  return (
    <section className="moderation-dashboard" aria-labelledby="moderation-dashboard-title">
      <div className="moderation-heading">
        <div>
          <p className="moderation-eyebrow">AUTHORIZED TEAM ONLY</p>
          <h2 id="moderation-dashboard-title">Community Review Dashboard</h2>
          <p>Review member submissions before they appear in community conversations.</p>
        </div>
        <button type="button" onClick={loadQueue}>Refresh queue</button>
      </div>

      <div className="moderation-queue">
        <h3>Posts awaiting review <span>{posts.length}</span></h3>
        {posts.length === 0 ? <p>No posts are waiting for review.</p> : posts.map(post => (
          <article className="moderation-item" key={post.id}>
            <p className="moderation-item-meta">{post.category} · {new Date(post.created_at).toLocaleString()}</p>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="moderation-actions">
              <button type="button" disabled={Boolean(busyId)} onClick={() => updateStatus('post', post.id, 'published')}>Approve & publish</button>
              <button type="button" className="moderation-secondary" disabled={Boolean(busyId)} onClick={() => updateStatus('post', post.id, 'hidden')}>Hide</button>
              <button type="button" className="moderation-remove" disabled={Boolean(busyId)} onClick={() => updateStatus('post', post.id, 'removed')}>Remove</button>
            </div>
          </article>
        ))}
      </div>

      <div className="moderation-queue">
        <h3>Replies awaiting review <span>{comments.length}</span></h3>
        {comments.length === 0 ? <p>No replies are waiting for review.</p> : comments.map(comment => (
          <article className="moderation-item" key={comment.id}>
            <p className="moderation-item-meta">Reply · {new Date(comment.created_at).toLocaleString()}</p>
            <p>{comment.body}</p>
            <div className="moderation-actions">
              <button type="button" disabled={Boolean(busyId)} onClick={() => updateStatus('comment', comment.id, 'published')}>Approve & publish</button>
              <button type="button" className="moderation-secondary" disabled={Boolean(busyId)} onClick={() => updateStatus('comment', comment.id, 'hidden')}>Hide</button>
              <button type="button" className="moderation-remove" disabled={Boolean(busyId)} onClick={() => updateStatus('comment', comment.id, 'removed')}>Remove</button>
            </div>
          </article>
        ))}
      </div>
      <div className="moderation-queue moderation-reports-queue">
        <h3>Confidential safety reports <span>{reports.length}</span></h3>
        <p className="moderation-report-warning">Report details are confidential. Review them only for safety and policy enforcement; do not share reporter identities or report contents outside the authorized response team.</p>
        {reports.length === 0 ? <p>No open reports are waiting for review.</p> : reports.map(report => (
          <article className="moderation-item" key={report.id}>
            <p className="moderation-item-meta">{new Date(report.created_at).toLocaleString()} · {report.post_id ? 'Post report' : 'Reply report'}</p>
            <h4>{report.reason.replaceAll('_', ' ')}</h4>
            {report.details && <p>{report.details}</p>}
            <p className="moderation-report-target">Reported item reference: {(report.post_id || report.comment_id || '').slice(0, 8)}…</p>
            <p className="moderation-report-current">Current status: {report.status}</p>
            <div className="moderation-actions">
              {report.status === 'open' && <button type="button" disabled={Boolean(busyId)} onClick={() => updateReportStatus(report.id, 'reviewing')}>Mark reviewing</button>}
              <button type="button" disabled={Boolean(busyId)} onClick={() => updateReportStatus(report.id, 'resolved')}>Resolve</button>
              <button type="button" className="moderation-secondary" disabled={Boolean(busyId)} onClick={() => updateReportStatus(report.id, 'dismissed')}>Dismiss</button>
            </div>
          </article>
        ))}
      </div>
      {notice && <p className="moderation-notice" role="status">{notice}</p>}
      <p className="moderation-safety-note">Moderation is not an emergency response service. Do not promise immediate review or around-the-clock monitoring unless a staffed team is actively providing it.</p>
    </section>
  );
}

export default ModerationDashboard;
