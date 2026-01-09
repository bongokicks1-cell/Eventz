import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, Smartphone } from 'lucide-react';

export function PWADebugInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState({
    inIframe: false,
    serviceWorkerSupported: false,
    serviceWorkerRegistered: false,
    manifestLoaded: false,
    isInstalled: false,
    isOnline: false,
    beforeInstallPromptFired: false,
  });

  useEffect(() => {
    const runChecks = async () => {
      // Check if in iframe
      const inIframe = window.self !== window.top;

      // Check service worker support
      const serviceWorkerSupported = 'serviceWorker' in navigator;

      // Check if service worker is registered
      let serviceWorkerRegistered = false;
      if (serviceWorkerSupported) {
        const registration = await navigator.serviceWorker.getRegistration();
        serviceWorkerRegistered = !!registration;
      }

      // Check if manifest is loaded
      const manifestLink = document.querySelector('link[rel="manifest"]');
      const manifestLoaded = !!manifestLink;

      // Check if app is installed
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

      // Check online status
      const isOnline = navigator.onLine;

      setChecks({
        inIframe,
        serviceWorkerSupported,
        serviceWorkerRegistered,
        manifestLoaded,
        isInstalled,
        isOnline,
        beforeInstallPromptFired: false, // Will be updated by event listener
      });
    };

    runChecks();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = () => {
      setChecks(prev => ({ ...prev, beforeInstallPromptFired: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Only show in development (when in iframe)
  if (!checks.inIframe) return null;

  return (
    <>
      {/* Debug Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-[60] w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="PWA Debug Info"
      >
        <Info className="w-6 h-6 text-white" />
      </button>

      {/* Debug Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-white" />
                  <h3 className="text-white text-lg">PWA Status</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3 max-h-[calc(90vh-120px)] overflow-y-auto">
              <StatusItem
                label="Environment"
                status={checks.inIframe}
                trueText="Preview Mode (Figma)"
                falseText="Production"
                info="Preview mode is detected"
              />

              <StatusItem
                label="Service Worker Support"
                status={checks.serviceWorkerSupported}
                trueText="Supported"
                falseText="Not Supported"
              />

              <StatusItem
                label="Service Worker Active"
                status={checks.serviceWorkerRegistered}
                trueText="Registered ✓"
                falseText="Not Registered (Expected in Preview)"
                info="SW won't register in iframe/preview mode"
              />

              <StatusItem
                label="Manifest File"
                status={checks.manifestLoaded}
                trueText="Loaded ✓"
                falseText="Not Found"
              />

              <StatusItem
                label="Install Status"
                status={checks.isInstalled}
                trueText="Installed ✓"
                falseText="Not Installed"
              />

              <StatusItem
                label="Network Status"
                status={checks.isOnline}
                trueText="Online ✓"
                falseText="Offline"
              />

              <StatusItem
                label="Install Prompt"
                status={checks.beforeInstallPromptFired}
                trueText="Available ✓"
                falseText="Not Available (Expected in Preview)"
                info="Install prompt only works on real domains"
              />

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <h4 className="text-blue-900 text-sm font-medium mb-2">
                  ℹ️ Preview Mode Info
                </h4>
                <p className="text-blue-700 text-xs leading-relaxed">
                  You're in Figma preview mode. PWA UI features work, but Service Worker won't register. 
                  Deploy to Vercel/Netlify for full PWA functionality with offline caching.
                </p>
              </div>

              {/* Working Features */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="text-green-900 text-sm font-medium mb-2">
                  ✅ Working Features
                </h4>
                <ul className="text-green-700 text-xs space-y-1">
                  <li>• PWA Install Prompt UI</li>
                  <li>• Online/Offline Status Indicator</li>
                  <li>• PWA Features Overview Modal</li>
                  <li>• Manifest.json Configuration</li>
                  <li>• All App Icons & Shortcuts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusItem({ 
  label, 
  status, 
  trueText, 
  falseText,
  info 
}: { 
  label: string; 
  status: boolean; 
  trueText: string; 
  falseText: string;
  info?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="text-gray-900 text-sm font-medium mb-0.5">{label}</div>
        <div className={`text-xs ${status ? 'text-green-600' : 'text-gray-500'}`}>
          {status ? trueText : falseText}
        </div>
        {info && !status && (
          <div className="text-xs text-gray-400 mt-1">{info}</div>
        )}
      </div>
      <div className="flex-shrink-0">
        {status ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-gray-300" />
        )}
      </div>
    </div>
  );
}
