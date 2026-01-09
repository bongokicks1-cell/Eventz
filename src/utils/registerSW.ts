import { toast } from 'sonner@2.0.3';

/**
 * PWA Service Worker Registration
 * 
 * NOTE: Service Workers will NOT work in Figma's preview environment due to:
 * - iframe security restrictions
 * - MIME type issues with static file serving
 * - This is normal and expected behavior
 * 
 * Service Workers WILL work when deployed to:
 * - Vercel, Netlify, or any static hosting
 * - Any HTTPS domain
 * - Production environments
 * 
 * All PWA UI features (install prompt, status indicator, features modal) 
 * work WITHOUT service workers in preview mode.
 */
export const registerServiceWorker = async () => {
  // Skip service worker in iframe environments (Figma preview)
  if (window.self !== window.top) {
    console.log('✅ PWA UI features active (Service Worker disabled in preview - this is normal)');
    return;
  }

  // Only attempt registration in standalone environments
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully');

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, show update prompt
              toast.success('New version available! Refresh to update.', {
                duration: 10000,
                action: {
                  label: 'Refresh',
                  onClick: () => window.location.reload(),
                },
              });
            }
          });
        }
      });

      return registration;
    } catch (error) {
      // Silently fail - this is expected in preview environments
      console.log('ℹ️ Service Worker not available (preview mode)');
    }
  }
};