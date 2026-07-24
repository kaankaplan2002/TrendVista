import React, { useState } from 'react';
import { 
  Send, 
  Check, 
  CheckCheck,
  FileText, 
  CheckCircle, 
  MessageSquare,
  BadgeCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportBrandBriefToPdf } from '../lib/pdfExporter.js';

export default function DealInbox({ lang = 'tr', role = 'creator' }) {
  const isTr = lang === 'tr';

  // Mock initial conversations with read/delivery status
  const [conversations, setConversations] = useState([
    {
      id: 'c1',
      name: 'Trendyol Türkiye',
      avatar: '🛍️',
      verified: true,
      category: isTr ? 'E-Ticaret & Moda' : 'E-Commerce & Fashion',
      lastMessage: isTr ? 'Lansman kampanyamız için teklifimizi ilettik.' : 'We sent our offer for the launch campaign.',
      time: '14:20',
      unread: 1,
      status: 'pending',
      deal: {
        title: isTr ? 'Matcha Cilt Serumu Viral Tanıtımı' : 'Matcha Skin Serum Viral Promo',
        budget: '45.000 ₺',
        deliverables: isTr ? '1x TikTok Video + 2x IG Reels' : '1x TikTok Video + 2x IG Reels',
        deadline: '15 Ağustos 2026',
        usageRights: isTr ? '6 Ay Dijital Kullanım' : '6 Months Digital Usage'
      },
      messages: [
        { id: 1, sender: 'brand', senderName: 'Trendyol Türkiye', text: isTr ? 'Merhaba Kaan Bey! TrendVista üzerindeki profilinizi inceledik. Yeni Matcha Cilt Serumu lansmanımız için sizinle çalışmak isteriz.' : 'Hello Kaan! We reviewed your profile on TrendVista and would love to work with you on our new Matcha Serum launch.', time: '14:15', status: 'read' },
        { id: 2, sender: 'brand', senderName: 'Trendyol Türkiye', isDealCard: true, time: '14:20', status: 'read' }
      ]
    },
    {
      id: 'c2',
      name: 'Samsung Türkiye',
      avatar: '📱',
      verified: true,
      category: isTr ? 'Teknoloji & Elektronik' : 'Tech & Electronics',
      lastMessage: isTr ? 'Sözleşme onaylandı, çekime başlayabilirsiniz.' : 'Contract approved, you can start filming.',
      time: 'Dün',
      unread: 0,
      status: 'accepted',
      deal: {
        title: isTr ? 'Galaxy S26 Ultra Yapay Zeka Özellikleri' : 'Galaxy S26 Ultra AI Features',
        budget: '85.000 ₺',
        deliverables: isTr ? '1x YouTube Dedicated Video + 1x Shorts' : '1x YouTube Video + 1x Shorts',
        deadline: '20 Ağustos 2026',
        usageRights: isTr ? 'Sınırsız Kullanım' : 'Unlimited Rights'
      },
      messages: [
        { id: 1, sender: 'brand', senderName: 'Samsung Türkiye', text: isTr ? 'S26 Ultra lansman çekimi için bütçe onaylanmıştır.' : 'Budget approved for S26 Ultra campaign.', time: 'Dün 16:40', status: 'read' },
        { id: 2, sender: 'creator', senderName: isTr ? 'Siz (Kaan Kaplan)' : 'You (Kaan Kaplan)', text: isTr ? 'Harika! Taslak videoyu Pazartesi gününe kadar ileteceğim.' : 'Awesome! Will share the draft by Monday.', time: 'Dün 17:10', status: 'read' }
      ]
    },
    {
      id: 'c3',
      name: 'Sephora Kozmetik',
      avatar: '💄',
      verified: true,
      category: isTr ? 'Güzellik & Bakım' : 'Beauty & Care',
      lastMessage: isTr ? 'Bütçe revizesini değerlendiriyoruz.' : 'Evaluating the budget revision.',
      time: '2 Gün Önce',
      unread: 0,
      status: 'pending',
      deal: {
        title: isTr ? 'Yaz Güzellik Festivali Kampanyası' : 'Summer Beauty Fest Campaign',
        budget: '30.000 ₺',
        deliverables: isTr ? '2x Instagram Reels' : '2x Instagram Reels',
        deadline: '10 Ağustos 2026',
        usageRights: isTr ? '3 Ay Dijital' : '3 Months Digital'
      },
      messages: [
        { id: 1, sender: 'brand', senderName: 'Sephora Kozmetik', text: isTr ? 'Yaz festivali reels tanıtımları için detayları ilettik.' : 'Sent details for summer fest reels.', time: '2 Gün Önce', status: 'read' }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const myName = role === 'creator' ? (isTr ? 'Siz (Kaan Kaplan)' : 'You (Kaan Kaplan)') : (isTr ? 'Siz (Marka Temsilcisi)' : 'You (Brand Manager)');

    const newMessage = {
      id: Date.now(),
      sender: role === 'creator' ? 'creator' : 'brand',
      senderName: myName,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read' // Automatically marked as delivered & read in real-time
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: textToSend,
          time: newMessage.time,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    setInputText('');

    // Simulate counterpart typing back after 2.5 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg = {
          id: Date.now() + 1,
          sender: role === 'creator' ? 'brand' : 'creator',
          senderName: activeConv.name,
          text: isTr ? 'Mesajınız tarafımıza ulaştı, ekibimiz kontrol ediyor! 👍' : 'Your message has been received, our team is reviewing it! 👍',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        setConversations(prev => prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              time: replyMsg.time,
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        }));
      }, 2000);
    }, 1000);
  };

  const handleUpdateDealStatus = (convId, newStatus) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return { ...c, status: newStatus };
      }
      return c;
    }));

    if (newStatus === 'accepted') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Quick Template Auto Responses
  const templates = isTr ? [
    'Teklifi kabul ediyorum, sözleşmeyi iletebilirsiniz.',
    'Bütçeyi 50.000 ₺ olarak revize edebilir miyiz?',
    'Kullanım hakları süresi hakkında bilgi verebilir misiniz?',
    'Taslak içeriği 3 gün içinde iletirim.'
  ] : [
    'I accept the deal, please share the contract.',
    'Can we revise the budget to 50,000 ₺?',
    'Could you clarify the usage rights duration?',
    'I can share the draft content in 3 days.'
  ];

  return (
    <div className="glass-card" style={{ 
      display: 'grid', 
      gridTemplateColumns: '260px 1fr', 
      height: 'calc(100vh - 170px)', 
      minHeight: '480px', 
      maxHeight: '560px', 
      width: '100%', 
      maxWidth: '100%', 
      overflow: 'hidden', 
      padding: 0, 
      border: '1px solid var(--color-border)', 
      borderRadius: '14px' 
    }}>
      
      {/* 1. Left Conversations Sidebar */}
      <div style={{ borderRight: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.5)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
            <MessageSquare size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
            {isTr ? 'Gelen Kutusu' : 'Deal Inbox'}
          </h3>
          <span className="badge badge-cyan" style={{ fontSize: '0.62rem', flexShrink: 0 }}>
            {conversations.length} {isTr ? 'Sohbet' : 'Chats'}
          </span>
        </div>

        {/* Conversations List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setActiveConvId(c.id);
                setConversations(prev => prev.map(item => item.id === c.id ? { ...item, unread: 0 } : item));
              }}
              style={{
                padding: '0.75rem 0.85rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                background: activeConvId === c.id ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                borderLeft: activeConvId === c.id ? '3.5px solid var(--color-secondary)' : '3.5px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.2rem', gap: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.avatar}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </span>
                  {c.verified && <BadgeCheck size={13} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{c.time}</span>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0.35rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.lastMessage}
              </p>

              <div className="flex-between" style={{ alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.62rem', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '4px', 
                  background: c.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : c.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: c.status === 'accepted' ? '#34d399' : c.status === 'rejected' ? '#ef4444' : '#f59e0b',
                  fontWeight: '600'
                }}>
                  {c.status === 'accepted' ? (isTr ? 'İmzalandı 🟢' : 'Signed 🟢') : c.status === 'rejected' ? (isTr ? 'Reddedildi 🔴' : 'Declined 🔴') : (isTr ? 'Teklif Aşaması 🟡' : 'Offer Pending 🟡')}
                </span>

                {c.unread > 0 && (
                  <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '0.62rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Thread Window */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'rgba(5, 8, 17, 0.2)' }}>
        
        {/* Chat Thread Header */}
        <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5, 8, 17, 0.7)', gap: '0.75rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              {activeConv.avatar}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                {activeConv.name}
                {activeConv.verified && <BadgeCheck size={15} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />}
              </h3>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeConv.category} • <span style={{ color: '#34d399', fontWeight: 'bold' }}>● {isTr ? 'Çevrimiçi' : 'Online'}</span>
              </span>
            </div>
          </div>

          <button 
            onClick={() => exportBrandBriefToPdf({ title: activeConv.deal.title, brandName: activeConv.name, budget: activeConv.deal.budget }, lang)} 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
          >
            <FileText size={13} /> {isTr ? 'Sözleşme PDF' : 'Contract PDF'}
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {activeConv.messages.map((m) => {
            const isMe = (role === 'creator' && m.sender === 'creator') || (role === 'brand' && m.sender === 'brand');
            
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                
                {/* Sender Name Identification Label */}
                <span style={{ fontSize: '0.68rem', color: isMe ? 'var(--color-text-muted)' : 'var(--color-secondary)', fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {isMe ? (isTr ? '👤 Siz' : '👤 You') : `${activeConv.avatar} ${activeConv.name}`}
                </span>

                {/* Text Message Bubble */}
                {m.text && (
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.65rem 0.95rem',
                    borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: isMe ? 'linear-gradient(135deg, var(--color-primary-glow), rgba(0, 210, 255, 0.25))' : 'rgba(255,255,255,0.07)',
                    border: isMe ? '1px solid rgba(0, 210, 255, 0.35)' : '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.83rem',
                    lineHeight: '1.4',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                  }}>
                    {m.text}
                    
                    {/* Time & Delivery Status (Ulaşıldı & Görüldü Checks) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>
                        {m.time}
                      </span>
                      {isMe && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', fontSize: '0.62rem', color: m.status === 'read' ? '#00d2ff' : '#888', fontWeight: 'bold' }} title={isTr ? 'Görüldü (Read)' : 'Read'}>
                          <CheckCheck size={13} style={{ color: m.status === 'read' ? '#00d2ff' : '#888' }} />
                          {isTr ? 'Görüldü' : 'Read'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Interactive Smart Deal Card */}
                {m.isDealCard && (
                  <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '1rem', border: '1.5px solid rgba(0, 210, 255, 0.4)', background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(27, 79, 255, 0.06))', margin: '0.2rem 0' }}>
                    <div className="flex-between" style={{ marginBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          💎 {isTr ? 'Resmi Sponsorluk Teklifi' : 'Official Partnership Proposal'}
                        </span>
                        <h4 style={{ fontSize: '0.98rem', color: 'var(--color-text)', fontWeight: '800', marginTop: '0.1rem' }}>
                          {activeConv.deal.title}
                        </h4>
                      </div>
                      <span style={{ fontSize: '1.3rem', color: '#34d399', fontWeight: '900', flexShrink: 0, marginLeft: '0.5rem' }}>
                        {activeConv.deal.budget}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem', fontSize: '0.75rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.68rem' }}>{isTr ? 'İçerik Teslimatları' : 'Deliverables'}</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>{activeConv.deal.deliverables}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.68rem' }}>{isTr ? 'Son Teslim Tarihi' : 'Deadline'}</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>{activeConv.deal.deadline}</span>
                      </div>
                    </div>

                    {/* Action Buttons inside Deal Card */}
                    {activeConv.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleUpdateDealStatus(activeConv.id, 'accepted')}
                          className="btn btn-glow-cyan" 
                          style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.78rem', background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}
                        >
                          <Check size={14} /> {isTr ? 'Teklifi Kabul Et' : 'Accept Deal'}
                        </button>
                        <button 
                          onClick={() => handleSendMessage(isTr ? 'Bütçeyi 55.000 ₺ olarak revize edebilir misiniz?' : 'Can we revise the budget to 55,000 ₺?')}
                          className="btn btn-secondary" 
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', whiteSpace: 'nowrap' }}
                        >
                          <Zap size={13} /> {isTr ? 'Karşı Bütçe Öner' : 'Counter Offer'}
                        </button>
                      </div>
                    ) : activeConv.status === 'accepted' ? (
                      <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--color-success)', padding: '0.55rem 0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle size={15} />
                        {isTr ? 'Teklif kabul edildi! Akıllı sözleşme imzalandı.' : 'Deal accepted! Smart contract signed.'}
                      </div>
                    ) : null}

                  </div>
                )}

              </div>
            );
          })}

          {/* Dynamic Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(0, 210, 255, 0.08)', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: '600' }}>
                💬 {activeConv.name} {isTr ? 'yazıyor...' : 'is typing...'}
              </span>
              <span className="spin" style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>⚡</span>
            </div>
          )}
        </div>

        {/* Quick Template Chips */}
        <div style={{ padding: '0.4rem 1rem', background: 'rgba(5, 8, 17, 0.5)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.35rem', overflowX: 'auto', flexShrink: 0 }}>
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(tpl)}
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', whiteSpace: 'nowrap', borderRadius: '12px', flexShrink: 0 }}
            >
              💬 {tpl}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isTr ? 'Mesajınızı yazın veya şablon seçin...' : 'Type a message or pick template...'}
            style={{ flex: 1, padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.95)', color: 'var(--color-text)', outline: 'none', fontSize: '0.85rem' }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="btn btn-glow-cyan"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
          >
            <Send size={14} />
            {isTr ? 'Gönder' : 'Send'}
          </button>
        </div>

      </div>

    </div>
  );
}
