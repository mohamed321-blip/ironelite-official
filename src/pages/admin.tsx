import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { useCurrency } from '@/lib/currency';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, Users, Package, ShoppingBag, Edit, Trash2, Plus, X, Check, ChevronDown } from 'lucide-react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Request failed');
  }
  return res.json();
}

type Tab = 'dashboard' | 'products' | 'orders' | 'users';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatCard({ label, value, icon: Icon, accent = false }: { label: string; value: string | number; icon: React.ElementType; accent?: boolean }) {
  return (
    <div className={`border ${accent ? 'border-primary bg-primary/5' : 'border-border bg-card'} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`h-5 w-5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <span className={`font-display text-3xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiFetch('/admin/stats'),
    enabled: !!user?.isAdmin,
  });

  const productsQuery = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => apiFetch('/admin/products'),
    enabled: !!user?.isAdmin && activeTab === 'products',
  });

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch('/admin/orders'),
    enabled: !!user?.isAdmin && activeTab === 'orders',
  });

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiFetch('/admin/users'),
    enabled: !!user?.isAdmin && activeTab === 'users',
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast({ title: 'Product deleted' });
    },
    onError: (err: Error) => toast({ title: err.message, variant: 'destructive' }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiFetch(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast({ title: 'Order status updated' });
    },
    onError: (err: Error) => toast({ title: err.message, variant: 'destructive' }),
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const defaultForm = { name: '', nameFr: '', nameAr: '', description: '', descriptionFr: '', descriptionAr: '', price: '', imageUrl: '', category: '', inStock: true, featured: false, rating: 4.5, reviewCount: 0 };
  const [productForm, setProductForm] = useState<any>(defaultForm);

  const saveProductMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data, price: parseFloat(data.price), rating: parseFloat(data.rating), reviewCount: parseInt(data.reviewCount, 10) };
      if (editingProduct) {
        return apiFetch(`/admin/products/${editingProduct.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      return apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast({ title: editingProduct ? 'Product updated' : 'Product created' });
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(defaultForm);
    },
    onError: (err: Error) => toast({ title: err.message, variant: 'destructive' }),
  });

  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You must be logged in to access the admin panel.</p>
          <Link href="/"><Button variant="outline" className="rounded-none">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You do not have admin access.</p>
          <Link href="/"><Button variant="outline" className="rounded-none">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="border-b border-border pb-6 mb-8 mt-6">
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest">Admin Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm">Iron Elite Control Center</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-border overflow-x-auto">
          {(['dashboard', 'products', 'orders', 'users'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {statsQuery.isLoading ? (
              <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : statsQuery.data ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <StatCard label="Revenue" value={formatPrice(statsQuery.data.totalRevenue)} icon={TrendingUp} accent />
                  <StatCard label="Orders" value={statsQuery.data.totalOrders} icon={ShoppingBag} />
                  <StatCard label="Users" value={statsQuery.data.totalUsers} icon={Users} />
                  <StatCard label="Products" value={statsQuery.data.totalProducts} icon={Package} />
                </div>

                <div className="border border-border bg-card">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-display text-xl uppercase tracking-wider">Recent Orders</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                          <th className="text-left px-6 py-3">ID</th>
                          <th className="text-left px-6 py-3">Customer</th>
                          <th className="text-left px-6 py-3">Status</th>
                          <th className="text-right px-6 py-3">Total</th>
                          <th className="text-right px-6 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsQuery.data.recentOrders.map((order: any) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-card/80 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{order.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{order.userName}</div>
                              <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-primary">{formatPrice(order.total)}</td>
                            <td className="px-6 py-4 text-right text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl uppercase tracking-wider">Products</h2>
              <Button
                onClick={() => { setEditingProduct(null); setProductForm(defaultForm); setShowProductForm(true); }}
                className="rounded-none gap-2"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>

            {showProductForm && (
              <div className="border border-primary/50 bg-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg uppercase tracking-wider text-primary">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h3>
                  <button onClick={() => setShowProductForm(false)}><X className="h-5 w-5" /></button>
                </div>
                <ProductForm
                  form={productForm}
                  setForm={setProductForm}
                  onSubmit={() => saveProductMutation.mutate(productForm)}
                  isLoading={saveProductMutation.isPending}
                  isEdit={!!editingProduct}
                />
              </div>
            )}

            {productsQuery.isLoading ? (
              <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background/50">
                    <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-left px-4 py-3">Category</th>
                      <th className="text-right px-4 py-3">Price</th>
                      <th className="text-center px-4 py-3">Stock</th>
                      <th className="text-center px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsQuery.data?.map((product: any) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-card/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover border border-border" />
                            <div>
                              <div className="font-medium text-xs">{product.name}</div>
                              <div className="text-xs text-muted-foreground">#{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{product.category}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {product.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setProductForm({ ...product, price: String(product.price), rating: String(product.rating), reviewCount: String(product.reviewCount) });
                                setShowProductForm(true);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { if (confirm('Delete this product?')) deleteProductMutation.mutate(product.id); }}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wider mb-6">Orders</h2>
            {ordersQuery.isLoading ? (
              <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background/50">
                    <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="text-left px-4 py-3">Order</th>
                      <th className="text-left px-4 py-3">Customer</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-right px-4 py-3">Total</th>
                      <th className="text-right px-4 py-3">Items</th>
                      <th className="text-right px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersQuery.data?.map((order: any) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-card/80 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-xs">{order.userName}</div>
                          <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                            className="bg-card border border-border text-xs px-2 py-1 cursor-pointer focus:outline-none focus:border-primary"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatPrice(order.total)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{order.itemCount}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {ordersQuery.data?.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wider mb-6">Users</h2>
            {usersQuery.isLoading ? (
              <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background/50">
                    <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="text-left px-4 py-3">User</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-center px-4 py-3">Role</th>
                      <th className="text-right px-4 py-3">Orders</th>
                      <th className="text-right px-4 py-3">Spent</th>
                      <th className="text-right px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersQuery.data?.map((u: any) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-card/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-xs">{u.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">#{u.id}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3 text-center">
                          {u.isAdmin ? (
                            <span className="text-xs font-bold uppercase px-2 py-0.5 bg-primary/10 text-primary border border-primary/30">Admin</span>
                          ) : (
                            <span className="text-xs font-bold uppercase px-2 py-0.5 bg-muted text-muted-foreground">User</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">{u.orderCount}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatPrice(u.totalSpent)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    processing: 'bg-blue-500/10 text-blue-500',
    shipped: 'bg-purple-500/10 text-purple-500',
    delivered: 'bg-green-500/10 text-green-500',
    cancelled: 'bg-red-500/10 text-red-500',
  };
  return (
    <span className={`text-xs font-bold uppercase px-2 py-0.5 ${colors[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}

function ProductForm({ form, setForm, onSubmit, isLoading, isEdit }: {
  form: any;
  setForm: (v: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEdit: boolean;
}) {
  const fields = [
    { key: 'name', label: 'Name (EN)', required: true },
    { key: 'nameFr', label: 'Name (FR)', required: true },
    { key: 'nameAr', label: 'Name (AR)', required: true },
    { key: 'description', label: 'Description (EN)', required: true },
    { key: 'descriptionFr', label: 'Description (FR)', required: true },
    { key: 'descriptionAr', label: 'Description (AR)', required: true },
    { key: 'price', label: 'Price (USD)', required: true },
    { key: 'imageUrl', label: 'Image URL', required: true },
    { key: 'category', label: 'Category', required: true },
    { key: 'rating', label: 'Rating (0-5)', required: true },
    { key: 'reviewCount', label: 'Review Count', required: true },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{f.label}</label>
            <Input
              value={form[f.key] ?? ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="rounded-none border-border"
              required={f.required}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            className="accent-primary"
          />
          <span className="text-xs font-bold uppercase tracking-widest">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="accent-primary"
          />
          <span className="text-xs font-bold uppercase tracking-widest">Featured</span>
        </label>
      </div>
      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isLoading} className="rounded-none gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );
}
