import { Link } from 'react-router-dom'
import { MapPin, Calendar, Eye, Award } from 'lucide-react'
import { formatDate, getCategoryLabel, getCategoryIcon, truncate, getImageUrl } from '../utils/helpers'

// Unsplash demo images per category
const DEMO_IMAGES = {
  passport:        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80',
  national_id:     'https://images.unsplash.com/photo-1607827447604-d9a8c439186e?w=400&q=80',
  car_licence:     'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  drivers_licence: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  wallet:          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
  phone:           'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  keys:            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  bag:             'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  jewelry:         'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  electronics:     'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  documents:       'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
  clothing:        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
  pet:             'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  vehicle:         'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80',
  other:           'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80',
}

export default function ItemCard({ item, type }) {
  const isLost   = type === 'lost'
  const location = isLost ? item.locationLost : item.locationFound
  const date     = isLost ? item.dateLost     : item.dateFound
  const imgSrc   = (item.images && item.images.length > 0)
    ? getImageUrl(item.images[0].url)
    : DEMO_IMAGES[item.category] || DEMO_IMAGES.other

  const statusLabel = {
    active:    { text: 'Active',    cls: 'bg-primary-500/20 text-primary-300 border-primary-500/30' },
    found:     { text: 'Found',     cls: 'bg-teal-500/20   text-teal-300   border-teal-500/30'    },
    available: { text: 'Available', cls: 'bg-teal-500/20   text-teal-300   border-teal-500/30'    },
    claimed:   { text: 'Claimed',   cls: 'bg-amber-500/20  text-amber-300  border-amber-500/30'   },
    returned:  { text: 'Returned',  cls: 'bg-slate-500/20  text-slate-300  border-slate-500/30'   },
    closed:    { text: 'Closed',    cls: 'bg-slate-700/40  text-slate-400  border-slate-600/30'   },
  }
  const st = statusLabel[item.status] || statusLabel.active

  return (
    <Link to={`/${type}/${item._id}`} className="item-card group block">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.currentTarget.src = DEMO_IMAGES.other }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`${isLost ? 'badge-lost' : 'badge-found'} backdrop-blur-sm`}>
            {isLost ? '🔍 Lost' : '✅ Found'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${st.cls}`}>
            {st.text}
          </span>
        </div>

        {/* Reward */}
        {isLost && item.reward?.offered && (
          <div className="absolute bottom-3 right-3 badge-reward backdrop-blur-sm">
            <Award size={11} /> Reward
          </div>
        )}

        {/* Category icon bottom-left */}
        <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm
                        flex items-center justify-center text-base border border-white/10">
          {getCategoryIcon(item.category)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white text-sm leading-snug mb-1.5 line-clamp-1
                       group-hover:text-primary-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {truncate(item.description, 80)}
        </p>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={11} className="text-primary-400 flex-shrink-0" />
            <span className="truncate">{location?.city || location?.address || 'Location N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={11} className="text-primary-400 flex-shrink-0" />
            <span>{formatDate(date)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Eye size={11} /> {item.views || 0}
          </div>
          <span className="text-xs font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
