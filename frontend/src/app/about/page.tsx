'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div className="bg-white shadow-soft">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🍀</div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              About Four Leaf Clover
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Crafting luck, love, and timeless beauty through handmade jewelry 
              featuring the enchanting four-leaf clover symbol.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="container-max section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                Founded with a passion for bringing luck and beauty into everyday life, 
                Four Leaf Clover Jewelry began as a small artisan workshop dedicated to 
                creating unique, handcrafted pieces that celebrate the magic of the 
                legendary four-leaf clover.
              </p>
              <p>
                Each piece in our collection is meticulously crafted by skilled artisans 
                who understand that jewelry is more than just an accessory—it's a symbol 
                of hope, love, and the extraordinary moments that make life special.
              </p>
              <p>
                The four-leaf clover has been a symbol of good luck for centuries, with 
                each leaf representing faith, hope, love, and luck. We've woven this 
                timeless symbolism into every design, creating jewelry that not only 
                looks beautiful but also carries deep meaning.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl p-8 text-center">
            <div className="text-8xl mb-4">🍀</div>
            <blockquote className="text-lg italic text-neutral-700">
              "Every piece we create is infused with intention, crafted with care, 
              and designed to bring a touch of magic to your everyday life."
            </blockquote>
            <p className="text-neutral-600 mt-4">— The Four Leaf Clover Team</p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white">
        <div className="container-max section-padding py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Quality</h3>
              <p className="text-neutral-600">
                We use only the finest materials and traditional craftsmanship 
                techniques to ensure each piece is built to last.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Authenticity</h3>
              <p className="text-neutral-600">
                Every piece is genuinely handcrafted, making each item unique 
                and special to its owner.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Sustainability</h3>
              <p className="text-neutral-600">
                We're committed to ethical sourcing and environmentally 
                responsible practices in all aspects of our business.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Meaning</h3>
              <p className="text-neutral-600">
                Each design carries symbolism and intention, creating jewelry 
                that tells a story and holds personal significance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="container-max section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-accent-100 to-primary-100 rounded-xl p-8 text-center order-2 lg:order-1">
            <div className="text-8xl mb-4">⚒️</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Handcrafted Excellence</h3>
            <p className="text-neutral-600">
              Our master craftspeople spend years perfecting their techniques, 
              ensuring that every piece meets our exacting standards for beauty and durability.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">The Art of Craftsmanship</h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                Our jewelry is created using time-honored techniques passed down through 
                generations of skilled artisans. From the initial design sketch to the 
                final polish, every step is performed with meticulous attention to detail.
              </p>
              <p>
                We source our materials from trusted suppliers who share our commitment 
                to quality and ethical practices. Whether it's sterling silver, gold, 
                or precious gemstones, we ensure that every component meets our high standards.
              </p>
              <p>
                The four-leaf clover motif is carefully incorporated into each design, 
                whether subtly engraved, prominently featured, or artfully integrated 
                into the overall composition. This attention to symbolic detail is what 
                makes our jewelry truly special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="container-max section-padding py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey in Numbers</h2>
            <p className="text-xl opacity-90">
              A testament to our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Unique Designs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-lg opacity-90">Master Craftspeople</div>
            </div>
          </div>
        </div>
      </section>

      {/* Symbolism */}
      <section className="container-max section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">The Four-Leaf Clover Legend</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Understanding the deep symbolism behind our signature motif
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Faith</h3>
            <p className="text-neutral-600">
              The first leaf represents faith in oneself and in the journey ahead.
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🌅</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Hope</h3>
            <p className="text-neutral-600">
              The second leaf symbolizes hope for a bright and prosperous future.
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">💕</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Love</h3>
            <p className="text-neutral-600">
              The third leaf represents love in all its forms—romantic, familial, and self-love.
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Luck</h3>
            <p className="text-neutral-600">
              The fourth leaf brings good fortune and positive energy to the wearer.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              Ready to Find Your Lucky Piece?
            </h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Explore our collection and discover the perfect piece of jewelry 
              to bring luck, love, and beauty into your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                Shop Our Collection
              </Link>
              <Link href="/categories" className="btn-secondary">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 