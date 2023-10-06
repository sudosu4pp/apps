import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import OneSignalMod from 'react-onesignal';
import {
  UseNotificationPermissionPopup,
  useNotificationPermissionPopup,
} from '../hooks/useNotificationPermissionPopup';
import usePersistentContext from '../hooks/usePersistentContext';
import { BootApp } from '../lib/boot';
import { isDevelopment, isTesting } from '../lib/constants';
import { checkIsExtension } from '../lib/func';
import AuthContext from './AuthContext';
import { AnalyticsEvent, NotificationPromptSource } from '../lib/analytics';
import { useAnalyticsContext } from './AnalyticsContext';

export interface NotificationsContextData
  extends UseNotificationPermissionPopup {
  unreadCount: number;
  isInitialized: boolean;
  isSubscribed: boolean;
  isNotificationSupported: boolean;
  shouldShowSettingsAlert?: boolean;
  onShouldShowSettingsAlert?: (state: boolean) => Promise<void>;
  clearUnreadCount: () => void;
  incrementUnreadCount: () => void;
  onTogglePermission: (
    source: NotificationPromptSource,
  ) => Promise<NotificationPermission>;
  trackPermissionGranted: (source: NotificationPromptSource) => void;
}

const NotificationsContext =
  React.createContext<NotificationsContextData>(null);

export default NotificationsContext;

export interface NotificationsContextProviderProps {
  children: ReactNode;
  unreadCount?: number;
  isBootLoaded?: boolean;
  app: BootApp;
}

enum PushNotificationState {
  Boot = 'boot',
  Initializing = 'initializing',
  Initialized = 'initialized',
}

const checkIsNotificationSupported = () => !!globalThis.window?.Notification;
const ALERT_PUSH_KEY = 'alert_push_key';

export const NotificationsContextProvider = ({
  app,
  children,
  isBootLoaded,
  unreadCount = 0,
}: NotificationsContextProviderProps): ReactElement => {
  const isExtension = checkIsExtension();
  const isSupported = checkIsNotificationSupported();
  const { trackEvent } = useAnalyticsContext();
  const { user } = useContext(AuthContext);
  const [OneSignal, setOneSignal] = useState<typeof OneSignalMod>();
  const [state, setState] = useState(PushNotificationState.Boot);
  const [currentUnreadCount, setCurrentUnreadCount] = useState(unreadCount);
  const [isAlertShown, setIsAlertShown] = usePersistentContext(
    ALERT_PUSH_KEY,
    true,
  );
  const notificationSourceRef = useRef<string>();
  const subscriptionCallbackRef = useRef(
    (
      isSubscribedNew: boolean,
      source?: NotificationPromptSource,
      existing_permission?: boolean,
    ) => {
      if (isSubscribedNew) {
        trackEvent({
          event_name: AnalyticsEvent.ClickEnableNotification,
          extra: JSON.stringify({
            origin: source || notificationSourceRef.current,
            permission: 'granted',
            ...(existing_permission && { existing_permission }),
          }),
        });
      }
    },
  );

  const onUpdatePush = useCallback(
    async (permission: NotificationPermission) => {
      const isGranted = permission === 'granted';

      if (isGranted) {
        await OneSignal?.User.PushSubscription.optIn();
      } else {
        await OneSignal?.User.PushSubscription.optOut();
      }

      if (isAlertShown && isGranted) {
        setIsAlertShown(false);
      }

      return isGranted;
    },
    [OneSignal, isAlertShown, setIsAlertShown],
  );

  const {
    onOpenPopup,
    onAcceptedPermissionJustNow,
    onPermissionCache,
    acceptedPermissionJustNow,
    hasPermissionCache,
  } = useNotificationPermissionPopup({
    onSuccess: !isExtension && onUpdatePush,
  });

  const onUpdatePermission = useCallback(
    async (permission: NotificationPermission) => {
      const allowedPush = await onUpdatePush(permission);

      onPermissionCache(allowedPush ? 'granted' : 'default');
    },
    [onPermissionCache, onUpdatePush],
  );

  const onTogglePermission = useCallback(
    async (
      source: NotificationPromptSource,
    ): Promise<NotificationPermission> => {
      if (!user) {
        return 'default';
      }

      const { permission, requestPermission } = globalThis.Notification ?? {};

      if (app === BootApp.Extension || permission === 'denied') {
        onOpenPopup(source);
        return null;
      }

      if (OneSignal.User.PushSubscription.optedIn) {
        await onUpdatePermission('denied');
        return 'denied';
      }

      notificationSourceRef.current = source;
      const result = await requestPermission?.();
      await onUpdatePermission(result);

      return result;
    },
    [user, app, onOpenPopup, onUpdatePermission, OneSignal],
  );

  const shouldInitialize =
    state === PushNotificationState.Boot &&
    !isExtension &&
    !isTesting &&
    user &&
    isSupported;

  useEffect(() => {
    if (!shouldInitialize) {
      return;
    }

    setState(PushNotificationState.Initializing);

    import('react-onesignal').then(async (mod) => {
      const OneSignalReact = mod.default;

      OneSignalReact.Notifications.addEventListener(
        'permissionChange',
        (value) => {
          subscriptionCallbackRef.current?.(value);
        },
      );

      // OneSignalReact.Debug.setLogLevel('trace');
      await OneSignalReact.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: isDevelopment,
        serviceWorkerParam: { scope: '/push/onesignal/' },
        serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
      });
      await OneSignalReact.login(user.id);
      setOneSignal(OneSignalReact);
      setState(PushNotificationState.Initialized);
    });
  }, [shouldInitialize, user]);

  useEffect(() => {
    setCurrentUnreadCount(unreadCount);
  }, [unreadCount]);

  const clearUnreadCount = useCallback(() => setCurrentUnreadCount(0), []);
  const incrementUnreadCount = useCallback(
    (value = 1) => setCurrentUnreadCount((current) => current + value),
    [],
  );
  const trackPermissionGranted = useCallback(
    (source: NotificationPromptSource) =>
      subscriptionCallbackRef.current?.(true, source, true),
    [],
  );

  return (
    <NotificationsContext.Provider
      value={{
        isSubscribed: OneSignal?.User.PushSubscription.optedIn,
        hasPermissionCache,
        acceptedPermissionJustNow,
        unreadCount: currentUnreadCount,
        onAcceptedPermissionJustNow,
        shouldShowSettingsAlert: isAlertShown,
        onShouldShowSettingsAlert: setIsAlertShown,
        onTogglePermission,
        clearUnreadCount,
        incrementUnreadCount,
        trackPermissionGranted,
        isNotificationSupported: OneSignal?.Notifications.isPushSupported(),
        isInitialized:
          isBootLoaded &&
          (state === PushNotificationState.Initialized || isTesting || !user),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationContext = (): NotificationsContextData =>
  useContext(NotificationsContext);
