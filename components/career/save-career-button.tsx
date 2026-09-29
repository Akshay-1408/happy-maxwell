'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, Check, Heart } from 'lucide-react'

interface SaveButtonProps {
  itemId: string
  itemType: 'career' | 'college'
  initialSaved?: boolean
}

export function SaveButton({ itemId, itemType, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      try {
        const endpoint = itemType === 'career' ? '/api/saved' : '/api/colleges/save'
        const res = await fetch(endpoint)
        if (res.ok) {
          const items = await res.json()
          if (Array.isArray(items)) {
            const isItemSaved = items.some((i: any) =>
              itemType === 'career' ? i.careerId === itemId : i.collegeId === itemId
            )
            setSaved(isItemSaved)
          }
        }
      } catch (e) {}
    }
    checkSaved()
  }, [itemId, itemType])

  const handleToggle = async () => {
    setLoading(true)
    const newStatus = !saved
    setSaved(newStatus)
    try {
      const endpoint = itemType === 'career' ? '/api/saved' : '/api/colleges/save'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [itemType === 'career' ? 'careerId' : 'collegeId']: itemId,
          action: newStatus ? 'save' : 'remove',
        }),
      })
      if (!res.ok) {
        setSaved(!newStatus) // revert on error
      }
    } catch (err) {
      setSaved(!newStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={saved ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs gap-1.5 font-semibold transition ${
        saved ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700 hover:text-blue-600 border-slate-300'
      }`}
    >
      <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
      {saved ? 'Saved in Dashboard' : 'Bookmark'}
    </Button>
  )
}
