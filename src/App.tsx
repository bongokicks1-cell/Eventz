import { useState } from 'react';
import { EventDetails } from './components/EventDetails';
import { LiveFeed } from './components/LiveFeed';
import { Feed } from './components/Feed';
import { CreateEvent } from './components/CreateEvent';
import { BecomeOrganizer } from './components/BecomeOrganizer';
import { OrganizerProfileSetup } from './components/OrganizerProfileSetup';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { Calendar, Radio, PlusCircle, Bell, User, Rss } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';

type Tab = 'event' | 'feed' | 'live' | 'create' | 'profile';
type OrganizerView = 'dashboard' | 'createEvent';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('event');
  const [isOrganizer, setIsOrganizer] = useState(() => {
    // Clear localStorage for testing - remove this line later
    localStorage.removeItem('eventz-is-organizer');
    localStorage.removeItem('eventz-organizer-profile');
    return localStorage.getItem('eventz-is-organizer') === 'true';
  });
  const [hasOrganizerProfile, setHasOrganizerProfile] = useState(() => {
    return localStorage.getItem('eventz-organizer-profile') !== null;
  });
  const [organizerView, setOrganizerView] = useState<OrganizerView>('dashboard');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Ticket management state
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => {
    const saved = localStorage.getItem('eventz-purchased-tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const handleBecomeOrganizer = () => {
    setIsOrganizer(true);
  };

  const handleProfileComplete = () => {
    setHasOrganizerProfile(true);
    setOrganizerView('dashboard');
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setOrganizerView('createEvent');
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setOrganizerView('createEvent');
  };

  const handleBackToDashboard = () => {
    setEditingEvent(null);
    setOrganizerView('dashboard');
  };

  const handleTicketPurchase = (ticket: PurchasedTicket) => {
    const updatedTickets = [...purchasedTickets, ticket];
    setPurchasedTickets(updatedTickets);
    localStorage.setItem('eventz-purchased-tickets', JSON.stringify(updatedTickets));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      {/* Main Content */}
      <div className="max-w-7xl mx-auto pb-20">
        {activeTab === 'event' && <EventDetails onTicketPurchase={handleTicketPurchase} purchasedTickets={purchasedTickets} />}
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'live' && <LiveFeed />}
        {activeTab === 'create' && (
          !isOrganizer ? (
            <BecomeOrganizer onComplete={handleBecomeOrganizer} />
          ) : !hasOrganizerProfile ? (
            <OrganizerProfileSetup onComplete={handleProfileComplete} />
          ) : organizerView === 'dashboard' ? (
            <OrganizerDashboard onCreateEvent={handleCreateEvent} onEditEvent={handleEditEvent} />
          ) : (
            <CreateEvent onBack={handleBackToDashboard} event={editingEvent} />
          )
        )}
        {activeTab === 'profile' && <Profile />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setActiveTab('event')}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                activeTab === 'event' ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Events</span>
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                activeTab === 'feed' ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <Rss className="w-6 h-6" />
              <span className="text-xs">Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors relative ${
                activeTab === 'live' ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <Radio className="w-6 h-6" />
              <span className="text-xs">Live</span>
              {/* Live indicator dot */}
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                activeTab === 'create' ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs">Create</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                activeTab === 'profile' ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}