import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Calendar, DollarSign, Share2, Bookmark, Users, ChevronRight, ChevronLeft, Clock, X, Filter, Radio, Tv, Play, Eye, CheckCircle2, Search, MoreVertical, Mail, MessageCircle, Copy, Check, Bell, Send, Star } from 'lucide-react';
import { OrganizerProfile } from './OrganizerProfile';
import { toast } from 'sonner@2.0.3';
import { PurchasedTicket, Conversation, Message } from '../App';
import { PremiumSearchModal } from './PremiumSearchModal';
import { UserProfileModal } from './UserProfileModal';
import { SetAlertModal } from './SetAlertModal';
import { TierTicketModal } from './TierTicketModal';
import { MediaViewer } from './MediaViewer';
import harmonizePoster from 'figma:asset/7b5f7bc419019da4329ccbf3dd742620e8e20c43.png';
import hennessyPoster from 'figma:asset/86729da933e180c2188b5a326ae17c48bda85b9d.png';
import vintageSpacePoster from 'figma:asset/95b9c37c292bb18313f0eb859f9f372fdc547d97.png';
import bukiJenardCover from 'figma:asset/84bca774e8638978da6b9a5588dd8ef8481492a4.png';
import luchyRanksCover from 'figma:asset/8ec3165de81ea3f3c210518a2ea2c83f98b3b9ac.png';

interface Event {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  image: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: string;
  attendees: number;
  description: string;
  isSaved?: boolean;
  organizer?: string;
  streaming?: {
    available: boolean;
    quality: 'HD' | '4K' | 'SD';
    virtualPrice?: string;
    isLive?: boolean;
    liveViewers?: number;
    replayAvailable?: boolean;
    features?: string[];
  };
  eventHighlights?: {
    image?: string;
    video?: string;
    caption: string;
    type: 'performer' | 'special_guest' | 'venue' | 'preview';
    mediaType: 'image' | 'video';
  }[];
  ticketTiers?: {
    name: 'Normal' | 'VIP' | 'VVIP';
    price: string;
    priceNumeric: number;
    available: number;
    features: string[];
    color?: string;
  }[];
}

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  hasTicket: (eventId: number) => boolean;
  onPurchaseTicket: (event: Event) => void;
  onPurchaseNormalTicket: (event: Event) => void;
  onStartConversation?: (user: { name: string; username?: string; avatar: string; verified: boolean; isOrganizer?: boolean }) => void;
}

const locations = [
  { id: 'all', name: 'All Locations', flag: '🌍' },
  { id: 'atlanta', name: 'Atlanta, USA', flag: '🇺🇸' },
  { id: 'dar', name: 'Dar es Salaam, Tanzania', flag: '🇹🇿' },
  { id: 'zanzibar', name: 'Zanzibar, Tanzania', flag: '🇹🇿' },
  { id: 'newyork', name: 'New York, USA', flag: '🇺🇸' },
];

const events: Event[] = [
  {
    id: 9,
    title: 'Island Vibes - Live Performance Night',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://i.ibb.co/6cfVDhDK/Harmonize-Shanga.jpg',
    date: 'Sunday, June 15, 2025',
    time: '10:00 PM - 3:00 AM',
    location: 'Shanga',
    city: 'zanzibar',
    price: 'TSh 22,000',
    attendees: 2345,
    description: 'Zanzibar\'s hotspot for electrifying live performances, themed nightlife parties, and unforgettable entertainment experiences where every night becomes a celebration of music, culture, and energy.',
    organizer: 'Shanga',
    ticketTiers: [
      {
        name: 'Normal',
        price: 'TSh 22,000',
        priceNumeric: 22000,
        available: 200,
        features: ['General admission', 'Dance floor access', 'Standard bar'],
      },
      {
        name: 'VIP',
        price: 'TSh 45,000',
        priceNumeric: 45000,
        available: 75,
        features: ['VIP lounge area', 'Priority entry', 'Reserved seating', 'Complimentary drink', 'Meet & greet opportunity'],
      },
      {
        name: 'VVIP',
        price: 'TSh 85,000',
        priceNumeric: 85000,
        available: 30,
        features: ['Private beachfront booth', 'Premium bottle service', 'Personal host', 'Backstage access', 'Exclusive photo opportunity', 'Complimentary food & drinks'],
      },
    ],
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 1567,
      replayAvailable: true,
      features: ['Multi-camera angles', 'Live performances', 'HD streaming', 'Live chat'],
    },
    eventHighlights: [
      {
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        caption: 'DJ Amani - Live Performance Highlight',
        type: 'performer',
        mediaType: 'video',
      },
      {
        image: 'https://images.unsplash.com/photo-1593459866242-426f7768f3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTg4MjA3OHww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Special Guest: Msanii Wa Taarabu',
        type: 'special_guest',
        mediaType: 'image',
      },
      {
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Crowd Energy - Live Moment',
        type: 'preview',
        mediaType: 'video',
      },
      {
        image: 'https://images.unsplash.com/photo-1764212694488-8f852629a880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwbmlnaHR8ZW58MXx8fHwxNzY1ODk1MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Shanga Venue - Island Paradise Setting',
        type: 'venue',
        mediaType: 'image',
      },
    ],
  },
  {
    id: 2,
    title: 'Electric Nights - Themed Party',
    category: 'Entertainment',
    subcategory: 'Nightlife',
    image: 'https://i.ibb.co/n8Rk2bBZ/Tyler-ICU.jpg',
    date: 'Friday, June 20, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Elements Nightclub',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 1523,
    description: 'Dar es Salaam\'s iconic nightclub delivers premier nightlife party experience with themed events and exceptional live performances.',
    organizer: 'Elements',
    ticketTiers: [
      {
        name: 'Normal',
        price: 'TSh 25,000',
        priceNumeric: 25000,
        available: 150,
        features: ['General admission', 'Access to main floor', 'Standard bar service'],
      },
      {
        name: 'VIP',
        price: 'TSh 50,000',
        priceNumeric: 50000,
        available: 50,
        features: ['VIP lounge access', 'Priority entry', 'Complimentary welcome drink', 'Reserved seating area', 'Express bar service'],
      },
      {
        name: 'VVIP',
        price: 'TSh 100,000',
        priceNumeric: 100000,
        available: 20,
        features: ['Private VIP booth', 'Premium bottle service', 'Dedicated server', 'Backstage meet & greet', 'Exclusive access areas', 'Complimentary champagne'],
      },
    ],
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 1247,
      replayAvailable: true,
      features: ['Live DJ sets', 'Multi-angle cameras', 'HD streaming', 'Live chat'],
    },
    eventHighlights: [
      {
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Electric Vibes - DJ Set Highlight',
        type: 'preview',
        mediaType: 'video',
      },
      {
        image: 'https://images.unsplash.com/photo-1761474926371-c0e728a1b8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwY29uY2VydCUyMHBlcmZvcm1lciUyMHN0YWdlfGVufDF8fHx8MTc2NTkwOTc3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Live Performance Act',
        type: 'performer',
        mediaType: 'image',
      },
      {
        image: 'https://images.unsplash.com/photo-1764212694488-8f852629a880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwbmlnaHR8ZW58MXx8fHwxNzY1ODk1MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Elements Nightclub - VIP Experience',
        type: 'venue',
        mediaType: 'image',
      },
    ],
  },
  {
    id: 5,
    title: 'Swahili Fashion Week Showcase',
    category: 'Culture',
    subcategory: 'Fashion & Arts',
    image: 'https://i.ibb.co/jZ1XS3zk/Vintage-space.jpg',
    date: 'Thursday, June 12, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Vintage Space',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 645,
    description: 'Dar es Salaam\'s premier fashion event showcasing cutting-edge fashion, style, and creativity from Tanzania\'s most talented designers and fashion innovators.',
    organizer: 'Vintage Space',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['Runway multi-cam', 'HD streaming', 'Designer interviews', 'Live chat'],
    },
  },
  {
    id: 1,
    title: 'Jungle Rhythms Night 2025',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=800&h=600&fit=crop',
    date: 'Saturday, June 14, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'Summer Jungle',
    city: 'zanzibar',
    price: 'TSh 20,000',
    attendees: 2847,
    description: 'Experience the wild side of island nightlife with Afro music, house music, and outdoor festival vibes in Zanzibar\'s legendary bush club.',
    isSaved: true,
    organizer: 'Summer Jungle',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 10,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['Multi-camera angles', 'Live chat', 'HD & 4K quality', 'DVR replay'],
    },
  },
  {
    id: 3,
    title: 'Zanzibar Beach Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=800&h=600&fit=crop',
    date: 'Sunday, July 7, 2025',
    time: '4:00 PM - 11:00 PM',
    location: 'Nungwi Beach',
    city: 'zanzibar',
    price: 'Free',
    attendees: 3421,
    description: 'Experience traditional Swahili culture, live music, and authentic coastal cuisine at sunset.',
    organizer: 'Tiki Beach',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: false,
      liveViewers: 0,
      replayAvailable: false,
      features: ['Live broadcast', 'HD quality', 'Real-time reactions'],
    },
  },
  {
    id: 4,
    title: 'Masquerade Night - Themed Party',
    category: 'Entertainment',
    subcategory: 'Nightlife',
    image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=800&h=600&fit=crop',
    date: 'Saturday, June 28, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'WE OUTCHEA',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 1876,
    description: 'Dar es Salaam\'s premier nightlife destination presents an unforgettable masquerade themed party with vibrant atmospheres where music, culture, and entertainment come alive.',
    organizer: 'WE OUTCHEA',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['Multi-camera angles', 'Live DJ sets', 'HD streaming', 'Live chat'],
    },
  },
  {
    id: 6,
    title: 'Afro Beats Festival 2025',
    category: 'Entertainment',
    subcategory: 'Music Festival',
    image: 'https://images.unsplash.com/photo-1764050359179-517599dab87b?w=800&h=600&fit=crop',
    date: 'Wednesday, June 18, 2025',
    time: '6:00 PM - 2:00 AM',
    location: 'The Park',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 8934,
    description: 'Premier music festival organizer and nightlife experience curator presents an unforgettable celebration of Afro beats, themed parties, and the best of Tanzanian entertainment culture.',
    organizer: 'STR8 OUT VIBES',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 5834,
      replayAvailable: true,
      features: ['4K Ultra HD', 'Multiple stage cameras', 'Live performances', 'Live chat'],
    },
  },
  {
    id: 7,
    title: 'Afro House Beach Party',
    category: 'Entertainment',
    subcategory: 'Beach Party',
    image: 'https://images.unsplash.com/photo-1764510377576-d2dd1cbd121d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMG5pZ2h0Y2x1YiUyMHBlcmZvcm1hbmNlJTIwbGlnaHRzfGVufDF8fHx8MTc2NTgwOTYzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'Saturday, June 21, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Jambo Beach Party',
    city: 'zanzibar',
    price: 'TSh 20,000',
    attendees: 1234,
    description: 'Zanzibar\'s premier beach club featuring nightlife party experiences with Afro music, house music, and beachside entertainment - the ultimate destination for music lovers and party enthusiasts.',
    organizer: 'Jambo Beach Party',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['Beach multi-cam', 'Live DJ sets', 'HD streaming', 'Live chat'],
    },
  },
  {
    id: 8,
    title: 'Beach Nightlife Experience',
    category: 'Entertainment',
    subcategory: 'Nightlife',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: 'Monday, June 23, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Kidimbwi Club',
    city: 'dar',
    price: 'TSh 18,000',
    attendees: 567,
    description: 'Beachfront party destination delivering exceptional nightlife party experiences where oceanfront dining meets high-energy entertainment in a tropical paradise setting.',
    organizer: 'Kidimbwi Club',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['Beach multi-cam', 'Live DJ sets', 'HD streaming', 'Live chat'],
    },
  },
  {
    id: 10,
    title: 'Sunrise Beach Party',
    category: 'Entertainment',
    subcategory: 'Beach Party',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop',
    date: 'Thursday, June 19, 2025',
    time: '5:30 AM - 10:00 AM',
    location: 'Wavuvi Camp',
    city: 'dar',
    price: 'TSh 12,000',
    attendees: 234,
    description: 'Iconic bar and restaurant on Dar es Salaam\'s coastline, renowned for legendary sunrise parties and electrifying live performances where the night transforms into unforgettable nightlife experiences by the ocean.',
    organizer: 'Wavuvi Camp',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 6,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['Sunrise multi-cam', 'Live performances', 'HD streaming', 'Live chat'],
    },
  },
  {
    id: 11,
    title: 'Broadway Night: Hamilton Live',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    date: 'Friday, June 27, 2025',
    time: '7:30 PM - 10:30 PM',
    location: 'Richard Rodgers Theatre',
    city: 'newyork',
    price: '$180 - $450',
    attendees: 1456,
    description: 'Experience the award-winning musical Hamilton live on Broadway. Don\'t miss this spectacular performance!',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$45',
      isLive: true,
      liveViewers: 3421,
      replayAvailable: true,
      features: ['4K streaming', 'Behind the scenes', 'Multi-angle views', 'Live subtitles'],
    },
  },
  {
    id: 12,
    title: 'Rooftop Cocktail Experience',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    date: 'Wednesday, July 2, 2025',
    time: '6:00 PM - 11:00 PM',
    location: 'The Rooftop at Ponce City Market',
    city: 'atlanta',
    price: '$30',
    attendees: 567,
    description: 'Sip craft cocktails while enjoying stunning city views and live acoustic music.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 13,
    title: '80s Neon Party Night',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    date: 'Saturday, July 5, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Club Retro',
    city: 'newyork',
    price: '$25',
    attendees: 892,
    description: 'Time travel to the 80s! Dress in your best neon outfit and dance to classic hits all night long.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$10',
      isLive: false,
      liveViewers: 0,
      replayAvailable: false,
      features: ['HD streaming', 'Live chat', 'Playlist access'],
    },
  },
  {
    id: 14,
    title: 'Photography Masterclass',
    category: 'Education',
    subcategory: 'Workshops',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
    date: 'Saturday, June 21, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Dar es Salaam Art Center',
    city: 'dar',
    price: 'TSh 50,000',
    attendees: 145,
    description: 'Learn professional photography techniques from award-winning photographers. Hands-on training included.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 25,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Resource materials', 'Certificate', 'Q&A archive'],
    },
  },
  {
    id: 15,
    title: 'Leadership Excellence Seminar',
    category: 'Education',
    subcategory: 'Seminars',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    date: 'Tuesday, June 24, 2025',
    time: '9:00 AM - 1:00 PM',
    location: 'Hyatt Regency',
    city: 'atlanta',
    price: '$85',
    attendees: 456,
    description: 'Develop your leadership skills with insights from Fortune 500 executives and business coaches.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$45',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['HD streaming', 'Live Q&A', 'Digital workbook', 'Networking lobby'],
    },
  },
  {
    id: 16,
    title: 'AI & Machine Learning Webinar',
    category: 'Education',
    subcategory: 'Webinars',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    date: 'Thursday, June 26, 2025',
    time: '3:00 PM - 5:00 PM',
    location: 'Online Event',
    city: 'newyork',
    price: 'Free',
    attendees: 3421,
    description: 'Explore the future of AI and machine learning with leading experts from top tech companies.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 2845,
      replayAvailable: true,
      features: ['HD quality', 'Live chat', 'Slides download', 'Certificate'],
    },
  },
  {
    id: 17,
    title: 'Sauti za Busara Music Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Friday, July 11, 2025',
    time: '6:00 PM - 12:00 AM',
    location: 'Old Fort Amphitheatre',
    city: 'zanzibar',
    price: 'TSh 30,000',
    attendees: 4567,
    description: 'Africa\'s premier celebration of music and culture featuring artists from across the continent.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 6234,
      replayAvailable: true,
      features: ['4K streaming', 'Multi-stage coverage', 'Artist interviews', 'Live chat'],
    },
  },
  {
    id: 18,
    title: 'Street Art Walking Tour',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
    date: 'Sunday, June 29, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Krog Street Tunnel',
    city: 'atlanta',
    price: '$15',
    attendees: 234,
    description: 'Discover Atlanta\'s vibrant street art scene with local artists as your guides.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 19,
    title: 'Taste of Tanzania',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    date: 'Saturday, July 12, 2025',
    time: '11:00 AM - 9:00 PM',
    location: 'Mlimani City',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 2145,
    description: 'Sample authentic Tanzanian dishes, watch cooking demonstrations, and learn about local culinary traditions.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Recipe cards', 'Chef interviews'],
    },
  },
  {
    id: 20,
    title: 'Swahili Heritage Day',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    date: 'Thursday, July 3, 2025',
    time: '10:00 AM - 6:00 PM',
    location: 'Stone Town Cultural Center',
    city: 'zanzibar',
    price: 'Free',
    attendees: 1876,
    description: 'Celebrate Swahili culture with traditional dances, crafts, storytelling, and historical exhibitions.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD streaming', 'Cultural commentary', 'Live chat'],
    },
  },
  {
    id: 21,
    title: 'New York Fashion Week Preview',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5097?w=800&h=600&fit=crop',
    date: 'Wednesday, July 9, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Spring Studios',
    city: 'newyork',
    price: '$250',
    attendees: 876,
    description: 'Get an exclusive preview of next season\'s hottest fashion trends from emerging designers.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$75',
      isLive: true,
      liveViewers: 4562,
      replayAvailable: true,
      features: ['4K runway coverage', 'Designer interviews', 'Multi-angle views', 'Fashion commentary'],
    },
  },
  {
    id: 22,
    title: 'Interfaith Prayer Gathering',
    category: 'Religion',
    subcategory: 'Religious Gatherings',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop',
    date: 'Friday, June 20, 2025',
    time: '6:00 PM - 8:00 PM',
    location: 'Unity Center',
    city: 'dar',
    price: 'Free',
    attendees: 1234,
    description: 'Join people of all faiths for an evening of prayer, reflection, and unity in our diverse community.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 876,
      replayAvailable: true,
      features: ['HD streaming', 'Multi-language', 'Live prayers', 'Chat moderation'],
    },
  },
  {
    id: 23,
    title: 'Meditation & Mindfulness Retreat',
    category: 'Religion',
    subcategory: 'Spiritual Events',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    date: 'Saturday, June 28, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Serenity Gardens',
    city: 'atlanta',
    price: '$65',
    attendees: 456,
    description: 'A day of guided meditation, mindfulness practices, and spiritual connection in peaceful natural surroundings.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$35',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Guided meditations', 'Resource materials', 'Follow-along sessions'],
    },
  },
  {
    id: 24,
    title: 'Startup Pitch Competition',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
    date: 'Monday, June 30, 2025',
    time: '5:00 PM - 9:00 PM',
    location: 'TechHub Dar',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 567,
    description: 'Watch innovative startups pitch their ideas to investors. $50,000 prize for the winning team!',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 892,
      replayAvailable: true,
      features: ['HD quality', 'Live voting', 'Investor Q&A', 'Pitch deck downloads'],
    },
  },
  {
    id: 25,
    title: 'Women in Tech Networking',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    date: 'Thursday, July 3, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Microsoft Innovation Center',
    city: 'newyork',
    price: '$25',
    attendees: 678,
    description: 'Connect with inspiring women in technology. Featuring panel discussions, mentorship, and networking opportunities.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$15',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD streaming', 'Virtual networking rooms', 'Live chat', 'Panel Q&A'],
    },
  },
  {
    id: 26,
    title: 'Blockchain & Web3 Summit',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    date: 'Tuesday, July 8, 2025',
    time: '1:00 PM - 6:00 PM',
    location: 'Avalon Hotel',
    city: 'atlanta',
    price: '$95',
    attendees: 1234,
    description: 'Explore the future of blockchain technology, cryptocurrencies, and Web3 with industry pioneers.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$50',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['4K streaming', 'Speaker slides', 'Live Q&A', 'Networking chat'],
    },
  },
  {
    id: 27,
    title: 'CrossFit Competition',
    category: 'Sports & Fitness',
    subcategory: 'Competitions',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    date: 'Saturday, July 5, 2025',
    time: '8:00 AM - 4:00 PM',
    location: 'Titan Fitness Arena',
    city: 'atlanta',
    price: '$15',
    attendees: 789,
    description: 'Watch elite athletes compete in intense CrossFit challenges. Free fitness expo and vendor village.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$10',
      isLive: true,
      liveViewers: 1567,
      replayAvailable: true,
      features: ['HD streaming', 'Live leaderboard', 'Athlete interviews', 'Multi-camera angles'],
    },
  },
  {
    id: 28,
    title: 'Sunrise Beach Bootcamp',
    category: 'Sports & Fitness',
    subcategory: 'Fitness Classes',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    date: 'Tuesday, June 24, 2025',
    time: '6:00 AM - 7:00 AM',
    location: 'Msasani Beach',
    city: 'dar',
    price: 'TSh 5,000',
    attendees: 123,
    description: 'Start your day with an energizing beach workout. All fitness levels welcome!',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 29,
    title: 'NYC Marathon 2025',
    category: 'Sports & Fitness',
    subcategory: 'Sports Events',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop',
    date: 'Sunday, July 13, 2025',
    time: '7:00 AM - 2:00 PM',
    location: 'Central Park Start Line',
    city: 'newyork',
    price: '$150',
    attendees: 15678,
    description: 'Run through the five boroughs of New York City in one of the world\'s most iconic marathons.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 23456,
      replayAvailable: true,
      features: ['4K coverage', 'Multiple checkpoints', 'Runner tracking', 'Highlights'],
    },
  },
  {
    id: 30,
    title: 'Zanzibar International Film Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
    date: 'Wednesday, July 16, 2025',
    time: '5:00 PM - 11:00 PM',
    location: 'Old Fort Amphitheatre',
    city: 'zanzibar',
    price: 'TSh 25,000',
    attendees: 2567,
    description: 'Celebrating African cinema with screenings, Q&As with filmmakers, and cultural performances.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['HD streaming', 'Director commentary', 'Festival coverage', 'Behind the scenes'],
    },
  },
  {
    id: 31,
    title: 'Underground House Party',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
    date: 'Friday, July 18, 2025',
    time: '11:00 PM - 5:00 AM',
    location: 'The Warehouse TZ',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 678,
    description: 'Deep house and techno beats in Dar\'s most exclusive underground venue. Featuring local and international DJs.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 892,
      replayAvailable: false,
      features: ['HD streaming', 'Live DJ sets', 'Chat with fans'],
    },
  },
  {
    id: 32,
    title: 'Masquerade Ball NYC',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    date: 'Saturday, July 19, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'The Plaza Hotel',
    city: 'newyork',
    price: '$85 - $150',
    attendees: 456,
    description: 'An elegant masquerade ball with live orchestra, champagne, and mysterious encounters in a glamorous setting.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 33,
    title: 'Jazz & Wine Night',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
    date: 'Thursday, June 26, 2025',
    time: '7:00 PM - 11:00 PM',
    location: 'Slipway Lounge',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 234,
    description: 'Sophisticated evening of smooth jazz with premium wine selection and ocean views at Dar\'s finest lounge.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 34,
    title: 'Tropical Beach Party',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Saturday, June 28, 2025',
    time: '3:00 PM - 11:00 PM',
    location: 'Kendwa Beach',
    city: 'zanzibar',
    price: 'TSh 20,000',
    attendees: 1234,
    description: 'Beach paradise vibes with tropical drinks, fire dancers, and DJ sets under the palm trees until sunset.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 7,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD streaming', 'Beach party vibes', 'Sunset coverage'],
    },
  },
  {
    id: 35,
    title: 'Live Jazz at Blue Note',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
    date: 'Wednesday, July 9, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Blue Note Jazz Club',
    city: 'newyork',
    price: '$45 - $75',
    attendees: 567,
    description: 'World-class jazz musicians perform at NYC\'s legendary Blue Note. Intimate setting with dinner service.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$25',
      isLive: true,
      liveViewers: 2134,
      replayAvailable: true,
      features: ['4K audio & video', 'Multi-camera angles', 'Live chat', 'Set list'],
    },
  },
  {
    id: 36,
    title: 'Indie Music Showcase',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    date: 'Friday, July 11, 2025',
    time: '7:00 PM - 11:00 PM',
    location: 'The Loft Atlanta',
    city: 'atlanta',
    price: '$20',
    attendees: 345,
    description: 'Discover Atlanta\'s best indie bands and emerging artists in an intimate venue. Supporting local music scene.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 37,
    title: 'Sunset Cocktails & DJ',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    date: 'Friday, July 4, 2025',
    time: '5:00 PM - 10:00 PM',
    location: 'Forodhani Gardens',
    city: 'zanzibar',
    price: 'TSh 15,000',
    attendees: 456,
    description: 'Sunset cocktails with live DJ at Stone Town\'s waterfront. Perfect blend of chill vibes and great music.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 38,
    title: 'Excel Mastery Workshop',
    category: 'Education',
    subcategory: 'Workshops',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    date: 'Tuesday, July 1, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'Business Hub Dar',
    city: 'dar',
    price: 'TSh 40,000',
    attendees: 234,
    description: 'Master Excel from basics to advanced formulas, pivot tables, and data analysis. Certificate included.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 20,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Practice files', 'Certificate', 'Lifetime access'],
    },
  },
  {
    id: 39,
    title: 'Public Speaking Masterclass',
    category: 'Education',
    subcategory: 'Workshops',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    date: 'Saturday, July 12, 2025',
    time: '10:00 AM - 3:00 PM',
    location: 'Carnegie Hall Studios',
    city: 'newyork',
    price: '$95',
    attendees: 189,
    description: 'Overcome stage fright and deliver powerful presentations. Learn from Broadway coaches and TED speakers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$50',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['HD quality', 'Interactive exercises', 'Feedback sessions', 'Resources'],
    },
  },
  {
    id: 40,
    title: 'Mental Health in Workplace',
    category: 'Education',
    subcategory: 'Seminars',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
    date: 'Wednesday, July 16, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Coca-Cola HQ',
    city: 'atlanta',
    price: '$40',
    attendees: 345,
    description: 'Understanding mental health challenges in modern workplaces. Expert psychologists and HR professionals.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$25',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['HD streaming', 'Q&A session', 'Resource materials', 'Certificate'],
    },
  },
  {
    id: 41,
    title: 'Tourism & Hospitality Seminar',
    category: 'Education',
    subcategory: 'Seminars',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
    date: 'Monday, July 14, 2025',
    time: '9:00 AM - 2:00 PM',
    location: 'Zanzibar Serena Hotel',
    city: 'zanzibar',
    price: 'TSh 30,000',
    attendees: 267,
    description: 'Strategies for excellence in tourism and hospitality industry. Network with industry leaders in Zanzibar.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 42,
    title: 'Climate Change Solutions',
    category: 'Education',
    subcategory: 'Webinars',
    image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop',
    date: 'Thursday, July 17, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Online Event',
    city: 'dar',
    price: 'Free',
    attendees: 2345,
    description: 'Global experts discuss practical climate solutions for East Africa. Interactive Q&A with scientists.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 1890,
      replayAvailable: true,
      features: ['HD streaming', 'Live Q&A', 'Slides download', 'Certificate'],
    },
  },
  {
    id: 43,
    title: 'Cryptocurrency 101 Webinar',
    category: 'Education',
    subcategory: 'Webinars',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop',
    date: 'Tuesday, July 15, 2025',
    time: '7:00 PM - 9:00 PM',
    location: 'Online Event',
    city: 'atlanta',
    price: '$15',
    attendees: 1678,
    description: 'Learn the basics of cryptocurrency, blockchain, and digital investing from financial experts.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$15',
      isLive: true,
      liveViewers: 1456,
      replayAvailable: true,
      features: ['HD quality', 'Live chat', 'Resource pack', 'Recording access'],
    },
  },
  {
    id: 44,
    title: 'Karibu Music & Arts Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Saturday, July 19, 2025',
    time: '2:00 PM - 11:00 PM',
    location: 'Oyster Bay',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 3456,
    description: 'Celebrate East African culture with live music, traditional dance, art exhibitions, and local cuisine.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 4567,
      replayAvailable: true,
      features: ['4K streaming', 'Multi-stage coverage', 'Cultural performances', 'Artist interviews'],
    },
  },
  {
    id: 45,
    title: 'Atlanta Food Truck Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    date: 'Sunday, July 20, 2025',
    time: '11:00 AM - 8:00 PM',
    location: 'Piedmont Park',
    city: 'atlanta',
    price: 'Free',
    attendees: 5678,
    description: 'Over 50 food trucks serving diverse cuisines. Live music, craft beer garden, and family activities.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 46,
    title: 'Graffiti & Street Art Workshop',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    date: 'Saturday, June 28, 2025',
    time: '1:00 PM - 5:00 PM',
    location: 'Brooklyn Art District',
    city: 'newyork',
    price: '$55',
    attendees: 167,
    description: 'Learn spray paint techniques from NYC street art legends. Create your own piece to take home.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 47,
    title: 'Traditional Tinga Tinga Painting',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    date: 'Thursday, July 10, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Stone Town Art Gallery',
    city: 'zanzibar',
    price: 'TSh 40,000',
    attendees: 123,
    description: 'Learn the iconic Tinga Tinga art style from master Zanzibari artists. All materials included.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 20,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Art techniques', 'Material list', 'Follow-along'],
    },
  },
  {
    id: 48,
    title: 'Wine Tasting Experience',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    date: 'Friday, July 18, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'The Georgian Terrace',
    city: 'atlanta',
    price: '$75',
    attendees: 234,
    description: 'Premium wine tasting featuring international selections paired with gourmet appetizers and sommelier guidance.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 49,
    title: 'Street Food Safari',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    date: 'Saturday, July 5, 2025',
    time: '5:00 PM - 9:00 PM',
    location: 'Forodhani Night Market',
    city: 'zanzibar',
    price: 'TSh 10,000',
    attendees: 678,
    description: 'Guided tour of Zanzibar\'s famous night market. Taste authentic Swahili street food and seafood specialties.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 50,
    title: 'Makonde Carving Workshop',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=600&fit=crop',
    date: 'Sunday, July 13, 2025',
    time: '9:00 AM - 3:00 PM',
    location: 'Mwenge Carvers Market',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 145,
    description: 'Learn traditional Makonde wood carving from master craftsmen. Hands-on workshop with tools provided.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 51,
    title: 'Native American Heritage Day',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
    date: 'Saturday, July 12, 2025',
    time: '10:00 AM - 5:00 PM',
    location: 'Central Park',
    city: 'newyork',
    price: 'Free',
    attendees: 2345,
    description: 'Celebrate Native American culture with traditional dances, storytelling, crafts, and authentic cuisine.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['HD streaming', 'Cultural performances', 'Educational content', 'Live chat'],
    },
  },
  {
    id: 52,
    title: 'Sustainable Fashion Show',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
    date: 'Wednesday, July 16, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Masaki Peninsula',
    city: 'dar',
    price: 'TSh 50,000',
    attendees: 456,
    description: 'Showcasing eco-friendly fashion from East African designers. Sustainable materials and ethical production.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 25,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD runway', 'Designer interviews', 'Behind the scenes', 'Live commentary'],
    },
  },
  {
    id: 53,
    title: 'Bridal Fashion Expo',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    date: 'Sunday, June 29, 2025',
    time: '12:00 PM - 6:00 PM',
    location: 'Cobb Galleria Centre',
    city: 'atlanta',
    price: '$20',
    attendees: 1234,
    description: 'Discover the latest bridal trends. Meet designers, vendors, and get wedding planning inspiration.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 54,
    title: 'Friday Jummah Prayer',
    category: 'Religion',
    subcategory: 'Worship Services',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop',
    date: 'Friday, June 27, 2025',
    time: '1:00 PM - 2:00 PM',
    location: 'Islamic Center of Atlanta',
    city: 'atlanta',
    price: 'Free',
    attendees: 1567,
    description: 'Weekly Friday congregational prayer service with inspiring sermon and community gathering.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['HD streaming', 'Live sermon', 'Translations', 'Prayer times'],
    },
  },
  {
    id: 55,
    title: 'Church Praise & Worship Night',
    category: 'Religion',
    subcategory: 'Worship Services',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop',
    date: 'Saturday, July 19, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Azania Front Lutheran Church',
    city: 'dar',
    price: 'Free',
    attendees: 1890,
    description: 'Powerful worship night with live gospel music, testimonies, and prayer. Everyone welcome.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['HD streaming', 'Live worship', 'Prayer requests', 'Song lyrics'],
    },
  },
  {
    id: 56,
    title: 'Interfaith Dialogue Forum',
    category: 'Religion',
    subcategory: 'Religious Gatherings',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=600&fit=crop',
    date: 'Tuesday, July 8, 2025',
    time: '4:00 PM - 7:00 PM',
    location: 'Community Center NYC',
    city: 'newyork',
    price: 'Free',
    attendees: 567,
    description: 'Open dialogue between different faith communities. Promoting understanding, peace, and cooperation.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['HD streaming', 'Multi-faith speakers', 'Q&A session', 'Live moderation'],
    },
  },
  {
    id: 57,
    title: 'Ramadan Iftar Gathering',
    category: 'Religion',
    subcategory: 'Religious Gatherings',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    date: 'Monday, June 30, 2025',
    time: '6:30 PM - 9:00 PM',
    location: 'Old Fort Gardens',
    city: 'zanzibar',
    price: 'Free',
    attendees: 2345,
    description: 'Community iftar dinner breaking the fast together. Traditional food, prayer, and fellowship.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 58,
    title: 'Yoga & Meditation Retreat',
    category: 'Religion',
    subcategory: 'Spiritual Events',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    date: 'Sunday, July 6, 2025',
    time: '7:00 AM - 5:00 PM',
    location: 'Stone Town Beach Resort',
    city: 'zanzibar',
    price: 'TSh 75,000',
    attendees: 234,
    description: 'Full day spiritual retreat combining yoga, meditation, and wellness practices by the Indian Ocean.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 35,000',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Guided sessions', 'Meditation tracks', 'Wellness guide'],
    },
  },
  {
    id: 59,
    title: 'Healing & Wellness Workshop',
    category: 'Religion',
    subcategory: 'Spiritual Events',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    date: 'Saturday, June 21, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'Dar Wellness Center',
    city: 'dar',
    price: 'TSh 55,000',
    attendees: 178,
    description: 'Holistic healing workshop covering energy work, crystal therapy, and spiritual wellness practices.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 60,
    title: 'Fintech Startup Accelerator',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    date: 'Thursday, July 10, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Times Square Office',
    city: 'newyork',
    price: '$200',
    attendees: 345,
    description: 'Intensive one-day program for fintech startups. Mentorship, pitching practice, and investor connections.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$100',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['HD quality', 'Startup pitches', 'Mentor sessions', 'Investor Q&A'],
    },
  },
  {
    id: 61,
    title: 'Zanzibar Entrepreneurs Meetup',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    date: 'Wednesday, July 2, 2025',
    time: '5:00 PM - 8:00 PM',
    location: 'Zanzibar Co-working Space',
    city: 'zanzibar',
    price: 'TSh 15,000',
    attendees: 234,
    description: 'Monthly gathering of island entrepreneurs. Share ideas, find collaborators, and grow your business.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 62,
    title: 'Professional Networking Mixer',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    date: 'Tuesday, July 15, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Hyatt Regency Dar',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 456,
    description: 'Connect with business professionals across industries. Complimentary drinks and appetizers included.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 63,
    title: 'Young Professionals Network',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&h=600&fit=crop',
    date: 'Thursday, June 26, 2025',
    time: '6:30 PM - 9:30 PM',
    location: 'The Battery Atlanta',
    city: 'atlanta',
    price: '$15',
    attendees: 678,
    description: 'Networking event for young professionals under 35. Build connections in a relaxed social atmosphere.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 64,
    title: 'East Africa Business Summit',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: 'Monday, July 14, 2025',
    time: '8:00 AM - 5:00 PM',
    location: 'Serena Hotel Zanzibar',
    city: 'zanzibar',
    price: 'TSh 150,000',
    attendees: 567,
    description: 'Regional business conference exploring trade, investment, and economic opportunities in East Africa.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 75,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['4K streaming', 'All sessions', 'Networking lounge', 'Speaker slides'],
    },
  },
  {
    id: 65,
    title: 'Global Tech Conference 2025',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    date: 'Wednesday, June 25, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Javits Center',
    city: 'newyork',
    price: '$350 - $500',
    attendees: 3456,
    description: 'The world\'s leading technology conference. Latest innovations, keynotes from tech giants, and networking.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$150',
      isLive: true,
      liveViewers: 8900,
      replayAvailable: true,
      features: ['4K streaming', 'Multi-track access', 'Virtual networking', 'On-demand replays'],
    },
  },
  {
    id: 66,
    title: 'Cybersecurity Best Practices',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
    date: 'Friday, July 11, 2025',
    time: '3:00 PM - 5:00 PM',
    location: 'UDSM ICT Center',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 234,
    description: 'Learn essential cybersecurity practices for businesses. Protect your data and systems from threats.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['HD streaming', 'Security checklist', 'Q&A', 'Resources'],
    },
  },
  {
    id: 67,
    title: 'Future of AI Tech Talk',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    date: 'Monday, June 30, 2025',
    time: '6:00 PM - 8:00 PM',
    location: 'Georgia Tech',
    city: 'atlanta',
    price: '$30',
    attendees: 567,
    description: 'Experts discuss AI trends, ethical considerations, and real-world applications transforming industries.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$20',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['HD quality', 'Live discussion', 'Presentation slides', 'Chat Q&A'],
    },
  },
  {
    id: 68,
    title: 'Beach Volleyball Tournament',
    category: 'Sports & Fitness',
    subcategory: 'Competitions',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
    date: 'Saturday, June 28, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Paje Beach',
    city: 'zanzibar',
    price: 'TSh 10,000',
    attendees: 456,
    description: 'Annual beach volleyball competition on Zanzibar\'s white sands. Open and pro divisions. Prizes awarded.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD streaming', 'Match highlights', 'Live scores', 'Player interviews'],
    },
  },
  {
    id: 69,
    title: 'City Marathon Challenge',
    category: 'Sports & Fitness',
    subcategory: 'Competitions',
    image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800&h=600&fit=crop',
    date: 'Sunday, July 13, 2025',
    time: '6:00 AM - 12:00 PM',
    location: 'Downtown Dar',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 2345,
    description: 'Run through Dar es Salaam\'s streets in this annual marathon. 5K, 10K, and full marathon options.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 5678,
      replayAvailable: true,
      features: ['4K coverage', 'Live tracking', 'Multiple cameras', 'Finish line feed'],
    },
  },
  {
    id: 70,
    title: 'HIIT Bootcamp Class',
    category: 'Sports & Fitness',
    subcategory: 'Fitness Classes',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=600&fit=crop',
    date: 'Wednesday, July 2, 2025',
    time: '6:00 AM - 7:00 AM',
    location: 'Piedmont Park',
    city: 'atlanta',
    price: '$20',
    attendees: 156,
    description: 'High-intensity interval training in the park. All fitness levels welcome. Bring water and mat.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$10',
      isLive: true,
      liveViewers: 234,
      replayAvailable: false,
      features: ['HD streaming', 'Follow along', 'Live coaching'],
    },
  },
  {
    id: 71,
    title: 'Pilates & Stretching',
    category: 'Sports & Fitness',
    subcategory: 'Fitness Classes',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
    date: 'Saturday, July 5, 2025',
    time: '8:00 AM - 9:30 AM',
    location: 'Brooklyn Bridge Park',
    city: 'newyork',
    price: '$25',
    attendees: 234,
    description: 'Outdoor pilates session with scenic views. Focus on core strength, flexibility, and mindful movement.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 72,
    title: 'NBA Finals Watch Party',
    category: 'Sports & Fitness',
    subcategory: 'Sports Events',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    date: 'Thursday, June 19, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'State Farm Arena',
    city: 'atlanta',
    price: '$35 - $75',
    attendees: 3456,
    description: 'Watch the NBA Finals on the big screen with thousands of fans. Food, drinks, and live entertainment.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 73,
    title: 'Football League Finals',
    category: 'Sports & Fitness',
    subcategory: 'Sports Events',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
    date: 'Sunday, June 22, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Amaan Stadium',
    city: 'zanzibar',
    price: 'TSh 10,000 - 30,000',
    attendees: 5678,
    description: 'Championship match of Zanzibar Football League. Intense rivalry and passionate fans guaranteed.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 7,000',
      isLive: true,
      liveViewers: 12345,
      replayAvailable: true,
      features: ['4K streaming', 'Live commentary', 'Replays', 'Match stats'],
    },
  },
  {
    id: 74,
    title: 'Electro Night at Club 360',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c938a2f7?w=800&h=600&fit=crop',
    date: 'Saturday, July 26, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Club 360 Rooftop',
    city: 'newyork',
    price: '$40 - $60',
    attendees: 789,
    description: 'Experience NYC nightlife at its finest. Top EDM DJs spinning all night with stunning city views.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$15',
      isLive: true,
      liveViewers: 1567,
      replayAvailable: true,
      features: ['HD streaming', 'Multiple DJ sets', 'VIP room access'],
    },
  },
  {
    id: 75,
    title: 'Afrobeat Festival',
    category: 'Entertainment',
    subcategory: 'Concerts',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    date: 'Friday, July 25, 2025',
    time: '7:00 PM - 1:00 AM',
    location: 'Mlimani City Grounds',
    city: 'dar',
    price: 'TSh 30,000 - 50,000',
    attendees: 4567,
    description: 'The biggest Afrobeat concert in East Africa featuring Diamond Platnumz, Harmonize, and Zuchu live!',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 8900,
      replayAvailable: true,
      features: ['4K streaming', 'Backstage access', 'Artist meet & greet', 'Multi-camera'],
    },
  },
  {
    id: 76,
    title: 'Opera Under the Stars',
    category: 'Entertainment',
    subcategory: 'Concerts',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop',
    date: 'Saturday, July 19, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Stone Town Palace',
    city: 'zanzibar',
    price: 'TSh 45,000',
    attendees: 456,
    description: 'Classical opera performances in the historic palace gardens under the African night sky.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 20,000',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['HD audio & video', 'Subtitles', 'Program notes'],
    },
  },
  {
    id: 77,
    title: 'Country Music Night',
    category: 'Entertainment',
    subcategory: 'Concerts',
    image: 'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=800&h=600&fit=crop',
    date: 'Thursday, July 24, 2025',
    time: '7:30 PM - 11:00 PM',
    location: 'Chastain Park Amphitheatre',
    city: 'atlanta',
    price: '$55 - $125',
    attendees: 3456,
    description: 'Southern country music stars perform live. Bring your boots and cowboy hats for an authentic experience!',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$30',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['HD streaming', 'Song lyrics', 'Artist interviews'],
    },
  },
  {
    id: 78,
    title: 'Glow Party Experience',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    date: 'Friday, July 18, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'The Loft Midtown',
    city: 'atlanta',
    price: '$30',
    attendees: 567,
    description: 'Glow-in-the-dark party with neon body paint, UV lights, and electric beats. Free glow sticks included!',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 79,
    title: 'Rooftop Sunset Sessions',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    date: 'Sunday, July 20, 2025',
    time: '5:00 PM - 10:00 PM',
    location: '230 Fifth Rooftop',
    city: 'newyork',
    price: '$35',
    attendees: 345,
    description: 'Sunset cocktails with panoramic Manhattan skyline views. Live DJ and craft cocktails.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 80,
    title: 'Digital Marketing Bootcamp',
    category: 'Education',
    subcategory: 'Workshops',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop',
    date: 'Monday, July 21, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'IFM Campus',
    city: 'dar',
    price: 'TSh 60,000',
    attendees: 189,
    description: 'Master digital marketing strategies: SEO, social media, email marketing, and analytics in one day.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 30,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['HD streaming', 'Course materials', 'Certificate', 'Templates'],
    },
  },
  {
    id: 81,
    title: 'Photography Masterclass',
    category: 'Education',
    subcategory: 'Workshops',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop',
    date: 'Saturday, July 26, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Prison Island',
    city: 'zanzibar',
    price: 'TSh 50,000',
    attendees: 145,
    description: 'Learn professional photography techniques in Zanzibar\'s stunning locations. Includes boat trip!',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 82,
    title: 'Leadership Summit 2025',
    category: 'Education',
    subcategory: 'Seminars',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    date: 'Tuesday, July 22, 2025',
    time: '8:00 AM - 4:00 PM',
    location: 'Marriott Marquis',
    city: 'newyork',
    price: '$250',
    attendees: 678,
    description: 'Fortune 500 CEOs share leadership insights. Network with industry leaders and gain executive skills.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$100',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['4K quality', 'All sessions', 'Q&A access', 'Resource pack'],
    },
  },
  {
    id: 83,
    title: 'Financial Literacy Workshop',
    category: 'Education',
    subcategory: 'Seminars',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
    date: 'Wednesday, July 23, 2025',
    time: '2:00 PM - 6:00 PM',
    location: 'Emory University',
    city: 'atlanta',
    price: '$45',
    attendees: 234,
    description: 'Learn personal finance, investing, and wealth building strategies from certified financial planners.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$25',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['HD streaming', 'Financial tools', 'Budget templates', 'Q&A'],
    },
  },
  {
    id: 84,
    title: 'Data Science Webinar',
    category: 'Education',
    subcategory: 'Webinars',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    date: 'Thursday, July 24, 2025',
    time: '6:00 PM - 8:00 PM',
    location: 'Online Event',
    city: 'newyork',
    price: '$20',
    attendees: 1890,
    description: 'Introduction to data science: Python, machine learning, and AI. Ideal for beginners and career changers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$20',
      isLive: true,
      liveViewers: 1678,
      replayAvailable: true,
      features: ['HD quality', 'Code samples', 'Live coding', 'Certificate'],
    },
  },
  {
    id: 85,
    title: 'Swahili Language Course',
    category: 'Education',
    subcategory: 'Webinars',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    date: 'Friday, July 25, 2025',
    time: '5:00 PM - 7:00 PM',
    location: 'Online Event',
    city: 'zanzibar',
    price: 'TSh 15,000',
    attendees: 345,
    description: 'Learn conversational Swahili from native speakers. Perfect for tourists and expats.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 289,
      replayAvailable: true,
      features: ['HD streaming', 'Practice materials', 'Audio files', 'Certificate'],
    },
  },
  {
    id: 86,
    title: 'Sauti za Busara Music Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '6:00 PM - 12:00 AM',
    location: 'Old Fort',
    city: 'zanzibar',
    price: 'TSh 30,000',
    attendees: 4567,
    description: 'East Africa\'s premier music festival showcasing Taarab, Bongo Flava, and traditional music.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 6789,
      replayAvailable: true,
      features: ['4K streaming', 'Multiple stages', 'Artist interviews', 'Festival guide'],
    },
  },
  {
    id: 87,
    title: 'Art Basel Miami Satellite',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '11:00 AM - 7:00 PM',
    location: 'Ponce City Market',
    city: 'atlanta',
    price: '$30',
    attendees: 1234,
    description: 'Contemporary art exhibition featuring emerging and established artists from across the globe.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 88,
    title: 'Pottery & Ceramics Workshop',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
    date: 'Sunday, August 3, 2025',
    time: '2:00 PM - 6:00 PM',
    location: 'Nyumba ya Sanaa',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 78,
    description: 'Hands-on pottery class. Create your own ceramics using traditional and modern techniques.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 89,
    title: 'Broadway Show: Hamilton',
    category: 'Culture',
    subcategory: 'Theater',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    date: 'Friday, July 25, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Richard Rodgers Theatre',
    city: 'newyork',
    price: '$179 - $450',
    attendees: 1319,
    description: 'Experience the Broadway phenomenon that tells the story of American founding father Alexander Hamilton.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 90,
    title: 'Shakespeare in the Park',
    category: 'Culture',
    subcategory: 'Theater',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
    date: 'Saturday, July 26, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Piedmont Park',
    city: 'atlanta',
    price: 'Free',
    attendees: 2345,
    description: 'Free outdoor performance of "A Midsummer Night\'s Dream" by the Atlanta Shakespeare Company.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 1567,
      replayAvailable: true,
      features: ['HD streaming', 'Program notes', 'Director commentary'],
    },
  },
  {
    id: 91,
    title: 'Seafood & Spice Festival',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '12:00 PM - 8:00 PM',
    location: 'Forodhani Gardens',
    city: 'zanzibar',
    price: 'TSh 20,000',
    attendees: 1890,
    description: 'Taste Zanzibar\'s finest seafood and spices. Cooking demos, spice tours, and local delicacies.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 92,
    title: 'Craft Beer Festival',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '2:00 PM - 10:00 PM',
    location: 'Coco Beach',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 1567,
    description: 'Sample craft beers from local and international breweries. Live music and food trucks included.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 93,
    title: 'Swahili Cultural Day',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '10:00 AM - 6:00 PM',
    location: 'Village Museum',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 1234,
    description: 'Experience Swahili culture: traditional dances, crafts, food, and storytelling from coastal communities.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['HD streaming', 'Cultural guide', 'Performance schedule'],
    },
  },
  {
    id: 94,
    title: 'Southern Soul Food Festival',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop',
    date: 'Sunday, August 3, 2025',
    time: '11:00 AM - 7:00 PM',
    location: 'Historic Fourth Ward Park',
    city: 'atlanta',
    price: '$20',
    attendees: 3456,
    description: 'Celebrate Southern cuisine and Black culinary traditions. Gospel music, cooking demos, and tastings.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 95,
    title: 'NY Fashion Week Showcase',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea41f9e6?w=800&h=600&fit=crop',
    date: 'Thursday, July 31, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Spring Studios',
    city: 'newyork',
    price: '$200 - $500',
    attendees: 789,
    description: 'Exclusive runway show featuring Fall 2025 collections from top designers. VIP after-party included.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$75',
      isLive: true,
      liveViewers: 4567,
      replayAvailable: true,
      features: ['4K runway', 'Designer interviews', 'Backstage access', 'Fashion commentary'],
    },
  },
  {
    id: 96,
    title: 'Kitenge Fashion Show',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop',
    date: 'Friday, August 1, 2025',
    time: '6:00 PM - 10:00 PM',
    location: 'Mlimani City',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 567,
    description: 'Showcasing modern African fashion with traditional Kitenge fabrics. Supporting local designers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD runway', 'Designer profiles', 'Fashion tips'],
    },
  },
  {
    id: 97,
    title: 'Sunday Gospel Service',
    category: 'Religion',
    subcategory: 'Worship Services',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '9:00 AM - 12:00 PM',
    location: 'Ebenezer Baptist Church',
    city: 'atlanta',
    price: 'Free',
    attendees: 2345,
    description: 'Uplifting Sunday worship service with powerful gospel choir and inspiring message. All welcome.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 5678,
      replayAvailable: true,
      features: ['HD streaming', 'Live worship', 'Sermon notes', 'Prayer requests'],
    },
  },
  {
    id: 98,
    title: 'Eid al-Fitr Celebration',
    category: 'Religion',
    subcategory: 'Worship Services',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '7:00 AM - 10:00 AM',
    location: 'National Sports Stadium',
    city: 'dar',
    price: 'Free',
    attendees: 12345,
    description: 'Eid prayers and celebration marking the end of Ramadan. Community feast and festivities to follow.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 8900,
      replayAvailable: true,
      features: ['HD streaming', 'Prayer times', 'Sermon translation', 'Eid greetings'],
    },
  },
  {
    id: 99,
    title: 'Buddhist Meditation Retreat',
    category: 'Religion',
    subcategory: 'Religious Gatherings',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    date: 'Saturday, July 26, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Brooklyn Zen Center',
    city: 'newyork',
    price: '$60',
    attendees: 234,
    description: 'Day-long meditation retreat with teachings on mindfulness and compassion. All levels welcome.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$30',
      isLive: false,
      liveViewers: 0,
      replayAvailable: true,
      features: ['HD recording', 'Meditation guides', 'Q&A access'],
    },
  },
  {
    id: 100,
    title: 'Community Prayer Breakfast',
    category: 'Religion',
    subcategory: 'Religious Gatherings',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop',
    date: 'Wednesday, July 30, 2025',
    time: '7:00 AM - 9:00 AM',
    location: 'Hyatt Regency',
    city: 'atlanta',
    price: '$25',
    attendees: 456,
    description: 'Interfaith prayer breakfast bringing together community leaders for fellowship and inspiration.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 101,
    title: 'Crystal Healing Workshop',
    category: 'Religion',
    subcategory: 'Spiritual Events',
    image: 'https://images.unsplash.com/photo-1518070917870-3c8e8d7e95b3?w=800&h=600&fit=crop',
    date: 'Sunday, August 3, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Wellness Center Manhattan',
    city: 'newyork',
    price: '$85',
    attendees: 123,
    description: 'Learn crystal healing techniques for spiritual wellness and energy balancing. Crystals included.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 102,
    title: 'Mindfulness Meditation',
    category: 'Religion',
    subcategory: 'Spiritual Events',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '6:00 AM - 8:00 AM',
    location: 'Coco Beach',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 234,
    description: 'Sunrise meditation on the beach. Connect with nature and find inner peace with guided practice.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: false,
      features: ['HD streaming', 'Meditation guide', 'Live instruction'],
    },
  },
  {
    id: 103,
    title: 'Tech Startup Demo Day',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    date: 'Wednesday, July 30, 2025',
    time: '2:00 PM - 7:00 PM',
    location: 'Atlanta Tech Village',
    city: 'atlanta',
    price: 'Free',
    attendees: 567,
    description: 'Watch 10 startups pitch to investors. Network with entrepreneurs, VCs, and tech innovators.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD streaming', 'Pitch decks', 'Investor feedback', 'Networking chat'],
    },
  },
  {
    id: 104,
    title: 'Silicon Beach Founders Meetup',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    date: 'Thursday, July 31, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Mikocheni Innovation Hub',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 234,
    description: 'Monthly meetup for tech founders and entrepreneurs. Share challenges, solutions, and opportunities.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 105,
    title: 'Women Entrepreneurs Summit',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
    date: 'Friday, August 1, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Serena Hotel',
    city: 'zanzibar',
    price: 'TSh 80,000',
    attendees: 345,
    description: 'Empowering women in business. Workshops, networking, and keynotes from successful female entrepreneurs.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 40,000',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['HD streaming', 'All sessions', 'Workbooks', 'Virtual networking'],
    },
  },
  {
    id: 106,
    title: 'Real Estate Investors Mixer',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop',
    date: 'Tuesday, July 29, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Mandarin Oriental',
    city: 'newyork',
    price: '$50',
    attendees: 456,
    description: 'Network with real estate investors, developers, and agents. Learn about NYC market opportunities.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 107,
    title: 'Cloud Computing Summit',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    date: 'Monday, August 4, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Kilimanjaro Hyatt',
    city: 'dar',
    price: 'TSh 120,000',
    attendees: 789,
    description: 'Explore cloud technologies: AWS, Azure, Google Cloud. Expert speakers and hands-on workshops.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 60,000',
      isLive: true,
      liveViewers: 1567,
      replayAvailable: true,
      features: ['4K streaming', 'All tracks', 'Lab access', 'Certification prep'],
    },
  },
  {
    id: 108,
    title: 'Mobile App Dev Conference',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    date: 'Wednesday, July 30, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'World Trade Center',
    city: 'atlanta',
    price: '$300',
    attendees: 1234,
    description: 'iOS and Android development conference. Latest tools, frameworks, and best practices from industry pros.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$120',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['4K quality', 'Code samples', 'Workshop recordings', 'Developer tools'],
    },
  },
  {
    id: 109,
    title: 'Machine Learning Workshop',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Google Office',
    city: 'newyork',
    price: '$150',
    attendees: 234,
    description: 'Hands-on ML workshop: neural networks, deep learning, and practical AI applications.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$75',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['HD streaming', 'Jupyter notebooks', 'Code repository', 'Q&A'],
    },
  },
  {
    id: 110,
    title: 'Sustainable Tourism Tech Talk',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop',
    date: 'Friday, August 1, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Zanzibar Beach Resort',
    city: 'zanzibar',
    price: 'TSh 20,000',
    attendees: 178,
    description: 'How technology is transforming sustainable tourism in island destinations. Case studies and innovations.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['HD streaming', 'Presentation slides', 'Resources', 'Q&A'],
    },
  },
  {
    id: 111,
    title: 'Triathlon Challenge',
    category: 'Sports & Fitness',
    subcategory: 'Competitions',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '6:00 AM - 2:00 PM',
    location: 'Battery Park',
    city: 'newyork',
    price: '$120',
    attendees: 890,
    description: 'Olympic distance triathlon through NYC: swim, bike, run. Chip timing and medals for all finishers.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['4K coverage', 'Live tracking', 'Split times', 'Finish line cam'],
    },
  },
  {
    id: 112,
    title: 'CrossFit Competition',
    category: 'Sports & Fitness',
    subcategory: 'Competitions',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Atlantic Station',
    city: 'atlanta',
    price: '$85',
    attendees: 456,
    description: 'Regional CrossFit competition. Multiple divisions, cash prizes, and vendor expo.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$20',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD streaming', 'Leaderboard', 'Workout breakdowns', 'Athlete profiles'],
    },
  },
  {
    id: 113,
    title: 'Zumba Beach Party',
    category: 'Sports & Fitness',
    subcategory: 'Fitness Classes',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
    date: 'Sunday, August 3, 2025',
    time: '7:00 AM - 8:30 AM',
    location: 'Nungwi Beach',
    city: 'zanzibar',
    price: 'TSh 10,000',
    attendees: 234,
    description: 'High-energy Zumba class on the beach. Dance fitness with ocean views and tropical vibes.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: false,
      features: ['HD streaming', 'Follow along', 'Playlist'],
    },
  },
  {
    id: 114,
    title: 'Spin Class Marathon',
    category: 'Sports & Fitness',
    subcategory: 'Fitness Classes',
    image: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?w=800&h=600&fit=crop',
    date: 'Saturday, July 26, 2025',
    time: '6:00 AM - 7:00 AM',
    location: 'SoulCycle Msasani',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 145,
    description: 'Intense indoor cycling class with motivating music and inspiring instruction. All levels welcome.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 115,
    title: 'World Cup Watch Party',
    category: 'Sports & Fitness',
    subcategory: 'Sports Events',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop',
    date: 'Sunday, July 27, 2025',
    time: '3:00 PM - 6:00 PM',
    location: 'Madison Square Garden',
    city: 'newyork',
    price: '$45 - $85',
    attendees: 4567,
    description: 'Watch the World Cup Finals on massive screens. Food, drinks, and incredible atmosphere.',
    streaming: {
      available: false,
      quality: 'SD',
    },
  },
  {
    id: 116,
    title: 'Tennis Tournament Finals',
    category: 'Sports & Fitness',
    subcategory: 'Sports Events',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
    date: 'Saturday, August 2, 2025',
    time: '2:00 PM - 8:00 PM',
    location: 'Gymkhana Club',
    city: 'dar',
    price: 'TSh 15,000 - 40,000',
    attendees: 1234,
    description: 'Tanzania National Tennis Championship finals. Watch the country\'s best players compete.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['HD streaming', 'Match stats', 'Player interviews', 'Highlights'],
    },
  },
  // ========== DAR ES SALAAM - LIVE PERFORMANCES (Entertainment) ==========
  {
    id: 117,
    title: 'Bongo Flava Live Concert',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
    date: 'Friday, August 8, 2025',
    time: '8:00 PM - 12:00 AM',
    location: 'Mlimani City Arena',
    city: 'dar',
    price: 'TSh 20,000 - 60,000',
    attendees: 3456,
    description: 'Top Bongo Flava artists perform live. Experience the best of Tanzanian urban music.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 5678,
      replayAvailable: true,
      features: ['Multi-camera', 'Live chat', 'HD quality', 'Backstage access'],
    },
  },
  {
    id: 118,
    title: 'Symphony Orchestra Night',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'National Museum Auditorium',
    city: 'dar',
    price: 'TSh 30,000 - 80,000',
    attendees: 456,
    description: 'Classical music performances by the Dar es Salaam Symphony Orchestra. An evening of timeless masterpieces.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 18,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['4K streaming', 'Program notes', 'Conductor interview'],
    },
  },
  {
    id: 119,
    title: 'Comedy Night Special',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop',
    date: 'Thursday, August 14, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Comedy Club Dar',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 234,
    description: 'Laugh out loud with Tanzania\'s funniest comedians. Stand-up comedy at its best!',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['HD stream', 'Live chat', 'Bonus content'],
    },
  },
  {
    id: 120,
    title: 'Acoustic Sessions at Slipway',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop',
    date: 'Sunday, August 17, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Slipway Amphitheater',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 345,
    description: 'Intimate acoustic performances by local singer-songwriters with ocean views.',
    streaming: {
      available: false,
    },
  },
  {
    id: 121,
    title: 'Gospel Praise Concert',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '5:00 PM - 10:00 PM',
    location: 'Uhuru Stadium',
    city: 'dar',
    price: 'TSh 10,000 - 30,000',
    attendees: 8900,
    description: 'Massive gospel music concert featuring top East African gospel artists. Uplifting worship experience.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 12345,
      replayAvailable: true,
      features: ['HD streaming', 'Live worship', 'Multi-angle cameras'],
    },
  },
  // ========== DAR ES SALAAM - CLUB NIGHTS (Entertainment) ==========
  {
    id: 122,
    title: 'Afro House Night',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '11:00 PM - 6:00 AM',
    location: 'Pepponi Beach Club',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 567,
    description: 'Dance to Afro House beats under the stars. Featuring DJ Black Coffee tribute sets.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: false,
      features: ['HD stream', 'Live DJ sets', 'Party vibes'],
    },
  },
  {
    id: 123,
    title: 'Techno Underground',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c6ce8b5b?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '11:00 PM - 5:00 AM',
    location: 'The Basement TZ',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 234,
    description: 'Underground techno and industrial sounds. For serious electronic music lovers.',
    streaming: {
      available: false,
    },
  },
  {
    id: 124,
    title: 'Hip Hop Party Fridays',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
    date: 'Friday, August 22, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Level 8 Rooftop',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 678,
    description: 'Best hip hop and trap music in Dar. Top DJs spinning the hottest tracks.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['HD quality', 'Live chat', 'DJ mix replays'],
    },
  },
  {
    id: 125,
    title: 'Reggae Vibes Night',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Jahazi Bar & Lounge',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 345,
    description: 'Good vibes only! Reggae, dancehall, and roots music all night long.',
    streaming: {
      available: false,
    },
  },
  {
    id: 126,
    title: 'Amapiano All Night',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c6ce8b5b?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '11:00 PM - 5:00 AM',
    location: 'Sky Lounge Masaki',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 789,
    description: 'Amapiano takeover! South African sounds meet Tanzanian energy.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['HD streaming', 'Live DJ', 'Party atmosphere'],
    },
  },
  // ========== DAR ES SALAAM - THEMED PARTIES (Entertainment) ==========
  {
    id: 127,
    title: 'White Party Beach Edition',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '6:00 PM - 2:00 AM',
    location: 'Coco Beach',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 1234,
    description: 'Exclusive all-white beach party with top DJs, cocktails, and sunset views.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['HD stream', 'Sunset views', 'Party highlights'],
    },
  },
  {
    id: 128,
    title: 'Retro 90s Party',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Vintage Club Dar',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 456,
    description: 'Step back in time! 90s R&B, hip hop, and pop classics all night.',
    streaming: {
      available: false,
    },
  },
  {
    id: 129,
    title: 'Carnival Night',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'Masaki Peninsula Gardens',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 890,
    description: 'Brazilian carnival vibes! Costumes, samba, and non-stop dancing.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['HD quality', 'Costume parade', 'Live performances'],
    },
  },
  {
    id: 130,
    title: 'Glow in the Dark Party',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'UV Club Dar',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 567,
    description: 'Neon lights and UV paint! Dress in white and glow all night.',
    streaming: {
      available: false,
    },
  },
  {
    id: 131,
    title: 'Masquerade Ball',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    date: 'Saturday, September 6, 2025',
    time: '8:00 PM - 1:00 AM',
    location: 'Hyatt Regency Ballroom',
    city: 'dar',
    price: 'TSh 50,000',
    attendees: 345,
    description: 'Elegant masquerade ball with live orchestra, fine dining, and mystery.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 20,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['HD stream', 'Elegant ambiance', 'Live music'],
    },
  },
  // ========== DAR ES SALAAM - NIGHTLIFE (Bars/Lounges) (Entertainment) ==========
  {
    id: 132,
    title: 'Wine & Cheese Evening',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    date: 'Friday, August 8, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Elements Lounge',
    city: 'dar',
    price: 'TSh 40,000',
    attendees: 89,
    description: 'Sophisticated wine tasting with artisanal cheese pairings and live acoustic music.',
    streaming: {
      available: false,
    },
  },
  {
    id: 133,
    title: 'Cocktail Mixology Night',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    date: 'Thursday, August 14, 2025',
    time: '8:00 PM - 12:00 AM',
    location: 'Level 8 Bar',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 156,
    description: 'Watch expert mixologists craft signature cocktails. Rooftop views of the city.',
    streaming: {
      available: false,
    },
  },
  {
    id: 134,
    title: 'Whiskey Tasting Experience',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1527281400156-0a6a0b52ee0d?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'The Cigar Lounge',
    city: 'dar',
    price: 'TSh 60,000',
    attendees: 67,
    description: 'Premium whiskey tasting featuring rare scotches and bourbons. Expert sommelier guidance.',
    streaming: {
      available: false,
    },
  },
  {
    id: 135,
    title: 'Ladies Night at Oyster Bay',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '7:00 PM - 12:00 AM',
    location: 'Oyster Bay Lounge',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 234,
    description: 'Special ladies night with complimentary cocktails and live entertainment.',
    streaming: {
      available: false,
    },
  },
  {
    id: 136,
    title: 'Sunset Terrace Sessions',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    date: 'Sunday, August 24, 2025',
    time: '5:00 PM - 9:00 PM',
    location: 'Slipway Terrace Bar',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 178,
    description: 'Chill Sunday vibes with sunset views, tropical cocktails, and smooth music.',
    streaming: {
      available: false,
    },
  },
  // ========== DAR ES SALAAM - CONFERENCES (Business & Tech) ==========
  {
    id: 137,
    title: 'East Africa Tech Summit',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: 'Wednesday, August 13, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Julius Nyerere Convention Centre',
    city: 'dar',
    price: 'TSh 150,000',
    attendees: 1234,
    description: 'Major tech conference bringing together innovators across East Africa. Keynotes, panels, exhibitions.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 60,000',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['HD streaming', 'Live Q&A', 'Session recordings', 'Digital networking'],
    },
  },
  {
    id: 138,
    title: 'FinTech Innovation Conference',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    date: 'Monday, August 18, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Serena Hotel Conference Hall',
    city: 'dar',
    price: 'TSh 100,000',
    attendees: 567,
    description: 'Explore the future of financial technology in Tanzania. Digital payments, blockchain, and mobile money.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 40,000',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['HD stream', 'Expert panels', 'Networking lounge'],
    },
  },
  {
    id: 139,
    title: 'Digital Transformation Forum',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    date: 'Thursday, August 21, 2025',
    time: '8:30 AM - 5:30 PM',
    location: 'Southern Sun Hotel',
    city: 'dar',
    price: 'TSh 120,000',
    attendees: 456,
    description: 'Learn how businesses are transforming through digital technologies. Case studies and workshops.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 50,000',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['Live sessions', 'Workshop recordings', 'Resources'],
    },
  },
  {
    id: 140,
    title: 'AgriTech Conference Tanzania',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1560264357-8d9202250f21?w=800&h=600&fit=crop',
    date: 'Tuesday, August 26, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Hyatt Regency Dar',
    city: 'dar',
    price: 'TSh 80,000',
    attendees: 678,
    description: 'Technology solutions for agriculture. Smart farming, drones, and data analytics for farmers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 30,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['HD quality', 'Farm tech demos', 'Expert talks'],
    },
  },
  {
    id: 141,
    title: 'Healthcare IT Summit',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '8:00 AM - 4:00 PM',
    location: 'Muhimbili University',
    city: 'dar',
    price: 'TSh 90,000',
    attendees: 345,
    description: 'Digital health innovations: telemedicine, electronic records, and AI diagnostics.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 35,000',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['Medical tech demos', 'Expert panels', 'HD stream'],
    },
  },
  // ========== DAR ES SALAAM - STARTUP EVENTS (Business & Tech) ==========
  {
    id: 142,
    title: 'Startup Weekend Dar',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    date: 'Friday, August 8, 2025',
    time: '6:00 PM - Sunday 8:00 PM',
    location: 'COSTECH Innovation Hub',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 234,
    description: '54-hour startup building event. Form teams, build products, pitch investors.',
    streaming: {
      available: false,
    },
  },
  {
    id: 143,
    title: 'Tech Startup Demo Day',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
    date: 'Wednesday, August 13, 2025',
    time: '3:00 PM - 7:00 PM',
    location: 'Buni Hub',
    city: 'dar',
    price: 'Free',
    attendees: 345,
    description: 'Watch 15 startups showcase their innovations. Investors and mentors in attendance.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 789,
      replayAvailable: true,
      features: ['Startup pitches', 'Live Q&A', 'Investor feedback'],
    },
  },
  {
    id: 144,
    title: 'Venture Capital Meetup',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    date: 'Tuesday, August 19, 2025',
    time: '5:00 PM - 8:00 PM',
    location: 'Seedstars Dar',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 156,
    description: 'Meet venture capitalists investing in East African startups. Networking and insights.',
    streaming: {
      available: false,
    },
  },
  {
    id: 145,
    title: 'Female Founders Summit',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
    date: 'Thursday, August 21, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'She Codes TZ',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 234,
    description: 'Empowering women entrepreneurs. Workshops, mentorship, and funding opportunities.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 10,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['Workshops', 'Mentor sessions', 'HD stream'],
    },
  },
  {
    id: 146,
    title: 'Startup Grind Dar Chapter',
    category: 'Business & Tech',
    subcategory: 'Startup Events',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    date: 'Monday, August 25, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Makutano Coworking',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 178,
    description: 'Monthly Startup Grind meetup featuring successful founder interviews and networking.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['Founder interview', 'Community chat', 'Replay access'],
    },
  },
  // ========== DAR ES SALAAM - NETWORKING (Business & Tech) ==========
  {
    id: 147,
    title: 'Young Professionals Mixer',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    date: 'Thursday, August 7, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Kempinski Hotel Rooftop',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 345,
    description: 'Network with ambitious professionals under 35. Drinks, canapés, and connections.',
    streaming: {
      available: false,
    },
  },
  {
    id: 148,
    title: 'Women in Leadership Summit',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
    date: 'Wednesday, August 13, 2025',
    time: '9:00 AM - 3:00 PM',
    location: 'Dar Business Centre',
    city: 'dar',
    price: 'TSh 40,000',
    attendees: 234,
    description: 'Empowering women leaders across industries. Keynotes, panels, and mentorship circles.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 20,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['Leadership talks', 'Panel discussions', 'Mentorship matching'],
    },
  },
  {
    id: 149,
    title: 'Entrepreneurs Coffee Meetup',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '9:00 AM - 11:00 AM',
    location: 'Cafe Aroma Masaki',
    city: 'dar',
    price: 'Free',
    attendees: 89,
    description: 'Casual Saturday morning coffee for entrepreneurs to share experiences and challenges.',
    streaming: {
      available: false,
    },
  },
  {
    id: 150,
    title: 'Finance Professionals Network',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&h=600&fit=crop',
    date: 'Tuesday, August 19, 2025',
    time: '5:30 PM - 8:00 PM',
    location: 'Serena Hotel',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 156,
    description: 'Exclusive networking for finance professionals. Banking, investment, and accounting sectors.',
    streaming: {
      available: false,
    },
  },
  {
    id: 151,
    title: 'Creative Industries Meetup',
    category: 'Business & Tech',
    subcategory: 'Networking',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop',
    date: 'Thursday, August 28, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Alliance Française',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 234,
    description: 'Network with creatives: designers, artists, filmmakers, and content creators.',
    streaming: {
      available: false,
    },
  },
  // ========== DAR ES SALAAM - TECH TALKS (Business & Tech) ==========
  {
    id: 152,
    title: 'AI & Machine Learning Workshop',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'UDSM Computer Science Lab',
    city: 'dar',
    price: 'TSh 40,000',
    attendees: 145,
    description: 'Hands-on AI workshop covering machine learning fundamentals and practical applications.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 25,000',
      isLive: true,
      liveViewers: 567,
      replayAvailable: true,
      features: ['Code demos', 'Lab sessions', 'Resources'],
    },
  },
  {
    id: 153,
    title: 'Mobile App Development Bootcamp',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    date: 'Monday, August 11, 2025',
    time: '5:00 PM - 8:00 PM',
    location: 'Kinu Innovation Hub',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 234,
    description: 'Learn React Native and Flutter for cross-platform mobile development.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['Live coding', 'Q&A', 'Starter kit'],
    },
  },
  {
    id: 154,
    title: 'Cloud Computing with AWS',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '3:00 PM - 6:00 PM',
    location: 'TechHub Dar',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 178,
    description: 'Introduction to AWS cloud services. EC2, S3, Lambda, and deployment strategies.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 18,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['AWS demos', 'Certification prep', 'Cloud labs'],
    },
  },
  {
    id: 155,
    title: 'Blockchain & Cryptocurrency Tech',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    date: 'Friday, August 22, 2025',
    time: '4:00 PM - 7:00 PM',
    location: 'COSTECH Auditorium',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 267,
    description: 'Understanding blockchain technology, smart contracts, and cryptocurrency ecosystems.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 678,
      replayAvailable: true,
      features: ['Blockchain demos', 'Crypto insights', 'Tech deep-dive'],
    },
  },
  {
    id: 156,
    title: 'IoT & Smart Cities',
    category: 'Business & Tech',
    subcategory: 'Tech Talks',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    date: 'Thursday, August 28, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Tanzania Commission for Science',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 156,
    description: 'Internet of Things applications for smart cities. Sensors, data, and urban innovation.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['IoT demonstrations', 'Case studies', 'Expert Q&A'],
    },
  },
  // ========== DAR ES SALAAM - FESTIVALS (Culture) ==========
  {
    id: 157,
    title: 'Mwaka Kogwa Cultural Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '10:00 AM - 8:00 PM',
    location: 'National Museum Grounds',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 2345,
    description: 'Celebrate Tanzanian New Year traditions with cultural performances, food, and festivities.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['Cultural shows', 'Traditional dances', 'Live performances'],
    },
  },
  {
    id: 158,
    title: 'Dar Art & Music Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '3:00 PM - 11:00 PM',
    location: 'Msasani Peninsula',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 3456,
    description: 'Multi-genre music festival with art installations, food vendors, and craft markets.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['Multi-camera', '4K quality', 'Artist interviews', 'Live chat'],
    },
  },
  {
    id: 159,
    title: 'International Food Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    date: 'Sunday, August 17, 2025',
    time: '11:00 AM - 9:00 PM',
    location: 'Mlimani City Parking',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 4567,
    description: 'Taste cuisines from around the world. Over 50 food vendors and live cooking demos.',
    streaming: {
      available: false,
    },
  },
  {
    id: 160,
    title: 'Coastal Heritage Festival',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Fish Market Cultural Center',
    city: 'dar',
    price: 'TSh 8,000',
    attendees: 1890,
    description: 'Celebrate Swahili coastal culture: dhow rides, traditional fishing, and seafood feasts.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['Cultural immersion', 'Coastal tours', 'Live streaming'],
    },
  },
  {
    id: 161,
    title: 'Book Festival Dar',
    category: 'Culture',
    subcategory: 'Festivals',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'British Council Library',
    city: 'dar',
    price: 'Free',
    attendees: 678,
    description: 'Literary festival with author talks, book signings, poetry readings, and storytelling.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'Free',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['Author talks', 'Poetry sessions', 'Literary discussions'],
    },
  },
  // ========== DAR ES SALAAM - ARTS (Culture) ==========
  {
    id: 162,
    title: 'Contemporary African Art Exhibition',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop',
    date: 'Thursday, August 7, 2025',
    time: '10:00 AM - 6:00 PM',
    location: 'Nafasi Art Space',
    city: 'dar',
    price: 'TSh 10,000',
    attendees: 234,
    description: 'Showcase of contemporary African artists. Paintings, sculptures, and installations.',
    streaming: {
      available: false,
    },
  },
  {
    id: 163,
    title: 'Street Mural Workshop',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '8:00 AM - 4:00 PM',
    location: 'Mwenge Walls',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 67,
    description: 'Learn street art techniques and create a community mural with professional artists.',
    streaming: {
      available: false,
    },
  },
  {
    id: 164,
    title: 'Photography Exhibition: Dar Life',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop',
    date: 'Wednesday, August 13, 2025',
    time: '11:00 AM - 7:00 PM',
    location: 'Nyumba ya Sanaa',
    city: 'dar',
    price: 'TSh 5,000',
    attendees: 345,
    description: 'Photo exhibition capturing daily life in Dar es Salaam by local photographers.',
    streaming: {
      available: false,
    },
  },
  {
    id: 165,
    title: 'Sculpture Garden Opening',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
    date: 'Friday, August 22, 2025',
    time: '5:00 PM - 8:00 PM',
    location: 'Botanical Gardens',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 456,
    description: 'Grand opening of outdoor sculpture garden featuring works by Tanzanian artists.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['Virtual tour', 'Artist interviews', 'HD stream'],
    },
  },
  {
    id: 166,
    title: 'Batik Art Workshop',
    category: 'Culture',
    subcategory: 'Arts',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=600&fit=crop',
    date: 'Sunday, August 24, 2025',
    time: '10:00 AM - 3:00 PM',
    location: 'Mwenge Handicraft Centre',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 89,
    description: 'Traditional batik fabric dyeing workshop. Create your own wearable art.',
    streaming: {
      available: false,
    },
  },
  // ========== DAR ES SALAAM - FOOD & DRINK (Culture) ==========
  {
    id: 167,
    title: 'Seafood Sunset Feast',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    date: 'Friday, August 8, 2025',
    time: '6:00 PM - 10:00 PM',
    location: 'Oyster Bay Beach',
    city: 'dar',
    price: 'TSh 40,000',
    attendees: 234,
    description: 'Fresh Indian Ocean seafood prepared by top chefs. Sunset dining experience.',
    streaming: {
      available: false,
    },
  },
  {
    id: 168,
    title: 'Coffee Roasting Masterclass',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '10:00 AM - 1:00 PM',
    location: 'Tanzania Coffee Board',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 56,
    description: 'Learn the art of coffee roasting with Tanzanian beans. From bean to cup experience.',
    streaming: {
      available: false,
    },
  },
  {
    id: 169,
    title: 'Vegan Food Market',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
    date: 'Sunday, August 17, 2025',
    time: '9:00 AM - 2:00 PM',
    location: 'Masaki Farmers Market',
    city: 'dar',
    price: 'Free entry',
    attendees: 567,
    description: 'Plant-based food vendors, cooking demos, and nutrition workshops.',
    streaming: {
      available: false,
    },
  },
  {
    id: 170,
    title: 'Spice Market Tour & Cooking',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1596040033229-a0b3b83736e0?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '8:00 AM - 2:00 PM',
    location: 'Kariakoo Market',
    city: 'dar',
    price: 'TSh 45,000',
    attendees: 34,
    description: 'Guided spice market tour followed by hands-on Swahili cooking class.',
    streaming: {
      available: false,
    },
  },
  {
    id: 171,
    title: 'Chocolate & Desserts Workshop',
    category: 'Culture',
    subcategory: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=600&fit=crop',
    date: 'Saturday, August 30, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Sweet Creations Studio',
    city: 'dar',
    price: 'TSh 50,000',
    attendees: 45,
    description: 'Learn to make artisanal chocolates and gourmet desserts with a pastry chef.',
    streaming: {
      available: false,
    },
  },
  // ========== DAR ES SALAAM - LOCAL TRADITIONS (Culture) ==========
  {
    id: 172,
    title: 'Ngoma Dance Workshop',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '3:00 PM - 6:00 PM',
    location: 'Village Museum',
    city: 'dar',
    price: 'TSh 15,000',
    attendees: 123,
    description: 'Learn traditional Ngoma drumming and dancing from master instructors.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 8,000',
      isLive: true,
      liveViewers: 234,
      replayAvailable: true,
      features: ['Dance tutorial', 'Cultural context', 'Live performance'],
    },
  },
  {
    id: 173,
    title: 'Traditional Medicine Workshop',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=600&fit=crop',
    date: 'Wednesday, August 13, 2025',
    time: '10:00 AM - 2:00 PM',
    location: 'Traditional Healers Association',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 67,
    description: 'Learn about traditional Tanzanian healing practices and medicinal plants.',
    streaming: {
      available: false,
    },
  },
  {
    id: 174,
    title: 'Basket Weaving Class',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&h=600&fit=crop',
    date: 'Sunday, August 17, 2025',
    time: '9:00 AM - 1:00 PM',
    location: 'Mwenge Artisan Village',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 45,
    description: 'Traditional basket weaving techniques using local materials. Take home your creation.',
    streaming: {
      available: false,
    },
  },
  {
    id: 175,
    title: 'Swahili Poetry Evening',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
    date: 'Friday, August 22, 2025',
    time: '7:00 PM - 9:00 PM',
    location: 'Alliance Française',
    city: 'dar',
    price: 'TSh 8,000',
    attendees: 156,
    description: 'Evening of Swahili poetry (Shairi) recitation and storytelling traditions.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 5,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['Poetry readings', 'Translations', 'Cultural insights'],
    },
  },
  {
    id: 176,
    title: 'Beadwork & Jewelry Making',
    category: 'Culture',
    subcategory: 'Local Traditions',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop',
    date: 'Saturday, August 30, 2025',
    time: '10:00 AM - 3:00 PM',
    location: 'Maasai Cultural Center',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 78,
    description: 'Learn Maasai beadwork techniques and create traditional jewelry pieces.',
    streaming: {
      available: false,
    },
  },
  // ========== DAR ES SALAAM - FASHION EVENTS (Culture) ==========
  {
    id: 177,
    title: 'Dar Fashion Week 2025',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5097?w=800&h=600&fit=crop',
    date: 'Friday, August 8, 2025',
    time: '6:00 PM - 11:00 PM',
    location: 'Hyatt Regency Grand Ballroom',
    city: 'dar',
    price: 'TSh 60,000 - 150,000',
    attendees: 789,
    description: 'Tanzania\'s premier fashion event showcasing top designers. Runway shows and after-party.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: 'TSh 35,000',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['Runway shows', '4K quality', 'Designer interviews', 'Backstage access'],
    },
  },
  {
    id: 178,
    title: 'Kitenge Fashion Show',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Mlimani City Event Hall',
    city: 'dar',
    price: 'TSh 25,000',
    attendees: 456,
    description: 'Celebrate African prints! Modern Kitenge designs by emerging local designers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 12,000',
      isLive: true,
      liveViewers: 890,
      replayAvailable: true,
      features: ['Fashion runway', 'Designer profiles', 'Shopping links'],
    },
  },
  {
    id: 179,
    title: 'Bridal Fashion Expo',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    date: 'Sunday, August 17, 2025',
    time: '11:00 AM - 6:00 PM',
    location: 'Kempinski Hotel',
    city: 'dar',
    price: 'TSh 20,000',
    attendees: 567,
    description: 'Wedding fashion showcase with bridal wear, jewelry, and planning services.',
    streaming: {
      available: false,
    },
  },
  {
    id: 180,
    title: 'Menswear Collection Launch',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'The Slipway',
    city: 'dar',
    price: 'TSh 30,000',
    attendees: 234,
    description: 'Launch of contemporary African menswear collection by designer Aziz Khamis.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 15,000',
      isLive: true,
      liveViewers: 456,
      replayAvailable: true,
      features: ['Collection reveal', 'Designer talk', 'Shopping access'],
    },
  },
  {
    id: 181,
    title: 'Sustainable Fashion Summit',
    category: 'Culture',
    subcategory: 'Fashion Events',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    date: 'Thursday, August 28, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'Nafasi Art Space',
    city: 'dar',
    price: 'TSh 35,000',
    attendees: 178,
    description: 'Discussing sustainable and ethical fashion practices. Panels, workshops, and eco-fashion show.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: 'TSh 18,000',
      isLive: true,
      liveViewers: 345,
      replayAvailable: true,
      features: ['Panel discussions', 'Eco-runway', 'Sustainability guides'],
    },
  },
  // ========== NEW YORK - LIVE PERFORMANCES (Entertainment) ==========
  {
    id: 182,
    title: 'Broadway Stars Concert',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Carnegie Hall',
    city: 'newyork',
    price: '$75 - $250',
    attendees: 2890,
    description: 'Broadway\'s biggest stars perform classic show tunes and contemporary hits.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$35',
      isLive: true,
      liveViewers: 8900,
      replayAvailable: true,
      features: ['4K quality', 'Multi-camera', 'Backstage access', 'Meet & greet'],
    },
  },
  {
    id: 183,
    title: 'Jazz at Lincoln Center',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '7:30 PM - 10:30 PM',
    location: 'Jazz at Lincoln Center',
    city: 'newyork',
    price: '$60 - $150',
    attendees: 1234,
    description: 'World-class jazz musicians perform in NYC\'s premier jazz venue with skyline views.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$25',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['HD stream', 'Jazz classics', 'City views'],
    },
  },
  {
    id: 184,
    title: 'Stand-Up Comedy Showcase',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop',
    date: 'Thursday, August 21, 2025',
    time: '8:00 PM - 10:30 PM',
    location: 'Comedy Cellar',
    city: 'newyork',
    price: '$45',
    attendees: 567,
    description: 'Top comedians from SNL and late-night shows perform in intimate Greenwich Village club.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$20',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['HD quality', 'Comedy legends', 'Live laughs'],
    },
  },
  {
    id: 185,
    title: 'Metropolitan Opera Gala',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '7:00 PM - 10:30 PM',
    location: 'Metropolitan Opera House',
    city: 'newyork',
    price: '$100 - $400',
    attendees: 3800,
    description: 'Grand opera gala featuring world-renowned singers performing timeless classics.',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$50',
      isLive: true,
      liveViewers: 12345,
      replayAvailable: true,
      features: ['4K streaming', 'Orchestra closeups', 'Subtitles', 'Behind scenes'],
    },
  },
  {
    id: 186,
    title: 'Rock Legends Reunion',
    category: 'Entertainment',
    subcategory: 'Live Performances',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '8:00 PM - 12:00 AM',
    location: 'Madison Square Garden',
    city: 'newyork',
    price: '$85 - $350',
    attendees: 20000,
    description: 'Epic rock reunion concert featuring legendary bands. Once in a lifetime performance!',
    streaming: {
      available: true,
      quality: '4K',
      virtualPrice: '$40',
      isLive: true,
      liveViewers: 56789,
      replayAvailable: true,
      features: ['4K quality', 'Multi-angle', 'Encore access', 'Rock history'],
    },
  },
  // ========== NEW YORK - CLUB NIGHTS (Entertainment) ==========
  {
    id: 187,
    title: 'Brooklyn Warehouse Rave',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '11:00 PM - 6:00 AM',
    location: 'Avant Gardner Brooklyn',
    city: 'newyork',
    price: '$40 - $80',
    attendees: 2500,
    description: 'Massive warehouse rave with international techno DJs. Brooklyn\'s biggest party!',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$15',
      isLive: true,
      liveViewers: 5678,
      replayAvailable: false,
      features: ['DJ sets', 'Live visuals', 'Crowd energy'],
    },
  },
  {
    id: 188,
    title: 'House Music Friday',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c6ce8b5b?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Output NYC',
    city: 'newyork',
    price: '$30 - $60',
    attendees: 1200,
    description: 'Deep house and tech house all night. NYC\'s premier electronic music venue.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$12',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['House beats', 'DJ mixes', 'Dance floor cams'],
    },
  },
  {
    id: 189,
    title: 'Latin Night at SOBs',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Saturday, August 16, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'SOBs NYC',
    city: 'newyork',
    price: '$25',
    attendees: 450,
    description: 'Salsa, bachata, and reggaeton. Live band plus DJs. Dance all night!',
    streaming: {
      available: false,
    },
  },
  {
    id: 190,
    title: 'Hip Hop Meets R&B',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
    date: 'Friday, August 22, 2025',
    time: '11:00 PM - 4:00 AM',
    location: 'Webster Hall',
    city: 'newyork',
    price: '$35',
    attendees: 1500,
    description: 'Best of hip hop and R&B from the 90s to now. NYC\'s hottest party.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$15',
      isLive: true,
      liveViewers: 4567,
      replayAvailable: true,
      features: ['Hip hop classics', 'R&B vibes', 'Party atmosphere'],
    },
  },
  {
    id: 191,
    title: 'Disco Fever Revival',
    category: 'Entertainment',
    subcategory: 'Club Nights',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    date: 'Saturday, August 30, 2025',
    time: '10:00 PM - 5:00 AM',
    location: 'Le Bain Rooftop',
    city: 'newyork',
    price: '$40',
    attendees: 600,
    description: 'Disco classics on a rooftop with stunning NYC skyline views. Dress to impress!',
    streaming: {
      available: false,
    },
  },
  // ========== NEW YORK - THEMED PARTIES (Entertainment) ==========
  {
    id: 192,
    title: 'Great Gatsby Roaring 20s Ball',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    date: 'Saturday, August 9, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'Capitale NYC',
    city: 'newyork',
    price: '$75 - $150',
    attendees: 800,
    description: '1920s Gatsby party with jazz band, champagne towers, and period costumes required.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$30',
      isLive: true,
      liveViewers: 2345,
      replayAvailable: true,
      features: ['Jazz live', 'Costume showcase', 'Gatsby vibes'],
    },
  },
  {
    id: 193,
    title: 'Halloween Masquerade Ball',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Gotham Hall',
    city: 'newyork',
    price: '$60',
    attendees: 1200,
    description: 'Spooky elegant masquerade with costume contest, live DJs, and gothic décor.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$25',
      isLive: true,
      liveViewers: 3456,
      replayAvailable: true,
      features: ['Costume parade', 'Gothic atmosphere', 'DJ sets'],
    },
  },
  {
    id: 194,
    title: 'Neon Glow Party',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Schimanski Brooklyn',
    city: 'newyork',
    price: '$35',
    attendees: 1500,
    description: 'Neon lights, glow sticks, UV paint. Wear white and glow all night!',
    streaming: {
      available: false,
    },
  },
  {
    id: 195,
    title: 'Winter Wonderland Gala',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '8:00 PM - 1:00 AM',
    location: 'Cipriani Wall Street',
    city: 'newyork',
    price: '$100',
    attendees: 600,
    description: 'Elegant winter-themed gala with ice sculptures, champagne, and live orchestra.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$40',
      isLive: true,
      liveViewers: 1234,
      replayAvailable: true,
      features: ['Elegant setting', 'Live orchestra', 'Winter magic'],
    },
  },
  {
    id: 196,
    title: 'Superhero Comic Con After-Party',
    category: 'Entertainment',
    subcategory: 'Themed Parties',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    date: 'Saturday, September 6, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Marquee NYC',
    city: 'newyork',
    price: '$45',
    attendees: 900,
    description: 'Dress as your favorite superhero! Comic book themed party with costume prizes.',
    streaming: {
      available: false,
    },
  },
  // ========== NEW YORK - NIGHTLIFE (Bars/Lounges) (Entertainment) ==========
  {
    id: 197,
    title: 'Cocktail Masterclass at PDT',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    date: 'Thursday, August 7, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Please Don\'t Tell (PDT)',
    city: 'newyork',
    price: '$80',
    attendees: 40,
    description: 'Learn craft cocktails in NYC\'s famous speakeasy. Intimate class with expert mixologists.',
    streaming: {
      available: false,
    },
  },
  {
    id: 198,
    title: 'Rooftop Jazz & Wine',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
    date: 'Friday, August 15, 2025',
    time: '6:00 PM - 11:00 PM',
    location: '230 Fifth Rooftop Bar',
    city: 'newyork',
    price: '$50',
    attendees: 300,
    description: 'Live jazz with Empire State Building views. Wine tasting and small plates.',
    streaming: {
      available: false,
    },
  },
  {
    id: 199,
    title: 'Whiskey Tasting Night',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1527281400156-0a6a0b52ee0d?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '7:30 PM - 10:00 PM',
    location: 'The Rum House',
    city: 'newyork',
    price: '$65',
    attendees: 50,
    description: 'Premium whiskey tasting featuring rare bourbons and scotches. Expert-led experience.',
    streaming: {
      available: false,
    },
  },
  {
    id: 200,
    title: 'Sunset Champagne Cruise',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    date: 'Saturday, August 23, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Hudson River Pier 81',
    city: 'newyork',
    price: '$95',
    attendees: 200,
    description: 'Champagne sunset cruise around Manhattan. Live DJ and hors d\'oeuvres.',
    streaming: {
      available: false,
    },
  },
  {
    id: 201,
    title: 'Craft Beer Tasting Event',
    category: 'Entertainment',
    subcategory: 'Nightlife (Bars/Lounges)',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop',
    date: 'Thursday, August 28, 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Brooklyn Brewery',
    city: 'newyork',
    price: '$40',
    attendees: 150,
    description: 'Taste 15+ craft beers from Brooklyn\'s finest brewery. Tour and tasting included.',
    streaming: {
      available: false,
    },
  },
  // ========== NEW YORK - CONFERENCES (Business & Tech) ==========
  {
    id: 202,
    title: 'NY Tech Summit 2025',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: 'Tuesday, August 12, 2025',
    time: '8:00 AM - 7:00 PM',
    location: 'Javits Center',
    city: 'newyork',
    price: '$350 - $750',
    attendees: 5000,
    description: 'Largest tech conference on the East Coast. AI, Web3, cybersecurity, and more.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$150',
      isLive: true,
      liveViewers: 15000,
      replayAvailable: true,
      features: ['Keynotes', 'Workshops', 'Networking', 'Expo hall'],
    },
  },
  {
    id: 203,
    title: 'Wall Street Finance Forum',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    date: 'Thursday, August 14, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'New York Stock Exchange',
    city: 'newyork',
    price: '$500',
    attendees: 1200,
    description: 'Finance leaders discuss market trends, investment strategies, and economic outlook.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$200',
      isLive: true,
      liveViewers: 8900,
      replayAvailable: true,
      features: ['Market insights', 'Expert panels', 'Trading floor tour'],
    },
  },
  {
    id: 204,
    title: 'SaaS Growth Conference',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    date: 'Wednesday, August 20, 2025',
    time: '8:30 AM - 6:00 PM',
    location: 'Metropolitan Pavilion',
    city: 'newyork',
    price: '$400',
    attendees: 2000,
    description: 'SaaS founders and marketers share growth strategies, metrics, and best practices.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$175',
      isLive: true,
      liveViewers: 6789,
      replayAvailable: true,
      features: ['Growth tactics', 'Case studies', 'Networking'],
    },
  },
  {
    id: 205,
    title: 'Data Science & AI Summit',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    date: 'Monday, August 25, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Columbia University',
    city: 'newyork',
    price: '$300',
    attendees: 1500,
    description: 'Latest in machine learning, deep learning, and AI applications across industries.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$120',
      isLive: true,
      liveViewers: 12345,
      replayAvailable: true,
      features: ['AI demos', 'Research papers', 'Hands-on labs'],
    },
  },
  {
    id: 206,
    title: 'E-Commerce Expo NYC',
    category: 'Business & Tech',
    subcategory: 'Conferences',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    date: 'Friday, August 29, 2025',
    time: '10:00 AM - 6:00 PM',
    location: 'Brooklyn Expo Center',
    city: 'newyork',
    price: '$250',
    attendees: 3000,
    description: 'E-commerce strategies, platforms, marketing, and logistics. For online retailers.',
    streaming: {
      available: true,
      quality: 'HD',
      virtualPrice: '$100',
      isLive: true,
      liveViewers: 5678,
      replayAvailable: true,
      features: ['Platform demos', 'Marketing tactics', 'Success stories'],
    },
  },
];

const attendeeImages = [
  'https://images.unsplash.com/photo-1613145997970-db84a7975fbb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
];

function EventDetailModal({ event, onClose, hasTicket, onPurchaseTicket, onPurchaseNormalTicket, onStartConversation }: EventDetailModalProps) {
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [showOrganizerProfile, setShowOrganizerProfile] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [mediaViewerType, setMediaViewerType] = useState<'photo' | 'video'>('photo');

  // Convert event highlights to format expected by MediaViewer
  const photosForViewer = event.eventHighlights?.filter(h => h.mediaType === 'image').map((highlight, index) => ({
    id: index,
    url: highlight.image!,
    likes: Math.floor(Math.random() * 500) + 50,
    eventName: event.title,
  })) || [];

  const videosForViewer = event.eventHighlights?.filter(h => h.mediaType === 'video').map((highlight, index) => ({
    id: index,
    thumbnail: highlight.image || event.image,
    duration: '2:30',
    views: Math.floor(Math.random() * 10000) + 500,
    likes: Math.floor(Math.random() * 500) + 50,
    videoUrl: highlight.video!,
  })) || [];

  // Check if event is saved on mount
  useEffect(() => {
    const saved = localStorage.getItem('eventz_saved_events');
    if (saved) {
      const savedEvents = JSON.parse(saved);
      const isEventSaved = savedEvents.some((e: Event) => e.id === event.id);
      setIsSaved(isEventSaved);
    }
  }, [event.id]);

  // Handle save/unsave event
  const handleToggleSave = () => {
    const saved = localStorage.getItem('eventz_saved_events');
    let savedEvents = saved ? JSON.parse(saved) : [];
    
    if (isSaved) {
      // Remove from saved
      savedEvents = savedEvents.filter((e: Event) => e.id !== event.id);
      toast.success('Event removed from saved', {
        description: 'Check your profile to see all saved events',
        duration: 2000,
      });
    } else {
      // Add to saved (store minimal data)
      const eventToSave = {
        id: event.id,
        name: event.title,
        date: event.date,
        image: event.image,
      };
      savedEvents.push(eventToSave);
      toast.success('Event saved!', {
        description: 'View in your profile under Saved Events',
        duration: 2000,
      });
    }
    
    localStorage.setItem('eventz_saved_events', JSON.stringify(savedEvents));
    setIsSaved(!isSaved);
    
    // Dispatch custom event to notify Profile component
    window.dispatchEvent(new Event('savedEventsUpdated'));
  };



  // Share functions
  const handleShareWhatsApp = () => {
    const eventUrl = window.location.href;
    const text = `Check out ${event.title} on EVENTZ!\n${event.date} at ${event.location}\n${eventUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareEmail = () => {
    const eventUrl = window.location.href;
    const subject = `Check out ${event.title} on EVENTZ`;
    const body = `I thought you might be interested in this event:\n\n${event.title}\n${event.date}\n${event.location}\n\nPrice: ${event.price}\n\n${event.description}\n\nView event: ${eventUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    const eventUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(eventUrl);
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[95vh] overflow-y-auto" onClick={(e) => {
        e.stopPropagation();
        // Close share menu when clicking outside of it
        if (showShareMenu) {
          const target = e.target as HTMLElement;
          if (!target.closest('.share-menu-container')) {
            setShowShareMenu(false);
          }
        }
      }}>
        {/* Cover Image with Overlays */}
        <div className="relative w-full h-96">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          
          {/* Organizer Badge */}
          {event.organizer && (
            <button
              onClick={() => setShowOrganizerProfile(true)}
              className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-20 hover:bg-white transition-all cursor-pointer group"
            >
              <p className="text-gray-900 text-sm group-hover:text-[#8A2BE2] transition-colors">by {event.organizer}</p>
            </button>
          )}
          
          {/* Organizer Profile Modal */}
          {showOrganizerProfile && event.organizer && (
            <OrganizerProfile
              organizerName={event.organizer}
              onClose={() => setShowOrganizerProfile(false)}
              onMessage={(organizer) => {
                setShowOrganizerProfile(false);
                if (onStartConversation) {
                  onStartConversation(organizer);
                }
              }}
            />
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg z-20"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
          
          {/* Minimal gradient overlay - poster fully visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-t-3xl"></div>
        </div>

        <div className="px-6 py-6">
          {/* Event Title with Action Buttons - Professional Layout */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-gray-900 text-lg flex-1">{event.title}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleToggleSave}
                  className={`p-2 border rounded-lg transition-all ${
                    isSaved 
                      ? 'bg-purple-50 border-purple-600 text-purple-600' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isSaved ? 'Unsave event' : 'Save event'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600' : ''}`} />
                </button>
                <div className="relative share-menu-container">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Share event"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-2">
                        <button
                          onClick={handleShareWhatsApp}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">WhatsApp</p>
                            <p className="text-gray-500 text-xs">Share via WhatsApp</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleShareEmail}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">Email</p>
                            <p className="text-gray-500 text-xs">Share via email</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                            {linkCopied ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Copy className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">
                              {linkCopied ? 'Link Copied!' : 'Copy Link'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {linkCopied ? 'Paste anywhere' : 'Copy event link'}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Section - Professional Layout Below Image */}
          <div className="mb-6 space-y-4">
            {/* Date & Time */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">Date & Time</p>
                <p className="text-gray-900">{event.date}</p>
                <p className="text-gray-700 text-sm">{event.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-gray-900">{event.location}</p>
                <p className="text-gray-700 text-sm">{locations.find(l => l.id === event.city)?.name}</p>
              </div>
            </div>
          </div>

          {/* About the Event */}
          <div className="mb-6">
            <h2 className="text-gray-900 mb-3">About the Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Event Photos & Highlights */}
          {event.eventHighlights && event.eventHighlights.length > 0 && (
            <div className="mb-6">
              <h2 className="text-gray-900 mb-3">Event Photos & Highlights</h2>
              <div className="grid grid-cols-3 gap-2">
                {event.eventHighlights.map((highlight, idx) => (
                  <div 
                    key={idx} 
                    className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (highlight.mediaType === 'video') {
                        const videoIndex = event.eventHighlights!.filter(h => h.mediaType === 'video').findIndex(h => h === highlight);
                        setMediaViewerIndex(videoIndex);
                        setMediaViewerType('video');
                      } else {
                        const photoIndex = event.eventHighlights!.filter(h => h.mediaType === 'image').findIndex(h => h === highlight);
                        setMediaViewerIndex(photoIndex);
                        setMediaViewerType('photo');
                      }
                      setShowMediaViewer(true);
                    }}
                  >
                    {highlight.mediaType === 'video' ? (
                      <>
                        <video
                          src={highlight.video}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:bg-white transition-colors">
                            <Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <ImageWithFallback
                        src={highlight.image!}
                        alt={highlight.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Price & Attendees Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Ticket Price</p>
                <p className="text-gray-900">{event.price}</p>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="text-sm">{event.attendees.toLocaleString()} attending</span>
              </div>
            </div>
          </div>

          {/* HD Live Streaming Section - CORE DIFFERENTIATOR */}
          {event.streaming?.available ? (
            <div className="mb-6 border-2 border-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50">
              {/* Streaming Header */}
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Tv className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white mb-1">HD Live Streaming Available</h2>
                      <p className="text-white/90 text-sm">Watch from anywhere in the world</p>
                    </div>
                  </div>
                  {event.streaming.isLive && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full animate-pulse">
                      <Radio className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                {/* Live Viewer Count */}
                {event.streaming.isLive && event.streaming.liveViewers && event.streaming.liveViewers > 0 && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-purple-100 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900">{event.streaming.liveViewers.toLocaleString()} people watching now</span>
                  </div>
                )}

                {/* Streaming Quality & Price */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Tv className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900">Quality</span>
                    </div>
                    <p className="text-purple-600">{event.streaming.quality} Streaming</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl border border-cyan-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900">Virtual Ticket</span>
                    </div>
                    <p className="text-cyan-600">{event.streaming.virtualPrice}</p>
                  </div>
                </div>

                {/* Streaming Features */}
                {event.streaming.features && event.streaming.features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-gray-900 mb-3">Streaming Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {event.streaming.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Replay Availability */}
                {event.streaming.replayAvailable && (
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg mb-4">
                    <Play className="w-5 h-5 text-pink-600" />
                    <span className="text-gray-900">Replay available for 48 hours after event</span>
                  </div>
                )}

                {/* Virtual Ticket CTA */}
                {hasTicket(event.id) ? (
                  <div className="w-full bg-green-500 text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Ticket Purchased ✓</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => onPurchaseTicket(event)}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-4 rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Tv className="w-5 h-5" />
                    <span>Get Virtual Ticket - {event.streaming.virtualPrice}</span>
                  </button>
                )}

                {/* Info Badge */}
                <div className="mt-3 text-center">
                  <p className="text-gray-600 text-sm">
                    🌍 Can't attend in person? Experience it live from home
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-5 bg-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <Tv className="w-6 h-6" />
                <div>
                  <p className="text-gray-900">Live streaming not available</p>
                  <p className="text-sm">This event is in-person only</p>
                </div>
              </div>
            </div>
          )}

          {/* Who's Going */}
          <div className="mb-20">
            <h3 className="text-gray-900 mb-3">Who's Going</h3>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {attendeeImages.slice(0, 4).map((img, idx) => (
                  <ImageWithFallback
                    key={idx}
                    src={img}
                    alt="Attendee"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">+{event.attendees.toLocaleString()} others</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-200">
            {hasTicket(event.id) ? (
              <button className="flex-1 bg-green-500 text-white py-4 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Ticket Purchased ✓
              </button>
            ) : (
              <button 
                onClick={() => onPurchaseNormalTicket(event)}
                className="flex-1 bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Get Ticket - {event.price}
              </button>
            )}
            <button 
              onClick={() => setShowAlertModal(true)}
              className="bg-pink-500 text-white py-4 px-6 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alert Modal */}
        {showAlertModal && (
          <SetAlertModal
            event={{
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location,
            }}
            onClose={() => setShowAlertModal(false)}
          />
        )}

        {/* Media Viewer - Rendered outside modal for engaging photo/video viewing */}
        {showMediaViewer && event.eventHighlights && (
          <MediaViewer
            media={mediaViewerType === 'photo' ? photosForViewer : videosForViewer}
            initialIndex={mediaViewerIndex}
            onClose={() => setShowMediaViewer(false)}
            type={mediaViewerType}
          />
        )}
      </div>
    </div>
  );
}

interface EventDetailsProps {
  onTicketPurchase: (ticket: PurchasedTicket) => void;
  purchasedTickets: PurchasedTicket[];
  conversations: Conversation[];
  onStartConversation: (user: { name: string; username?: string; avatar: string; verified: boolean; isOrganizer?: boolean }) => Conversation;
  onSendMessage: (conversationId: number, messageText: string) => void;
}

export function EventDetails({ onTicketPurchase, purchasedTickets, conversations: globalConversations, onStartConversation, onSendMessage }: EventDetailsProps) {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketFormData, setTicketFormData] = useState({ name: '', email: '' });
  const [eventToPurchase, setEventToPurchase] = useState<Event | null>(null);
  const [showNormalTicketModal, setShowNormalTicketModal] = useState(false);
  const [normalTicketQuantity, setNormalTicketQuantity] = useState(1);
  const [normalTicketStep, setNormalTicketStep] = useState<'quantity' | 'details' | 'confirm'>('quantity');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'events' | 'venues' | 'people'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showTierTicketModal, setShowTierTicketModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'Normal' | 'VIP' | 'VVIP' | null>(null);
  const [tierTicketQuantity, setTierTicketQuantity] = useState(1);
  const [tierTicketStep, setTierTicketStep] = useState<'tier' | 'quantity' | 'details' | 'confirm'>('tier');
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [mediaViewerType, setMediaViewerType] = useState<'photo' | 'video'>('photo');
  
  // Messaging state
  const [showMessages, setShowMessages] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭', subcategories: ['Concerts', 'Club Nights', 'Live Performances', 'Nightlife (Bars/Lounges)', 'Themed Parties'] },
    { id: 'education', name: 'Education', icon: '📚', subcategories: ['Workshops', 'Seminars', 'Webinars'] },
    { id: 'culture', name: 'Culture', icon: '🌍', subcategories: ['Festivals', 'Arts', 'Theater', 'Food & Drink', 'Local Traditions', 'Fashion Events'] },
    { id: 'religion', name: 'Religion', icon: '🙏', subcategories: ['Worship Services', 'Religious Gatherings', 'Spiritual Events'] },
    { id: 'business & tech', name: 'Business & Tech', icon: '💼', subcategories: ['Startup Events', 'Networking', 'Conferences', 'Tech Talks'] },
    { id: 'sports & fitness', name: 'Sports & Fitness', icon: '⚡', subcategories: ['Fitness Classes', 'Competitions', 'Sports Events'] },
  ];

  const filteredEvents = events.filter(event => {
    const locationMatch = selectedLocation === 'all' || event.city === selectedLocation;
    const categoryMatch = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory.toLowerCase();
    const subcategoryMatch = selectedSubcategory === '' || event.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
    return locationMatch && categoryMatch && subcategoryMatch;
  });

  // Filter locations based on search query
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Convert event highlights to format expected by MediaViewer
  const photosForViewer = selectedEvent?.eventHighlights?.filter(h => h.mediaType === 'image').map((highlight, index) => ({
    id: index,
    url: highlight.image!,
    likes: Math.floor(Math.random() * 500) + 50,
    eventName: selectedEvent.title,
  })) || [];

  const videosForViewer = selectedEvent?.eventHighlights?.filter(h => h.mediaType === 'video').map((highlight, index) => ({
    id: index,
    thumbnail: highlight.image || selectedEvent.image,
    duration: '2:30',
    views: Math.floor(Math.random() * 10000) + 500,
    likes: Math.floor(Math.random() * 500) + 50,
    videoUrl: highlight.video!,
  })) || [];

  const handleStartConversationLocal = (user: { name: string; username?: string; avatar: string; verified: boolean; isOrganizer?: boolean }) => {
    // Close user profile modal
    setSelectedUser(null);
    
    // Use the global conversation handler
    const conversation = onStartConversation(user);
    
    // Open the conversation
    setActiveConversation(conversation);
    setShowMessages(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;

    // Create the new message object for optimistic update
    const newMessage: Message = {
      id: Date.now(),
      senderId: 0,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      read: true,
    };

    // Optimistically update local active conversation
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: {
        text: newMessage.text,
        timestamp: 'Just now',
        isRead: true,
      },
    };
    setActiveConversation(updatedConversation);

    // Update the global state
    onSendMessage(activeConversation.id, messageText);

    // Clear the input field
    setMessageText('');
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'entertainment':
        return 'bg-purple-500 text-white';
      case 'business & tech':
        return 'bg-cyan-500 text-white';
      case 'culture':
        return 'bg-amber-600 text-white';
      case 'education':
        return 'bg-blue-500 text-white';
      case 'religion':
        return 'bg-red-600 text-white';
      case 'sports & fitness':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const hasActiveFilters = selectedLocation !== 'all' || selectedCategory !== 'all' || selectedSubcategory !== '';
  const activeFiltersCount = (selectedLocation !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0) + (selectedSubcategory !== '' ? 1 : 0);

  // Handle ticket purchase
  const handlePurchaseTicket = (event: Event) => {
    setEventToPurchase(event);
    setShowTicketModal(true);
    setTicketFormData({ name: '', email: '' });
    if (selectedEvent) {
      setSelectedEvent(null); // Close the event detail modal
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventToPurchase || !ticketFormData.name || !ticketFormData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    // Generate ticket
    const ticketNumber = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const barcode = Math.random().toString().substr(2, 20);
    
    const ticket: PurchasedTicket = {
      id: `ticket-${Date.now()}`,
      eventId: eventToPurchase.id,
      eventTitle: eventToPurchase.title,
      eventDate: eventToPurchase.date,
      eventLocation: eventToPurchase.location,
      ticketNumber,
      barcode,
      purchaseDate: new Date().toISOString(),
      customerName: ticketFormData.name,
      customerEmail: ticketFormData.email,
      price: eventToPurchase.streaming?.virtualPrice || eventToPurchase.price,
    };

    // Save ticket
    onTicketPurchase(ticket);

    // Show success toast
    toast.success('Virtual Ticket Purchased! 🎉', {
      description: `Ticket #${ticketNumber} sent to ${ticketFormData.email}. Check Alerts for details.`,
      duration: 5000,
    });

    // Close modal
    setShowTicketModal(false);
    setEventToPurchase(null);
    setTicketFormData({ name: '', email: '' });
  };

  // Check if user has purchased ticket for an event
  const hasTicket = (eventId: number) => {
    return purchasedTickets.some(ticket => ticket.eventId === eventId);
  };

  // Handle normal ticket purchase
  const handleNormalTicketPurchase = (event: Event) => {
    setEventToPurchase(event);
    
    // Check if event has multiple ticket tiers
    if (event.ticketTiers && event.ticketTiers.length > 0) {
      setShowTierTicketModal(true);
      setTierTicketStep('tier');
      setSelectedTier(null);
      setTierTicketQuantity(1);
    } else {
      setShowNormalTicketModal(true);
      setNormalTicketStep('quantity');
      setNormalTicketQuantity(1);
    }
    
    setTicketFormData({ name: '', email: '' });
    if (selectedEvent) {
      setSelectedEvent(null); // Close the event detail modal
    }
  };

  const handleNormalTicketSubmit = () => {
    if (!eventToPurchase || !ticketFormData.name || !ticketFormData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    // Generate tickets for each quantity
    const tickets: PurchasedTicket[] = [];
    for (let i = 0; i < normalTicketQuantity; i++) {
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const barcode = Math.random().toString().substr(2, 20);
      
      const ticket: PurchasedTicket = {
        id: `ticket-${Date.now()}-${i}`,
        eventId: eventToPurchase.id,
        eventTitle: eventToPurchase.title,
        eventDate: eventToPurchase.date,
        eventLocation: eventToPurchase.location,
        ticketNumber,
        barcode,
        purchaseDate: new Date().toISOString(),
        customerName: ticketFormData.name,
        customerEmail: ticketFormData.email,
        price: eventToPurchase.price,
      };
      tickets.push(ticket);
    }

    // Save all tickets
    tickets.forEach(ticket => onTicketPurchase(ticket));

    // Show success toast
    toast.success(`${normalTicketQuantity} Ticket${normalTicketQuantity > 1 ? 's' : ''} Purchased! 🎉`, {
      description: `Sent to ${ticketFormData.email}. Check Alerts for details.`,
      duration: 5000,
    });

    // Close modal
    setShowNormalTicketModal(false);
    setEventToPurchase(null);
    setTicketFormData({ name: '', email: '' });
    setNormalTicketQuantity(1);
    setNormalTicketStep('quantity');
  };

  // Handle tier ticket purchase submit
  const handleTierTicketSubmit = () => {
    if (!eventToPurchase || !selectedTier || !ticketFormData.name || !ticketFormData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    const tierData = eventToPurchase.ticketTiers?.find(t => t.name === selectedTier);
    if (!tierData) return;

    // Generate tickets for each quantity
    const tickets: PurchasedTicket[] = [];
    for (let i = 0; i < tierTicketQuantity; i++) {
      const ticketNumber = `${selectedTier.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const barcode = Math.random().toString().substr(2, 20);
      
      const ticket: PurchasedTicket = {
        id: `ticket-${Date.now()}-${i}`,
        eventId: eventToPurchase.id,
        eventTitle: eventToPurchase.title,
        eventDate: eventToPurchase.date,
        eventLocation: eventToPurchase.location,
        ticketNumber,
        barcode,
        purchaseDate: new Date().toISOString(),
        customerName: ticketFormData.name,
        customerEmail: ticketFormData.email,
        price: tierData.price,
        ticketType: selectedTier,
      };
      tickets.push(ticket);
    }

    // Save all tickets
    tickets.forEach(ticket => onTicketPurchase(ticket));

    // Show success toast
    toast.success(`${tierTicketQuantity} ${selectedTier} Ticket${tierTicketQuantity > 1 ? 's' : ''} Purchased! 🎉`, {
      description: `Sent to ${ticketFormData.email}. Check Alerts for details.`,
      duration: 5000,
    });

    // Close modal
    setShowTierTicketModal(false);
    setEventToPurchase(null);
    setTicketFormData({ name: '', email: '' });
    setTierTicketQuantity(1);
    setSelectedTier(null);
    setTierTicketStep('tier');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Professional Header with Search & Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-gray-900 text-2xl"><strong>EVENTZ</strong></h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Premium Search Button */}
              <button 
                onClick={() => setShowSearchModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl border border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm">Search</span>
              </button>
              
              {/* Circular Filter Icon */}
              <button 
                onClick={() => setShowFilters(true)}
                className="relative w-11 h-11 bg-white rounded-full border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all shadow-sm flex items-center justify-center"
                title="Filter events"
              >
                <Filter className="w-5 h-5 text-gray-700" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center shadow-md">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Tagline below - clean left-aligned with EVENTZ */}
          <p className="text-gray-600 text-sm">Discover amazing events happening around you</p>
        </div>

        {/* Active Filters Chips - Only shown when filters are active */}
        {hasActiveFilters && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {selectedLocation !== 'all' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                <span>{locations.find(l => l.id === selectedLocation)?.flag}</span>
                <span>{locations.find(l => l.id === selectedLocation)?.name.split(',')[0]}</span>
                <button 
                  onClick={() => setSelectedLocation('all')}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {/* Only show subcategory if it exists, otherwise show main category */}
            {selectedSubcategory !== '' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                <span>🔍</span>
                <span>{selectedSubcategory}</span>
                <button 
                  onClick={() => setSelectedSubcategory('')}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : selectedCategory !== 'all' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                <span>{categories.find(c => c.id === selectedCategory)?.icon}</span>
                <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button 
              onClick={() => {
                setSelectedLocation('all');
                setSelectedCategory('all');
                setSelectedSubcategory('');
              }}
              className="px-3 py-1.5 text-purple-600 text-sm hover:bg-purple-50 rounded-lg transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Subcategory Chips - Show when category is selected */}
        {selectedCategory !== 'all' && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-900 text-sm">
                {categories.find(c => c.id === selectedCategory)?.name} Subcategories:
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories
                .find(c => c.id === selectedCategory)?.subcategories?.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === subcategory ? '' : subcategory)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${ 
                      selectedSubcategory === subcategory
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Events Grid - Cleaner Layout */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Event Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                {/* Streaming Badge */}
                {event.streaming?.available && (
                  <div className="absolute bottom-2 right-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                      <Tv className="w-3 h-3 text-white" />
                      {event.streaming.isLive && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="p-3">
                <h3 className="text-gray-900 mb-2 text-sm line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-1.5 mb-1.5 text-gray-600 text-xs">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{event.date}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 text-sm">Try selecting different filters</p>
          </div>
        )}
      </div>

      {/* Filter Panel Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowFilters(false)}>
          <div className="w-full max-w-4xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            {/* Filter Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-gray-900">Filter Events</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {/* Location Section */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm mb-3">Location</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none"
                  />
                  <div className="absolute top-3 right-3">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border ${
                        selectedLocation === location.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{location.flag}</span>
                      <span>{location.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Section */}
              <div className="mb-6">
                <h3 className="text-gray-900 text-sm mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Footer */}
            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedLocation('all');
                  setSelectedCategory('all');
                  setSelectedSubcategory('');
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Show {filteredEvents.length} Events
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tier Ticket Purchase Modal - PREMIUM MULTI-TIER */}
      {showTierTicketModal && eventToPurchase && (
        <TierTicketModal
          event={{
            id: eventToPurchase.id,
            title: eventToPurchase.title,
            date: eventToPurchase.date,
            location: eventToPurchase.location,
            ticketTiers: eventToPurchase.ticketTiers,
          }}
          step={tierTicketStep}
          selectedTier={selectedTier}
          quantity={tierTicketQuantity}
          formData={ticketFormData}
          onSelectTier={(tier) => setSelectedTier(tier)}
          onQuantityChange={(qty) => setTierTicketQuantity(qty)}
          onFormDataChange={(field, value) => setTicketFormData(prev => ({ ...prev, [field]: value }))}
          onNext={() => {
            if (tierTicketStep === 'tier' && selectedTier) {
              setTierTicketStep('quantity');
            } else if (tierTicketStep === 'quantity') {
              setTierTicketStep('details');
            } else if (tierTicketStep === 'details') {
              setTierTicketStep('confirm');
            }
          }}
          onBack={() => {
            if (tierTicketStep === 'confirm') {
              setTierTicketStep('details');
            } else if (tierTicketStep === 'details') {
              setTierTicketStep('quantity');
            } else if (tierTicketStep === 'quantity') {
              setTierTicketStep('tier');
            }
          }}
          onClose={() => {
            setShowTierTicketModal(false);
            setEventToPurchase(null);
            setSelectedTier(null);
            setTierTicketQuantity(1);
            setTierTicketStep('tier');
            setTicketFormData({ name: '', email: '' });
          }}
          onSubmit={handleTierTicketSubmit}
        />
      )}

      {/* Premium Search Modal */}
      {showSearchModal && (
        <PremiumSearchModal
          onClose={() => setShowSearchModal(false)}
          events={events}
          onEventSelect={(event) => setSelectedEvent(event)}
          onPersonSelect={(person) => setSelectedUser(person)}
        />
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={{
            name: selectedUser.name,
            type: selectedUser.type,
            followers: selectedUser.followers,
            following: '1.2k',
            eventsHosted: selectedUser.type === 'Organizer' ? 24 : undefined,
            eventsAttended: selectedUser.type === 'Attendee' ? 156 : undefined,
            avatar: selectedUser.avatar,
            coverImage: selectedUser.name === 'Buki Jenard' ? 'https://i.ibb.co/F2wGf9R/B-Cover.jpg' : selectedUser.name === 'Luchy Ranks' ? 'https://i.ibb.co/k2Jg34Nv/L-cover.jpg' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
            bio: selectedUser.type === 'Organizer' 
              ? 'Professional event organizer specializing in creating unforgettable experiences. Passionate about bringing people together through music, culture, and celebration.' 
              : selectedUser.type === 'Performer'
              ? 'Professional performer and artist bringing energy and entertainment to events across the globe. Book me for your next event!'
              : 'Event enthusiast and social butterfly. Love discovering new experiences and meeting amazing people!',
            location: selectedUser.location,
            verified: selectedUser.verified,
            joinedDate: 'January 2023',
            email: selectedUser.name.toLowerCase().replace(' ', '.') + '@eventz.com',
            phone: '+255 712 345 678',
            instagram: selectedUser.name.toLowerCase().replace(' ', ''),
            twitter: selectedUser.name.toLowerCase().replace(' ', '_'),
            highlights: selectedUser.type === 'Organizer' ? [
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop',
                title: 'Summer Festival 2024',
                date: 'Dec 15, 2024',
                attendees: 4500,
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop',
                title: 'New Year Bash',
                date: 'Jan 1, 2025',
                attendees: 5200,
              },
            ] : selectedUser.type === 'Attendee' ? [
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
                title: 'Afrobeat Festival',
                date: 'Nov 20, 2024',
                attendees: 3200,
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
                title: 'Jazz Night Live',
                date: 'Dec 8, 2024',
                attendees: 1800,
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop',
                title: 'Summer Jungle Party',
                date: 'Oct 15, 2024',
                attendees: 5600,
              },
              {
                id: 4,
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
                title: 'Tropical Vibes Beach Festival',
                date: 'Sep 22, 2024',
                attendees: 4200,
              },
              {
                id: 5,
                image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
                title: 'Hennessy Artistry Night',
                date: 'Aug 18, 2024',
                attendees: 2900,
              },
              {
                id: 6,
                image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
                title: 'Amapiano Live Concert',
                date: 'Jul 30, 2024',
                attendees: 6800,
              },
              {
                id: 7,
                image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop',
                title: 'Sunset Beach Party',
                date: 'Jul 10, 2024',
                attendees: 3500,
              },
              {
                id: 8,
                image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop',
                title: 'Vintage Space Music Festival',
                date: 'Jun 25, 2024',
                attendees: 7200,
              },
              {
                id: 9,
                image: 'https://images.unsplash.com/photo-1607313029691-fa108ddf807d?w=400&h=300&fit=crop',
                title: 'Island Rhythm Bash',
                date: 'Jun 5, 2024',
                attendees: 4100,
              },
              {
                id: 10,
                image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop',
                title: 'Afro House Night',
                date: 'May 18, 2024',
                attendees: 5300,
              },
              {
                id: 11,
                image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop',
                title: 'Bongo Flava Live',
                date: 'Apr 28, 2024',
                attendees: 8900,
              },
              {
                id: 12,
                image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop',
                title: 'Coastal Chillout Sessions',
                date: 'Apr 10, 2024',
                attendees: 2700,
              },
              {
                id: 13,
                image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=400&h=300&fit=crop',
                title: 'Nyama Choma Festival',
                date: 'Mar 22, 2024',
                attendees: 6500,
              },
              {
                id: 14,
                image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop',
                title: 'Zanzibar Beach Rave',
                date: 'Mar 8, 2024',
                attendees: 9200,
              },
              {
                id: 15,
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
                title: 'New Year Eve Party 2024',
                date: 'Jan 1, 2024',
                attendees: 12000,
              },
            ] : undefined,
            photos: selectedUser.type === 'Organizer' ? [
              { id: 1, image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop', size: 'large' as const },
              { id: 2, image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 3, image: 'https://images.unsplash.com/photo-1607313029691-fa108ddf807d?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 4, image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop', size: 'large' as const },
              { id: 5, image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 6, image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop', size: 'small' as const },
            ] : selectedUser.type === 'Attendee' ? [
              { id: 1, image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop', size: 'large' as const },
              { id: 2, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 3, image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 4, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', size: 'large' as const },
              { id: 5, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', size: 'small' as const },
              { id: 6, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', size: 'small' as const },
            ] : undefined,
            upcomingEvents: selectedUser.type === 'Organizer' ? [
              {
                id: 9,
                title: 'Island Vibes - Live Performance Night',
                date: '15 Jun',
                time: '10:00 PM',
                location: selectedUser.location,
                image: harmonizePoster,
                attendees: 2345,
                price: 'TSh 22,000',
              },
              {
                id: 10,
                title: 'Hennessy Artistry Night',
                date: '20 Jul',
                time: '9:00 PM',
                location: selectedUser.location,
                image: hennessyPoster,
                attendees: 1890,
                price: 'TSh 25,000',
              },
            ] : undefined,
            stats: selectedUser.type === 'Organizer' ? {
              totalEvents: 24,
              totalAttendees: 48500,
              avgRating: 4.8,
              reviewsCount: 342,
            } : undefined,
          }}
          onClose={() => setSelectedUser(null)}
          onFollow={() => {
            toast.success(`You are now following ${selectedUser.name}!`);
          }}
          onMessage={() => {
            handleStartConversationLocal(selectedUser);
          }}
        />
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          hasTicket={hasTicket}
          onPurchaseTicket={handlePurchaseTicket}
          onPurchaseNormalTicket={handleNormalTicketPurchase}
          onStartConversation={handleStartConversationLocal}
        />
      )}

      {/* Ticket Purchase Modal */}
      {showTicketModal && eventToPurchase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTicketModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={() => setShowTicketModal(false)}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button 
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div>
                <h2 className="text-gray-900 text-2xl mb-1">Purchase Virtual Ticket</h2>
                <p className="text-gray-600">{eventToPurchase.title}</p>
              </div>
            </div>

            {/* Event Info */}
            <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700">Virtual Ticket Price</p>
                  <p className="text-purple-600">{eventToPurchase.streaming?.virtualPrice}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  {eventToPurchase.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {eventToPurchase.location}
                </p>
              </div>
            </div>

            {/* Purchase Form */}
            <form onSubmit={handleTicketSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={ticketFormData.name}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={ticketFormData.email}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Ticket will be sent to this email</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 mb-2">Included with your ticket:</p>
                <ul className="space-y-2">
                  {eventToPurchase.streaming?.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Access to live stream
                  </li>
                  {eventToPurchase.streaming?.replayAvailable && (
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      48-hour replay access
                    </li>
                  )}
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-4 rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg"
              >
                Complete Purchase
              </button>
            </form>

            {/* Note */}
            <p className="text-gray-500 text-xs text-center mt-4">
              ✉️ You'll receive your ticket confirmation via email with access details
            </p>
          </div>
        </div>
      )}

      {/* Normal Ticket Purchase Modal - SUPER EASY FLOW */}
      {showNormalTicketModal && eventToPurchase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNormalTicketModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Step 1: Select Quantity */}
            {normalTicketStep === 'quantity' && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900 text-2xl mb-1">Get Tickets</h2>
                    <p className="text-gray-600">{eventToPurchase.title}</p>
                  </div>
                  <button 
                    onClick={() => setShowNormalTicketModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Event Preview */}
                <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src={eventToPurchase.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{eventToPurchase.title}</p>
                      <p className="text-sm text-gray-600">{eventToPurchase.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Price per ticket</span>
                    <span className="text-purple-600">{eventToPurchase.price}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-gray-900 mb-3">How many tickets?</label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setNormalTicketQuantity(Math.max(1, normalTicketQuantity - 1))}
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-700"
                    >
                      <span className="text-2xl">−</span>
                    </button>
                    <div className="text-center">
                      <div className="text-4xl text-purple-600 mb-1">{normalTicketQuantity}</div>
                      <div className="text-sm text-gray-600">ticket{normalTicketQuantity > 1 ? 's' : ''}</div>
                    </div>
                    <button
                      onClick={() => setNormalTicketQuantity(normalTicketQuantity + 1)}
                      className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center text-white"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl">
                      {eventToPurchase.price.includes('TSh') 
                        ? `TSh ${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                        : eventToPurchase.price.includes('$')
                        ? `$${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                        : eventToPurchase.price
                      }
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setNormalTicketStep('details')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Enter Details */}
            {normalTicketStep === 'details' && (
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <button 
                    onClick={() => setNormalTicketStep('quantity')}
                    className="text-purple-600 hover:text-purple-700 mb-3 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="text-gray-900 text-2xl mb-1">Your Details</h2>
                  <p className="text-gray-600">Almost there! Just need a few details</p>
                </div>

                {/* Quick Summary */}
                <div className="mb-6 p-3 bg-purple-50 rounded-xl flex items-center justify-between">
                  <span className="text-gray-700">{normalTicketQuantity} ticket{normalTicketQuantity > 1 ? 's' : ''}</span>
                  <span className="text-purple-600">
                    {eventToPurchase.price.includes('TSh') 
                      ? `TSh ${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                      : eventToPurchase.price.includes('$')
                      ? `$${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                      : eventToPurchase.price
                    }
                  </span>
                </div>

                {/* Simple Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={ticketFormData.name}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={ticketFormData.email}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-gray-500 text-sm mt-1">📧 Tickets will be sent here</p>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => {
                    if (ticketFormData.name && ticketFormData.email) {
                      setNormalTicketStep('confirm');
                    } else {
                      toast.error('Please fill in all fields');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
                >
                  Review Order
                </button>
              </div>
            )}

            {/* Step 3: Confirm */}
            {normalTicketStep === 'confirm' && (
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <button 
                    onClick={() => setNormalTicketStep('details')}
                    className="text-purple-600 hover:text-purple-700 mb-3 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="text-gray-900 text-2xl mb-1">Confirm Purchase</h2>
                  <p className="text-gray-600">Review your order</p>
                </div>

                {/* Order Summary */}
                <div className="mb-6 space-y-3">
                  {/* Event */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Event</p>
                    <p className="text-gray-900">{eventToPurchase.title}</p>
                    <p className="text-sm text-gray-600">{eventToPurchase.date}</p>
                    <p className="text-sm text-gray-600">{eventToPurchase.location}</p>
                  </div>

                  {/* Customer */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Ticket Holder</p>
                    <p className="text-gray-900">{ticketFormData.name}</p>
                    <p className="text-sm text-gray-600">{ticketFormData.email}</p>
                  </div>

                  {/* Tickets */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tickets</p>
                        <p className="text-gray-900">{normalTicketQuantity} × {eventToPurchase.price}</p>
                      </div>
                      <p className="text-2xl text-purple-600">
                        {eventToPurchase.price.includes('TSh') 
                          ? `TSh ${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                          : eventToPurchase.price.includes('$')
                          ? `$${(parseInt(eventToPurchase.price.replace(/[^\d]/g, '')) * normalTicketQuantity).toLocaleString()}`
                          : eventToPurchase.price
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You'll Get */}
                <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    What you'll receive
                  </p>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>✅ {normalTicketQuantity} digital ticket{normalTicketQuantity > 1 ? 's' : ''} via email</li>
                    <li>✅ Unique ticket number & barcode</li>
                    <li>✅ Event details & location</li>
                    <li>✅ Entry to {eventToPurchase.title}</li>
                  </ul>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleNormalTicketSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Confirm & Purchase
                </button>
                <p className="text-gray-500 text-xs text-center mt-3">
                  🔒 Secure checkout
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Media Viewer - For engaging photo and video viewing */}
      {showMediaViewer && (
        <MediaViewer
          media={mediaViewerType === 'photo' ? photosForViewer : videosForViewer}
          initialIndex={mediaViewerIndex}
          onClose={() => setShowMediaViewer(false)}
          type={mediaViewerType}
        />
      )}

      {/* Messaging Panel */}
      {showMessages && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => {
          if (!activeConversation) setShowMessages(false);
        }}>
          <div 
            className="absolute right-0 top-0 w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {!activeConversation ? (
              <>
                {/* Conversations List Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-gray-900">Messages</h2>
                  <button
                    onClick={() => setShowMessages(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {globalConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-500 text-sm">Start a conversation with organizers or other users!</p>
                    </div>
                  ) : (
                    globalConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversation(conv)}
                        className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <div className="relative">
                          <ImageWithFallback
                            src={conv.user.avatar}
                            alt={conv.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#8A2BE2] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-900 text-sm font-medium">{conv.user.name}</span>
                              {conv.user.verified && (
                                <CheckCircle2 className="w-4 h-4 text-white fill-[#8A2BE2]" />
                              )}
                            </div>
                            <span className="text-gray-400 text-xs">{conv.lastMessage.timestamp}</span>
                          </div>
                          <p className={`text-sm line-clamp-1 ${conv.lastMessage.isRead ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                            {conv.lastMessage.text}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Active Conversation Header - Purple Gradient */}
                <div className="bg-[#8A2BE2] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    
                    <div className="relative">
                      <ImageWithFallback
                        src={activeConversation.user.avatar}
                        alt={activeConversation.user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                      />
                      {activeConversation.user.isOrganizer && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#8A2BE2] rounded-full flex items-center justify-center ring-2 ring-white">
                          <Star className="w-2 h-2 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-white font-bold truncate">
                          {activeConversation.user.name}
                        </h3>
                        {activeConversation.user.verified && (
                          <div className="flex-shrink-0 w-4 h-4 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white/80 text-xs">{activeConversation.user.username}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveConversation(null);
                        setShowMessages(false);
                      }}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4">
                  {activeConversation.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeConversation.messages.map((msg) => {
                        const isMe = msg.senderId === 0;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-2xl px-4 py-2.5 ${
                                  isMe
                                    ? 'bg-[#8A2BE2] text-white'
                                    : 'bg-white text-gray-900 shadow-sm'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                              </div>
                              <span className={`text-xs text-gray-400 mt-1 block ${
                                isMe ? 'text-right' : 'text-left'
                              }`}>
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="w-10 h-10 bg-[#8A2BE2] text-white rounded-full flex items-center justify-center hover:bg-[#7526c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}