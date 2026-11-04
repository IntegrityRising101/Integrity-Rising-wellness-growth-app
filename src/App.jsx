import './App.css';
import QuickExitButton from './components/QuickExitButton';
import IncidentVault from './components/IncidentVault';

function App() {
  return (
    <div className="app-container">
      <QuickExitButton />

      <header className="app-header">
        <h1>Integrity Rising</h1>
        <h2>Support & Safety Community</h2>
        <p>
          A private space for support, safety, healing,
          and connection. You are not alone.
        </p>
      </header>

      <main>
        <section className="community-section">
          <h2>Welcome to Your Safe Space</h2>
          <p>
            Find support, share experiences, and connect
            with others at your own pace.
          </p>
        </section>

        <section className="safety-section">
          <h2>My Safety Tools</h2>
          <IncidentVault />
        </section>
      </main>

      <footer>
        <p>Integrity Rising | United by Truth, Driven by Purpose</p>
      </footer>
    </div>
  );
}

export default App;

