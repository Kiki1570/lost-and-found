import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM dd, yyyy')
}

export const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const CATEGORIES = [
  { value: 'passport', label: 'Passport', icon: '🛂' },
  { value: 'national_id', label: 'National ID', icon: '🪪' },
  { value: 'car_licence', label: 'Car Licence', icon: '🚗' },
  { value: 'drivers_licence', label: "Driver's Licence", icon: '🚘' },
  { value: 'wallet', label: 'Wallet', icon: '👛' },
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'keys', label: 'Keys', icon: '🔑' },
  { value: 'bag', label: 'Bag / Backpack', icon: '🎒' },
  { value: 'jewelry', label: 'Jewelry', icon: '💍' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'pet', label: 'Pet', icon: '🐾' },
  { value: 'vehicle', label: 'Vehicle', icon: '🚙' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export const getCategoryLabel = (value) => {
  const cat = CATEGORIES.find(c => c.value === value)
  return cat ? `${cat.icon} ${cat.label}` : value
}

export const getCategoryIcon = (value) => {
  const cat = CATEGORIES.find(c => c.value === value)
  return cat ? cat.icon : '📦'
}

export const DEMO_IMAGES = {
  passport:        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80',
  national_id:     'https://images.unsplash.com/photo-1607827447604-d9a8c439186e?w=400&q=80',
  car_licence:     'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  drivers_licence: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  wallet:          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
  phone:           'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  keys:            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  bag:             'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  jewelry:         'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  electronics:     'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  documents:       'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
  clothing:        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
  pet:             'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  vehicle:         'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80',
  other:           'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80',
}

export const truncate = (str, n = 100) => {
  if (!str) return ''
  return str.length > n ? str.substring(0, n) + '...' : str
}

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.jpg'
  if (url.startsWith('http')) return url
  return url
}
