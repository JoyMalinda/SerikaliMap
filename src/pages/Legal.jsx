import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../accordion.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Legal() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const Section = ({ id, title, children }) => {
    const isOpen = openSection === id;

    return (
    <div
      id={id}
      class="accordion"
    >
      {/* Header button */}
      <label for="state">
      <button
        onClick={() => toggleSection(id)}
        class="accordion__header"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        {title}
        <span class={`accordion__chev ${isOpen ? "open" : ""}`} aria-hidden><ChevronUp className="w-5 h-5" /></span>
      </button>
      </label>
      <input type="checkbox" id="state" hidden></input>

      {/* Animated body */}
          <div
            key={`${id}-content`}
            id={`${id}-content`}
            class="accordion__body"
        aria-hidden={!isOpen}
      >
        <div class="accordion__inner">
            {children}
        </div>
          </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Header */}
      <div className="bg-green-100 mt-16 py-8 text-center">
        <h1 className="text-3xl font-semibold text-green-900">
          Legal Information
        </h1>
        <p className="text-gray-700 mt-1">
          Terms of Use • Cookie Policy • Privacy Policy
        </p>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 py-10">
        <div className="max-w-3xl w-full flex flex-col gap-6">
          {/* TERMS OF USE */}
          <Section id="terms" title="Terms of Use">
            <p>
              <strong>Last Updated:</strong> October 2025
            </p>
            <p>
              Throughout the site, the terms <strong>“we”</strong>,{" "}
              <strong>“us”</strong>, and <strong>“our”</strong> refer to{" "}
              <strong>SerikaliMap</strong>. By accessing or using this website
              (the “Site”), you agree to be bound by these Terms of Use and all
              applicable laws and regulations.
            </p>

            <h3 className="font-semibold text-green-800">
              1. Purpose of the Website
            </h3>
            <p>
              SerikaliMap is an academic project designed to make publicly
              available data about Kenyan elected officials more accessible and
              visually understandable. The content is intended for
              informational, research, and educational purposes only.
            </p>

            <h3 className="font-semibold text-green-800">2. Use of Public Data</h3>
            <p>
              The information provided on SerikaliMap is derived from publicly
              available and open government sources. We do not claim ownership
              over any of this data.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                You must comply with all applicable laws and regulations when
                using or sharing the information.
              </li>
              <li>
                You must not misrepresent the data or present it in a misleading
                or harmful manner.
              </li>
              <li>
                You must not imply endorsement by SerikaliMap, its contributors,
                or affiliated institutions.
              </li>
              <li>
                You are encouraged, but not required, to credit the source
                (SerikaliMap) when redistributing.
              </li>
            </ul>

            <h3 className="font-semibold text-green-800">
              3. Accuracy and Availability
            </h3>
            <p>
              While we strive to keep the information accurate and up to date,
              we make no guarantees regarding completeness, reliability, or
              timeliness. We reserve the right to modify or remove content at
              any time without notice.
            </p>

            <h3 className="font-semibold text-green-800">4. No Liability</h3>
            <p>
              SerikaliMap and its contributors shall not be held liable for any
              direct, indirect, incidental, or consequential damages arising
              from the use or inability to use this Site or any information
              provided herein. You use this Site at your own risk.
            </p>

            <h3 className="font-semibold text-green-800">5. External Links</h3>
            <p>
              Our Site may contain links to third-party websites. We are not
              responsible for their content, accuracy, or privacy practices.
            </p>

            <h3 className="font-semibold text-green-800">
              6. Intellectual Property
            </h3>
            <p>
              Except for public data, all original design elements, text, and
              visuals created by SerikaliMap are protected under copyright laws.
              These may not be reused without permission.
            </p>

            <h3 className="font-semibold text-green-800">7. Governing Law</h3>
            <p>These Terms are governed by the laws of Kenya.</p>
          </Section>

          {/* COOKIE POLICY */}
          <Section id="cookies" title="Cookie Policy">
            <p>
              <strong>Last Updated:</strong> October 2025
            </p>
            <p>
              SerikaliMap uses cookies and similar technologies to ensure proper
              functionality, improve security, and analyze usage patterns.
            </p>

            <h3 className="font-semibold text-green-800">1. What Are Cookies?</h3>
            <p>
              Cookies are small text files stored on your device to help
              websites function efficiently and improve user experience.
            </p>

            <h3 className="font-semibold text-green-800">
              2. How We Use Cookies
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Used for site functionality
                and security, including rate limiting to protect against
                excessive requests.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Set by Google Analytics and
                Google Search Console to understand how visitors use the Site.
              </li>
              <li>
                <strong>Preference Cookies:</strong> May store basic settings
                like preferred display modes.
              </li>
            </ul>

            <h3 className="font-semibold text-green-800">
              3. Managing Cookies
            </h3>
            <p>
              You can control or delete cookies through your browser settings.
              Disabling some cookies may affect how the site functions.
            </p>

            <p>
              Learn more about how Google uses your data:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline hover:text-green-900"
              >
                Google Partner Sites Policy
              </a>
            </p>

            <h3 className="font-semibold text-green-800">4. Data Protection</h3>
            <p>
              Any IP addresses or identifiers collected through rate limiting or
              analytics are used solely for security and performance purposes.
              They are not used to personally identify you.
            </p>
          </Section>

          {/* PRIVACY POLICY */}
          <Section id="privacy" title="Privacy Policy">
            <p>
              <strong>Last Updated:</strong> October 2025
            </p>
            <p>
              This Privacy Policy explains how <strong>SerikaliMap</strong>{" "}
              collects, uses, and protects your information.
            </p>

            <h3 className="font-semibold text-green-800">
              1. Information We Collect
            </h3>
            <p>
              We only collect information through the <strong>Contact Form</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Message</li>
            </ul>

            <h3 className="font-semibold text-green-800">
              2. How We Use Your Information
            </h3>
            <p>
              Contact form submissions are used only for responding to questions
              or feedback. They are not stored in a database or shared with
              anyone else.
            </p>

            <h3 className="font-semibold text-green-800">3. Data Handling</h3>
            <p>
              Submissions are sent directly to our official email address and
              protected against unauthorized access.
            </p>

            <h3 className="font-semibold text-green-800">
              4. Analytics and Cookies
            </h3>
            <p>
              We use Google Analytics and Search Console to monitor traffic and
              performance. Data collected (like IP addresses and device info) is
              anonymized and cannot personally identify you.
            </p>

            <h3 className="font-semibold text-green-800">5. Security Measures</h3>
            <p>
              We use rate limiting and protective systems that may log IP
              addresses for security purposes only.
            </p>

            <h3 className="font-semibold text-green-800">6. Your Rights</h3>
            <p>
              You may contact us via the Contact Form to request deletion or
              correction of any prior communication.
            </p>

            <h3 className="font-semibold text-green-800">7. Updates</h3>
            <p>
              Changes to this policy will be reflected on this page with an
              updated “Last Updated” date.
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
