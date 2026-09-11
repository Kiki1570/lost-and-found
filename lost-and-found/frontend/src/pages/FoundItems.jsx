import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ItemCard from '../components/ItemCard'
import SearchFilter from '../components/SearchFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

export default function FoundItems() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal]   = useState(0)
  const [page, setPage]     = useState(1)
  const [pages, setPages]   = useState(1)
  const [filters, setFilters] = useState({})
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setFilters(f => ({ ...f, category: cat }))
  }, [searchParams])

  useEffect(() => { fetchItems() }, [page, filters])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12, ...filters })
      const res = await api.get(`/found?${params}`)
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setPages(res.data.pages || 1)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen section-darker pt-24">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Found & Waiting</p>
            <h1 className="text-3xl font-black text-white">
              Found <span className="text-teal-400">Items</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{total} items waiting for their owners</p>
          </div>
          <Link to="/post-found"
            className="self-start flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm
                       bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400
                       text-white shadow-glow-teal transition-all">
            <Plus size={16} /> Announce Found Item
          </Link>
        </div>

        <SearchFilter onSearch={f => { setFilters(f); setPage(1) }} type="found" />

        {loading ? <LoadingSpinner /> : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map(item => <ItemCard key={item._id} item={item} type="found" />)}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      p === page ? 'bg-teal-600 text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                    }`}>{p}</button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 glass-card rounded-3xl">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">No found items yet</h3>
            <p className="text-slate-600 mb-6 text-sm">Found something? Help return it to its owner</p>
            <Link to="/post-found" className="btn-success text-sm inline-flex items-center gap-2">
              <Plus size={15} /> Post Found Item
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
