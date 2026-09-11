import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'

const sections = [
  { title: '1. Acceptance', body: 'By creating an account you agree to these Terms. If you disagree, do not use the platform.' },
  { title: '2. Eligibility', body: 'You must be at least 18 years old. You agree to provide accurate information and not impersonate others.' },
  { title: '3. Found Property Laws', body: 'In most jurisdictions finders must make reasonable efforts to return lost property. Keeping found items without reporting may constitute theft or conversion. You acknowledge this obligation.' },
  { title: '4. Prohibited Activities', body: 'You may not post false information, use the platform for fraud, post full ID/passport details publicly, harass users, or attempt to bypass security measures.' },
  { title: '5. Post Content Rules', body: 'Posts must be genuine lost/found reports. Photos must not expose full ID data. Contact details shown only to authenticated users. We may remove any post violating these rules or applicable law.' },
  { title: '6. Liability', body: 'Lost & Found is a communication platform only. We do not verify all users or posts. We are not liable for disputes between users. Exercise caution when meeting in person.' },
  { title: '7. Termination', body: 'We may suspend or terminate accounts that violate these terms. You may delete your account at any time via Profile settings.' },
  { title: '8. Changes', body: 'We may update these terms periodically. Continued use after changes constitutes acceptance.' },
  { title: '9. Contact', body: 'Questions? Email: legal@lostandfound.com' },
]

export default function Terms() {
  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Scale size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Terms of Service</h1>
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
          <Link to="/privacy" className="text-primary-400 hover:text-primary-300">View Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
