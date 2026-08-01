'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

interface AddressResult {
  displayName: string
  line1: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Props {
  onSelect: (result: AddressResult) => void
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AddressResult[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 3) {
      setResults([])
      setOpen(false)
      return
    }

    setSearching(true)
    // Debounced — waits until you pause typing for 400ms before searching,
    // so we don't fire a request on every keystroke (respects Nominatim's
    // 1 request/second usage policy, and just avoids wasteful requests).
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results)
      setOpen(true)
      setSearching(false)
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function handlePick(result: AddressResult) {
    onSelect(result)
    setQuery(result.displayName)
    setOpen(false)
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Location detection is not supported in this browser.')
      return
    }
    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`)
        const data = await res.json()
        setLocating(false)

        if (data.error) {
          setLocationError('Could not determine your address from this location.')
          return
        }

        handlePick(data)
      },
      () => {
        setLocating(false)
        setLocationError('Location access denied — you can still search manually below.')
      }
    )
  }

  return (
    <div className="relative">
      <div className="flex gap-2 mb-1">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search for your address — e.g. Najafgarh, Delhi"
            className="w-full bg-cream border border-cream-deep rounded-lg pl-4 pr-9 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
          {searching && (
            <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint animate-spin" />
          )}
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs border border-cream-deep text-ink-soft hover:border-gold hover:text-gold transition-calm flex-shrink-0 disabled:opacity-50"
        >
          <MapPin size={14} />
          {locating ? 'Locating…' : 'Use My Location'}
        </button>
      </div>

      {locationError && <p className="text-xs text-red-600 mb-2">{locationError}</p>}

      {open && results.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-cream border border-cream-deep rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePick(r)}
              className="w-full text-left px-4 py-2.5 text-sm text-ink-soft hover:bg-cream-soft transition-calm border-b border-cream-deep last:border-0"
            >
              {r.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}