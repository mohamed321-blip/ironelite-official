export const getMeQueryKey = "getMe"; export const useGetMe = () => ({ data: null, isLoading: false });
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Link } from 'wouter';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-3xl font-bold tracking-wider text-foreground">
                IRON<span className="text-primary">ELITE</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              {t('heroSubtitle')} Uncompromising quality for those who demand the best. Designed to withstand the toughest workouts.
            </p>
          </div>
          
          <div>
            <h3 className="font-display text-xl uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Shop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">{t('allProducts')}</Link></li>
              <li><Link href="/products?category=Strength" className="hover:text-primary transition-colors">Strength</Link></li>
              <li><Link href="/products?category=Conditioning" className="hover:text-primary transition-colors">Conditioning</Link></li>
              <li><Link href="/products?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-xl uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-primary transition-colors">{t('account')}</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">{t('orders')}</Link></li>
              <li><a href="mailto:medksiksa321@gmail.com" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {currentYear} Iron Elite. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
