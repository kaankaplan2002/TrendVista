import React, { useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Bookmark, 
  BarChart2, 
  PieChart, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle
} from 'lucide-react';

export default function AnalyticsDashboard({ lang = 'tr', role = 'creator' }) {
  const isTr = lang === 'tr';
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Performance metrics mock data
  const metrics = {
    totalViews: '2,845,200',
    viewsGrowth: '+42.5%',
    engagementRate: '8.9%',
    engagementGrowth: '+1.8%',
    totalShares: '154,200',
    sharesGrowth: '+28.4%',
    viralityScore: '94/100'
  };

  // Weekly traffic bars
  const weeklyData = [
    { day: isTr ? 'Pzt' : 'Mon', views: 240000, height: '55%' },
    { day: isTr ? 'Sal' : 'Tue', views: 420000, height: '90%' },
    { day: isTr ? 'Çar' : 'Wed', views: 310000, height: '70%' },
    { day: isTr ? 'Per' : 'Thu', views: 290000, height: '65%' },
    { day: isTr ? 'Cum' : 'Fri', views: 380000, height: '82%' },
    { day: isTr ? 'Cmt' : 'Sat', views: 490000, height: '98%' },
    { day: isTr ? 'Paz' : 'Sun', views: 520000, height: '100%' }
  ];

  // Platform distribution
  const platformStats = [
    { name: 'TikTok', percentage: 48, color: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)', views: '1.36M' },
    { name: 'Instagram Reels', percentage: 34, color: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)', views: '967K' },
    { name: 'YouTube Shorts', percentage: 18, color: 'linear-gradient(90deg, #ff0844 0%, #ffb199 100%)', views: '512K' }
  ];

  // Top published videos
  const topVideos = [
    {
      id: 1,
      title: isTr ? 'Haftalık Planlama Rutini (Minimalist)' : 'Minimalist Weekly Planning Routine',
      platform: 'TikTok',
      views: '840,500',
      likes: '92.4K',
      shares: '18.2K',
      engagement: '%11.2',
      status: isTr ? 'Mükemmel 🟢' : 'Excellent 🟢',
      badgeColor: 'rgba(16, 185, 129, 0.2)',
      textColor: '#34d399'
    },
    {
      id: 2,
      title: isTr ? 'Evde Buzlu Matcha Hazırlama' : 'At-Home Iced Matcha Routine',
      platform: 'Instagram',
      views: '620,100',
      likes: '74.8K',
      shares: '12.5K',
      engagement: '%9.8',
      status: isTr ? 'Yüksek 🔵' : 'High 🔵',
      badgeColor: 'rgba(0, 210, 255, 0.2)',
      textColor: 'var(--color-secondary)'
    },
    {
      id: 3,
      title: isTr ? 'Yapay Zeka İle İçerik Üretimi 2026' : 'AI Content Creation 2026 Guide',
      platform: 'YouTube',
      views: '415,800',
      likes: '48.2K',
      shares: '8.9K',
      engagement: '%8.4',
      status: isTr ? 'Yüksek 🔵' : 'High 🔵',
      badgeColor: 'rgba(0, 210, 255, 0.2)',
      textColor: 'var(--color-secondary)'
    },
    {
      id: 4,
      title: isTr ? 'Mikro Kapsül Gardırop Trendi' : 'Micro Capsule Wardrobe Trend',
      platform: 'TikTok',
      views: '290,400',
      likes: '28.1K',
      shares: '4.2K',
      engagement: '%7.1',
      status: isTr ? 'Normal 🟡' : 'Average 🟡',
      badgeColor: 'rgba(245, 158, 11, 0.2)',
      textColor: '#f59e0b'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Timeframe Selector */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart2 size={28} style={{ color: 'var(--color-secondary)' }} />
            {role === 'creator' ? (isTr ? 'İçerik Performansı & Analitik' : 'Content Performance & Analytics') : (isTr ? 'Marka & Kampanya Analitiği' : 'Brand & Campaign Analytics')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isTr ? 'Algoritma skorunuz, izlenme ivmeniz ve kitle etkileşiminizin canlı dökümü.' : 'Real-time breakdown of your algorithm score, view momentum, and audience engagement.'}
          </p>
        </div>

        {/* Timeframe Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
          {[
            { key: '24h', label: isTr ? '24 Saat' : '24 Hours' },
            { key: '7d', label: isTr ? 'Son 7 Gün' : 'Last 7 Days' },
            { key: '30d', label: isTr ? 'Son 30 Gün' : 'Last 30 Days' }
          ].map((tf) => (
            <button
              key={tf.key}
              onClick={() => setSelectedTimeframe(tf.key)}
              className={`btn ${selectedTimeframe === tf.key ? 'btn-glow-cyan' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '8px' }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Top Key Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Total Views Card */}
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              {isTr ? 'Toplam İzlenme' : 'Total Views'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--color-secondary)' }}>
              <Eye size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: '800', marginBottom: '0.3rem' }}>
            {metrics.totalViews}
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} /> {metrics.viewsGrowth} {isTr ? 'bu dönem' : 'this period'}
          </span>
        </div>

        {/* Engagement Rate Card */}
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              {isTr ? 'Etkileşim Oranı' : 'Engagement Rate'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(240, 147, 251, 0.1)', color: '#f093fb' }}>
              <Zap size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: '800', marginBottom: '0.3rem' }}>
            {metrics.engagementRate}
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} /> {metrics.engagementGrowth} {isTr ? 'sektör üstü' : 'above avg'}
          </span>
        </div>

        {/* Total Shares & Saves Card */}
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              {isTr ? 'Paylaşım & Kaydetme' : 'Shares & Saves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
              <Bookmark size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: '800', marginBottom: '0.3rem' }}>
            {metrics.totalShares}
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} /> {metrics.sharesGrowth}
          </span>
        </div>

        {/* Algorithmic Score Card */}
        <div className="glass-card" style={{ padding: '1.4rem', border: '1.5px solid rgba(0, 210, 255, 0.3)', background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(27, 79, 255, 0.05))' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: '700' }}>
              {isTr ? 'Algoritma Skoru' : 'Virality Score'}
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              {isTr ? 'Sınıfının En İyisi' : 'Top 5% Tier'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: '800', marginBottom: '0.3rem' }}>
            {metrics.viralityScore}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {isTr ? 'Algoritma tamamlama oranı %88.' : 'Completion rate at 88%.'}
          </span>
        </div>
      </div>

      {/* 2. Charts Section: Traffic & Platform Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Weekly Traffic Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '700' }}>
                📊 {isTr ? 'Haftalık İzlenme Trafiği' : 'Weekly View Traffic'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {isTr ? 'Günlük izlenme hacmi dalgalanması' : 'Daily view volume fluctuation'}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: '700' }}>
              ~406K / {isTr ? 'gün' : 'day'}
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', height: '160px', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '28px', 
                    height: d.height, 
                    background: i === 6 ? 'linear-gradient(180deg, var(--color-secondary), var(--color-primary))' : 'rgba(0, 210, 255, 0.25)', 
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height 0.4s ease'
                  }}
                  title={`${d.day}: ${d.views.toLocaleString()} ${isTr ? 'izlenme' : 'views'}`}
                />
                <span style={{ fontSize: '0.75rem', color: i === 6 ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: i === 6 ? 'bold' : 'normal' }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Share & Distribution */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '700' }}>
                  📱 {isTr ? 'Platform Dağılımı' : 'Platform Share'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {isTr ? 'Platform bazlı izlenme payları' : 'View proportion across platforms'}
                </span>
              </div>
              <PieChart size={20} style={{ color: 'var(--color-secondary)' }} />
            </div>

            {/* Platform Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {platformStats.map((p, idx) => (
                <div key={idx}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>{p.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{p.views} ({p.percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.percentage}%`, height: '100%', background: p.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Best Time to Post & Audience Demographics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Best Time to Post */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: '#f59e0b' }} />
              {isTr ? 'En İyi Paylaşım Saatleri' : 'Best Time to Post'}
            </h3>
            <span className="badge badge-coral" style={{ fontSize: '0.65rem' }}>
              ⚡ {isTr ? 'Algoritma Tavsiyesi' : 'AI Recommendation'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '1rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '700', display: 'block', marginBottom: '0.2rem' }}>
                🔥 {isTr ? 'Zirve Paylaşım Penceresi:' : 'Peak Posting Window:'}
              </span>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: '800' }}>
                19:00 - 21:30 <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>({isTr ? 'Pazar & Salı' : 'Sun & Tue'})</span>
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                {isTr ? 'Bu saatlerde atılan videolar ilk 30 dakikada %3.2 daha fazla izlenme ivmesi kazanıyor.' : 'Videos posted during these hours get 3.2x faster initial 30m boost.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{isTr ? 'İdeal Video Süresi' : 'Ideal Video Length'}</span>
                <span style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: '700' }}>18 - 24 {isTr ? 'sn' : 'sec'}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{isTr ? 'Kanca Tamamlama' : 'Hook Retention'}</span>
                <span style={{ fontSize: '1rem', color: '#34d399', fontWeight: '700' }}>%82</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--color-secondary)' }} />
              {isTr ? 'İzleyici Demografisi' : 'Audience Demographics'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {isTr ? 'Aktif kitle yapısı' : 'Active audience pool'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Age Distribution */}
            <div>
              <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                <span>{isTr ? 'Yaş Dağılımı (18-24 baskın)' : 'Age Groups (18-24 dominant)'}</span>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>18-24: %56</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '56%', background: 'var(--color-secondary)' }} title="18-24 (%56)" />
                <div style={{ width: '31%', background: '#4facfe' }} title="25-34 (%31)" />
                <div style={{ width: '13%', background: '#a855f7' }} title="35+ (%13)" />
              </div>
            </div>

            {/* Gender & Top Cities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{isTr ? 'Cinsiyet Kırılımı' : 'Gender Split'}</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '700' }}>%62 {isTr ? 'Kadın' : 'Female'} / %38 {isTr ? 'Erkek' : 'Male'}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{isTr ? 'Lider Şehirler' : 'Top Locations'}</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '700' }}>İstanbul, Ankara, İzmir</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Performing Published Content Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', fontWeight: '700' }}>
              🎬 {isTr ? 'Yayınlanan En Başarılı İçerikler' : 'Top Performing Published Content'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {isTr ? 'Algoritma sağlık durumu ve izlenme dökümü' : 'Algorithmic health status and engagement breakdown'}
            </span>
          </div>
          <span className="badge badge-success">
            <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
            {isTr ? '4 İçerik İncelendi' : '4 Posts Tracked'}
          </span>
        </div>

        {/* Content Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'İçerik Başlığı' : 'Content Title'}</th>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'Platform' : 'Platform'}</th>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'İzlenme' : 'Views'}</th>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'Beğeni' : 'Likes'}</th>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'Etkileşim' : 'Engagement'}</th>
                <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{isTr ? 'Algoritma Sağlığı' : 'Algorithm Status'}</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((video) => (
                <tr key={video.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    {video.title}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '4px',
                      background: video.platform === 'TikTok' ? 'rgba(255, 255, 255, 0.08)' : video.platform === 'Instagram' ? 'rgba(225, 48, 108, 0.15)' : 'rgba(255, 0, 0, 0.12)',
                      color: video.platform === 'TikTok' ? '#888' : video.platform === 'Instagram' ? '#e1306c' : '#ff0000',
                      fontWeight: '600'
                    }}>
                      {video.platform}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    {video.views}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    {video.likes}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 'bold', color: '#34d399', fontSize: '0.9rem' }}>
                    {video.engagement}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '6px', 
                      background: video.badgeColor, 
                      color: video.textColor, 
                      fontWeight: '600' 
                    }}>
                      {video.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
