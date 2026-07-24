import { useState } from 'react';
import { Star, Search, Trash2, Send, TrendingUp } from 'lucide-react';

export default function SavedTrendsLibrary({ lang = 'tr', savedTrends = [], onRemoveBookmark, onUseInStudio }) {
  const isTr = lang === 'tr';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const filteredTrends = savedTrends.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || (item.platform && item.platform.toLowerCase().includes(selectedPlatform));
    return matchesSearch && matchesPlatform;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Card */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Star size={24} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              <h2 style={{ fontSize: '1.35rem', color: 'var(--color-text)' }}>
                {isTr ? 'Favori Trendler & İçerik Kütüphanesi' : 'Saved Trends & Bookmarks'}
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {isTr ? 'Kaydettiğin yükselen trendler kütüphanesi. İstediğin zaman tek tıkla AI Stüdyo\'da senaryolaştır.' : 'Your personal bookmarked trends library. Generate AI scripts in one click.'}
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            {savedTrends.length} {isTr ? 'Trend Kayıtlı' : 'Trends Saved'}
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder={isTr ? 'Favori trendlerde ara...' : 'Search bookmarked trends...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem 0.7rem 2.75rem',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--color-text)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'tiktok', 'instagram', 'youtube'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className="btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedPlatform === plat ? 'var(--color-secondary)' : 'var(--color-border)',
                  background: selectedPlatform === plat ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
                  color: selectedPlatform === plat ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                  textTransform: 'capitalize'
                }}
              >
                {plat === 'all' ? (isTr ? 'Tüm Platformlar' : 'All Platforms') : plat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Trends Grid */}
      {filteredTrends.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', borderRadius: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Star size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '0.35rem' }}>
            {isTr ? 'Henüz Favori Trend Yok' : 'No Saved Trends Yet'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            {isTr ? 'Trend Radar veya AI Stüdyo sekmelerinde kartların üzerindeki yıldız butonuna basarak trendleri buraya ekleyebilirsin.' : 'Click the star icon on any trend card in Trend Radar or AI Studio to bookmark it here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredTrends.map((trend) => (
            <div 
              key={trend.id} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem', 
                borderRadius: '14px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '1rem',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                    {trend.category || 'Güzellik & Bakım'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <TrendingUp size={13} /> {trend.growth || '+340%'}
                  </span>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.4', marginBottom: '0.4rem' }}>
                  {trend.title}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Platform: <strong style={{ color: 'var(--color-secondary)' }}>{trend.platform ? trend.platform.toUpperCase() : 'TIKTOK'}</strong>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                {onUseInStudio && (
                  <button
                    onClick={() => onUseInStudio(trend.title)}
                    className="btn btn-glow-cyan"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Send size={13} /> {isTr ? 'AI Stüdyo\'da Yaz' : 'Generate in AI Studio'}
                  </button>
                )}

                {onRemoveBookmark && (
                  <button
                    onClick={() => onRemoveBookmark(trend.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.75rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                    title={isTr ? 'Favorilerden Çıkar' : 'Remove Bookmark'}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
