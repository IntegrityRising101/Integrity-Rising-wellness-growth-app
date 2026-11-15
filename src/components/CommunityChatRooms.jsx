import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './CommunityChatRooms.css';

const fallbackRooms = [
  { id: 'trauma-healing', name: 'Trauma & Healing', description: 'A compassionate space for healing at your own pace.' },
  { id: 'addiction-recovery', name: 'Addiction Recovery', description: 'Encouragement and support through recovery.' },
  { id: 'toxic-relationships', name: 'Toxic Relationships', description: 'Boundaries, self-worth, and healthy relationships.' },
  { id: 'mental-wellness', name: 'Mental Wellness', description: 'Stress, emotions, and everyday well-being.' },
  { id: 'personal-growth', name: 'Personal Growth', description: 'Goals, habits, and small wins.' },
  { id: 'accountability-leadership', name: 'Accountability & Leadership', description: 'Integrity, responsibility, and making a positive difference.' }
];

const roomWelcomeMessages = {
  'trauma-healing': {
    title: 'Welcome to Trauma & Healing',
    paragraphs: [
      'You are welcome here, exactly as you are. Healing is not a race, and there is no timeline you have to follow. You can participate at your own pace without sharing more than feels safe.',
      'We believe your past does not define your future, your feelings deserve respect, and small steps forward matter.',
      'Please respect boundaries, avoid judgment and pressure, protect privacy, and offer encouragement rather than unsolicited criticism. This is peer support, not therapy or crisis care.',
      'You are not broken. You are not alone. Your story is not over. United by Truth, Driven by Purpose.'
    ]
  },
  'addiction-recovery': {
    title: 'Welcome to Addiction Recovery',
    paragraphs: [
      'You do not have to have everything figured out to belong here. Whether you are beginning recovery, rebuilding after a setback, or supporting someone you love, there is room for you.',
      'We stand for progress over perfection, honesty without shame, accountability without humiliation, and support without judgment.',
      'Respect each person’s path, protect privacy, avoid shaming or glorifying substance use, and encourage qualified professional care when needed. This is peer support, not addiction treatment.',
      'You are worthy of recovery, support, and a future filled with purpose. One day, one decision, one step at a time.'
    ]
  },
  'toxic-relationships': {
    title: 'Welcome to Toxic Relationships',
    paragraphs: [
      'You deserve relationships built on respect, honesty, trust, and kindness. This is a place to recognize unhealthy patterns, rebuild self-worth, and learn about healthy boundaries.',
      'Love should never require losing yourself. You are not responsible for changing another person’s behavior, and you deserve to feel safe being yourself.',
      'Respect each person’s choices. Do not blame someone for being mistreated or pressure anyone to leave or stay. Protect privacy and encourage safety planning and professional support when appropriate.',
      'You deserve peace. Your past relationships do not determine your future.'
    ]
  },
  'mental-wellness': {
    title: 'Welcome to Mental Wellness',
    paragraphs: [
      'Your mental well-being matters. You can learn, ask questions, and feel supported without judgment. You do not have to pretend everything is okay here.',
      'We encourage healthy habits, emotional awareness, resilience, rest, and asking for help when you need it.',
      'Listen with kindness, respect privacy, avoid diagnosing or prescribing treatment to others, and encourage professional support when appropriate. This is peer support, not mental health care or crisis response.',
      'You matter. One breath, one choice, one step forward.'
    ]
  },
  'personal-growth': {
    title: 'Welcome to Personal Growth',
    paragraphs: [
      'This is a space for becoming stronger, wiser, and more intentional about the life you want to build. Growth is not about perfection; it is about taking meaningful steps.',
      'We believe you are capable of learning and changing. Consistency matters, mistakes can teach us, and small victories deserve to be celebrated.',
      'Encourage without comparing or shaming. Be honest, respectful, and accountable, and remember that every member chooses their own pace.',
      'Your next chapter begins with the decisions you make today. Keep moving forward.'
    ]
  },
  'purpose-legacy': {
    title: 'Welcome to Purpose & Legacy',
    paragraphs: [
      'Your life has purpose, your choices have meaning, and the legacy you leave begins with how you live today.',
      'Legacy is more than what you own or accomplish. It is also the lives you touch, the lessons you share, and the positive changes you create.',
      'Lead with honesty, humility, compassion, and accountability. Encourage others, respect different perspectives, and build one another up.',
      'Start where you are. Use what you have learned. Make a difference. United by Truth, Driven by Purpose.'
    ]
  },
  'accountability-leadership': {
    title: 'Welcome to Accountability & Leadership',
    paragraphs: [
      'Welcome to a space for leading with integrity, taking responsibility, and making a positive difference.',
      'Leadership begins with our choices. Accountability is about learning and making things right, never shaming or humiliating others.',
      'Share constructively, respect different perspectives, and encourage one another with honesty and compassion.',
      'United by Truth, Driven by Purpose. Learn • Grow • Heal • Rise.'
    ]
  }
};

export default function CommunityChatRooms() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState(fallbackRooms);
  const [activeRoom, setActiveRoom] = useState(fallbackRooms[0].id);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [reportingMessage, setReportingMessage] = useState(null);
  const [reportReason, setReportReason] = useState('other');
  const [reportDetails, setReportDetails] = useState('');

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
    supabase.from('community_rooms').select('id,name,description,guidelines,sort_order')
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

  async function reportMessage(event) {
    event.preventDefault();
    if (!user || !reportingMessage || busy) return;
    setBusy(true);
    const { error } = await supabase.from('community_room_reports').insert({
      message_id: reportingMessage,
      reporter_id: user.id,
      reason: reportReason,
      details: reportDetails.trim()
    });
    setNotice(error
      ? 'We could not submit that report. It may already have been reported, or the connection may have failed.'
      : 'Thank you. Your report was submitted privately. Do not wait for an in-app response if someone may be in immediate danger.');
    if (!error) {
      setReportingMessage(null);
      setReportReason('other');
      setReportDetails('');
    }
    setBusy(false);
  }

  const room = rooms.find(item => item.id === activeRoom);
  return (
    <section className="member-chat-rooms" aria-labelledby="member-chat-title">
      <div className="member-chat-heading">
        <p className="chat-room-kicker">THE INTEGRITY MOVEMENT</p>
        <h2 id="member-chat-title">Community Chat Rooms</h2>
        <p>Choose a space, join the conversation, and support one another with respect.</p>
      </div>
      {loading && !user ? <p role="status">Checking your member session…</p> : !user ? (
        <div className="chat-room-signin"><h3>Member conversations</h3><p>Sign in to enter the private community chat rooms.</p><a href="#member-account-title">Sign in / Create an account</a></div>
      ) : (
        <>
          <div className="chat-room-grid" aria-label="Choose a chat room">
            {rooms.map(item => <button key={item.id} type="button" className={item.id === activeRoom ? 'chat-room-choice active' : 'chat-room-choice'} aria-pressed={item.id === activeRoom} onClick={() => setActiveRoom(item.id)}>
              <strong>{item.name}</strong><span>{item.description}</span>
            </button>)}
          </div>
          <div className="chat-room-panel">
            {roomWelcomeMessages[activeRoom] && <aside className="chat-room-welcome" aria-label="Room welcome message">
              <h4>{roomWelcomeMessages[activeRoom].title}</h4>
              {roomWelcomeMessages[activeRoom].paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </aside>}
            <div className="chat-room-panel-heading"><div><span>YOU ARE IN</span><h3>{room?.name || 'Community Room'}</h3></div><span className="chat-live-label">Member chat</span></div>
            <p className="chat-room-guideline">{room?.guidelines || 'Be respectful. Share only what feels safe. Protect your privacy.'}</p>
            <div className="chat-message-list" aria-live="polite">
              {loading ? <p role="status">Loading conversation…</p> : messages.length === 0 ? <p className="chat-empty">This room is ready. Start with a kind welcome or supportive message.</p> : messages.map(message => <article className={message.user_id === user.id ? 'chat-message mine' : 'chat-message'} key={message.id}>
                <div><strong>{message.user_id === user.id ? 'You' : 'Community member'}</strong><time>{new Date(message.created_at).toLocaleString()}</time></div>
                <p>{message.body}</p>
                {message.user_id !== user.id && <button type="button" className="chat-report" onClick={() => { setReportingMessage(current => current === message.id ? null : message.id); setNotice(''); }}>Report message</button>}
                {reportingMessage === message.id && <form className="chat-report-form" onSubmit={reportMessage}>
                  <label htmlFor={`report-reason-${message.id}`}>Why are you reporting this?</label>
                  <select id={`report-reason-${message.id}`} value={reportReason} onChange={event => setReportReason(event.target.value)}>
                    <option value="harassment">Harassment or bullying</option>
                    <option value="threat">Threat or intimidation</option>
                    <option value="hate">Hateful or discriminatory content</option>
                    <option value="personal_information">Personal information shared</option>
                    <option value="spam">Spam or repeated promotion</option>
                    <option value="other">Something else</option>
                  </select>
                  <label htmlFor={`report-details-${message.id}`}>Additional details (optional)</label>
                  <textarea id={`report-details-${message.id}`} value={reportDetails} onChange={event => setReportDetails(event.target.value)} maxLength={1000} rows={2} placeholder="Tell us what we should review…" />
                  <div><button type="button" onClick={() => setReportingMessage(null)}>Cancel</button><button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Submit report'}</button></div>
                </form>}
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
