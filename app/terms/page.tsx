import type { Metadata } from 'next'
import LegalPage from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Taska',
}

export default function TermsPage() {
  return (
    <LegalPage currentPage="terms">
      <h1>Terms of Service</h1>
      <p>Last updated: June 2026</p>

      <p>These Terms of Service govern your use of Taska, operated by <a href="https://www.betaworks.co.uk" target="_blank" rel="noopener noreferrer">Beta Works</a>, Innovation Centre, Innovation Way, Heslington, York YO10 5DG (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By creating an account you agree to these terms.</p>

      <hr />

      <h2>1. The Service</h2>
      <p>Taska is a web-based task management application designed for freelancers. We provide tools to organise clients, projects and tasks.</p>

      <hr />

      <h2>2. Your Account</h2>
      <ul>
        <li>You must be at least 18 years old to use Taska</li>
        <li>You are responsible for keeping your login credentials secure</li>
        <li>You must provide accurate information when registering</li>
        <li>One person may not operate multiple accounts to circumvent subscription limits</li>
        <li>You are responsible for all activity that occurs under your account</li>
      </ul>

      <hr />

      <h2>3. Subscription and Payment</h2>
      <p><strong>Free Trial</strong><br />New accounts receive a one month free trial with full access to all features. No credit card is required to start your trial.</p>

      <p><strong>Subscription</strong><br />After your trial ends, a subscription of £4.99 per month is required to continue using Taska. Payment is processed securely by Stripe.</p>

      <p><strong>Billing</strong><br />Your subscription renews automatically each month on the date you subscribed. You will be charged the amount shown at the time of purchase.</p>

      <p><strong>Cancellation</strong><br />You may cancel your subscription at any time from the Settings page. Cancellation takes effect at the end of your current billing period. No refunds are issued for partial months.</p>

      <p><strong>Failed Payments</strong><br />If a payment fails, your account will be suspended until payment is resolved. You can update your payment details from the billing page.</p>

      <hr />

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use Taska for any unlawful purpose</li>
        <li>Attempt to gain unauthorised access to our systems</li>
        <li>Upload malicious code or content</li>
        <li>Resell or sublicense access to Taska</li>
        <li>Use the service in a way that could damage or overburden our infrastructure</li>
      </ul>

      <hr />

      <h2>5. Your Data</h2>
      <p>You own all data you create within Taska — your clients, projects and tasks are yours. We do not claim any rights over your content.</p>
      <p>You grant us a limited licence to store and process your data solely for the purpose of providing the service to you.</p>

      <hr />

      <h2>6. Availability</h2>
      <p>We aim to keep Taska available at all times but we do not guarantee uninterrupted access. We may carry out maintenance that temporarily affects availability. We will endeavour to give advance notice of planned downtime.</p>

      <hr />

      <h2>7. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Taska and <a href="https://www.betaworks.co.uk" target="_blank" rel="noopener noreferrer">Beta Works</a> shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you have paid us in the 12 months preceding the claim.</p>

      <hr />

      <h2>8. Changes to the Service</h2>
      <p>We reserve the right to modify or discontinue any part of the service at any time. We will provide reasonable notice of significant changes. Continued use of the service after changes constitutes acceptance of the new terms.</p>

      <hr />

      <h2>9. Changes to These Terms</h2>
      <p>We may update these terms from time to time. We will notify you by email or via the app. The date at the top of this page indicates when the terms were last updated.</p>

      <hr />

      <h2>10. Governing Law</h2>
      <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

      <hr />

      <h2>11. Contact</h2>
      <p>For any questions about these terms, please contact us at hello@betaworks.co.uk</p>
      <p>Innovation Centre, Innovation Way, Heslington, York YO10 5DG</p>
    </LegalPage>
  )
}
