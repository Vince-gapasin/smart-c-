import { Typography } from "./ui/typography";

export function Privacy() {
  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="space-y-6">
          <div className="text-center space-y-4 mb-8">
            <Typography.H1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Privacy Policy
            </Typography.H1>
            <Typography.P>
              Last updated: February 19, 2026
            </Typography.P>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <Typography.H2>1. Information We Collect</Typography.H2>
              <Typography.P>
                We collect information that you provide directly to us, including your name, email address, phone number, educational credentials, and supporting documents.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>2. How We Use Your Information</Typography.H2>
              <Typography.P>
                We use the information we collect to verify your credentials, maintain your digital identity, and provide you with our services. We also use it to communicate with you and improve our platform.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>3. Blockchain Storage</Typography.H2>
              <Typography.P>
                Your verified credentials are stored on the blockchain for immutability and transparency. Once stored, credentials cannot be altered or deleted, ensuring the integrity of your digital identity.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>4. Data Security</Typography.H2>
              <Typography.P>
                We implement industry-standard security measures including encryption, two-factor authentication, and secure data transmission protocols to protect your information.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>5. Information Sharing</Typography.H2>
              <Typography.P>
                We do not sell your personal information. We may share your information with educational institutions for verification purposes and with employers only with your explicit consent through credential sharing.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>6. Your Rights</Typography.H2>
              <Typography.P>
                You have the right to access, update, and request deletion of your personal information. You can control who can view your verified credentials through our selective disclosure features.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>7. Cookies and Tracking</Typography.H2>
              <Typography.P>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>8. Third-Party Services</Typography.H2>
              <Typography.P>
                We may employ third-party companies and individuals to facilitate our service. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>9. Data Retention</Typography.H2>
              <Typography.P>
                We retain your personal information for as long as necessary to provide you with our services and as required by law. Verified credentials stored on the blockchain are permanent and immutable.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>10. Children's Privacy</Typography.H2>
              <Typography.P>
                Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>11. International Data Transfers</Typography.H2>
              <Typography.P>
                Your information may be transferred to and maintained on computers located outside of your jurisdiction where data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>12. Changes to This Privacy Policy</Typography.H2>
              <Typography.P>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>13. Contact Us</Typography.H2>
              <Typography.P>
                If you have any questions about this Privacy Policy, please contact us at privacy@lumenid.com
              </Typography.P>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}