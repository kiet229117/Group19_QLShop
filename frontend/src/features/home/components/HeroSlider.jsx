import { useState, useEffect, useRef } from 'react'

const slides = [
  {
    id: 1,
    image: '/assets/images/main-slider/5.jpg',
    title: 'Women',
    subtitle: 'Experience the best in sportswear with our latest collection.',
    btnColor: 'bg-primary text-white border-transparent hover:border-white',
  },
  {
    id: 2,
    image: '/assets/images/main-slider/2.png',
    title: 'Men',
    subtitle: "Discover the latest trends in Men's sportswear and casual fashion.",
    btnColor: 'bg-white text-black border-transparent hover:border-white hover:text-white',
  },
  {
    id: 3,
    image: '/assets/images/main-slider/4.jpg',
    title: 'Accessories',
    subtitle: 'Elevate your style with our latest sportswear collection.',
    btnColor: 'bg-primary text-white border-transparent hover:border-white',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <section id="product-slider" className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-end lg:justify-center p-8 sm:p-12 md:p-16 lg:left-16 max-w-2xl text-white">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-base sm:text-lg md:text-2xl text-slate-200 mb-6 max-w-lg drop-shadow">
                {slide.subtitle}
              </p>
              <div>
                <a
                  href="#shop"
                  className={`${slide.btnColor} border font-semibold px-6 py-3 rounded-full inline-block transition-all duration-300 text-sm md:text-base hover:bg-transparent shadow-lg`}
                >
                  Shop now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-md"
        aria-label="Previous Slide"
      >
        <i className="fas fa-chevron-left text-sm"></i>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-md"
        aria-label="Next Slide"
      >
        <i className="fas fa-chevron-right text-sm"></i>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-primary' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

