import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, Calendar, MapPin, DollarSign, Tag, Eye, Save, Music, GraduationCap, Church, Briefcase, Dumbbell, Palette, CheckCircle, Building2, ArrowLeft, Sparkles, Share2, TrendingUp, Users, BarChart3, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ShareModal } from './ShareModal';
import { handleShare as shareUtil } from '../utils/share';

interface EventForm {
  title: string;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  coverImage: string | null;
}

interface CreateEventProps {
  onBack?: () => void;
  event?: any;
}

export function CreateEvent({ onBack, event }: CreateEventProps) {
  const [formData, setFormData] = useState<EventForm>({
    title: event?.title || 'Summer Music Festival 2025',
    category: event?.category || 'Entertainment',
    subcategory: event?.subcategory || 'Live Performances',
    date: event?.date || '2025-08-15',
    time: event?.time || '18:00',
    location: event?.location || 'Central Park, Dar es Salaam',
    price: event?.price || 'TSh 50,000 - 150,000',
    description: event?.description || 'Join us for the biggest music festival of the year! Featuring top artists, HD live streaming, and an unforgettable experience under the stars.',
    coverImage: event?.coverImage || 'https://images.unsplash.com/photo-1709731191876-899e32264420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzY2OTAxMzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const isEditing = !!event;

  // Get organizer profile from localStorage
  const organizerProfile = JSON.parse(localStorage.getItem('eventz-organizer-profile') || '{}');

  const categories = [
    { name: 'Entertainment', icon: Music, gradient: 'from-purple-600 to-pink-600' },
    { name: 'Culture', icon: Palette, gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Religion', icon: Church, gradient: 'from-amber-500 to-orange-600' },
    { name: 'Education', icon: GraduationCap, gradient: 'from-green-500 to-emerald-600' },
    { name: 'Business & Tech', icon: Briefcase, gradient: 'from-indigo-600 to-purple-600' },
    { name: 'Sports & Fitness', icon: Dumbbell, gradient: 'from-red-500 to-pink-600' },
  ];

  // Subcategories for each category
  const subcategoriesMap: Record<string, string[]> = {
    'Entertainment': [
      'Concerts',
      'Live Performances',
      'Music Festival',
      'Themed Parties',
      'Club Nights',
      'Bars & Lounges'
    ],
    'Culture': [
      'Festivals',
      'Arts',
      'Food & Drink',
      'Local Traditions',
      'Fashion Events'
    ],
    'Education': [
      'Workshops',
      'Seminars',
      'Webinars'
    ],
    'Religion': [
      'Religious Gatherings',
      'Spiritual Events'
    ],
    'Business & Tech': [
      'Startup Events',
      'Networking',
      'Tech Talks'
    ],
    'Sports & Fitness': [
      'Competitions',
      'Fitness Classes',
      'Sports Events'
    ]
  };

  const handleInputChange = (field: keyof EventForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryName: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      category: categoryName,
      subcategory: '' // Reset subcategory when category changes
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      // Convert to base64 for persistent storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleInputChange('coverImage', base64String);
        toast.success('Cover image uploaded! 📸');
      };
      reader.onerror = () => {
        toast.error('Failed to upload image');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('cover-image-input')?.click();
  };

  const handleSaveDraft = () => {
    toast.success('Event saved as draft! 📝', {
      description: 'You can continue editing later',
    });
  };

  const handlePublish = () => {
    if (isEditing) {
      // Update existing event
      toast.success('Event updated successfully! ✏️', {
        description: 'Your changes have been saved',
      });
      
      const existingEvents = JSON.parse(localStorage.getItem('eventz-published-events') || '[]');
      const updatedEvents = existingEvents.map((e: any) => 
        e.id === event.id ? { ...event, ...formData } : e
      );
      localStorage.setItem('eventz-published-events', JSON.stringify(updatedEvents));
      
      if (onBack) onBack();
    } else {
      // Create new event
      toast.success('Event published successfully! 🎉', {
        description: 'Your event is now live on EVENTZ',
      });
      setShowSuccessScreen(true);
      
      // Save published event to localStorage
      const publishedEvent = {
        id: Date.now(),
        ...formData,
        publishedAt: new Date().toISOString(),
        organizerName: organizerProfile.organizerName,
        views: 0,
        interested: 0,
        shares: 0,
      };
      
      const existingEvents = JSON.parse(localStorage.getItem('eventz-published-events') || '[]');
      localStorage.setItem('eventz-published-events', JSON.stringify([publishedEvent, ...existingEvents]));
    }
  };

  // Success Screen
  if (showSuccessScreen) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              <Sparkles className="w-6 h-6 text-pink-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>
            <h1 className="text-gray-900 text-4xl mb-3">Event Published! 🎉</h1>
            <p className="text-gray-600 text-lg">Your event is now live on EVENTZ</p>
          </div>

          {/* Event Summary Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
            {/* Event Preview */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
              {formData.coverImage ? (
                <img src={formData.coverImage} alt={formData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-2xl mb-1">{formData.title || 'Untitled Event'}</h2>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formData.date || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.location || 'TBD'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-px bg-gray-200 border-y border-gray-200">
              <div className="bg-white p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-purple-600" />
                  <p className="text-gray-900 text-xl">0</p>
                </div>
                <p className="text-gray-600 text-xs">Interested</p>
              </div>
              <div className="bg-white p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Eye className="w-5 h-5 text-cyan-600" />
                  <p className="text-gray-900 text-xl">0</p>
                </div>
                <p className="text-gray-600 text-xs">Views</p>
              </div>
              <div className="bg-white p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Share2 className="w-5 h-5 text-pink-600" />
                  <p className="text-gray-900 text-xl">0</p>
                </div>
                <p className="text-gray-600 text-xs">Shares</p>
              </div>
            </div>

            {/* Tips */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Boost Your Event</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Share on social media to reach more people</li>
                    <li>• Add engaging photos and videos</li>
                    <li>• Enable live streaming for virtual attendance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={async () => {
                const shared = await shareUtil({
                  title: formData.title,
                  text: `${formData.date} at ${formData.location}\nPrice: ${formData.price}`,
                  url: window.location.href,
                });
                
                // If native share not available, show custom modal
                if (!shared) {
                  setShowShareModal(true);
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share Event
            </button>
            <button
              onClick={() => {
                if (onBack) onBack();
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              View Dashboard
            </button>
          </div>

          {/* Create Another Event */}
          <button
            onClick={() => {
              setShowSuccessScreen(false);
              setFormData({
                title: '',
                category: '',
                subcategory: '',
                date: '',
                time: '',
                location: '',
                price: '',
                description: '',
                coverImage: null,
              });
            }}
            className="w-full mt-4 px-6 py-4 text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            + Create Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen pb-24">
      {/* Organizer Header */}
      <div className="bg-[#8A2BE2] px-6 py-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Back Button - Show when editing or onBack is provided */}
            {(isEditing || onBack) && (
              <button
                onClick={onBack}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs mb-1">{isEditing ? 'Editing Event' : 'Organizing as'}</p>
              <h1 className="text-white text-2xl">{isEditing ? formData.title : organizerProfile.organizerName || 'Organizer'}</h1>
              <p className="text-white/90 text-sm">{organizerProfile.organizerType || 'Event Organizer'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Category Selection - Visual Cards */}
        <div className="mb-8">
          <label className="block text-gray-900 mb-4">Select Event Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 ${isSelected ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl flex items-center justify-center mb-3 mx-auto`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-900'}`} />
                  </div>
                  <p className={`text-sm text-center ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                    {cat.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategory Selection */}
        <div className="mb-8">
          <label className="block text-gray-900 mb-4">Select Event Subcategory</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subcategoriesMap[formData.category]?.map((subcat) => {
              const isSelected = formData.subcategory === subcat;
              return (
                <button
                  key={subcat}
                  onClick={() => handleInputChange('subcategory', subcat)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 ${isSelected ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl flex items-center justify-center mb-3 mx-auto`}
                  >
                    <Tag className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-900'}`} />
                  </div>
                  <p className={`text-sm text-center ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                    {subcat}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Cover Image</label>
          <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 transition-colors cursor-pointer group overflow-hidden">
            {formData.coverImage ? (
              <>
                <ImageWithFallback
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {/* Change Image Button */}
                <button
                  onClick={() => handleInputChange('coverImage', '')}
                  className="absolute top-4 right-4 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <Upload className="w-6 h-6 text-white" />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-purple-50 transition-colors">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-700">Click to upload cover image</p>
                <p className="text-gray-500 text-sm">JPG, PNG up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              id="cover-image-input"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Event Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Summer Music Festival 2025"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-900 mb-3">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-900 mb-3">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Central Park, New York"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Price</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="e.g., $45 - $120 or Free"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-gray-900 mb-3">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Tell people what your event is about..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sticky bottom-20 bg-white py-4 border-t border-gray-200">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors min-w-0"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">Back</span>
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors min-w-0"
          >
            <Save className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm font-medium truncate">Save</span>
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-cyan-500 text-cyan-600 py-3 rounded-xl hover:bg-cyan-50 transition-colors min-w-0"
          >
            <span className="text-sm font-medium truncate">Preview</span>
          </button>
          <button
            onClick={handlePublish}
            className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium min-w-0"
          >
            <span className="text-sm truncate">{isEditing ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={formData.title}
        text={`${formData.date} at ${formData.location}\nPrice: ${formData.price}`}
        url={window.location.href}
      />
    </div>
  );
}