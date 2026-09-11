import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, Trash2, CheckSquare, Eye, MapPin, Calendar } from 'lucide-react'
import { formatDate, getCategoryIcon } from '../utils/helpers'

export default function Dashboard() {
  const { user } = useAuth()
  const [lostItems,  setLostItems]  = useState([])
  const [foundItems, setFoundItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('lost')

  useEffect(() => { fetchMyItems() }, [])

  const fetchMyItems = async () => {
    setLoading(true)
    try {
      const [l, f] = await Promise.all([api.get('/lost/my-items'), api.get('/found/my-items')])
      setLostItems(l.data.items  || [])
      setFoundItems(f.data.items || [])
    } catch { toast.error('Failed to load your items') }
    setLoading(false)
  }

  const handleDelete = async (id, type) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/${type}/${id}`)
      toast.success('Post deleted')
      if (type === 'lost') setLostItems(p => p.filter(i => i._id !== id))
      else setFoundItems(p => p.filter(i => i._id !== id))
    } catch { toast.error('Failed to delete') }
  }

  const handleMarkFound = async (id) => {
    try {
      await api.patch(`/lost/${id}/found`)
      toast.success('Marked as found!')
      setLostItems(p => p.map(i => i._id === id ? { ...i, status: 'found' } : i))
    } catch { toast.error('Failed to update') }
  }

  const items = tab === 'lost' ? lostItems : foundItems

  const statCards = [
    { label: 'Lost Reports', value: lostItems.length,  icon: '🔍', gradient: 'from-rose-600/20 to-rose-900/20',     border: 'border-rose-500/20',    text: 'text-rose-300' },
    { label: 'Found Posts',  value: foundItems.length, icon: '✅', gradient: 'from-teal-600/20 to-teal-900/20',     border: 'border-teal-500/20',    text: 'text-teal-300' },
    { label: 'Active',       value: lostItems.filter(i => i.status === 'active').length, icon: '📢', gradient: 'from-primary-600/20 to-primary-900/20', border: 'border-primary-500/20', text: 'text-primary-300' },
    { label: 'Resolved',     value: lostItems.filter(i => i.status === 'found').length + foundItems.filter(i => i.status === 'returned').length, icon: '🎉', gradient: 'from-violet-600/20 to-violet-900/20', border: 'border-violet-500/20', text: 'text-violet-300' },
  ]

  return (
    <div className="min-h-screen section-darker pt-24">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">My Account</p>
            <h1 className="text-3xl font-black text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Link to="/post-lost"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold
                         bg-rose-500/15 text-rose-300 border border-rose-500/20 hover:bg-rose-500/25 transition-all">
              <Plus size={15} /> Post Lost
            </Link>
            <Link to="/post-found"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold
                         bg-teal-500/15 text-teal-300 border border-teal-500/20 hover:bg-teal-500/25 transition-all">
              <Plus size={15} /> Post Found
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border} overflow-hidden`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 w-fit mb-6 border border-white/8">
          {[['lost','🔍 Lost Items'], ['found','✅ Found Items']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                tab === val
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label} ({val === 'lost' ? lostItems.length : foundItems.length})
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl">
            <div className="text-5xl mb-4">{tab === 'lost' ? '🔍' : '✅'}</div>
            <h3 className="text-lg font-bold text-slate-400 mb-2">No {tab} posts yet</h3>
            <Link to={`/post-${tab}`} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
              <Plus size={15} /> Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl
                           bg-slate-900/80 border border-slate-800 hover:border-primary-500/30
                           transition-all duration-200">
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                  {item.images?.length > 0
                    ? <img src={item.images[0].url} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                    : getCategoryIcon(item.category)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                      item.status === 'active' || item.status === 'available'
                        ? 'bg-teal-500/15 text-teal-300 border-teal-500/20'
                        : 'bg-slate-700/40 text-slate-400 border-slate-600/20'
                    }`}>{item.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(tab === 'lost' ? item.dateLost : item.dateFound)}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{(tab === 'lost' ? item.locationLost : item.locationFound)?.city || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{item.views || 0}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link to={`/${tab}/${item._id}`}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 border border-white/8 transition-all" title="View">
                    <Eye size={15} />
                  </Link>
                  {tab === 'lost' && item.status === 'active' && (
                    <button onClick={() => handleMarkFound(item._id)}
                      className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 border border-white/8 transition-all" title="Mark as Found">
                      <CheckSquare size={15} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(item._id, tab)}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/8 transition-all" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
