import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider({ slides, intervalMs = 5200 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const slideCount = slides.length

  useEffect(() => {
    if (paused || slideCount === 0) return undefined

    timerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, intervalMs)

    return () => window.clearTimeout(timerRef.current)
  }, [activeIndex, paused, intervalMs, slideCount])

  const goTo = (index) => {
    setActiveIndex((index + slideCount) % slideCount)
  }

  const prevSlide = () => goTo(activeIndex - 1)
  const nextSlide = () => goTo(activeIndex + 1)

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id || `${index}`}
            className={`hero-slider-slide ${index === activeIndex ? 'hero-slider-slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={index !== activeIndex}
          >
            <div className="hero-slide-filter" />
          </div>
        ))}
      </div>

      <div className="hero-slider-controls">
        <button type="button" className="hero-slider-arrow hero-slider-arrow--prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="hero-slider-arrow hero-slider-arrow--next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="hero-slider-dots" aria-label="Slider navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-slider-dot ${index === activeIndex ? 'hero-slider-dot--active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
