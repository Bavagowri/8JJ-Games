


// react-app/src/pages/Contact/Contact.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import SEO from "../../components/SEO/SEO";
import { generateKeywords } from "../../config/seoKeywords";
import './Contact.css';

export default function Contact() {
  const { lang } = useLanguage();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =======================
      NEW: JSON-LD SCHEMA MARKUP
  ======================== */
  useEffect(() => {
    // ContactPage Schema
    const contactPageSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact 8JJ Games",
      "description": "Get in touch with 8JJ Games support team. Send feedback, report issues, or ask questions about our free online games platform.",
      "url": "https://8jjgames.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
        "logo": "https://8jjgames.com/8JJ_games.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@8jjgames.com",
          "contactType": "Customer Support",
          "availableLanguage": ["English", "Spanish", "French", "German"],
          "areaServed": "Worldwide"
        },
        "sameAs": [
          "https://www.facebook.com/games8jj/",
          "https://www.instagram.com/8jjgames/",
          "https://t.me/+EqU2725tjvthYWRl",
          "https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ"
        ]
      }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://8jjgames.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://8jjgames.com/contact"
        }
      ]
    };

    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "8JJ Games",
      "alternateName": "8jj-games",
      "url": "https://8jjgames.com",
      "logo": "https://8jjgames.com/8JJ_games.png",
      "description": "Free online gaming platform with thousands of browser-based games. Play action, puzzle, racing, sports games and more - no download required.",
      "email": "support@8jjgames.com",
      "foundingDate": "2020",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@8jjgames.com",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Spanish", "French", "German"]
      },
      "sameAs": [
        "https://www.facebook.com/games8jj/",
        "https://www.instagram.com/8jjgames/",
        "https://t.me/+EqU2725tjvthYWRl"
      ]
    };

    // Add all schemas
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([contactPageSchema, breadcrumbSchema, organizationSchema]);
    schemaScript.id = 'contact-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('contact-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate all fields
    if (!form.name || !form.email || !form.subject || !form.message) {
      return setError(translate("contact_error_required", lang));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError(translate("contact_error_invalid_email", lang));
    }

    // Build email body with user information
    const emailBody = `
Hello 8JJ Games Support Team,

Name: ${form.name}
Email: ${form.email}

Message:
${form.message}

---
This message was sent via the 8JJ Games contact form.
    `.trim();

    // Create Gmail compose URL (priority)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@8jjgames.com&su=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(emailBody)}`;

    // Create mailto link as fallback
    const mailtoLink = `mailto:support@8jjgames.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(emailBody)}`;

    // Try to open Gmail first
    const gmailWindow = window.open(gmailUrl, '_blank');

    // If popup was blocked or user doesn't have Gmail, use mailto as fallback
    if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === 'undefined') {
      window.location.href = mailtoLink;
    }

    // Show success message
    setSuccessMessage(translate("contact_success", lang) || "Your message has been sent! We'll get back to you soon.");

    // Clear form after opening email client
    setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <>
      {/*  IMPROVED: Enhanced SEO Meta Tags */}
      <SEO
        title="Contact Us - 8JJ Games Support & Feedback"
        description="Get in touch with 8JJ Games. Send us your feedback, report issues, or ask questions about our free online games. We're here to help! Available 24/7."
        keywords="contact 8jj games, support, feedback, help, customer service, game support, report issue, contact gaming platform, 8jj games email"
        url="/contact"
        type="website"
        image="/8JJ_games.png"
      />

      <main className="ContactMainWrapper">
        {/* Animated Background */}
        <div className="contact-background" aria-hidden="true">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="contact-container">
          {/*  NEW: Breadcrumb Navigation */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-current">Contact</span>
          </nav>

          {/*  IMPROVED: Hero Section with proper semantic HTML */}
          <header className="contact-hero">
            <div className="logo-section">
              <img
                src="/8JJ_games.png"
                alt="8JJ Games - Free Online Gaming Platform"
                className="contact-logo"
                loading="eager"
              />
            </div>
            {/*  Proper H1 tag */}
            <h1 className="contact-hero-title">
              {translate("contact_hero_title", lang) || "Contact Us"}
            </h1>
            <p className="contact-hero-subtitle">
              {translate("contact_hero_subtitle", lang) || "Get in touch with 8JJ Games. We'd love to hear from you!"}
            </p>
          </header>

          {/* Main Content Grid */}
          <div className="contact-content-grid">
            {/*  IMPROVED: Contact Form with proper semantic structure */}
            <section className="contact-form-section" aria-labelledby="form-heading">
              <article className="form-card">
                {/*  Proper H2 heading */}
                <h2 id="form-heading" className="form-card-title">
                  {translate("contact_form_title", lang) || "Send Us a Message"}
                </h2>
                <p className="form-card-subtitle">
                  {translate("contact_form_subtitle", lang) || "Fill out the form below and we'll get back to you as soon as possible."}
                </p>

                {/* Error Message */}
                {error && (
                  <div className="message-box error-box" role="alert" aria-live="assertive">
                    <span className="message-icon" aria-hidden="true">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="message-box success-box" role="status" aria-live="polite">
                    <span className="message-icon" aria-hidden="true"></span>
                    <span>{successMessage}</span>
                  </div>
                )}

                {/*  IMPROVED: Form with better accessibility */}
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="contact-name" className="label">
                        {translate("contact_label_name", lang) || "Your Name"}
                        <span className="required" aria-label="required">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder={translate("contact_placeholder_name", lang) || "John Doe"}
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                        required
                        aria-required="true"
                        aria-invalid={error && !form.name ? "true" : "false"}
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor="contact-email" className="label">
                        {translate("contact_label_email", lang) || "Your Email"}
                        <span className="required" aria-label="required">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder={translate("contact_placeholder_email", lang) || "john@example.com"}
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                        required
                        aria-required="true"
                        aria-invalid={error && !form.email ? "true" : "false"}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="contact-subject" className="label">
                      {translate("contact_label_subject", lang) || "Subject"}
                      <span className="required" aria-label="required">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder={translate("contact_placeholder_subject", lang) || "How can we help?"}
                      value={form.subject}
                      onChange={handleChange}
                      className="input"
                      required
                      aria-required="true"
                      aria-invalid={error && !form.subject ? "true" : "false"}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="contact-message" className="label">
                      {translate("contact_label_message", lang) || "Your Message"}
                      <span className="required" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder={translate("contact_placeholder_message", lang) || "Tell us what's on your mind..."}
                      value={form.message}
                      onChange={handleChange}
                      className="textarea"
                      rows="6"
                      required
                      aria-required="true"
                      aria-invalid={error && !form.message ? "true" : "false"}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button" 
                    aria-label={translate("contact_send_button", lang) || "Send message"}
                  >
                    <span>{translate("contact_send_button", lang) || "Send Message"}</span>
                    <span className="button-icon" aria-hidden="true">✉️</span>
                  </button>
                </form>
              </article>
            </section>

            {/*  IMPROVED: Contact Info Sidebar with proper semantic HTML */}
            <aside className="contact-info-section" aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="sr-only">Contact Information</h2>
              <div className="info-cards-grid">
                {/* Email Card */}
                <article className="info-card">
                  <div className="info-icon-wrapper" aria-hidden="true">
                    <span className="info-icon">📧</span>
                  </div>
                  <h3 className="info-title">{translate("contact_info_email_title", lang) || "Email Us"}</h3>
                  <p className="info-text">
                    <a 
                      href="mailto:support@8jjgames.com" 
                      className="email-link"
                      aria-label="Send email to support@8jjgames.com"
                    >
                      support@8jjgames.com
                    </a>
                  </p>
                  <p className="info-subtext">
                    {translate("contact_info_email_response", lang) || "We typically respond within 24 hours"}
                  </p>
                </article>

                {/* Telegram Card */}
                <article className="info-card">
                  <div className="info-icon-wrapper" aria-hidden="true">
                    <span className="info-icon">💬</span>
                  </div>
                  <h3 className="info-title">{translate("contact_info_telegram_title", lang) || "Join Our Telegram"}</h3>
                  <p className="info-text">
                    {translate("contact_info_telegram_status", lang) || "Chat with our community"}
                  </p>
                  <a 
                    href="https://t.me/+EqU2725tjvthYWRl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-button"
                    aria-label="Join Telegram community - Opens in new tab"
                  >
                    {translate("contact_info_telegram_button", lang) || "Join Now"}
                  </a>
                </article>

                {/* Social Media Card */}
                <article className="info-card">
                  <div className="info-icon-wrapper" aria-hidden="true">
                    <span className="info-icon">🌐</span>
                  </div>
                  <h3 className="info-title">{translate("contact_info_follow_title", lang) || "Follow Us"}</h3>
                  <nav className="social-links" aria-label="Social media links">
                    <a 
                      href="https://www.facebook.com/games8jj/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link" 
                      aria-label="Follow 8JJ Games on Facebook - Opens in new tab"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
                        <title>Facebook</title>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/8jjgames/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link" 
                      aria-label="Follow 8JJ Games on Instagram - Opens in new tab"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
                        <title>Instagram</title>
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link" 
                      aria-label="Join 8JJ Games WhatsApp group - Opens in new tab"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
                        <title>WhatsApp</title>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://t.me/+EqU2725tjvthYWRl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link" 
                      aria-label="Join 8JJ Games on Telegram - Opens in new tab"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
                        <title>Telegram</title>
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  </nav>
                </article>

                {/* Help Center Card */}
                <article className="info-card">
                  <div className="info-icon-wrapper" aria-hidden="true">
                    <span className="info-icon">❓</span>
                  </div>
                  <h3 className="info-title">{translate("contact_info_help_title", lang) || "Need Help?"}</h3>
                  <p className="info-text">
                    {translate("contact_info_help_text", lang) || "Visit our About page to learn more about 8JJ Games"}
                  </p>
                  <Link 
                    to="/about" 
                    className="info-button"
                    aria-label="Visit About page to learn more about 8JJ Games"
                  >
                    {translate("contact_info_help_button", lang) || "Learn More"}
                  </Link>
                </article>
              </div>
            </aside>
          </div>

          {/*  NEW: Additional Content Section for SEO */}
          <section className="contact-additional-info" aria-labelledby="additional-info-heading">
            <h2 id="additional-info-heading" className="section-title">Why Contact 8JJ Games?</h2>
            <div className="info-content">
              <p>
                At 8JJ Games, we value our community and are committed to providing the best gaming experience. 
                Whether you have a question, suggestion, or need technical support, our team is here to help.
              </p>
              <p>
                We typically respond to all inquiries within 24 hours. For urgent issues, please use our 
                Telegram or WhatsApp channels for faster support from our community moderators.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}