import React from "react";
import { getTerms, updateTerms } from "../api/contentApi";
import RichContentPage from "../components/RichContentPage";

const TERMS_KEYS = ["Terms & Condition", "terms", "content", "description"];

const TERMS_FALLBACK = `
  <h1>Terms and Conditions</h1>
  <p><strong>Last Updated: March 21, 2026</strong></p>

  <h2>1. Use of the Website and Services</h2>
  <p>You agree to use this website and our services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use and enjoyment of the website.</p>
  <p><strong>You may not:</strong></p>
  <ul>
    <li>Use the site in any way that causes, or may cause, damage to the website or impair the availability or accessibility of the website.</li>
    <li>Use the site to copy, store, host, transmit, send, use, publish, or distribute any material that consists of (or is linked to) any malicious software.</li>
  </ul>

  <h2>2. Intellectual Property Rights</h2>
  <p>All content on the site, including but not limited to text, graphics, logos, images, software, and trademarks, is the property of <strong>VN AQUA RAS PRIVATE LIMITED</strong> or its content suppliers and is protected by intellectual property laws.</p>
  <p>You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the site or services without express written permission from us.</p>

  <h2>3. User Accounts</h2>
  <p>If any part of the website requires you to register or create an account:</p>
  <ul>
    <li>You must provide accurate, current, and complete information.</li>
    <li>You are responsible for maintaining the confidentiality of your account and password.</li>
    <li>You agree to accept responsibility for all activities that occur under your account.</li>
  </ul>
  <p>We reserve the right to suspend or terminate accounts at our discretion.</p>

  <h2>4. Limitation of Liability</h2>
  <p>To the fullest extent permitted by law, <strong>VN AQUA RAS PRIVATE LIMITED</strong> shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use our website or services.</p>
  <p>This includes, but is not limited to, damages for errors, omissions, interruptions, defects, delays, or computer viruses.</p>

  <h2>5. Indemnification</h2>
  <p>You agree to indemnify, defend, and hold harmless <strong>VN AQUA RAS PRIVATE LIMITED</strong>, its directors, officers, employees, affiliates, agents, and licensors from and against all losses, liabilities, expenses, damages, and costs resulting from any violation of these Terms.</p>

  <h2>6. Privacy Policy</h2>
  <p>Use of our website and services is also governed by our Privacy Policy, which can be found at <a href="https://daycatch.in/privacy-policy/">https://daycatch.in/privacy-policy/</a>.</p>

  <h2>7. Changes to the Terms</h2>
  <p>We reserve the right to modify or replace these Terms at any time. Your continued use of the site or services after changes are made signifies your acceptance of those changes.</p>

  <h2>8. Governing Law</h2>
  <p>These Terms shall be governed and construed in accordance with the laws of <strong>Telangana, India</strong>. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Telangana.</p>

  <h2>9. Termination</h2>
  <p>We reserve the right to suspend or terminate your access to our website and services without notice for conduct that we believe violates these Terms or is harmful to other users or us.</p>

  <h2>10. Contact Us</h2>
  <p>If you have any questions or concerns about these Terms and Conditions, please contact us:</p>
  <p><strong>VN AQUA RAS PRIVATE LIMITED</strong></p>
  <p><strong>Address:</strong> VN AQUA RAS PRIVATE LIMITED, Near Fish and Chips Restaurant, Shop No 1,2 Ongole Highway, Penumudi road, Repalle 522265</p>
  <p><strong>Email:</strong> info@daycatch.in</p>
  <p><strong>Phone:</strong> +919492500929</p>
`;

const TermsAndConditions = () => {
  return (
    <RichContentPage
      title="Compliance & Terms"
      description="Review and modify the legal framework and platform terms served to consumers."
      fetchContent={getTerms}
      updateContent={updateTerms}
      contentKeys={TERMS_KEYS}
      fallbackContent={TERMS_FALLBACK}
      emptyMessage="Legal documentation sync required."
    />
  );
};

export default TermsAndConditions;
