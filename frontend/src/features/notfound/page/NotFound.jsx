export default function NotFound({ onGoHome }) {
  return (
    <section id="404-page" className="bg-white py-16 flex items-center justify-center min-h-[70vh]">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 items-center">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-txt text-base mb-6 leading-relaxed">
              Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không khả dụng.
            </p>
            <a
              href="/"
              onClick={(e) => {
                if (onGoHome) {
                  e.preventDefault()
                  onGoHome()
                }
              }}
              className="bg-primary hover:bg-transparent border border-primary text-white hover:text-primary font-semibold px-8 py-3 rounded-full inline-block transition-all duration-200 text-sm shadow-md"
            >
              Về trang chủ
            </a>
          </div>

          <div className="relative h-72 md:h-96 overflow-hidden rounded-2xl bg-gray-100 shadow-xl border border-gray-line">
            <img
              src="/assets/images/404.jpg"
              alt="404 Not Found"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

