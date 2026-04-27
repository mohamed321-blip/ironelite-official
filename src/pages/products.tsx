const getMeQueryKey = "getMe"; const useGetMe = () => ({ data: null, isLoading: false });
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';

export default function Products() {
  const { t, lang } = useI18n();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') || '';
  
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Simple debounce for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading: loadingProducts } = useListProducts(
    { category: category || undefined, search: debouncedSearch || undefined },
    { query: { queryKey: getListProductsQueryKey({ category: category || undefined, search: debouncedSearch || undefined }) } }
  );

  const { data: categories } = useGetCategories({
    query: { queryKey: getGetCategoriesQueryKey() }
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-card border-b border-border py-12 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wider mb-4">
            {category || t('allProducts')}
          </h1>
          <div className="w-16 h-1 bg-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-display text-xl uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search
            </h3>
            <div className="relative">
              <Input 
                type="text" 
                placeholder={t('search')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-none border-border bg-card pr-10"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl uppercase tracking-widest mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              {t('categories')}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setCategory('')}
                className={`block w-full text-left px-3 py-2 text-sm uppercase tracking-widest transition-colors ${category === '' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {t('allCategories')}
              </button>
              {categories?.map((cat) => {
                const catName = lang === 'ar' ? cat.nameAr : lang === 'fr' ? cat.nameFr : cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`block w-full text-left px-3 py-2 text-sm uppercase tracking-widest transition-colors flex justify-between items-center ${category === cat.name ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    <span>{catName}</span>
                    <span className={`text-xs ${category === cat.name ? 'text-primary-foreground/80' : 'text-muted-foreground/50'}`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : !products?.length ? (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-card border border-border p-8">
              <p className="text-xl text-muted-foreground font-display uppercase tracking-widest mb-4">No products found</p>
              <Button onClick={() => { setCategory(''); setSearch(''); }} variant="outline" className="rounded-none uppercase tracking-widest">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground font-medium">
                Showing {products.length} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
