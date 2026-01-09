import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Users, Eye, Radio } from 'lucide-react';
import { PWAPullToRefresh } from './PWAPullToRefresh';
import { PWALiveStreamSkeleton } from './PWASkeletonLoader';

interface LiveStream {
  id: number;
  title: string;
  thumbnail: string;
  streamer: string;
  viewers: number;
  category: string;
  isLive: boolean;
}

const mockStreams: LiveStream[] = [
  {
    id: 1,
    title: 'Afrobeats Concert - Live from Dar es Salaam',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    streamer: 'Jazz Events TZ',
    viewers: 12453,
    category: 'Music',
    isLive: true,
  },
  {
    id: 2,
    title: 'Underground Hip Hop Session',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    streamer: 'Urban Vibes',
    viewers: 8921,
    category: 'Hip Hop',
    isLive: true,
  },
  {
    id: 3,
    title: 'Bongo Flava Night',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    streamer: 'Dar Live Events',
    viewers: 15632,
    category: 'Bongo',
    isLive: true,
  },
];

interface PWALiveScreenProps {
  onStreamClick: (streamId: number) => void;
}

export function PWALiveScreen({ onStreamClick }: PWALiveScreenProps) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setStreams(mockStreams);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStreams([...mockStreams]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Live Now</h1>
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                <Radio className="w-3 h-3" />
                LIVE
              </div>
            </div>
            <p className="text-sm text-gray-500">{streams.length} streams happening now</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {streams.reduce((acc, s) => acc + s.viewers, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Live Streams */}
      <div className="flex-1 overflow-hidden">
        <PWAPullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 py-4 space-y-4">
            {isLoading ? (
              <>
                {[1, 2, 3].map(i => (
                  <PWALiveStreamSkeleton key={i} />
                ))}
              </>
            ) : (
              streams.map((stream, index) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LiveStreamCard stream={stream} onClick={() => onStreamClick(stream.id)} />
                </motion.div>
              ))
            )}
          </div>
        </PWAPullToRefresh>
      </div>
    </div>
  );
}

function LiveStreamCard({ stream, onClick }: { stream: LiveStream; onClick: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Live Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          LIVE
        </div>

        {/* Viewers Count */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          {stream.viewers.toLocaleString()}
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Streamer Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {stream.streamer.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {stream.title}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{stream.streamer}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{stream.category}</span>
              <span className="text-xs text-gray-300">•</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                {stream.viewers.toLocaleString()} watching
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
