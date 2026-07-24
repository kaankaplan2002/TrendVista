import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

export default function LegalNoticeModal({ type, onClose, lang = 'tr' }) {
  const isTr = lang === 'tr';

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: isTr ? 'Gizlilik Politikası' : 'Privacy Policy',
          icon: <Lock size={20} style={{ color: 'var(--color-secondary)' }} />,
          text: isTr ? (
            <>
              <h4>1. Veri Sorumlusu ve Toplanan Veriler</h4>
              <p>TrendVista AI ("Şirket"), kullanıcılarının kişisel verilerinin korunmasına büyük önem vermektedir. Platformumuza kayıt olurken ve hizmetlerimizi kullanırken sağladığınız Ad Soyad, E-posta Adresi, Telefon Numarası, Sosyal Medya Kanal İstatistikleri ve AI Kullanım Geçmişi verileri güvenli sunucularımızda saklanmaktadır.</p>
              
              <h4>2. Verilerin İşlenme Amaçları</h4>
              <p>Kişisel verileriniz; yapay zeka trend analizlerinin kişiselleştirilmesi, size özel viral içerik kancaları üretilmesi, hesap güvenliğinin sağlanması, faturalandırma işlemlerinin yürütülmesi ve teknik destek taleplerinin karşılanması amacıyla işlenmektedir.</p>

              <h4>3. Veri Güvenliği ve Şifreleme</h4>
              <p>Tüm kullanıcı verileri endüstri standardı AES-256 ve SSL/TLS şifreleme protokolleriyle korunmaktadır. Sosyal medya hesap bağlantılarınız resmi OAuth 2.0 API protokolleri üzerinden gerçekleşir; platformumuz asla sosyal medya şifrelerinizi talep etmez veya saklamaz.</p>
            </>
          ) : (
            <>
              <h4>1. Data Controller & Collected Information</h4>
              <p>TrendVista AI values the privacy and security of your personal data. The information collected during account creation and usage (Name, Email, Phone Number, Social Channel Analytics, and AI Prompt Logs) is stored securely on encrypted database clusters.</p>

              <h4>2. Purpose of Data Processing</h4>
              <p>Your data is processed to personalize AI trend radar recommendations, generate tailored viral content hooks, maintain account authentication, handle subscription billing, and deliver technical support.</p>

              <h4>3. Security & OAuth Authentication</h4>
              <p>All transmitted data is encrypted using AES-256 and SSL/TLS. Social media channel connections use official OAuth 2.0 authorization; TrendVista never requests or stores your social account passwords.</p>
            </>
          )
        };

      case 'kvkk':
        return {
          title: isTr ? 'KVKK Aydınlatma Metni' : 'KVKK Compliance Notice',
          icon: <ShieldCheck size={20} style={{ color: '#4ade80' }} />,
          text: isTr ? (
            <>
              <h4>1. 6698 Sayılı KVKK Uyarınca Aydınlatma</h4>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, TrendVista AI tarafından Veri Sorumlusu sıfatıyla kişisel verileriniz kanuna ve dürüstlük kurallarına uygun olarak işlenmektedir.</p>

              <h4>2. İşlenen Kişisel Veri Kategorileri</h4>
              <p>• <strong>Kimlik Verisi:</strong> Ad Soyad<br/>• <strong>İletişim Verisi:</strong> E-posta, Telefon Numarası<br/>• <strong>Müşteri İşlem Verisi:</strong> Fatura bilgileri, Abonelik paketi, iyzico ödeme referansı<br/>• <strong>İşlem Güvenliği Verisi:</strong> IP adresi, Giriş logları, Cihaz bilgisi</p>

              <h4>3. Kullanıcı Hakları (Madde 11)</h4>
              <p>Veri sahibi olarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, verilerin düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Başvurularınızı <strong>kvkk@trendlab.ai</strong> adresine iletebilirsiniz.</p>
            </>
          ) : (
            <>
              <h4>1. Compliance & Data Subject Rights</h4>
              <p>Under applicable Personal Data Protection Laws (KVKK & GDPR), TrendVista AI acts as Data Controller, ensuring lawful and transparent processing of your personal details.</p>

              <h4>2. Processed Data Categories</h4>
              <p>• <strong>Identity Data:</strong> Full Name<br/>• <strong>Contact Data:</strong> Email, Phone Number<br/>• <strong>Transaction Data:</strong> Invoices, Subscription Tier, iyzico reference<br/>• <strong>Security Data:</strong> IP Address, Session Logs, Device Identifiers</p>

              <h4>3. Exercising Rights</h4>
              <p>You may request data access, correction, export, or deletion at any time by emailing <strong>kvkk@trendlab.ai</strong>.</p>
            </>
          )
        };

      case 'terms':
      default:
        return {
          title: isTr ? 'Kullanım Şartları ve Hizmet Sözleşmesi' : 'Terms of Service & Usage Agreement',
          icon: <FileText size={20} style={{ color: '#60a5fa' }} />,
          text: isTr ? (
            <>
              <h4>1. Hizmet Koşullarının Kabulü</h4>
              <p>TrendVista AI platformuna erişerek ve hizmetlerimizi kullanarak bu Kullanım Şartlarını kabul etmiş sayılırsınız. Hizmetlerimiz içerik üreticileri ve markalar için yapay zeka destekli trend analitiği sağlar.</p>

              <h4>2. Fikri Mülkiyet ve İçerik Hakları</h4>
              <p>TrendVista AI tarafından üretilen senaryolar, kancalar ve içerik taslaklarının kullanım hakları ilgili abonelik sahibine aittir. Platform yazılımı, amblemi ve algoritma kodları TrendVista AI'a aittir.</p>

              <h4>3. İptal ve İade Şartları</h4>
              <p>Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz. İlk satın alımlarda 14 gün içinde koşulsuz iade hakkınız mevcuttur.</p>
            </>
          ) : (
            <>
              <h4>1. Acceptance of Terms</h4>
              <p>By accessing or using TrendVista AI, you agree to comply with these Terms of Service. TrendVista provides AI-driven social media analytics and content tools.</p>

              <h4>2. Intellectual Property & AI Ownership</h4>
              <p>Scripts, hooks, and content generated by TrendVista AI belong to the active subscriber for commercial or personal publishing. Platform software and algorithms remain sole property of TrendVista AI.</p>

              <h4>3. Cancellation & Refunds</h4>
              <p>Subscriptions can be canceled anytime via account settings. A 14-day money-back guarantee applies to initial plan purchases.</p>
            </>
          )
        };
    }
  };

  const content = getContent();

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '20px',
          background: '#0d1222',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          {content.icon}
          <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: '800', margin: 0 }}>
            {content.title}
          </h3>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {content.text}
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-glow-cyan" style={{ padding: '0.5rem 1.5rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '8px' }}>
            {isTr ? 'Anladım & Kapat' : 'Got it & Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
