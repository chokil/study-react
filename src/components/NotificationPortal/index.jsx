import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from 'src/contexts/AppContext';
import classes from './NotificationPortal.module.css';

export const NotificationPortal = () => {
  const { state, removeNotification } = useApp();
  const { notifications } = state;

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={classes.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={classes.notification}
          onClick={() => removeNotification(notification.id)}
        >
          <p>{notification.message}</p>
          <time className={classes.time}>
            {notification.timestamp.toLocaleTimeString()}
          </time>
        </div>
      ))}
    </div>,
    document.body
  );
};