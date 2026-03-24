import { Typography } from "./ui/typography";

export function Terms() {
  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="space-y-6">
          <div className="text-center space-y-4 mb-8">
            <Typography.H1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Terms of Service
            </Typography.H1>
            <Typography.P>
              Last updated: February 19, 2026
            </Typography.P>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <Typography.H2>1. Acceptance of Terms</Typography.H2>
              <Typography.P>
                By accessing and using LumenID, you accept and agree to be bound by the terms and provision of this agreement.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>2. Use License</Typography.H2>
              <Typography.P>
                Permission is granted to temporarily use LumenID for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>3. User Accounts</Typography.H2>
              <Typography.P>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>4. Credential Management</Typography.H2>
              <Typography.P>
                Users agree to submit only authentic, verifiable credentials. Any attempt to submit fraudulent credentials will result in immediate account termination and may be subject to legal action.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>5. Intellectual Property</Typography.H2>
              <Typography.P>
                The service and its original content, features, and functionality are owned by LumenID and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>6. Termination</Typography.H2>
              <Typography.P>
                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>7. Limitation of Liability</Typography.H2>
              <Typography.P>
                In no event shall LumenID, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H2>8. Disclaimer</Typography.H2>
              <Typography.P>
                Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis.
              </Typography.P>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}