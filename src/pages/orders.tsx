import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useListOrders, getListOrdersQueryKey, useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { t, lang, isRtl } = useI18n();
  const [, setLocation] = useLocation();
  const { openAuth } = useAuthStore();

  const { data: user, isLoading: userLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  
  const { data: orders, isLoading: ordersLoading } = useListOrders({ 
    query: { 
      queryKey: getListOrdersQueryKey(),
      enabled: !!user 
    } 
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <Package className="w-16 h-16 text-muted-foreground mb-6 opacity-50" />
        <h2 className="font-display text-4xl uppercase tracking-wider mb-4">Please log in</h2>
        <p className="text-muted-foreground mb-8">You need to be logged in to view your order history.</p>
        <Button onClick={openAuth} className="rounded-none uppercase tracking-widest h-14 px-10 font-bold">
          {t('login')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-display text-5xl uppercase tracking-wider mb-10 pb-4 border-b border-border">
          {t('orderHistory')}
        </h1>

        {ordersLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !orders?.length ? (
          <div className="bg-card border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-30" />
            <h2 className="font-display text-3xl uppercase tracking-wider mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">When you place orders, they will appear here.</p>
            <Button onClick={() => setLocation('/products')} className="rounded-none uppercase tracking-widest">
              {t('shopNow')}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border">
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Order Placed</p>
                      <p className="font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Total</p>
                      <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Order #</p>
                      <p className="font-mono">{order.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-6">
                  {order.items.map((item, idx) => {
                    const name = lang === 'ar' ? item.product.nameAr : lang === 'fr' ? item.product.nameFr : item.product.name;
                    return (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="w-20 h-20 bg-background border border-border p-2 shrink-0">
                          <img src={item.product.imageUrl || '/images/dumbbells.png'} alt={name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg line-clamp-1">{name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity} &times; ${item.priceAtOrder.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right font-bold text-lg hidden sm:block">
                          ${(item.quantity * item.priceAtOrder).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Shipping info */}
                <div className="bg-background p-6 border-t border-border text-sm">
                  <p className="font-bold uppercase tracking-widest text-muted-foreground mb-2">Shipping To:</p>
                  <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
