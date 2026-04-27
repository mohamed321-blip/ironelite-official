import React from 'react';
import { Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, isRtl, lang } = useI18n();
  
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts({
    query: { queryKey: getGetFeaturedProductsQueryKey() }
  });
  
  const { data: categories, isLoading: loadingCategories } = useGetCategories({
    query: { queryKey: getGetCategoriesQueryKey() }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="/images/hero.png" 
          alt="Iron Elite Gym" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="container relative z-20 px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white uppercase tracking-wider mb-4 drop-shadow-2xl">
              {t('heroTitle')}
            </h1>
            <p className="text-white/80 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-medium">
              {t('heroSubtitle')}
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 text-lg font-display uppercase tracking-widest group">
                {t('shopNow')}
                <ArrowRight className={`ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <div className="w-[1px] h-12 bg-primary/50" />
          <ChevronRight className="w-5 h-5 text-primary rotate-90" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-2">
                {t('featuredProducts')}
              </h2>
              <div className="w-24 h-1 bg-primary" />
            </div>
            <Link href="/products">
              <Button variant="outline" className="rounded-none uppercase tracking-widest font-bold">
                {t('viewAll')}
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts?.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-4">
              {t('shopCategory')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          {loadingCategories ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((category, i) => {
                const bgImage = 
                  category.name === 'Strength' ? '/images/barbell.png' :
                  category.name === 'Conditioning' ? '/images/bands.png' :
                  '/images/gloves.png';
                  
                const catName = lang === 'ar' ? category.nameAr : lang === 'fr' ? category.nameFr : category.name;

                return (
                  <Link key={category.name} href={`/products?category=${category.name}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative h-80 bg-card overflow-hidden border border-border flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      <img 
                        src={bgImage} 
                        alt={catName} 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity dark:mix-blend-normal opacity-80 group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="relative z-20 text-center p-6 w-full mt-auto mb-6">
                        <h3 className="font-display text-3xl text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                          {catName}
                        </h3>
                        <p className="text-white/70 text-sm tracking-widest uppercase">
                          {category.count} {t('items')}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <img src="/favicon.svg" alt="Logo" className="w-16 h-16 mx-auto mb-8 invert dark:invert-0 opacity-80" />
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-6">
            Built For The Elite
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We don't build equipment for the masses. We forge tools for the dedicated few who treat their training as a discipline. Every piece of Iron Elite equipment is designed, tested, and proven in the most grueling environments.
          </p>
        </div>
      </section>
    </div>
  );
}
