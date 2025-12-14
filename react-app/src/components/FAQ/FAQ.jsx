import { useState } from "react";
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
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqSection" className="faq-container">
      <h2 className="section-title">
        <span className="faq-icon">❓</span> {translate("faqTitle", lang)}
      </h2>

      <div className="faq-list">
        {faqList.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "active" : ""}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="faq-q-text">
                <span className="faq-q-label">Q:</span> {translate(faq.q, lang)}
              </span>
              <svg
                className="faq-icon-chevron"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="faq-answer-wrapper">
              <div className="faq-answer">
                <span className="faq-a-label">A:</span> {translate(faq.a, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}