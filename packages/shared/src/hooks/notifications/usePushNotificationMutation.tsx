import { useCallback, useState } from 'react';
import usePersistentContext, {
  UserPersistentContextType,
} from '../usePersistentContext';
import { ActionType } from '../../graphql/actions';
import { useActions } from '../useActions';
import {
  ENABLE_NOTIFICATION_WINDOW_KEY,
  PermissionEvent,
  useNotificationPermissionPopup,
} from '../useNotificationPermissionPopup';
import { checkIsExtension } from '../../lib/func';
import { NotificationPromptSource } from '../../lib/analytics';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePushNotificationContext } from '../../contexts/PushNotificationContext';
import { useEventListener } from '../useEventListener';

export const PERMISSION_NOTIFICATION_KEY = 'permission:notification';

export interface UsePushNotificationMutation {
  acceptedJustNow: boolean;
  hasPermissionCache: boolean;
  onEnablePush: (source: NotificationPromptSource) => Promise<boolean>;
  onTogglePermission: (source: NotificationPromptSource) => Promise<unknown>;
}

interface UsePushNotificationMutationProps {
  onPopupGranted?(): void;
}

export const usePermissionCache =
  (): UserPersistentContextType<NotificationPermission> =>
    usePersistentContext(PERMISSION_NOTIFICATION_KEY, 'default');

export const usePushNotificationMutation = ({
  onPopupGranted,
}: UsePushNotificationMutationProps = {}): UsePushNotificationMutation => {
  const isExtension = checkIsExtension();
  const { onSourceChange, OneSignal, isSubscribed, shouldOpenPopup } =
    usePushNotificationContext();
  const { user } = useAuthContext();
  const [acceptedJustNow, onAcceptedJustNow] = useState(false);
  const { completeAction, checkHasCompleted } = useActions();
  const [permissionCache, setPermissionCache] = usePermissionCache();

  const onGranted = useCallback(async () => {
    setPermissionCache('granted');
    onAcceptedJustNow(true);

    console.log('test9');
    if (!checkHasCompleted(ActionType.EnableNotification)) {
      completeAction(ActionType.EnableNotification);
    }

    if (OneSignal) {
      console.log('test10');
      await OneSignal.User.PushSubscription.optIn();
    }

    return true;
  }, [
    OneSignal,
    checkHasCompleted,
    completeAction,
    setPermissionCache,
    onAcceptedJustNow,
  ]);

  const { onOpenPopup } = useNotificationPermissionPopup({
    onPermissionChange: (permission) => {
      if (isExtension) {
        return null;
      }

      if (permission === 'granted') {
        return onGranted();
      }

      return setPermissionCache(permission);
    },
  });

  const onEnablePush = useCallback(
    async (source: NotificationPromptSource): Promise<boolean> => {
      if (!user) {
        return false;
      }

      console.log('test3');
      const { permission } = globalThis.Notification ?? {};

      if (shouldOpenPopup || permission === 'denied') {
        onOpenPopup(source);
        return false;
      }

      console.log('test4');
      onSourceChange(source);

      if (permission === 'granted') {
        console.log('test5');
        return onGranted();
      }

      console.log('test6');
      await OneSignal.Notifications.requestPermission();

      console.log('test7');
      const isGranted = OneSignal.Notifications.permission;

      if (isGranted) {
        console.log('test8');
        await onGranted();
      }

      return isGranted;
    },
    [user, shouldOpenPopup, onSourceChange, OneSignal, onOpenPopup, onGranted],
  );

  const onTogglePermission = useCallback(
    async (source: NotificationPromptSource): Promise<unknown> => {
      console.log('test1');
      if (isSubscribed) {
        onSourceChange(source);
        return OneSignal.User.PushSubscription.optOut();
      }

      console.log('test2');
      return onEnablePush(source);
    },
    [OneSignal, isSubscribed, onEnablePush, onSourceChange],
  );

  useEventListener(globalThis, 'message', async (e) => {
    const { permission }: PermissionEvent = e?.data ?? {};
    const earlyReturnChecks = [
      e.data?.eventKey !== ENABLE_NOTIFICATION_WINDOW_KEY,
      !shouldOpenPopup,
      permission !== 'granted',
    ];

    if (earlyReturnChecks.some(Boolean)) {
      return;
    }

    onGranted();

    if (onPopupGranted) {
      onPopupGranted();
    }
  });

  return {
    hasPermissionCache: permissionCache === 'granted',
    onTogglePermission,
    acceptedJustNow,
    onEnablePush,
  };
};
