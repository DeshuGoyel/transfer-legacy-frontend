declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => Promise<void> | void>;
    OneSignal?: any;
  }
}

const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID;

export const isOneSignalConfigured = (): boolean => {
  return (
    typeof ONESIGNAL_APP_ID === 'string' &&
    ONESIGNAL_APP_ID.trim().length > 0 &&
    ONESIGNAL_APP_ID !== 'YOUR_ONESIGNAL_APP_ID_HERE' &&
    !ONESIGNAL_APP_ID.includes('placeholder')
  );
};

let initializationPromise: Promise<any> | null = null;

export const initOneSignal = (): Promise<any> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (!isOneSignalConfigured()) {
    return Promise.resolve(null);
  }

  if (typeof window !== 'undefined' && window.OneSignal) {
    return Promise.resolve(window.OneSignal);
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    // Check if script is already present
    const existingScript = document.querySelector('script[src*="OneSignalSDK.page.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.defer = true;
      document.head.appendChild(script);
    }

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (!OneSignal._isInitialized && typeof OneSignal.init === 'function') {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID || "1ed98a30-a4ac-4ba2-a993-b956fe268581",
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: false, // We use our own customized UI in settings and drawer
            },
          });
        }
        resolve(OneSignal);
      } catch (err) {
        resolve(OneSignal || null);
      }
    });
  });

  return initializationPromise;
};

export interface PushStatus {
  configured: boolean;
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
  appId?: string;
}

export const getPushStatus = async (): Promise<PushStatus> => {
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  const configured = isOneSignalConfigured();

  if (!supported) {
    return {
      configured,
      supported: false,
      permission: 'unsupported',
      isSubscribed: false,
    };
  }

  const permission = Notification.permission;

  if (!configured) {
    return {
      configured: false,
      supported: true,
      permission,
      isSubscribed: false,
    };
  }

  try {
    const OneSignal = await initOneSignal();
    const isSubscribed = OneSignal ? OneSignal.User?.PushSubscription?.optedIn ?? false : false;

    return {
      configured: true,
      supported: true,
      permission,
      isSubscribed,
      appId: ONESIGNAL_APP_ID,
    };
  } catch {
    return {
      configured: true,
      supported: true,
      permission,
      isSubscribed: false,
    };
  }
};

export const requestPushPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (!isOneSignalConfigured()) {
    const res = await Notification.requestPermission();
    return res === 'granted';
  }

  try {
    const OneSignal = await initOneSignal();
    if (OneSignal) {
      await OneSignal.Slidedown.promptPush();
      return Notification.permission === 'granted';
    }
  } catch (err) {
    console.warn('Error requesting OneSignal permission:', err);
  }

  const res = await Notification.requestPermission();
  return res === 'granted';
};

export const setOneSignalUser = async (userId: string): Promise<void> => {
  if (!isOneSignalConfigured() || !userId) return;

  try {
    const OneSignal = await initOneSignal();
    if (OneSignal?.login) {
      await OneSignal.login(userId);
    }
  } catch (err) {
    console.warn('Failed to associate user with OneSignal:', err);
  }
};

export const clearOneSignalUser = async (): Promise<void> => {
  if (!isOneSignalConfigured()) return;

  try {
    const OneSignal = await initOneSignal();
    if (OneSignal?.logout) {
      await OneSignal.logout();
    }
  } catch (err) {
    console.warn('Failed to logout OneSignal user:', err);
  }
};
