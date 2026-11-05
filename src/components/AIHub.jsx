import './AIHub.css';

const assistants = [
  { name: 'Meta AI', category: 'Everyday assistant', description: 'Explore Meta’s general-purpose AI assistant for questions, ideas, and creative tasks.', url: 'https://www.meta.ai/', note: 'Opens Meta AI' },
  { name: 'Muse', category: 'Personal AI agent', description: 'Explore Meta’s Muse agent for multi-step tasks and goal support. Review its permissions before connecting apps.', url: 'https://ai.meta.com/muse/', note: 'Opens Meta Muse' },
  { name: 'Grok', category: 'AI assistant', description: 'Open Grok for conversational help, research, and creative exploration.', url: 'https://grok.com/', note: 'Opens Grok' },
  { name: 'ChatGPT', category: 'AI assistant', description: 'Open ChatGPT for writing, learning, planning, and problem-solving.', url: 'https://chatgpt.com/', note: 'Opens ChatGPT' },
  { name: 'DeepSeek', category: 'AI assistant', description: 'Explore DeepSeek for general questions, reasoning, and coding support.', url: 'https://chat.deepseek.com/', note: 'Opens DeepSeek' },
  { name: 'Gemini', category: 'AI assistant', description: 'Open Google Gemini for research, writing, learning, and creative assistance.', url: 'https://gemini.google.com/', note: 'Opens Gemini' },
  { name: 'Manus', category: 'AI agent', description: 'Explore Manus for agent-style workflows and multi-step task assistance.', url: 'https://manus.im/', note: 'Opens Manus' },
];

export default function AIHub() {
  return (
    <section className="ai-hub" aria-labelledby="ai-hub-title">
      <div className="ai-hub-heading">
        <p className="ai-hub-kicker">INTEGRITY RISING • AI RESOURCE CENTER</p>
        <h2 id="ai-hub-title">The Integrity Rising AI Hub</h2>
        <p>Explore different AI tools and choose the assistant that fits the task. Each service opens separately in a new tab.</p>
      </div>

      <div className="ai-hub-notice" role="note">
        <strong>Independent services — not connected accounts</strong>
        <p>These links do not embed the services in Integrity Rising or share chat history between them. Each provider has its own account, privacy terms, safety rules, and possible costs. Review those details before signing in or sharing information.</p>
      </div>

      <div className="ai-hub-grid">
        {assistants.map((assistant) => (
          <article className="ai-hub-card" key={assistant.name}>
            <div className="ai-hub-card-top">
              <h3>{assistant.name}</h3>
              <span>{assistant.category}</span>
            </div>
            <p>{assistant.description}</p>
            <a href={assistant.url} target="_blank" rel="noopener noreferrer" aria-label={assistant.note}>{assistant.note} ↗</a>
          </article>
        ))}
      </div>

      <div className="ai-hub-safety">
        <h3>Protect your privacy</h3>
        <ul>
          <li>Do not share passwords, financial account details, private addresses, or identifying information.</li>
          <li>Do not enter abuse disclosures, safety plans, or medical details into an external AI service unless you have reviewed its privacy protections and made an informed choice.</li>
          <li>AI tools can make mistakes. Verify important health, legal, and safety information with qualified people or official sources.</li>
          <li>These assistants are not crisis services. If someone is in immediate danger, call 911 in the U.S. if it is safe. For suicide or emotional crisis support, call or text 988.</li>
        </ul>
      </div>
      <p className="ai-hub-status">Current build: external links only. No provider API keys, chat messages, or account credentials are connected to this app.</p>
    </section>
  );
}
