import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('eventz-pwa-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      setIsInstalled(true);
      setShowPrompt(false);
      toast.success('EVENTZ installed successfully! 🎉');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      toast.success('Installing EVENTZ... 📲');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('eventz-pwa-dismissed', new Date().toISOString());
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="p-5">
          {/* Icon */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 pr-6">
              <h3 className="text-white text-lg mb-1">Install EVENTZ App</h3>
              <p className="text-white/90 text-sm mb-4">
                Get the full experience with offline access, push notifications, and faster loading
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/95 text-xs">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <span>Works offline</span>
                </div>
                <div className="flex items-center gap-2 text-white/95 text-xs">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <span>Instant notifications for your events</span>
                </div>
                <div className="flex items-center gap-2 text-white/95 text-xs">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <span>Faster and more reliable</span>
                </div>
              </div>

              {/* Install Button */}
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 px-4 py-3 rounded-xl hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Install Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
