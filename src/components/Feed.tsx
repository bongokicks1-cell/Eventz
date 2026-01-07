import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Clock, MapPin, Ticket, Search, Bell, X, Send, Eye, ArrowLeft, Calendar, Sparkles, TrendingUp, Users as UsersIcon, Star, ArrowUpRight, LayoutGrid, UserPlus, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

interface Post {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    isOrganizer?: boolean;
  };
  event?: {
    id: number;
    name: string;
    date: string;
    time?: string;
    location: string;
    image: string;
    price?: string;
  };
  content: {
    text?: string;
    image?: string;
    hashtags?: string[];
  };
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  views?: number;
  isLiked: boolean;
  isSaved: boolean;
  recommended?: boolean;
}

interface Notification {
  id: number;
  type: 'reminder' | 'update' | 'follower';
  title: string;
  message: string;
  time: string;
  image?: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'follower',
    title: 'New Follower',
    message: 'Sarah Mitchell started following you',
    time: '10 minutes ago',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Event Reminder',
    message: 'Jazz Night Downtown starts in 2 hours. Don\'t forget!',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=100&h=100&fit=crop',
    read: false,
  },
  {
    id: 3,
    type: 'follower',
    title: 'New Follower',
    message: 'Marcus Rodriguez started following you',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    read: false,
  },
  {
    id: 4,
    type: 'update',
    title: 'Event Update',
    message: 'Summer Music Festival: New artist lineup announcement!',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=100&h=100&fit=crop',
    read: true,
  },
  {
    id: 5,
    type: 'follower',
    title: 'New Follower',
    message: 'DJ Alex Thompson started following you',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    read: true,
  },
];

const mockPosts: Post[] = [
  {
    id: 1,
    user: {
      name: 'Alice Johnson',
      username: '@alicejohnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      isOrganizer: false,
    },
    content: {
      text: 'Excited to attend my first Summer Music Festival at the National Stadium! The lineup looks incredible. You have to hear it yourself when #eventslive',
      image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=800&h=600&fit=crop',
      hashtags: ['#eventslive'],
    },
    timestamp: '2h',
    likes: 142,
    comments: [],
    shares: 8,
    isLiked: false,
    isSaved: false,
    recommended: true,
  },
  {
    id: 2,
    user: {
      name: 'Aarya Desai',
      username: '@aryadesai',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      verified: false,
    },
    content: {
      text: 'Spent a beautiful afternoon at The Contemporary Home exhibit. The pastel trend is real and it\'s gorgeous! ✨ #ArtExhibit #HomeDecor',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
      hashtags: ['#ArtExhibit', '#HomeDecor'],
    },
    timestamp: '5h',
    likes: 289,
    comments: [],
    shares: 15,
    isLiked: false,
    isSaved: false,
    recommended: false,
  },
  {
    id: 3,
    user: {
      name: 'Events Team',
      username: '@eventsteam',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      verified: true,
      isOrganizer: true,
    },
    event: {
      id: 3,
      name: 'Summer Music Festival 2024',
      date: 'Feb 14, 2026',
      time: '6:00 PM - 11:00 PM',
      location: 'National Stadium, Dar es Salaam',
      image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=800&h=600&fit=crop',
      price: 'TZS 30,000',
    },
    content: {
      text: 'Can\'t wait for the Annual Tech Innovation Expo! Join us to see the hottest startups and you will love it. So many amazing companies are showcasing this year. Meet you there!',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      hashtags: ['#TechExpo', '#Innovation', '#Startups'],
    },
    timestamp: '8h',
    likes: 567,
    comments: [
      {
        id: 1,
        user: {
          name: 'Alex Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        },
        text: 'This looks absolutely amazing! Can\'t wait to grab my ticket. Are there still early bird tickets?',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        user: {
          name: 'Sarah Kim',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        },
        text: 'The last event was fantastic. I\'m totally booking for this one.',
        timestamp: '1 hour ago',
      },
    ],
    shares: 34,
    views: 2145,
    isLiked: true,
    isSaved: false,
    recommended: false,
  },
  {
    id: 4,
    user: {
      name: 'David Lee',
      username: '@davidlee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      verified: false,
    },
    content: {
      text: 'Sunday morning coffee ritual at my favorite spot. The perfect way to start the week ahead. #SundayVibes #CoffeeLover',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      hashtags: ['#SundayVibes', '#CoffeeLover'],
    },
    timestamp: '1d',
    likes: 234,
    comments: [],
    shares: 12,
    isLiked: false,
    isSaved: false,
    recommended: false,
  },
  {
    id: 5,
    user: {
      name: 'Sarah Chen',
      username: '@sarahchen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      verified: true,
    },
    content: {
      text: 'Great coffee shop visit with old friends! #eventslive',
      image: 'https://images.unsplash.com/photo-1501492673258-26e617140c02?w=800&h=600&fit=crop',
      hashtags: ['#eventslive'],
    },
    timestamp: '1d',
    likes: 178,
    comments: [],
    shares: 5,
    isLiked: false,
    isSaved: false,
    recommended: true,
  },
  {
    id: 6,
    user: {
      name: 'Buki Jenard',
      username: '@bukijenard',
      avatar: 'https://i.ibb.co/3GrDQfJ/B-Profile.jpg',
      verified: false,
    },
    content: {
      text: 'Best night ever at the Afrobeat concert! The energy was incredible 🔥 #LiveMusic #Afrobeat',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
      hashtags: ['#LiveMusic', '#Afrobeat'],
    },
    timestamp: '2d',
    likes: 445,
    comments: [],
    shares: 28,
    isLiked: true,
    isSaved: false,
    recommended: false,
  },
];

type FilterTab = 'all' | 'following' | 'organizers' | 'trending';

export function Feed() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [likeAnimation, setLikeAnimation] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 });
  const [lastTap, setLastTap] = useState<number>(0);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="w-5 h-5 text-cyan-500" />;
      case 'update':
        return <Bell className="w-5 h-5 text-purple-500" />;
      case 'follower':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const toggleLike = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Show thumbs up animation at click position
    if (e && !posts.find(p => p.id === postId)?.isLiked) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setLikeAnimation({
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      
      // Hide animation after 1 second
      setTimeout(() => {
        setLikeAnimation({ show: false, x: 0, y: 0 });
      }, 1000);
    }
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isLiked: !selectedPost.isLiked,
        likes: selectedPost.isLiked ? selectedPost.likes - 1 : selectedPost.likes + 1,
      });
    }
  };

  const toggleSave = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsSaved = !post.isSaved;
        if (newIsSaved) {
          toast.success('Saved for later! 📌');
        }
        return { ...post, isSaved: newIsSaved };
      }
      return post;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isSaved: !selectedPost.isSaved,
      });
    }
  };

  const sharePost = (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success('Link copied! Share with friends 🎉');
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setCommentText('');
  };

  const handleDoubleTap = (post: Post, e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected!
      e.stopPropagation();
      
      // Only like if not already liked
      if (!post.isLiked) {
        // Show animation at tap position
        setLikeAnimation({
          show: true,
          x: e.clientX,
          y: e.clientY,
        });
        
        // Hide animation after 1 second
        setTimeout(() => {
          setLikeAnimation({ show: false, x: 0, y: 0 });
        }, 1000);
        
        // Update the post to liked state
        setPosts(posts.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              isLiked: true,
              likes: p.likes + 1,
            };
          }
          return p;
        }));
      }
    } else {
      // Single tap - open post detail after a short delay
      const timer = setTimeout(() => {
        openPostDetail(post);
      }, 300);
      
      // Store timer to clear it if double tap happens
      (e.currentTarget as any).singleTapTimer = timer;
    }
    
    setLastTap(currentTime);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost) return;

    const newComment: Comment = {
      id: selectedPost.comments.length + 1,
      user: {
        name: 'George Mukulasi',
        avatar: 'https://i.ibb.co/3559hRDP/G-Profile.jpg',
      },
      text: commentText,
      timestamp: 'Just now',
    };

    setSelectedPost({
      ...selectedPost,
      comments: [...selectedPost.comments, newComment],
    });

    setPosts(posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    }));

    setCommentText('');
    toast.success('Comment posted!');
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'organizers') return post.user.isOrganizer;
    if (activeFilter === 'trending') return post.likes > 200;
    return true;
  });

  return (
    <>
      {/* Main Feed View */}
      <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 ${selectedPost ? 'hidden' : 'block'}`}>
        {/* Unique Header Design */}
        <div className="bg-white border-b border-gray-100">
          <div className="px-4 pt-5 pb-4">
            {/* Brand Section */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h1 className="text-gray-900 text-xl font-bold">Community</h1>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                  <Search className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Unique Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setActiveFilter('following')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeFilter === 'following'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                <UsersIcon className="w-4 h-4" />
                Following
              </button>
              <button
                onClick={() => setActiveFilter('organizers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeFilter === 'organizers'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                <Star className="w-4 h-4" />
                Organizers
              </button>
              <button
                onClick={() => setActiveFilter('trending')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeFilter === 'trending'
                    ? 'bg-[#8A2BE2] text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
            </div>
          </div>
        </div>

        {/* Unique Card-Based Posts */}
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer"
              onClick={(e) => handleDoubleTap(post, e)}
              style={{ animation: `slideUp 0.4s ease-out ${index * 0.08}s both` }}
            >
              {/* Unique Header with Actions on Right */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-900 text-sm font-semibold truncate">{post.user.name}</span>
                        {post.user.verified && (
                          <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                        )}
                        {post.user.isOrganizer && (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                            Organizer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-500 text-xs">{post.timestamp}</span>
                        {post.recommended && (
                          <span className="text-purple-600 text-xs">• Recommended</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Unique Action Buttons - Only Save on Right */}
                  <div className="flex items-center">
                    <button
                      onClick={(e) => toggleSave(post.id, e)}
                      className={`p-2 rounded-lg transition-all ${
                        post.isSaved 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                      title="Save"
                    >
                      <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-purple-600' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content/Text */}
              {post.content.text && (
                <div className="px-4 pb-3">
                  <p className="text-gray-800 text-[15px] leading-relaxed">
                    {post.content.text}
                  </p>
                </div>
              )}

              {/* Image - Rounded Inside Card */}
              {post.content.image && (
                <div className="px-4 pb-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={post.content.image}
                      alt="Post"
                      className="w-full aspect-[16/10] object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Engagement Bar - Revolutionary Purple Design */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 via-purple-100/50 to-purple-50 rounded-xl px-4 py-3 border border-purple-100">
                  <button
                    onClick={(e) => toggleLike(post.id, e)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      post.isLiked
                        ? 'bg-[#8A2BE2] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-[#8A2BE2]'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-white' : ''}`} />
                    <span className="text-sm font-semibold">{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 hover:bg-purple-50 hover:text-[#8A2BE2] rounded-lg transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.comments.length}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 hover:bg-purple-50 hover:text-[#8A2BE2] rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button>

                  <button
                    onClick={(e) => sharePost(post, e)}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Nothing here yet</h3>
              <p className="text-gray-600 text-center text-sm max-w-xs">
                Follow organizers and explore events to see updates
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Post Detail - Unique Bottom Sheet Style */}
      {selectedPost && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
          {/* Unique Detail Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-100">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={closePostDetail}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => sharePost(selectedPost, e)}
                    className="p-2.5 bg-gray-100 hover:bg-cyan-100 text-gray-700 hover:text-cyan-600 rounded-xl transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => toggleSave(selectedPost.id, e)}
                    className={`p-2.5 rounded-xl transition-all ${
                      selectedPost.isSaved
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-600'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${selectedPost.isSaved ? 'fill-white' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Hero Image with Gradient Overlay */}
            {selectedPost.content.image && (
              <div className="relative">
                <ImageWithFallback
                  src={selectedPost.content.image}
                  alt="Post detail"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            )}

            {/* User & Post Info */}
            <div className="p-5 space-y-4">
              {/* User Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.user.avatar}
                    alt={selectedPost.user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-purple-100"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-900 font-bold">{selectedPost.user.name}</span>
                      {selectedPost.user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{selectedPost.timestamp}</span>
                  </div>
                </div>
                {selectedPost.user.isOrganizer && (
                  <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-xl transition-all">
                    Follow
                  </button>
                )}
              </div>

              {/* Event Card - If Available */}
              {selectedPost.event && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg mb-2">{selectedPost.event.name}</h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{selectedPost.event.date}</span>
                          {selectedPost.event.time && <span className="text-gray-500">• {selectedPost.event.time}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span>{selectedPost.event.location}</span>
                        </div>
                      </div>
                    </div>
                    {selectedPost.event.price && (
                      <div className="bg-white px-4 py-2 rounded-xl border border-purple-200">
                        <div className="text-purple-600 font-bold text-sm">{selectedPost.event.price}</div>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    Get Tickets
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Post Description */}
              {selectedPost.content.text && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedPost.content.text}
                  </p>
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-bold text-sm">{selectedPost.likes}</div>
                    <div className="text-gray-500 text-xs">Reactions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-bold text-sm">{selectedPost.comments.length}</div>
                    <div className="text-gray-500 text-xs">Replies</div>
                  </div>
                </div>
                {selectedPost.views && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-sm">{selectedPost.views.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">Views</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => toggleLike(selectedPost.id, e)}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedPost.isLiked
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gradient-to-r from-gray-100 to-purple-50 text-gray-900 hover:from-purple-600 hover:to-pink-600 hover:text-white border border-gray-200'
                }`}
              >
                <Star className={`w-5 h-5 ${selectedPost.isLiked ? 'fill-white' : ''}`} />
                {selectedPost.isLiked ? 'Added to Favorites' : 'Add to Favorites'}
              </button>
            </div>

            {/* Comments Section */}
            <div className="px-5 pb-5">
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-gray-900 font-bold text-lg mb-4">
                  Replies ({selectedPost.comments.length})
                </h3>
                
                {/* Add Comment First */}
                <div className="mb-5">
                  <div className="flex gap-3 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-2xl p-4">
                    <img
                      src="https://i.ibb.co/3559hRDP/G-Profile.jpg"
                      alt="You"
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={3}
                        className="w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-500 outline-none border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 resize-none"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className={`mt-3 px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                          commentText.trim()
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedPost.comments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        No replies yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-gray-900 text-sm font-semibold">{comment.user.name}</span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowNotifications(false)}>
          <div className="absolute right-0 top-0 w-80 bg-white h-full shadow-lg overflow-y-auto">
            <div className="px-4 py-5 border-b border-gray-100">
              <h3 className="text-gray-900 text-lg font-bold">Notifications</h3>
            </div>
            <div className="px-4 py-5">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 mb-5">
                  {notification.image && (
                    <img
                      src={notification.image}
                      alt={notification.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-900 font-bold">{notification.title}</span>
                      {getIcon(notification.type)}
                    </div>
                    <p className="text-gray-500 text-sm">{notification.message}</p>
                    <span className="text-gray-400 text-xs">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional Thumbs Up Animation */}
      {likeAnimation.show && (
        <div
          className="fixed pointer-events-none z-[100]"
          style={{
            left: `${likeAnimation.x}px`,
            top: `${likeAnimation.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="animate-likePopup">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4 shadow-2xl">
              <ThumbsUp className="w-10 h-10 text-white fill-white" />
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes likePopup {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(0) rotate(-10deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) translateY(-20px) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-60px) rotate(0deg);
          }
        }
        .animate-likePopup {
          animation: likePopup 1s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
}