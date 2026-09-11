import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

const sections = [
  { title: '1. Information We Collect', body: 'When you register we collect: full name, email, phone number, physical address, password (bcrypt-hashed, never plain text), photos uploaded with reports, and IP/browser info for security purposes.' },
  { title: '2. How We Use Your Information', body: 'To provide our platform services, verify identity, prevent fraud, display contact info to logged-in users only, send post notifications (if enabled), and comply with legal obligations.' },
  { title: '3. Data Security', body: 'Passwords hashed with bcrypt (12 salt rounds). JWT tokens in httpOnly secure cookies. HTTPS on all connections. Rate limiting and account lockout after multiple failed logins.' },
  { title: '4. Information Visibility', body: 'Your contact details are only visible to authenticated users. Document numbers and ID details should never be posted publicly. We actively remove violating content.' },
  { title: '5. Your Rights', body: 'You have the right to access, correct, export and delete your personal data at any time. Use the Profile settings or email privacy@lostandfound.com.' },
  { title: '6. Cookies', body: 'We use httpOnly cookies for authentication sessions (7-day expiry). No tracking or advertising cookies are used.' },
  { title: '7. Contact', body: 'For privacy enquiries contact: privacy@lostandfound.com' },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <Shield size={20} className="text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Privacy Policy</h1>
            <p className="text-slate-500 text-sm">Last updated: January 2026</p>
          </div>
        </div>
        <div className="space-y-4">
          {sections.map(s => (
            <div key={s.title} className="glass-card-dark rounded-2xl p-6">
              <h2 className="font-bold text-white mb-2">{s.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-sm text-slate-600">
          By using this platform you agree to this policy.{' '}
          <Link to="/terms" className="text-primary-400 hover:text-primary-300">View Terms of Service</Link>
        </p>
      </div>
    </div>
  )
}
