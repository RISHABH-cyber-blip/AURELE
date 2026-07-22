import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}

export default function Pagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null

  function pageHref(page: number) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-ink-faint">…</span>}
          <Link
            href={pageHref(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-calm ${
              p === currentPage ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-soft'
            }`}
          >
            {p}
          </Link>
        </span>
      ))}
    </div>
  )
}