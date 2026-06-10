'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Icons } from './icons'

function isoOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString() }
function startOf(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

export function DatePicker({
  value,
  onChange,
  onClose,
}: {
  value: string
  onChange: (iso: string) => void
  onClose: () => void
}) {
  const popRef = useRef<HTMLDivElement>(null)
  const todayD = startOf(new Date())
  const selected = value ? startOf(new Date(value)) : null

  const [cursor, setCursor] = useState(() => {
    const base = selected || todayD
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!popRef.current?.contains(e.target as Node)) onClose() }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [onClose])

  // Keep popover on screen
  useEffect(() => {
    const el = popRef.current
    if (!el) return
    el.style.left = ''
    el.style.right = ''
    const rect = el.getBoundingClientRect()
    if (rect.right > window.innerWidth - 8) { el.style.left = 'auto'; el.style.right = '0' }
    if (rect.left < 8) { el.style.left = '0'; el.style.right = 'auto' }
  }, [])

  const pick = (d: Date) => { onChange(isoOf(d)); onClose() }

  const monthLabel = cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const startIdx = (firstDay.getDay() + 6) % 7
  const gridStart = new Date(firstDay)
  gridStart.setDate(1 - startIdx)

  const cells = useMemo(() => {
    const arr: Date[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      arr.push(d)
    }
    return arr
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor.getFullYear(), cursor.getMonth()])

  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="dp-wrap">
      <div ref={popRef} className="dp-pop" role="dialog">
        <div className="dp-cal">
          <div className="dp-cal-head">
            <button className="dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
              <Icons.Back size={13} />
            </button>
            <span className="dp-month">{monthLabel}</span>
            <button className="dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
              <Icons.Arrow size={13} />
            </button>
          </div>
          <div className="dp-wd">{weekdays.map((w, i) => <span key={i}>{w}</span>)}</div>
          <div className="dp-grid">
            {cells.map((d, i) => {
              const muted = d.getMonth() !== cursor.getMonth()
              const isToday = sameDay(d, todayD)
              const isSel = selected ? sameDay(d, selected) : false
              const isPast = d < todayD
              return (
                <button
                  key={i}
                  className={`dp-day ${muted ? 'muted' : ''} ${isToday ? 'today' : ''} ${isSel ? 'sel' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
