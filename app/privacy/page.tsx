import type { Metadata } from 'next'
import LegalPage from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Taska',
}

export default function PrivacyPage() {
  return (
    <LegalPage currentPage="privacy">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 2026</p>

      <p>Taska is operated by <a href="https://www.betaworks.co.uk" target="_blank" rel="noopener noreferrer">Beta Works</a>, Innovation Centre, Innovation Way, Heslington, York YO10 5DG (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

      <p>Please read this policy carefully. By using Taska, you agree to the collection and use of your data as described here.</p>

      <hr />

      <h2>1. Who We Are</h2>
      <p>Taska is a task management application for freelancers, operated by <a href="https://www.betaworks.co.uk" target="_blank" rel="noopener noreferrer">Beta Works</a>.</p>
      <p><strong>Contact:</strong> hello@betaworks.co.uk<br /><strong>Address:</strong> Innovation Centre, Innovation Way, Heslington, York YO10 5DG</p>

      <hr />

      <h2>2. What Data We Collect</h2>
      <p>We collect and process the following personal data:</p>
      <ul>
        <li><strong>Account information</strong> — your name and email address when you register</li>
        <li><strong>Profile photo</strong> — if you choose to upload one</li>
        <li><strong>Usage data</strong> — clients, projects and tasks you create within the app</li>
        <li><strong>Payment information</strong> — handled securely by Stripe; we never see or store your card details</li>
        <li><strong>Technical data</strong> — IP address, browser type, and device information for security and performance purposes</li>
      </ul>

      <hr />

      <h2>3. How We Use Your Data</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Provide and maintain the Taska service</li>
        <li>Manage your account and subscription</li>
        <li>Send transactional emails (account confirmation, password reset)</li>
        <li>Respond to support requests</li>
        <li>Improve the app based on usage patterns</li>
        <li>Meet our legal obligations</li>
      </ul>

      <hr />

      <h2>4. Legal Basis for Processing</h2>
      <p>We process your data on the following legal bases:</p>
      <ul>
        <li><strong>Contract</strong> — to deliver the service you have signed up for</li>
        <li><strong>Legitimate interests</strong> — to improve and secure the service</li>
        <li><strong>Legal obligation</strong> — where required by law</li>
      </ul>

      <hr />

      <h2>5. Third Parties We Share Data With</h2>
      <p>We use the following trusted third-party services to operate Taska:</p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Privacy Policy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Supabase</strong></td>
            <td>Database and authentication</td>
            <td>supabase.com/privacy</td>
          </tr>
          <tr>
            <td><strong>Stripe</strong></td>
            <td>Payment processing</td>
            <td>stripe.com/privacy</td>
          </tr>
          <tr>
            <td><strong>Resend</strong></td>
            <td>Transactional email delivery</td>
            <td>resend.com/privacy</td>
          </tr>
          <tr>
            <td><strong>Vercel</strong></td>
            <td>Application hosting</td>
            <td>vercel.com/legal/privacy-policy</td>
          </tr>
        </tbody>
      </table>
      <p>We do not sell your personal data to any third party.</p>

      <hr />

      <h2>6. Data Retention</h2>
      <p>We retain your personal data for as long as your account is active. If you delete your account, your data will be permanently deleted within 30 days, except where we are required to retain it for legal or financial purposes.</p>

      <hr />

      <h2>7. Your Rights</h2>
      <p>Under UK GDPR you have the right to:</p>
      <ul>
        <li><strong>Access</strong> — request a copy of the data we hold about you</li>
        <li><strong>Rectification</strong> — ask us to correct inaccurate data</li>
        <li><strong>Erasure</strong> — ask us to delete your data (&ldquo;right to be forgotten&rdquo;)</li>
        <li><strong>Restriction</strong> — ask us to limit how we use your data</li>
        <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
        <li><strong>Object</strong> — object to our processing of your data</li>
      </ul>
      <p>To exercise any of these rights, please contact us at hello@betaworks.co.uk. We will respond within 30 days.</p>

      <hr />

      <h2>8. Cookies</h2>
      <p>We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. For full details please see our <a href="/cookies">Cookie Notice</a>.</p>

      <hr />

      <h2>9. Security</h2>
      <p>We take the security of your data seriously. All data is encrypted in transit and at rest. We use industry-standard authentication and access controls. However, no method of transmission over the internet is 100% secure.</p>

      <hr />

      <h2>10. Changes to This Policy</h2>
      <p>We may update this policy from time to time. We will notify you of any significant changes by email or via a notice within the app. The date at the top of this page indicates when it was last updated.</p>

      <hr />

      <h2>11. Complaints</h2>
      <p>If you are unhappy with how we handle your data, you have the right to complain to the Information Commissioner&rsquo;s Office (ICO) at ico.org.uk or by calling 0303 123 1113.</p>

      <hr />

      <p>For any privacy-related questions, contact us at hello@betaworks.co.uk</p>
    </LegalPage>
  )
}
