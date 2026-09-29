'use client'

import React, { useEffect, useRef } from 'react'

export function Spotlight({
  className = '',
  fill = 'rgba(99, 102, 241, 0.15)',
}: {
  className?: string
  fill?: string
}) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = divRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--mouse-x', `${x}px`)
      el.style.setProperty('--mouse-y', `${y}px`)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={divRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ${className}`}
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), ${fill}, transparent 80%)`,
      }}
    />
  )
}
