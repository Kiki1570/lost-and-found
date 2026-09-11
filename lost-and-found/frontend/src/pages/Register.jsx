import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser({
        name: data.name, email: data.email, phone: data.phone,
        password: data.password, city: data.city, country: data.country,
        street: data.street, zipCode: data.zipCode,
        privacyPolicyAccepted: data.privacyPolicy,
        termsAccepted: data.terms,
      })
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      const errs = err.response?.data?.errors
      toast.error(errs?.[0]?.msg || err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen section-darker pt-16 pb-12 px-4">
      <div className="orb w-96 h-96 bg-primary-700/20 top-0 right-0" />
      <div className="orb w-64 h-64 bg-violet-700/15 bottom-20 left-0" />

      <div className="relative max-w-2xl mx-auto animate-slide-up">
        <div className="glass-card-dark rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-400 to-violet-600 rounded-2xl mb-4 shadow-glow">
              <span className="text-white font-black text-lg">L&F</span>
            </div>
            <h1 className="text-2xl font-black text-white">Create Account</h1>
            <p className="text-slate-500 mt-1 text-sm">Join the community helping reunite lost belongings</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Personal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" placeholder="John Doe" className={`input-field-light ${errors.name ? 'border-rose-500' : ''}`}
                  {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Min 2 chars' } })} />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Phone Number *</label>
                <input type="tel" placeholder="+1 234 567 8900" className={`input-field-light ${errors.phone ? 'border-rose-500' : ''}`}
                  {...register('phone', { required: 'Phone required' })} />
                {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input type="email" placeholder="you@example.com" className={`input-field-light ${errors.email ? 'border-rose-500' : ''}`}
                {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City *</label>
                <input type="text" placeholder="New York" className={`input-field-light ${errors.city ? 'border-rose-500' : ''}`}
                  {...register('city', { required: 'City required' })} />
                {errors.city && <p className="text-rose-400 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label">Country *</label>
                <input type="text" placeholder="United States" className={`input-field-light ${errors.country ? 'border-rose-500' : ''}`}
                  {...register('country', { required: 'Country required' })} />
                {errors.country && <p className="text-rose-400 text-xs mt-1">{errors.country.message}</p>}
              </div>
              <div>
                <label className="label">Street Address</label>
                <input type="text" placeholder="123 Main St" className="input-field-light" {...register('street')} />
              </div>
              <div>
                <label className="label">ZIP / Postal Code</label>
                <input type="text" placeholder="10001" className="input-field-light" {...register('zipCode')} />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
                    className={`input-field-light pr-11 ${errors.password ? 'border-rose-500' : ''}`}
                    {...register('password', {
                      required: 'Password required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Need upper, lower & number' }
                    })} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type={showPass ? 'text' : 'password'} placeholder="Repeat password"
                  className={`input-field-light ${errors.confirmPassword ? 'border-rose-500' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm',
                    validate: v => v === password || 'Passwords do not match'
                  })} />
                {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Legal */}
            <div className="p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20 space-y-3">
              <p className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Shield size={14} /> Legal Agreements Required
              </p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary-500"
                  {...register('privacyPolicy', { required: 'Accept Privacy Policy' })} />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <Link to="/privacy" target="_blank" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</Link>
                  {' '}and consent to data processing
                </span>
              </label>
              {errors.privacyPolicy && <p className="text-rose-400 text-xs">{errors.privacyPolicy.message}</p>}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary-500"
                  {...register('terms', { required: 'Accept Terms' })} />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-primary-400 hover:text-primary-300 underline">Terms of Service</Link>
                  {'. '}All posts must comply with local laws
                </span>
              </label>
              {errors.terms && <p className="text-rose-400 text-xs">{errors.terms.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-xl text-base">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : <><CheckCircle2 size={18} /> Create Account <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
