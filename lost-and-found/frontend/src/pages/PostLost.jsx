import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Upload, X, AlertTriangle, Shield } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'

export default function PostLost() {
  const navigate = useNavigate()
  const [loading,  setLoading]  = useState(false)
  const [images,   setImages]   = useState([])
  const [previews, setPreviews] = useState([])

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const rewardOffered = watch('rewardOffered')

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) { toast.error('Max 5 images'); return }
    setImages(p => [...p, ...files])
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (idx) => {
    setImages(p => p.filter((_, i) => i !== idx))
    setPreviews(p => p.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v) })
      images.forEach(img => fd.append('images', img))
      const res = await api.post('/lost', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Lost item report posted!')
      navigate(`/lost/${res.data.item._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-3xl">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Report a Lost Item</h1>
            <p className="text-slate-500 text-sm">Fill in as many details as possible to help identify your item</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Item Info */}
          <FormSection title="📦 Item Information">
            <div>
              <label className="label">Item Title *</label>
              <input type="text" placeholder="e.g., Blue Passport – John Doe"
                className={`input-field-light ${errors.title ? 'border-rose-500' : ''}`}
                {...register('title', { required: 'Title required', maxLength: { value: 150, message: 'Max 150 chars' } })} />
              {errors.title && <Err msg={errors.title.message} />}
            </div>
            <div>
              <label className="label">Category *</label>
              <select className={`input-field-light ${errors.category ? 'border-rose-500' : ''}`}
                {...register('category', { required: 'Category required' })}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
              {errors.category && <Err msg={errors.category.message} />}
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea rows={4} placeholder="Describe colour, size, unique marks, contents…"
                className={`input-field-light resize-none ${errors.description ? 'border-rose-500' : ''}`}
                {...register('description', { required: 'Description required', minLength: { value: 20, message: 'Min 20 chars' } })} />
              {errors.description && <Err msg={errors.description.message} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Colour</label>
                <input type="text" placeholder="e.g., Black" className="input-field-light" {...register('color')} />
              </div>
              <div>
                <label className="label">Brand / Make</label>
                <input type="text" placeholder="e.g., Samsung" className="input-field-light" {...register('brand')} />
              </div>
              <div>
                <label className="label">ID / Serial #</label>
                <input type="text" placeholder="Passport no. etc." className="input-field-light" {...register('identifierNumber')} />
              </div>
            </div>
          </FormSection>

          {/* Photos */}
          <FormSection title="📸 Photos (up to 5)">
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center shadow">
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-white/15 rounded-xl flex flex-col items-center
                                  justify-center cursor-pointer hover:border-primary-500/60 hover:bg-primary-500/5 transition-all group">
                  <Upload size={18} className="text-slate-600 group-hover:text-primary-400 mb-1 transition-colors" />
                  <span className="text-[10px] text-slate-600 group-hover:text-primary-400">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </FormSection>

          {/* Location & Date */}
          <FormSection title="📍 Where & When Lost">
            <div>
              <label className="label">Location Address *</label>
              <input type="text" placeholder="e.g., Central Park, near the fountain"
                className={`input-field-light ${errors.locationAddress ? 'border-rose-500' : ''}`}
                {...register('locationAddress', { required: 'Location required' })} />
              {errors.locationAddress && <Err msg={errors.locationAddress.message} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City *</label>
                <input type="text" placeholder="City" className={`input-field-light ${errors.locationCity ? 'border-rose-500' : ''}`}
                  {...register('locationCity', { required: 'City required' })} />
                {errors.locationCity && <Err msg={errors.locationCity.message} />}
              </div>
              <div>
                <label className="label">Country *</label>
                <input type="text" placeholder="Country" className={`input-field-light ${errors.locationCountry ? 'border-rose-500' : ''}`}
                  {...register('locationCountry', { required: 'Country required' })} />
                {errors.locationCountry && <Err msg={errors.locationCountry.message} />}
              </div>
            </div>
            <div>
              <label className="label">Date Lost *</label>
              <input type="date" className={`input-field-light ${errors.dateLost ? 'border-rose-500' : ''}`}
                {...register('dateLost', { required: 'Date required' })} />
              {errors.dateLost && <Err msg={errors.dateLost.message} />}
            </div>
          </FormSection>

          {/* Owner address */}
          <FormSection title="🏠 Your Address">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your City *</label>
                <input type="text" className={`input-field-light ${errors.ownerCity ? 'border-rose-500' : ''}`}
                  {...register('ownerCity', { required: 'City required' })} />
                {errors.ownerCity && <Err msg={errors.ownerCity.message} />}
              </div>
              <div>
                <label className="label">Your Country *</label>
                <input type="text" className={`input-field-light ${errors.ownerCountry ? 'border-rose-500' : ''}`}
                  {...register('ownerCountry', { required: 'Country required' })} />
                {errors.ownerCountry && <Err msg={errors.ownerCountry.message} />}
              </div>
            </div>
          </FormSection>

          {/* Contact & extras */}
          <FormSection title="📞 Contact & Additional Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Phone *</label>
                <input type="tel" placeholder="+1 234 567 8900"
                  className={`input-field-light ${errors.contactPhone ? 'border-rose-500' : ''}`}
                  {...register('contactPhone', { required: 'Phone required' })} />
                {errors.contactPhone && <Err msg={errors.contactPhone.message} />}
              </div>
              <div>
                <label className="label">Contact Email</label>
                <input type="email" placeholder="Optional" className="input-field-light" {...register('contactEmail')} />
              </div>
            </div>

            {/* Reward toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" {...register('rewardOffered')} />
                <div className={`w-10 h-6 rounded-full transition-colors ${rewardOffered ? 'bg-amber-500' : 'bg-slate-700'}`} />
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${rewardOffered ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">Offering a reward for return</span>
            </label>

            {rewardOffered && (
              <div className="grid grid-cols-2 gap-3 animate-slide-up">
                <div>
                  <label className="label">Reward Amount</label>
                  <input type="number" placeholder="50" className="input-field-light" {...register('rewardAmount')} />
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select className="input-field-light" {...register('rewardCurrency')}>
                    {['USD','EUR','GBP','CAD','AUD','Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Police report toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary-500" {...register('reportedToPolice')} />
              <span className="text-sm text-slate-400">I have reported this to the police</span>
            </label>

            <div>
              <label className="label">Additional Details</label>
              <textarea rows={2} placeholder="Any other info that may help…"
                className="input-field-light resize-none" {...register('additionalDetails')} />
            </div>
          </FormSection>

          {/* Legal notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-sm text-amber-300">
            <Shield size={16} className="flex-shrink-0 mt-0.5" />
            By posting you confirm all information is accurate and complies with local laws.
            Contact details are only visible to logged-in users.
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2
                       bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400
                       text-white shadow-glow-rose transition-all disabled:opacity-50">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting…</>
              : <><AlertTriangle size={18} /> Post Lost Item Report</>
            }
          </button>
        </form>
      </div>
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div className="glass-card-dark rounded-2xl p-6 space-y-4">
      <h2 className="font-bold text-white text-base border-b border-white/8 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Err({ msg }) {
  return <p className="text-rose-400 text-xs mt-1">{msg}</p>
}
