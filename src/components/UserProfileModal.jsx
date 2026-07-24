import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Lock, CreditCard, LogOut, X, Check, Award, Sparkles, FileText, Camera, KeyRound, ShieldCheck, Upload, ExternalLink } from 'lucide-react';
import { exportInvoiceToPdf } from '../lib/pdfExporter.js';

const avatarPresets = [
  { id: 'av1', emoji: '🧑‍💻', label: 'Tech Pro' },
  { id: 'av2', emoji: '🚀', label: 'Creator' },
  { id: 'av3', emoji: '🎭', label: 'Artist' },
  { id: 'av4', emoji: '📸', label: 'Vlogger' },
  { id: 'av5', emoji: '🤖', label: 'AI Pioneer' },
  { id: 'av6', emoji: '💼', label: 'Executive' }
];

export default function UserProfileModal({ user, userPlan, onClose, onSignOut, onUpgradePlan, navigateToWorkspace, lang = 'tr' }) {
  const isTr = lang === 'tr';
  const fileInputRef = useRef(null);

  // Custom Avatar / Photo State
  const [customPhoto, setCustomPhoto] = useState(user?.photoUrl || null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarPresets[0]);

  // Editable Profile States
  const [fullName, setFullName] = useState(user?.name || user?.user_metadata?.full_name || 'Kaan Kaplan');
  const [email, setEmail] = useState(user?.email || 'kaan@trendlab.ai');
  const [phone, setPhone] = useState(user?.phone || '+90 (532) 123 45 67');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem 2rem',
          borderRadius: '20px',
          background: '#0d1222',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 210, 255, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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

        {/* Profile Header & Custom Photo Uploader */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                boxShadow: '0 8px 25px var(--color-primary-glow)',
                border: '3px solid rgba(0, 210, 255, 0.4)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              title={isTr ? 'Profil Fotoğrafı Yükle' : 'Upload Profile Photo'}
            >
              {customPhoto ? (
                <img src={customPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                selectedAvatar.emoji
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '-2px',
                background: 'var(--color-secondary)',
                color: '#050811',
                borderRadius: '50%',
                padding: '6px',
                border: '2px solid #0d1222',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
              title={isTr ? 'Fotoğraf Yükle' : 'Upload Photo'}
            >
              <Camera size={13} />
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.2rem 0' }}>
            {fullName}
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <Mail size={13} style={{ color: 'var(--color-secondary)' }} /> {email}
          </div>
        </div>

        {/* Plan & Status Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(27, 79, 255, 0.15), rgba(0, 210, 255, 0.1))',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={22} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isTr ? 'Aktif Hesap Paketi' : 'Active Account Plan'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
                {userPlan}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onUpgradePlan) onUpgradePlan('Professional Plan');
            }}
            className="btn btn-glow-cyan"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Sparkles size={13} /> {isTr ? 'Yükselt' : 'Upgrade'}
          </button>
        </div>

        {/* Quick Edit Form */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
          {saveSuccess && (
            <div style={{ padding: '0.55rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', textAlign: 'center', color: '#4ade80', fontSize: '0.78rem', fontWeight: '600' }}>
              <Check size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              {isTr ? 'Profil kaydedildi!' : 'Profile saved!'}
            </div>
          )}

          {/* Avatar Presets */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                {isTr ? 'Avatar Veya Kendi Fotoğrafını Yükle' : 'Choose Avatar Or Upload Photo'}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: '600' }}
              >
                <Upload size={12} /> {isTr ? 'Dosya Seç' : 'Upload File'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {avatarPresets.map((av) => (
                <div
                  key={av.id}
                  onClick={() => { setSelectedAvatar(av); setCustomPhoto(null); }}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: '8px',
                    border: !customPhoto && selectedAvatar.id === av.id ? '2px solid var(--color-secondary)' : '1px solid rgba(255,255,255,0.08)',
                    background: !customPhoto && selectedAvatar.id === av.id ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    userSelect: 'none'
                  }}
                >
                  <span>{av.emoji}</span>
                  <span style={{ fontSize: '0.7rem', color: !customPhoto && selectedAvatar.id === av.id ? 'var(--color-secondary)' : 'rgba(255,255,255,0.7)' }}>{av.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: '700', textTransform: 'uppercase' }}>
              {isTr ? 'Ad Soyad' : 'Full Name'}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: '700', textTransform: 'uppercase' }}>
              {isTr ? 'E-Posta Adresi' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: '700', textTransform: 'uppercase' }}>
              {isTr ? 'Telefon Numarası' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-glow-cyan"
            style={{ padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', marginTop: '0.2rem' }}
          >
            {isTr ? 'Profili Güncelle' : 'Save Profile'}
          </button>
        </form>

        {/* Shortcut to Workspace Settings & Invoices */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            ⚙️ {isTr ? 'Güvenlik, Şifre & Fatura Geçmişi' : 'Security, Password & Invoices'}
          </div>

          <button
            onClick={() => {
              onClose();
              if (navigateToWorkspace) navigateToWorkspace('creator');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-secondary)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            {isTr ? 'Ayarlara Git' : 'Go to Settings'} <ExternalLink size={13} />
          </button>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)', background: 'rgba(248, 113, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <LogOut size={14} /> {isTr ? 'Oturumu Kapat' : 'Sign Out'}
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}
          >
            {isTr ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
