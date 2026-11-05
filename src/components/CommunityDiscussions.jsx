import { useState } from 'react';
import './CommunityDiscussions.css';

const starterPosts = [
  {
    id: 1,
    category: 'Encouragement',
    author: 'Integrity Rising',
    time: 'Community prompt',
    title: 'What is one small win you can recognize today?',
    body: 'Progress does not have to be loud to matter. Share a small step you are proud of, or simply take a moment to recognize it privately.',
    replies: []
  },
  {
    id: 2,
    category: 'Healthy Relationships',
    author: 'Integrity Rising',
    time: 'Community prompt',
    title: 'What does a healthy boundary look like to you?',
    body: 'Boundaries can help protect your time, energy, and wellbeing. There is no pressure to share anything personal.',
    replies: []
  }
];

const categories = ['Encouragement', 'Healing & Growth', 'Healthy Relationships', 'Accountability', 'General'];

function CommunityDiscussions() {
  const [posts, setPosts] = useState(starterPosts);
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [notice, setNotice] = useState('');

  function publishPost(event) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setNotice('Add a title and message before sharing.');
      return;
    }
    const newPost = {
      id: Date.now(),
      category,
      author: 'You (this device)',
      time: 'Just now',
      title: title.trim(),
      body: body.trim(),
      replies: []
    };
    setPosts(current => [newPost, ...current]);
    setTitle('');
    setBody('');
    setNotice('Your draft post was added to this on-device preview.');
  }

  function addReply(postId) {
    const message = (replyDrafts[postId] || '').trim();
    if (!message) return;
    setPosts(current => current.map(post =>
      post.id === postId
        ? { ...post, replies: [...post.replies, message] }
        : post
    ));
    setReplyDrafts(current => ({ ...current, [postId]: '' }));
  }

  return (
    <section className="discussions-section" aria-labelledby="discussions-title">
      <div className="discussions-heading">
        <div>
          <p className="discussions-eyebrow">THE INTEGRITY MOVEMENT</p>
          <h2 id="discussions-title">Community Discussions</h2>
          <p>Encouragement, shared learning, and respectful conversation—at your own pace.</p>
        </div>
        <span className="discussion-status">Preview</span>
      </div>

      <form className="discussion-composer" onSubmit={publishPost}>
        <h3>Start a conversation</h3>
        <label htmlFor="discussion-category">Choose a topic</label>
        <select id="discussion-category" value={category} onChange={event => setCategory(event.target.value)}>
          {categories.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <label htmlFor="discussion-title">Post title</label>
        <input id="discussion-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={100} placeholder="What would you like to talk about?" />
        <label htmlFor="discussion-body">Your message</label>
        <textarea id="discussion-body" value={body} onChange={event => setBody(event.target.value)} maxLength={1200} rows={4} placeholder="Share only what feels safe and comfortable..." />
        <div className="discussion-compose-footer">
          <span>{body.length}/1200</span>
          <button type="submit">Add post</button>
        </div>
        {notice && <p className="discussion-notice" role="status">{notice}</p>}
      </form>

      <div className="discussion-feed">
        <div className="discussion-feed-heading">
          <h3>Conversation starters</h3>
          <span>{posts.length} posts in this preview</span>
        </div>
        {posts.map(post => (
          <article className="discussion-post" key={post.id}>
            <div className="discussion-post-meta">
              <span className="discussion-category">{post.category}</span>
              <span>{post.time}</span>
            </div>
            <h3>{post.title}</h3>
            <p className="discussion-author">{post.author}</p>
            <p className="discussion-post-body">{post.body}</p>
            {post.replies.length > 0 && (
              <div className="discussion-replies">
                <strong>Supportive replies</strong>
                {post.replies.map((reply, index) => <p key={index}>{reply}</p>)}
              </div>
            )}
            <div className="discussion-reply-form">
              <label htmlFor={`reply-${post.id}`}>Add a supportive reply</label>
              <div>
                <input
                  id={`reply-${post.id}`}
                  value={replyDrafts[post.id] || ''}
                  maxLength={300}
                  onChange={event => setReplyDrafts(current => ({ ...current, [post.id]: event.target.value }))}
                  placeholder="Offer encouragement..."
                />
                <button type="button" onClick={() => addReply(post.id)}>Reply</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="discussion-guidelines">
        <h3>Our community commitments</h3>
        <ul>
          <li>Lead with respect, empathy, and accountability.</li>
          <li>No harassment, threats, hate speech, or victim-blaming.</li>
          <li>Do not post addresses, phone numbers, identifying details, or another person's private information.</li>
          <li>Share from your own experience; do not diagnose or pressure others.</li>
          <li>This preview is not monitored. Do not use it to report an emergency or seek immediate protection.</li>
        </ul>
        <p><strong>Need urgent help?</strong> If you are in immediate danger in the U.S., call 911. For confidential domestic violence support, contact the National Domestic Violence Hotline at 1-800-799-SAFE (7233) or text START to 88788.</p>
      </aside>
      <p className="discussion-privacy">Prototype notice: posts and replies exist only in this browser session and disappear when the page is refreshed or closed. They are not shared with other people. A real community requires secure accounts, a database, reporting/blocking tools, and active moderation. Do not enter sensitive or identifying information here.</p>
    </section>
  );
}

export default CommunityDiscussions;
