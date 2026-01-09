import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Users, TrendingUp, Filter, Search } from 'lucide-react';
import { PWAPullToRefresh } from './PWAPullToRefresh';
import { PWAEventCardSkeleton } from './PWASkeletonLoader';

interface Event {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  price: string;
  category: string;
  trending?: boolean;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Afrobeats Summer Festival 2026',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    date: 'Jan 15',
    time: '8:00 PM',
    location: 'Kariakoo Grounds, Dar',
    attendees: 2453,
    price: 'TZS 25,000',
    category: 'Music',
    trending: true,
  },
  {
    id: 2,
    title: 'Jazz Under The Stars',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
    date: 'Jan 18',
    time: '7:30 PM',
    location: 'Slipway, Msasani',
    attendees: 856,
    price: 'TZS 35,000',
    category: 'Jazz',
  },
  {
    id: 3,
    title: 'Amapiano Night Live',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Jan 20',
    time: '9:00 PM',
    location: 'Mwenge Club, Kinondoni',
    attendees: 1892,
    price: 'TZS 15,000',
    category: 'Club',
    trending: true,
  },
];

interface PWAEventsScreenProps {
  onEventClick: (eventId: number) => void;
}

export function PWAEventsScreen({ onEventClick }: PWAEventsScreenProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    loadInitialEvents();
  }, []);

  const loadInitialEvents = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEvents(mockEvents);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEvents([...mockEvents]);
  };

  const loadMoreEvents = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add more events (duplicated for demo)
    const moreEvents = mockEvents.map(e => ({ ...e, id: e.id + events.length }));
    setEvents([...events, ...moreEvents]);
    setIsLoadingMore(false);
    
    // Stop after 3 loads
    if (events.length > 15) {
      setHasMore(false);
    }
  };

  // Infinite scroll detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.8 && hasMore && !isLoadingMore) {
        loadMoreEvents();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, events.length]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
            <p className="text-sm text-gray-500">Events happening now</p>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Events List with Pull-to-Refresh */}
      <div ref={scrollContainerRef} className="flex-1 overflow-hidden">
        <PWAPullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 py-4 space-y-4">
            {isLoading ? (
              // Skeleton Loading
              <>
                {[1, 2, 3].map(i => (
                  <PWAEventCardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {/* Event Cards */}
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} onClick={() => onEventClick(event.id)} />
                  </motion.div>
                ))}

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="py-8">
                    <PWAEventCardSkeleton />
                  </div>
                )}

                {/* End of Results */}
                {!hasMore && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400">You've reached the end</p>
                  </div>
                )}
              </>
            )}
          </div>
        </PWAPullToRefresh>
      </div>
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Trending Badge */}
        {event.trending && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>

        {/* Meta Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{event.attendees.toLocaleString()} going</span>
            </div>
            <span className="text-sm font-semibold text-purple-600">
              {event.price}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-shadow">
          Get Tickets
        </button>
      </div>
    </motion.div>
  );
}
