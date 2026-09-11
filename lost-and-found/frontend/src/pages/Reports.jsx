import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { Flag, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { formatDate } from '../utils/helpers'

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'moderator') {
      api.get('/reports').then(r => setReports(r.data.reports || [])).catch(() => {}).finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [user])

  const updateReport = async (id, status) => {
    try {
      await api.patch(`/reports/${id}`, { status })
      setReports(p => p.map(r => r._id === id ? { ...r, status } : r))
    } catch {}
  }

  if (loading) return <LoadingSpinner />

  if (user?.role !== 'admin' && user?.role !== 'moderator') {
    return (
      <div className="min-h-screen section-darker pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert size={48} className="mx-auto text-slate-700 mb-4" />
          <h2 className="text-xl font-bold text-slate-500 mb-2">Access Restricted</h2>
          <p className="text-slate-600 text-sm">This page is for moderators and admins only.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen section-darker pt-24">
      <div className="page-container">
        <div className="mb-8">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Flag size={24} className="text-rose-400" /> Reports Management
          </h1>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl">
            <Flag size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">No reports to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(r => (
              <div key={r._id} className="glass-card-dark rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      r.status === 'pending'  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      r.status === 'resolved' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'   :
                      'bg-slate-700/40 text-slate-400 border-slate-600/30'
                    }`}>{r.status}</span>
                    <span className="text-xs text-slate-500">{r.itemType} item</span>
                    <span className="text-xs font-semibold text-rose-400">{r.reason?.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-sm text-slate-400">{r.description || 'No description.'}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    By {r.reporter?.name || 'Anonymous'} · {formatDate(r.createdAt)}
                  </p>
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => updateReport(r._id, 'resolved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/20 hover:bg-teal-500/25 transition-all">
                      <CheckCircle2 size={13} /> Resolve
                    </button>
                    <button onClick={() => updateReport(r._id, 'dismissed')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-700/40 text-slate-400 border border-slate-600/30 hover:bg-slate-700/60 transition-all">
                      <XCircle size={13} /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
