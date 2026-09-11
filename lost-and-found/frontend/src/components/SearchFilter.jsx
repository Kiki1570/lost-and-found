import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'

export default function SearchFilter({ onSearch, type = 'lost' }) {
  const [search,      setSearch]      = useState('')
  const [category,    setCategory]    = useState('')
  const [city,        setCity]        = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); onSearch({ search, category, city }) }
  const handleClear  = () => { setSearch(''); setCategory(''); setCity(''); onSearch({}) }
  const hasFilters   = search || category || city

  return (
    <div className="glass-card-dark p-4 mb-7 rounded-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${type} items by name, description…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field-light pl-10 text-sm"
            />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200
              ${showFilters
                ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/8'
              }`}>
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-400 ml-0.5" />}
          </button>
          <button type="submit"
            className="btn-primary text-sm px-5 py-3 rounded-xl">
            Search
          </button>
          {hasFilters && (
            <button type="button" onClick={handleClear}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400
                         hover:bg-rose-500/20 transition-all">
              <X size={16} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/8 animate-slide-up">
            <div>
              <label className="label text-xs">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="input-field-light text-sm">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">City</label>
              <input type="text" placeholder="Filter by city…" value={city}
                onChange={e => setCity(e.target.value)} className="input-field-light text-sm" />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
