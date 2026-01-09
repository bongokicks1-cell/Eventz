import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import { registerServiceWorker } from './utils/registerSW';
import { PWAShell } from './components/PWAShell';
import { PWAOnboarding } from './components/PWAOnboarding';
import { PWABottomNav, PWATab } from './components/PWABottomNav';
import { PWAEventsScreen } from './components/PWAEventsScreen';
import { PWALiveScreen } from './components/PWALiveScreen';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWASplashScreen } from './components/PWASplashScreen';
import { Feed } from './components/Feed';
import { Profile } from './components/Profile';
import { EventDetails } from './components/EventDetails';
import { LiveFeed } from './components/LiveFeed';
import { CreateEvent } from './components/CreateEvent';
import { BecomeOrganizer } from './components/BecomeOrganizer';
import { OrganizerProfileSetup } from './components/OrganizerProfileSetup';
import { OrganizerDashboard } from './components/OrganizerDashboard';

export interface PurchasedTicket {
  id: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketNumber: string;
  barcode: string;
  purchaseDate: string;
  customerName: string;
  customerEmail: string;
  price: string;
  ticketType?: 'Normal' | 'VIP' | 'VVIP';
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    isOrganizer?: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    user: {
      name: 'Jazz Events TZ',
      username: '@jazzeventstz',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
      verified: true,
      isOrganizer: true,
    },
    lastMessage: {
      text: 'Thank you for attending! Hope you enjoyed the show 🎷',
      timestamp: '5m ago',
      isRead: false,
    },
    unreadCount: 2,
    messages: [
      { id: 1, senderId: 1, text: 'Hey! Thanks for getting tickets to Jazz Night!', timestamp: '2:30 PM', read: true },
      { id: 2, senderId: 0, text: 'Can\'t wait! What time does it start?', timestamp: '2:32 PM', read: true },
    ],
  },
];

type Screen = 'onboarding' | 'main' | 'eventDetail' | 'streamDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState<PWATab>('events');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('eventz-onboarding-seen') === 'true';
  });
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);
  
  // Organizer state
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [hasOrganizerProfile, setHasOrganizerProfile] = useState(false);
  const [organizerView, setOrganizerView] = useState<'dashboard' | 'createEvent'>('dashboard');
  
  // Data state
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (hasSeenOnboarding) {
      setCurrentScreen('main');
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('eventz-onboarding-seen', 'true');
    setHasSeenOnboarding(true);
    setCurrentScreen('main');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('eventz-onboarding-seen', 'true');
    setHasSeenOnboarding(true);
    setCurrentScreen('main');
  };

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentScreen('eventDetail');
  };

  const handleStreamClick = (streamId: number) => {
    setSelectedStreamId(streamId);
    setCurrentScreen('streamDetail');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setSelectedEventId(null);
    setSelectedStreamId(null);
  };

  const handleTabChange = (tab: PWATab) => {
    setActiveTab(tab);
  };

  const handleTicketPurchase = (ticket: PurchasedTicket) => {
    const updatedTickets = [...purchasedTickets, ticket];
    setPurchasedTickets(updatedTickets);
    localStorage.setItem('eventz-purchased-tickets', JSON.stringify(updatedTickets));
  };

  const handleStartConversation = (user: {
    name: string;
    username?: string;
    avatar: string;
    verified: boolean;
    isOrganizer?: boolean;
  }) => {
    const existingConv = conversations.find(conv =>
      conv.user.username?.toLowerCase() === user.username?.toLowerCase()
    );

    if (existingConv) {
      return existingConv;
    } else {
      const newConversation: Conversation = {
        id: Date.now(),
        user: {
          name: user.name,
          username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: user.avatar,
          verified: user.verified,
          isOrganizer: user.isOrganizer,
        },
        lastMessage: {
          text: 'Start a conversation...',
          timestamp: 'Now',
          isRead: true,
        },
        unreadCount: 0,
        messages: [],
      };

      setConversations([newConversation, ...conversations]);
      return newConversation;
    }
  };

  const handleSendMessage = (conversationId: number, messageText: string) => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: 0,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      read: true,
    };

    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: {
            text: newMessage.text,
            timestamp: 'Just now',
            isRead: true,
          },
        };
      }
      return conv;
    }));
  };

  const handleBecomeOrganizer = () => {
    setIsOrganizer(true);
  };

  const handleProfileComplete = () => {
    setHasOrganizerProfile(true);
    setOrganizerView('dashboard');
  };

  const handleCreateEvent = () => {
    setOrganizerView('createEvent');
  };

  // Render onboarding
  if (currentScreen === 'onboarding') {
    return (
      <PWAShell>
        <PWAOnboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </PWAShell>
    );
  }

  // Render event detail
  if (currentScreen === 'eventDetail') {
    return (
      <PWAShell onBack={handleBackToMain} showBackButton enableSwipeBack>
        <div className="h-full overflow-hidden">
          <EventDetails
            onTicketPurchase={handleTicketPurchase}
            purchasedTickets={purchasedTickets}
            conversations={conversations}
            onStartConversation={handleStartConversation}
            onSendMessage={handleSendMessage}
          />
        </div>
      </PWAShell>
    );
  }

  // Render stream detail
  if (currentScreen === 'streamDetail') {
    return (
      <PWAShell onBack={handleBackToMain} showBackButton enableSwipeBack>
        <div className="h-full overflow-hidden">
          <LiveFeed />
        </div>
      </PWAShell>
    );
  }

  // Render main app with tabs
  return (
    <PWAShell>
      <div className="h-full flex flex-col bg-gray-50">
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
            },
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'events' && (
                <PWAEventsScreen onEventClick={handleEventClick} />
              )}
              
              {activeTab === 'live' && (
                <PWALiveScreen onStreamClick={handleStreamClick} />
              )}
              
              {activeTab === 'feed' && (
                <Feed
                  conversations={conversations}
                  onStartConversation={handleStartConversation}
                  onSendMessage={handleSendMessage}
                />
              )}
              
              {activeTab === 'create' && (
                !isOrganizer ? (
                  <BecomeOrganizer onComplete={handleBecomeOrganizer} />
                ) : !hasOrganizerProfile ? (
                  <OrganizerProfileSetup onComplete={handleProfileComplete} />
                ) : organizerView === 'dashboard' ? (
                  <OrganizerDashboard 
                    onCreateEvent={handleCreateEvent} 
                    onEditEvent={() => {}} 
                  />
                ) : (
                  <CreateEvent onBack={() => setOrganizerView('dashboard')} />
                )
              )}
              
              {activeTab === 'profile' && (
                <Profile
                  conversations={conversations}
                  onStartConversation={handleStartConversation}
                  onSendMessage={handleSendMessage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <PWABottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
          liveCount={3}
        />

        {/* Install Banner */}
        <PWAInstallBanner />
      </div>
    </PWAShell>
  );
}