import { Sparkles, Users, Zap, TrendingUp, CheckCircle, ArrowRight, Video, DollarSign, BarChart3, Globe, Shield, Headphones } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BecomeOrganizerProps {
  onComplete: () => void;
}

export function BecomeOrganizer({ onComplete }: BecomeOrganizerProps) {
  const handleBecomeOrganizer = () => {
    localStorage.setItem('eventz-is-organizer', 'true');
    toast.success('Welcome to EVENTZ Organizers! 🎉', {
      description: 'You can now create and manage events',
      duration: 3000,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0E0E11] pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#9D4EDD] via-[#8B3FCC] to-[#7B2EBB] px-6 pt-16 pb-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#06D6FF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF3CAC] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce border border-white/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-white text-3xl sm:text-4xl mb-4 font-bold">
            Become an Organizer
          </h1>
          <p className="text-white/95 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Create events, stream live in HD, and reach thousands of people worldwide.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <Users className="w-7 h-7 text-white/90" />
                <p className="text-white text-2xl font-bold">50K+</p>
                <p className="text-white/80 text-xs leading-tight">Active Users</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-7 h-7 text-white/90" />
                <p className="text-white text-2xl font-bold">1.2M+</p>
                <p className="text-white/80 text-xs leading-tight">Tickets Sold</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-7 h-7 text-white/90" />
                <p className="text-white text-2xl font-bold">98%</p>
                <p className="text-white/80 text-xs leading-tight">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={handleBecomeOrganizer}
            className="bg-white text-[#9D4EDD] px-10 py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto group text-lg font-semibold hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Start Creating Events</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-[#F5F5F7] text-3xl mb-3 font-bold">Why Choose EVENTZ?</h2>
          <p className="text-[#A1A1A6] text-lg max-w-2xl mx-auto">
            Everything you need to create, manage, and monetize world-class events
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Feature 1 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-600/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#9D4EDD]/50">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9D4EDD] to-[#7B2EBB] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">HD Live Streaming</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Stream your events in crystal-clear HD with multi-camera angles, live chat, and interactive features
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#06D6FF]/50">
            <div className="w-16 h-16 bg-gradient-to-br from-[#06D6FF] to-[#0099CC] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">Monetization Tools</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Sell tickets, offer VIP packages, and generate revenue with virtual tickets and exclusive content
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#FF3CAC]/50">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF3CAC] to-[#E0179F] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">Real-Time Analytics</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Track attendance, engagement, revenue, and viewer insights with powerful analytics dashboard
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-600/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#9D4EDD]/50">
            <div className="w-16 h-16 bg-[#9D4EDD] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">Massive Reach</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Connect with 50,000+ active users actively searching for events and experiences
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#06D6FF]/50">
            <div className="w-16 h-16 bg-gradient-to-br from-[#06D6FF] to-[#9D4EDD] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">Global Distribution</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Reach audiences worldwide with location-based discovery and international payment support
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-[#141417] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all border border-[rgba(255,255,255,0.12)] group hover:border-[#FF3CAC]/50">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF3CAC] to-[#9D4EDD] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#F5F5F7] text-xl mb-2 font-semibold">Secure & Reliable</h3>
            <p className="text-[#A1A1A6] leading-relaxed">
              Enterprise-grade security, reliable streaming infrastructure, and instant payouts
            </p>
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className="bg-gradient-to-br from-[#9D4EDD]/10 to-[#06D6FF]/5 rounded-3xl p-8 md:p-12 border border-[#9D4EDD]/30 backdrop-blur-sm">
          <h3 className="text-[#F5F5F7] text-2xl mb-6 text-center font-bold">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">Unlimited Events & Live Streams</p>
                <p className="text-[#A1A1A6] text-sm">Create as many events as you want with no restrictions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">Advanced Analytics Dashboard</p>
                <p className="text-[#A1A1A6] text-sm">Real-time insights into attendance and revenue</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">Ticket Management System</p>
                <p className="text-[#A1A1A6] text-sm">QR codes, digital tickets, and instant validation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">HD Streaming Infrastructure</p>
                <p className="text-[#A1A1A6] text-sm">Multi-camera support, chat, reactions, and replays</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">Payment Processing</p>
                <p className="text-[#A1A1A6] text-sm">Secure payments with instant payouts to your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#9D4EDD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F5F5F7] mb-1 font-medium">24/7 Support</p>
                <p className="text-[#A1A1A6] text-sm">Dedicated support team to help you succeed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={handleBecomeOrganizer}
            className="bg-gradient-to-r from-[#9D4EDD] to-[#7B2EBB] text-white px-12 py-5 rounded-2xl hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto group text-lg font-semibold"
          >
            <Sparkles className="w-6 h-6" />
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="text-[#6C6C70] text-sm mt-4">
            Free to start • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
