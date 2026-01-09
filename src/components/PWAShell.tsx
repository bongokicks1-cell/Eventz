import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Wifi, WifiOff, ChevronLeft } from 'lucide-react';

interface PWAShellProps {
  children: ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  enableSwipeBack?: boolean;
}

export function PWAShell({ 
  children, 
  onBack, 
  showBackButton = false,
  enableSwipeBack = true 
}: PWAShellProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwipingBack, setIsSwipingBack] = useState(false);
  const touchStartX = useRef(0);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setShowOfflineBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enableSwipeBack || !onBack) return;
    
    // Only enable swipe from left edge (first 50px)
    const startX = info.point.x;
    if (startX > 50) return;
    
    setIsSwipingBack(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isSwipingBack || !enableSwipeBack || !onBack) return;
    
    const dragX = info.offset.x;
    if (dragX < 0) return; // Only allow right swipe
    
    const progress = Math.min(dragX / 300, 1);
    setSwipeProgress(progress);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isSwipingBack || !enableSwipeBack || !onBack) return;
    
    setIsSwipingBack(false);
    
    // Trigger back if dragged more than 40% or velocity is high enough
    if (swipeProgress > 0.4 || info.velocity.x > 500) {
      onBack();
    }
    
    setSwipeProgress(0);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* iOS-style Status Bar Overlay */}
      <div 
        className="fixed top-0 left-0 right-0 h-11 z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), transparent)',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      />

      {/* Offline Banner */}
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className={`mx-auto px-4 py-3 ${
              isOnline ? 'bg-green-500' : 'bg-orange-500'
            } text-white shadow-lg`}>
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Back online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>No internet connection</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Back Indicator */}
      <AnimatePresence>
        {isSwipingBack && swipeProgress > 0.1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: swipeProgress }}
            exit={{ opacity: 0 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
            style={{
              paddingLeft: 'env(safe-area-inset-left)',
            }}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ChevronLeft 
                className="w-6 h-6 text-purple-600" 
                style={{ transform: `translateX(${swipeProgress * 8}px)` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Swipe Gesture */}
      <motion.div
        className="h-full w-full"
        drag={enableSwipeBack && onBack ? "x" : false}
        dragConstraints={{ left: 0, right: 300 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x: isSwipingBack ? swipeProgress * 100 : 0,
          opacity: isSwipingBack ? 1 - (swipeProgress * 0.3) : 1,
        }}
      >
        {/* Safe Area Container */}
        <div 
          className="h-full w-full"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          {children}
        </div>
      </motion.div>

      {/* Bottom Safe Area for Home Indicator */}
      <div 
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 'env(safe-area-inset-bottom)',
          background: 'white',
        }}
      />
    </div>
  );
}
