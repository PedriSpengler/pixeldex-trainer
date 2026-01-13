import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, Lock, Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(2, 'Username must be at least 2 characters').max(20),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const validated = loginSchema.parse({ email, password });
        setLoading(true);
        const result = await login(validated.email, validated.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const validated = registerSchema.parse({ email, password, username });
        setLoading(true);
        const result = await register(validated.email, validated.password, validated.username);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-pixel text-[10px]">Back to Pokédex</span>
        </button>

        {/* Auth Card */}
        <div className="bg-card rounded-lg pixel-border p-6 border-4 border-primary">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-primary/50 border-4 border-foreground flex items-center justify-center animate-pulse-glow">
                <div className="w-4 h-4 rounded-full bg-foreground" />
              </div>
            </div>
            <h1 className="font-pixel text-lg text-primary mb-2">
              {isLogin ? 'TRAINER LOGIN' : 'NEW TRAINER'}
            </h1>
            <p className="font-pixel text-[10px] text-muted-foreground">
              {isLogin ? 'Welcome back, trainer!' : 'Start your adventure!'}
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="bg-muted rounded-lg p-3 mb-6 pixel-border">
              <p className="font-pixel text-[8px] text-muted-foreground mb-1">Demo Credentials:</p>
              <p className="font-pixel text-[10px] text-foreground">demo@pokedex.com / demo123</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="font-pixel text-[10px] text-muted-foreground">
                  Trainer Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ash Ketchum"
                    className="pl-10 bg-muted border-2 border-border focus:border-primary font-pixel text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-pixel text-[10px] text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainer@pokemon.com"
                  className="pl-10 bg-muted border-2 border-border focus:border-primary font-pixel text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-pixel text-[10px] text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="pl-10 bg-muted border-2 border-border focus:border-primary font-pixel text-xs"
                />
              </div>
            </div>

            {error && (
              <p className="font-pixel text-[10px] text-destructive text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 retro-button font-pixel text-xs py-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                'START BATTLE!'
              ) : (
                'BEGIN JOURNEY!'
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-pixel text-[10px] text-secondary hover:text-secondary/80 transition-colors"
            >
              {isLogin ? 'New trainer? Register here' : 'Already a trainer? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
