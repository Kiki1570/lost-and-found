import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { User, Shield, Camera, Trash2, Save } from 'lucide-react'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(false)
  const [delConfirm, setDel]    = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '', phone: user?.phone || '',
      city: user?.address?.city || '', country: user?.address?.country || '',
      street: user?.address?.street || '',
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (data.avatar?.[0]) fd.append('avatar', data.avatar[0])
      const res = await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/users/me')
      await logout()
      toast.success('Account deleted')
      navigate('/')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-2xl">
        <div className="mb-8">
          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">My Account</p>
          <h1 className="text-3xl font-black text-white">Profile Settings</h1>
        </div>

        {/* Avatar banner */}
        <div className="glass-card-dark rounded-3xl p-6 mb-5">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center overflow-hidden shadow-glow">
                {user?.avatar?.url
                  ? <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-white font-black text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center border-2 border-slate-900">
                <Camera size={11} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input-field-light" {...register('name', { required: true })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" className="input-field-light" {...register('phone')} />
              </div>
              <div>
                <label className="label">City</label>
                <input type="text" className="input-field-light" {...register('city')} />
              </div>
              <div>
                <label className="label">Country</label>
                <input type="text" className="input-field-light" {...register('country')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Street Address</label>
                <input type="text" className="input-field-light" {...register('street')} />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><Camera size={13} /> Profile Photo</label>
              <input type="file" accept="image/*"
                className="block w-full text-sm text-slate-500
                           file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                           file:text-sm file:font-semibold file:bg-primary-500/20 file:text-primary-300
                           hover:file:bg-primary-500/30 cursor-pointer transition-all"
                {...register('avatar')} />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary py-3 rounded-xl flex items-center gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Save size={15} /> Save Changes</>
              }
            </button>
          </form>
        </div>

        {/* Security card */}
        <div className="glass-card-dark rounded-3xl p-6 mb-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={16} className="text-primary-400" /> Security
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your account is secured with bcrypt-hashed passwords, JWT tokens in httpOnly cookies,
            rate limiting on login attempts, and automatic account lock after 5 failed tries.
          </p>
        </div>

        {/* Danger zone */}
        <div className="rounded-3xl p-6 bg-rose-500/5 border border-rose-500/20">
          <h3 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
            <Trash2 size={16} /> Danger Zone
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Permanently delete your account and all associated posts. This cannot be undone.
          </p>
          {!delConfirm ? (
            <button onClick={() => setDel(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25 transition-all">
              Delete My Account
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleDelete} className="btn-danger text-sm py-2.5 px-5 rounded-xl">
                Yes, Delete Permanently
              </button>
              <button onClick={() => setDel(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
