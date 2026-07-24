import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clean Turkish character helper for filenames
 */
function replaceTrChars(str = '') {
  return String(str)
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

/**
 * Export Creator Studio Script to a pixel-perfect, theme-aware A4 PDF with ZERO white space at bottom.
 */
export const exportScriptToPdf = async ({ studioOutput, selectedTone, lang = 'tr' }) => {
  if (!studioOutput) return;

  const isTr = lang === 'tr';
  const isLightMode = document.body.classList.contains('light-theme');

  // Theme colors
  const bgMain = isLightMode ? '#f8fafc' : '#0d1117';
  const textPrimary = isLightMode ? '#0f172a' : '#ffffff';
  const textSecondary = isLightMode ? '#475569' : '#94a3b8';
  const cardBg = isLightMode ? '#ffffff' : 'rgba(30, 41, 59, 0.6)';
  const cardBorder = isLightMode ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)';
  const hookBg = isLightMode ? '#fef2f2' : 'linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(244, 63, 94, 0.05))';
  const hookBorder = isLightMode ? '#fca5a5' : 'rgba(225, 29, 72, 0.4)';
  const hookText = isLightMode ? '#991b1b' : '#fb7185';
  const hookValText = isLightMode ? '#1e293b' : '#ffffff';
  const sceneBg = isLightMode ? '#f1f5f9' : 'rgba(255, 255, 255, 0.04)';
  const sceneBorder = isLightMode ? '#cbd5e1' : 'rgba(255, 255, 255, 0.08)';
  const voiceBg = isLightMode ? '#ffffff' : 'rgba(0,0,0,0.3)';

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.minHeight = '1131px'; // Exact A4 ratio (800 * 297 / 210 = 1131)
  container.style.padding = '40px';
  container.style.background = bgMain;
  container.style.color = textPrimary;
  container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';

  const scriptRows = Array.isArray(studioOutput.script)
    ? studioOutput.script.map((s, idx) => `
        <div style="background: ${sceneBg}; border: 1px solid ${sceneBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
          <div style="color: #2563eb; font-weight: 700; font-size: 13px; margin-bottom: 4px;">
            ${s.scene || `Sahne ${idx + 1}`}
          </div>
          <div style="color: ${textSecondary}; font-size: 11px; margin-bottom: 6px;">
            <strong>📹 Görsel & Çekim Notu:</strong> ${s.description || ''}
          </div>
          <div style="color: ${textPrimary}; font-size: 12px; background: ${voiceBg}; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #2563eb;">
            <strong>💬 Seslendirme (Voiceover):</strong> "${s.voice || ''}"
          </div>
        </div>
      `).join('')
    : '';

  const hashtagsHtml = Array.isArray(studioOutput.seoHashtags)
    ? studioOutput.seoHashtags.map(h => `<span style="background: rgba(37,99,235,0.1); color: #2563eb; border: 1px solid rgba(37,99,235,0.2); padding: 4px 8px; border-radius: 6px; font-size: 11px; margin-right: 6px; margin-bottom: 4px; display: inline-block;">${h.tag} (${h.volume})</span>`).join('')
    : '';

  container.innerHTML = `
    <div>
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 16px;">
            TrendVista <span style="font-size: 10px; opacity: 0.8; text-transform: uppercase;">AI Script</span>
          </div>
          <span style="color: ${textSecondary}; font-size: 12px; font-weight: 600;">${isTr ? 'İçerik Senaryo Raporu' : 'Content Script Report'}</span>
        </div>
        <div style="text-align: right; color: ${textSecondary}; font-size: 11px;">
          <div>Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
          <div>Platform: TikTok / Reels / Shorts</div>
        </div>
      </div>

      <!-- Trend Overview -->
      <div style="background: ${cardBg}; border-radius: 12px; padding: 16px; border: 1px solid ${cardBorder}; margin-bottom: 16px;">
        <div style="font-size: 18px; font-weight: 800; color: ${textPrimary}; margin-bottom: 6px;">
          ${studioOutput.trend}
        </div>
        <div style="display: flex; gap: 20px; font-size: 12px; color: ${textSecondary};">
          <div><strong>Ton:</strong> ${selectedTone || 'Dinamik / Enerjik'}</div>
          <div><strong>Tahmini Viral Skor:</strong> <span style="color: #16a34a; font-weight: 700;">${studioOutput.estimatedViralScore || 94}/100</span></div>
        </div>
      </div>

      <!-- Gold Hook Box -->
      <div style="background: ${hookBg}; border: 1px solid ${hookBorder}; border-radius: 12px; padding: 14px; margin-bottom: 18px;">
        <div style="color: ${hookText}; font-weight: 800; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">
          🔥 ${isTr ? 'GOLD HOOK (VURUCU AÇILIŞ - İLK 3 SANİYE)' : 'GOLD HOOK (FIRST 3 SECONDS)'}
        </div>
        <div style="font-size: 14px; font-weight: 600; color: ${hookValText}; line-height: 1.4;">
          "${studioOutput.hook || ''}"
        </div>
      </div>

      <!-- Scene Flow -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 13px; font-weight: 700; color: ${textPrimary}; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
          🎬 ${isTr ? 'SAHNE AKIŞI VE SESLENDİRME METNİ' : 'SCENE FLOW & SCRIPT OUTLINE'}
        </h3>
        ${scriptRows}
      </div>

      <!-- Metadata & SEO -->
      <div style="background: ${cardBg}; border-radius: 12px; padding: 14px; border: 1px solid ${cardBorder}; margin-bottom: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: ${textPrimary}; margin-bottom: 6px;">
          📝 ${isTr ? 'Açıklama & Paylaşım Metni:' : 'Post Description:'}
        </div>
        <div style="font-size: 12px; color: ${textSecondary}; margin-bottom: 10px; line-height: 1.4;">
          ${studioOutput.description || ''}
        </div>
        <div style="font-size: 12px; font-weight: 700; color: ${textPrimary}; margin-bottom: 6px;">
          🏷️ ${isTr ? 'Önerilen Viral Etiketler:' : 'Recommended Hashtags:'}
        </div>
        <div>
          ${hashtagsHtml || studioOutput.tags}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid ${cardBorder}; padding-top: 12px; text-align: center; font-size: 10px; color: ${textSecondary};">
      TrendVista AI İşletim Sistemi Tarafından Üretilmiştir — www.trendlab.ai
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: bgMain,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Fill page background color first to eliminate white bottom bar
    const rgb = isLightMode ? [248, 246, 250] : [13, 17, 23];
    pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${replaceTrChars(studioOutput.trend)}_senaryo_raporu.pdf`);
  } catch (error) {
    if (document.body.contains(container)) document.body.removeChild(container);
    console.error('[TrendVista] PDF render error:', error);
  }
};

/**
 * Export Brand Brief to PDF with theme-awareness and zero bottom white space.
 */
export const exportBrandBriefToPdf = async ({ briefOutput, campaignInput, lang = 'tr' }) => {
  if (!briefOutput) return;

  const isTr = lang === 'tr';
  const isLightMode = document.body.classList.contains('light-theme');

  const bgMain = isLightMode ? '#f8fafc' : '#06101e';
  const textPrimary = isLightMode ? '#0f172a' : '#ffffff';
  const textSecondary = isLightMode ? '#475569' : '#94a3b8';
  const cardBg = isLightMode ? '#ffffff' : 'rgba(16, 185, 129, 0.08)';
  const cardBorder = isLightMode ? '#e2e8f0' : 'rgba(16, 185, 129, 0.3)';

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.minHeight = '1131px';
  container.style.padding = '40px';
  container.style.background = bgMain;
  container.style.color = textPrimary;
  container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';

  const doItems = Array.isArray(briefOutput.doList)
    ? briefOutput.doList.map(item => `<li style="margin-bottom: 4px; color: ${isLightMode ? '#065f46' : '#a7f3d0'};">${item}</li>`).join('')
    : '';

  const dontItems = Array.isArray(briefOutput.dontList)
    ? briefOutput.dontList.map(item => `<li style="margin-bottom: 4px; color: ${isLightMode ? '#9f1239' : '#fecdd3'};">${item}</li>`).join('')
    : '';

  container.innerHTML = `
    <div>
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 16px;">
            TrendVista <span style="font-size: 10px; opacity: 0.9; text-transform: uppercase;">Brand Brief</span>
          </div>
          <span style="color: ${textSecondary}; font-size: 12px; font-weight: 600;">${isTr ? 'Influencer Reklam Brief Raporu' : 'Campaign Brief Report'}</span>
        </div>
        <div style="text-align: right; color: ${textSecondary}; font-size: 11px;">
          <div>Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
          <div>Platform: ${campaignInput?.platform?.toUpperCase() || 'TIKTOK'}</div>
        </div>
      </div>

      <!-- Brief Header Card -->
      <div style="background: ${cardBg}; border-radius: 12px; padding: 18px; border: 1px solid ${cardBorder}; margin-bottom: 20px;">
        <div style="font-size: 20px; font-weight: 800; color: ${isLightMode ? '#047857' : '#34d399'}; margin-bottom: 6px;">
          ${briefOutput.campaignName || 'Marka Kampanya Briefi'}
        </div>
        <div style="font-size: 13px; color: ${textPrimary}; line-height: 1.4; margin-bottom: 12px;">
          <strong>Konsept:</strong> ${briefOutput.concept || ''}
        </div>
        <div style="display: flex; gap: 20px; font-size: 12px; color: ${textSecondary};">
          <div><strong>Gerekli İçerikler:</strong> ${briefOutput.keyDeliverables || '3x Video'}</div>
          <div><strong>Hedef ROI:</strong> <span style="color: #059669; font-weight: 800;">${briefOutput.targetRoi || '4.5x'}</span></div>
        </div>
      </div>

      <!-- Do's and Don'ts Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
        <div style="background: ${isLightMode ? '#ecfdf5' : 'rgba(6, 78, 59, 0.2)'}; border: 1px solid ${isLightMode ? '#a7f3d0' : 'rgba(16, 185, 129, 0.3)'}; border-radius: 12px; padding: 16px;">
          <div style="color: ${isLightMode ? '#047857' : '#34d399'}; font-weight: 800; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">
            ✅ ${isTr ? 'YAPILMASI GEREKENLER (DO\'S)' : 'DO\'S (GUIDELINES)'}
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 11px; line-height: 1.4;">
            ${doItems}
          </ul>
        </div>

        <div style="background: ${isLightMode ? '#fff1f2' : 'rgba(136, 19, 55, 0.2)'}; border: 1px solid ${isLightMode ? '#fecdd3' : 'rgba(225, 29, 72, 0.3)'}; border-radius: 12px; padding: 16px;">
          <div style="color: ${isLightMode ? '#be123c' : '#fb7185'}; font-weight: 800; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">
            ❌ ${isTr ? 'KAÇINILMASI GEREKENLER (DON\'TS)' : 'DON\'TS (RESTRICTIONS)'}
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 11px; line-height: 1.4;">
            ${dontItems}
          </ul>
        </div>
      </div>

      <!-- Brief Details -->
      <div style="background: ${isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)'}; border-radius: 12px; padding: 16px; border: 1px solid ${cardBorder}; margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 700; color: ${textPrimary}; margin-bottom: 8px;">
          📄 ${isTr ? 'Detaylı Brief Açıklaması:' : 'Detailed Brief Outline:'}
        </div>
        <div style="font-size: 12px; color: ${textSecondary}; line-height: 1.5; white-space: pre-line;">
          ${briefOutput.brief || briefOutput.concept || ''}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid ${cardBorder}; padding-top: 12px; text-align: center; font-size: 10px; color: ${textSecondary};">
      TrendVista AI İşletim Sistemi Tarafından Üretilmiştir — www.trendlab.ai
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: bgMain,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const rgb = isLightMode ? [248, 246, 250] : [6, 16, 30];
    pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${replaceTrChars(briefOutput.campaignName || 'marka_brief')}.pdf`);
  } catch (error) {
    if (document.body.contains(container)) document.body.removeChild(container);
    console.error('[TrendVista] PDF render error:', error);
  }
};

/**
 * Export Corporate PDF Invoice / Billing Receipt.
 */
export const exportInvoiceToPdf = async ({ invoiceNumber = 'INV-2026-0891', userPlan = 'Professional Plan', amount = '499.00 ₺', user, lang = 'tr' }) => {
  const isTr = lang === 'tr';
  const isLightMode = document.body.classList.contains('light-theme');

  const bgMain = isLightMode ? '#ffffff' : '#0f172a';
  const textPrimary = isLightMode ? '#0f172a' : '#ffffff';
  const textSecondary = isLightMode ? '#475569' : '#94a3b8';
  const cardBg = isLightMode ? '#f8fafc' : 'rgba(30, 41, 59, 0.6)';
  const cardBorder = isLightMode ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)';

  const customerName = user?.name || (user?.email ? user.email.split('@')[0] : 'Kaan Kaplan');
  const customerEmail = user?.email || 'test@trendlab.ai';
  const dateStr = new Date().toLocaleDateString('tr-TR');

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.minHeight = '1131px';
  container.style.padding = '48px';
  container.style.background = bgMain;
  container.style.color = textPrimary;
  container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';

  container.innerHTML = `
    <div>
      <!-- Corporate Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 24px; margin-bottom: 28px;">
        <div>
          <div style="font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; margin-bottom: 4px;">
            TrendVista AI <span style="font-size: 14px; color: ${textSecondary}; font-weight: 600;">Teknoloji A.Ş.</span>
          </div>
          <div style="font-size: 11px; color: ${textSecondary}; line-height: 1.4;">
            Büyükdere Cad. No: 195, Maslak / İstanbul<br />
            VKN: 8940192831 | MERSİS: 0894019283100001<br />
            destek@trendlab.ai | www.trendlab.ai
          </div>
        </div>

        <div style="text-align: right;">
          <div style="background: #2563eb; color: white; padding: 6px 16px; border-radius: 8px; font-weight: 900; font-size: 16px; letter-spacing: 1px; display: inline-block; margin-bottom: 8px;">
            ${isTr ? 'RESMİ E-FATURA DEKONTU' : 'OFFICIAL INVOICE RECEIPT'}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: ${textPrimary};">Fatura No: ${invoiceNumber}</div>
          <div style="font-size: 11px; color: ${textSecondary};">Düzenleme Tarihi: ${dateStr}</div>
        </div>
      </div>

      <!-- Customer & Payment Info Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
        <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 18px;">
          <div style="font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; margin-bottom: 8px;">
            👤 ${isTr ? 'MÜŞTERİ BİLGİLERİ' : 'BILLED TO'}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: ${textPrimary}; margin-bottom: 4px;">
            ${customerName}
          </div>
          <div style="font-size: 12px; color: ${textSecondary};">
            E-Posta: ${customerEmail}<br />
            Müşteri Tipi: Bireysel / Kurumsal SaaS
          </div>
        </div>

        <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 18px;">
          <div style="font-size: 11px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 8px;">
            💳 ${isTr ? 'ÖDEME DETAYLARI' : 'PAYMENT METHOD'}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: ${textPrimary}; margin-bottom: 4px;">
            iyzico Ödeme Altyapısı (3D Secure)
          </div>
          <div style="font-size: 12px; color: ${textSecondary};">
            Ödeme Durumu: <span style="color: #16a34a; font-weight: 800;">● ÖDENDİ (PAID)</span><br />
            Para Birimi: Türk Lirası (₺ / TRY)
          </div>
        </div>
      </div>

      <!-- Itemized Billing Table -->
      <div style="margin-bottom: 28px;">
        <div style="font-size: 13px; font-weight: 700; color: ${textPrimary}; margin-bottom: 12px; text-transform: uppercase;">
          📋 ${isTr ? 'FATURA KALEMLERİ' : 'ITEMIZED CHARGES'}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #2563eb; color: white; text-align: left;">
              <th style="padding: 10px 14px; border-top-left-radius: 8px;">Hizmet Açıklaması</th>
              <th style="padding: 10px 14px;">Dönem</th>
              <th style="padding: 10px 14px;">KDV Oranı</th>
              <th style="padding: 10px 14px; border-top-right-radius: 8px; text-align: right;">Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid ${cardBorder}; background: ${cardBg};">
              <td style="padding: 12px 14px; font-weight: 700; color: ${textPrimary};">
                TrendVista AI ${userPlan}
                <div style="font-size: 10px; color: ${textSecondary}; font-weight: normal;">Sınırsız AI Senaryo, Trend Radar & Analytics</div>
              </td>
              <td style="padding: 12px 14px; color: ${textSecondary};">Aylık (1 Ay)</td>
              <td style="padding: 12px 14px; color: ${textSecondary};">%20 KDV</td>
              <td style="padding: 12px 14px; text-align: right; font-weight: 700; color: ${textPrimary};">${amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals Summary Box -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 300px; background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: ${textSecondary}; margin-bottom: 6px;">
            <span>Ara Toplam (Matrah):</span>
            <span>${(parseFloat(amount) * 0.833).toFixed(2)} ₺</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: ${textSecondary}; margin-bottom: 10px;">
            <span>%20 KDV Tutarı:</span>
            <span>${(parseFloat(amount) * 0.167).toFixed(2)} ₺</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 900; color: #2563eb; border-top: 1px solid ${cardBorder}; padding-top: 8px;">
            <span>TOPLAM ÖDENTİ:</span>
            <span>${amount}</span>
          </div>
        </div>
      </div>

      <!-- Paid Stamp -->
      <div style="text-align: center; margin-top: 20px;">
        <div style="display: inline-block; border: 3px double #16a34a; color: #16a34a; padding: 8px 24px; border-radius: 8px; font-weight: 900; font-size: 18px; letter-spacing: 2px; transform: rotate(-3deg);">
          ✓ ÖDENDİ / PAID VIA IYZICO
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid ${cardBorder}; padding-top: 14px; text-align: center; font-size: 10px; color: ${textSecondary};">
      Bu fatura TrendVista AI Otomatik Fatura Sistemi tarafından elektronik ortamda üretilmiştir — www.trendlab.ai
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: bgMain,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const rgb = isLightMode ? [255, 255, 255] : [15, 23, 42];
    pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`TrendVista_Fatura_${invoiceNumber}.pdf`);
  } catch (error) {
    if (document.body.contains(container)) document.body.removeChild(container);
    console.error('[TrendVista] Invoice PDF error:', error);
  }
};

/**
 * Export to clean Markdown (.md) document with full Turkish UTF-8 preservation.
 */
export const exportToMarkdown = ({ filename = 'trendlab_rapor', content }) => {
  const blob = new Blob(['\ufeff' + content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${replaceTrChars(filename)}.md`;
  a.click();
  URL.revokeObjectURL(url);
};
