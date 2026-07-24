import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ContentCalendar({ lang = 'tr', scheduledItems = [], onAddSchedule, onDeleteSchedule }) {
  const isTr = lang === 'tr';
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Pazartesi');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [time, setTime] = useState('19:00');
  const [status, setStatus] = useState('scheduled');

  const daysOfWeek = isTr 
    ? ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const peakHours = {
    tiktok: '19:00 - 21:30',
    instagram: '18:00 - 20:30',
    youtube: '15:00 - 18:00'
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onAddSchedule) {
      onAddSchedule({
        id: Date.now().toString(),
        title,
        day: selectedDay,
        platform,
        time,
        status
      });
    }

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <CalendarIcon size={24} style={{ color: 'var(--color-secondary)' }} />
              <h2 style={{ fontSize: '1.35rem', color: 'var(--color-text)' }}>
                {isTr ? 'AI İçerik Yayınlama Takvimi' : 'AI Content Calendar & Scheduler'}
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {isTr ? 'Ürettiğin senaryoları gün ve saate göre planla, etkileşim zirvelerini yakala.' : 'Schedule AI scripts by day and hour for maximum engagement peaks.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-glow-cyan"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> {isTr ? 'Yeni İçerik Planla' : 'Schedule New Item'}
          </button>
        </div>

        {/* Peak Hours Badges */}
        <div style={{ 
          marginTop: '1.25rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--color-border)', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem',
          fontSize: '0.8rem' 
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} style={{ color: 'var(--color-warning)' }} /> {isTr ? 'Önerilen Zirve Saatler:' : 'Peak Hours:'}
          </span>
          <span className="badge badge-cyan">TikTok: {peakHours.tiktok}</span>
          <span className="badge badge-blue">Instagram: {peakHours.instagram}</span>
          <span className="badge badge-coral">YouTube: {peakHours.youtube}</span>
        </div>
      </div>

      {/* Calendar Grid (7 Days) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem' 
      }}>
        {daysOfWeek.map((dayName) => {
          const dayItems = scheduledItems.filter(item => item.day === dayName);

          return (
            <div 
              key={dayName} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem', 
                borderRadius: '14px', 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '220px' 
              }}
            >
              {/* Day Header */}
              <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text)' }}>
                  {dayName}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: '600' }}>
                  {dayItems.length} {isTr ? 'İçerik' : 'Items'}
                </span>
              </div>

              {/* Day Scheduled Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {dayItems.length === 0 ? (
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: '1px dashed var(--color-border)', 
                    borderRadius: '10px', 
                    color: 'var(--color-text-muted)', 
                    fontSize: '0.78rem',
                    padding: '1rem'
                  }}>
                    {isTr ? 'Planlanmış içerik yok' : 'No items scheduled'}
                  </div>
                ) : (
                  dayItems.map((item) => (
                    <div 
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        position: 'relative'
                      }}
                    >
                      <div className="flex-between">
                        <span className={`badge ${item.platform === 'tiktok' ? 'badge-cyan' : item.platform === 'instagram' ? 'badge-coral' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                          {item.platform.toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={12} /> {item.time}
                          </span>
                          {onDeleteSchedule && (
                            <button
                              onClick={() => onDeleteSchedule(item.id)}
                              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: '1.3' }}>
                        {item.title}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: item.status === 'published' ? '#4ade80' : 'var(--color-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {item.status === 'published' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {item.status === 'published' ? (isTr ? 'Yayınlandı' : 'Published') : (isTr ? 'Planlandı' : 'Scheduled')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(5, 8, 17, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="glass-card" 
            style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              🗓️ {isTr ? 'Yeni İçerik Planla' : 'Schedule New Item'}
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  {isTr ? 'İçerik Başlığı / Trend' : 'Content Title / Trend'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isTr ? 'Örn: Salyangoz Özlü Serum Rutini' : 'e.g. Snail Mucin Routine'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    {isTr ? 'Gün' : 'Day'}
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)' }}
                  >
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    {isTr ? 'Platform' : 'Platform'}
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)' }}
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    {isTr ? 'Saat' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    {isTr ? 'Durum' : 'Status'}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)' }}
                  >
                    <option value="scheduled">{isTr ? 'Planlandı' : 'Scheduled'}</option>
                    <option value="published">{isTr ? 'Yayınlandı' : 'Published'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-glow-cyan" style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}>
                  {isTr ? 'Kaydet ve Planla' : 'Save & Schedule'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}>
                  {isTr ? 'İptal' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
