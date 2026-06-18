// src/pages/mobile/MobileContact/MobileContact.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import SEO from "../../../components/SEO/SEO";
import "./MobileContact.css";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";
import {
  HelpCircle,
  Mail,
  Send,
  Phone,
  Zap,
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Facebook,
  Instagram,
  SendHorizonal,
} from "lucide-react";


const CONTACT_ICONS = {
  faq: "/images/icons/help.png",
  thunder: "/images/icons/thunder.png",
  globe: "/images/icons/globe-3.png",
  target: "/images/home-icons-2/target.png",
  sparks: "/images/icons/sparks.png",
  rocket: "/images/home-icons-2/rocket.png",
  telegram: "/images/social-share/telegram.png",
  whatsapp: "/images/social-share/whatsapp.png",
  email: "/images/icons/email.png",
  security: "/images/icons/security-1.png",

};

export default function MobileContact() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // JSON-LD Schema
  useEffect(() => {
    const contactPageSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact 8JJ Games",
      "description": "Get in touch with 8JJ Games support team.",
      "url": "https://8jjgames.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
        "email": "support@8jjgames.com"
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(contactPageSchema);
    schemaScript.id = 'mobile-contact-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('mobile-contact-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate
    if (!form.name || !form.email || !form.subject || !form.message) {
      return setError(translate("contact_error_required", lang) || "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError(translate("contact_error_invalid_email", lang) || "Invalid email address");
    }

    setIsSubmitting(true);

    const emailBody = `
Hello 8JJ Games Support Team,

Name: ${form.name}
Email: ${form.email}

Message:
${form.message}

---
This message was sent via the 8JJ Games mobile contact form.
    `.trim();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@8jjgames.com&su=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoLink = `mailto:support@8jjgames.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(emailBody)}`;

    const gmailWindow = window.open(gmailUrl, '_blank');

    if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === 'undefined') {
      window.location.href = mailtoLink;
    }

    setSuccessMessage(translate("contact_success", lang) || "Message sent! We'll get back to you soon.");
    setIsSubmitting(false);

    setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <>
      <SEO
        title="Contact Us - 8JJ Games Mobile"
        description="Get in touch with 8JJ Games. Send feedback, report issues, or ask questions about our free mobile games."
        keywords="contact 8jj games, support, feedback, help, mobile gaming support"
        url="/contact"
        type="website"
      />

      <div className="mobile-contact-wrapper">
        <MobileHeader />

        <MobileBreadcrumb
          items={[
            { label: translate("home", lang) || "Home", path: "/", icon: "" },
            { label: translate("contactz", lang) || "Contact", icon: "" }
          ]}
        />

        <main className="mobile-contact-page">
          {/* Animated Background */}
          <div className="mobile-contact-bg">
            <div className="mobile-contact-gradient-orb orb-1"></div>
            <div className="mobile-contact-gradient-orb orb-2"></div>
          </div>

          {/* Hero Section */}
          <section className="mobile-contact-hero">
            <div className="mobile-contact-hero-icon">
              <span className="mobile-contact-emoji">
                <img src={CONTACT_ICONS.faq} className="mobile-contact-emoji" alt="" />
              </span>
            </div>
            <h1 className="mobile-contact-hero-title">
              {translate("contact_hero_title", lang) || "Contact Us"}
            </h1>
            <p className="mobile-contact-hero-subtitle">
              {translate("contact_hero_subtitle", lang) || "Get in touch with 8JJ Games. We'd love to hear from you!"}{translate("contact_hero_subtitle", lang) || "We'd love to hear from you!"}
            </p>
          </section>

          {/* Quick Actions */}
          <section className="mobile-contact-quick-actions">
            <a href="mailto:support@8jjgames.com" className="mobile-contact-quick-btn">
              <Mail className="mobile-contact-quick-icon" />
              <span>Email</span>
            </a>

            <a
              href="https://t.me/+EqU2725tjvthYWRl"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-contact-quick-btn"
            >
              <Send className="mobile-contact-quick-icon" />
              <span>Telegram</span>
            </a>

            <a
              href="https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-contact-quick-btn"
            >
              <Phone className="mobile-contact-quick-icon" />
              <span>WhatsApp</span>
            </a>
          </section>


          {/* Contact Form */}
          <section className="mobile-contact-form-section">
            <div className="mobile-contact-form-header">
              <h2 className="mobile-contact-form-title">
                {translate("contact_form_title", lang) || "Send Us a Message"}
              </h2>
              <p className="mobile-contact-form-subtitle">
                {translate("contact_form_subtitle", lang) || "Fill out the form below and we'll get back to you as soon as possible."}
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mobile-contact-message error" role="alert">
                <AlertTriangle className="mobile-contact-message-icon" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mobile-contact-message success" role="status">
                <CheckCircle className="mobile-contact-message-icon" />
                <span>{successMessage}</span>
              </div>
            )}


            <form onSubmit={handleSubmit} className="mobile-contact-form">
              <div className="mobile-contact-input-group">
                <label htmlFor="name" className="mobile-contact-label">
                  {translate("contact_label_name", lang) || "Your Name"}
                  <span className="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={translate("contact_placeholder_name", lang) || "John Doe"}
                  value={form.name}
                  onChange={handleChange}
                  className="mobile-contact-input"
                  required
                />
              </div>

              <div className="mobile-contact-input-group">
                <label htmlFor="email" className="mobile-contact-label">
                  {translate("contact_label_email", lang) || "Your Email"}
                  <span className="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={translate("contact_placeholder_email", lang) || "john@example.com"}
                  value={form.email}
                  onChange={handleChange}
                  className="mobile-contact-input"
                  required
                />
              </div>

              <div className="mobile-contact-input-group">
                <label htmlFor="subject" className="mobile-contact-label">
                  {translate("contact_label_subject", lang) || "Subject"}
                  <span className="required">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder={translate("contact_placeholder_subject", lang) || "How can we help?"}
                  value={form.subject}
                  onChange={handleChange}
                  className="mobile-contact-input"
                  required
                />
              </div>

              <div className="mobile-contact-input-group">
                <label htmlFor="message" className="mobile-contact-label">
                  {translate("contact_label_message", lang) || "Your Message"}
                  <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={translate("contact_placeholder_message", lang) || "Tell us what's on your mind..."}
                  value={form.message}
                  onChange={handleChange}
                  className="mobile-contact-textarea"
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                className="mobile-contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mobile-contact-spinner"></span>
                    <span>{translate("sending", lang) || "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <span>{translate("contact_send_button", lang) || "Send Message"}</span>
                    <span className="mobile-contact-btn-icon"></span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Info Cards */}
          <section className="mobile-contact-info-section">
            <h2 className="mobile-contact-section-title">
              {translate("contact_info_title", lang) || "Other Ways to Reach Us"}
            </h2>

            <div className="mobile-contact-info-cards">
              <div className="mobile-contact-info-card">
                <Zap className="mobile-contact-info-icon" />
                <h3 className="mobile-contact-info-title">
                  {translate("contact_info_fast_response", lang) || "Fast Response"}
                </h3>
                <p className="mobile-contact-info-text">
                  {translate("contact_info_email_response", lang) || "We typically respond within 24 hours"}
                </p>
              </div>

              <div className="mobile-contact-info-card">
                <Globe className="mobile-contact-info-icon" />
                <h3 className="mobile-contact-info-title">
                  {translate("contact_info_global", lang) || "Global Support"}
                </h3>
                <p className="mobile-contact-info-text">
                  {translate("contact_info_languages", lang) || "Support in multiple languages"}
                </p>
              </div>

              <div className="mobile-contact-info-card">
                <ShieldCheck className="mobile-contact-info-icon" />
                <h3 className="mobile-contact-info-title">
                  {translate("contact_info_secure", lang) || "Secure"}
                </h3>
                <p className="mobile-contact-info-text">
                  {translate("contact_info_privacy", lang) || "Your privacy is important to us"}
                </p>
              </div>
            </div>
          </section>


          {/* Social Section */}
          <section className="mobile-contact-social-section">
            <h2 className="mobile-contact-section-title">
              {translate("contact_info_follow_title", lang) || "Follow Us"}
            </h2>

            <div className="mobile-contact-social-links">
              <a
                href="https://www.facebook.com/games8jj/"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-social-link facebook"
                aria-label="Facebook"
              >
                <Facebook />
              </a>

              <a
                href="https://www.instagram.com/8jjgames/"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-social-link instagram"
                aria-label="Instagram"
              >
                <Instagram />
              </a>

              <a
                href="https://t.me/+EqU2725tjvthYWRl"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-social-link telegram"
                aria-label="Telegram"
              >
                <SendHorizonal />
              </a>
            </div>
          </section>


          <div className="mobile-footer-space" />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}