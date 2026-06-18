// react-app/src/components/FAQ/FAQ.jsx

import { useState, useEffect } from "react";
import "./FAQ.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";


const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const HOME_ICONS = {
  featured: `${R2_BASE}/8jj_icons/icons/help-2.webp`, 
}

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

  /* =======================
      JSON-LD SCHEMA: FAQPage
  ======================== */
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqList.map((faq) => ({
        "@type": "Question",
        "name": translate(faq.q, lang),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate(faq.a, lang)
        }
      }))
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(faqSchema);
    schemaScript.id = 'faq-schema';
    document.head.appendChild(schemaScript);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [lang]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  //  Keyboard support for accessibility
  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <section 
      id="faqSection" 
      className="faq-container"
      aria-labelledby="faq-heading"
    >
      {/*  Proper H2 heading for section */}
      {/* <h2 id="faq-heading" className="section-title">
        <span className="faq-icon" aria-hidden="true">❓</span>
        {translate("faqTitle", lang)}
      </h2> */}

      {/* Proper H2 heading for section */}
      <h2 id="faq-heading" className="section-title">
        <img
          src={HOME_ICONS.featured}
          className="faq-icon"
          alt=""
          aria-hidden="true"
        />
        {translate("faqTitle", lang)}
      </h2>


      {/*  Semantic list with proper ARIA attributes */}
      <div className="faq-list" role="list">
        {faqList.map((faq, index) => (
          <article
            key={index}
            className={`faq-item ${openIndex === index ? "active" : ""}`}
            role="listitem"
            itemScope
            itemType="https://schema.org/Question"
          >
            {/*  Accessible button with proper ARIA */}
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
              tabIndex={0}
            >
              <span className="faq-q-text" itemProp="name">
                <span className="faq-q-label" aria-hidden="true">Q:</span>
                <span className="sr-only">Question:</span>
                {translate(faq.q, lang)}
              </span>
              
              {/*  Accessible chevron icon */}
              <svg
                className="faq-icon-chevron"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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

            {/*  Answer with proper ARIA and semantic markup */}
            <div 
              className="faq-answer-wrapper"
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              itemScope
              itemType="https://schema.org/Answer"
              itemProp="acceptedAnswer"
            >
              <div className="faq-answer" itemProp="text">
                <span className="faq-a-label" aria-hidden="true">A:</span>
                <span className="sr-only">Answer:</span>
                {translate(faq.a, lang)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}