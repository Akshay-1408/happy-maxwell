'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GsapRevealProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-right' | 'stagger-cards'
  delay?: number
  duration?: number
  stagger?: number
  yOffset?: number
}

export function GsapReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  yOffset = 30,
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, x: 0 })
      return
    }

    const ctx = gsap.context(() => {
      if (animation === 'fade-up') {
        gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else if (animation === 'scale-up') {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration,
            delay,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else if (animation === 'slide-right') {
        gsap.fromTo(
          el,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else if (animation === 'stagger-cards') {
        const childrenList = el.children
        if (childrenList.length > 0) {
          gsap.fromTo(
            childrenList,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              delay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      } else {
        // default fade-in
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [animation, delay, duration, stagger, yOffset])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
