const getMeQueryKey = "getMe"; const useGetMe = () => ({ data: null, isLoading: false });
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'ar';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    cart: 'Cart',
    account: 'Account',
    orders: 'Orders',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search products...',
    heroTitle: 'Forged in Iron',
    heroSubtitle: 'Premium equipment for serious athletes.',
    shopNow: 'Shop Now',
    featuredProducts: 'Featured Products',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty.',
    viewAll: 'View All',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    submit: 'Submit',
    myOrders: 'My Orders',
    shippingAddress: 'Shipping Address',
    placeOrder: 'Place Order',
    orderHistory: 'Order History',
    orderTotal: 'Order Total',
    status: 'Status',
    date: 'Date',
    items: 'Items',
    clearCart: 'Clear Cart',
    remove: 'Remove',
    quantity: 'Quantity',
    description: 'Description',
    rating: 'Rating',
    reviews: 'Reviews',
    gymEquipment: 'Gym Equipment',
    premium: 'Premium Quality',
    shopCategory: 'Shop by Category',
    allCategories: 'All Categories',
    allProducts: 'All Products',
    loading: 'Loading...',
    error: 'An error occurred.',
    success: 'Success!',
    welcome: 'Welcome',
    back: 'Back',
  },
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    categories: 'Catégories',
    cart: 'Panier',
    account: 'Compte',
    orders: 'Commandes',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    search: 'Rechercher des produits...',
    heroTitle: 'Forgé dans le Fer',
    heroSubtitle: 'Équipement haut de gamme pour les athlètes sérieux.',
    shopNow: 'Acheter',
    featuredProducts: 'Produits Vedettes',
    addToCart: 'Ajouter au Panier',
    outOfStock: 'Rupture de Stock',
    price: 'Prix',
    total: 'Total',
    subtotal: 'Sous-total',
    checkout: 'Payer',
    emptyCart: 'Votre panier est vide.',
    viewAll: 'Voir Tout',
    email: 'E-mail',
    password: 'Mot de passe',
    name: 'Nom Complet',
    submit: 'Soumettre',
    myOrders: 'Mes Commandes',
    shippingAddress: 'Adresse de Livraison',
    placeOrder: 'Passer la Commande',
    orderHistory: 'Historique des Commandes',
    orderTotal: 'Total de la Commande',
    status: 'Statut',
    date: 'Date',
    items: 'Articles',
    clearCart: 'Vider le Panier',
    remove: 'Retirer',
    quantity: 'Quantité',
    description: 'Description',
    rating: 'Évaluation',
    reviews: 'Avis',
    gymEquipment: 'Équipement de Gym',
    premium: 'Qualité Supérieure',
    shopCategory: 'Acheter par Catégorie',
    allCategories: 'Toutes les Catégories',
    allProducts: 'Tous les Produits',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite.',
    success: 'Succès!',
    welcome: 'Bienvenue',
    back: 'Retour',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'تسوق',
    categories: 'الفئات',
    cart: 'عربة التسوق',
    account: 'الحساب',
    orders: 'الطلبات',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    search: 'ابحث عن المنتجات...',
    heroTitle: 'صُنع من الحديد',
    heroSubtitle: 'معدات فاخرة للرياضيين الجادين.',
    shopNow: 'تسوق الآن',
    featuredProducts: 'المنتجات المميزة',
    addToCart: 'أضف إلى العربة',
    outOfStock: 'نفد من المخزون',
    price: 'السعر',
    total: 'المجموع',
    subtotal: 'المجموع الفرعي',
    checkout: 'الدفع',
    emptyCart: 'عربة التسوق فارغة.',
    viewAll: 'عرض الكل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    submit: 'إرسال',
    myOrders: 'طلباتي',
    shippingAddress: 'عنوان الشحن',
    placeOrder: 'إتمام الطلب',
    orderHistory: 'تاريخ الطلبات',
    orderTotal: 'إجمالي الطلب',
    status: 'الحالة',
    date: 'التاريخ',
    items: 'العناصر',
    clearCart: 'تفريغ العربة',
    remove: 'إزالة',
    quantity: 'الكمية',
    description: 'الوصف',
    rating: 'التقييم',
    reviews: 'المراجعات',
    gymEquipment: 'معدات الجيم',
    premium: 'جودة عالية',
    shopCategory: 'تسوق حسب الفئة',
    allCategories: 'كل الفئات',
    allProducts: 'كل المنتجات',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ.',
    success: 'نجاح!',
    welcome: 'مرحباً',
    back: 'عودة',
  },
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-lang', newLang);
  };

  useEffect(() => {
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [lang]);

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
