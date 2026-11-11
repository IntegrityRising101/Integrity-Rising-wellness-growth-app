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
import CommunityResourceLibrary from './components/CommunityResourceLibrary';
import Academy from './components/Academy';
import PersonalWellnessDashboard from './components/PersonalWellnessDashboard';
import GoalCenter from './components/GoalCenter';
import MemberAccount from './components/MemberAccount';
import ModerationDashboard from './components/ModerationDashboard';
import AppDirectory from './components/AppDirectory';
import MotivationForTheWeek from './components/MotivationForTheWeek';
import GratitudeJournal from './components/GratitudeJournal';
import StressReliefCenter from './components/StressReliefCenter';
import AchievementCenter from './components/AchievementCenter';
import SectionArtwork from './components/SectionArtwork';

const navigation = [
  { label: 'My Dashboard', target: 'dashboard' },
  { label: 'Wellness & AI', target: 'wellness' },
  { label: 'Community', target: 'community' },
  { label: 'Academy', target: 'academy' },
  { label: 'Safety & Support', target: 'safety' },
];

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
          <a key={item.target} href={`#${item.target}`}>{item.label}</a>
        ))}
      </nav>

      <main>
        <section className="community-section welcome-section">
          <p className="section-kicker">WELCOME</p>
          <h2>Your next step starts here.</h2>
          <p>Build healthy habits, find practical support, learn new skills, and connect with a community rooted in respect and accountability.</p>
        </section>

        <AppDirectory />

        <section id="dashboard" className="app-area">
          <div className="section-intro dashboard-section-intro">
            <p className="section-kicker">YOUR PERSONAL GROWTH HUB</p>
            <h2>My Dashboard</h2>
            <p>Start with a check-in, choose a small step, and keep your goals moving at a pace that works for you.</p>
          </div>
          <SectionArtwork variant="dashboard" />
          <MemberAccount />
          <MotivationForTheWeek />
          <PersonalWellnessDashboard />
          <GoalCenter />
          <GratitudeJournal />
          <AchievementCenter />
        </section>

        <section id="wellness" className="app-area">
          <SectionArtwork variant="wellness" />
          <AIHub />
          <AIPrivacyNotice />
          <WellnessChat />
          <WellnessAI />
          <GuidedWellnessPractices />
          <StressReliefCenter />
          <SelfReflectionCheck />
          <WomensWellness />
        </section>

        <section id="community" className="app-area">
          <SectionArtwork variant="community" />
          <CommunityResourceLibrary />
          <CommunityDiscussions />
          <ModerationDashboard />
        </section>

        <section id="academy" className="app-area">
          <SectionArtwork variant="academy" />
          <Academy />
        </section>

        <section id="safety" className="safety-section app-area">
          <QuickExitButton />
          <div className="section-intro">
            <p className="section-kicker">SUPPORT & RESOURCES</p>
            <h2>Safety, Crisis &amp; Immediate Support</h2>
            <p>Find crisis contacts, mental health resources, domestic violence support, recovery services, and practical safety tools. If a device may be monitored, consider using a safer device before viewing sensitive information.</p>
          </div>
          <SectionArtwork variant="safety" />
          <MentalHealthServices />
          <StateResourceDirectory />
          <LocalSupportFinder />
          <PersonalSafetyPlan />
          <IncidentVault />
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
