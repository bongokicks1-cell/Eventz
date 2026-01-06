import { 
  Users, 
  Calendar, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Video, 
  Ticket, 
  Radio,
  Play,
  BarChart3,
  Clock,
  MapPin,
  Star,
  PlusCircle,
  Settings,
  Share2,
  Download,
  Building2,
  Heart,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
  Send
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import organizerProfileImg from 'figma:asset/f341912f973a7295b54e9b5936a0020cb0975622.png';
import { useState, useEffect } from 'react';
import { EventAnalyticsModal } from './EventAnalyticsModal';
import { HighlightViewerModal } from './HighlightViewerModal';
import { OrganizerSettingsModal } from './OrganizerSettingsModal';

interface OrganizerDashboardProps {
  onCreateEvent: () => void;
  onEditEvent?: (event: any) => void;
}

export function OrganizerDashboard({ onCreateEvent, onEditEvent }: OrganizerDashboardProps) {
  const organizerProfile = JSON.parse(localStorage.getItem('eventz-organizer-profile') || '{}');
  const [publishedEvents, setPublishedEvents] = useState<any[]>([]);
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] = useState<any>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load published events from localStorage
  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('eventz-published-events') || '[]');
    setPublishedEvents(events);
  }, []);

  // Helper function to format numbers with k notation
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Mock data - in real app this would come from backend
  const stats = {
    totalEvents: publishedEvents.length,
    followers: 3847,
    totalViews: publishedEvents.reduce((sum, e) => sum + (e.views || 0), 0),
    revenue: 0,
    liveStreams: 0,
    ticketsSold: 0,
  };

  const recentEvents = [
    // Empty for new organizers
  ];

  // Mock highlights/posts data
  const highlights = [
    {
      id: 1,
      type: 'event',
      mediaType: 'image' as 'image' | 'video',
      title: 'Harmonize Live in Concert',
      description: 'Amazing turnout with over 5,000 attendees! Thank you to everyone who joined us. The energy was incredible!',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      likes: 342,
      comments: 28,
      shares: 15,
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: 2,
      type: 'stream',
      mediaType: 'video' as 'image' | 'video',
      title: 'Live Stream Highlights',
      description: 'Peak viewers: 2.5k | Stream duration: 3h 45m | HD Quality maintained throughout',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      likes: 189,
      comments: 12,
      shares: 8,
      timestamp: '1 day ago',
      isLiked: false
    },
    {
      id: 3,
      type: 'announcement',
      mediaType: 'image' as 'image' | 'video',
      title: 'New Event Coming Soon',
      description: 'Get ready for our biggest event yet! Early bird tickets available from next week.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      likes: 256,
      comments: 34,
      shares: 22,
      timestamp: '3 days ago',
      isLiked: false
    },
    {
      id: 4,
      type: 'behind-the-scenes',
      mediaType: 'video' as 'image' | 'video',
      title: 'Behind the Scenes',
      description: 'Check out what goes into making an amazing show! Setup, soundcheck, and more.',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      likes: 421,
      comments: 56,
      shares: 31,
      timestamp: '5 days ago',
      isLiked: false
    },
    {
      id: 5,
      type: 'recap',
      mediaType: 'image' as 'image' | 'video',
      title: 'Last Night Was Epic!',
      description: 'Thank you to everyone who came out! Here are some of the best moments.',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
      likes: 512,
      comments: 67,
      shares: 43,
      timestamp: '1 week ago',
      isLiked: false
    },
    {
      id: 6,
      type: 'teaser',
      mediaType: 'video' as 'image' | 'video',
      title: 'Event Teaser - Coming Soon',
      description: 'Something big is coming... Stay tuned for the official announcement!',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      likes: 678,
      comments: 89,
      shares: 54,
      timestamp: '2 weeks ago',
      isLiked: false
    }
  ];

  const handleShare = (highlight: typeof highlights[0]) => {
    toast.success('Share link copied!', {
      description: `"${highlight.title}" is ready to share`
    });
  };

  const handleLike = (highlightId: number) => {
    const updatedHighlights = highlights.map(highlight => {
      if (highlight.id === highlightId) {
        return {
          ...highlight,
          isLiked: !highlight.isLiked,
          likes: highlight.isLiked ? highlight.likes - 1 : highlight.likes + 1
        };
      }
      return highlight;
    });
    setSelectedHighlight(updatedHighlights.find(h => h.id === highlightId));
    toast.success('Liked!');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Settings Button - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 bg-white shadow-lg text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 flex-shrink-0"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm whitespace-nowrap hidden xs:inline">Settings</span>
        </button>
      </div>

      {/* Professional Header - Solid Purple */}
      <div className="bg-[#8A2BE2] px-6 py-12 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden relative">
                <img 
                  src={organizerProfileImg}
                  alt="Organizer Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Organizer Dashboard</p>
                <h1 className="text-white text-2xl mb-1">{organizerProfile.organizerName}</h1>
                <p className="text-white/80 text-sm mb-1">{organizerProfile.organizerType}</p>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{organizerProfile.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Premium Go Live Button - Optimized for iPhone 16 (392x852) */}
              <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-xl hover:shadow-red-500/30 transition-all group relative overflow-hidden min-w-[110px] flex-shrink-0">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <div className="relative flex items-center gap-1.5 justify-center w-full">
                  <div className="relative flex-shrink-0">
                    <Radio className="w-4 h-4" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">Go Live</span>
                </div>
              </button>
            </div>
          </div>

          {/* Combined Stats Card - Professional Minimal Layout */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-7 h-7 text-[#8A2BE2]" />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Followers</p>
                  <p className="text-gray-900 text-2xl">{formatNumber(stats.followers)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Events</p>
                  <p className="text-gray-900 text-2xl">{stats.totalEvents}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Views</p>
                  <p className="text-gray-900 text-2xl">{formatNumber(stats.totalViews)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome Section - Professional */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-[#8A2BE2]" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 text-xl mb-2">Welcome to EVENTZ Organizers</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                You're all set to create amazing events and reach thousands of people with HD live streaming. 
                Start by creating your first event and watch your audience grow.
              </p>
              <button
                onClick={onCreateEvent}
                className="bg-[#8A2BE2] text-white px-6 py-2.5 rounded-lg hover:bg-[#7825d4] transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Your First Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlights/Posts Section */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-900 text-xl">Event Highlights & Posts</h2>
              <button className="text-[#8A2BE2] hover:text-[#7825d4] text-sm flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
          
          {/* Grid Gallery - Instagram Style */}
          <div className="grid grid-cols-3 gap-2">
            {highlights.map(highlight => (
              <div 
                key={highlight.id} 
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
                onClick={() => setSelectedHighlight(highlight)}
              >
                {/* Image */}
                <ImageWithFallback
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Video Play Icon - Always Visible for Videos */}
                {highlight.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-[#8A2BE2] ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
                
                {/* Gradient Overlay - Appears on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Share Button - Appears on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(highlight);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <Share2 className="w-4 h-4 text-[#8A2BE2]" />
                </button>
                
                {/* Content Overlay - Appears on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white mb-2 line-clamp-2 leading-snug">{highlight.title}</h3>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{highlight.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{highlight.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">{highlight.shares}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-gray-900 text-xl">Analytics Overview</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">+0%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-gray-900 text-2xl">TSh 0</p>
            </div>

            {/* Tickets Sold */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-[#8A2BE2]" />
                </div>
                <span className="text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded-full">+0%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Tickets Sold</p>
              <p className="text-gray-900 text-2xl">{stats.ticketsSold}</p>
            </div>

            {/* Live Streams */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Radio className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">+0%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Live Streams</p>
              <p className="text-gray-900 text-2xl">{stats.liveStreams}</p>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-cyan-600 text-xs bg-cyan-50 px-2 py-1 rounded-full">+0%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Views</p>
              <p className="text-gray-900 text-2xl">{formatNumber(stats.totalViews)}</p>
            </div>
          </div>
        </div>

        {/* HD Streaming Performance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-gray-900 text-xl">HD Streaming Performance</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#8A2BE2] rounded-lg flex items-center justify-center">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Stream Quality</p>
                  <p className="text-gray-900 text-xl">HD 1080p</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#8A2BE2] w-0 transition-all"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-cyan-600 rounded-lg flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Peak Viewers</p>
                  <p className="text-gray-900 text-xl">0</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Concurrent: 0 viewers</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Stream Time</p>
                  <p className="text-gray-900 text-xl">0h 0m</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Last 30 days</p>
            </div>
          </div>
        </div>

        {/* Your Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-gray-900 text-xl">Your Events</h2>
            <button
              onClick={onCreateEvent}
              className="text-[#8A2BE2] hover:text-[#7825d4] flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>

          {publishedEvents.length === 0 ? (
            <div className="bg-white rounded-lg p-16 border border-gray-200 text-center shadow-sm">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-[#8A2BE2]" />
              </div>
              <h3 className="text-gray-900 text-xl mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start creating amazing events with HD live streaming and reach thousands of people worldwide.
              </p>
              <button
                onClick={onCreateEvent}
                className="bg-[#8A2BE2] text-white px-8 py-3.5 rounded-lg hover:bg-[#7825d4] transition-all inline-flex items-center gap-2.5 mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Your First Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {publishedEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all group">
                  {/* Event Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                    {event.coverImage ? (
                      <img 
                        src={event.coverImage} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                        <span className="text-white text-xs">{event.category}</span>
                      </div>
                    </div>
                    
                    {/* Actions Menu */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => {
                          toast.success('Event link copied! 📋');
                        }}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 flex items-center justify-center transition-all"
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 flex items-center justify-center transition-all">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl mb-1 line-clamp-1">{event.title || 'Untitled Event'}</h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date || 'TBD'}</span>
                        </div>
                        {event.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Stats */}
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="w-4 h-4 text-cyan-600" />
                          <p className="text-gray-900">{event.views || 0}</p>
                        </div>
                        <p className="text-gray-500 text-xs">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-purple-600" />
                          <p className="text-gray-900">{event.interested || 0}</p>
                        </div>
                        <p className="text-gray-500 text-xs">Interested</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Share2 className="w-4 h-4 text-pink-600" />
                          <p className="text-gray-900">{event.shares || 0}</p>
                        </div>
                        <p className="text-gray-500 text-xs">Shares</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (onEditEvent) {
                            onEditEvent(event);
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => setSelectedEventForAnalytics(event)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#8A2BE2] text-white hover:bg-[#7825d4] transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Growth Tips */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#8A2BE2]" />
            </div>
            <div>
              <h3 className="text-gray-900 text-lg mb-3">Tips to Grow Your Audience</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#8A2BE2] mt-1">•</span>
                  <span>Enable HD live streaming to attract more viewers and boost engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8A2BE2] mt-1">•</span>
                  <span>Share your events on social media to reach a wider audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8A2BE2] mt-1">•</span>
                  <span>Offer early bird tickets and exclusive perks to build anticipation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8A2BE2] mt-1">•</span>
                  <span>Engage with your followers through live chat and reactions during streams</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Event Analytics Modal */}
      {selectedEventForAnalytics && (
        <EventAnalyticsModal
          event={selectedEventForAnalytics}
          onClose={() => setSelectedEventForAnalytics(null)}
        />
      )}

      {/* Highlight Viewer Modal */}
      {selectedHighlight && (
        <HighlightViewerModal
          highlight={selectedHighlight}
          onClose={() => setSelectedHighlight(null)}
          onLike={handleLike}
          onShare={handleShare}
        />
      )}

      {/* Organizer Settings Modal */}
      {showSettings && (
        <OrganizerSettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}