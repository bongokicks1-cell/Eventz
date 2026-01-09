/**
 * PWA Service Worker Registration
 * Handles offline caching and app updates
 */

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // Skip in iframe/preview environments
    if (window.self !== window.top) {
      console.log('PWA: Service Worker disabled in preview mode');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered:', registration.scope);

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
              // Show update notification
              if (window.confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.log('ℹ️ Service Worker registration skipped (preview mode)');
    }
  }
};
