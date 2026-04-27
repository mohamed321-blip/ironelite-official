import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

export function CartDrawer() {
  const { isOpen, closeCart } = useCartStore();
  const { t, lang, isRtl } = useI18n();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useGetCart({ query: { enabled: isOpen, queryKey: getGetCartQueryKey() } });

  const updateMutation = useUpdateCartItem({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const removeMutation = useRemoveFromCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ productId, data: { quantity } });
  };

  const handleRemove = (productId: number) => {
    removeMutation.mutate({ productId });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side={isRtl ? 'left' : 'right'} className="w-full sm:max-w-md bg-card border-card-border rounded-none p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-2xl uppercase tracking-wider text-primary font-display flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            {t('cart')}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !cart?.items?.length ? (
            <div className="text-center py-10 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{t('emptyCart')}</p>
              <Button onClick={closeCart} variant="outline" className="mt-4 rounded-none uppercase tracking-widest">
                {t('shopNow')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-20 bg-muted shrink-0 relative">
                    <img src={item.product.imageUrl || '/images/dumbbells.png'} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">
                        {lang === 'ar' ? item.product.nameAr : lang === 'fr' ? item.product.nameFr : item.product.name}
                      </h4>
                      <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateMutation.isPending}
                          className="p-1 hover:bg-muted disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={updateMutation.isPending}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        disabled={removeMutation.isPending}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart?.items?.length ? (
          <div className="p-6 border-t border-border bg-card/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{t('subtotal')}</span>
              <span className="text-2xl font-bold font-display text-primary">{formatPrice(cart.total)}</span>
            </div>
            <Link href="/cart" className="block w-full">
              <Button onClick={closeCart} className="w-full rounded-none h-14 text-lg font-display uppercase tracking-widest relative overflow-hidden group">
                <span className="relative z-10">{t('checkout')}</span>
                <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Button>
            </Link>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
