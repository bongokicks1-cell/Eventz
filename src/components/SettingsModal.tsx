import { X, User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      description: 'Update your personal information',
      onClick: () => {},
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your notification preferences',
      onClick: () => {},
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Control your privacy settings',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help with your account',
      onClick: () => {},
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          {/* Drag Indicator */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 text-xl">Settings</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 text-sm">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button className="w-full mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 group">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>

          {/* App Version */}
          <p className="text-center text-gray-400 text-xs mt-6">
            EVENTZ v1.0.0 • Made with ❤️ in Tanzania
          </p>
        </div>
      </div>
    </div>
  );
}
