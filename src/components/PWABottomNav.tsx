import { motion } from 'motion/react';
import { Calendar, Radio, Rss, PlusCircle, User } from 'lucide-react';

export type PWATab = 'events' | 'live' | 'feed' | 'create' | 'profile';

interface PWABottomNavProps {
  activeTab: PWATab;
  onTabChange: (tab: PWATab) => void;
  unreadCount?: number;
  liveCount?: number;
}

const tabs = [
  { id: 'events' as PWATab, icon: Calendar, label: 'Events' },
  { id: 'live' as PWATab, icon: Radio, label: 'Live', badge: true },
  { id: 'feed' as PWATab, icon: Rss, label: 'Feed' },
  { id: 'create' as PWATab, icon: PlusCircle, label: 'Create' },
  { id: 'profile' as PWATab, icon: User, label: 'Profile' },
];

export function PWABottomNav({ 
  activeTab, 
  onTabChange, 
  unreadCount = 0,
  liveCount = 3 
}: PWABottomNavProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      {/* Active Tab Indicator */}
      <div className="relative">
        <motion.div
          layoutId="activeTab"
          className="absolute top-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            left: `${tabs.findIndex(t => t.id === activeTab) * 20}%`,
            width: '20%',
          }}
        />
      </div>

      {/* Tab Buttons */}
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasLiveBadge = tab.badge && liveCount > 0;
          const hasUnread = tab.id === 'feed' && unreadCount > 0;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-2 min-w-[64px]"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Icon Container with Animation */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors ${
                      isActive 
                        ? 'text-purple-600' 
                        : 'text-gray-400'
                    }`}
                  />
                </motion.div>

                {/* Live Indicator */}
                {hasLiveBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                  >
                    <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                  </motion.span>
                )}

                {/* Unread Badge */}
                {hasUnread && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-purple-600 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-[10px] text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <motion.span
                className={`text-[11px] font-medium transition-colors ${
                  isActive 
                    ? 'text-purple-600' 
                    : 'text-gray-500'
                }`}
                animate={{
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {tab.label}
              </motion.span>

              {/* Haptic Feedback Simulation */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-purple-50 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
