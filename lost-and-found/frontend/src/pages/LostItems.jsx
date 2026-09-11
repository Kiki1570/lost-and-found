import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ItemCard from '../components/ItemCard'
import SearchFilter from '../components/SearchFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function LostItems() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal]   = useState(0)
  const [page, setPage]     = useState(1)
  const [pages, setPages]   = useState(1)
  const [filters, setFilters] = useState({})
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    const q   = searchParams.get('search')
    if (cat || q) setFilters(f => ({ ...f, ...(cat && { category: cat }), ...(q && { search: q }) }))
  }, [searchParams])

  useEffect(() => { fetchItems() }, [page, filters])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12, ...filters })
      const res = await api.get(`/lost?${params}`)
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setPages(res.data.pages || 1)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen section-darker pt-24">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Reports</p>
            <h1 className="text-3xl font-black text-white">
              Lost <span className="gradient-text-rose">Items</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{total} active reports</p>
          </div>
          <Link to="/post-lost"
            className="self-start flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm
                       bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400
                       text-white shadow-glow-rose transition-all">
            <Plus size={16} /> Report Lost Item
          </Link>
        </div>

        <SearchFilter onSearch={f => { setFilters(f); setPage(1) }} type="lost" />

        {loading ? <LoadingSpinner /> : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map(item => <ItemCard key={item._id} item={item} type="lost" />)}
            </div>
            <Pagination page={page} pages={pages} setPage={setPage} />
          </>
        ) : (
          <div className="text-center py-24 glass-card rounded-3xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">No lost items found</h3>
            <p className="text-slate-600 mb-6 text-sm">Try different filters or be the first to post</p>
            <Link to="/post-lost"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                         bg-gradient-to-r from-rose-600 to-rose-500 text-white">
              <Plus size={16} /> Post Lost Item
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white
                   hover:bg-white/10 disabled:opacity-30 transition-all">
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => setPage(p)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
            p === page
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
          }`}>
          {p}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white
                   hover:bg-white/10 disabled:opacity-30 transition-all">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
