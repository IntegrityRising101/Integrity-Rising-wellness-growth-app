import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './CommunityChatRooms.css';

const fallbackRooms = [
  { id: 'trauma-healing', name: 'Trauma & Healing', description: 'A compassionate space for healing at your own pace.' },
  { id: 'addiction-recovery', name: 'Addiction Recovery', description: 'Encouragement and support through recovery.' },
  { id: 'mental-wellness', name: 'Mental Wellness', description: 'Stress, emotions, and everyday well-being.' },
  { id: 'toxic-relationships', name: 'Toxic Relationships', description: 'Boundaries, self-worth, and healthy relationships.' },
  { id: 'personal-growth', name: 'Personal Growth', description: 'Goals, habits, and small wins.' },
  { id: 'purpose-legacy', name: 'Purpose & Legacy', description: 'Leadership, values, and making a difference.' }
];

export default function CommunityChatRooms() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState(fallbackRooms);
  const [activeRoom, setActiveRoom] = useState(fallbackRooms[0].id);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setNotice('We could not verify your member session. Please sign in again.');
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setMessages([]);
    });
    return () => { alive = false; authListener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || !user) return undefined;
    let alive = true;
    supabase.from('community_rooms').select('id,name,description,sort_order')
      .eq('is_active', true).order('sort_order')
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setNotice('Chat rooms are not connected yet. The room setup migration must be applied in Supabase.');
        else if (data?.length) {
          setRooms(data);
          setActiveRoom(current => data.some(room => room.id === current) ? current : data[0].id);
        }
      });
    return () => { alive = false; };
  }, [user]);

  useEffect(() => {
    if (!supabase || !user || !activeRoom) return undefined;
    let alive = true;
    setLoading(true);
    supabase.from('community_room_messages')
      .select('id,room_id,user_id,body,created_at')
      .eq('room_id', activeRoom)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setNotice('Room messages are unavailable. Check that the chat-room migration has been applied.');
        else setMessages(data || []);
        setLoading(false);
      });
    const channel = supabase.channel(`room-${activeRoom}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_room_messages', filter: `room_id=eq.${activeRoom}` }, payload => {
        setMessages(current => current.some(item => item.id === payload.new.id) ? current : [...current, payload.new]);
      }).subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, [user, activeRoom]);

  async function sendMessage(event) {
    event.preventDefault();
    const body = draft.trim();
    if (!user || !body || busy) return;
    setBusy(true); setNotice('');
    const { data, error } = await supabase.from('community_room_messages')
      .insert({ room_id: activeRoom, user_id: user.id, body })
      .select('id,room_id,user_id,body,created_at').single();
    if (error) setNotice('Your message could not be sent. Please try again.');
    else {
      setDraft('');
      setMessages(current => current.some(item => item.id === data.id) ? current : [...current, data]);
    }
    setBusy(false);
  }

  async function reportMessage(messageId) {
    if (!user) return;
    const { error } = await supabase.from('community_room_reports')
      .insert({ message_id: messageId, reporter_id: user.id, reason: 'other' });
    setNotice(error ? 'We could not submit that report. It may already have been reported.' : 'Thank you. Your report was sent privately for review.');
  }

  const room = rooms.find(item => item.id === activeRoom);
  return (
    <section className="member-chat-rooms" aria-labelledby="member-chat-title">
      <div className="member-chat-heading">
        <p className="chat-room-kicker">THE INTEGRITY MOVEMENT</p>
        <h2 id="member-chat-title">Community Chat Rooms</h2>
        <p>Choose a space, join the conversation, and support one another with respect.</p>
      </div>
      {!user ? (
        <div className="chat-room-signin"><h3>Member conversations</h3><p>Sign in to enter the private community chat rooms.</p><a href="#member-account-title">Sign in / Create an account</a></div>
      ) : (
        <>
          <div className="chat-room-grid" aria-label="Choose a chat room">
            {rooms.map(item => <button key={item.id} type="button" className={item.id === activeRoom ? 'chat-room-choice active' : 'chat-room-choice'} aria-pressed={item.id === activeRoom} onClick={() => setActiveRoom(item.id)}>
              <strong>{item.name}</strong><span>{item.description}</span>
            </button>)}
          </div>
          <div className="chat-room-panel">
            <div className="chat-room-panel-heading"><div><span>YOU ARE IN</span><h3>{room?.name || 'Community Room'}</h3></div><span className="chat-live-label">Member chat</span></div>
            <p className="chat-room-guideline">{room?.guidelines || 'Be respectful. Share only what feels safe. Protect your privacy.'}</p>
            <div className="chat-message-list" aria-live="polite">
              {loading ? <p role="status">Loading conversation…</p> : messages.length === 0 ? <p className="chat-empty">This room is ready. Start with a kind welcome or supportive message.</p> : messages.map(message => <article className={message.user_id === user.id ? 'chat-message mine' : 'chat-message'} key={message.id}>
                <div><strong>{message.user_id === user.id ? 'You' : 'Community member'}</strong><time>{new Date(message.created_at).toLocaleString()}</time></div>
                <p>{message.body}</p>
                {message.user_id !== user.id && <button type="button" className="chat-report" onClick={() => reportMessage(message.id)}>Report message</button>}
              </article>)}
            </div>
            <form className="chat-compose" onSubmit={sendMessage}>
              <label htmlFor="room-message">Your message</label>
              <textarea id="room-message" value={draft} onChange={event => setDraft(event.target.value)} maxLength={2000} rows={3} placeholder="Write a supportive message…" required />
              <div><span>{draft.length}/2000</span><button type="submit" disabled={busy || !draft.trim()}>{busy ? 'Sending…' : 'Send message'}</button></div>
            </form>
          </div>
        </>
      )}
      <aside className="chat-room-safety"><strong>A safer space matters.</strong> Never share addresses, phone numbers, passwords, or identifying details. Messages are visible to signed-in members. Reports are private, but chat is not monitored around the clock and is not crisis support. If you are in immediate danger, call 911; for emotional crisis support, call or text 988.</aside>
      {notice && <p className="chat-room-notice" role="status">{notice}</p>}
    </section>
  );
}
