import './App.css';
import QuickExitButton from './components/QuickExitButton';
import IncidentVault from './components/IncidentVault';
import PersonalSafetyPlan from './components/PersonalSafetyPlan';
import StateResourceDirectory from './components/StateResourceDirectory';
import LocalSupportFinder from './components/LocalSupportFinder';
import WellnessAI from './components/WellnessAI';
import WellnessChat from './components/WellnessChat';
import MoodTracker from './components/MoodTracker';
import WomensWellness from './components/WomensWellness';
import CommunityDiscussions from './components/CommunityDiscussions';
import Academy from './components/Academy';
import PersonalWellnessDashboard from './components/PersonalWellnessDashboard';
import MemberAccount from './components/MemberAccount';
import ModerationDashboard from './components/ModerationDashboard';

function App() {
  return (
    <div className="app-container">
      <QuickExitButton />

      <header className="app-header">
        <h1>Integrity Rising</h1>
        <p>United by Truth, Driven by Purpose</p>
        <h2>The Integrity Movement</h2>
        <p>A safe place to learn, grow, heal, and rise.</p>
      </header>

      <main>
        <section className="community-section">
          <h2>Welcome to Your Safe Space</h2>
          <p>
            Find support, share experiences, and connect with others at your own pace.
          </p>
        </section>

        <MemberAccount />
        <PersonalWellnessDashboard />
        <WellnessChat />
        <WellnessAI />
        <MoodTracker />
        <WomensWellness />
        <CommunityDiscussions />
        <ModerationDashboard />
        <Academy />

        <section className="safety-section">
          <h2>My Safety Tools</h2>
          <StateResourceDirectory />
          <LocalSupportFinder />
          <PersonalSafetyPlan />
          <IncidentVault />
        </section>
      </main>

      <footer>
        <p>Integrity Rising | The Integrity Movement</p>
        <p>United by Truth, Driven by Purpose</p>
      </footer>
    </div>
  );
}

export default App;
