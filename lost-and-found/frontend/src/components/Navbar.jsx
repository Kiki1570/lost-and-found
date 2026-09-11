import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Plus, Search } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false); setDropdownOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLink = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-200 py-1 ${
      isActive
        ? 'text-primary-400'
        : 'text-slate-400 hover:text-white'
    }`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-black text-base tracking-tight">L&F</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-lg text-white tracking-tight">Lost</span>
              <span className="font-black text-lg gradient-text">&</span>
              <span className="font-black text-lg text-white tracking-tight">Found</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[['/', 'Home'], ['/lost', 'Lost Items'], ['/found', 'Found Items'], ['/about', 'About']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={navLink}>
                {({ isActive }) => (
                  <span className="px-3 py-1.5 rounded-lg hover:bg-white/5 block transition-colors">
                    {label}
                    {isActive && <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-primary-400 rounded-full" />}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/post-lost"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
                             bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20
                             hover:border-rose-400/40 transition-all duration-200">
                  <Plus size={15} /> Lost
                </Link>
                <Link to="/post-found"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
                             bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/20
                             hover:border-teal-400/40 transition-all duration-200">
                  <Plus size={15} /> Found
                </Link>
                {/* Avatar dropdown */}
                <div className="relative ml-1">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                               bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                               transition-all duration-200">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.avatar?.url
                        ? <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <span className="text-sm font-medium text-slate-300 max-w-[90px] truncate hidden lg:block">{user.name}</span>
                    <ChevronDown size={13} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl
                                    border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                                    overflow-hidden animate-slide-up">
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      {[
                        ['/dashboard', LayoutDashboard, 'Dashboard'],
                        ['/profile',   User,            'Profile'],
                      ].map(([to, Icon, label]) => (
                        <Link key={to} to={to}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300
                                     hover:bg-white/5 hover:text-white transition-colors">
                          <Icon size={15} className="text-slate-500" /> {label}
                        </Link>
                      ))}
                      <div className="border-t border-white/8 mt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                                     text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-xl text-slate-300
                             hover:text-white hover:bg-white/5 transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/8 animate-slide-up">
          <div className="px-4 pt-3 pb-2 space-y-1">
            {[['/', 'Home'], ['/lost', 'Lost Items'], ['/found', 'Found Items'], ['/about', 'About']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-500/15 text-primary-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}>
                {label}
              </NavLink>
            ))}
          </div>
          <div className="px-4 pb-4 pt-3 border-t border-white/8 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/post-lost" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/20">
                    <Plus size={14} /> Post Lost
                  </Link>
                  <Link to="/post-found" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/20">
                    <Plus size={14} /> Post Found
                  </Link>
                </div>
                <Link to="/dashboard" className="block px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-xl">Dashboard</Link>
                <Link to="/profile"   className="block px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-xl">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login"    className="text-center py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-slate-300 border border-white/10">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
