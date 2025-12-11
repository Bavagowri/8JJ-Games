import "./FAQ.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

const faqList = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
  { q: "faq_q4", a: "faq_a4" },
  { q: "faq_q5", a: "faq_a5" },
  { q: "faq_q6", a: "faq_a6" },
  { q: "faq_q7", a: "faq_a7" },
  { q: "faq_q8", a: "faq_a8" },
];

export default function FAQ() {
  const { lang } = useLanguage();

  const openFAQ = (answerKey) => {
    alert(translate(answerKey, lang));
  };

  return (
    <section id="faqSection" className="faq-container">
      <h2 className="faq-title">
        <span className="faq-icon">❓</span> {translate("faqTitle", lang)}
      </h2>

      <div className="faq-grid">
        {faqList.map((faq, index) => (
          <button
            key={index}
            className="faq-item"
            onClick={() => openFAQ(faq.a)}
          >
            <span className="faq-q">Q:</span> {translate(faq.q, lang)}
          </button>
        ))}
      </div>
    </section>
  );
}
