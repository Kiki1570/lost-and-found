import { Link } from 'react-router-dom'
import { Shield, Users, CheckCircle2, Heart, Globe, Scale, Zap } from 'lucide-react'

const ABOUT_IMG = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80'

export default function About() {
  return (
    <div className="animate-fade-in section-darker min-h-screen">

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-primary-700/20 top-0 right-0" />
        <div className="orb w-[300px] h-[300px] bg-teal-700/15 bottom-0 left-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-4">Our Story</p>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                About <span className="gradient-text">Lost & Found</span>
              </h1>
              <p className="text-slate-400 leading-relaxed mb-4">
                Every year millions of people lose important documents, valuables and personal belongings.
                The existing systems for recovering them are fragmented, slow and unreliable.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Lost & Found bridges this gap with a trusted digital space where anyone can post what
                they've lost, announce what they've found, and connect directly — all within a secure,
                privacy-first platform.
              </p>
              <div className="flex gap-3">
                <Link to="/register" className="btn-primary px-7 py-3 rounded-xl">Join Free</Link>
                <Link to="/lost" className="btn-secondary px-7 py-3 rounded-xl">Browse Reports</Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/20 to-violet-500/20 rounded-3xl blur-xl" />
              <img src={ABOUT_IMG} alt="Community" className="relative rounded-3xl w-full object-cover aspect-video shadow-float border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 section-mid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-black text-white">Our <span className="gradient-text">Values</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: Shield,      title: 'Privacy First',     desc: 'All user data is encrypted. Contact info is shown only to logged-in users.',    color: 'from-primary-600/20', border: 'border-primary-500/20', icon: 'text-primary-400' },
              { Icon: Users,       title: 'Community Driven',  desc: 'Thousands of members helping each other recover lost belongings every day.',     color: 'from-teal-600/20',    border: 'border-teal-500/20',    icon: 'text-teal-400'    },
              { Icon: CheckCircle2,title: 'Content Moderated', desc: 'Every post is reviewable. Users can report suspicious listings instantly.',       color: 'from-violet-600/20',  border: 'border-violet-500/20',  icon: 'text-violet-400'  },
              { Icon: Heart,       title: 'Free Always',       desc: 'No charges for posting or claiming. Good deeds should never cost money.',        color: 'from-rose-600/20',    border: 'border-rose-500/20',    icon: 'text-rose-400'    },
            ].map(({ Icon, title, desc, color, border, icon }) => (
              <div key={title} className={`p-6 rounded-2xl bg-gradient-to-br ${color} to-transparent border ${border} hover:scale-[1.02] transition-transform`}>
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                  <Icon size={20} className={icon} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-16 section-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Scale size={36} className="mx-auto text-primary-400 mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">Legal <span className="gradient-text">Compliance</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Designed to comply with found-property laws, privacy rights and data protection regulations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: 'Found Property Laws',   body: 'Users are reminded of their legal obligation to return found property. Keeping found property without reporting it may constitute theft under local law.' },
              { title: 'Privacy Protection',    body: 'We never display sensitive information (passport numbers, ID details) publicly. Contact details are only visible to authenticated users.' },
              { title: 'Data Protection (GDPR)',body: 'All user data is encrypted at rest and in transit. You can request full data deletion at any time through your profile settings.' },
              { title: 'Reporting & Moderation',body: 'Every post can be reported. Our moderation team reviews reports within 24 hours. Violators face immediate account suspension.' },
            ].map(item => (
              <div key={item.title} className="glass-card-dark rounded-2xl p-5">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0" /> {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 section-mid">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Zap size={32} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to get started?</h2>
          <p className="text-slate-500 mb-8">Join our community and help reunite people with their belongings.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3.5 rounded-2xl">Create Free Account</Link>
            <Link to="/lost"     className="btn-secondary px-8 py-3.5 rounded-2xl">Browse Lost Items</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
