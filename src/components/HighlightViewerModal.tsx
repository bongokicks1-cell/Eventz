import { X, Heart, MessageCircle, Share2, Send, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
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
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const mockComments = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      comment: 'This was amazing! Can\'t wait for the next one! 🔥',
      timestamp: '1 hour ago'
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      comment: 'Best event ever! The energy was incredible 🎉',
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      user: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?img=3',
      comment: 'Loved every moment of this! When is the next show?',
      timestamp: '3 hours ago'
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike(highlight.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      toast.success('Comment posted!');
      setCommentText('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Media */}
        <div className="md:w-3/5 bg-black relative flex items-center justify-center">
          {highlight.mediaType === 'video' ? (
            <video
              src={highlight.video}
              controls
              autoPlay
              className="w-full h-full object-contain"
              playsInline
            />
          ) : (
            <ImageWithFallback
              src={highlight.image}
              alt={highlight.title}
              className="w-full h-full object-contain"
            />
          )}
          
          {/* Close Button - Top Left */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Right Side - Details & Comments */}
        <div className="md:w-2/5 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 text-xl mb-2 line-clamp-2">{highlight.title}</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{highlight.timestamp}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed">{highlight.description}</p>
          </div>

          {/* Stats & Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? 'text-[#FF3CAC]' : 'text-gray-600 hover:text-[#FF3CAC]'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-[#FF3CAC]' : ''}`} />
                  <span className="font-medium">{likes}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-medium">{highlight.comments}</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  const shared = await handleShare({
                    title: highlight.title,
                    text: 'Check out this amazing highlight on EVENTZ!',
                    url: window.location.href,
                  });
                  
                  // If native share not available, show custom modal
                  if (!shared) {
                    setShowShareModal(true);
                  } else {
                    onShare(highlight);
                  }
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-[#8A2BE2] transition-colors"
              >
                <Share2 className="w-6 h-6" />
                <span className="font-medium">{highlight.shares}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-gray-900 mb-4">Comments</h3>
            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                      <p className="text-gray-900 text-sm mb-1">{comment.user}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.comment}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-1 ml-4">{comment.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent outline-none text-gray-900 text-sm"
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#FF3CAC] text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
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
