import { useState } from 'react';
import { 
  Smartphone, 
  Zap, 
  Wifi, 
  Bell, 
  Download, 
  RefreshCw, 
  Share2,
  Grid3x3,
  CheckCircle2,
  X
} from 'lucide-react';

interface PWAFeaturesOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PWAFeaturesOverview({ isOpen, onClose }: PWAFeaturesOverviewProps) {
  const [isInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches
  );

  if (!isOpen) return null;

  const features = [
    {
      icon: Smartphone,
      title: 'Install as App',
      description: 'Add EVENTZ to your home screen and use it like a native app',
      status: isInstalled,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Wifi,
      title: 'Offline Access',
      description: 'Browse events and content even without internet connection',
      status: true,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Cached assets for instant loading and smooth experience',
      status: true,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Get notified about events, tickets, and live streams',
      status: false,
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: RefreshCw,
      title: 'Auto-Updates',
      description: 'App updates automatically in the background',
      status: true,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Share2,
      title: 'Share Target',
      description: 'Share content directly to EVENTZ from other apps',
      status: true,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Grid3x3,
      title: 'App Shortcuts',
      description: 'Quick access to Events, Live, and Community feeds',
      status: true,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Download,
      title: 'Save Data',
      description: 'Optimized caching reduces data usage significantly',
      status: true,
      gradient: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-white text-3xl mb-1">Progressive Web App</h2>
              <p className="text-white/90 text-sm">
                {isInstalled ? '✨ Already installed!' : 'Install for the best experience'}
              </p>
            </div>
          </div>

          {/* Installation Status */}
          {isInstalled ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-300" />
              <div>
                <p className="text-white text-sm">Running as installed app</p>
                <p className="text-white/80 text-xs">Enjoy the full native experience!</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <Download className="w-5 h-5 text-cyan-300" />
              <div>
                <p className="text-white text-sm">Not installed yet</p>
                <p className="text-white/80 text-xs">Look for the install button in your browser</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <h3 className="text-gray-900 text-xl mb-4">Available Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group"
                >
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                    feature.status 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}>
                    {feature.status ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="text-gray-400 text-xs">Soon</span>
                    )}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Installation Instructions */}
          {!isInstalled && (
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                How to Install
              </h4>
              
              <div className="space-y-4">
                {/* Desktop */}
                <div>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>On Desktop (Chrome/Edge):</strong>
                  </p>
                  <ol className="text-gray-600 text-sm space-y-1 ml-4">
                    <li>1. Look for the <strong>install icon (⊕)</strong> in the address bar</li>
                    <li>2. Click it and select "Install"</li>
                    <li>3. EVENTZ will open in its own window!</li>
                  </ol>
                </div>

                {/* Android */}
                <div>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>On Android:</strong>
                  </p>
                  <ol className="text-gray-600 text-sm space-y-1 ml-4">
                    <li>1. Tap the three dots menu (⋮)</li>
                    <li>2. Select "Add to Home screen"</li>
                    <li>3. Tap "Install" to confirm</li>
                  </ol>
                </div>

                {/* iOS */}
                <div>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>On iPhone/iPad (Safari only):</strong>
                  </p>
                  <ol className="text-gray-600 text-sm space-y-1 ml-4">
                    <li>1. Tap the Share button (□↑)</li>
                    <li>2. Scroll and tap "Add to Home Screen"</li>
                    <li>3. Tap "Add" to confirm</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
