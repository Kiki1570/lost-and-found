import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Upload, X, CheckCircle2, Shield } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'

export default function PostFound() {
  const navigate = useNavigate()
  const [loading,  setLoading]  = useState(false)
  const [images,   setImages]   = useState([])
  const [previews, setPreviews] = useState([])

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const handedToAuthorities = watch('handedToAuthorities')

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
      const res = await api.post('/found', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Found item announced!')
      navigate(`/found/${res.data.item._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen section-darker pt-24 pb-12">
      <div className="page-container max-w-3xl">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Announce a Found Item</h1>
            <p className="text-slate-500 text-sm">Thank you for helping! Accurate details let the owner claim it.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Item Info */}
          <FormSection title="📦 Item Information">
            <div>
              <label className="label">Item Title *</label>
              <input type="text" placeholder="e.g., Found Passport near Central Station"
                className={`input-field-light ${errors.title ? 'border-rose-500' : ''}`}
                {...register('title', { required: 'Title required' })} />
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
              <textarea rows={4} placeholder="Describe colour, size, condition, any visible markings…"
                className={`input-field-light resize-none ${errors.description ? 'border-rose-500' : ''}`}
                {...register('description', { required: 'Description required', minLength: { value: 20, message: 'Min 20 chars' } })} />
              {errors.description && <Err msg={errors.description.message} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Colour</label>
                <input type="text" placeholder="e.g., Brown" className="input-field-light" {...register('color')} />
              </div>
              <div>
                <label className="label">Brand / Make</label>
                <input type="text" placeholder="e.g., Apple" className="input-field-light" {...register('brand')} />
              </div>
              <div>
                <label className="label">Visible ID / Serial #</label>
                <input type="text" placeholder="If visible" className="input-field-light" {...register('identifierNumber')} />
              </div>
            </div>
          </FormSection>

          {/* Photos */}
          <FormSection title="📸 Photos of the Found Item (up to 5)">
            <p className="text-xs text-amber-400/80 flex items-center gap-1.5">
              ⚠️ Do NOT photograph full passport/ID data pages — only the cover or item exterior.
            </p>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center">
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-white/15 rounded-xl flex flex-col items-center
                                  justify-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group">
                  <Upload size={18} className="text-slate-600 group-hover:text-teal-400 mb-1 transition-colors" />
                  <span className="text-[10px] text-slate-600 group-hover:text-teal-400">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </FormSection>

          {/* Location */}
          <FormSection title="📍 Where & When Found">
            <div>
              <label className="label">Location Found *</label>
              <input type="text" placeholder="e.g., Bus stop on 5th Avenue"
                className={`input-field-light ${errors.locationAddress ? 'border-rose-500' : ''}`}
                {...register('locationAddress', { required: 'Location required' })} />
              {errors.locationAddress && <Err msg={errors.locationAddress.message} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City *</label>
                <input type="text" className={`input-field-light ${errors.locationCity ? 'border-rose-500' : ''}`}
                  {...register('locationCity', { required: 'City required' })} />
                {errors.locationCity && <Err msg={errors.locationCity.message} />}
              </div>
              <div>
                <label className="label">Country *</label>
                <input type="text" className={`input-field-light ${errors.locationCountry ? 'border-rose-500' : ''}`}
                  {...register('locationCountry', { required: 'Country required' })} />
                {errors.locationCountry && <Err msg={errors.locationCountry.message} />}
              </div>
            </div>
            <div>
              <label className="label">Date Found *</label>
              <input type="date" className={`input-field-light ${errors.dateFound ? 'border-rose-500' : ''}`}
                {...register('dateFound', { required: 'Date required' })} />
              {errors.dateFound && <Err msg={errors.dateFound.message} />}
            </div>
            <div>
              <label className="label">Handover / Pickup Location *</label>
              <input type="text" placeholder="Where can the owner collect it? e.g., Police station, my address"
                className={`input-field-light ${errors.handoverLocation ? 'border-rose-500' : ''}`}
                {...register('handoverLocation', { required: 'Pickup location required' })} />
              {errors.handoverLocation && <Err msg={errors.handoverLocation.message} />}
            </div>
          </FormSection>

          {/* Finder address */}
          <FormSection title="🏠 Your Address">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your City *</label>
                <input type="text" className={`input-field-light ${errors.finderCity ? 'border-rose-500' : ''}`}
                  {...register('finderCity', { required: 'City required' })} />
                {errors.finderCity && <Err msg={errors.finderCity.message} />}
              </div>
              <div>
                <label className="label">Your Country *</label>
                <input type="text" className={`input-field-light ${errors.finderCountry ? 'border-rose-500' : ''}`}
                  {...register('finderCountry', { required: 'Country required' })} />
                {errors.finderCountry && <Err msg={errors.finderCountry.message} />}
              </div>
            </div>
          </FormSection>

          {/* Contact */}
          <FormSection title="📞 Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your Phone *</label>
                <input type="tel" placeholder="+1 234 567 8900"
                  className={`input-field-light ${errors.contactPhone ? 'border-rose-500' : ''}`}
                  {...register('contactPhone', { required: 'Phone required' })} />
                {errors.contactPhone && <Err msg={errors.contactPhone.message} />}
              </div>
              <div>
                <label className="label">Your Email (optional)</label>
                <input type="email" className="input-field-light" {...register('contactEmail')} />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-teal-500" {...register('handedToAuthorities')} />
              <span className="text-sm text-slate-400">I have handed this to authorities (police, lost property office)</span>
            </label>

            {handedToAuthorities && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                <div>
                  <label className="label">Authority Name</label>
                  <input type="text" placeholder="e.g., City Police Dept." className="input-field-light" {...register('authorityName')} />
                </div>
                <div>
                  <label className="label">Authority Contact</label>
                  <input type="text" placeholder="Phone or address" className="input-field-light" {...register('authorityContact')} />
                </div>
              </div>
            )}
          </FormSection>

          {/* Legal */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-teal-500/8 border border-teal-500/20 text-sm text-teal-300">
            <Shield size={16} className="flex-shrink-0 mt-0.5" />
            You are legally obliged to make reasonable efforts to return found property.
            Never post photos that expose full ID numbers or passport data pages.
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2
                       bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400
                       text-white shadow-glow-teal transition-all disabled:opacity-50">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting…</>
              : <><CheckCircle2 size={18} /> Announce Found Item</>
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
