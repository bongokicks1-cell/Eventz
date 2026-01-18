import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Video } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface AuthScreenProps {
  onAuthSuccess: (accessToken: string, user: any) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Call backend signup endpoint
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3c04079/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // After successful signup, sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (signInData.session?.access_token) {
        toast.success(`Welcome to EVENTZ, ${name}! 🎉`);
        onAuthSuccess(signInData.session.access_token, signInData.user);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        const userName = data.user.user_metadata?.name || 'there';
        toast.success(`Welcome back, ${userName}! 🎉`);
        onAuthSuccess(data.session.access_token, data.user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo & Branding */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2] via-[#00D1FF] to-[#FF3CAC] blur-xl opacity-60 animate-pulse"></div>
              <Video className="w-12 h-12 text-[#8A2BE2] relative z-10" strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#8A2BE2] via-[#00D1FF] to-[#FF3CAC] bg-clip-text text-transparent">
              EVENTZ
            </h1>
          </div>
          <p className="text-gray-400 text-lg font-medium">
            The Netflix of Live Events
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-[#FF3CAC]" />
            <span>HD Live Streaming • Virtual Tickets • Multi-Camera</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 bg-[#0A0A0A] p-1 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-[#8A2BE2] to-[#00D1FF] text-white shadow-lg shadow-[#8A2BE2]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-[#8A2BE2] to-[#00D1FF] text-white shadow-lg shadow-[#8A2BE2]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
              {/* Name Field (Signup Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (6+ characters)'}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8A2BE2] via-[#00D1FF] to-[#FF3CAC] text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-[#8A2BE2]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Login' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-[#00D1FF] hover:text-[#8A2BE2] font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl">🎥</div>
              <p className="text-xs text-gray-500 font-medium">HD Streaming</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🎫</div>
              <p className="text-xs text-gray-500 font-medium">Virtual Tickets</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">💬</div>
              <p className="text-xs text-gray-500 font-medium">Live Chat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-[#8A2BE2] via-[#00D1FF] to-[#FF3CAC]"></div>
    </div>
  );
}