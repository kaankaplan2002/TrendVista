import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Sparkles, TrendingUp, ChevronRight, X } from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    type: 'trend',
    title: 'Yeni Viral Sinyal!',
    message: '🎵 "Salyangoz Özlü Serum Rutini" TikTok\'ta %340 ivme yakaladı.',
    time: '2 dk önce',
    read: false,
    platform: 'TikTok',
    growth: '+340%'
  },
  {
    id: 2,
    type: 'trend',
    title: 'Güzellik Kategorisi Yükselişte',
    message: '📸 "90lar Saç Kurutma Yöntemi" Instagram Reels\'te hızla yayılıyor.',
    time: '15 dk önce',
    read: false,
    platform: 'Instagram',
    growth: '+210%'
  },
  {
    id: 3,
    type: 'hook',
    title: 'Kanca Laboratuvarı Güncellendi',
    message: '💡 Merak & Gizem kategorisine 5 yüksek CTR viral kanca eklendi.',
    time: '1 saat önce',
    read: false,
    platform: 'Studio',
    growth: 'CTR %98'
  }
];

export default function NotificationCenter({ lang = 'tr', onSelectNotification, navigateToWorkspace }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);

  const isTr = lang === 'tr';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Automatic popup toast notifications disabled per user preference
  useEffect(() => {
    setToast(null);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setIsOpen(false);
    if (navigateToWorkspace) navigateToWorkspace('creator');
    if (onSelectNotification) onSelectNotification(notif);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{
          position: 'relative',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          border: unreadCount > 0 ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid var(--color-border)',
          background: unreadCount > 0 ? 'rgba(0, 210, 255, 0.08)' : 'transparent'
        }}
        title={isTr ? 'Canlı Trend Bildirimleri' : 'Live Trend Notifications'}
      >
        <Bell size={16} style={{ color: unreadCount > 0 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }} />

        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
            color: '#fff',
            fontSize: '0.62rem',
            fontWeight: '800',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
            border: '2px solid var(--bg-primary)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 22px)',
          right: 0,
          width: '350px',
          maxWidth: '90vw',
          background: '#0d1222',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 210, 255, 0.2)',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                {isTr ? 'Canlı Radar Bildirimleri' : 'Live Radar Notifications'}
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-secondary)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontWeight: '600'
                }}
              >
                <CheckCheck size={13} /> {isTr ? 'Tümünü Oku' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                {isTr ? 'Henüz bildirim yok.' : 'No notifications yet.'}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: n.read ? 'transparent' : 'rgba(0, 210, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  className="notif-item-hover"
                >
                  {!n.read && (
                    <div style={{
                      position: 'absolute',
                      left: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--color-secondary)'
                    }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: n.read ? 'rgba(255,255,255,0.85)' : '#fff' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', background: 'rgba(0,210,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: '600' }}>
                      {n.growth}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', margin: '0 0 0.3rem 0', lineHeight: '1.35' }}>
                    {n.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                    <span>{n.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--color-secondary)' }}>
                      {isTr ? 'İncele' : 'Inspect'} <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Live Toast Popup Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '24px',
          zIndex: 10000,
          background: '#0d1326',
          border: '2px solid var(--color-secondary)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          maxWidth: '380px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 210, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          animation: 'slideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0,210,255,0.3) 0%, rgba(27,79,255,0.3) 100%)',
            border: '1px solid var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-secondary)',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(0,210,255,0.4)'
          }}>
            <TrendingUp size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>{toast.title}</span>
              <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: '800', background: 'rgba(74, 222, 128, 0.15)', padding: '0.1rem 0.45rem', borderRadius: '6px' }}>{toast.growth}</span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast(null)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
