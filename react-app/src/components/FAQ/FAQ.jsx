import "./FAQ.css";

const faqList = [
  {
    question: "Are all games really free to play?",
    answer: "Yes! All games on 8JJ Games are free to play.",
  },
  {
    question: "Are games safe for kids?",
    answer: "All games are reviewed, but parental guidance is recommended.",
  },
  {
    question: "How often are new games added?",
    answer: "New games are added almost every week.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required. Just click and play instantly.",
  },
  {
    question: "What devices are supported?",
    answer: "You can play on mobile, tablet, or desktop browsers.",
  },
  {
    question: "Can I play with friends online?",
    answer: "Many games support multiplayer modes.",
  },
  {
    question: "Why do some games need Flash?",
    answer: "Some older games still use Flash, but most are HTML5 now.",
  },
  {
    question: "How do I report a broken game?",
    answer: "Contact support with the game name and issue details.",
  },
];

export default function FAQ() {
  const openFAQ = (answer) => {
    alert(answer);
  };

  return (
    <section id="faqSection" className="faq-container">
      <h2 className="faq-title">
        <span className="faq-icon">❓</span> Frequently Asked Questions
      </h2>

      <div className="faq-grid">
        {faqList.map((faq, index) => (
          <button
            key={index}
            className="faq-item"
            onClick={() => openFAQ(faq.answer)}
          >
            <span className="faq-q">Q:</span> {faq.question}
          </button>
        ))}
      </div>
    </section>
  );
}
