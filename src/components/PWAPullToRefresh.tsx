import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { RefreshCw, Loader2 } from 'lucide-react';

interface PWAPullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export function PWAPullToRefresh({ 
  children, 
  onRefresh,
  disabled = false 
}: PWAPullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  const PULL_THRESHOLD = 80; // Distance needed to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  // Transform pull distance to rotation for icon
  const iconRotation = useTransform(
    y,
    [0, PULL_THRESHOLD],
    [0, 360]
  );

  // Transform pull distance to opacity
  const iconOpacity = useTransform(
    y,
    [0, PULL_THRESHOLD / 2, PULL_THRESHOLD],
    [0, 0.5, 1]
  );

  // Transform pull distance to scale
  const iconScale = useTransform(
    y,
    [0, PULL_THRESHOLD],
    [0.5, 1]
  );

  const handleDragStart = () => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull-to-refresh if scrolled to top
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      setIsPulling(true);
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || isRefreshing || !isPulling) return;
    
    const dragY = Math.max(0, info.offset.y);
    const cappedDrag = Math.min(dragY, MAX_PULL);
    
    y.set(cappedDrag);
    setPullDistance(cappedDrag);
  };

  const handleDragEnd = async () => {
    if (disabled || isRefreshing || !isPulling) return;
    
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD) {
      // Trigger refresh
      setIsRefreshing(true);
      y.set(60); // Hold at refresh position
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        y.set(0);
        setPullDistance(0);
      }
    } else {
      // Reset
      y.set(0);
      setPullDistance(0);
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull-to-Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-10"
        style={{
          height: 60,
          y: y,
        }}
      >
        <motion.div
          className="relative"
          style={{
            opacity: iconOpacity,
            scale: iconScale,
          }}
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          ) : (
            <motion.div style={{ rotate: iconRotation }}>
              <RefreshCw 
                className={`w-6 h-6 transition-colors ${
                  pullDistance >= PULL_THRESHOLD 
                    ? 'text-purple-600' 
                    : 'text-gray-400'
                }`} 
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Scrollable Content */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto overscroll-none"
        drag={!disabled && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          y: isRefreshing ? 0 : y,
        }}
      >
        {/* Padding for refresh indicator */}
        <div style={{ height: isRefreshing ? 60 : 0 }} />
        
        {children}
      </motion.div>
    </div>
  );
}
