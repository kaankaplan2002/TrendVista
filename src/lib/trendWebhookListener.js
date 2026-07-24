/**
 * Live Trend Webhook Event Listener & Dispatcher
 */

const listeners = new Set();

/**
 * Subscribe to live trend webhook events
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function subscribeToTrendWebhooks(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Broadcast incoming webhook payload to all active workspace subscribers
 * @param {Object} payload
 */
export function broadcastTrendWebhook(payload) {
  const event = {
    id: `wh-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    type: payload.type || 'TREND_SPIKE_DETECTED',
    platform: payload.platform || 'TikTok',
    trendName: payload.trendName || 'Yeni Viral Akım Sinyali',
    growth: payload.growth || '+450%',
    region: payload.region || 'TR',
    message: payload.message || 'Canlı Webhook: Algoritma ivmesi %450 üzerine çıktı!'
  };

  listeners.forEach(cb => {
    try {
      cb(event);
    } catch (e) {
      console.error('[WebhookListener] Callback error:', e);
    }
  });
}

/**
 * Trigger a platform-specific simulated webhook spike for testing & demo purposes
 * @param {string} platform - 'TikTok' | 'Instagram' | 'YouTube' | 'all'
 * @param {string} lang - 'tr' | 'en'
 */
export function triggerDemoWebhookSpike(platform = 'TikTok', lang = 'tr') {
  const allSpikes = {
    TikTok: [
      {
        platform: 'TikTok',
        trendName: lang === 'tr' ? '#ASMRMorningRoutine (Canlı TikTok Sinyali)' : '#ASMRMorningRoutine (Live TikTok Signal)',
        growth: '+480%',
        message: lang === 'tr' ? '🎵 TİKTOK FLAS HABER: TikTok Türkiye\'de #ASMRMorningRoutine akımı son 1 saatte 4.8 kat yükselişe geçti!' : '🎵 TIKTOK FLASH: #ASMRMorningRoutine spiked 4.8x in the last hour on TikTok!'
      },
      {
        platform: 'TikTok',
        trendName: lang === 'tr' ? '#MinimalistDeskSetup (TikTok Trendi)' : '#MinimalistDeskSetup (TikTok Trend)',
        growth: '+350%',
        message: lang === 'tr' ? '🎵 TİKTOK UYARISI: #MinimalistDeskSetup etiketi ile paylaşılan video sayısı 50.000\'i aştı!' : '🎵 TIKTOK ALERT: Over 50,000 videos posted with #MinimalistDeskSetup!'
      }
    ],
    Instagram: [
      {
        platform: 'Instagram',
        trendName: lang === 'tr' ? 'Night Lights Reel Audio (Instagram Sinyali)' : 'Night Lights Reel Audio (Insta Signal)',
        growth: '+520%',
        message: lang === 'tr' ? '📸 INSTAGRAM REELS UYARISI: Instagram Reels ses kaydetme sayısı 10.000 BARAJINI AŞTI!' : '📸 INSTAGRAM REELS ALERT: Instagram audio saves exceeded 10,000!'
      },
      {
        platform: 'Instagram',
        trendName: lang === 'tr' ? 'Quiet Luxury Fashion Reels (Instagram)' : 'Quiet Luxury Fashion Reels (Insta)',
        growth: '+410%',
        message: lang === 'tr' ? '📸 INSTAGRAM FLAS HABER: Quiet Luxury giyim tarzı Reels videolarında etkileşim patlaması var!' : '📸 INSTAGRAM FLASH: Quiet Luxury Reels engagement exploded!'
      }
    ],
    YouTube: [
      {
        platform: 'YouTube',
        trendName: lang === 'tr' ? 'AI Voice Cloning 2.0 (YouTube Trend Patlaması)' : 'AI Voice Cloning 2.0 (YouTube Spike)',
        growth: '+390%',
        message: lang === 'tr' ? '▶️ YOUTUBE TRENDİ: Ses klonlama videoları YouTube arama hacminde 1. sıraya yükseldi!' : '▶️ YOUTUBE TREND: Voice cloning searches reached #1 on YouTube!'
      },
      {
        platform: 'YouTube',
        trendName: lang === 'tr' ? '5 AM Morning Routine Shorts (YouTube)' : '5 AM Morning Routine Shorts (YouTube)',
        growth: '+460%',
        message: lang === 'tr' ? '▶️ YOUTUBE SHORTS UYARISI: 5 AM sabah rutini videoları YouTube Türkiye gündemine girdi!' : '▶️ YOUTUBE SHORTS ALERT: 5 AM morning routine videos hit YouTube Trending!'
      }
    ]
  };

  // Determine target platform pool based on selected tab
  let targetPool = [];
  if (platform === 'TikTok') targetPool = allSpikes.TikTok;
  else if (platform === 'Instagram') targetPool = allSpikes.Instagram;
  else if (platform === 'YouTube') targetPool = allSpikes.YouTube;
  else {
    targetPool = [...allSpikes.TikTok, ...allSpikes.Instagram, ...allSpikes.YouTube];
  }

  const selectedTarget = targetPool[Math.floor(Math.random() * targetPool.length)];
  broadcastTrendWebhook(selectedTarget);
}
