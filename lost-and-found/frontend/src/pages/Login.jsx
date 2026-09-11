import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const from = location.state?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen section-darker flex items-center justify-center pt-16 px-4">
      {/* Orbs */}
      <div className="orb w-96 h-96 bg-primary-700/20 top-0 right-0 -translate-y-1/2" />
      <div className="orb w-72 h-72 bg-violet-700/15 bottom-0 left-0" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="glass-card-dark rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-400 to-violet-600 rounded-2xl mb-4 shadow-glow">
              <span className="text-white font-black text-lg">L&F</span>
            </div>
            <h1 className="text-2xl font-black text-white">Welcome back</h1>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" placeholder="you@example.com"
                className={`input-field-light ${errors.email ? 'border-rose-500' : ''}`}
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300">Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Your password"
                  className={`input-field-light pr-11 ${errors.password ? 'border-rose-500' : ''}`}
                  {...register('password', { required: 'Password is required' })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl mt-2 text-base">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight size={16} /></>
              }
            </button>
          </form>

          {/* Security note */}
          <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-primary-500/8 border border-primary-500/15 text-xs text-primary-400">
            <Shield size={13} className="flex-shrink-0" />
            Secured with JWT + httpOnly cookies and bcrypt encryption
          </div>

          <p className="text-center mt-5 text-sm text-slate-500">
            No account?{' '}
            <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
