"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function AnimatedBanner() {
  const [phrases, setPhrases] = useState(["Devotion, Puja & Community", "Celebrating Bengali Culture & Heritage", "Serving the community for over six decades"])
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [phrases.length])

  const phraseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-6 bg-kallol-100">
      <div className="container mx-auto text-center">
        <motion.div
          key={currentPhraseIndex}
          variants={phraseVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-xl md:text-2xl font-semibold text-kallol-700"
        >
          {phrases[currentPhraseIndex]}
        </motion.div>
      </div>
    </section>
  )
}
