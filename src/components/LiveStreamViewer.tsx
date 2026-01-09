import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Lock, Users, Heart, MessageCircle, Send, Volume2, VolumeX, Maximize, MoreVertical, Share2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ShareModal } from './ShareModal';
import { handleShare as shareUtil } from '../utils/share';

interface LiveStreamViewerProps {
  stream: {
    id: number;
    title: string;
    thumbnail: string;
    viewers: number;
    host: string;
    quality: 'HD' | '4K';
    isPaid?: boolean;
    price?: number;
  };
  onClose: () => void;
  isUnlockedOverride?: boolean;
}

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
}

export function LiveStreamViewer({ stream, onClose, isUnlockedOverride }: LiveStreamViewerProps) {
  const [isUnlocked, setIsUnlocked] = useState(!stream.isPaid || isUnlockedOverride);
  const [isMuted, setIsMuted] = useState(true);
  const [showChat, setShowChat] = useState(false); // Start with chat hidden
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: 'Sarah K.', message: 'This is amazing! 🔥', timestamp: new Date() },
    { id: 2, user: 'Mike T.', message: 'Great quality stream!', timestamp: new Date() },
    { id: 3, user: 'Lisa M.', message: 'Love the energy! ❤️', timestamp: new Date() },
  ]);
  const [reactions, setReactions] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Play video when unlocked
  useEffect(() => {
    if (isUnlocked && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay prevented:', err));
    }
  }, [isUnlocked]);

  // Update video mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Simulate new messages coming in (only when unlocked)
  useEffect(() => {
    if (!isUnlocked) return;
    
    const interval = setInterval(() => {
      const newMessage: ChatMessage = {
        id: Date.now(),
        user: `User${Math.floor(Math.random() * 1000)}`,
        message: ['Amazing! 🎉', 'Great stream!', 'Love this! ❤️', '🔥🔥🔥'][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(-20), newMessage]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    toast.success('Stream unlocked! Enjoy the show 🎉');
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !isUnlocked) return;
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      user: 'You',
      message: chatMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const addReaction = () => {
    if (!isUnlocked) return;
    setReactions(prev => prev + 1);
    setTimeout(() => setReactions(prev => Math.max(0, prev - 1)), 2000);
  };

  const handleShare = async () => {
    const shared = await shareUtil({
      title: stream.title,
      text: `Watch ${stream.title} live on EVENTZ!\nViewing now: ${stream.viewers} people`,
      url: window.location.href,
    });
    
    // If native share not available, show custom modal
    if (!shared) {
      setShowShareModal(true);
    }
  };

  // Get appropriate video URL based on stream content
  const getVideoUrl = () => {
    // Use different videos for different stream types
    const videoUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ];
    // Pick based on stream id for consistency
    return videoUrls[stream.id % videoUrls.length];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm">
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Video Player Container - iPhone 16 Pro Max optimized */}
        <div className="flex-1 flex items-start justify-center relative pt-14">
          <div className="w-full h-full relative bg-black">
            {/* Real Video Player (when unlocked) */}
            {isUnlocked ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                loop
                playsInline
                muted={isMuted}
              >
                <source src={getVideoUrl()} type="video/mp4" />
              </video>
            ) : (
              <>
                {/* Blurred Thumbnail (when locked) */}
                <ImageWithFallback
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-full object-cover blur-xl scale-110 transition-all duration-500"
                />
                {/* Dimmed overlay for locked state */}
                <div className="absolute inset-0 bg-black/60"></div>
              </>
            )}

            {/* Top overlay - Live indicator, viewers, quality */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {/* LIVE Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-white text-sm tracking-wide">LIVE</span>
                </div>

                {/* FREE Badge */}
                {!stream.isPaid && (
                  <div className="px-3 py-1.5 rounded-full bg-green-500 shadow-lg">
                    <span className="text-white text-sm">FREE</span>
                  </div>
                )}

                {/* Viewers count */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{stream.viewers.toLocaleString()}</span>
                </div>
              </div>

              {/* Quality Badge */}
              <div className="px-3 py-1.5 rounded-full bg-purple-600 shadow-lg">
                <span className="text-white text-sm">{stream.quality}</span>
              </div>
            </div>

            {/* Locked State - Center */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  {/* Lock Icon */}
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Lock className="w-10 h-10 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="text-white text-2xl mb-2">Unlock to watch live</h3>
                  <p className="text-white/80 text-sm mb-6">Get instant access to this live stream</p>

                  {/* Unlock Button */}
                  <button
                    onClick={handleUnlock}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Unlock Stream – TZS {stream.price?.toLocaleString()}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom overlay - Title, Host, Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
              <div className="flex items-end justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-white text-xl mb-1 line-clamp-1">{stream.title}</h2>
                  <p className="text-white/80 text-sm">{stream.host}</p>
                </div>

                {/* Video Controls */}
                {isUnlocked && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors">
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Reactions */}
            {reactions > 0 && (
              <div className="absolute right-4 bottom-24 flex flex-col-reverse gap-2">
                {[...Array(Math.min(reactions, 5))].map((_, i) => (
                  <div
                    key={i}
                    className="animate-float-up"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Panel - Right Side */}
          {showChat && isUnlocked && (
            <div className="absolute right-8 top-0 bottom-0 w-80 bg-white rounded-2xl shadow-2xl flex flex-col">
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="text-gray-900">Live Chat</h3>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="text-purple-600">{msg.user}</span>
                    <span className="text-gray-900 ml-2">{msg.message}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={addReaction}
                    className="px-4 py-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-pink-500" />
                  </button>
                  <span className="text-gray-500 text-xs">Send reactions</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Say something..."
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatMessage.trim()}
                    className="w-10 h-10 rounded-full bg-purple-600 disabled:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Toggle (when hidden) */}
          {!showChat && isUnlocked && (
            <button
              onClick={() => setShowChat(true)}
              className="absolute right-8 bottom-8 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-2xl transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Locked Chat Indicator */}
          {!isUnlocked && (
            <div className="absolute right-8 bottom-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">Chat locked</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={stream.title}
        text={`Watch ${stream.title} live on EVENTZ!\nViewing now: ${stream.viewers} people`}
        url={window.location.href}
      />
    </div>
  );
}