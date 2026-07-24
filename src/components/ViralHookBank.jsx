import { useState } from 'react';
import { Search, Copy, Check, Send, Flame } from 'lucide-react';

const HOOKS_DATASET = {
  tr: [
    // Merak & Gizem
    { id: 1, category: 'curiosity', type: 'Merak & Gizem', text: 'Eğer halen bu yöntemi kullanıyorsan bu videoyu hemen durdur!', ctr: '%97 CTR', platform: 'TikTok / Reels' },
    { id: 2, category: 'curiosity', type: 'Merak & Gizem', text: 'Kimsenin söylemediği ve sakladığı o büyük sırrı açıklıyorum...', ctr: '%95 CTR', platform: 'TikTok / Shorts' },
    { id: 3, category: 'curiosity', type: 'Merak & Gizem', text: 'Bu bilgi hayatınızı 180 derece değiştirebilir, kaydetmeyi unutmayın!', ctr: '%93 CTR', platform: 'Instagram Reels' },
    { id: 4, category: 'curiosity', type: 'Merak & Gizem', text: 'İşte sosyal medyada herkesin konuştuğu o akımın arkasındaki gerçek...', ctr: '%96 CTR', platform: 'TikTok / Reels' },
    { id: 5, category: 'curiosity', type: 'Merak & Gizem', text: 'Sonunda bulundu! Aylardır aradığınız o çözüm aslında bu kadar basitti...', ctr: '%94 CTR', platform: 'Shorts / Reels' },

    // Şok & Olumsuzluk
    { id: 6, category: 'shock', type: 'Şok & Olumsuzluk', text: 'Sakın bunu yapmayın! Eğer yapıyorsanız paranızı çöpe atıyorsunuz demektir.', ctr: '%98 CTR', platform: 'TikTok / Reels' },
    { id: 7, category: 'shock', type: 'Şok & Olumsuzluk', text: 'Bu hatayı yapanların %90\'ı pişman oluyor, hemen kontrol edin!', ctr: '%96 CTR', platform: 'Instagram Reels' },
    { id: 8, category: 'shock', type: 'Şok & Olumsuzluk', text: 'Bunu öğrendiğim gün tüm rutinimi değiştirdim...', ctr: '%94 CTR', platform: 'TikTok / Shorts' },
    { id: 9, category: 'shock', type: 'Şok & Olumsuzluk', text: 'Gece 12\'den önce bu videoyu izlediğinize çok sevineceksiniz!', ctr: '%92 CTR', platform: 'TikTok' },
    { id: 10, category: 'shock', type: 'Şok & Olumsuzluk', text: 'Uzmanların asla açıklamak istemediği o acı gerçek...', ctr: '%95 CTR', platform: 'Reels / Shorts' },

    // Soru & Meydan Okuma
    { id: 11, category: 'question', type: 'Soru & Meydan Okuma', text: 'Siz de aynı sorunu yaşıyor musunuz? Yorumlarda cevabınızı bekliyorum!', ctr: '%92 CTR', platform: 'Instagram Reels' },
    { id: 12, category: 'question', type: 'Soru & Meydan Okuma', text: '1 haftada izlenmelerinizi 5 katına çıkarmaya hazır mısınız?', ctr: '%95 CTR', platform: 'TikTok / Reels' },
    { id: 13, category: 'question', type: 'Soru & Meydan Okuma', text: 'Bu 3 kuralı uygulamadan video çekmeye devam edecek misiniz?', ctr: '%91 CTR', platform: 'Shorts' },
    { id: 14, category: 'question', type: 'Soru & Meydan Okuma', text: 'Neden kimse bu yöntemi denemiyor dersiniz?', ctr: '%89 CTR', platform: 'TikTok' },
    { id: 15, category: 'question', type: 'Soru & Meydan Okuma', text: 'Halen eski usul yöntemlerle vakit mi kaybediyorsunuz?', ctr: '%93 CTR', platform: 'Reels / Shorts' },

    // Hikaye & İtiraf
    { id: 16, category: 'story', type: 'Hikaye & İtiraf', text: 'Bu yöntemi denemeden önce sıfır izlenme alıyordum, sonra ne mi oldu?', ctr: '%96 CTR', platform: 'TikTok / Reels' },
    { id: 17, category: 'story', type: 'Hikaye & İtiraf', text: 'İtiraf ediyorum: Dürüst olmak gerekirse ben de ilk başta inanmamıştım...', ctr: '%94 CTR', platform: 'Instagram Reels' },
    { id: 18, category: 'story', type: 'Hikaye & İtiraf', text: '30 günde hayatımı tamamen değiştiren o küçük alışkanlık...', ctr: '%91 CTR', platform: 'Shorts / Reels' },
    { id: 19, category: 'story', type: 'Hikaye & İtiraf', text: 'Geçen yıl yaptığım o büyük hatayı sizinle paylaşıyorum ki siz yapmayın!', ctr: '%95 CTR', platform: 'TikTok' },
    { id: 20, category: 'story', type: 'Hikaye & İtiraf', text: 'Bunu denediğim ilk gün aldığım sonuca ben bile inanamadım!', ctr: '%93 CTR', platform: 'TikTok / Reels' },

    // Eğitici & Rehber
    { id: 21, category: 'educational', type: 'Eğitici & Rehber', text: '3 adımda profesyonel seviyede içerik üretme rehberi!', ctr: '%94 CTR', platform: 'Instagram Reels' },
    { id: 22, category: 'educational', type: 'Eğitici & Rehber', text: 'İşte herkesin aradığı ama bulamadığı en pratik çözüm taktiği...', ctr: '%92 CTR', platform: 'TikTok / Shorts' },
    { id: 23, category: 'educational', type: 'Eğitici & Rehber', text: 'Saniyeler içinde harikalar yaratabileceğiniz ücretsiz 3 araç!', ctr: '%97 CTR', platform: 'Reels / Shorts' },
    { id: 24, category: 'educational', type: 'Eğitici & Rehber', text: 'Bu kestirme yolu öğrendikten sonra saatlerce uğraşmayacaksınız.', ctr: '%95 CTR', platform: 'TikTok' },
    { id: 25, category: 'educational', type: 'Eğitici & Rehber', text: 'Yeni başlayanlar için hayat kurtaran 5 temel altın kural!', ctr: '%91 CTR', platform: 'Instagram Reels' },

    // Ürün & E-Ticaret
    { id: 26, category: 'ecommerce', type: 'Ürün & E-Ticaret', text: 'Paranızı hak eden ve son kuruşuna kadar değecek o ürün!', ctr: '%96 CTR', platform: 'TikTok / Reels' },
    { id: 27, category: 'ecommerce', type: 'Ürün & E-Ticaret', text: 'Neden herkes bu ürünü sipariş ediyor? Birlikte kutusunu açalım!', ctr: '%94 CTR', platform: 'TikTok / Shorts' },
    { id: 28, category: 'ecommerce', type: 'Ürün & E-Ticaret', text: 'Stokları tükenmeden bilmeniz gereken o harika indirim fırsatı...', ctr: '%95 CTR', platform: 'Instagram Reels' },
    { id: 29, category: 'ecommerce', type: 'Ürün & E-Ticaret', text: 'Pahalı muadillerine taş çıkartan bütçe dostu efsane alternatif!', ctr: '%97 CTR', platform: 'TikTok / Reels' },
    { id: 30, category: 'ecommerce', type: 'Ürün & E-Ticaret', text: 'Bu ürünü satın almadan önce mutlaka bu 1 dakikalık videoyu izleyin!', ctr: '%93 CTR', platform: 'Shorts' }
  ],
  en: [
    { id: 1, category: 'curiosity', type: 'Curiosity & Mystery', text: 'If you are still doing this, stop scrolling right now!', ctr: '97% CTR', platform: 'TikTok / Reels' },
    { id: 2, category: 'curiosity', type: 'Curiosity & Mystery', text: 'Here is the huge secret nobody is talking about...', ctr: '95% CTR', platform: 'TikTok / Shorts' },
    { id: 6, category: 'shock', type: 'Shock & Negative', text: 'STOP doing this unless you want to waste your money!', ctr: '98% CTR', platform: 'TikTok / Reels' },
    { id: 11, category: 'question', type: 'Question & Challenge', text: 'Are you making this exact same mistake every single day?', ctr: '92% CTR', platform: 'Instagram Reels' },
    { id: 16, category: 'story', type: 'Story & Confession', text: 'I used to get zero views until I discovered this one trick...', ctr: '96% CTR', platform: 'TikTok / Reels' },
    { id: 21, category: 'educational', type: 'Educational & Guide', text: '3 simple steps to master viral content creation in 2026!', ctr: '94% CTR', platform: 'Instagram Reels' },
    { id: 26, category: 'ecommerce', type: 'Product & E-Commerce', text: 'The viral product that is actually 100% worth your money!', ctr: '96% CTR', platform: 'TikTok / Reels' }
  ]
};

export default function ViralHookBank({ lang = 'tr', onSelectHook }) {
  const isTr = lang === 'tr';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'all', label: isTr ? 'Tüm Kancalar' : 'All Hooks', icon: '🔥' },
    { id: 'curiosity', label: isTr ? 'Merak & Gizem' : 'Curiosity', icon: '❓' },
    { id: 'shock', label: isTr ? 'Şok & Olumsuzluk' : 'Shocking', icon: '⚡' },
    { id: 'question', label: isTr ? 'Soru & Meydan Okuma' : 'Question', icon: '🎯' },
    { id: 'story', label: isTr ? 'Hikaye & İtiraf' : 'Story', icon: '📖' },
    { id: 'educational', label: isTr ? 'Eğitici & Rehber' : 'Educational', icon: '💡' },
    { id: 'ecommerce', label: isTr ? 'Ürün & E-Ticaret' : 'E-Commerce', icon: '🛍️' }
  ];

  const dataset = HOOKS_DATASET[lang] || HOOKS_DATASET['en'];

  const filteredHooks = dataset.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Card */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Flame size={24} style={{ color: 'var(--color-accent)' }} />
              <h2 style={{ fontSize: '1.35rem', color: 'var(--color-text)' }}>
                {isTr ? '100+ Viral Kanca Kütüphanesi & Bankası' : '100+ Viral Hook Bank'}
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {isTr ? 'Sosyal medyada en yüksek tıklanma (CTR) ve izlenme alan test edilmiş açılış cümleleri.' : 'High-CTR tested video opening lines for TikTok, Reels, and Shorts.'}
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-secondary)', background: 'rgba(0,210,255,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,210,255,0.2)' }}>
            {filteredHooks.length} {isTr ? 'Kanca Listeleniyor' : 'Hooks Available'}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder={isTr ? 'Kanca metni veya anahtar kelime ara...' : 'Search hook text or keyword...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'var(--bg-secondary)',
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'var(--color-secondary)' : 'var(--color-border)',
                background: activeCategory === cat.id ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--color-secondary)' : 'var(--color-text-muted)'
              }}
            >
              <span style={{ marginRight: '0.35rem' }}>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {filteredHooks.map((item) => (
          <div 
            key={item.id} 
            className="glass-card" 
            style={{ 
              padding: '1.25rem', 
              borderRadius: '14px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                  {item.type}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)' }}>
                  {item.ctr}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: '1.45', marginBottom: '0.5rem' }}>
                "{item.text}"
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Platform: {item.platform}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => handleCopy(item.id, item.text)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                {copiedId === item.id ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                {copiedId === item.id ? (isTr ? 'Kopyalandı' : 'Copied') : (isTr ? 'Kopyala' : 'Copy')}
              </button>

              {onSelectHook && (
                <button
                  onClick={() => onSelectHook(item.text)}
                  className="btn btn-glow-cyan"
                  style={{ flex: 1.3, padding: '0.45rem', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                >
                  <Send size={13} /> {isTr ? 'AI Stüdyo\'ya Aktar' : 'Send to AI Studio'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
