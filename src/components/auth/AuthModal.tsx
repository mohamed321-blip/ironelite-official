import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AuthModal() {
  const { t } = useI18n();
  const { isOpen, closeAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const loginMutation = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        closeAuth();
        toast({ title: t('welcome'), description: t('success') });
        setEmail('');
        setPassword('');
      },
      onError: (error) => {
        toast({ title: t('error'), description: error.message || 'Login failed', variant: 'destructive' });
      }
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        closeAuth();
        toast({ title: t('welcome'), description: t('success') });
        setEmail('');
        setPassword('');
        setName('');
      },
      onError: (error) => {
        toast({ title: t('error'), description: error.message || 'Registration failed', variant: 'destructive' });
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: { name, email, password } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAuth}>
      <DialogContent className="sm:max-w-[425px] bg-card border-card-border text-foreground rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl uppercase tracking-wider text-primary">{activeTab === 'login' ? t('login') : t('register')}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted mb-6">
            <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-widest">{t('login')}</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-widest">{t('register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-none border-muted focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-none border-muted focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full rounded-none font-bold uppercase tracking-widest h-12" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                {t('login')}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input 
                  id="name" 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="rounded-none border-muted focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">{t('email')}</Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-none border-muted focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">{t('password')}</Label>
                <Input 
                  id="reg-password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-none border-muted focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full rounded-none font-bold uppercase tracking-widest h-12" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                {t('register')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
