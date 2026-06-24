import type { Metadata } from 'next'
import LegalPage from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Cookie Notice — Taska',
}

export default function CookiesPage() {
  return (
    <LegalPage currentPage="cookies">
      <h1>Cookie Notice</h1>
      <p>Last updated: June 2026</p>

      <p>This Cookie Notice explains how Taska, operated by <a href="https://www.betaworks.co.uk" target="_blank" rel="noopener noreferrer">Beta Works</a>, uses cookies and similar technologies when you visit or use our service.</p>

      <hr />

      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They help the website remember information about your visit.</p>

      <hr />

      <h2>Cookies We Use</h2>
      <p>Taska uses only <strong>essential cookies</strong> — cookies that are strictly necessary for the service to function. We do not use advertising, tracking, or analytics cookies.</p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Authentication session</strong></td>
            <td>Keeps you logged in to your account</td>
            <td>Session / 7 days</td>
          </tr>
          <tr>
            <td><strong>Security token</strong></td>
            <td>Protects against cross-site request forgery</td>
            <td>Session</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>What We Do Not Do</h2>
      <ul>
        <li>We do not use advertising cookies</li>
        <li>We do not use third-party tracking cookies</li>
        <li>We do not share cookie data with advertisers</li>
        <li>We do not use cookies to build profiles about you</li>
      </ul>

      <hr />

      <h2>Third Party Cookies</h2>
      <p>Our payment provider Stripe may set cookies during the checkout process for fraud prevention and security purposes. These are governed by Stripe&rsquo;s own privacy policy at stripe.com/privacy.</p>

      <hr />

      <h2>Your Choices</h2>
      <p>Because we only use essential cookies, we do not require your consent to set them under UK GDPR — they are strictly necessary to provide the service you have requested.</p>
      <p>If you disable cookies in your browser, you will not be able to log in to Taska.</p>

      <hr />

      <h2>Changes to This Notice</h2>
      <p>We may update this Cookie Notice from time to time. Any changes will be posted on this page with an updated date.</p>

      <hr />

      <h2>Contact</h2>
      <p>For any questions about our use of cookies, please contact us at hello@betaworks.co.uk</p>
      <p>Innovation Centre, Innovation Way, Heslington, York YO10 5DG</p>
    </LegalPage>
  )
}
