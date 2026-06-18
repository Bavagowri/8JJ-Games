import React from "react";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import SEO from "../../../components/SEO/SEO";
import PrivacyPolicyContent from "../../../components/Legal/PrivacyPolicyContent";

export default function MobilePrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy - 8JJ Games"
        description="Read the Privacy Policy of 8JJ Games."
        url="/privacy-policy"
      />

      <div className="mobile-privacy-wrapper">
        <MobileHeader />

        <main className="mobile-privacy-content">
          <PrivacyPolicyContent />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}
