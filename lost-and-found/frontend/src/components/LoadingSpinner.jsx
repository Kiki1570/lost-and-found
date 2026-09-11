export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-[3px]', lg: 'w-14 h-14 border-4' }

  const spinner = (
    <div className={`${sizes[size]} border-primary-500/20 border-t-primary-500 rounded-full animate-spin`} />
  )

  if (fullPage) return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary-500/30 rounded-full animate-pulse" />
          {spinner}
        </div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-primary-500/20 rounded-full" />
        {spinner}
      </div>
    </div>
  )
}
