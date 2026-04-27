import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from 'next-themes';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Sun, Moon, LogOut, Menu, X, ChevronDown, Package, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t, isRtl } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const { openAuth } = useAuthStore();
  const { openCart } = useCartStore();
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: !!user } });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('shop') },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-3xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">
              IRON<span className="text-primary group-hover:text-foreground transition-colors">ELITE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors relative ${location === link.href ? 'text-primary' : 'text-foreground/80'}`}>
                {link.label}
                {location === link.href && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Currency Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-none h-9 px-2 border border-transparent hover:border-primary/50 text-xs font-bold uppercase gap-1">
                  {currency}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none border-border w-28">
                <DropdownMenuItem onClick={() => setCurrency('USD')} className={`cursor-pointer font-mono text-sm ${currency === 'USD' ? 'text-primary font-bold' : ''}`}>
                  USD ($)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('MAD')} className={`cursor-pointer font-mono text-sm ${currency === 'MAD' ? 'text-primary font-bold' : ''}`}>
                  MAD (DH)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-none w-9 h-9 border border-transparent hover:border-primary/50 text-xs font-bold uppercase">
                  {lang}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none border-border">
                <DropdownMenuItem onClick={() => setLang('en')} className="cursor-pointer">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('fr')} className="cursor-pointer">Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('ar')} className="cursor-pointer">العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-none w-9 h-9 border border-transparent hover:border-primary/50"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User / Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-none border border-transparent hover:border-primary/50 gap-2 hidden md:flex h-9 px-3">
                    <User className="h-4 w-4" />
                    <span className="max-w-[80px] truncate text-sm">{user.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-none border-border w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border mb-1 truncate">
                    {user.email}
                  </div>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer py-2 text-primary font-semibold">
                        <Link href="/admin" className="w-full flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer py-2">
                    <Link href="/orders" className="w-full flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      {t('orders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="cursor-pointer text-destructive py-2 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={openAuth} className="rounded-none w-9 h-9 border border-transparent hover:border-primary/50 hidden md:inline-flex">
                <User className="h-4 w-4" />
              </Button>
            )}

            {/* Cart */}
            <Button variant="outline" size="icon" onClick={openCart} className="rounded-none w-10 h-10 border-border hover:border-primary hover:text-primary relative group">
              <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                  {cart.itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden rounded-none w-10 h-10">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-display uppercase tracking-widest py-2 border-b border-border/50 ${location === link.href ? 'text-primary' : 'text-foreground'}`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {user.isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-display uppercase tracking-widest py-2 border-b border-border/50 text-primary flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-display uppercase tracking-widest py-2 border-b border-border/50 flex items-center">
                    {t('orders')}
                  </Link>
                  <button
                    onClick={() => { logoutMutation.mutate(); setMobileMenuOpen(false); }}
                    className="text-lg font-display uppercase tracking-widest py-2 text-destructive text-left"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { openAuth(); setMobileMenuOpen(false); }}
                  className="text-lg font-display uppercase tracking-widest py-2 text-left"
                >
                  {t('login')} / {t('register')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
