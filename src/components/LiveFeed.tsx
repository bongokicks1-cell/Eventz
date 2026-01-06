import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Filter, Play, Clock, Bell, Check, MapPin, Search, Lock, Unlock, CreditCard, X, CheckCircle2 } from 'lucide-react';
import harmonizePoster from 'figma:asset/7b5f7bc419019da4329ccbf3dd742620e8e20c43.png';
import { LiveStreamViewer } from './LiveStreamViewer';
import { toast } from 'sonner';

interface LiveStream {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  isLive: boolean;
  viewers?: number;
  scheduledTime?: string;
  countdown?: number; // minutes until start
  host: string;
  quality: 'HD' | '4K';
  isPaid?: boolean;
  price?: number;
  location: string;
  country: string;
  countryFlag: string;
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'education', name: 'Education' },
  { id: 'culture', name: 'Culture' },
  { id: 'religion', name: 'Religion' },
  { id: 'business & tech', name: 'Business' },
  { id: 'sports & fitness', name: 'Sports' },
];

const countries = [
  { id: 'all', name: 'All Countries', flag: '🌍' },
  { id: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { id: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { id: 'United States', name: 'United States', flag: '🇺🇸' },
  { id: 'United Kingdom', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'Canada', name: 'Canada', flag: '🇨🇦' },
  { id: 'Australia', name: 'Australia', flag: '🇦🇺' },
  { id: 'Germany', name: 'Germany', flag: '🇩🇪' },
  { id: 'France', name: 'France', flag: '🇫🇷' },
  { id: 'Italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'Spain', name: 'Spain', flag: '🇪🇸' },
  { id: 'Netherlands', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'Belgium', name: 'Belgium', flag: '🇧🇪' },
  { id: 'Switzerland', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'Austria', name: 'Austria', flag: '🇦🇹' },
  { id: 'Sweden', name: 'Sweden', flag: '🇸🇪' },
  { id: 'Norway', name: 'Norway', flag: '🇳🇴' },
  { id: 'Denmark', name: 'Denmark', flag: '🇩🇰' },
  { id: 'Finland', name: 'Finland', flag: '🇫🇮' },
  { id: 'Poland', name: 'Poland', flag: '🇵🇱' },
  { id: 'Portugal', name: 'Portugal', flag: '🇵🇹' },
  { id: 'Greece', name: 'Greece', flag: '🇬🇷' },
  { id: 'Czech Republic', name: 'Czech Republic', flag: '🇨🇿' },
  { id: 'Ireland', name: 'Ireland', flag: '🇮🇪' },
  { id: 'Japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'South Korea', name: 'South Korea', flag: '🇰🇷' },
  { id: 'China', name: 'China', flag: '🇨🇳' },
  { id: 'India', name: 'India', flag: '🇮🇳' },
  { id: 'Singapore', name: 'Singapore', flag: '🇸🇬' },
  { id: 'Thailand', name: 'Thailand', flag: '🇹🇭' },
  { id: 'Malaysia', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'Indonesia', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'Philippines', name: 'Philippines', flag: '🇵🇭' },
  { id: 'Vietnam', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'United Arab Emirates', name: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'Qatar', name: 'Qatar', flag: '🇶🇦' },
  { id: 'Israel', name: 'Israel', flag: '🇮🇱' },
  { id: 'Turkey', name: 'Turkey', flag: '🇹🇷' },
  { id: 'Brazil', name: 'Brazil', flag: '🇧🇷' },
  { id: 'Argentina', name: 'Argentina', flag: '🇦🇷' },
  { id: 'Mexico', name: 'Mexico', flag: '🇲🇽' },
  { id: 'Colombia', name: 'Colombia', flag: '🇨🇴' },
  { id: 'Chile', name: 'Chile', flag: '🇨🇱' },
  { id: 'Peru', name: 'Peru', flag: '🇵🇪' },
  { id: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { id: 'Nigeria', name: 'Nigeria', flag: '🇳🇬' },
  { id: 'Egypt', name: 'Egypt', flag: '🇪🇬' },
  { id: 'Morocco', name: 'Morocco', flag: '🇲🇦' },
  { id: 'Ghana', name: 'Ghana', flag: '🇬🇭' },
  { id: 'Ethiopia', name: 'Ethiopia', flag: '🇪🇹' },
  { id: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { id: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { id: 'Zambia', name: 'Zambia', flag: '🇿🇲' },
  { id: 'Zimbabwe', name: 'Zimbabwe', flag: '🇿🇼' },
  { id: 'Botswana', name: 'Botswana', flag: '🇧🇼' },
  { id: 'Namibia', name: 'Namibia', flag: '🇳🇦' },
  { id: 'Mozambique', name: 'Mozambique', flag: '🇲🇿' },
  { id: 'Angola', name: 'Angola', flag: '🇦🇴' },
  { id: 'Senegal', name: 'Senegal', flag: '🇸🇳' },
  { id: 'Ivory Coast', name: 'Ivory Coast', flag: '🇨🇮' },
  { id: 'Cameroon', name: 'Cameroon', flag: '🇨🇲' },
  { id: 'Algeria', name: 'Algeria', flag: '🇩🇿' },
  { id: 'Tunisia', name: 'Tunisia', flag: '🇹🇳' },
  { id: 'Libya', name: 'Libya', flag: '🇱🇾' },
  { id: 'Sudan', name: 'Sudan', flag: '🇸🇩' },
  { id: 'New Zealand', name: 'New Zealand', flag: '🇳🇿' },
  { id: 'Russia', name: 'Russia', flag: '🇷🇺' },
  { id: 'Ukraine', name: 'Ukraine', flag: '🇺🇦' },
  { id: 'Hungary', name: 'Hungary', flag: '🇭🇺' },
  { id: 'Romania', name: 'Romania', flag: '🇷🇴' },
  { id: 'Bulgaria', name: 'Bulgaria', flag: '🇧🇬' },
  { id: 'Croatia', name: 'Croatia', flag: '🇭🇷' },
  { id: 'Serbia', name: 'Serbia', flag: '🇷🇸' },
  { id: 'Slovenia', name: 'Slovenia', flag: '🇸🇮' },
  { id: 'Slovakia', name: 'Slovakia', flag: '🇸🇰' },
  { id: 'Lithuania', name: 'Lithuania', flag: '🇱🇹' },
  { id: 'Latvia', name: 'Latvia', flag: '🇱🇻' },
  { id: 'Estonia', name: 'Estonia', flag: '🇪🇪' },
  { id: 'Iceland', name: 'Iceland', flag: '🇮🇸' },
  { id: 'Luxembourg', name: 'Luxembourg', flag: '🇱🇺' },
  { id: 'Malta', name: 'Malta', flag: '🇲🇹' },
  { id: 'Cyprus', name: 'Cyprus', flag: '🇨🇾' },
  { id: 'Pakistan', name: 'Pakistan', flag: '🇵🇰' },
  { id: 'Bangladesh', name: 'Bangladesh', flag: '🇧🇩' },
  { id: 'Sri Lanka', name: 'Sri Lanka', flag: '🇱🇰' },
  { id: 'Nepal', name: 'Nepal', flag: '🇳🇵' },
  { id: 'Myanmar', name: 'Myanmar', flag: '🇲🇲' },
  { id: 'Cambodia', name: 'Cambodia', flag: '🇰🇭' },
  { id: 'Laos', name: 'Laos', flag: '🇱🇦' },
  { id: 'Mongolia', name: 'Mongolia', flag: '🇲🇳' },
  { id: 'Kazakhstan', name: 'Kazakhstan', flag: '🇰🇿' },
  { id: 'Uzbekistan', name: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'Hong Kong', name: 'Hong Kong', flag: '🇭🇰' },
  { id: 'Taiwan', name: 'Taiwan', flag: '🇹🇼' },
  { id: 'Macau', name: 'Macau', flag: '🇲🇴' },
  { id: 'Lebanon', name: 'Lebanon', flag: '🇱🇧' },
  { id: 'Jordan', name: 'Jordan', flag: '🇯🇴' },
  { id: 'Kuwait', name: 'Kuwait', flag: '🇰🇼' },
  { id: 'Bahrain', name: 'Bahrain', flag: '🇧🇭' },
  { id: 'Oman', name: 'Oman', flag: '🇴🇲' },
  { id: 'Yemen', name: 'Yemen', flag: '🇾🇪' },
  { id: 'Iraq', name: 'Iraq', flag: '🇮🇶' },
  { id: 'Iran', name: 'Iran', flag: '🇮🇷' },
  { id: 'Afghanistan', name: 'Afghanistan', flag: '🇦🇫' },
  { id: 'Azerbaijan', name: 'Azerbaijan', flag: '🇦🇿' },
  { id: 'Georgia', name: 'Georgia', flag: '🇬🇪' },
  { id: 'Armenia', name: 'Armenia', flag: '🇦🇲' },
  { id: 'Costa Rica', name: 'Costa Rica', flag: '🇨🇷' },
  { id: 'Panama', name: 'Panama', flag: '🇵🇦' },
  { id: 'Ecuador', name: 'Ecuador', flag: '🇪🇨' },
  { id: 'Bolivia', name: 'Bolivia', flag: '🇧🇴' },
  { id: 'Paraguay', name: 'Paraguay', flag: '🇵🇾' },
  { id: 'Uruguay', name: 'Uruguay', flag: '🇺🇾' },
  { id: 'Venezuela', name: 'Venezuela', flag: '🇻🇪' },
  { id: 'Cuba', name: 'Cuba', flag: '🇨🇺' },
  { id: 'Dominican Republic', name: 'Dominican Republic', flag: '🇩🇴' },
  { id: 'Jamaica', name: 'Jamaica', flag: '🇯🇲' },
  { id: 'Trinidad and Tobago', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { id: 'Barbados', name: 'Barbados', flag: '🇧🇧' },
  { id: 'Bahamas', name: 'Bahamas', flag: '🇧' },
  { id: 'Fiji', name: 'Fiji', flag: '🇫🇯' },
  { id: 'Papua New Guinea', name: 'Papua New Guinea', flag: '🇵🇬' },
  { id: 'Maldives', name: 'Maldives', flag: '🇲🇻' },
  { id: 'Seychelles', name: 'Seychelles', flag: '🇸🇨' },
  { id: 'Mauritius', name: 'Mauritius', flag: '🇲🇺' },
  { id: 'Madagascar', name: 'Madagascar', flag: '🇲🇬' },
  { id: 'Brunei', name: 'Brunei', flag: '🇧🇳' },
  { id: 'North Macedonia', name: 'North Macedonia', flag: '🇲🇰' },
  { id: 'Bosnia and Herzegovina', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { id: 'Albania', name: 'Albania', flag: '🇦🇱' },
  { id: 'Montenegro', name: 'Montenegro', flag: '🇲🇪' },
  { id: 'Kosovo', name: 'Kosovo', flag: '🇽🇰' },
  { id: 'Moldova', name: 'Moldova', flag: '🇲🇩' },
  { id: 'Belarus', name: 'Belarus', flag: '🇧🇾' },
  { id: 'Guatemala', name: 'Guatemala', flag: '🇬🇹' },
  { id: 'Honduras', name: 'Honduras', flag: '🇭🇳' },
  { id: 'El Salvador', name: 'El Salvador', flag: '🇸🇻' },
  { id: 'Nicaragua', name: 'Nicaragua', flag: '🇳🇮' },
  { id: 'Belize', name: 'Belize', flag: '🇧🇿' },
  { id: 'Haiti', name: 'Haiti', flag: '🇭🇹' },
  { id: 'Guyana', name: 'Guyana', flag: '🇬🇾' },
  { id: 'Suriname', name: 'Suriname', flag: '🇸🇷' },
  { id: 'French Guiana', name: 'French Guiana', flag: '🇬🇫' },
  { id: 'Benin', name: 'Benin', flag: '🇧🇯' },
  { id: 'Burkina Faso', name: 'Burkina Faso', flag: '🇧🇫' },
  { id: 'Cape Verde', name: 'Cape Verde', flag: '🇨🇻' },
  { id: 'Chad', name: 'Chad', flag: '🇹🇩' },
  { id: 'Comoros', name: 'Comoros', flag: '🇰🇲' },
  { id: 'Congo', name: 'Congo', flag: '🇨🇬' },
  { id: 'DR Congo', name: 'DR Congo', flag: '🇨🇩' },
  { id: 'Djibouti', name: 'Djibouti', flag: '🇩' },
  { id: 'Equatorial Guinea', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { id: 'Eritrea', name: 'Eritrea', flag: '🇪🇷' },
  { id: 'Gabon', name: 'Gabon', flag: '🇬🇦' },
  { id: 'Gambia', name: 'Gambia', flag: '🇬🇲' },
  { id: 'Guinea', name: 'Guinea', flag: '🇬🇳' },
  { id: 'Guinea-Bissau', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { id: 'Lesotho', name: 'Lesotho', flag: '🇱🇸' },
  { id: 'Liberia', name: 'Liberia', flag: '🇱🇷' },
  { id: 'Malawi', name: 'Malawi', flag: '🇲🇼' },
  { id: 'Mali', name: 'Mali', flag: '🇲🇱' },
  { id: 'Mauritania', name: 'Mauritania', flag: '🇲🇷' },
  { id: 'Niger', name: 'Niger', flag: '🇳🇪' },
  { id: 'Reunion', name: 'Reunion', flag: '🇷🇪' },
  { id: 'Sao Tome and Principe', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { id: 'Sierra Leone', name: 'Sierra Leone', flag: '🇸🇱' },
  { id: 'Somalia', name: 'Somalia', flag: '🇸🇴' },
  { id: 'South Sudan', name: 'South Sudan', flag: '🇸🇸' },
  { id: 'Eswatini', name: 'Eswatini', flag: '🇸🇿' },
  { id: 'Togo', name: 'Togo', flag: '🇹🇬' },
  { id: 'Burundi', name: 'Burundi', flag: '🇧🇮' },
  { id: 'Central African Republic', name: 'Central African Republic', flag: '🇨🇫' },
];

const liveStreams: LiveStream[] = [
  {
    id: 1,
    title: 'Summer Music Festival 2025 - Main Stage',
    category: 'entertainment',
    thumbnail: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 12847,
    host: 'Festival Productions',
    quality: '4K',
    location: 'Central Park',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
  {
    id: 2,
    title: 'Live Club Night - DJ Set from Ibiza',
    category: 'entertainment',
    thumbnail: harmonizePoster,
    isLive: true,
    viewers: 8234,
    host: 'Pacha Ibiza',
    quality: 'HD',
    isPaid: true,
    price: 15000,
    location: 'Ibiza',
    country: 'Spain',
    countryFlag: 'figma:asset/flag-spain.png',
  },
  {
    id: 3,
    title: 'Tech Startup Pitch Competition Finals',
    category: 'business & tech',
    thumbnail: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 5623,
    host: 'TechCrunch',
    quality: 'HD',
    location: 'Silicon Valley',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
  {
    id: 4,
    title: 'Afrobeat Live Concert - Zanzibar',
    category: 'entertainment',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 9456,
    host: 'Zanzibar Live',
    quality: '4K',
    isPaid: true,
    price: 25000,
    location: 'Zanzibar',
    country: 'Tanzania',
    countryFlag: 'figma:asset/flag-tanzania.png',
  },
  {
    id: 5,
    title: 'Digital Marketing Workshop',
    category: 'education',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 3421,
    host: 'Marketing Academy',
    quality: 'HD',
    location: 'London',
    country: 'United Kingdom',
    countryFlag: 'figma:asset/flag-united-kingdom.png',
  },
  {
    id: 12,
    title: 'NBA Finals Game 7 - Live Watch Party',
    category: 'sports & fitness',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 18562,
    host: 'ESPN Sports Bar',
    quality: '4K',
    location: 'Los Angeles',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
  {
    id: 13,
    title: 'Broadway Musical Live Performance',
    category: 'entertainment',
    thumbnail: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    isLive: true,
    viewers: 6734,
    host: 'Broadway Theater',
    quality: '4K',
    isPaid: true,
    price: 40000,
    location: 'New York City',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
];

const upcomingStreams: LiveStream[] = [
  {
    id: 6,
    title: 'Championship Soccer Match - Live Commentary',
    category: 'sports & fitness',
    thumbnail: 'https://images.unsplash.com/photo-1764050359179-517599dab87b?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Today at 7:30 PM',
    countdown: 45,
    host: 'Sports Network',
    quality: '4K',
    location: 'Stadium',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
  {
    id: 7,
    title: 'Dar es Salaam Tech Summit - Keynote',
    category: 'business & tech',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Tomorrow at 9:00 AM',
    countdown: 620,
    host: 'Tanzania Tech Hub',
    quality: 'HD',
    location: 'Dar es Salaam',
    country: 'Tanzania',
    countryFlag: 'figma:asset/flag-tanzania.png',
  },
  {
    id: 8,
    title: 'Dubai Fashion Week - Runway Show',
    category: 'entertainment',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Tomorrow at 6:00 PM',
    countdown: 1100,
    host: 'Dubai Fashion Council',
    quality: '4K',
    isPaid: true,
    price: 35000,
    location: 'Dubai',
    country: 'United Arab Emirates',
    countryFlag: 'figma:asset/flag-united-arab-emirates.png',
  },
  {
    id: 9,
    title: 'Sunday Service - Live Worship',
    category: 'religion',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Sunday at 10:00 AM',
    countdown: 1500,
    host: 'City Church',
    quality: 'HD',
    location: 'Church',
    country: 'United States',
    countryFlag: 'figma:asset/flag-united-states-of-america.png',
  },
  {
    id: 10,
    title: 'Zanzibar Cultural Festival - Opening Ceremony',
    category: 'culture',
    thumbnail: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Friday at 5:00 PM',
    countdown: 3800,
    host: 'Zanzibar Tourism Board',
    quality: '4K',
    location: 'Stone Town, Zanzibar',
    country: 'Tanzania',
    countryFlag: 'figma:asset/flag-tanzania.png',
  },
  {
    id: 11,
    title: 'Abu Dhabi Grand Prix - Pre-Race Coverage',
    category: 'sports & fitness',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
    isLive: false,
    scheduledTime: 'Saturday at 2:00 PM',
    countdown: 2900,
    host: 'Formula 1',
    quality: '4K',
    isPaid: true,
    price: 45000,
    location: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    countryFlag: 'figma:asset/flag-united-arab-emirates.png',
  },
];

export function LiveFeed() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('Tanzania');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [streamToUnlock, setStreamToUnlock] = useState<LiveStream | null>(null);
  const [unlockedStreams, setUnlockedStreams] = useState<Set<number>>(new Set());
  const [recentCountries, setRecentCountries] = useState<string[]>(() => {
    const stored = localStorage.getItem('eventz-recent-countries');
    return stored ? JSON.parse(stored) : ['Tanzania', 'United Arab Emirates', 'United States'];
  });

  // Save recent country when user selects one
  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setShowLocationFilter(false);
    setLocationSearch('');

    // Don't add "all" to recent searches
    if (countryId === 'all') return;

    // Update recent countries (keep max 3, most recent first)
    const updated = [countryId, ...recentCountries.filter(c => c !== countryId)].slice(0, 3);
    setRecentCountries(updated);
    localStorage.setItem('eventz-recent-countries', JSON.stringify(updated));
  };

  const filteredLiveStreams = liveStreams.filter(
    stream => 
      (selectedCategory === 'all' || stream.category === selectedCategory) &&
      (selectedCountry === 'all' || stream.country === selectedCountry)
  );

  const filteredUpcomingStreams = upcomingStreams.filter(
    stream => 
      (selectedCategory === 'all' || stream.category === selectedCategory) &&
      (selectedCountry === 'all' || stream.country === selectedCountry)
  );

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Show only 3 default countries when search is empty
  const displayedCountries = locationSearch.trim() === '' 
    ? countries.filter(c => c.id === 'all' || recentCountries.includes(c.id))
    : filteredCountries;

  const toggleReminder = (id: number) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(id)) {
      newReminders.delete(id);
    } else {
      newReminders.add(id);
    }
    setReminders(newReminders);
  };

  const formatCountdown = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleStreamClick = (stream: LiveStream) => {
    // Check if stream is paid and not unlocked
    if (stream.isPaid && !unlockedStreams.has(stream.id)) {
      setStreamToUnlock(stream);
      setShowUnlockModal(true);
    } else {
      setSelectedStream(stream);
    }
  };

  const handleUnlockStream = () => {
    if (streamToUnlock) {
      // Add to unlocked streams
      const newUnlockedStreams = new Set(unlockedStreams);
      newUnlockedStreams.add(streamToUnlock.id);
      setUnlockedStreams(newUnlockedStreams);
      
      // Show success toast
      toast.success('🎉 Stream unlocked successfully!', {
        description: `You can now watch ${streamToUnlock.title}`,
      });
      
      // Close unlock modal and open stream viewer
      setShowUnlockModal(false);
      setSelectedStream(streamToUnlock);
      setStreamToUnlock(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Premium Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-2xl mb-1">Live Feed</h1>
              <p className="text-gray-600 text-sm">Watch events live from anywhere</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Location Filter - LEFT */}
              <button 
                onClick={() => setShowLocationFilter(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xl"
                title="Filter by location"
              >
                {countries.find(c => c.id === selectedCountry)?.flag || '🇹🇿'}
              </button>

              {/* Category Filter - RIGHT */}
              <button 
                onClick={() => setShowFilters(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Minimal live indicator */}
          {filteredLiveStreams.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-gray-700 text-sm">{filteredLiveStreams.length} live now</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Live Now - Premium Cards */}
        {filteredLiveStreams.length > 0 && (
          <div className="space-y-5 mb-12">
            {filteredLiveStreams.map((stream) => (
              <div
                key={stream.id}
                onClick={() => handleStreamClick(stream)}
                className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all"
                style={{ aspectRatio: '16/9' }}
              >
                {/* Image */}
                <ImageWithFallback
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Minimal Live Indicator - Top Left */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    <span className="text-white text-xs tracking-wide">LIVE</span>
                  </div>
                </div>

                {/* Quality Badge - Only when relevant */}
                {stream.quality === '4K' && (
                  <div className="absolute top-4 right-4">
                    <div className="px-2 py-1 rounded-lg bg-purple-600 shadow-lg">
                      <span className="text-white text-xs">4K</span>
                    </div>
                  </div>
                )}

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    {/* Left: Title & Viewers */}
                    <div className="flex-1 pr-4">
                      <h3 className="text-white text-lg mb-2 leading-tight line-clamp-2">{stream.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-white/90 text-sm">{stream.host}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50"></span>
                        <span className="text-white/90 text-sm">{stream.viewers?.toLocaleString()} watching</span>
                      </div>
                    </div>

                    {/* Right: Minimal Play Button */}
                    <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                      <Play className="w-6 h-6 text-purple-600 fill-purple-600 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming - Minimal Cards */}
        {filteredUpcomingStreams.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900 text-lg">Upcoming</h2>
            </div>

            <div className="space-y-3">
              {filteredUpcomingStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="relative overflow-hidden rounded-2xl bg-white hover:shadow-md transition-all cursor-pointer border border-gray-200"
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <ImageWithFallback
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      {/* Countdown badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600 shadow-sm">
                        <span className="text-white text-xs">{formatCountdown(stream.countdown!)}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-gray-900 text-sm mb-1 line-clamp-2 leading-snug">{stream.title}</h3>
                        <p className="text-gray-600 text-xs">{stream.scheduledTime}</p>
                      </div>
                    </div>

                    {/* Reminder Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReminder(stream.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        reminders.has(stream.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {reminders.has(stream.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredLiveStreams.length === 0 && filteredUpcomingStreams.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            </div>
            <h3 className="text-gray-900 mb-2">No streams available</h3>
            <p className="text-gray-600 text-sm">Check back soon for live events</p>
          </div>
        )}
      </div>

      {/* Minimal Filter Modal */}
      {showFilters && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowFilters(false)}
        >
          <div 
            className="w-full max-w-4xl bg-white rounded-t-3xl shadow-2xl border-t border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-5">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-5 pb-8">
              <h2 className="text-gray-900 text-lg mb-5">Filter by category</h2>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Filter Modal */}
      {showLocationFilter && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLocationFilter(false)}
        >
          <div 
            className="w-full max-w-4xl bg-white rounded-t-3xl shadow-2xl border-t border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-5">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-5 pb-8">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900 text-lg">Filter by location</h2>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search location..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {displayedCountries.length > 0 ? (
                  displayedCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect(country.id)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl transition-all flex items-center gap-3 ${
                        selectedCountry === country.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No locations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream Viewer Modal */}
      {selectedStream && (
        <LiveStreamViewer
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
          isUnlockedOverride={unlockedStreams.has(selectedStream.id)}
        />
      )}

      {/* Unlock Stream Modal */}
      {showUnlockModal && streamToUnlock && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowUnlockModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={streamToUnlock.thumbnail}
                alt={streamToUnlock.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Lock Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Live Badge */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500 shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  <span className="text-white text-xs tracking-wide">LIVE</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-gray-900 text-2xl mb-2">Premium Live Stream</h2>
              <h3 className="text-gray-700 mb-1">{streamToUnlock.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{streamToUnlock.host}</p>

              {/* Features */}
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl border border-purple-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">HD {streamToUnlock.quality} streaming quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">Multi-camera angles & replays</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">Live chat & real-time reactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">24-hour replay access</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Stream Access</span>
                <span className="text-gray-900 text-2xl">TSh {streamToUnlock.price?.toLocaleString()}</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleUnlockStream}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-5 h-5" />
                  Unlock Stream
                </button>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}