import { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share } from 'lucide-react';

export default function PwaInstallBanner({ lang = 'tr' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Handle Chrome / Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not dismissed in session, show banner after 2s
    if (isIosDevice && !sessionStorage.getItem('pwa_banner_dismissed')) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '460px',
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 210, 255, 0.3)',
        borderRadius: '16px',
        padding: '14px 18px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 210, 255, 0.15)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1b4fff, #00d2ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(27, 79, 255, 0.4)'
          }}>
            <Smartphone size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>
              {lang === 'tr' ? 'TrendVista Mobil Uygulaması' : 'TrendVista Mobile App'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {lang === 'tr' ? 'Ana ekrana ekle, uygulama gibi kullan!' : 'Add to home screen for native app experience'}
            </div>
          </div>
        </div>

        <button 
          onClick={handleDismiss}
          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {showIosInstructions ? (
        <div style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', color: '#cbd5e1' }}>
          {lang === 'tr' ? (
            <>1. Safari menüsündeki <Share size={14} style={{ display: 'inline', margin: '0 2px' }} /> <strong>Paylaş</strong> butonuna dokunun.<br />2. <strong>"Ana Ekrana Ekle"</strong> seçeneğini belirleyin.</>
          ) : (
            <>1. Tap the <Share size={14} style={{ display: 'inline', margin: '0 2px' }} /> <strong>Share</strong> button in Safari.<br />2. Select <strong>"Add to Home Screen"</strong>.</>
          )}
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="btn btn-glow-cyan"
          style={{
            width: '100%',
            padding: '0.55rem',
            fontSize: '0.82rem',
            fontWeight: '700',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Download size={16} /> {lang === 'tr' ? 'Ana Ekrana Ekle (Yükle)' : 'Add to Home Screen'}
        </button>
      )}
    </div>
  );
}
