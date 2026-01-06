import { X, Search, TrendingUp, Clock, MapPin, Calendar, Users, Music, Building2, User } from 'lucide-react';
import { useState } from 'react';
import luchyRanksAvatar from 'figma:asset/74606642c7f231741bf6c70f7f2129f3e732666c.png';
import bukiJenardAvatar from 'figma:asset/02485972c54a6bf7f7c04171917ba9e94f4cda51.png';

interface PremiumSearchModalProps {
  onClose: () => void;
  events: any[];
  onEventSelect: (event: any) => void;
  onPersonSelect?: (person: any) => void;
}

export function PremiumSearchModal({ onClose, events, onEventSelect, onPersonSelect }: PremiumSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'events' | 'venues' | 'people'>('all');

  // Mock recent searches
  const recentSearches = [
    'Summer Music Festival',
    'Jazz Night',
    'Business Networking',
  ];

  // Mock trending searches
  const trendingSearches = [
    { query: 'Concerts', icon: '🎵', count: '2.3k' },
    { query: 'Club Nights', icon: '🎉', count: '1.8k' },
    { query: 'Workshops', icon: '📚', count: '1.2k' },
    { query: 'Food Festivals', icon: '🍕', count: '956' },
  ];

  // Mock venue suggestions
  const venues = [
    { name: 'Mlimani City', type: 'Mall', location: 'Dar es Salaam', icon: '🏢' },
    { name: 'Hyatt Regency', type: 'Hotel', location: 'Dar es Salaam', icon: '🏨' },
    { name: 'The Slow Leopard', type: 'Lounge', location: 'Dar es Salaam', icon: '🍸' },
    { name: 'Level 8', type: 'Club', location: 'Dar es Salaam', icon: '🎊' },
  ];

  // Mock people suggestions with real names
  const people = [
    { 
      name: 'Brian George', 
      type: 'Organizer', 
      followers: '18.5k', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      location: 'Dar es Salaam',
    },
    { 
      name: 'Buki Jenard', 
      type: 'Attendee', 
      followers: '2.8k', 
      avatar: bukiJenardAvatar,
      verified: false,
      location: 'Dar es Salaam',
      aliases: ['Luchy Ranks'], // Alternative names
    },
    { 
      name: 'Luchy Ranks', 
      type: 'Attendee', 
      followers: '2.8k', 
      avatar: luchyRanksAvatar,
      verified: false,
      location: 'Dar es Salaam',
      aliases: ['Buki Jenard'], // Alternative names
    },
    { 
      name: 'Sarah Johnson', 
      type: 'Organizer', 
      followers: '12.5k', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      location: 'Atlanta',
    },
    { 
      name: 'Michael Chen', 
      type: 'Performer', 
      followers: '24.3k', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      verified: true,
      location: 'New York',
    },
    { 
      name: 'Emma Williams', 
      type: 'Organizer', 
      followers: '8.2k', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      verified: false,
      location: 'Zanzibar',
    },
    { 
      name: 'David Martinez', 
      type: 'Attendee', 
      followers: '3.1k', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      verified: false,
      location: 'Atlanta',
    },
    { 
      name: 'Amani Hassan', 
      type: 'Performer', 
      followers: '15.7k', 
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      verified: true,
      location: 'Dar es Salaam',
    },
  ];

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  // Filter people based on search query
  const filteredPeople = people.filter(person => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = person.name.toLowerCase().includes(searchLower);
    const typeMatch = person.type.toLowerCase().includes(searchLower);
    const locationMatch = person.location.toLowerCase().includes(searchLower);
    const aliasMatch = person.aliases?.some(alias => alias.toLowerCase().includes(searchLower)) || false;
    
    return nameMatch || typeMatch || locationMatch || aliasMatch;
  }).slice(0, 5);

  const categories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'venues', name: 'Venues', icon: '📍' },
    { id: 'people', name: 'People', icon: '👥' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search Bar */}
        <div className="sticky top-0 z-10 bg-[#8A2BE2] px-6 py-6 shadow-lg">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues, clubs, bars, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchCategory(cat.id as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                  searchCategory === cat.id
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-w-4xl mx-auto">
          {searchQuery === '' ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h3 className="text-gray-900">Recent Searches</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-900">Trending Now</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(trend.query)}
                      className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:shadow-md transition-all border border-purple-100"
                    >
                      <span className="text-2xl">{trend.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-gray-900">{trend.query}</p>
                        <p className="text-purple-600 text-xs">{trend.count} searches</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Venues */}
              {(searchCategory === 'all' || searchCategory === 'venues') && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-gray-900">Popular Venues</h3>
                  </div>
                  <div className="space-y-3">
                    {venues.map((venue, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(venue.name)}
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-2xl">
                          {venue.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-900">{venue.name}</p>
                          <p className="text-gray-500 text-sm">{venue.type} • {venue.location}</p>
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested People/Organizers */}
              {(searchCategory === 'all' || searchCategory === 'people') && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-pink-600" />
                    <h3 className="text-gray-900">Event Organizers</h3>
                  </div>
                  <div className="space-y-3">
                    {filteredPeople.map((person, index) => (
                      <button
                        key={index}
                        onClick={() => onPersonSelect && onPersonSelect(person)}
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
                          <img 
                            src={person.avatar} 
                            alt={person.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-900">{person.name}</p>
                          <p className="text-gray-500 text-sm">{person.type} • {person.followers} followers</p>
                        </div>
                        <User className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Search Results - People */}
              {filteredPeople.length > 0 && (searchCategory === 'all' || searchCategory === 'people') && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">People</h3>
                    <p className="text-gray-500 text-sm">{filteredPeople.length} found</p>
                  </div>
                  <div className="space-y-3">
                    {filteredPeople.map((person, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onPersonSelect && onPersonSelect(person);
                          onClose();
                        }}
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={person.avatar} 
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900">{person.name}</p>
                            {person.verified && (
                              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">{person.type} • {person.location} • {person.followers} followers</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results - Events */}
              {filteredEvents.length > 0 && (searchCategory === 'all' || searchCategory === 'events') ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Events</h3>
                    <p className="text-gray-500 text-sm">{filteredEvents.length} found</p>
                  </div>
                  <div className="space-y-3">
                    {filteredEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => {
                          onEventSelect(event);
                          onClose();
                        }}
                        className="w-full flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left"
                      >
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{event.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.date.split(',')[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                              {event.category}
                            </span>
                            <span className="text-purple-600 text-sm">{event.price}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {filteredPeople.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500 text-sm">Try searching for something else</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}