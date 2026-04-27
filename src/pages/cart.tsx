import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { useGetCart, useUpdateCartItem, useRemoveFromCart, useCreateOrder, getGetCartQueryKey, useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store';

export default function CartPage() {
  const { t, lang, isRtl } = useI18n();
  const { formatPrice } = useCurrency();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { openAuth } = useAuthStore();
  const [address, setAddress] = useState('');

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const { data: cart, isLoading } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: !!user } });

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

  const orderMutation = useCreateOrder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({ title: t('success'), description: 'Order placed successfully!' });
        setLocation('/orders');
      },
      onError: (err) => {
        toast({ title: t('error'), description: err.message || 'Failed to place order', variant: 'destructive' });
      }
    }
  });

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ productId, data: { quantity } });
  };

  const handleRemove = (productId: number) => {
    removeMutation.mutate({ productId });
  };

  const handleCheckout = () => {
    if (!user) {
      openAuth();
      return;
    }
    if (!address.trim()) {
      toast({ title: t('error'), description: 'Please enter a shipping address', variant: 'destructive' });
      return;
    }
    orderMutation.mutate({ data: { shippingAddress: address } });
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-6 opacity-50" />
        <h2 className="font-display text-4xl uppercase tracking-wider mb-4">Please log in</h2>
        <p className="text-muted-foreground mb-8">You need to be logged in to view your cart and checkout.</p>
        <Button onClick={openAuth} className="rounded-none uppercase tracking-widest h-14 px-10 font-bold">
          {t('login')}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-6 opacity-20" />
        <h2 className="font-display text-4xl uppercase tracking-wider mb-4">{t('emptyCart')}</h2>
        <Link href="/products">
          <Button className="mt-4 rounded-none uppercase tracking-widest h-14 px-10 font-bold group">
            {t('shopNow')}
            <ArrowRight className={`ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-display text-5xl uppercase tracking-wider mb-10 pb-4 border-b border-border">
          {t('cart')}
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.items.map((item) => {
              const name = lang === 'ar' ? item.product.nameAr : lang === 'fr' ? item.product.nameFr : item.product.name;
              
              return (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-border">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                    <div className="w-24 h-24 bg-card border border-border p-2 shrink-0">
                      <img src={item.product.imageUrl || '/images/dumbbells.png'} alt={name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                        {name}
                      </Link>
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors mt-2 flex items-center gap-1 uppercase tracking-widest font-medium"
                      >
                        <Trash2 className="w-3 h-3" /> {t('remove')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-center hidden md:block font-bold">
                    {formatPrice(item.product.price)}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-border bg-card h-10 w-32">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateMutation.isPending}
                        className="flex-1 h-full hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-center text-muted-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={updateMutation.isPending}
                        className="flex-1 h-full hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-right font-display text-xl text-primary font-bold">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-card border border-border p-8 sticky top-32">
              <h2 className="font-display text-2xl uppercase tracking-wider mb-6 pb-4 border-b border-border">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-muted-foreground uppercase tracking-widest">{t('subtotal')}</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground uppercase tracking-widest">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-t border-border pt-6 mb-8">
                <span className="font-bold uppercase tracking-widest">{t('total')}</span>
                <span className="font-display text-4xl text-primary font-bold">{formatPrice(cart.total)}</span>
              </div>

              <div className="space-y-4 mb-8">
                <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {t('shippingAddress')}
                </label>
                <textarea 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your full shipping address..."
                  className="w-full bg-background border border-border p-3 min-h-[100px] resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={orderMutation.isPending || !address.trim()}
                className="w-full rounded-none h-16 text-lg font-display uppercase tracking-widest relative overflow-hidden group"
              >
                {orderMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">{t('placeOrder')}</span>
                    <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
