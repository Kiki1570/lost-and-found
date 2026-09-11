import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/8 overflow-hidden">
      {/* Glow orb */}
      <div className="orb w-96 h-96 bg-primary-900/30 -bottom-40 left-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-sm">L&F</span>
                </div>
              </div>
              <span className="font-black text-lg text-white">Lost<span className="gradient-text">&</span>Found</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              A trusted community platform helping people reunite with their lost belongings — powered by technology and goodwill.
            </p>
            <div className="flex gap-2">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary-500/20 border border-white/8
                             hover:border-primary-500/30 flex items-center justify-center
                             text-slate-500 hover:text-primary-400 transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {[['/lost','Lost Items'],['/found','Found Items'],['/post-lost','Report Lost'],['/post-found','Announce Found'],['/about','About Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {[['/privacy','Privacy Policy'],['/terms','Terms of Service']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
              <p className="text-xs text-amber-400/80 leading-relaxed">
                All postings must comply with local laws regarding found property.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                [Mail,   'support@lostandfound.com'],
                [Phone,  '+1 (800) LOST-FOUND'],
                [MapPin, 'Available worldwide'],
              ].map(([Icon, text], i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-500">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-primary-400" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Lost & Found. All rights reserved.</p>
          <p>
            By using this platform you agree to our{' '}
            <Link to="/terms"   className="text-primary-500 hover:text-primary-400">Terms</Link>
            {' & '}
            <Link to="/privacy" className="text-primary-500 hover:text-primary-400">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  )
}
