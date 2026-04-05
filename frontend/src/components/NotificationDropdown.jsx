import React from 'react';
import { useNotifications } from '../context/NotificationContext';

const formatTimestamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
};

const NotificationDropdown = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        <button
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          onClick={markAllAsRead}
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-slate-400">
          No notifications yet.
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="text-xs text-slate-600">{notification.message}</p>
                </div>
                {!notification.read && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {formatTimestamp(notification.timestamp)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
