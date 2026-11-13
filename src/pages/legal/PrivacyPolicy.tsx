import React from 'react';
import { ShieldCheck, Lock, Eye, Scale, Server, FileText, UserCheck, AlertTriangle } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="bg-page min-h-screen text-text">
      <SEO 
        title="Privacy Protocol & Data Policy | Transfer Legacy"
        description="Comprehensive Privacy Protocol and regulatory disclosures under GDPR, CCPA, and DPDP. Learn how our zero-knowledge encryption guarantees your data sovereignty."
      />

      <section className="pt-32 pb-16 px-6 lg:px-8 border-b border-base bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 border border-brand-primary/20">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold italic tracking-tighter mb-4 text-primary">PRIVACY PROTOCOL & DATA DISCLOSURE</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted uppercase tracking-wider">
            <span>Version: 2.1 (Statutory Aligned)</span>
            <span>•</span>
            <span>Effective Date: May 2026</span>
            <span>•</span>
            <span>Jurisdiction: Global / Multi-Regional</span>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-emerald-500 font-bold mb-2 flex items-center gap-2">
              <Lock size={16} /> Zero-Knowledge Guarantee
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Your sensitive legacy payloads (passwords, documents, seed phrases) are encrypted client-side using XChaCha20-Poly1305 and hybrid Post-Quantum ML-KEM. Our servers only ever store encrypted ciphertext. We cannot decrypt your vault.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5">
            <h4 className="text-brand-primary font-bold mb-2 flex items-center gap-2">
              <Eye size={16} /> Privacy-First Architecture
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              No cross-site tracking pixels, third-party marketing brokers, or advertising trackers. Telemetry is strictly limited to cryptographic protocol execution and system reliability.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-surface border border-base flex items-center justify-center text-xs font-bold text-brand-primary">1</span>
            Data Controller & Architectural Philosophy
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            Transfer Legacy operates as a self-sovereign digital estate transfer protocol. In traditional cloud architectures, privacy is a policy enforced by server administrators; in Transfer Legacy, privacy is enforced by <strong>mathematics and cryptography</strong>.
          </p>
          <p className="text-secondary text-sm leading-relaxed">
            For operational data processed outside the zero-knowledge envelope (such as account registration and protocol check-ins), Transfer Legacy acts as the <strong>Data Controller</strong> under EU GDPR (Regulation 2016/679), UK GDPR, the California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection (DPDP) Act 2023.
          </p>
          <p className="text-secondary text-sm leading-relaxed font-mono text-xs bg-surface/50 p-4 rounded-xl border border-base">
            Data Protection Contact: <strong className="text-primary">privacy@transferlegacy.com</strong><br />
            Security & Cryptographic Reports: <strong className="text-primary">security@transferlegacy.com</strong>
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-surface border border-base flex items-center justify-center text-xs font-bold text-brand-primary">2</span>
            Categories of Data We Process
          </h2>
          <div className="space-y-4 text-sm text-secondary">
            <div className="p-5 rounded-2xl border border-base bg-surface/30">
              <h3 className="font-bold text-primary text-base mb-2">A. Zero-Knowledge Encrypted Payload (No Server Access)</h3>
              <p className="leading-relaxed">
                Vault items, digital wills, private notes, seed phrases, credentials, and attachments. These are encrypted directly on your local device before transmission. The decryption keys (Master Key and Derived Export Keys) never touch our backend.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-base bg-surface/30">
              <h3 className="font-bold text-primary text-base mb-2">B. Account & Protocol Authentication Data</h3>
              <p className="leading-relaxed">
                Your email address (for Dead Man's Switch heartbeat notifications), encrypted legal name, device public keys (Ed25519), and OPAQUE protocol records. We do not store your master password or its plaintext hash.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-base bg-surface/30">
              <h3 className="font-bold text-primary text-base mb-2">C. Designated Heirs & Guardians (Third-Party Notice)</h3>
              <p className="leading-relaxed">
                Contact details (names, emails, phone numbers) of your designated custodians and beneficiaries. This data is collected solely to deliver protocol notifications, verify claims, and coordinate key shard distribution upon verified trigger events.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-base bg-surface/30">
              <h3 className="font-bold text-primary text-base mb-2">D. Cryptographic Audit Telemetry</h3>
              <p className="leading-relaxed">
                Append-only audit logs recording policy state transitions, heartbeat receipts, attestation submissions, and consent timestamps. IP addresses are hashed using SHA-256 for privacy protection.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-surface border border-base flex items-center justify-center text-xs font-bold text-brand-primary">3</span>
            Authorized Sub-Processors & Infrastructure
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            In compliance with GDPR Article 28, Transfer Legacy utilizes strict data-processing agreements with the following third-party infrastructure partners:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-secondary border border-base rounded-xl overflow-hidden">
              <thead className="bg-surface text-primary font-bold uppercase tracking-wider text-[10px] border-b border-base">
                <tr>
                  <th className="p-3">Partner / Sub-Processor</th>
                  <th className="p-3">Role / Purpose</th>
                  <th className="p-3">Data Location</th>
                  <th className="p-3">Security Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base bg-page">
                <tr>
                  <td className="p-3 font-bold text-primary">Supabase Inc.</td>
                  <td className="p-3">PostgreSQL Database & Authentication Infrastructure</td>
                  <td className="p-3">EU (Frankfurt) / US Multi-Region</td>
                  <td className="p-3">SOC 2 Type II, ISO 27001</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Backblaze Inc.</td>
                  <td className="p-3">Encrypted Vault Storage (B2 Object Storage)</td>
                  <td className="p-3">US / EU Redundant Locations</td>
                  <td className="p-3">SOC 2 Type II, 99.999999999% Durability</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Cloudflare Inc.</td>
                  <td className="p-3">Edge Network, TLS 1.3 Termination & DDoS Defense</td>
                  <td className="p-3">Global Anycast Network</td>
                  <td className="p-3">SOC 2 Type II, ISO 27001, PCI-DSS</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Resend Inc.</td>
                  <td className="p-3">Transactional Email & Dead Man's Switch Alerts</td>
                  <td className="p-3">US / Global</td>
                  <td className="p-3">SOC 2 Type II, TLS In-Transit</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">OneSignal Inc.</td>
                  <td className="p-3">In-App & Mobile Push Heartbeat Notifications</td>
                  <td className="p-3">US Multi-Region</td>
                  <td className="p-3">SOC 2 Type II, GDPR Compliant DPA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-surface border border-base flex items-center justify-center text-xs font-bold text-brand-primary">4</span>
            Your Statutory Rights (GDPR, CCPA & DPDP)
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            Regardless of your geographic location, Transfer Legacy extends global privacy rights to all users:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-base bg-surface/20">
              <h4 className="font-bold text-primary mb-1">Right to Erasure ("Be Forgotten" - Art. 17)</h4>
              <p className="text-muted leading-relaxed">
                Execute a permanent cryptographic purge at any time via your Settings or <code>POST /api/v1/gdpr/erase</code>. This zeroes out all vault records, OPAQUE auth blobs, keys, and links.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-base bg-surface/20">
              <h4 className="font-bold text-primary mb-1">Right of Access & Portability (Art. 15 & 20)</h4>
              <p className="text-muted leading-relaxed">
                Export all raw encrypted blobs, devices, policies, and attestations via <code>POST /api/v1/gdpr/export</code> in a standardized, machine-readable JSON format.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-base bg-surface/20">
              <h4 className="font-bold text-primary mb-1">Right to Restrict or Object</h4>
              <p className="text-muted leading-relaxed">
                You can pause heartbeat processing, disable notification channels, or withdraw designated heirs at any moment through your dashboard.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-base bg-surface/20">
              <h4 className="font-bold text-primary mb-1">Right to Lodge a Complaint</h4>
              <p className="text-muted leading-relaxed">
                You hold the legal right to submit inquiries to your local supervisory authority (e.g., the EU Data Protection Authorities, UK ICO, or Data Protection Board of India).
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-surface border border-base flex items-center justify-center text-xs font-bold text-brand-primary">5</span>
            Cookies & Local Storage Policy
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            In compliance with the EU ePrivacy Directive (Directive 2002/58/EC), Transfer Legacy uses <strong>only strictly essential local storage and session mechanisms</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs text-secondary">
            <li><strong>Session Authentication (<code>tl_session_token</code>):</strong> Essential token allowing your browser to authenticate requests to the API.</li>
            <li><strong>Cryptographic User Identifier (<code>tl_user_id</code>):</strong> Essential identifier needed to route zero-knowledge requests.</li>
            <li><strong>Temporary Encryption State:</strong> Ephemeral cryptographic keys retained in browser memory strictly while your session is active, automatically zeroized upon logout or inactivity lock.</li>
            <li><strong>No Tracking Cookies:</strong> We do not deploy third-party advertising cookies, fingerprinting scripts, or cross-site tracking pixels.</li>
          </ul>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-8 rounded-2xl border border-base bg-surface/40 not-prose flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
            <Scale size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-1">Formal Legal Notice & Counsel Inquiries</h4>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Transfer Legacy provides non-custodial cryptographic software. We are not a bank, trust company, or legal firm. For subpoena responses, statutory law enforcement guidelines, or enterprise Data Processing Agreements (DPAs), direct legal inquiries to our legal team.
            </p>
            <p className="text-xs font-mono text-brand-primary font-bold">
              Legal Operations: legal@transferlegacy.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
