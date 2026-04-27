export const getMeQueryKey = "getMe"; export const useGetMe = () => ({ data: null, isLoading: false });
import React from 'react';
import { Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { lang, t } = useI18n();
  const { formatPrice } = useCurrency();
  const { openCart } = useCartStore();
  const { openAuth } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data: user } = (() => ({ data: null, isLoading: false }))({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const addMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        openCart();
      }
    }
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuth();
      return;
    }
    addMutation.mutate({ data: { productId: product.id, quantity: 1 } });
  };

  const name = lang === 'ar' ? product.nameAr : lang === 'fr' ? product.nameFr : product.name;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-card border border-card-border hover:border-primary transition-colors duration-300 flex flex-col h-full overflow-hidden"
    >
      <Link href={`/products/${product.id}`} className="block flex-1 relative z-10">
        <div className="relative aspect-square bg-muted/30 overflow-hidden p-6">
          {product.featured && (
            <div className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1">
              Featured
            </div>
          )}
          <img 
            src={product.imageUrl || '/images/dumbbells.png'} 
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category}</div>
          <h3 className="font-display text-xl leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{name}</h3>
          
          <div className="flex items-center gap-1 mb-4 mt-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}`} 
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <span className="text-2xl font-bold font-display text-primary">{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>
      
      <div className="px-6 pb-6 mt-auto">
        <Button 
          onClick={handleAdd}
          disabled={!product.inStock || addMutation.isPending}
          className="w-full rounded-none uppercase tracking-widest font-bold h-12 relative overflow-hidden group/btn"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : product.inStock ? (
            <>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t('addToCart')}
              </span>
              <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            </>
          ) : (
            t('outOfStock')
          )}
        </Button>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
    </motion.div>
  );
}
