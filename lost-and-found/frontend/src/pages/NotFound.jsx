import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen section-darker flex items-center justify-center">
      <div className="orb w-96 h-96 bg-primary-700/20 top-0 right-0" />
      <div className="text-center px-4 relative">
        <div className="text-9xl mb-6 animate-float">🔍</div>
        <h1 className="text-5xl font-black text-white mb-3">
          <span className="gradient-text">404</span>
        </h1>
        <p className="text-xl font-bold text-slate-400 mb-2">Page Not Found</p>
        <p className="text-slate-600 mb-10 max-w-sm mx-auto">
          Looks like this page got lost too. Let's help you find your way back.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/"     className="btn-primary px-8 py-3 rounded-xl">Go Home</Link>
          <Link to="/lost" className="btn-secondary px-8 py-3 rounded-xl">Browse Lost Items</Link>
        </div>
      </div>
    </div>
  )
}
