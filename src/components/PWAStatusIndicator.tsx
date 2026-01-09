import { useEffect, useState } from 'react';
import { Smartphone, Wifi, WifiOff } from 'lucide-react';

export function PWAStatusIndicator() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const installed = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(installed);

    // Only show indicator when installed
    if (installed) {
      // Show status indicator for 3 seconds on mount
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      // Keep showing offline indicator
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show if not installed
  if (!isInstalled) return null;

  // Don't show if online and timeout passed
  if (isOnline && !showStatus) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${
        isOnline 
          ? 'bg-green-500/90 text-white' 
          : 'bg-red-500/90 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </>
        )}
      </div>
    </div>
  );
}
