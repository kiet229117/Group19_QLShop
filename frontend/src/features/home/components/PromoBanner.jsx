export default function PromoBanner() {
  return (
    <section id="banner" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div
          className="relative rounded-2xl overflow-hidden bg-cover bg-center py-20 px-6 sm:px-12 text-center text-white shadow-xl min-h-[360px] flex items-center justify-center"
          style={{ backgroundImage: `url('/assets/images/banner1.jpg')` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Welcome to Our Shop
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Khám phá các bộ sưu tập thời trang thời thượng nhất với mức giá và ưu đãi tốt nhất ngay hôm nay!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#shop"
                className="bg-primary hover:bg-transparent text-white hover:text-white border border-primary hover:border-white font-semibold px-6 py-2.5 rounded-full inline-block transition-all duration-300 text-sm shadow-md"
              >
                Shop Now
              </a>
              <a
                href="#new-arrivals"
                className="bg-white/10 backdrop-blur-sm hover:bg-primary text-white border border-white/60 hover:border-primary font-semibold px-6 py-2.5 rounded-full inline-block transition-all duration-300 text-sm shadow-md"
              >
                New Arrivals
              </a>
              <a
                href="#sale"
                className="bg-primary hover:bg-transparent text-white hover:text-white border border-primary hover:border-white font-semibold px-6 py-2.5 rounded-full inline-block transition-all duration-300 text-sm shadow-md"
              >
                Sale
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

