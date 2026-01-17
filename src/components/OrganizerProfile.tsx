import { useState } from 'react';
import { X, MapPin, Calendar, Users, CheckCircle2, Star, Share2, Heart, Play, ChevronLeft, MessageCircle, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MediaViewer } from './MediaViewer';
import { PurchasedTicket } from '../App';
import { toast } from 'sonner@2.0.3';

interface OrganizerData {
  name: string;
  bio: string;
  coverImage: string;
  avatar: string;
  location: string;
  totalEvents: number;
  followers: number;
  verified: boolean;
  rating: number;
  phone?: string;
  whatsapp?: string;
  highlights: {
    id: number;
    image: string;
    video?: string;
    title: string;
    date: string;
    attendees: number;
  }[];
  photos: {
    id: number;
    image: string;
    size: 'small' | 'large';
    eventName?: string;
  }[];
  upcomingEvents: {
    id: number;
    title: string;
    image: string;
    date: string;
    time: string;
    location: string;
    price: string;
  }[];
}

interface OrganizerProfileProps {
  organizerName: string;
  onClose: () => void;
  onTicketPurchase?: (ticket: PurchasedTicket) => void;
  onMessage?: (organizer: { name: string; avatar: string; verified: boolean; isOrganizer: boolean }) => void;
}

// Mock organizer data
const organizersData: { [key: string]: OrganizerData } = {
  'STR8 OUT VIBES': {
    name: 'STR8 OUT VIBES',
    bio: 'Premier music festival organizer and nightlife experience curator in Dar es Salaam. Specializing in themed parties and unforgettable nightlife experiences that bring together the best of Tanzanian entertainment culture.',
    coverImage: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 73,
    followers: 28400,
    verified: true,
    rating: 4.9,
    phone: '+255 754 123 456',
    whatsapp: '+255754123456',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Summer Jungle',
        date: 'Jan 1, 2025',
        attendees: 5600,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Music Fest',
        date: 'Dec 15, 2024',
        attendees: 8200,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop', size: 'large', eventName: 'Summer Jungle' },
      { id: 2, image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop', size: 'small', eventName: 'Music Fest' },
      { id: 3, image: 'https://images.unsplash.com/photo-1607313029691-fa108ddf807d?w=400&h=300&fit=crop', size: 'small', eventName: 'Beach Festival' },
      { id: 4, image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop', size: 'small', eventName: 'Desert Party' },
      { id: 5, image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop', size: 'large', eventName: 'Night Vibes' },
      { id: 6, image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop', size: 'small', eventName: 'Club Night' },
      { id: 7, image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=400&h=300&fit=crop', size: 'small', eventName: 'Tropical Beats' },
      { id: 8, image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop', size: 'large', eventName: 'Sunset Sessions' },
      { id: 9, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', size: 'small', eventName: 'Live Concert' },
      { id: 10, image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop', size: 'small', eventName: 'Dance Party' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Afro Beats Festival 2025',
        image: 'https://images.unsplash.com/photo-1764050359179-517599dab87b?w=400&h=300&fit=crop',
        date: '10 Jun',
        time: '6:00 PM',
        location: 'The Park',
        price: 'TSh 15,000',
      },
      {
        id: 2,
        title: 'Island Rhythm Bash',
        image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop',
        date: '12 Jun',
        time: '8:00 PM',
        location: 'The Club',
        price: 'TSh 25,000',
      },
      {
        id: 3,
        title: 'Coastal Chillout',
        image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop',
        date: '15 Jun',
        time: '5:00 PM',
        location: 'Coco Beach',
        price: 'TSh 20,000',
      },
      {
        id: 4,
        title: 'Dune Dance Party',
        image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop',
        date: '20 Jun',
        time: '7:00 PM',
        location: 'Desert View',
        price: 'TSh 30,000',
      },
    ],
  },
  'WE OUTCHEA': {
    name: 'WE OUTCHEA',
    bio: 'Dar es Salaam\'s premier nightlife destination specializing in themed parties and unforgettable nightlife experiences. Creating vibrant atmospheres where music, culture, and entertainment come alive.',
    coverImage: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 89,
    followers: 12300,
    verified: true,
    rating: 4.8,
    phone: '+255 765 234 567',
    whatsapp: '+255765234567',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Tropical Nights Party',
        date: 'Dec 10, 2024',
        attendees: 3200,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        title: 'Neon Glow Bash',
        date: 'Nov 5, 2024',
        attendees: 2800,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=400&h=300&fit=crop', size: 'large', eventName: 'Tropical Nights Party' },
      { id: 2, image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop', size: 'small', eventName: 'Neon Glow Bash' },
      { id: 3, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop', size: 'small', eventName: 'Saturday Night Fever' },
      { id: 4, image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?w=400&h=300&fit=crop', size: 'large', eventName: 'Urban Beats Night' },
      { id: 5, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', size: 'small', eventName: 'Themed Party' },
      { id: 6, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', size: 'small', eventName: 'Weekend Vibes' },
      { id: 7, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', size: 'large', eventName: 'Dance Floor Night' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Masquerade Night - Themed Party',
        image: 'https://images.unsplash.com/photo-1675674683873-1232862e3c64?w=400&h=300&fit=crop',
        date: '28 Jun',
        time: '10:00 PM',
        location: 'WE OUTCHEA, Dar es Salaam',
        price: 'TSh 15,000',
      },
    ],
  },
  'Wavuvi Camp': {
    name: 'Wavuvi Camp',
    bio: 'Iconic bar and restaurant on Dar es Salaam\'s coastline, renowned for legendary sunrise parties and electrifying live performances. Where the night transforms into unforgettable nightlife experiences by the ocean.',
    coverImage: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 64,
    followers: 8700,
    verified: true,
    rating: 5.0,
    phone: '+255 776 345 678',
    whatsapp: '+255776345678',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Sunrise Party 2024',
        date: 'Dec 20, 2024',
        attendees: 1450,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        title: 'Live Band Weekend',
        date: 'Nov 15, 2024',
        attendees: 920,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop', size: 'large', eventName: 'Sunrise Party 2024' },
      { id: 2, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop', size: 'small', eventName: 'Live Band Weekend' },
      { id: 3, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', size: 'small', eventName: 'Coastline Vibes' },
      { id: 4, image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop', size: 'large', eventName: 'Beach Sunset' },
      { id: 5, image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop', size: 'small', eventName: 'Ocean Night' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Sunrise Beach Party',
        image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        date: '19 Jun',
        time: '5:30 AM',
        location: 'Wavuvi Camp, Dar es Salaam',
        price: 'TSh 12,000',
      },
    ],
  },
  'Kidimbwi Club': {
    name: 'Kidimbwi Club',
    bio: 'Beachfront party destination and restaurant in Dar es Salaam, delivering exceptional nightlife party experiences. Where oceanfront dining meets high-energy entertainment in a tropical paradise setting.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 156,
    followers: 18900,
    verified: true,
    rating: 4.9,
    phone: '+255 787 456 789',
    whatsapp: '+255787456789',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Beachfront Sunset Party',
        date: 'Dec 5, 2024',
        attendees: 2890,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Oceanside Groove Night',
        date: 'Nov 22, 2024',
        attendees: 2150,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', size: 'large', eventName: 'Beachfront Sunset Party' },
      { id: 2, image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop', size: 'small', eventName: 'Oceanside Groove Night' },
      { id: 3, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop', size: 'small', eventName: 'Tropical Beach Night' },
      { id: 4, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', size: 'large', eventName: 'Oceanfront Party' },
      { id: 5, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', size: 'small', eventName: 'Beachside Vibes' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Beach Nightlife Experience',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        date: '23 Jun',
        time: '9:00 PM',
        location: 'Kidimbwi Club, Dar es Salaam',
        price: 'TSh 18,000',
      },
    ],
  },
  'Tiki Beach': {
    name: 'Tiki Beach',
    bio: 'Premier Zanzibar nightlife venue featuring epic live performances, themed parties, and immersive nightlife experiences. Where island paradise meets world-class entertainment under Zanzibar\'s starlit skies.',
    coverImage: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
    location: 'Zanzibar, Tanzania',
    totalEvents: 98,
    followers: 22100,
    verified: true,
    rating: 4.9,
    phone: '+255 773 567 890',
    whatsapp: '+255773567890',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Paradise Beach Festival',
        date: 'Jan 10, 2025',
        attendees: 6700,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        title: 'Sunset Sessions',
        date: 'Dec 18, 2024',
        attendees: 3900,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop', size: 'large', eventName: 'Paradise Beach Festival' },
      { id: 2, image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=400&h=300&fit=crop', size: 'small', eventName: 'Sunset Sessions' },
      { id: 3, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', size: 'small', eventName: 'Island Paradise Night' },
      { id: 4, image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop', size: 'large', eventName: 'Tiki Beach Party' },
      { id: 5, image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=300&fit=crop', size: 'small', eventName: 'Tropical Nights' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Zanzibar Beach Festival',
        image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=400&h=300&fit=crop',
        date: '7 Jul',
        time: '2:00 PM',
        location: 'Nungwi Beach',
        price: 'Free',
      },
    ],
  },
  'Shanga': {
    name: 'Shanga',
    bio: 'Zanzibar\'s hotspot for electrifying live performances, themed nightlife parties, and unforgettable entertainment experiences. Where every night becomes a celebration of music, culture, and energy.',
    coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=200&fit=crop',
    location: 'Zanzibar, Tanzania',
    totalEvents: 210,
    followers: 31200,
    verified: true,
    rating: 4.8,
    phone: '+255 784 678 901',
    whatsapp: '+255784678901',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Live Afrobeat Night',
        date: 'Dec 15, 2024',
        attendees: 4500,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Themed Dance Party',
        date: 'Nov 30, 2024',
        attendees: 5200,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop', size: 'large', eventName: 'Live Afrobeat Night' },
      { id: 2, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', size: 'small', eventName: 'Themed Dance Party' },
      { id: 3, image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop', size: 'small', eventName: 'Beach Sunset Sessions' },
      { id: 4, image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop', size: 'large', eventName: 'Zanzibar Music Festival' },
      { id: 5, image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop', size: 'small', eventName: 'Island Vibes Night' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Island Vibes - Live Performance Night',
        image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop',
        date: '15 Jun',
        time: '10:00 PM',
        location: 'Shanga, Zanzibar',
        price: 'TSh 22,000',
      },
    ],
  },
  'Jambo Beach Party': {
    name: 'Jambo Beach Party',
    bio: 'Zanzibar\'s premier beach club featuring nightlife party experiences with Afro music, house music, and beachside entertainment. The ultimate destination for music lovers and party enthusiasts.',
    coverImage: 'https://images.unsplash.com/photo-1764510377576-d2dd1cbd121d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=200&h=200&fit=crop',
    location: 'Zanzibar, Tanzania',
    totalEvents: 142,
    followers: 19600,
    verified: true,
    rating: 4.7,
    phone: '+255 755 789 012',
    whatsapp: '+255755789012',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1764510377576-d2dd1cbd121d?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Beach Afro House Night',
        date: 'Jan 5, 2025',
        attendees: 2100,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        title: 'Full Moon Beach Party',
        date: 'Dec 12, 2024',
        attendees: 1800,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1764510377576-d2dd1cbd121d?w=400&h=300&fit=crop', size: 'large', eventName: 'Beach Afro House Night' },
      { id: 2, image: 'https://images.unsplash.com/photo-1751998689590-f7ae39d9d218?w=400&h=300&fit=crop', size: 'small', eventName: 'Full Moon Beach Party' },
      { id: 3, image: 'https://images.unsplash.com/photo-1571266028243-d220ee3118ca?w=400&h=300&fit=crop', size: 'small', eventName: 'Beachside Groove' },
      { id: 4, image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=400&h=300&fit=crop', size: 'large', eventName: 'Tropical Beach Bash' },
      { id: 5, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', size: 'small', eventName: 'Afro Beats Night' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Afro House Beach Party',
        image: 'https://images.unsplash.com/photo-1764510377576-d2dd1cbd121d?w=400&h=300&fit=crop',
        date: '21 Jun',
        time: '9:00 PM',
        location: 'Jambo Beach Party, Zanzibar',
        price: 'TSh 20,000',
      },
    ],
  },
  'Summer Jungle': {
    name: 'Summer Jungle',
    bio: 'Zanzibar\'s legendary bush club bringing nightlife party experiences with Afro music, house music, and outdoor festival vibes. Experience the wild side of island nightlife in nature\'s embrace.',
    coverImage: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    location: 'Zanzibar, Tanzania',
    totalEvents: 73,
    followers: 28400,
    verified: true,
    rating: 4.9,
    phone: '+255 766 890 123',
    whatsapp: '+255766890123',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Jungle Festival 2024',
        date: 'Dec 28, 2024',
        attendees: 9500,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Sunset Music Fest',
        date: 'Nov 18, 2024',
        attendees: 7200,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop', size: 'large', eventName: 'Jungle Festival 2024' },
      { id: 2, image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=400&h=300&fit=crop', size: 'small', eventName: 'Sunset Music Fest' },
      { id: 3, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', size: 'small', eventName: 'Jungle Nights' },
      { id: 4, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop', size: 'large', eventName: 'Outdoor Festival' },
      { id: 5, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', size: 'small', eventName: 'Bush Party' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Jungle Rhythms Night',
        image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=400&h=300&fit=crop',
        date: '14 Jun',
        time: '9:00 PM',
        location: 'Summer Jungle, Zanzibar',
        price: 'TSh 20,000',
      },
    ],
  },
  'Elements': {
    name: 'Elements',
    bio: 'Dar es Salaam\'s iconic nightclub delivering premier nightlife party experiences with themed events and exceptional live performances. The pulse of the city\'s entertainment scene.',
    coverImage: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 187,
    followers: 42300,
    verified: true,
    rating: 4.9,
    phone: '+255 777 901 234',
    whatsapp: '+255777901234',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Neon Nights Party',
        date: 'Jan 15, 2025',
        attendees: 3400,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        title: 'Saturday Night Fever',
        date: 'Dec 8, 2024',
        attendees: 1900,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?w=400&h=300&fit=crop', size: 'large', eventName: 'Neon Nights Party' },
      { id: 2, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', size: 'small', eventName: 'Saturday Night Fever' },
      { id: 3, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', size: 'small', eventName: 'Electric Vibes' },
      { id: 4, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop', size: 'large', eventName: 'Club Night' },
      { id: 5, image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&h=300&fit=crop', size: 'small', eventName: 'DJ Night' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Electric Nights - Themed Party',
        image: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?w=400&h=300&fit=crop',
        date: '20 Jun',
        time: '10:00 PM',
        location: 'Elements Nightclub, Dar es Salaam',
        price: 'TSh 25,000',
      },
    ],
  },
  'Vintage Space': {
    name: 'Vintage Space',
    bio: 'Dar es Salaam\'s premier fashion events and runway shows venue. Showcasing cutting-edge fashion, style, and creativity from Tanzania\'s most talented designers and fashion innovators.',
    coverImage: 'https://images.unsplash.com/photo-1719935115623-4857df23f3c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop',
    location: 'Dar es Salaam, Tanzania',
    totalEvents: 94,
    followers: 16800,
    verified: true,
    rating: 4.8,
    phone: '+255 788 012 345',
    whatsapp: '+255788012345',
    highlights: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1719935115623-4857df23f3c6?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Tanzania Fashion Week',
        date: 'Dec 22, 2024',
        attendees: 1200,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        title: 'Designer Runway Show',
        date: 'Nov 10, 2024',
        attendees: 850,
      },
    ],
    photos: [
      { id: 1, image: 'https://images.unsplash.com/photo-1719935115623-4857df23f3c6?w=400&h=300&fit=crop', size: 'large', eventName: 'Tanzania Fashion Week' },
      { id: 2, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop', size: 'small', eventName: 'Designer Runway Show' },
      { id: 3, image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=300&fit=crop', size: 'small', eventName: 'Fashion Showcase' },
      { id: 4, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop', size: 'large', eventName: 'Runway Night' },
      { id: 5, image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=300&fit=crop', size: 'small', eventName: 'Style Event' },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Swahili Fashion Week Showcase',
        image: 'https://images.unsplash.com/photo-1719935115623-4857df23f3c6?w=400&h=300&fit=crop',
        date: '12 Jun',
        time: '7:00 PM',
        location: 'Vintage Space, Dar es Salaam',
        price: 'TSh 35,000',
      },
    ],
  },
};

export function OrganizerProfile({ organizerName, onClose, onTicketPurchase, onMessage }: OrganizerProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [mediaViewerType, setMediaViewerType] = useState<'photo' | 'video'>('photo');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<OrganizerData['upcomingEvents'][0] | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketStep, setTicketStep] = useState<'quantity' | 'details' | 'confirm'>('quantity');
  const [ticketFormData, setTicketFormData] = useState({ name: '', email: '' });
  const organizer = organizersData[organizerName];

  if (!organizer) {
    return null;
  }

  // Combine highlights and photos into a unified gallery for the combined layout
  const combinedGallery = [
    ...organizer.highlights.map((h) => ({
      id: `highlight-${h.id}`,
      image: h.image,
      video: h.video,
      title: h.title,
      mediaType: h.video ? 'video' as const : 'photo' as const,
      likes: Math.floor(Math.random() * 800) + 100,
      comments: Math.floor(Math.random() * 50) + 10,
      shares: Math.floor(Math.random() * 30) + 5,
    })),
    ...organizer.photos.map((p) => ({
      id: `photo-${p.id}`,
      image: p.image,
      video: undefined,
      title: p.eventName || `${organizer.name} Gallery`,
      mediaType: 'photo' as const,
      likes: Math.floor(Math.random() * 600) + 50,
      comments: Math.floor(Math.random() * 40) + 5,
      shares: Math.floor(Math.random() * 20) + 2,
    })),
  ];

  const handleShare = (item: typeof combinedGallery[0]) => {
    toast.success('Link copied to clipboard!', {
      description: `Share ${item.title} with your friends`,
      duration: 2000,
    });
  };

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Hero Section with Cover */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden">
          <ImageWithFallback
            src={organizer.coverImage}
            alt={organizer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-900" />
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Organizer Name & Follow Button */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-white drop-shadow-lg">{organizer.name}</h2>
              {organizer.verified && (
                <CheckCircle2 className="w-5 h-5 text-white fill-[#8A2BE2]" />
              )}
            </div>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2 rounded-full transition-all ${
                isFollowing
                  ? 'bg-white/20 backdrop-blur-sm text-white border border-white/40'
                  : 'bg-white text-gray-900'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Events */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 text-center border border-gray-300 shadow-sm">
              <div className="text-lg text-gray-900 font-bold">{organizer.totalEvents}</div>
              <div className="text-xs text-gray-600 font-semibold">Events</div>
            </div>

            {/* Followers */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 text-center border border-gray-300 shadow-sm">
              <div className="text-lg text-gray-900 font-bold">
                {organizer.followers >= 1000 
                  ? `${(organizer.followers / 1000).toFixed(1)}k` 
                  : organizer.followers}
              </div>
              <div className="text-xs text-gray-600 font-semibold">Followers</div>
            </div>
          </div>

          {/* Message Button */}
          <button
            onClick={() => {
              if (onMessage) {
                onMessage({
                  name: organizer.name,
                  avatar: organizer.avatar,
                  verified: organizer.verified,
                  isOrganizer: true,
                });
              }
            }}
            className="w-full mb-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Message</span>
          </button>

          {/* Contact - Ultra Minimal Single Line */}
          {organizer.phone && organizer.whatsapp && (
            <div className="mb-6 flex items-center justify-center gap-3 pb-3 border-b border-gray-100">
              <a 
                href={`tel:${organizer.phone}`}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#8A2BE2] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{organizer.phone}</span>
              </a>
              <div className="w-px h-3 bg-gray-300"></div>
              <a 
                href={`https://wa.me/${organizer.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#128C7E] transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          )}

          {/* About */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{organizer.bio}</p>
          </div>

          {/* Event Highlights & Posts - COMBINED INSTAGRAM-STYLE GRID */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Event Highlights & Posts</h3>
            
            {/* 3-Column Grid Gallery */}
            <div className="grid grid-cols-3 gap-2">
              {combinedGallery.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
                  onClick={() => {
                    // Filter by media type first, then find the index within that filtered array
                    const filteredByType = combinedGallery.filter(g => g.mediaType === item.mediaType);
                    const indexInFiltered = filteredByType.findIndex(g => g.id === item.id);
                    setMediaViewerIndex(indexInFiltered);
                    setMediaViewerType(item.mediaType);
                    setShowMediaViewer(true);
                  }}
                >
                  {/* Image */}
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Video Play Icon - Always Visible for Videos */}
                  {item.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-[#8A2BE2] ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay - Appears on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content Overlay - Appears on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white text-xs line-clamp-2 leading-snug">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {organizer.upcomingEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  {/* Event Image */}
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                  />
                  
                  {/* Event Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <button className="self-start mt-2 bg-[#8A2BE2] text-white px-5 py-2 rounded-full text-sm hover:bg-[#7526c7] transition-colors"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowTicketModal(true);
                      }}
                    >
                      Get Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Media Viewer - Rendered outside modal for engaging photo viewing */}
    {showMediaViewer && (
      <MediaViewer
        media={combinedGallery
          .filter(item => item.mediaType === mediaViewerType)
          .map((item) => {
            if (item.mediaType === 'video') {
              return {
                id: parseInt(item.id.replace(/\D/g, '')),
                thumbnail: item.image,
                duration: '2:30',
                views: Math.floor(Math.random() * 5000) + 1000,
                likes: item.likes,
                videoUrl: item.video!,
                eventName: item.title,
              };
            } else {
              return {
                id: parseInt(item.id.replace(/\D/g, '')),
                url: item.image,
                likes: item.likes,
                eventName: item.title,
              };
            }
          })}
        initialIndex={mediaViewerIndex}
        onClose={() => setShowMediaViewer(false)}
        type={mediaViewerType}
      />
    )}

    {/* Ticket Modal */}
    {showTicketModal && selectedEvent && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative h-52 rounded-t-3xl overflow-hidden">
            <ImageWithFallback
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Top Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <Share2 className="w-5 h-5 text-gray-900" />
              </button>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>

            {/* Organizer Name & Follow Button */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-white drop-shadow-lg">{selectedEvent.title}</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Events */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 text-center border border-gray-300 shadow-sm">
                <div className="text-lg text-gray-900 font-bold">{selectedEvent.date}</div>
                <div className="text-xs text-gray-600 font-semibold">Date</div>
              </div>

              {/* Followers */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 text-center border border-gray-300 shadow-sm">
                <div className="text-lg text-gray-900 font-bold">{selectedEvent.time}</div>
                <div className="text-xs text-gray-600 font-semibold">Time</div>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <h3 className="text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedEvent.location}</p>
            </div>

            {/* Ticket Steps */}
            <div className="space-y-4">
              {ticketStep === 'quantity' && (
                <div>
                  <h3 className="text-gray-900 mb-2">Select Quantity</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                      className="w-16 h-8 bg-gray-100 rounded-full text-center"
                    />
                    <button
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => setTicketStep('details')}
                    className="mt-4 bg-[#8A2BE2] text-white px-5 py-2 rounded-full text-sm hover:bg-[#7526c7] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
              {ticketStep === 'details' && (
                <div>
                  <h3 className="text-gray-900 mb-2">Enter Details</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={ticketFormData.name}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full h-8 bg-gray-100 rounded-full px-4"
                    />
                    <input
                      type="email"
                      value={ticketFormData.email}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full h-8 bg-gray-100 rounded-full px-4"
                    />
                  </div>
                  <button
                    onClick={() => setTicketStep('confirm')}
                    className="mt-4 bg-[#8A2BE2] text-white px-5 py-2 rounded-full text-sm hover:bg-[#7526c7] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
              {ticketStep === 'confirm' && (
                <div>
                  <h3 className="text-gray-900 mb-2">Confirm Purchase</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Event: {selectedEvent.title}</p>
                    <p className="text-sm text-gray-600">Date: {selectedEvent.date}</p>
                    <p className="text-sm text-gray-600">Time: {selectedEvent.time}</p>
                    <p className="text-sm text-gray-600">Location: {selectedEvent.location}</p>
                    <p className="text-sm text-gray-600">Price: {selectedEvent.price}</p>
                    <p className="text-sm text-gray-600">Quantity: {ticketQuantity}</p>
                    <p className="text-sm text-gray-600">Name: {ticketFormData.name}</p>
                    <p className="text-sm text-gray-600">Email: {ticketFormData.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      const ticket: PurchasedTicket = {
                        eventName: selectedEvent.title,
                        date: selectedEvent.date,
                        time: selectedEvent.time,
                        location: selectedEvent.location,
                        price: selectedEvent.price,
                      };
                      toast.success(`Ticket for ${selectedEvent.title} purchased!`);
                      // Add ticket to purchased tickets
                      const currentTickets = JSON.parse(localStorage.getItem('purchasedTickets') || '[]');
                      localStorage.setItem('purchasedTickets', JSON.stringify([...currentTickets, ticket]));
                      if (onTicketPurchase) {
                        onTicketPurchase(ticket);
                      }
                      setShowTicketModal(false);
                    }}
                    className="mt-4 bg-[#8A2BE2] text-white px-5 py-2 rounded-full text-sm hover:bg-[#7526c7] transition-colors"
                  >
                    Confirm Purchase
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    )}
    </>
  );
}