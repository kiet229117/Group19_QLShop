const blogPosts = [
  {
    id: 1,
    category: 'Fashion Trends',
    title: 'Latest Shirt Trends for 2024',
    description:
      'Explore the hottest shirt trends of 2024. From bold prints to classic styles, stay ahead of the fashion curve with our expert insights.',
    image: '/assets/images/fashion-trends.jpg',
  },
  {
    id: 2,
    category: 'Styling Tips',
    title: 'How to Style Your Shirt for Any Occasion',
    description:
      'Learn how to style your shirt for different occasions, whether it is a casual day out or a formal event. Get tips from fashion experts.',
    image: '/assets/images/stylisng-tips.jpg',
  },
  {
    id: 3,
    category: 'Customer Stories',
    title: 'Real Stories from Our Happy Customers',
    description:
      'Read about the experiences of our customers. Discover how our shirts have made a difference in their lives and their personal style.',
    image: '/assets/images/customer-stories.jpg',
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 bg-gray-lighter">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-dark mb-3">
            Discover <span className="text-primary">Our</span> Blog
          </h2>
          <p className="text-gray-txt text-base md:text-lg">
            Stay updated with the latest trends, tips, and stories in the world of fashion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-line"
            >
              <div className="overflow-hidden rounded-xl mb-6 aspect-video bg-gray-100">
                <img
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  src={post.image}
                  alt={post.title}
                />
              </div>

              <span className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">
                {post.category}
              </span>

              <h3 className="mb-3 text-xl font-bold text-gray-dark hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </h3>

              <p className="flex-grow text-sm text-gray-txt leading-relaxed mb-6">
                {post.description}
              </p>

              <div>
                <a
                  href={`#blog-${post.id}`}
                  className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-6 rounded-full inline-block transition-all duration-200 text-sm"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

