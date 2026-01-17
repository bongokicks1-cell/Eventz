import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bell, Calendar, Ticket, UserPlus } from 'lucide-react';
import { PurchasedTicket } from '../App';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'reminder' | 'update' | 'ticket' | 'follower';
  title: string;
  message: string;
  time: string;
  image?: string;
  read: boolean;
  ticketData?: {
    ticketNumber: string;
    barcode: string;
    eventTitle: string;
  };
}

const notifications: Notification[] = [
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
  {
    id: 6,
    type: 'reminder',
    title: 'Ticket Reminder',
    message: 'Only 3 days left to get tickets for Beach House Party',
    time: '3 days ago',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=100&h=100&fit=crop',
    read: true,
  },
];

interface NotificationsProps {
  purchasedTickets: PurchasedTicket[];
}

export function Notifications({ purchasedTickets }: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'follower' | 'reminder' | 'update'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="w-5 h-5 text-[#06D6FF]" />;
      case 'update':
        return <Bell className="w-5 h-5 text-[#9D4EDD]" />;
      case 'ticket':
        return <Ticket className="w-5 h-5 text-[#06D6FF]" />;
      case 'follower':
        return <UserPlus className="w-5 h-5 text-[#10B981]" />;
      default:
        return <Bell className="w-5 h-5 text-[#6C6C70]" />;
    }
  };

  // Convert purchased tickets to notifications
  const ticketNotifications: Notification[] = purchasedTickets.map((ticket) => ({
    id: parseInt(ticket.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000),
    type: 'ticket' as const,
    title: 'Virtual Ticket Purchased ✅',
    message: `Your virtual ticket for ${ticket.eventTitle} has been confirmed!`,
    time: new Date(ticket.purchaseDate).toLocaleString(),
    read: false,
    ticketData: {
      ticketNumber: ticket.ticketNumber,
      barcode: ticket.barcode,
      eventTitle: ticket.eventTitle,
    },
  }));

  // Combine all notifications
  const allNotifications = [...ticketNotifications, ...notifications].sort((a, b) => b.id - a.id);

  // Filter notifications based on active filter
  const filteredNotifications = allNotifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  // Get filter-specific empty state
  const getEmptyState = () => {
    switch (activeFilter) {
      case 'follower':
        return {
          icon: <UserPlus className="w-16 h-16 text-[#6C6C70] mx-auto mb-4" />,
          title: 'No follower notifications',
          message: 'When someone follows you, you\'ll see it here',
        };
      case 'reminder':
        return {
          icon: <Calendar className="w-16 h-16 text-[#6C6C70] mx-auto mb-4" />,
          title: 'No reminders',
          message: 'Event reminders will appear here',
        };
      case 'update':
        return {
          icon: <Bell className="w-16 h-16 text-[#6C6C70] mx-auto mb-4" />,
          title: 'No updates',
          message: 'Event updates will appear here',
        };
      default:
        return {
          icon: <Bell className="w-16 h-16 text-[#6C6C70] mx-auto mb-4" />,
          title: 'No notifications yet',
          message: 'We\'ll notify you when something happens',
        };
    }
  };

  const emptyState = getEmptyState();

  // Get count for each filter
  const getFilterCount = (filter: 'all' | 'follower' | 'reminder' | 'update') => {
    if (filter === 'all') return allNotifications.length;
    return allNotifications.filter((n) => n.type === filter).length;
  };

  return (
    <div className="bg-[#0E0E11] min-h-screen">
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#F5F5F7] mb-2">Notifications</h1>
          <div className="flex items-center justify-between">
            <p className="text-[#A1A1A6]">Stay updated with your events</p>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-gradient-to-r from-[#FF3CAC] to-[#9D4EDD] text-white rounded-full text-sm shadow-lg">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 transition-all duration-200 ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2EBB] text-white shadow-lg shadow-purple-600/30 scale-105' 
                : 'border border-[rgba(255,255,255,0.12)] bg-[#141417] text-[#A1A1A6] hover:scale-105 hover:border-[#9D4EDD]/50'
            } rounded-lg`}
            onClick={() => setActiveFilter('all')}
          >
            All ({getFilterCount('all')})
          </button>
          <button
            className={`px-4 py-2 transition-all duration-200 ${
              activeFilter === 'follower' 
                ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2EBB] text-white shadow-lg shadow-purple-600/30 scale-105' 
                : 'border border-[rgba(255,255,255,0.12)] bg-[#141417] text-[#A1A1A6] hover:scale-105 hover:border-[#9D4EDD]/50'
            } rounded-lg`}
            onClick={() => setActiveFilter('follower')}
          >
            Followers ({getFilterCount('follower')})
          </button>
          <button
            className={`px-4 py-2 transition-all duration-200 ${
              activeFilter === 'reminder' 
                ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2EBB] text-white shadow-lg shadow-purple-600/30 scale-105' 
                : 'border border-[rgba(255,255,255,0.12)] bg-[#141417] text-[#A1A1A6] hover:scale-105 hover:border-[#9D4EDD]/50'
            } rounded-lg`}
            onClick={() => setActiveFilter('reminder')}
          >
            Reminders ({getFilterCount('reminder')})
          </button>
          <button
            className={`px-4 py-2 transition-all duration-200 ${
              activeFilter === 'update' 
                ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2EBB] text-white shadow-lg shadow-purple-600/30 scale-105' 
                : 'border border-[rgba(255,255,255,0.12)] bg-[#141417] text-[#A1A1A6] hover:scale-105 hover:border-[#9D4EDD]/50'
            } rounded-lg`}
            onClick={() => setActiveFilter('update')}
          >
            Updates ({getFilterCount('update')})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer animate-fadeIn ${
                notification.read
                  ? 'bg-[#141417] border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.18)] hover:shadow-lg hover:shadow-black/50'
                  : 'bg-gradient-to-br from-[#9D4EDD]/10 to-[#06D6FF]/5 border-[#9D4EDD]/30 hover:border-[#9D4EDD]/50 hover:shadow-lg hover:shadow-purple-600/20'
              }`}
            >
              {/* Image */}
              {notification.image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-1 ring-[rgba(255,255,255,0.12)]">
                  <ImageWithFallback
                    src={notification.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  {getIcon(notification.type)}
                  <h3 className="text-[#F5F5F7] flex-1">{notification.title}</h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-[#FF3CAC] rounded-full flex-shrink-0 mt-2 animate-pulse"></span>
                  )}
                </div>
                <p className="text-[#A1A1A6] mb-1 line-clamp-2">{notification.message}</p>
                <p className="text-[#6C6C70] text-sm">{notification.time}</p>
                {notification.ticketData && (
                  <div className="mt-3 p-3 bg-gradient-to-br from-[#9D4EDD]/20 to-[#06D6FF]/10 border border-[#9D4EDD]/30 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket className="w-4 h-4 text-[#9D4EDD]" />
                      <p className="text-[#9D4EDD] font-medium">Ticket Details</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-[#A1A1A6]"><span className="font-medium text-[#F5F5F7]">Ticket #:</span> {notification.ticketData.ticketNumber}</p>
                      <p className="text-[#A1A1A6]"><span className="font-medium text-[#F5F5F7]">Barcode:</span> {notification.ticketData.barcode}</p>
                      <div className="mt-2 pt-2 border-t border-[#9D4EDD]/20">
                        <p className="text-xs text-[#6C6C70]">✅ This ticket grants you access to watch the live stream</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no notifications) */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            {emptyState.icon}
            <h3 className="text-[#F5F5F7] mb-2">{emptyState.title}</h3>
            <p className="text-[#A1A1A6]">{emptyState.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
