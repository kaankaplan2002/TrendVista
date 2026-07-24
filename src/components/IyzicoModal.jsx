import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { IYZICO_PLAN_PRICES, IYZICO_TEST_CARDS } from '../lib/iyzico';

export default function IyzicoModal({ planName, onClose, onSuccess, userEmail: _userEmail }) {
  const planInfo = IYZICO_PLAN_PRICES[planName] || { price: 1499, formatted: '₺1.499', period: '/ay' };

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [installments, setInstallments] = useState('1');
  const [use3DSecure, setUse3DSecure] = useState(true);

  const [step, setStep] = useState('form'); // 'form', '3d_secure', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [smsCode, setSmsCode] = useState('');

  // Auto-fill an official iyzico test card
  const fillTestCard = (testCard) => {
    setCardHolder('Ahmet Yılmaz');
    setCardNumber(testCard.number);
    setExpiry(testCard.expiry);
    setCvc(testCard.cvc);
    setErrorMessage('');
  };

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      setErrorMessage('Lütfen 16 haneli geçerli bir kart numarası girin.');
      return;
    }
    if (!cardHolder.trim()) {
      setErrorMessage('Lütfen kart üzerindeki adı ve soyadı girin.');
      return;
    }

    if (cleanCard.endsWith('2')) {
      setErrorMessage('Ödeme başarısız: Kart bakiyesi yetersiz (İyzico Test Hatası).');
      return;
    }

    if (use3DSecure) {
      setStep('3d_secure');
    } else {
      processPayment();
    }
  };

  const processPayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(planName);
      }, 1200);
    }, 1500);
  };

  const handleVerify3DSecure = (e) => {
    e.preventDefault();
    processPayment();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '1rem',
    }}>
      <div style={{
        background: '#0d1117',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        position: 'relative',
        color: '#fff',
      }}>

        {/* Top Header: iyzico branding */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#1d4ed8',
              color: '#fff',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '0.9rem',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}>
              iyzico <span style={{ opacity: 0.7, fontSize: '0.65rem', textTransform: 'uppercase' }}>Sandbox</span>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Güvenli Ödeme</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>256-bit SSL Korumalı</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Plan Summary Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Seçilen Paket</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#60a5fa' }}>{planName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              {planInfo.formatted} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'rgba(255, 255, 255, 0.5)' }}>{planInfo.period}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>

          {/* STEP 1: Payment Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {errorMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              {/* Quick Fill Test Cards dropdown */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.4rem', fontWeight: '600' }}>
                  🧪 Hızlı Test İçin İyzico Test Kartları:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {IYZICO_TEST_CARDS.map((tc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => fillTestCard(tc)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.7rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        color: '#93c5fd',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <CreditCard size={12} /> {tc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Holder */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.35rem' }}>
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.35rem' }}>
                  Kart Numarası
                </label>
                <input
                  type="text"
                  placeholder="5528 7900 0000 0001"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* Expiry & CVC Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.35rem' }}>
                    Son Kullanma (AY/YIL)
                  </label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.35rem' }}>
                    Güvenlik Kodu (CVC)
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Installment Options */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.35rem' }}>
                  Taksit Seçeneği
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#161b22',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                >
                  <option value="1">Tek Çekim — {planInfo.formatted}</option>
                  <option value="3">3 Taksit — {(planInfo.price / 3).toFixed(2)} TL x 3</option>
                  <option value="6">6 Taksit — {(planInfo.price / 6).toFixed(2)} TL x 6</option>
                </select>
              </div>

              {/* 3D Secure Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  checked={use3DSecure}
                  onChange={(e) => setUse3DSecure(e.target.checked)}
                />
                <ShieldCheck size={16} color="#3b82f6" /> 3D Secure Güvenlik Doğrulaması İle Öde (Önerilen)
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Lock size={16} /> iyzico İle {planInfo.formatted} Öde
              </button>
            </form>
          )}

          {/* STEP 2: 3D Secure SMS Verification Simulation */}
          {step === '3d_secure' && (
            <form onSubmit={handleVerify3DSecure} style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                marginBottom: '1rem',
              }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3D Secure Onayı</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Telefonunuza gönderilen SMS doğrulama kodunu girin. <br />
                <span style={{ color: '#93c5fd' }}>(İyzico Test Kodu: <strong>123456</strong>)</span>
              </p>

              <input
                type="text"
                placeholder="123456"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                style={{
                  width: '160px',
                  padding: '0.75rem',
                  fontSize: '1.4rem',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  outline: 'none',
                  marginBottom: '1.5rem',
                }}
                maxLength={6}
                required
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={18} /> Ödemeyi Onayla
              </button>
            </form>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(59, 130, 246, 0.3)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem auto',
              }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>İyzico Ödemeniz İşleniyor...</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Lütfen pencereyi kapatmayın, bankanızla güvenli iletişim kuruluyor.
              </p>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                marginBottom: '1rem',
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#22c55e', marginBottom: '0.5rem' }}>Ödeme Başarılı!</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                Paketiniz <strong>{planName}</strong> olarak güncellendi.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                Supabase Veritabanı profili anında güncellendi.
              </p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.4)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
        }}>
          <span>🔒 İyzico Sandbox Güvenlikli Ödeme Altyapısı</span>
          <span>TrendVista SaaS</span>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
