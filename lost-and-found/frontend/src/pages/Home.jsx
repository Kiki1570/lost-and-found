import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, ArrowRight, AlertTriangle, CheckCircle2,
  Search, MapPin, Zap, Users, TrendingUp, Star
} from 'lucide-react'
import api from '../utils/api'
import ItemCard from '../components/ItemCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { CATEGORIES } from '../utils/helpers'

const HERO_STATS = [
  { icon: TrendingUp, label: 'Items Reported',  color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { icon: CheckCircle2, label: 'Items Returned', color: 'text-teal-400',    bg: 'bg-teal-500/10'   },
  { icon: Users,      label: 'Members',          color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { icon: Star,       label: 'Success Rate',     color: 'text-amber-400',   bg: 'bg-amber-500/10'  },
]

// attractive hero background images (Unsplash)
const HERO_BG = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=80'

export default function Home() {
  const [recentLost,  setRecentLost]  = useState([])
  const [recentFound, setRecentFound] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats,   setStats]   = useState({ lost: 0, found: 0, users: 248, rate: '78%' })
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const [l, f] = await Promise.all([api.get('/lost?limit=4'), api.get('/found?limit=4')])
        setRecentLost(l.data.items  || [])
        setRecentFound(f.data.items || [])
        setStats(s => ({ ...s, lost: l.data.total || 0, found: f.data.total || 0 }))
      } catch {}
      setLoading(false)
    })()
  }, [])

  const heroStatValues = [stats.lost + '+', stats.found + '+', stats.users + '+', stats.rate]

  return (
    <div className="animate-fade-in">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden section-darker">
        {/* BG image */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-primary-950/80" />
        </div>

        {/* Glow orbs */}
        <div className="orb w-[600px] h-[600px] bg-primary-700/25 -top-40 -right-40" style={{animationDelay:'0s'}} />
        <div className="orb w-[400px] h-[400px] bg-violet-700/20 bottom-0 left-0"     style={{animationDelay:'3s'}} />
        <div className="orb w-[300px] h-[300px] bg-teal-700/15   top-1/2 right-1/3"   style={{animationDelay:'1.5s'}} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-3xl">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-primary-500/15 border border-primary-500/30 text-primary-300
                            text-sm font-medium mb-8 animate-slide-in backdrop-blur-sm">
              <Shield size={13} />
              Secure & Trusted Community Platform
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6 animate-slide-up">
              <span className="text-white">Lost</span>
              <br />
              <span className="gradient-text">Something?</span>
              <br />
              <span className="text-white text-4xl md:text-5xl font-bold">We'll Help You</span>{' '}
              <span className="gradient-text-rose text-4xl md:text-5xl font-bold">Find It.</span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed animate-slide-up" style={{animationDelay:'0.1s'}}>
              Report lost passports, wallets, phones, IDs and more. Announce what you've found.
              Connect with your community to reunite people with their belongings.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-slide-up" style={{animationDelay:'0.2s'}}>
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search lost or found items…"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && searchQ.trim()) window.location.href = `/lost?search=${searchQ}` }}
                  className="w-full pl-11 pr-4 py-4 bg-white/8 hover:bg-white/12 focus:bg-white/12
                             border border-white/10 hover:border-white/20 focus:border-primary-500
                             rounded-2xl text-white placeholder-slate-500 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all backdrop-blur-sm"
                />
              </div>
              <Link to={searchQ ? `/lost?search=${searchQ}` : '/lost'}
                className="btn-primary px-8 py-4 rounded-2xl text-sm whitespace-nowrap">
                <Search size={16} /> Search
              </Link>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{animationDelay:'0.3s'}}>
              <Link to="/post-lost"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm
                           bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400
                           text-white shadow-glow-rose hover:shadow-float transition-all duration-200">
                <AlertTriangle size={17} /> Report Lost Item
              </Link>
              <Link to="/post-found"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm
                           bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400
                           text-white shadow-glow-teal hover:shadow-float transition-all duration-200">
                <CheckCircle2 size={17} /> Announce Found Item
              </Link>
              <Link to="/register" className="btn-secondary px-7 py-3.5 rounded-2xl text-sm font-bold">
                Join Free
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-white/3 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {HERO_STATS.map((s, i) => (
                <div key={s.label} className="flex items-center justify-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon size={17} className={s.color} />
                  </div>
                  <div className="text-left">
                    <div className={`text-xl font-black ${s.color}`}>{heroStatValues[i]}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY QUICK BROWSE ─────────────────────────────────── */}
      <section className="section-dark py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-5">Browse by category</p>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <Link key={cat.value} to={`/lost?category=${cat.value}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl min-w-[88px]
                           bg-white/3 hover:bg-primary-500/15 border border-white/8 hover:border-primary-500/40
                           transition-all duration-200 group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-primary-300 transition-colors text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT LOST ITEMS ─────────────────────────────────────── */}
      <section className="section-darker py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Community Reports</p>
              <h2 className="section-title">Recent <span className="gradient-text-rose">Lost Items</span></h2>
              <p className="text-slate-500 mt-1.5 text-sm">Help reunite these belongings with their owners</p>
            </div>
            <Link to="/lost"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-400
                         hover:text-primary-300 transition-colors group">
              View all
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? <LoadingSpinner /> : recentLost.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentLost.map(item => <ItemCard key={item._id} item={item} type="lost" />)}
            </div>
          ) : (
            <EmptyState type="lost" />
          )}

          <div className="mt-7 text-center sm:hidden">
            <Link to="/lost" className="btn-outline text-sm px-6 py-2.5">View all lost items →</Link>
          </div>
        </div>
      </section>

      {/* ── RECENT FOUND ITEMS ────────────────────────────────────── */}
      <section className="section-mid py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Found & Waiting</p>
              <h2 className="section-title">Recently <span className="text-teal-400">Found Items</span></h2>
              <p className="text-slate-500 mt-1.5 text-sm">These items are waiting to go home</p>
            </div>
            <Link to="/found"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-teal-400
                         hover:text-teal-300 transition-colors group">
              View all
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? <LoadingSpinner /> : recentFound.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentFound.map(item => <ItemCard key={item._id} item={item} type="found" />)}
            </div>
          ) : (
            <EmptyState type="found" />
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="section-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="section-title mb-3">How It <span className="gradient-text">Works</span></h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Three easy steps to report or recover your belongings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01', icon: '🔐', title: 'Create Account',
                desc: 'Sign up securely. Accept our Privacy Policy and Terms. Your data is encrypted and never sold.',
                color: 'from-primary-600/20 to-violet-600/20', border: 'border-primary-500/20', accent: 'text-primary-400',
              },
              {
                step: '02', icon: '📸', title: 'Post Your Report',
                desc: 'Upload photos, add description, location and contact. Lost or found — we handle both.',
                color: 'from-rose-600/20 to-amber-600/20', border: 'border-rose-500/20', accent: 'text-rose-400',
              },
              {
                step: '03', icon: '🤝', title: 'Get Connected',
                desc: 'Community members contact you directly. Items are returned safely every single day.',
                color: 'from-teal-600/20 to-emerald-600/20', border: 'border-teal-500/20', accent: 'text-teal-400',
              },
            ].map(item => (
              <div key={item.step}
                className={`relative p-7 rounded-3xl bg-gradient-to-br ${item.color} border ${item.border}
                            backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group`}>
                <div className="absolute top-5 right-6 text-5xl font-black text-white/5 select-none">{item.step}</div>
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                <div className={`mt-5 text-xs font-bold ${item.accent} uppercase tracking-wider`}>Step {item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ASSETS SECTION ───────────────────────────────── */}
      <section className="section-mid py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">We Handle All Types</p>
            <h2 className="section-title mb-3">Valuable <span className="gradient-text">Documents & Assets</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&q=80', label: 'Passport' },
              { img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80', label: 'Wallet' },
              { img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80', label: 'Phone' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', label: 'Keys' },
              { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80', label: 'Bag' },
              { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=80', label: 'Car Licence' },
            ].map(a => (
              <div key={a.label} className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer">
                <img src={a.img} alt={a.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <p className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-white">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="section-darker py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Success Stories</p>
            <h2 className="section-title">People <span className="gradient-text">Reunited</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Sarah M.', city: 'New York', text: 'Found my passport 3 days before my flight! Someone posted it here within hours of losing it. Forever grateful.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', stars: 5 },
              { name: 'James K.', city: 'London',   text: 'Lost my wallet with all my cards. Posted here and a kind stranger had already submitted a found report. Amazing community.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', stars: 5 },
              { name: 'Aisha T.', city: 'Dubai',    text: 'My dog went missing for 2 days. Posted with a photo and location — someone saw the post and called me immediately!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', stars: 5 },
            ].map(t => (
              <div key={t.name} className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)'}}>
        <div className="orb w-[500px] h-[500px] bg-primary-500/20 -top-40 -right-20" />
        <div className="orb w-[300px] h-[300px] bg-violet-500/15 bottom-0 left-10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-6">
            <Zap size={13} className="text-amber-400" /> Join 200+ members helping their community
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Start Helping<br />
            <span className="gradient-text">Your Community Today</span>
          </h2>
          <p className="text-primary-200 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Post a lost item, announce what you've found, or simply browse — it's free, secure and takes only a minute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl font-bold text-base
                         bg-white text-primary-700 hover:bg-primary-50 shadow-float transition-all">
              Get Started Free →
            </Link>
            <Link to="/lost"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl font-bold text-base
                         bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
              Browse Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function EmptyState({ type }) {
  const isLost = type === 'lost'
  return (
    <div className="text-center py-16 glass-card rounded-3xl">
      <div className="text-6xl mb-4">{isLost ? '🔍' : '✅'}</div>
      <h3 className="text-lg font-bold text-slate-400 mb-2">No {isLost ? 'lost' : 'found'} items yet</h3>
      <p className="text-slate-600 mb-6 text-sm">Be the first to {isLost ? 'report a lost item' : 'announce a found item'}</p>
      <Link to={isLost ? '/post-lost' : '/post-found'}
        className={isLost ? 'btn-danger text-sm' : 'btn-success text-sm'}>
        + Post Now
      </Link>
    </div>
  )
}
