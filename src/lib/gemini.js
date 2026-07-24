import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const isGeminiEnabled = !!apiKey;

const ai = isGeminiEnabled ? new GoogleGenAI({ apiKey }) : null;

// Model name
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generate a viral video script using Gemini AI.
 */
export const generateAiScript = async ({ trendTitle, niche, platform = 'TikTok', tone = 'energetic', lang = 'tr' }) => {
  if (!ai) {
    return generateFallbackScript({ trendTitle, niche, platform, tone, lang });
  }

  try {
    const prompt = lang === 'tr' 
      ? `Sen sosyal medyada viral olan videolar yazan ödüllü bir içerik stratejistisin.
Trend/Konu: "${trendTitle}"
Niş/Kategori: "${niche}"
Platform: "${platform}"
Ton: "${tone}"

Lütfen 30-45 saniyelik harika bir video senaryosu yaz. Yanıtını YALNIZCA geçerli bir JSON olarak ver:
{
  "title": "Senaryo Başlığı",
  "hook": "İlk 3 saniye vurucu kanca sözü",
  "body": "Ana anlatım ve görsel detaylar",
  "callToAction": "Son saniyelerdeki harekete geçirici mesaj (CTA)",
  "visualNotes": "Çekim/kamera önerisi",
  "estimatedViralScore": 96
}`
      : `You are an award-winning social media content strategist specializing in viral short-form videos.
Trend/Topic: "${trendTitle}"
Niche: "${niche}"
Platform: "${platform}"
Tone: "${tone}"

Write a compelling 30-45 second video script. Respond ONLY with valid JSON:
{
  "title": "Script Title",
  "hook": "First 3-second hook line",
  "body": "Main body and visual descriptions",
  "callToAction": "Call to action text for the end",
  "visualNotes": "Visual/camera directives",
  "estimatedViralScore": 96
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.warn('[TrendVista] Gemini API error, falling back:', error.message);
    return generateFallbackScript({ trendTitle, niche, platform, tone, lang });
  }
};

/**
 * Generate viral video hooks using Gemini AI.
 */
export const generateAiHooks = async ({ topic, lang = 'tr' }) => {
  if (!ai) {
    return generateFallbackHooks(topic, lang);
  }

  try {
    const prompt = lang === 'tr'
      ? `Konu: "${topic}". Sosyal medya videoları için yüksek izlenme alan 4 farklı türde vurucu kanca (hook) yaz.
YALNIZCA geçerli bir JSON dizisi döndür:
[
  { "type": "Merak Uyandırıcı", "text": "Kanca metni...", "ctr": "%94 CTR" },
  { "type": "Soru / Meydan Okuma", "text": "Kanca metni...", "ctr": "%91 CTR" },
  { "type": "Şok / Olumsuz", "text": "Kanca metni...", "ctr": "%96 CTR" },
  { "type": "Hikaye / İtiraf", "text": "Kanca metni...", "ctr": "%89 CTR" }
]`
      : `Topic: "${topic}". Write 4 high-converting video hooks for short-form content in different styles.
Respond ONLY with valid JSON array:
[
  { "type": "Curiosity Hook", "text": "Hook text...", "ctr": "94% CTR" },
  { "type": "Question / Challenge", "text": "Hook text...", "ctr": "91% CTR" },
  { "type": "Shocking / Negative", "text": "Hook text...", "ctr": "96% CTR" },
  { "type": "Story / Confession", "text": "Hook text...", "ctr": "89% CTR" }
]`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.warn('[TrendVista] Gemini API error for hooks:', error.message);
    return generateFallbackHooks(topic, lang);
  }
};

/**
 * Generate Brand Campaign Brief using Gemini AI.
 */
export const generateAiBrandBrief = async ({ product, target, tone, platform, lang = 'tr' }) => {
  if (!ai) {
    return generateFallbackBrandBrief({ product, target, tone, platform, lang });
  }

  try {
    const prompt = lang === 'tr'
      ? `Ürün: "${product}", Hedef Kitle: "${target}", Ton: "${tone}", Platform: "${platform}".
Bu marka için detaylı bir Influencer Reklam Briefi oluştur. YALNIZCA geçerli bir JSON döndür:
{
  "campaignName": "Kampanya Adı",
  "concept": "Ana Konsept Fikri",
  "keyDeliverables": "Gerekli İçerik Adetleri",
  "targetRoi": "Tahmini ROI Katı (Örn: 4.8x)",
  "doList": ["Yapılması gereken 1", "Yapılması gereken 2"],
  "dontList": ["Kaçınılması gereken 1", "Kaçınılması gereken 2"]
}`
      : `Product: "${product}", Target: "${target}", Tone: "${tone}", Platform: "${platform}".
Create a detailed Influencer Campaign Brief. Respond ONLY with valid JSON:
{
  "campaignName": "Campaign Name",
  "concept": "Core Concept Idea",
  "keyDeliverables": "Deliverables list",
  "targetRoi": "Estimated ROI Multiple (e.g. 4.8x)",
  "doList": ["Do guideline 1", "Do guideline 2"],
  "dontList": ["Don't guideline 1", "Don't guideline 2"]
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.warn('[TrendVista] Gemini API error for brand brief:', error.message);
    return generateFallbackBrandBrief({ product, target, tone, platform, lang });
  }
};

/**
 * Chat with TrendVista AI Assistant.
 */
export const chatWithAiAssistant = async ({ message, lang = 'tr' }) => {
  if (!ai) {
    return lang === 'tr' 
      ? `TrendVista Asistanı (Demo Modu): "${message}" sorunuz harika! Gerçek Gemini AI yanıtı için .env.local dosyasına VITE_GEMINI_API_KEY ekleyebilirsiniz.`
      : `TrendVista Assistant (Demo Mode): Your question "${message}" is great! Add VITE_GEMINI_API_KEY to .env.local to enable real Gemini AI responses.`;
  }

  try {
    const systemPrompt = lang === 'tr'
      ? 'Sen TrendVista AI uygulamasının uzman trend danışmanısın. Kullanıcılara sosyal medya stratejileri, viral kancalar ve marka kampanyaları hakkında kısa, etkileyici ve uzman tavsiyeleri ver.'
      : 'You are the expert trend consultant for TrendVista AI. Provide concise, impactful, expert social media strategy advice.';

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${systemPrompt}\n\nKullanıcı: ${message}`,
    });

    return response.text;
  } catch (error) {
    console.warn('[TrendVista] Gemini chatbot error:', error.message || error);
    // Graceful fallback to smart advisory response if API Key is invalid or quota exceeded
    return lang === 'tr' 
      ? `"${message}" hakkında TrendVista strateji önerim: Viral kanca kullanıp ilk 3 saniyede izleyiciyi yakalayın. Trend kurgusu için Creator Hub sekmesini inceleyebilirsiniz!`
      : `Strategy for "${message}": Use a strong hook in the first 3 seconds to retain viewers. Explore Creator Hub for full scripts!`;
  }
};

// --- Fallback Helpers ---

function generateFallbackScript({ trendTitle, niche, platform, tone, lang }) {
  if (lang === 'tr') {
    return {
      title: `${trendTitle} — Viral ${platform} Senaryosu`,
      hook: `Eğer halen ${niche} alanında eski yöntemleri kullanıyorsan bu videoyu hemen durdur!`,
      body: `Son zamanlarda yükselen ${trendTitle} trendini uygulayarak izlenmelerini 10 katına çıkarabilirsin. Adım 1: Dikkat çekici bir açılış. Adım 2: Değer katan mesaj.`,
      callToAction: `Bu yöntem hakkında ne düşünüyorsun? Yorumlarda buluşalım ve takibe al!`,
      visualNotes: `${tone} tonda dinamik geçişler, hızlı alt yazılar ve ilk 3 saniyede yakın çekim yüz açısı.`,
      estimatedViralScore: 94
    };
  }
  return {
    title: `${trendTitle} — Viral ${platform} Script`,
    hook: `If you are still using old methods in ${niche}, stop scrolling right now!`,
    body: `Applying the rising ${trendTitle} trend will multiply your reach by 10x. Step 1: Hook the viewer. Step 2: Deliver value.`,
    callToAction: `What do you think about this strategy? Drop a comment below!`,
    visualNotes: `${tone} style dynamic cuts, bold captions, close-up framing in first 3 seconds.`,
    estimatedViralScore: 94
  };
}

function generateFallbackHooks(topic, lang) {
  if (lang === 'tr') {
    return [
      { type: 'Merak Uyandırıcı', text: `Kimsenin söylemediği ${topic} sırrını açıklıyorum...`, ctr: '%95 CTR' },
      { type: 'Soru / Meydan Okuma', text: `Halen ${topic} yaparken bu hataya düşüyor musun?`, ctr: '%91 CTR' },
      { type: 'Şok / Olumsuz', text: `Sakın ${topic} yapma! Eğer yapıyorsan hemen izle...`, ctr: '%97 CTR' },
      { type: 'Hikaye / İtiraf', text: `${topic} sayesinde izlenmelerimi nasıl 5 katına çıkardım?`, ctr: '%88 CTR' }
    ];
  }
  return [
    { type: 'Curiosity Hook', text: `Here is the ${topic} secret nobody is talking about...`, ctr: '95% CTR' },
    { type: 'Question Hook', text: `Are you still making this huge ${topic} mistake?`, ctr: '91% CTR' },
    { type: 'Shock Hook', text: `STOP doing ${topic} until you watch this video!`, ctr: '97% CTR' },
    { type: 'Story Hook', text: `How I multiplied my views using ${topic} in 7 days...`, ctr: '88% CTR' }
  ];
}

function generateFallbackBrandBrief({ product, target, tone, platform, lang }) {
  if (lang === 'tr') {
    return {
      campaignName: `${product} Viral ${platform} Kampanyası`,
      concept: `Organik içerik üreten influencer'lar ile ${target} kitlesine özel ${tone} anlatım.`,
      keyDeliverables: `3x ${platform} Reels/TikTok + 5x Instagram Story`,
      targetRoi: `4.5x ROI`,
      doList: [`İlk 3 saniyede ${product} görünmeli`, `${tone} ve samimi anlatım kullanılmalı`],
      dontList: ['Aşırı kurumsal ve sıkıcı reklam dili', 'Kalitesiz ses kaydı']
    };
  }
  return {
    campaignName: `${product} Viral ${platform} Campaign`,
    concept: `Authentic creator-led content targeting ${target} with ${tone} storytelling.`,
    keyDeliverables: `3x ${platform} Reels/Shorts + 5x Stories`,
    targetRoi: `4.5x ROI`,
    doList: [`Feature ${product} in the first 3s`, `Keep the tone ${tone} and authentic`],
    dontList: ['Corporate salesy language', 'Poor audio quality']
  };
}
