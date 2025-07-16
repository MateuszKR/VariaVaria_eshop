'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div className="bg-white shadow-soft">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <Image
                  src="/varia-varia-logo.jpg"
                  alt="VariaVaria Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="container-max section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">{t('about.ourStory.title')}</h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                {t('about.ourStory.paragraph1')}
              </p>
              <p>
                {t('about.ourStory.paragraph2')}
              </p>
              <p>
                {t('about.ourStory.paragraph3')}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl p-8 text-center">
            <div className="text-8xl mb-4">🍀</div>
            <blockquote className="text-lg italic text-neutral-700">
              "{t('about.ourStory.quote')}"
            </blockquote>
            <p className="text-neutral-600 mt-4">{t('about.ourStory.team')}</p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white">
        <div className="container-max section-padding py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t('about.values.title')}</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.values.quality.title')}</h3>
              <p className="text-neutral-600">
                {t('about.values.quality.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.values.authenticity.title')}</h3>
              <p className="text-neutral-600">
                {t('about.values.authenticity.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.values.sustainability.title')}</h3>
              <p className="text-neutral-600">
                {t('about.values.sustainability.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.values.meaning.title')}</h3>
              <p className="text-neutral-600">
                {t('about.values.meaning.description')}
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
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">{t('about.craftsmanship.excellence.title')}</h3>
            <p className="text-neutral-600">
              {t('about.craftsmanship.excellence.description')}
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">{t('about.craftsmanship.title')}</h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                {t('about.craftsmanship.paragraph1')}
              </p>
              <p>
                {t('about.craftsmanship.paragraph2')}
              </p>
              <p>
                {t('about.craftsmanship.paragraph3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="container-max section-padding py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.statistics.title')}</h2>
            <p className="text-xl opacity-90">
              {t('about.statistics.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">{t('about.statistics.customers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">{t('about.statistics.designs')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">{t('about.statistics.years')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-lg opacity-90">{t('about.statistics.craftspeople')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Symbolism */}
      <section className="container-max section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t('about.symbolism.title')}</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            {t('about.symbolism.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.symbolism.faith.title')}</h3>
            <p className="text-neutral-600">
              {t('about.symbolism.faith.description')}
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🌅</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.symbolism.hope.title')}</h3>
            <p className="text-neutral-600">
              {t('about.symbolism.hope.description')}
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">💕</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.symbolism.love.title')}</h3>
            <p className="text-neutral-600">
              {t('about.symbolism.love.description')}
            </p>
          </div>
          <div className="text-center card p-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('about.symbolism.luck.title')}</h3>
            <p className="text-neutral-600">
              {t('about.symbolism.luck.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                {t('about.cta.shopCollection')}
              </Link>
              <Link href="/categories" className="btn-secondary">
                {t('about.cta.browseCategories')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 