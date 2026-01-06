import { X, Heart, Share2, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface Photo {
  id: number;
  url: string;
  likes: number;
  eventName?: string;
}

interface VideoClip {
  id: number;
  thumbnail: string;
  duration: string;
  views: number;
  likes?: number;
  videoUrl: string;
  eventName?: string;
}

interface MediaViewerProps {
  media: Photo[] | VideoClip[];
  initialIndex: number;
  onClose: () => void;
  type: 'photo' | 'video';
}

export function MediaViewer({ media, initialIndex, onClose, type }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(type === 'video');
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = media[currentIndex];

  useEffect(() => {
    if (type === 'photo') {
      setLikes((currentMedia as Photo).likes);
    } else {
      setLikes((currentMedia as VideoClip).likes || 0);
    }
    setIsLiked(false);
  }, [currentIndex, currentMedia, type]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < media.length - 1) {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && type === 'video') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, media.length, onClose, type]);

  // Auto-hide controls for video
  useEffect(() => {
    if (type === 'video' && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying, type]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (type === 'video') {
        setIsPlaying(true);
      }
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (type === 'video') {
        setIsPlaying(true);
      }
    }
  };

  const toggleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(likes + 1);
      toast.success('Liked! ❤️', { duration: 1500 });
    } else {
      setIsLiked(false);
      setLikes(likes - 1);
    }
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard! 🔗', {
      description: 'Share this amazing moment with friends',
      duration: 2000,
    });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Auto-play video when opened or index changes
  useEffect(() => {
    if (type === 'video' && videoRef.current) {
      if (isPlaying) {
        // Try to play unmuted first
        videoRef.current.play().catch(() => {
          // If blocked, try muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {
              // Still blocked, give up but don't crash
              setIsPlaying(false);
            });
          }
        });
      }
    }
  }, [currentIndex, type, isPlaying]);

  const toggleFullscreen = async () => {
    if (!fullscreenAvailable) return;
    
    try {
      const container = document.documentElement;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (error) {
      // Silently fail - fullscreen might be blocked by browser policy
      console.log('Fullscreen not available');
    }
  };

  // Check if fullscreen is available
  useEffect(() => {
    setFullscreenAvailable(!!document.documentElement.requestFullscreen);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Top Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 transition-all duration-300 ${
          showControls || type === 'photo' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center group"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Media Info */}
            <div className="text-white">
              <p className="font-medium">
                {type === 'photo' 
                  ? (currentMedia as Photo).eventName 
                  : ((currentMedia as VideoClip).eventName || 'Highlight')}
              </p>
              <p className="text-white/70 text-sm">
                {currentIndex + 1} / {media.length}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isLiked
                  ? 'bg-pink-500 text-white scale-110'
                  : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              <span>{likes.toLocaleString()}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className={`absolute left-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center group ${
            showControls || type === 'photo' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {currentIndex < media.length - 1 && (
        <button
          onClick={goToNext}
          className={`absolute right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center group ${
            showControls || type === 'photo' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Media Content */}
      <div className="relative w-full h-full flex items-center justify-center p-20">
        {type === 'photo' ? (
          <div className="relative max-w-6xl max-h-full">
            <ImageWithFallback
              src={(currentMedia as Photo).url}
              alt="Full size"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              style={{ animation: 'zoomIn 0.3s ease-out' }}
            />
          </div>
        ) : (
          <div className="relative w-full max-w-6xl">
            {/* Real HTML5 Video Player */}
            <div className="relative w-full max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
              <video
                ref={videoRef}
                src={(currentMedia as VideoClip).videoUrl}
                className="w-full h-full object-contain"
                style={{ animation: 'zoomIn 0.3s ease-out' }}
                loop
                playsInline
                autoPlay
                onClick={togglePlayPause}
              />
            </div>
            
            {/* Video Controls Overlay */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl transition-all duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  )}
                </button>

                {/* Duration */}
                <span className="text-white text-sm">
                  {(currentMedia as VideoClip).duration}
                </span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Fullscreen */}
                {fullscreenAvailable && (
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all flex items-center justify-center"
                  >
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Center Play Button (when paused) */}
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <Play className="w-10 h-10 text-purple-600 fill-purple-600 ml-1" />
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div 
        className={`absolute bottom-6 left-0 right-0 z-20 transition-all duration-300 ${
          showControls || type === 'photo' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {media.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-4 ring-purple-500 scale-110'
                    : 'ring-2 ring-white/20 hover:ring-white/40 opacity-60 hover:opacity-100'
                }`}
              >
                <ImageWithFallback
                  src={type === 'photo' ? (item as Photo).url : (item as VideoClip).thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white/80" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}