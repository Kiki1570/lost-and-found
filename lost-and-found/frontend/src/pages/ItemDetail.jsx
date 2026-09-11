import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  MapPin, Calendar, Phone, Mail, Eye, Tag, AlertTriangle,
  CheckCircle2, ArrowLeft, Flag, Award, Shield
} from 'lucide-react'
import { formatDate, getCategoryLabel, getCategoryIcon, getImageUrl } from '../utils/helpers'

const DEMO_IMAGES = {
  passport:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
  national_id:'https://images.unsplash.com/photo-1607827447604-d9a8c439186e?w=600&q=80',
  wallet:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
  phone:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  keys:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  bag:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  jewelry:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  electronics:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  car_licence:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  pet:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  other:'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=600&q=80',
}

export default function ItemDetail({ type }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isLost = type === 'lost'

  const [item,        setItem]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [activeImg,   setActiveImg]   = useState(0)
  const [reportModal, setReportModal] = useState(false)
  const [reportReason,setReportReason]= useState('')
  const [reporting,   setReporting]   = useState(false)

  useEffect(() => { fetchItem() }, [id, type])

  const fetchItem = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/${type}/${id}`)
      setItem(res.data.item)
    } catch {
      toast.error('Item not found')
      navigate(`/${type}`)
    } finally { setLoading(false) }
  }

  const handleMarkFound = async () => {
    try {
      await api.patch(`/lost/${id}/found`)
      toast.success('Marked as found!')
      fetchItem()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleClaim = async () => {
    try {
      await api.patch(`/found/${id}/claim`)
      toast.success('Claim submitted! The finder will contact you.')
      fetchItem()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleReport = async () => {
    if (!reportReason) { toast.error('Select a reason'); return }
    setReporting(true)
    try {
      await api.post('/reports', { itemType: type, itemId: id, reason: reportReason })
      toast.success('Report submitted. Thank you.')
      setReportModal(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setReporting(false) }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!item)   return null

  const location = isLost ? item.locationLost : item.locationFound
  const date     = isLost ? item.dateLost     : item.dateFound
  const isOwner  = user && item.user?._id === user.id

  const mainImg = (item.images?.length > 0)
    ? getImageUrl(item.images[activeImg]?.url)
    : DEMO_IMAGES[item.category] || DEMO_IMAGES.other

  const statusMap = {
    active:    'bg-primary-500/20 text-primary-300 border-primary-500/30',
    available: 'bg-teal-500/20   text-teal-300   border-teal-500/30',
    found:     'bg-teal-500/20   text-teal-300   border-teal-500/30',
    claimed:   'bg-amber-500/20  text-amber-300  border-amber-500/30',
    returned:  'bg-slate-500/20  text-slate-400  border-slate-600/30',
    closed:    'bg-slate-700/40  text-slate-500  border-slate-600/30',
  }

  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-5xl">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-sm font-medium transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to {isLost ? 'Lost' : 'Found'} Items
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left – Images */}
          <div>
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-slate-900 mb-3 shadow-float">
              <img src={mainImg} alt={item.title}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = DEMO_IMAGES.other }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              {/* badges */}
              <div className="absolute top-4 left-4">
                <span className={`${isLost ? 'badge-lost' : 'badge-found'} backdrop-blur-sm text-sm px-3 py-1`}>
                  {isLost ? '🔍 Lost Item' : '✅ Found Item'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${statusMap[item.status] || statusMap.active}`}>
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {item.images?.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {item.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-primary-500 shadow-glow' : 'border-white/10 hover:border-white/30'
                    }`}>
                    <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.src = DEMO_IMAGES.other }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right – Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-white mb-2">{item.title}</h1>
              <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
            </div>

            {/* Meta grid */}
            <div className="glass-card-dark rounded-2xl p-5 space-y-3">
              {[
                [Tag,      'Category', getCategoryLabel(item.category)],
                [Calendar, isLost ? 'Date Lost' : 'Date Found', formatDate(date)],
                [MapPin,   isLost ? 'Location Lost' : 'Location Found', `${location?.address || ''}${location?.city ? ', ' + location.city : ''}${location?.country ? ', ' + location.country : ''}`],
                ...(item.color  ? [[Tag, 'Colour', item.color]]  : []),
                ...(item.brand  ? [[Tag, 'Brand',  item.brand]]  : []),
                ...(item.identifierNumber ? [[Tag, 'ID / Serial #', item.identifierNumber]] : []),
              ].map(([Icon, label, value], i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-primary-400" />
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">{label}</span>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-white/8">
                <Eye size={11} /> {item.views || 0} views
              </div>
            </div>

            {/* Reward */}
            {isLost && item.reward?.offered && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <Award size={18} className="text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-300">Reward Offered</p>
                  <p className="text-amber-400/80 text-xs">{item.reward.currency} {item.reward.amount}</p>
                </div>
              </div>
            )}

            {/* Police report */}
            {isLost && item.reportedToPolice && (
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
                🚔 Reported to police{item.policeReportNumber ? ` — Report #${item.policeReportNumber}` : ''}
              </div>
            )}

            {/* Contact (only for logged-in users) */}
            {user ? (
              <div className="glass-card-dark rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-white text-sm">Contact Information</h3>
                {item.contactPhone && (
                  <a href={`tel:${item.contactPhone}`}
                    className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Phone size={14} className="text-primary-400" />
                    </div>
                    {item.contactPhone}
                  </a>
                )}
                {item.contactEmail && (
                  <a href={`mailto:${item.contactEmail}`}
                    className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Mail size={14} className="text-primary-400" />
                    </div>
                    {item.contactEmail}
                  </a>
                )}
                {!isLost && item.handoverLocation && (
                  <div className="flex items-start gap-2.5 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Pickup location</p>
                      <p className="text-white font-medium">{item.handoverLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-primary-500/8 border border-primary-500/20 text-sm text-primary-300 flex items-center gap-2">
                <Shield size={14} />
                <span><Link to="/login" className="font-bold underline">Log in</Link> to view contact details and interact.</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {isOwner && isLost && item.status === 'active' && (
                <button onClick={handleMarkFound}
                  className="btn-success flex-1 py-3 rounded-2xl">
                  <CheckCircle2 size={16} /> Mark as Found
                </button>
              )}
              {!isOwner && !isLost && item.status === 'available' && user && (
                <button onClick={handleClaim}
                  className="btn-primary flex-1 py-3 rounded-2xl">
                  <CheckCircle2 size={16} /> This Is Mine
                </button>
              )}
              {user && !isOwner && (
                <button onClick={() => setReportModal(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold
                             bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all">
                  <Flag size={14} /> Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 animate-slide-up shadow-float">
            <h3 className="font-black text-lg text-white mb-1 flex items-center gap-2">
              <Flag size={16} className="text-rose-400" /> Report this Post
            </h3>
            <p className="text-slate-500 text-sm mb-5">Help us keep the community safe</p>
            <label className="label">Reason *</label>
            <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="input-field-light mb-5">
              <option value="">Select a reason…</option>
              <option value="fake_listing">Fake listing</option>
              <option value="inappropriate_content">Inappropriate content</option>
              <option value="spam">Spam</option>
              <option value="fraud_attempt">Fraud attempt</option>
              <option value="privacy_violation">Privacy violation</option>
              <option value="duplicate">Duplicate post</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setReportModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 border border-white/10 font-semibold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={handleReport} disabled={reporting}
                className="flex-1 btn-danger py-3 rounded-xl">
                {reporting ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
