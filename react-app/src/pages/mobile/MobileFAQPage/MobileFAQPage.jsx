// src/pages/mobile/MobileFAQPage/MobileFAQPage.jsx
import { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { ChevronDown } from "lucide-react";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import SEO from "../../../components/SEO/SEO";
import "./MobileFAQPage.css";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";

const HOME_ICONS = {
  help: "/images/icons/help-2.png",
};

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

export default function MobileFAQPage() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <>
      {/* SEO */}
      <SEO
        title={`${translate("faqTitle", lang)} | 8JJ Games`}
        description="Find answers to frequently asked questions about 8JJ Games. Learn about our free online games, how to play, and more."
        keywords="FAQ, help, questions, 8JJ Games, online games, free games"
        url="/faq"
        type="website"
      />

      <div className="mobile-faq-page-wrapper">
        {/* Header */}
        <MobileHeader />


        

        {/* Main Content */}
        <div className="mobile-contentz">
          <section
            className="mobile-faq-sectionz mobile-faq-page-section"
            aria-labelledby="mobile-faq-heading"
          >
            <MobileBreadcrumb
          items={[
            { label: translate("home", lang) || "Home", path: "/", icon: "" },
            { label: translate("faqTitle", lang) || "FAQ", icon: "" }
          ]}
        />
            {/* Section Header */}
            <div className="mobile-faq-header">
              
              <img
                src={HOME_ICONS.help}
                className="mobile-faq-icon"
                alt=""
                aria-hidden="true"
              />
              <h1 id="mobile-faq-heading" className="mobile-faq-title">
                {translate("faqTitle", lang)}
              </h1>
            </div>

            {/* FAQ List */}
            <div className="mobile-faq-listz" role="list">
              {faqList.map((faq, index) => (
                <article
                  key={index}
                  className={`mobile-faq-item ${openIndex === index ? "active" : ""}`}
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  {/* Question Button */}
                  <button
                    className="mobile-faq-question"
                    onClick={() => toggleFAQ(index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`mobile-faq-answer-${index}`}
                    id={`mobile-faq-question-${index}`}
                    tabIndex={0}
                  >
                    <span className="mobile-faq-q-text" itemProp="name">
                      <span className="mobile-faq-q-label" aria-hidden="true">Q</span>
                      <span className="mobile-faq-sr-only">Question:</span>
                      <span>{translate(faq.q, lang)}</span>
                    </span>

                    <ChevronDown
                      className="mobile-faq-chevron"
                      size={20}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Answer */}
                  <div
                    className="mobile-faq-answer-wrapper"
                    id={`mobile-faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`mobile-faq-question-${index}`}
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <div className="mobile-faq-answer" itemProp="text">
                      <span className="mobile-faq-a-label" aria-hidden="true">A</span>
                      <span className="mobile-faq-sr-only">Answer:</span>
                      <span>{translate(faq.a, lang)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Footer Space */}
          <div className="mobile-footer-space" />
        </div>

        {/* Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
}