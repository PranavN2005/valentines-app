"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowLeft, Sparkles, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const hearts = ["🖤", "💙", "🩵", "✨", "⭐", "💎", "🌙", "🔷", "🫧"]

interface FloatingHeart {
  id: number
  emoji: string
  left: number
  delay: number
  size: number
  duration: number
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

export default function ValentinePage() {
  const [currentView, setCurrentView] = useState<"question" | "yes" | "no">("question")
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const noButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const newHearts: FloatingHeart[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      emoji: hearts[Math.floor(Math.random() * hearts.length)],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 24 + 16,
      duration: Math.random() * 4 + 6,
    }))
    setFloatingHearts(newHearts)
  }, [mounted])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const triggerConfetti = useCallback(() => {
    if (typeof window === "undefined") return
    const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#1e40af", "#1d4ed8", "#93c5fd", "#0a0a1a"]
    const width = window.innerWidth
    const newConfetti: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * width,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }))
    setConfetti(newConfetti)
    setTimeout(() => setConfetti([]), 4000)
  }, [])

  const handleYes = () => {
    setCurrentView("yes")
    triggerConfetti()
    setTimeout(triggerConfetti, 500)
    setTimeout(triggerConfetti, 1000)
  }

  const handleNo = () => {
    setCurrentView("no")
  }

  const handleBack = () => {
    setCurrentView("question")
    setNoButtonPosition({ x: 0, y: 0 })
  }

  // Generate Google Calendar URL for Valentine's Day
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Valentine's Day")
    const details = encodeURIComponent("A very special entire day with the love of my life")
    const location = encodeURIComponent("") // Add location if you want
    // February 14, 2026 - all day event
    const startDate = "20260214"
    const endDate = "20260215"
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`
  }

  // Generate .ics file for download (works with Apple Calendar, Outlook, etc.)
  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Valentine's Invite//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260214
DTEND;VALUE=DATE:20260215
SUMMARY:Valentine's Day Date 💕
DESCRIPTION:Our special Valentine's Day together!
END:VEVENT
END:VCALENDAR`
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'valentines-date.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNoButtonMouseMove = useCallback((e: React.MouseEvent) => {
    if (!noButtonRef.current) return
    const button = noButtonRef.current
    const rect = button.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width / 2
    const buttonCenterY = rect.top + rect.height / 2
    const distanceX = e.clientX - buttonCenterX
    const distanceY = e.clientY - buttonCenterY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    
    // React when cursor is within 120px - much earlier detection
    if (distance < 120) {
      const moveX = distanceX > 0 ? -100 : 100
      const moveY = distanceY > 0 ? -60 : 60
      const maxX = 200
      const maxY = 150
      setNoButtonPosition(prev => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x + moveX)),
        y: Math.max(-maxY, Math.min(maxY, prev.y + moveY))
      }))
    }
  }, [])

  // Only allow click if cursor is exactly on center (within 3px)
  const handleNoClick = useCallback((e: React.MouseEvent) => {
    if (!noButtonRef.current) return
    const button = noButtonRef.current
    const rect = button.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width / 2
    const buttonCenterY = rect.top + rect.height / 2
    const distanceX = e.clientX - buttonCenterX
    const distanceY = e.clientY - buttonCenterY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    
    // Only register click if within 3px of exact center
    if (distance <= 3) {
      setCurrentView("no")
    }
  }, [])

  if (!mounted) {
    return <main className="relative min-h-screen overflow-hidden bg-black" />
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')", filter: "brightness(0.6)" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/70 via-black/40 to-black/60" />

      {/* Mouse glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-all duration-300"
        style={{
          background: isHovering
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.4), transparent 40%)`
            : "transparent",
        }}
      />

      {/* Floating Hearts */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            initial={{ y: "100vh", opacity: 0, rotate: 0 }}
            animate={{ y: "-100px", opacity: [0, 0.7, 0.7, 0], rotate: 360 }}
            transition={{ duration: heart.duration, delay: heart.delay, repeat: Infinity, ease: "linear" }}
            style={{ left: `${heart.left}%`, fontSize: heart.size }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="confetti-piece z-50"
            initial={{ x: piece.x, y: piece.y, rotate: piece.rotation, scale: piece.scale }}
            animate={{ y: "100vh", x: piece.x + (Math.random() - 0.5) * 200, rotate: piece.rotation + 720 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              position: "fixed",
              width: piece.scale * 15,
              height: piece.scale * 15,
              backgroundColor: piece.color,
              borderRadius: "50%",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {currentView === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.5, type: "spring" }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Card className="card-glow w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl border-valentine-blue/40 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                  {/* Title with Cat */}
                  <motion.div
                    className="mb-6 flex items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="font-[family-name:var(--font-poppins)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-valentine-glow whitespace-nowrap">
                      Que onda mamita
                    </h1>
                    <img src="/cat.png" alt="Cat with rose" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full object-cover flex-shrink-0" />
                  </motion.div>

                  {/* Message */}
                  <motion.p
                    className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    My dearest friend, if you don&apos;t mind... I&apos;d like to join you by your side... For it is plain, as anyone can see, <span className="font-semibold text-valentine-accent">We&apos;re simply meant to be</span> ✨
                  </motion.p>

                  {/* Divider */}
                  <motion.div
                    className="mb-6 flex items-center justify-center gap-4"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-valentine-blue to-transparent" />
                    <Sparkles className="h-5 w-5 text-valentine-accent" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-valentine-blue to-transparent" />
                  </motion.div>

                  {/* Question - Cinzel Font */}
                  <motion.h2
                    className="mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-valentine-glow"
                    style={{ fontFamily: '"Cinzel", serif', fontWeight: 700 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    Will You Be My Valentine?
                  </motion.h2>

                  {/* Buttons */}
                  <motion.div
                    className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button variant="glow" size="xl" className="group glow-effect w-full sm:w-auto" onClick={handleYes}>
                      <Heart className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />
                      Yes! 💙
                    </Button>
                    <motion.div
                      animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                      transition={{ type: "spring", stiffness: 80, damping: 25 }}
                      onMouseMove={handleNoButtonMouseMove}
                      className="relative"
                    >
                      <Button ref={noButtonRef} variant="valentineOutline" size="lg" className="w-full sm:w-auto" onClick={handleNo}>
                        No
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentView === "yes" && (
            <motion.div
              key="yes"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            >
              <Card className="card-glow w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl border-valentine-blue/40 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                  <motion.div
                    className="mb-6"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <img src="/smooth-emoji.png" alt="Smooth emoji with rose" className="h-32 w-32 mx-auto" />
                  </motion.div>
                  <motion.h2
                    className="mb-4 text-3xl text-valentine-glow"
                    style={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Good choice
                  </motion.h2>
                  <motion.p
                    className="mb-8 text-lg text-gray-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Let me woo you, admire you, make you feel like the most <span className="font-semibold text-valentine-accent">sublime creature</span> on earth. 💎
                  </motion.p>
                  {/* Calendar Button */}
                  <motion.div 
                    className="mb-6"
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      variant="glow" 
                      size="lg" 
                      onClick={() => window.open(getGoogleCalendarUrl(), '_blank')}
                      className="glow-effect"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Add to Google Calendar
                    </Button>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Button variant="valentineOutline" size="lg" onClick={handleBack} className="glow-effect">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentView === "no" && (
            <motion.div
              key="no"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="card-glow w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl border-valentine-blue/40 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                  <motion.div
                    className="mb-6 text-6xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    😒
                  </motion.div>
                  <motion.h2
                    className="mb-4 text-3xl text-valentine-glow"
                    style={{ fontFamily: '"Manufacturing Consent", system-ui' }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Didn&apos;t expect you to be this fast
                  </motion.h2>
                  <motion.p
                    className="mb-8 text-lg text-gray-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    😒
                  </motion.p>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Button variant="glow" size="lg" onClick={handleBack} className="glow-effect">
                      Pero tú eres el aire que respiro 🥺
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
