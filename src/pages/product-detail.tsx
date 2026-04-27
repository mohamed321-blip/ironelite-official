export const getMeQueryKey = "getMe"; export const useGetMe = () => ({ data: null, isLoading: false });
import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import NotFound from './not-found';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:id');
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { t, lang, isRtl } = useI18n();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const { openCart } = useCartStore();
  const { openAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: user } = (() => ({ data: null, isLoading: false }))({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const { data: product, isLoading, isError } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) }
  });

  const addMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        openCart();
      }
    }
  });

  const handleAdd = () => {
    if (!user) {
      openAuth();
      return;
    }
    if (product) {
      addMutation.mutate({ data: { productId: product.id, quantity } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return <NotFound />;
  }

  const name = lang === 'ar' ? product.nameAr : lang === 'fr' ? product.nameFr : product.name;
  const description = lang === 'ar' ? product.descriptionAr : lang === 'fr' ? product.descriptionFr : product.description;

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-medium mb-10">
          <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary transition-colors">{t('shop')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Image Gallery (simplified) */}
          <div className="w-full md:w-1/2">
            <div className="bg-card border border-border p-12 relative aspect-square flex items-center justify-center overflow-hidden">
              {product.featured && (
                <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest px-4 py-2 z-10">
                  Featured
                </div>
              )}
              <img 
                src={product.imageUrl || '/images/dumbbells.png'} 
                alt={name}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 text-primary font-bold uppercase tracking-widest text-sm">
              {product.category}
            </div>
            <h1 className="font-display text-4xl lg:text-6xl uppercase tracking-wider mb-4 leading-tight">
              {name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-display font-bold text-primary">{formatPrice(product.price)}</span>
              <div className="w-1 h-8 bg-border"></div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}`} 
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">({product.reviewCount} {t('reviews')})</span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl">
              {description}
            </p>

            <div className="mt-auto space-y-6 border-t border-border pt-8">
              <div className="flex items-center gap-4">
                <div className="w-32 flex items-center justify-between border border-border h-14 bg-card">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button 
                  onClick={handleAdd}
                  disabled={!product.inStock || addMutation.isPending}
                  className="flex-1 rounded-none h-14 text-lg font-display uppercase tracking-widest relative overflow-hidden group"
                >
                  {addMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : product.inStock ? (
                    <>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <ShoppingCart className="w-5 h-5" />
                        {t('addToCart')}
                      </span>
                      <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </>
                  ) : (
                    t('outOfStock')
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="w-1 h-4 bg-border"></div>
                <div>Free shipping on orders over $150</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
