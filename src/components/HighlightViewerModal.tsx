import { X, Heart, Share2, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useRef } from 'react';
import { ShareModal } from './ShareModal';
import { handleShare } from '../utils/share';
import { toast } from 'sonner@2.0.3';

interface HighlightViewerModalProps {
  highlight: {
    id: number;
    type: string;
    mediaType: 'image' | 'video';
    title: string;
    description: string;
    image: string;
    video?: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    isLiked: boolean;
  };
  onClose: () => void;
  onLike: (id: number) => void;
  onShare: (highlight: any) => void;
}

export function HighlightViewerModal({ highlight, onClose, onLike, onShare }: HighlightViewerModalProps) {
  const [isLiked, setIsLiked] = useState(highlight.isLiked);
  const [likes, setLikes] = useState(highlight.likes);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike(highlight.id);
    
    // Heart animation feedback
    if (!isLiked) {
      toast.success('Added to favorites! ❤️', { duration: 2000 });
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShareClick = async () => {
    const shared = await handleShare({
      title: highlight.title,
      text: 'Check out this amazing highlight on EVENTZ!',
      url: window.location.href,
    });
    
    if (!shared) {
      setShowShareModal(true);
    } else {
      onShare(highlight);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Main Content - Full Screen */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Media Content */}
        {highlight.mediaType === 'video' ? (
          <video
            ref={videoRef}
            src={highlight.video}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlayPause}
          />
        ) : (
          <ImageWithFallback
            src={highlight.image}
            alt={highlight.title}
            className="w-full h-full object-contain"
          />
        )}

        {/* Top Bar - Clean minimal header */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="text-center">
              <p className="text-white text-sm font-medium">Highlight</p>
              <p className="text-white/70 text-xs">1 / 2</p>
            </div>

            <div className="w-10 h-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Center Controls - Video Only */}
        {highlight.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex items-center gap-6 pointer-events-auto">
              {/* Previous */}
              <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center transition-all shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-[#8A2BE2] fill-[#8A2BE2]" />
                ) : (
                  <Play className="w-7 h-7 text-[#8A2BE2] fill-[#8A2BE2] ml-1" />
                )}
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Next */}
              <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Right Side Actions - Minimal vertical stack */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-4 z-20">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors">
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked ? 'fill-[#FF3CAC] text-[#FF3CAC]' : 'text-white'
                }`}
              />
            </div>
            <span className="text-white text-xs font-medium">{likes}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShareClick}
            className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Info - Clean minimal */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="px-4 pb-6 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-white text-lg font-semibold mb-1 line-clamp-2">
              {highlight.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              {highlight.description}
            </p>
            <p className="text-white/60 text-xs mt-2">{highlight.timestamp}</p>
          </div>
        </div>

        {/* Bottom Thumbnails Preview */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-2 px-4">
          <div className="flex gap-2 justify-start overflow-x-auto scrollbar-hide">
            {/* Current highlight */}
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#8A2BE2] flex-shrink-0 shadow-lg">
              <ImageWithFallback
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Next highlight preview */}
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <ImageWithFallback
                src={highlight.image}
                alt="Next"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={highlight.title}
        text="Check out this amazing highlight on EVENTZ!"
        url={window.location.href}
      />
    </div>
  );
}