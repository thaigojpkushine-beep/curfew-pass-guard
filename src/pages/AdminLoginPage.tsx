import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginForm.email, loginForm.password);

    if (error) {
      toast({
        title: "Admin Login Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin panel!"
      });
      navigate('/admin');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin-login`
    });

    if (error) {
      toast({
        title: "Reset Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setResetSent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Administrator Portal</h1>
          <p className="text-muted-foreground">Restricted access for authorized personnel</p>
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>
            
            {!showForgotPassword && !resetSent && (
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-muted-foreground hover:text-foreground p-0 h-auto"
                >
                  Forgot Password?
                </Button>
              </div>
            )}

            {showForgotPassword && !resetSent && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Reset Password
                </h3>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {resetSent && (
              <div className="mt-6 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Reset Link Sent</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  If an account exists with this email, you'll receive a reset link.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setResetSent(false);
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                  className="text-green-800 dark:text-green-200 p-0 h-auto mt-2"
                >
                  Back to Login
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                Regular User Login
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3 inline mr-1" />
          Secure administrative access only
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;