import './App.css';
import QuickExitButton from './components/QuickExitButton';
import IncidentVault from './components/IncidentVault';
import PersonalSafetyPlan from './components/PersonalSafetyPlan';
import StateResourceDirectory from './components/StateResourceDirectory';
import MentalHealthServices from './components/MentalHealthServices';
import LocalSupportFinder from './components/LocalSupportFinder';
import AIPrivacyNotice from './components/AIPrivacyNotice';
import AIHub from './components/AIHub';
import WellnessAI from './components/WellnessAI';
import GuidedWellnessPractices from './components/GuidedWellnessPractices';
import SelfReflectionCheck from './components/SelfReflectionCheck';
import WellnessChat from './components/WellnessChat';
import WomensWellness from './components/WomensWellness';
import CommunityDiscussions from './components/CommunityDiscussions';
import CommunityChatRooms from './components/CommunityChatRooms';
import CommunityResourceLibrary from './components/CommunityResourceLibrary';
import Academy from './components/Academy';
import PersonalWellnessDashboard from './components/PersonalWellnessDashboard';
import GoalCenter from './components/GoalCenter';
import MemberAccount from './components/MemberAccount';
import MemberDirectory from './components/MemberDirectory';
import MemberPersonalization from './components/MemberPersonalization';
import ModerationDashboard from './components/ModerationDashboard';
import AppDirectory from './components/AppDirectory';
import MotivationForTheWeek from './components/MotivationForTheWeek';
import GratitudeJournal from './components/GratitudeJournal';
import StressReliefCenter from './components/StressReliefCenter';
import AchievementCenter from './components/AchievementCenter';
import SectionArtwork from './components/SectionArtwork';

const navigation = [
  { label: 'Home', target: 'dashboard', icon: '⌂' },
  { label: 'Community', target: 'community', icon: '♡' },
  { label: 'Wellness', target: 'wellness', icon: '✦' },
  { label: 'Academy', target: 'academy', icon: '▤' },
  { label: 'Safety', target: 'safety', icon: '＋' },
  { label: 'My Growth', target: 'growth', icon: '↗' },
  { label: 'Account', target: 'account', icon: '◎' },
];

function SectionHeading({ kicker, title, description }) {
  return (
    <div className="section-intro app-section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <header className="app-header" id="top">
        <p className="brand-eyebrow">THE INTEGRITY MOVEMENT</p>
        <h1>Integrity Rising</h1>
        <p className="brand-app-name">THE WELLNESS &amp; GROWTH APP</p>
        <p className="brand-slogan">United by Truth, Driven by Purpose</p>
        <p className="brand-welcome">A supportive place to learn, grow, heal, and rise — at your own pace.</p>
      </header>

      <nav className="main-navigation" aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.target} href={`#${item.target}`}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <main className="app-main">
        <section className="community-section welcome-section">
          <p className="section-kicker">WELCOME TO YOUR SPACE</p>
          <h2>Your next step starts here.</h2>
          <p>Build healthy habits, find practical support, learn new skills, and connect with a community rooted in respect and accountability.</p>
          <div className="welcome-actions">
            <a href="#growth">Explore my growth <span aria-hidden="true">→</span></a>
            <a href="#community">Find your community <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <AppDirectory />

        <section id="dashboard" className="app-area dashboard-area">
          <SectionHeading kicker="YOUR PERSONAL HOME" title="Welcome to your Dashboard" description="A clear starting point for your daily check-in, encouragement, and next steps." />
          <SectionArtwork variant="dashboard" />
          <div className="dashboard-quick-actions" aria-label="Dashboard shortcuts">
            <a href="#community"><span aria-hidden="true">♡</span><strong>Community</strong><small>Find a room, connect, and feel supported.</small></a>
            <a href="#wellness"><span aria-hidden="true">✦</span><strong>Wellness Center</strong><small>Explore tools and practices for well-being.</small></a>
            <a href="#academy"><span aria-hidden="true">▤</span><strong>Academy</strong><small>Learn new skills at your own pace.</small></a>
            <a href="#safety"><span aria-hidden="true">＋</span><strong>Safety &amp; Support</strong><small>Find resources and practical support.</small></a>
          </div>
          <MotivationForTheWeek />
        </section>

        <section id="community" className="app-area">
          <SectionHeading kicker="CONNECT & BELONG" title="Community" description="Find your people, join a topic-based room, share encouragement, and grow together with respect." />
          <SectionArtwork variant="community" />
          <CommunityChatRooms />
          <CommunityDiscussions />
          <MemberDirectory />
          <CommunityResourceLibrary />
          <ModerationDashboard />
        </section>

        <section id="wellness" className="app-area">
          <SectionHeading kicker="CARE FOR YOUR WHOLE SELF" title="Wellness Center" description="Explore supportive tools for emotional wellness, reflection, stress relief, and everyday growth." />
          <SectionArtwork variant="wellness" />
          <PersonalWellnessDashboard />
          <GuidedWellnessPractices />
          <StressReliefCenter />
          <SelfReflectionCheck />
          <WomensWellness />
          <WellnessAI />
          <WellnessChat />
          <AIHub />
          <AIPrivacyNotice />
        </section>

        <section id="academy" className="app-area">
          <SectionHeading kicker="LEARN • GROW • HEAL • RISE" title="Integrity Rising Academy" description="Build knowledge, strengthen life skills, and keep moving toward the legacy you want to create." />
          <SectionArtwork variant="academy" />
          <Academy />
        </section>

        <section id="safety" className="safety-section app-area">
          <QuickExitButton />
          <SectionHeading kicker="YOU DESERVE SUPPORT" title="Safety &amp; Support" description="Find crisis contacts, mental health resources, domestic violence support, recovery services, and practical safety tools. If a device may be monitored, consider using a safer device before viewing sensitive information." />
          <SectionArtwork variant="safety" />
          <MentalHealthServices />
          <StateResourceDirectory />
          <LocalSupportFinder />
          <PersonalSafetyPlan />
          <IncidentVault />
        </section>

        <section id="growth" className="app-area">
          <SectionHeading kicker="YOUR JOURNEY, YOUR PACE" title="My Growth" description="Set meaningful goals, track your progress, celebrate milestones, and save the resources that support your next chapter." />
          <GoalCenter />
          <GratitudeJournal />
          <AchievementCenter />
        </section>

        <section id="account" className="app-area account-area">
          <SectionHeading kicker="MAKE THIS SPACE YOURS" title="My Account" description="Manage your member profile and personal app preferences." />
          <MemberAccount />
          <MemberPersonalization />
        </section>
      </main>

      <footer className="app-footer">
        <a href="#top" className="back-to-top">Back to top ↑</a>
        <p>Integrity Rising | The Integrity Movement</p>
        <p>United by Truth, Driven by Purpose</p>
        <p className="footer-note">This app provides educational and peer-support tools. It is not a substitute for emergency services, professional mental health care, or individualized safety planning.</p>
      </footer>
    </div>
  );
}

export default App;
