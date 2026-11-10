import './MotivationForTheWeek.css';

const weeklyMotivation = [
  { day: 'Monday', title: 'Motivation Monday', theme: 'Start Strong', icon: '🌅', message: 'A new week is a new opportunity to become the person you were meant to be. Take one step, believe in yourself, and keep rising.' },
  { day: 'Tuesday', title: 'Transformation Tuesday', theme: 'Change Begins Within', icon: '💪', message: 'You do not have to change everything overnight. Change one habit, one thought, and one choice at a time. Small changes create powerful transformations.' },
  { day: 'Wednesday', title: 'Wisdom Wednesday', theme: 'Learn, Grow, and Reflect', icon: '🌱', message: 'Every experience has something to teach you. Learn from your past without letting it define your future.' },
  { day: 'Thursday', title: 'Thankful Thursday', theme: 'Gratitude and Appreciation', icon: '💛', message: 'Even on difficult days, there is something worth appreciating. Recognize your progress, value your journey, and never take your strength for granted.' },
  { day: 'Friday', title: 'Fearless Friday', theme: 'Courage Over Fear', icon: '🔥', message: 'Your past does not cancel your potential. Be courageous enough to start again, speak your truth, and believe that your life can change.' },
  { day: 'Saturday', title: 'Service Saturday', theme: 'Kindness in Action', icon: '🤝', message: 'You never know what someone is carrying. A little kindness, a listening ear, or a helping hand can remind someone that they are not alone.' },
  { day: 'Sunday', title: 'Self-Care Sunday', theme: 'Rest, Heal, and Reset', icon: '🕊️', message: 'Rest is not weakness. Give yourself permission to breathe, release what you cannot control, and prepare your heart for another week of growth.' },
];

export default function MotivationForTheWeek() {
  const todayIndex = new Date().getDay();
  const today = weeklyMotivation[todayIndex === 0 ? 6 : todayIndex - 1];

  return (
    <section className="weekly-motivation" aria-labelledby="weekly-motivation-title">
      <div className="weekly-motivation-heading">
        <p className="section-kicker">LEARN • GROW • HEAL • RISE</p>
        <h2 id="weekly-motivation-title">Motivation for the Week</h2>
        <p>A fresh reminder each day to keep moving forward with purpose and integrity.</p>
      </div>

      <article className="weekly-motivation-feature">
        <span className="weekly-motivation-icon" aria-hidden="true">{today.icon}</span>
        <div>
          <p className="weekly-motivation-today">TODAY'S ENCOURAGEMENT · {today.day.toUpperCase()}</p>
          <h3>{today.title}</h3>
          <p className="weekly-motivation-theme">{today.theme}</p>
          <p>{today.message}</p>
        </div>
      </article>

      <div className="weekly-motivation-grid">
        {weeklyMotivation.map((item) => (
          <article className={item.day === today.day ? 'weekly-motivation-card is-today' : 'weekly-motivation-card'} key={item.day}>
            <span aria-hidden="true">{item.icon}</span>
            <div>
              <h3>{item.title}</h3>
              <p className="weekly-motivation-theme">{item.theme}</p>
              <p>{item.message}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="weekly-motivation-signoff">United by Truth, Driven by Purpose.</p>
    </section>
  );
}
