import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  Bookmark
} from 'lucide-react';

export default function ViralAudioLab({ lang = 'tr', onUseAudioInStudio }) {
  const isTr = lang === 'tr';
  const [platformFilter, setPlatformFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(['audio-1', 'audio-3']);

  // Initial mock viral audio tracks data
  const audioTracks = [
    {
      id: 'audio-1',
      title: 'Night Lights (Chill Lofi Vibe)',
      artist: 'Aesthetic Beats / TikTok Original',
      platform: 'TikTok',
      platformBadge: '🎵 TikTok',
      category: 'vibe',
      growth: '+680%',
      videoCount: '184.2K Video',
      usageTip: isTr ? 'Minimalist sabah rutinleri ve vlog videoları için ideal.' : 'Ideal for minimalist morning routines and vlog videos.',
      bpm: '85 BPM'
    },
    {
      id: 'audio-2',
      title: 'Matcha Glow Routine Audio',
      artist: 'SkinCare Vibe Sound',
      platform: 'Instagram',
      platformBadge: '📸 Instagram Reels',
      category: 'beauty',
      growth: '+520%',
      videoCount: '92.5K Video',
      usageTip: isTr ? 'Cilt bakımı, makyaj ve güzellik lansmanları için en yüksek etkileşimli ses.' : 'Top engagement audio for skincare, makeup, and beauty launches.',
      bpm: '100 BPM'
    },
    {
      id: 'audio-3',
      title: '5 AM Productivity Bass Drop',
      artist: 'Focus & Grind Audio',
      platform: 'YouTube',
      platformBadge: '▶️ YouTube Shorts',
      category: 'motivation',
      growth: '+410%',
      videoCount: '64.8K Video',
      usageTip: isTr ? 'Disiplin, spor ve başarı içeriklerinde izleyiciyi tutma oranı %89.' : '89% retention rate in discipline, workout, and success content.',
      bpm: '128 BPM'
    },
    {
      id: 'audio-4',
      title: 'Crispy ASMR Tapping Sound Effect',
      artist: 'ASMR Studio Lab',
      platform: 'TikTok',
      platformBadge: '🎵 TikTok',
      category: 'asmr',
      growth: '+740%',
      videoCount: '210.6K Video',
      usageTip: isTr ? 'Ürün kutu açılımı (Unboxing) ve hassas ses rutinleri için 1 numaralı tercih.' : '#1 choice for product unboxing and sensitive audio routines.',
      bpm: 'N/A'
    },
    {
      id: 'audio-5',
      title: 'Retro Synthwave Summer Drive',
      artist: 'Neon Wave Music',
      platform: 'Instagram',
      platformBadge: '📸 Instagram Reels',
      category: 'vibe',
      growth: '+350%',
      videoCount: '78.1K Video',
      usageTip: isTr ? 'Seyahat, araba ve geçiş efektli (Transitions) Reels için mükemmel ritim.' : 'Perfect rhythm for travel, car, and transition Reels.',
      bpm: '115 BPM'
    },
    {
      id: 'audio-6',
      title: 'Quiet Luxury Piano & Violin',
      artist: 'Elegance Soundscapes',
      platform: 'TikTok',
      platformBadge: '🎵 TikTok',
      category: 'beauty',
      growth: '+490%',
      videoCount: '115.4K Video',
      usageTip: isTr ? 'Lüks giyim, moda kombini ve lüks yaşam tarzı videoları ile tam uyumlu.' : 'Seamlessly matches luxury fashion, outfit ideas, and lifestyle videos.',
      bpm: '72 BPM'
    }
  ];

  const filteredTracks = audioTracks.filter(track => {
    const matchesPlatform = platformFilter === 'all' || track.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || track.category === categoryFilter;
    return matchesPlatform && matchesCategory;
  });

  const togglePlay = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Music size={28} style={{ color: 'var(--color-secondary)' }} />
            {isTr ? 'Viral Müzik & Ses Laboratuvarı' : 'Viral Audio & Music Lab'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isTr ? 'TikTok, Reels ve Shorts algoritmalarında öne çıkan en popüler arka plan sesleri ve müzik akımları.' : 'Top trending background audio tracks and viral music trends boosting social algorithms.'}
          </p>
        </div>
      </div>

      {/* Featured #1 Audio Track of the Day */}
      <div className="glass-card animate-float" style={{ padding: '1.75rem', border: '1.5px solid rgba(0, 210, 255, 0.4)', background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1), rgba(168, 85, 247, 0.08))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
          
          {/* Disc Icon Play Button */}
          <button 
            onClick={() => togglePlay('audio-4')}
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: playingAudioId === 'audio-4' ? 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' : 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 210, 255, 0.4)',
              flexShrink: 0,
              transition: 'transform 0.2s ease'
            }}
          >
            {playingAudioId === 'audio-4' ? <Pause size={28} color="#fff" /> : <Play size={28} color="#050811" style={{ marginLeft: '4px' }} />}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-coral" style={{ fontSize: '0.68rem' }}>
                🔥 {isTr ? 'Günün #1 Viral Sesi' : '#1 Track of the Day'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>
                +740% {isTr ? 'İvme' : 'Growth'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text)', fontWeight: '800' }}>
              Crispy ASMR Tapping Sound Effect
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.15rem' }}>
              ASMR Studio Lab • 210.6K Video • TikTok & Reels
            </span>
          </div>
        </div>

        {/* Equalizer & Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Animated Equalizer Wave */}
          {playingAudioId === 'audio-4' && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
              {[16, 24, 12, 20, 28, 14, 22].map((h, idx) => (
                <div key={idx} style={{ width: '4px', height: `${h}px`, background: 'var(--color-secondary)', borderRadius: '2px', animation: 'float 0.4s ease-in-out infinite alternate' }} />
              ))}
            </div>
          )}

          <button 
            onClick={() => onUseAudioInStudio && onUseAudioInStudio('Crispy ASMR Tapping Sound Effect')}
            className="btn btn-glow-cyan"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={16} />
            {isTr ? 'Senaryoda Kullan' : 'Use in Script'}
          </button>
        </div>
      </div>

      {/* Platform & Category Filter Bars */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Platform Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: isTr ? '🌐 Tüm Mecralar' : '🌐 All Platforms' },
            { key: 'tiktok', label: '🎵 TikTok Trend Sesler' },
            { key: 'instagram', label: '📸 Instagram Reels' },
            { key: 'youtube', label: '▶️ YouTube Shorts' }
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPlatformFilter(p.key)}
              className={`btn ${platformFilter === p.key ? 'btn-glow-cyan' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '20px' }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Category Select */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">{isTr ? 'Tüm Kategoriler' : 'All Categories'}</option>
          <option value="beauty">{isTr ? 'Güzellik & Bakım' : 'Beauty & Care'}</option>
          <option value="vibe">{isTr ? 'Vibe & Estetik' : 'Vibe & Aesthetic'}</option>
          <option value="motivation">{isTr ? 'Motivasyon & Spor' : 'Motivation & Sports'}</option>
          <option value="asmr">{isTr ? 'ASMR & Ses Efektleri' : 'ASMR & Sound FX'}</option>
        </select>

      </div>

      {/* Audio Tracks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredTracks.map((track) => {
          const isPlaying = playingAudioId === track.id;
          const isBookmarked = bookmarkedIds.includes(track.id);

          return (
            <div 
              key={track.id} 
              className="glass-card" 
              style={{ 
                padding: '1.4rem', 
                border: isPlaying ? '1.5px solid var(--color-secondary)' : '1px solid var(--color-border)', 
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '1rem'
              }}
            >
              
              {/* Top row: Play button & info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <button
                  onClick={() => togglePlay(track.id)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isPlaying ? 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' : 'rgba(0, 210, 255, 0.12)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: isPlaying ? '#fff' : 'var(--color-secondary)'
                  }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                </button>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="flex-between" style={{ marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      {track.platformBadge}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>
                      {track.growth}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.title}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    {track.artist} • {track.videoCount}
                  </span>
                </div>
              </div>

              {/* Usage Tip & Equalizer animation */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                {isPlaying ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <Volume2 size={16} className="spin" />
                    <span>{isTr ? 'Ses Oynatılıyor...' : 'Playing Audio Stream...'} ({track.bpm})</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                    💡 {track.usageTip}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onUseAudioInStudio && onUseAudioInStudio(track.title)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={14} style={{ color: 'var(--color-secondary)' }} />
                  {isTr ? 'Senaryoda Kullan' : 'Use in Script'}
                </button>

                <button
                  onClick={() => toggleBookmark(track.id)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem', color: isBookmarked ? '#f59e0b' : 'var(--color-text-muted)', borderColor: isBookmarked ? 'rgba(245, 158, 11, 0.4)' : 'var(--color-border)' }}
                  title={isTr ? 'Favorilere Ekle' : 'Bookmark Track'}
                >
                  <Bookmark size={15} fill={isBookmarked ? '#f59e0b' : 'none'} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
