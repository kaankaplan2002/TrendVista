import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  Video,
  Link2,
  ArrowLeft,
  ChevronRight,
  Check,
  Copy,
  Info,
  Lock,
  X,
  Crown,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  Radio,
  Zap,
  BarChart2,
  MessageSquare,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportScriptToPdf, exportToMarkdown, exportInvoiceToPdf } from '../lib/pdfExporter.js';
import ContentCalendar from './ContentCalendar.jsx';
import ViralHookBank from './ViralHookBank.jsx';
import SavedTrendsLibrary from './SavedTrendsLibrary.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import DealInbox from './DealInbox.jsx';
import ViralAudioLab from './ViralAudioLab.jsx';
import { fetchLiveSocialTrends } from '../lib/socialTrendFetcher.js';
import { subscribeToTrendWebhooks, triggerDemoWebhookSpike } from '../lib/trendWebhookListener.js';

export default function CreatorWorkspace({ _setView, lang = 'tr', userPlan, setUserPlan, onIyzicoCheckout, theme, setTheme, user }) {
  const isTr = lang === 'tr';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [connectedChannels, setConnectedChannels] = useState({
    tiktok: false,
    instagram: false,
    youtube: false
  });
  const [studioTrend, setStudioTrend] = useState(lang === 'tr' ? 'Haftalık Planlama Rutini (Minimalist)' : 'Minimalist Weekly Planning Routine');
  const [studioOutput, setStudioOutput] = useState(null);
  const [selectedPlatform] = useState('TikTok');

  // Saved Trends Bookmarks State
  const [savedTrends, setSavedTrends] = useState([
    { id: 'st1', title: 'Salyangoz Özlü Serum Rutini', category: 'Güzellik & Bakım', growth: '+340%', platform: 'tiktok' },
    { id: 'st2', title: '90lar Saç Kurutma Modeli', category: 'Moda & Stil', growth: '+210%', platform: 'instagram' }
  ]);

  // Scheduled Calendar Items State
  const [scheduledItems, setScheduledItems] = useState([
    { id: '1', title: 'Salyangoz Özlü Serum Rutini', day: lang === 'tr' ? 'Pazartesi' : 'Monday', platform: 'tiktok', time: '19:00', status: 'scheduled' },
    { id: '2', title: '90lar Saç Kurutma Modeli', day: lang === 'tr' ? 'Çarşamba' : 'Wednesday', platform: 'instagram', time: '18:30', status: 'published' }
  ]);

  // Live API & Webhook State
  const [liveTrends, setLiveTrends] = useState([]);
  const [liveApiStatus, setLiveApiStatus] = useState({ source: 'Hybrid Realtime Engine', timestamp: '', loading: true });
  const [platformFilter, setPlatformFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('TR');
  const [webhookAlert, setWebhookAlert] = useState(null);

  // Load Live Trends from SocialTrendFetcher Engine
  const loadTrends = async (pf = platformFilter, reg = selectedRegion) => {
    setLiveApiStatus(prev => ({ ...prev, loading: true }));
    const result = await fetchLiveSocialTrends(pf, reg, lang);
    setLiveTrends(result.trends);
    setLiveApiStatus({ source: result.source, timestamp: result.timestamp, loading: false });
  };

  useEffect(() => {
    loadTrends(platformFilter, selectedRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformFilter, selectedRegion, lang]);

  // Subscribe to live Webhook events
  useEffect(() => {
    const unsubscribe = subscribeToTrendWebhooks((event) => {
      setWebhookAlert(event);
      // Auto-refresh trends when webhook arrives
      loadTrends(platformFilter, selectedRegion);
      // Auto-hide alert after 8 seconds
      setTimeout(() => setWebhookAlert(null), 8000);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformFilter, selectedRegion]);

  const handleToggleBookmark = (trendItem) => {
    const isBookmarked = savedTrends.some(t => t.id === trendItem.id || t.title === trendItem.title);
    if (isBookmarked) {
      setSavedTrends(prev => prev.filter(t => t.id !== trendItem.id && t.title !== trendItem.title));
    } else {
      setSavedTrends(prev => [
        {
          id: trendItem.id || Date.now().toString(),
          title: trendItem.title || trendItem.trend || 'Trend Başlığı',
          category: trendItem.category || 'Viral Trend',
          growth: trendItem.growth || '+250%',
          platform: selectedPlatform.toLowerCase()
        },
        ...prev
      ]);
    }
  };

  const handleAddSchedule = (newItem) => {
    setScheduledItems(prev => [newItem, ...prev]);
  };

  const handleDeleteSchedule = (id) => {
    setScheduledItems(prev => prev.filter(item => item.id !== id));
  };

  const handleScheduleCurrentScript = () => {
    if (!studioOutput) return;
    const dayName = lang === 'tr' ? 'Pazartesi' : 'Monday';
    handleAddSchedule({
      id: Date.now().toString(),
      title: studioOutput.trend,
      day: dayName,
      platform: selectedPlatform.toLowerCase(),
      time: '19:00',
      status: 'scheduled'
    });
    alert(lang === 'tr' ? `"${studioOutput.trend}" takvime eklendi!` : `"${studioOutput.trend}" added to calendar!`);
  };

  const handleSelectHookFromBank = (hookText) => {
    setStudioTrend(hookText);
    if (studioOutput) {
      setStudioOutput(prev => ({ ...prev, hook: hookText }));
    }
    setActiveTab('studio');
  };

  const [generating, setGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [selectedTone, setSelectedTone] = useState('energetic');
  const [activeHookIdx, setActiveHookIdx] = useState(0);
  const [showHookLab, setShowHookLab] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || (user?.email ? user.email.split('@')[0] : 'Demo Creator'));
  const [profileEmail, setProfileEmail] = useState(user?.email || 'kaan@trendlab.ai');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileNiche, setProfileNiche] = useState(lang === 'tr' ? 'Verimlilik & Teknoloji' : 'Productivity & Tech');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileShowPass, setProfileShowPass] = useState(false);
  const [profileShowConfirmPass, setProfileShowConfirmPass] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [customIdea, setCustomIdea] = useState('');
  const [predictorResult, setPredictorResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  // Interactive Quota limitations based on userPlan
  const [aiCredits, setAiCredits] = useState(3);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('form');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const t = {
    tr: {
      sidebarTitle: 'Creator Alanı', tabDashboard: 'Bugünün Fırsatları', tabStudio: 'AI İçerik Stüdyosu', tabChannels: 'Hesap Bağlantıları',
      backBtn: 'Ana Sayfaya Dön', dashboardTitle: 'Bugünün Fırsatları', dashboardSub: 'Profilinize ve kategorinize özel olarak filtrelenmiş viral trend sinyalleri.',
      statusActive: 'Sinyaller Güncel', statConnected: 'Bağlı Hesaplar', statCategory: 'Takip Edilen Kategori', statSaved: 'Kaydedilen Trendler',
      statCategoryValue: 'Verimlilik & Teknoloji', matchTitle: 'Eşleşen Trend Önerileri', matchScoreLabel: 'Uyum Skoru', lifecycleLabel: 'Yaşam Döngüsü',
      examineBtn: 'İncele', whyRising: 'Trend Neden Yükseliyor?', anglesTitle: 'Önerilen İçerik Açıları', sendToStudioBtn: 'AI Stüdyoya Gönder',
      setAlertBtn: 'Alarm Kur', lifecycleTitle: 'Trend Yaşam Döngüsü', lifecycleStages: ['Sinyal', 'Hızlanma', 'Zirve', 'Düşüş'],
      lifecycleRemaining: 'Doygunluğa Kalan:', matchFactorsTitle: 'Eşleşme Faktörleri', factorCategory: 'Kategori Uyumu',
      factorAudience: 'Hedef Kitle Uyumu', factorFormat: 'Format Uyumu', studioTitle: 'AI İçerik Stüdyosu',
      studioSub: 'Seçtiğiniz trendi kanca, kurgu, senaryo ve platform varyasyonlarıyla hazır içerik planına dönüştürün.',
      studioSelectTitle: 'Trend Seçin ve Üretin', selectPlaceholder: '-- Bir Trend Seçin --', generateBtn: 'Senaryo Üret',
      generatingMsg: 'AI trend analizi yapılıyor ve senaryolar oluşturuluyor...', outlineTitle: 'İçerik Taslağı & Senaryo',
      copyBtn: 'Kopya', copiedMsg: 'Kopyalandı', hookLabel: 'Önerilen Hook (Kanca)', sceneAkis: 'Akış & Sahne Detayları',
      metaTitle: 'Kopya Detayları', descLabel: 'Video Açıklaması', tagsLabel: 'Hashtag Paketi', notesTitle: 'Üretim Notları',
      channelsTitle: 'Hesap Bağlantıları', channelsSub: 'Sosyal medya hesaplarınızı güvenli OAuth yöntemiyle bağlayarak AI analiz motorunu etkinleştirin.',
      channelDesc: 'Trend eşleşmeleri, ses analizleri ve kitle verisi için yetkilendirin.', connectBtn: 'Bağlan',
      disconnectBtn: 'Bağlantıyı Kes', upgradeBanner: 'Plan limitleriniz (AI Kredisi: 3/10) tükenmek üzere. Professional Plan\'a yükseltin!',
      premiumActive: 'Professional / Enterprise Aktif: Limitsiz Kullanım!', upgradeBtn: 'Yükselt', checkoutTitle: 'Plan Satın Al',
      cardHolderLabel: 'Kart Sahibi', cardNumberLabel: 'Kart Numarası', payBtn: 'Ödemeyi Tamamla', paying: 'Ödeme İşleniyor...',
      successTitle: 'Abonelik Aktif!', successDesc: 'Aboneliğiniz başarıyla aktif edilmiştir. Limitsiz kullanım hazır!', close: 'Kapat',
      quotaLabel: 'AI Kredisi', planRequiredTitle: 'Plan Seçimi Gerekli', planRequiredSub: 'Creator Workspace alanına erişmek için lütfen 3 premium plandan birini satın alın.', selectBtn: 'Seç', popularBadge: 'Popüler', limitWarning: 'Starter Plan AI limitiniz doldu. Sınırsız senaryo için Professional Plan\'a yükseltin!',
      tabCalendar: 'İçerik Takvimi', tabHooks: 'Viral Kanca Bankası', tabAudio: 'Viral Ses Laboratuvarı', tabAnalytics: 'İçerik Analitiği', tabInbox: 'Teklifler & Mesajlar', sectionAnalytics: 'Analitik & İş Yönetimi'
    },
    en: {
      sidebarTitle: 'Creator Hub', tabDashboard: 'Today\'s Opportunities', tabStudio: 'AI Content Studio', tabChannels: 'Connected Channels',
      backBtn: 'Back to Home', dashboardTitle: 'Today\'s Opportunities', dashboardSub: 'Viral trend signals dynamically matched to your profile and niche.',
      statusActive: 'Signals Active', statConnected: 'Connected Channels', statCategory: 'Target Niche', statSaved: 'Saved Trends',
      statCategoryValue: 'Productivity & Tech', matchTitle: 'Matching Trend Suggestions', matchScoreLabel: 'Match Score', lifecycleLabel: 'Lifecycle',
      examineBtn: 'Analyze', whyRising: 'Why is this trend rising?', anglesTitle: 'Suggested Content Angles', sendToStudioBtn: 'Send to AI Studio',
      setAlertBtn: 'Set Alert', lifecycleTitle: 'Trend Lifecycle', lifecycleStages: ['Signal', 'Growth', 'Peak', 'Saturating'],
      lifecycleRemaining: 'Time to Saturation:', matchFactorsTitle: 'Match Factors', factorCategory: 'Category Match',
      factorAudience: 'Audience Fit', factorFormat: 'Format Fit', studioTitle: 'AI Content Studio',
      studioSub: 'Convert selected trends into structured scripts, hooks, captions, and tags.',
      studioSelectTitle: 'Select a Trend and Generate', selectPlaceholder: '-- Select a Trend --', generateBtn: 'Generate Script',
      generatingMsg: 'AI is analyzing trend metrics and generating creative files...', outlineTitle: 'Content Draft & Script',
      copyBtn: 'Copy', copiedMsg: 'Copied', hookLabel: 'Suggested Hook', sceneAkis: 'Flow & Scene Details',
      metaTitle: 'Caption details', descLabel: 'Video Description', tagsLabel: 'Hashtags Bundle', notesTitle: 'Filming Notes',
      channelsTitle: 'Connected Channels', channelsSub: 'Authenticate your accounts securely via OAuth to unlock AI metrics.',
      channelDesc: 'Grant permissions for trend matching, music metrics, and demographic data.', connectBtn: 'Connect',
      disconnectBtn: 'Disconnect', upgradeBanner: 'Your plan limits (AI Credits: 3/10) are running low. Upgrade to Professional Plan!',
      premiumActive: 'Professional / Enterprise Active: Unlimited Quotas!', upgradeBtn: 'Upgrade Now', checkoutTitle: 'Purchase Plan',
      cardHolderLabel: 'Cardholder Name', cardNumberLabel: 'Card Number', payBtn: 'Complete Payment', paying: 'Processing Payment...',
      successTitle: 'Subscription Active!', successDesc: 'Your subscription has been successfully activated. Unlimited quotas active!', close: 'Close',
      quotaLabel: 'AI Credits', planRequiredTitle: 'Pricing Plan Required', planRequiredSub: 'To access the Creator Workspace hub, please subscribe to one of our premium plans.', selectBtn: 'Select', popularBadge: 'Popular', limitWarning: 'Starter Plan AI limit reached. Upgrade to Professional Plan for unlimited scripts!',
      tabCalendar: 'Content Calendar', tabHooks: 'Viral Hook Bank', tabAudio: 'Viral Audio Lab', tabAnalytics: 'Content Analytics', tabInbox: 'Deals & Messages', sectionAnalytics: 'Analytics & Business'
    },
    de: {
      sidebarTitle: 'Creator Hub', tabDashboard: 'Chancen von heute', tabStudio: 'KI-Inhaltsstudio', tabChannels: 'Verbundene Kanäle',
      backBtn: 'Zur Startseite', dashboardTitle: 'Chancen von heute', dashboardSub: 'Virale Trendsignale, die dynamisch auf Ihr Profil abgestimmt sind.',
      statusActive: 'Signale aktiv', statConnected: 'Verbundene Kanäle', statCategory: 'Zielkategorie', statSaved: 'Gespeicherte Trends',
      statCategoryValue: 'Produktivität & Tech', matchTitle: 'Passende Trendvorschläge', matchScoreLabel: 'Übereinstimmung', lifecycleLabel: 'Lebenszyklus',
      examineBtn: 'Analysieren', whyRising: 'Warum steigt dieser Trend?', anglesTitle: 'Empfohlene Blickwinkel', sendToStudioBtn: 'An KI-Studio senden',
      setAlertBtn: 'Alarm einstellen', lifecycleTitle: 'Trend-Lebenszyklus', lifecycleStages: ['Signal', 'Wachstum', 'Spitze', 'Rückgang'],
      lifecycleRemaining: 'Verbleibende Zeit:', matchFactorsTitle: 'Übereinstimmungsfaktoren', factorCategory: 'Kategorie-Match',
      factorAudience: 'Zielgruppen-Passung', factorFormat: 'Format-Passung', studioTitle: 'KI-Inhaltsstudio',
      studioSub: 'Konvertieren Sie ausgewählte Trends in Skripte, Hooks und Bildunterschriften.',
      studioSelectTitle: 'Trend wählen', selectPlaceholder: '-- Trend auswählen --', generateBtn: 'Skript erstellen',
      generatingMsg: 'KI analysiert Metriken...', outlineTitle: 'Skript-Entwurf',
      copyBtn: 'Kopieren', copiedMsg: 'Kopiert', hookLabel: 'Empfohlener Hook', sceneAkis: 'Szenendetails',
      metaTitle: 'Metadaten', descLabel: 'Beschreibung', tagsLabel: 'Hashtags', notesTitle: 'Drehnotizen',
      channelsTitle: 'Verbundene Kanäle', channelsSub: 'Verbinden Sie Ihre Konten sicher über OAuth.',
      channelDesc: 'Berechtigungen erteilen.', connectBtn: 'Verbinden',
      disconnectBtn: 'Trennen', upgradeBanner: 'Ihre Limits sind fast erschöpft. Upgrade auf Professional!',
      premiumActive: 'Professional / Enterprise aktiv: Unbegrenzt!', upgradeBtn: 'Jetzt upgraden', checkoutTitle: 'Plan kaufen',
      cardHolderLabel: 'Karteninhaber', cardNumberLabel: 'Kartennummer', payBtn: 'Zahlung abschließen', paying: 'Verarbeitung...',
      successTitle: 'Abonnement aktiv!', successDesc: 'Abonnement erfolgreich aktiviert!', close: 'Schließen',
      quotaLabel: 'KI-Credits', planRequiredTitle: 'Plan erforderlich', planRequiredSub: 'Bitte abonnieren Sie einen Premium-Plan, um fortzufahren.', selectBtn: 'Auswählen', popularBadge: 'Beliebt', limitWarning: 'KI-Limit für den Starter-Plan erreicht. Aktualisieren Sie auf den Professional-Plan für unbegrenzte Skripte!',
      tabCalendar: 'Inhaltskalender', tabHooks: 'Viral-Hook-Datenbank', tabAudio: 'Viral-Audio-Labor', tabAnalytics: 'Inhaltsanalyse', tabInbox: 'Angebote & Nachrichten', sectionAnalytics: 'Analysen & Business'
    },
    fr: {
      sidebarTitle: 'Espace Créateur', tabDashboard: 'Opportunités du jour', tabStudio: 'Studio d\'écriture IA', tabChannels: 'Comptes connectés',
      backBtn: 'Retour à l\'accueil', dashboardTitle: 'Opportunités du jour', dashboardSub: 'Signaux viraux correspondant à votre profil et votre niche.',
      statusActive: 'Signaux actifs', statConnected: 'Comptes connectés', statCategory: 'Niche cible', statSaved: 'Tendances sauvegardées',
      statCategoryValue: 'Productivité & Tech', matchTitle: 'Suggestions de tendances', matchScoreLabel: 'Score de match', lifecycleLabel: 'Cycle de vie',
      examineBtn: 'Analyser', whyRising: 'Pourquoi cette tendance monte ?', anglesTitle: 'Angles suggérés', sendToStudioBtn: 'Envoyer au Studio',
      setAlertBtn: 'Créer une alerte', lifecycleTitle: 'Cycle de vie', lifecycleStages: ['Signal', 'Croissance', 'Pic', 'Baisse'],
      lifecycleRemaining: 'Temps restant :', matchFactorsTitle: 'Facteurs de match', factorCategory: 'Match catégorie',
      factorAudience: 'Adéquation audience', factorFormat: 'Format vidéo', studioTitle: 'Studio IA',
      studioSub: 'Transformez les tendances en scripts, hooks et légendes structurés.',
      studioSelectTitle: 'Sélectionner une tendance', selectPlaceholder: '-- Choisir une tendance --', generateBtn: 'Générer le script',
      generatingMsg: 'Génération de script IA...', outlineTitle: 'Structure & Scénario',
      copyBtn: 'Copier', copiedMsg: 'Copié', hookLabel: 'Hook suggéré', sceneAkis: 'Détails des scènes',
      metaTitle: 'Détails de la publication', descLabel: 'Description', tagsLabel: 'Mots-clés', notesTitle: 'Notes de tournage',
      channelsTitle: 'Comptes connectés', channelsSub: 'Connectez vos réseaux sociaux via OAuth.',
      channelDesc: 'Autoriser les données.', connectBtn: 'Connecter',
      disconnectBtn: 'Déconneter', upgradeBanner: 'Vos limites de crédit sont presque atteintes. Passez au plan Professional !',
      premiumActive: 'Professional / Enterprise actif : Utilisation illimitée !', upgradeBtn: 'Mettre à niveau', checkoutTitle: 'S\'abonner',
      cardHolderLabel: 'Titulaire du compte', cardNumberLabel: 'Numéro de carte', payBtn: 'Payer', paying: 'Traitement...',
      successTitle: 'Abonnement actif !', successDesc: 'Abonnement activé avec succès !', close: 'Fermer',
      quotaLabel: 'Crédits IA', planRequiredTitle: 'Abonnement requis', planRequiredSub: 'Pour accéder à l\'espace créateur, veuillez souscrire à l\'un de nos plans.', selectBtn: 'Choisir', popularBadge: 'Populaire', limitWarning: 'Limite d\'IA du plan Starter atteinte. Passez au plan Professional pour des scripts illimités !',
      tabCalendar: 'Calendrier de contenu', tabHooks: 'Banque de crochets', tabAudio: 'Laboratoire audio viral', tabAnalytics: 'Analyse de contenu', tabInbox: 'Offres & Messages', sectionAnalytics: 'Analyses & Business'
    },
    es: {
      sidebarTitle: 'Panel Creator', tabDashboard: 'Oportunidades de hoy', tabStudio: 'Estudio de Contenido IA', tabChannels: 'Canales Conectados',
      backBtn: 'Volver a inicio', dashboardTitle: 'Oportunidades de hoy', dashboardSub: 'Señales de tendencias virales adaptadas a tu perfil.',
      statusActive: 'Señales activas', statConnected: 'Canales conectados', statCategory: 'Categoría objetivo', statSaved: 'Tendencias guardadas',
      statCategoryValue: 'Productividad y Tech', matchTitle: 'Sugerencias de coincidencia', matchScoreLabel: 'Afinidad', lifecycleLabel: 'Ciclo de vida',
      examineBtn: 'Analizar', whyRising: '¿Por qué sube esta tendencia?', anglesTitle: 'Ángulos sugeridos', sendToStudioBtn: 'Enviar al Estudio',
      setAlertBtn: 'Configurar Alerta', lifecycleTitle: 'Ciclo de vida', lifecycleStages: ['Señal', 'Crecimiento', 'Pico', 'Saturación'],
      lifecycleRemaining: 'Tiempo para saturación:', matchFactorsTitle: 'Factores de afinidad', factorCategory: 'Categoría',
      factorAudience: 'Público', factorFormat: 'Formato', studioTitle: 'Estudio IA',
      studioSub: 'Convierte tendencias en guiones y ganchos estructurados por IA.',
      studioSelectTitle: 'Selecciona una tendencia', selectPlaceholder: '-- Elige --', generateBtn: 'Generar Guión',
      generatingMsg: 'IA generando guiones...', outlineTitle: 'Borrador & Guión',
      copyBtn: 'Copiar', copiedMsg: 'Copiado', hookLabel: 'Gancho sugerido', sceneAkis: 'Detalle de escenas',
      metaTitle: 'Detalles de copia', descLabel: 'Descripción de video', tagsLabel: 'Etiquetas', notesTitle: 'Notas de filmación',
      channelsTitle: 'Canales conectados', channelsSub: 'Conecta tus redes a través de OAuth de forma segura.',
      channelDesc: 'Autoriza los datos.', connectBtn: 'Conectar',
      disconnectBtn: 'Desconectar', upgradeBanner: 'Tus créditos de IA se están agotando. ¡Actualiza a Professional!',
      premiumActive: 'Professional / Enterprise activo: ¡Límites ilimitados!', upgradeBtn: 'Actualizar', checkoutTitle: 'Comprar plan',
      cardHolderLabel: 'Titular', cardNumberLabel: 'Número de tarjeta', payBtn: 'Completar pago', paying: 'Procesando...',
      successTitle: '¡Suscripción activa!', successDesc: '¡Tu suscripción se ha activado correctamente!', close: 'Cerrar',
      quotaLabel: 'Créditos IA', planRequiredTitle: 'Plan requerido', planRequiredSub: 'Suscríbete a un plan para acceder al panel de creadores.', selectBtn: 'Seleccionar', popularBadge: 'Popular', limitWarning: 'Límite de IA del plan Starter alcanzado. ¡Actualiza al plan Professional para guiones ilimitados!',
      tabCalendar: 'Calendario de contenido', tabHooks: 'Banco de ganchos virales', tabAudio: 'Laboratorio de audio viral', tabAnalytics: 'Análisis de contenido', tabInbox: 'Ofertas y Mensajes', sectionAnalytics: 'Análisis y Negocios'
    },
    it: {
      sidebarTitle: 'Hub Creator', tabDashboard: 'Opportunità di oggi', tabStudio: 'Studio di Scrittura IA', tabChannels: 'Canali Collegati',
      backBtn: 'Torna alla Home', dashboardTitle: 'Opportunità di oggi', dashboardSub: 'Segnali virali corrispondenti al tuo profilo.',
      statusActive: 'Segnali attivi', statConnected: 'Canali collegati', statCategory: 'Categoria target', statSaved: 'Tendenze salvate',
      statCategoryValue: 'Produttività & Tech', matchTitle: 'Tendenze abbinate', matchScoreLabel: 'Compatibilità', lifecycleLabel: 'Ciclo di vita',
      examineBtn: 'Analizza', whyRising: 'Perché questa tendenza cresce?', anglesTitle: 'Angoli suggeriti', sendToStudioBtn: 'Invia allo Studio',
      setAlertBtn: 'Imposta Alert', lifecycleTitle: 'Ciclo di vita', lifecycleStages: ['Segnale', 'Crescita', 'Picco', 'Calo'],
      lifecycleRemaining: 'Tempo alla saturazione:', matchFactorsTitle: 'Fattori di match', factorCategory: 'Categoria',
      factorAudience: 'Pubblico', factorFormat: 'Formato', studioTitle: 'Studio IA',
      studioSub: 'Trasforma le tendenze in sceneggiature, hook e descrizioni con l\'IA.',
      studioSelectTitle: 'Seleziona tendenza', selectPlaceholder: '-- Scegli --', generateBtn: 'Genera Script',
      generatingMsg: 'Generazione in corso...', outlineTitle: 'Bozza & Script',
      copyBtn: 'Copia', copiedMsg: 'Copiato', hookLabel: 'Hook consigliato', sceneAkis: 'Dettagli scena',
      metaTitle: 'Dettagli pubblicazione', descLabel: 'Descrizione video', tagsLabel: 'Hashtag', notesTitle: 'Note di ripresa',
      channelsTitle: 'Canali collegati', channelsSub: 'Collega i tuoi profili social tramite OAuth.',
      channelDesc: 'Autorizza i dati.', connectBtn: 'Collega',
      disconnectBtn: 'Scollega', upgradeBanner: 'I tuoi crediti IA sono quasi esauriti. Passa a Professional!',
      premiumActive: 'Professional / Enterprise attivo: Crediti illimitati!', upgradeBtn: 'Aggiorna', checkoutTitle: 'Acquista plan',
      cardHolderLabel: 'Titolare', cardNumberLabel: 'Numero carta', payBtn: 'Paga', paying: 'Elaborazione...',
      successTitle: 'Abbonamento attivo!', successDesc: 'Il tuo abbonamento è attivo. Buona creazione!', close: 'Chiudi',
      quotaLabel: 'Crediti IA', planRequiredTitle: 'Piano richiesto', planRequiredSub: 'Abbonati a un piano per accedere al Workspace Creator.', selectBtn: 'Seleziona', popularBadge: 'Popolare', limitWarning: 'Limite IA del piano Starter raggiunto. Passa al piano Professional per script illimitati!',
      tabCalendar: 'Calendario dei contenuti', tabHooks: 'Banca di ganci virali', tabAudio: 'Laboratorio audio virale', tabAnalytics: 'Analisi dei contenuti', tabInbox: 'Offerte e Messaggi', sectionAnalytics: 'Analisi e Business'
    },
    ru: {
      sidebarTitle: 'Панель Creator', tabDashboard: 'Chancen von heute', tabStudio: 'ИИ-студия сценариев', tabChannels: 'Каналы',
      backBtn: 'Назад на главную', dashboardTitle: 'Chancen von heute', dashboardSub: 'Вирусные тренды, подобранные под ваш профиль.',
      statusActive: 'Сигналы активны', statConnected: 'Подключено каналов', statCategory: 'Категория', statSaved: 'Сохранено трендов',
      statCategoryValue: 'Продуктивность & Tech', matchTitle: 'Рекомендуемые тренды', matchScoreLabel: 'Совместимость', lifecycleLabel: 'Жизненный цикл',
      examineBtn: 'Изучить', whyRising: 'Почему тренд растет?', anglesTitle: 'Рекомендуемые ракурсы', sendToStudioBtn: 'Отправить в Студию',
      setAlertBtn: 'Установить аларм', lifecycleTitle: 'Жизненный цикл тренда', lifecycleStages: ['Сигнал', 'Рост', 'Пик', 'Спад'],
      lifecycleRemaining: 'До насыщения:', matchFactorsTitle: 'Факторы совместимости', factorCategory: 'Тематика',
      factorAudience: 'Аудитория', factorFormat: 'Формат видео', studioTitle: 'ИИ-студия сценариев',
      studioSub: 'Превратите тренд в готовый сценарий, хуки и описания.',
      studioSelectTitle: 'Выбрать тренд', selectPlaceholder: '-- Выберите тренд --', generateBtn: 'Создать сценарий',
      generatingMsg: 'ИИ пишет сценарий...', outlineTitle: 'Готовый сценарий',
      copyBtn: 'Копировать', copiedMsg: 'Скопировано', hookLabel: 'Рекомендуемый хук', sceneAkis: 'Сцены и раскадровка',
      metaTitle: 'Метаданные', descLabel: 'Описание к видео', tagsLabel: 'Хэштеги', notesTitle: 'Советы по съемке',
      channelsTitle: 'Подключенные каналы', channelsSub: 'Безопасно подключите аккаунты через OAuth.',
      channelDesc: 'Предоставьте доступ.', connectBtn: 'Подключить',
      disconnectBtn: 'Отключить', upgradeBanner: 'Лимиты Starter подходят к концу. Обновитесь до Professional!',
      premiumActive: 'Professional / Enterprise активен: Безлимитно!', upgradeBtn: 'Обновить тариф', checkoutTitle: 'Оплата подписки',
      cardHolderLabel: 'Имя на карте', cardNumberLabel: 'Номер карты', payBtn: 'Оплатить', paying: 'Платеж обрабатывается...',
      successTitle: 'Подписка активна!', successDesc: 'Подписка успешно активирована!', close: 'Закрыть',
      quotaLabel: 'ИИ-кредиты', planRequiredTitle: 'Необходим тарифный план', planRequiredSub: 'Для входа в рабочий кабинет выберите тариф.', selectBtn: 'Выбрать', popularBadge: 'Популярно', limitWarning: 'Лимит ИИ для тарифного плана Starter исчерпан. Обновитесь до Professional для безлимитных сценариев!',
      tabCalendar: 'Контент-календарь', tabHooks: 'Банк вирусных хуков', tabAudio: 'Лаборатория вирусных звуков', tabAnalytics: 'Аналитика контента', tabInbox: 'Сделки и сообщения', sectionAnalytics: 'Аналитика и бизнес'
    },
    ja: {
      sidebarTitle: 'クリエイター領域', tabDashboard: '今日のトレンド', tabStudio: 'AI台本スタジオ', tabChannels: '連携アカウント',
      backBtn: 'ホームに戻る', dashboardTitle: '今日のトレンド', dashboardSub: 'あなたのチャンネルに合わせたおすすめバイラルシグナル。',
      statusActive: 'シグナル正常稼働中', statConnected: '連携アカウント', statCategory: 'ターゲットカテゴリ', statSaved: '保存済みトレンド',
      statCategoryValue: '生産性・テック', matchTitle: '適合トレンド一覧', matchScoreLabel: '適合スコア', lifecycleLabel: 'ライフサイクル',
      examineBtn: '詳細を見る', whyRising: 'トレンド急上昇の背景', anglesTitle: '推奨構成アングル', sendToStudioBtn: 'AIスタジオへ送る',
      setAlertBtn: 'アラート設定', lifecycleTitle: 'トレンド状況', lifecycleStages: ['シグナル', '急成長', 'ピーク', '収束'],
      lifecycleRemaining: '飽和までの予想期間:', matchFactorsTitle: 'マッチング要因', factorCategory: 'ジャンル適合',
      factorAudience: 'ターゲット層一致率', factorFormat: '推奨動画形式', studioTitle: 'AI動画台本スタジオ',
      studioSub: '選択したトレンドをもとに、視聴維持率の高い構成・フック・台本をAIが瞬時に生成します。',
      studioSelectTitle: '対象トレンドを選択して生成', selectPlaceholder: '-- トレンドを選択 --', generateBtn: '台本を作成する',
      generatingMsg: 'AIが動画構成を分析中...', outlineTitle: '生成された動画構成・台本',
      copyBtn: 'コピー', copiedMsg: 'コピーしました', hookLabel: '推奨冒頭フック', sceneAkis: '各シーンの構成案',
      metaTitle: 'メタデータ案', descLabel: '投稿動画キャプション', tagsLabel: 'ハッシュタグ', notesTitle: '撮影時のアドバイス',
      channelsTitle: 'アカウント連携管理', channelsSub: 'OAuthによる安全な認証でアカウントを接続します。',
      channelDesc: '連携を許可する。', connectBtn: '連携する',
      disconnectBtn: '連携を解除', upgradeBanner: 'AIクレジット制限（3/10回）が近づいています。Professionalへアップグレード！',
      premiumActive: 'Professional / Enterprise 有効：回数無制限！', upgradeBtn: 'アップグレード', checkoutTitle: 'プランの購入',
      cardHolderLabel: 'カード名義', cardNumberLabel: 'カード番号', payBtn: '決済を完了する', paying: '決済処理中...',
      successTitle: 'プラン適用完了！', successDesc: 'サブスクリプションが有効化され、回数無制限でご利用いただけます。', close: '閉じる',
      quotaLabel: 'AIクレジット残り', planRequiredTitle: 'プランの未選択', planRequiredSub: 'クリエイター領域を利用するには有料プランのご契約が必要です。', selectBtn: '選択する', popularBadge: '人気', limitWarning: 'StarterプランのAI制限に達しました。無制限に台本を生成するにはProfessionalプランにアップグレードしてください！',
      tabCalendar: 'コンテンツカレンダー', tabHooks: 'バイラルコピペバンク', tabAudio: 'バイラルオーディオラボ', tabAnalytics: 'コンテンツ分析', tabInbox: '案件・メッセージ', sectionAnalytics: '分析・ビジネス管理'
    },
    zh: {
      sidebarTitle: '创作者工作区', tabDashboard: '今日趋势发现', tabStudio: 'AI 视频工作室', tabChannels: '社交账号关联',
      backBtn: '返回首页', dashboardTitle: '今日趋势发现', dashboardSub: '结合您的频道属性智能匹配的视频爆款信号。',
      statusActive: '趋势数据已更新', statConnected: '已关联账号', statCategory: '主攻垂直领域', statSaved: '保存的趋势主题',
      statCategoryValue: '效率 & 科技', matchTitle: '爆款匹配推荐', matchScoreLabel: '契合指数', lifecycleLabel: '趋势阶段',
      examineBtn: '分析详情', whyRising: '为什么这个趋势会火？', anglesTitle: '推荐拍摄角度', sendToStudioBtn: '发送到工作台',
      setAlertBtn: '设置趋势监控', lifecycleTitle: '趋势寿命周期', lifecycleStages: ['萌芽', '爬坡', '顶峰', '衰退'],
      lifecycleRemaining: '距饱和流失约：', matchFactorsTitle: '契合度细分指标', factorCategory: '垂类重合率',
      factorAudience: '粉丝群契合度', factorFormat: '视频格式兼容度', studioTitle: 'AI 视频工作室',
      studioSub: '选定热门趋势，AI 助手帮您写好吸睛开头（Hook）、视频分镜头脚本与文案。',
      studioSelectTitle: '选择趋势并生成台本', selectPlaceholder: '-- 请选择一个趋势 --', generateBtn: '智能生成脚本',
      generatingMsg: 'AI 正在梳理脚本大纲...', outlineTitle: 'AI 生成的脚本大纲与台词',
      copyBtn: '复制', copiedMsg: '已复制', hookLabel: '推荐黄金前3秒（Hook）', sceneAkis: '分镜头结构与文案',
      metaTitle: '发布参考信息', descLabel: '推荐视频简介', tagsLabel: '推荐标签包', notesTitle: '录制与剪辑贴士',
      channelsTitle: '账号绑定管理', channelsSub: '通过 OAuth 协议安全授权绑定您的社媒频道。',
      channelDesc: '授权访问。', connectBtn: '点击绑定',
      disconnectBtn: '解除绑定', upgradeBanner: '当前 Starter 计划限额（AI 额度: 3/10）即将用尽。请升级至 Professional 计划！',
      premiumActive: 'Professional / Enterprise 计划已激活：无限次创作使用！', upgradeBtn: '立即升级', checkoutTitle: '购买创作版服务',
      cardHolderLabel: '持卡人姓名', cardNumberLabel: '卡号', payBtn: '完成付款', paying: '正在处理付款...',
      successTitle: '订阅已生效！', successDesc: '您的创作版订阅已成功支付激活，无限额创作权限已开启！', close: '关闭',
      quotaLabel: '剩余 AI 额度', planRequiredTitle: '请选择订阅计划', planRequiredSub: '要访问创作者中心，请先选择购买我们其中的一款订阅服务。', selectBtn: '选择', popularBadge: '热门', limitWarning: '已达到 Starter 计划的 AI 额度限制。升级到 Professional 计划以获取无限次脚本生成！',
      tabCalendar: '内容日历', tabHooks: '爆款开场钩子库', tabAudio: '爆款音频实验室', tabAnalytics: '内容数据分析', tabInbox: '商业合作与私信', sectionAnalytics: '数据与业务管理'
    },
    ar: {
      sidebarTitle: 'مساحة المبدع', tabDashboard: 'فرص اليوم', tabStudio: 'أستوديو المحتوى الذكي', tabChannels: 'ربط الحسابات',
      backBtn: 'العودة للرئيسية', dashboardTitle: 'فرص اليوم', dashboardSub: 'إشارات التوجهات الفيروسية المصممة لملفك الشخصي ونشاطك.',
      statusActive: 'الإشارات نشطة', statConnected: 'الحسابات المتصلة', statCategory: 'فئة التوجه', statSaved: 'التوجهات المحفوظة',
      statCategoryValue: 'الانتاجية والتكنولوجيا', matchTitle: 'التوجهات المقترحة لك', matchScoreLabel: 'نسبة التوافق', lifecycleLabel: 'دورة الحياة',
      examineBtn: 'تحليل', whyRising: 'لماذا يصعد هذا التوجه؟', anglesTitle: 'زوايا المحتوى المقترحة', sendToStudioBtn: 'إرسال إلى الأستوديو',
      setAlertBtn: 'ضبط تنبيه', lifecycleTitle: 'دورة حياة التوجه', lifecycleStages: ['إشارة', 'نمو', 'ذروة', 'تراجع'],
      lifecycleRemaining: 'الوقت المتبقي للتشبع:', matchFactorsTitle: 'عوامل التوافق', factorCategory: 'توافق الفئة',
      factorAudience: 'توافق الجمهور', factorFormat: 'توافق التنسيق', studioTitle: 'أستوديو الذكاء الاصطناعي',
      studioSub: 'حول التوجهات المختارة إلى نصوص وخطافات فيديو ووسوم جاهزة باستخدام الذكاء الاصطناعي.',
      studioSelectTitle: 'اختر توجهًا للبدء', selectPlaceholder: '-- اختر توجهًا --', generateBtn: 'إنشاء النص',
      generatingMsg: 'جاري كتابة النص والسيناريو...', outlineTitle: 'مخطط وسيناريو الفيديو المقترح',
      copyBtn: 'نسخ', copiedMsg: 'تم النسخ', hookLabel: 'الخطاف المقترح (أول 3 ثوان)', sceneAkis: 'تفاصيل المشاهد وحركة الكاميرا',
      metaTitle: 'ملاحظات النشر والمقاييس', descLabel: 'وصف الفيديو المقترح', tagsLabel: 'حزمة الوسوم', notesTitle: 'ملاحظات التصوير',
      channelsTitle: 'إدارة ربط الحسابات', channelsSub: 'اربط حساباتك الاجتماعية بأمان عبر بروتوكول OAuth.',
      channelDesc: 'السماح للبيانات.', connectBtn: 'ربط الحساب',
      disconnectBtn: 'إلغاء الربط', upgradeBanner: 'أوشكت حدود باقة Starter (رصيد AI: 3/10) على الانتهاء. قم بالترقية إلى باقة Professional!',
      premiumActive: 'باقة Professional / Enterprise نشطة: استخدام غير محدود!', upgradeBtn: 'ترقية الآن', checkoutTitle: 'شراء الباقة',
      cardHolderLabel: 'اسم صاحب البطاقة', cardNumberLabel: 'رقم البطاقة', payBtn: 'إتمام الدفع', paying: 'جاري المعالجة...',
      successTitle: 'تم تفعيل الاشتراك!', successDesc: 'تم تفعيل باقتك بنجاح. استمتع بكتابة سيناريوهات غير محدودة!', close: 'إغلاق',
      quotaLabel: 'رصيد AI المتبقي', planRequiredTitle: 'مطلوب اختيار باقة اشتراك', planRequiredSub: 'للدخول إلى لوحة المبدعين، يرجى اختيار وتفعيل إحدى باقات الاشتراك.', selectBtn: 'تحديد', popularBadge: 'شائع', limitWarning: 'تم الوصول إلى حد الذكاء الاصطناعي للباقة الأساسية. يرجى الترقية إلى الباقة الاحترافية للحصول على نصوص غير محدودة!',
      tabCalendar: 'جدول المحتوى', tabHooks: 'بنك الخطافات الفيروسية', tabAudio: 'مختبر الصوت الفيروسي', tabAnalytics: 'تحليلات المحتوى', tabInbox: 'الصفقات والرسائل', sectionAnalytics: 'التحليلات وإدارة الأعمال'
    }
  };

  const creatorTrends = [
    // Eğitim & Verimlilik (5)
    {
      id: 1,
      name: lang === 'tr' ? 'Haftalık Planlama Rutini (Minimalist)' : 'Minimalist Weekly Planning Routine',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Eğitim & Verimlilik' : 'Education & Productivity',
      score: 95,
      growth: '+340%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '4-5 gün' : '4-5 days',
      reason: lang === 'tr' ? 'Pazartesi sendromuna karşı minimalist düzenleme videoları şu an aşırı popüler.' : 'Minimalist lifestyle templates are trending for combating Monday blue syndrome.',
      hook: lang === 'tr' ? 'Hayatımı düzenlemek için her Pazar yaptığım 3 minimalist alışkanlık...' : '3 minimalist habits I do every Sunday to get my life together...',
      angles: lang === 'tr' ? ['Sadece 5 dakikalık planlama', 'Masa düzeni ile verimlilik', 'Uygulamalı ajanda kullanımı'] : ['Just 5-minute planning routines', 'Desk aesthetics for focus', 'Hands-on planner walkthroughs']
    },
    {
      id: 2,
      name: lang === 'tr' ? '25 Dk Pomodoro & Deep Work Odaklanma' : '25 Min Pomodoro & Deep Work Technique',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Eğitim & Verimlilik' : 'Education & Productivity',
      score: 91,
      growth: '+240%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '6 gün' : '6 days',
      reason: lang === 'tr' ? 'Sınav dönemi ve iş hayatında odaklanma videolarının izlenmesi %240 arttı.' : 'Focus & study with me streams spiked by 240%.',
      hook: lang === 'tr' ? 'Odaklanma sorunu yaşayanlar için 25 dakikalık pürüzsüz çalışma tekniği...' : 'Smooth 25-minute study protocol for ADHD & distractions...',
      angles: lang === 'tr' ? ['Pomodoro zamanlayıcısı', 'Telefonu uzak tutma kuralı', 'Müziksiz odaklanma'] : ['Pomodoro timer setup', 'No-phone rule', 'Silent focus']
    },
    {
      id: 3,
      name: lang === 'tr' ? 'Dijital Not Tutma & Notion Düzeni' : 'Digital Note Taking & Notion Setup',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Eğitim & Verimlilik' : 'Education & Productivity',
      score: 88,
      growth: '+195%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '5 gün' : '5 days',
      reason: lang === 'tr' ? 'Estetik dijital not tutma ve ajanda şablonları Reels alanında büyük etkileşim alıyor.' : 'Digital planner templates getting huge save rates.',
      hook: lang === 'tr' ? 'Tüm projelerimi ve hayatımı yönettiğim tek dijital şablon!' : 'The single Notion template that manages my entire life!',
      angles: lang === 'tr' ? ['Notion ders notları', 'Haftalık görev takibi', 'Şablon paylaşımı'] : ['Notion lecture notes', 'Weekly task board', 'Template showcase']
    },
    {
      id: 4,
      name: lang === 'tr' ? 'Hızlı Okuma & Hafıza Teknikleri' : 'Speed Reading & Memory Hacks',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Eğitim & Verimlilik' : 'Education & Productivity',
      score: 86,
      growth: '+170%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '8 gün' : '8 days',
      reason: lang === 'tr' ? 'Bir kitabı hızlıca anlama ve hafızada tutma videoları kaydedilme alıyor.' : 'Speed reading tutorials surging in bookmarks.',
      hook: lang === 'tr' ? 'Bir kitabı 2 saatte anlama ve hafızada tutma tüyoları...' : 'How to read and retain an entire book in 2 hours...',
      angles: lang === 'tr' ? ['Göz kası egzersizi', 'Zihin haritası çıkarma', 'Feynman tekniği'] : ['Eye muscle drills', 'Mind mapping', 'Feynman technique']
    },
    {
      id: 5,
      name: lang === 'tr' ? 'İkinci Beyin (Second Brain) Kurulumu' : 'Building a Second Brain Setup',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Eğitim & Verimlilik' : 'Education & Productivity',
      score: 93,
      growth: '+280%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '7 gün' : '7 days',
      reason: lang === 'tr' ? 'Kişisel bilgi yönetimi ve zihin haritalama videoları üst sıralarda.' : 'Personal knowledge management tutorials trending.',
      hook: lang === 'tr' ? 'Hiçbir fikri unutmamak için bilgisayarımda kurduğum İkinci Beyin!' : 'The second brain system that organizes my entire mind!',
      angles: lang === 'tr' ? ['Obsidian düzeni', 'Bilgi sınıflandırma', 'Zettelkasten metodu'] : ['Obsidian workflow', 'Knowledge tagging', 'Zettelkasten method']
    },

    // Yeme & İçme (5)
    {
      id: 6,
      name: lang === 'tr' ? 'Evde Buzlu Matcha Hazırlama' : 'At-Home Iced Matcha Routine',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink',
      score: 89,
      growth: '+180%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '2 gün' : '2 days',
      reason: lang === 'tr' ? 'Yaz sıcaklarında estetik içecek hazırlama videolarının izlenme süresi %180 arttı.' : 'Viewer retention for iced drinks preparation reels has spiked by 180%.',
      hook: lang === 'tr' ? 'Dışarıda 150₺ vermeyi bırakın: Evde Starbucks Matchası hazırlıyoruz!' : 'Stop paying $7 outside: We are making iced Matcha at home!',
      angles: lang === 'tr' ? ['Ev yapımı matcha tarifi', 'ASMR buzlu matcha yapımı', 'Matcha vs Kahve deneyi'] : ['Homemade matcha recipe', 'ASMR iced matcha styling', 'Matcha vs Coffee test']
    },
    {
      id: 7,
      name: lang === 'tr' ? '10 Dakikada Yüksek Proteinli Kahvaltı' : '10-Min High Protein Breakfast',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink',
      score: 93,
      growth: '+290%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '5 gün' : '5 days',
      reason: lang === 'tr' ? 'Hızlı ve pratik sağlıklı kahvaltı tarifleri TikTok\'ta ivme kazanıyor.' : 'Quick healthy breakfast recipes trending on TikTok.',
      hook: lang === 'tr' ? 'Sabahları vaktiniz yoksa: 35g protein içeren 10 dakikalık omlet!' : 'In a rush? 35g protein 10-minute breakfast bowl!',
      angles: lang === 'tr' ? ['Lor peynirli tarif', 'Pratik pişirme', 'Sporcu beslenmesi'] : ['High protein recipe', 'Speed prep', 'Fitness fuel']
    },
    {
      id: 8,
      name: lang === 'tr' ? 'Airfryer İle Hızlı & Pratik Tarifler' : 'Quick Airfryer Hack Recipes',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink',
      score: 87,
      growth: '+165%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '4 gün' : '4 days',
      reason: lang === 'tr' ? 'Hava fritözü pratik tarif videoları arama hacminde üst sıralarda.' : 'Airfryer recipe hacks high in search volume.',
      hook: lang === 'tr' ? 'Airfryer\'da yağsız ve çıtır çıtır patates yapmanın tek sırrı!' : 'The single trick for extra crispy airfryer fries!',
      angles: lang === 'tr' ? ['Baharat karışımı', 'Ön ısıtma tüyoları', 'Çıtır kaplama'] : ['Spice mix', 'Preheat tricks', 'Crispy coating']
    },
    {
      id: 9,
      name: lang === 'tr' ? 'Ev Yapımı Ekşi Mayalı Ekmek Serüveni' : 'Homemade Sourdough Journey',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink',
      score: 85,
      growth: '+140%',
      lifecycle: lang === 'tr' ? 'Doyuma Ulaşıyor' : 'Maturing',
      remainingDays: lang === 'tr' ? '3 gün' : '3 days',
      reason: lang === 'tr' ? 'Fırıncılık ve maya besleme videoları reels keşfetinde ilgi görüyor.' : 'Sourdough starter routines getting views.',
      hook: lang === 'tr' ? 'Fırından aldığınız ekmekleri unutun: Sıfırdan ekşi maya besliyoruz!' : 'Forget store-bought bread: Feeding sourdough starter from scratch!',
      angles: lang === 'tr' ? ['Maya başlatma', 'Katlama tekniği', 'Döküm tencere pişirimi'] : ['Starter feeding', 'Stretch & fold', 'Dutch oven bake']
    },
    {
      id: 10,
      name: lang === 'tr' ? 'Soğuk Demleme (Cold Brew) Kahve Sırları' : 'Cold Brew Coffee Secrets',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink',
      score: 90,
      growth: '+210%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '6 gün' : '6 days',
      reason: lang === 'tr' ? 'Evde profesyonel soğuk kahve hazırlama rehberleri ivme alıyor.' : 'Home barista cold brew guides trending.',
      hook: lang === 'tr' ? '12 saatte hazırlanan pürüzsüz Cold Brew yapım rehberi!' : 'Smooth 12-hour cold brew recipe at home!',
      angles: lang === 'tr' ? ['Kahve çekirdeği boyutu', 'Demleme su oranı', 'Aroma dokunuşları'] : ['Grind size', 'Water ratio', 'Flavor notes']
    },

    // Teknoloji (5)
    {
      id: 11,
      name: lang === 'tr' ? 'Yapay Zeka İle İçerik Üretimi 2026' : 'AI Voice Cloning Tutorial',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Teknoloji' : 'Tech',
      score: 94,
      growth: '+310%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '8-10 gün' : '8-10 days',
      reason: lang === 'tr' ? 'Yeni çıkan açık kaynaklı ses klonlama modelleri teknoloji dünyasında çok konuşuluyor.' : 'Recently released open-source voice replication models are creating huge chatter online.',
      hook: lang === 'tr' ? 'Kendi sesimi 10 saniyede yapay zekaya klonlattım, sonuç ürkütücü!' : 'I cloned my own voice in 10 seconds using AI, and it is scary!',
      angles: lang === 'tr' ? ['10 saniyede ses klonlama testi', 'AI ses klonlama nasıl yapılır?', 'Ses klonlamanın tehlikeleri'] : ['10-second voice clone challenge', 'Step-by-step clone walkthrough', 'The ethical risks of voice cloning']
    },
    {
      id: 12,
      name: lang === 'tr' ? 'Kablosuz Yaka Mikrofonu Ses Testi' : 'Wireless Lapel Mic Audio Test',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Teknoloji' : 'Tech',
      score: 91,
      growth: '+230%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '6 gün' : '6 days',
      reason: lang === 'tr' ? 'İçerik üreticileri için bütçe dostu yaka mikrofonları incelemeleri trendde.' : 'Budget mic reviews trending for creators.',
      hook: lang === 'tr' ? '500₺ ve 5.000₺\'lik mikrofon ses kalitesi testi: Aradaki fark şoke etti!' : '$20 vs $200 wireless mic test!',
      angles: lang === 'tr' ? ['Gürültü engelleme testi', 'Dış mekan çekimi', 'Fiyat/Performans'] : ['Noise cancellation test', 'Outdoor test', 'Value rating']
    },
    {
      id: 13,
      name: lang === 'tr' ? '2026 En İyi AI İçerik Araçları' : 'Best AI Content Tools 2026',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Teknoloji' : 'Tech',
      score: 88,
      growth: '+190%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '3 gün' : '3 days',
      reason: lang === 'tr' ? 'Sosyal medya üreticileri için ücretsiz AI araç tavsiyeleri viral kaydedilme alıyor.' : 'Free AI tools for creators getting massive saves.',
      hook: lang === 'tr' ? 'Tasarım ve kurgu sürenizi 10 kat hızlandıracak 4 ücretsiz AI aracı!' : '4 free AI tools that save 10 hours a week!',
      angles: lang === 'tr' ? ['Görsel üretim tüyoları', 'Otomatik altyazı', 'Renk düzenleme'] : ['Image gen tips', 'Auto captions', 'Color grading']
    },
    {
      id: 14,
      name: lang === 'tr' ? 'Akıllı Ev Otomasyonu & Setup Rehberi' : 'Smart Home Automation Setup',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Teknoloji' : 'Tech',
      score: 89,
      growth: '+205%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '7 gün' : '7 days',
      reason: lang === 'tr' ? 'Sesli komutlu ışık ve perde otomasyonu videoları ilgi uyandırıyor.' : 'Voice activated smart home setups trending.',
      hook: lang === 'tr' ? 'Evi tamamen sesli komutla yönettiğim akıllı otomasyon sistemi!' : 'Controlling my entire apartment with voice AI!',
      angles: lang === 'tr' ? ['Akıllı ampul senaryoları', 'Otomatik perde', 'Enerji tasarrufu'] : ['Smart bulb scenes', 'Auto curtains', 'Energy savings']
    },
    {
      id: 15,
      name: lang === 'tr' ? 'Mobil Sinematik Video Çekim Ayarları' : 'Mobile Cinematic Camera Settings',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Teknoloji' : 'Tech',
      score: 92,
      growth: '+260%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '4 gün' : '4 days',
      reason: lang === 'tr' ? 'Akıllı telefonla 4K profesyonel video çekim tüyoları viral.' : 'Professional smartphone camera hacks trending.',
      hook: lang === 'tr' ? 'Telefonla film kalitesinde video çekmek için 3 gizli kamera ayarı!' : '3 hidden camera settings for film-like mobile videos!',
      angles: lang === 'tr' ? ['4K 24FPS seçimi', 'Pozlama sabitleme', 'Görsel kurgu'] : ['4K 24FPS lock', 'Exposure lock', 'Color LUTs']
    },

    // Güzellik & Bakım (5)
    {
      id: 16,
      name: lang === 'tr' ? 'Salyangoz Özlü Serum & Cam Cilt Rutini' : 'Snail Mucin Glass Skin Routine',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Güzellik & Bakım' : 'Beauty & Care',
      score: 96,
      growth: '+360%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '3 gün' : '3 days',
      reason: lang === 'tr' ? 'K-Beauty nem ve parlak cilt rutinleri TikTok\'ta trendlerin zirvesinde.' : 'Korean glass skin routines top trending skincare on TikTok.',
      hook: lang === 'tr' ? 'Cam gibi parlayan cilt sırrı: 3 adımda salyangoz serumu kullanımı!' : 'The secret to glass skin: 3 steps with snail serum!',
      angles: lang === 'tr' ? ['Nem bombası etkisi', 'Gece bakımı rutinleri', 'Cilt tonu eşitleme'] : ['Hydration boost', 'Night routine', 'Skin tone glow']
    },
    {
      id: 17,
      name: lang === 'tr' ? 'Kore Cilt Bakımı 4 Adım Rehberi' : 'Korean 4-Step Skincare Guide',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Güzellik & Bakım' : 'Beauty & Care',
      score: 92,
      growth: '+280%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '5 gün' : '5 days',
      reason: lang === 'tr' ? 'Derinlemesine temizlik ve güneş koruma rutinleri yüksek izlenme alıyor.' : 'Double cleansing and sun protection reels surging.',
      hook: lang === 'tr' ? 'Korelilerin yaşlanmayan ciltlerinin arkasındaki 4 altın kural...' : '4 golden rules behind ageless Korean skin...',
      angles: lang === 'tr' ? ['Çift aşamalı temizlik', 'Güneş kremi tazeleme', 'Essence kullanımı'] : ['Double cleanse', 'SPF reapplication', 'Essence layering']
    },
    {
      id: 18,
      name: lang === 'tr' ? 'Gece Cilt Yenileme & Yüz Masajı' : 'Overnight Face Massaging Routine',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Güzellik & Bakım' : 'Beauty & Care',
      score: 87,
      growth: '+170%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '7 gün' : '7 days',
      reason: lang === 'tr' ? 'Gua Sha ve lenfatik drenaj yüz masajı rehberleri hızla yükseliyor.' : 'Gua Sha face sculpting routines rising on YouTube.',
      hook: lang === 'tr' ? 'Yüz ödemini 5 dakikada atan doğal Gua Sha masaj hareketi!' : 'Ditch face bloat in 5 mins with this Gua Sha move!',
      angles: lang === 'tr' ? ['Gua Sha teknikleri', 'Gece yağı seçimi', 'Lenfatik drenaj'] : ['Gua Sha techniques', 'Night oil selection', 'Lymphatic drainage']
    },
    {
      id: 19,
      name: lang === 'tr' ? 'Biberiye Yağı İle Saç Gürleştirme' : 'Rosemary Oil Hair Growth Routine',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Güzellik & Bakım' : 'Beauty & Care',
      score: 94,
      growth: '+315%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '4 gün' : '4 days',
      reason: lang === 'tr' ? 'Doğal saç bakım tonikleri ve biberiye suyu tarifleri viral.' : 'Rosemary hair water tutorials booming on TikTok.',
      hook: lang === 'tr' ? 'Dökülen ve ince telli saçlar için ev yapımı biberiye suyu toniği!' : 'DIY rosemary water for hair density & shine!',
      angles: lang === 'tr' ? ['Biberiye kaynatma', 'Dipten uca uygulama', 'Haftalık rutin'] : ['Boiling rosemary', 'Scalp massage', 'Weekly routine']
    },
    {
      id: 20,
      name: lang === 'tr' ? 'Dudak Nemlendirme & Lip Combo' : 'Hydrating Everyday Lip Combo',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Güzellik & Bakım' : 'Beauty & Care',
      score: 89,
      growth: '+195%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '5 gün' : '5 days',
      reason: lang === 'tr' ? 'Doğal dudak kalemi ve gloss kombinasyonları Reels kaydetmelerinde üst sırada.' : 'Natural lip liner & gloss pairing reels trending.',
      hook: lang === 'tr' ? 'Doğal ve dolgun görünen 2 ürünlü günlük lip combo kombini!' : 'The 2-product lip combo for everyday plump lips!',
      angles: lang === 'tr' ? ['Dudak kalemi tonu', 'Gloss parlaklığı', 'Peeling hazırlığı'] : ['Liner shade', 'Gloss finish', 'Lip prep']
    },

    // Moda & Stil (5)
    {
      id: 21,
      name: lang === 'tr' ? '90lar Fönlü Saç Şekillendirme Modeli' : '90s Blowout Hair Styling',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Moda & Stil' : 'Fashion & Style',
      score: 90,
      growth: '+210%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '2 gün' : '2 days',
      reason: lang === 'tr' ? 'Retro 90\'lar saç hacimlendirme videoları Reels keşfetinde yayılıyor.' : '90s voluminous blowout tutorials trending on Reels.',
      hook: lang === 'tr' ? 'Kuaföre gitmeden evde 90\'lar hacimli fönü nasıl çekilir?' : 'How to get 90s salon volume at home without heat damage!',
      angles: lang === 'tr' ? ['Yuvarlak fırça tekniği', 'Hacim spreyi önerisi', 'Bigudi sarma'] : ['Round brush technique', 'Volume spray', 'Roller tutorial']
    },
    {
      id: 22,
      name: lang === 'tr' ? 'Minimalist Kapsül Gardırop Trendi' : 'Minimalist Capsule Wardrobe',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Moda & Stil' : 'Fashion & Style',
      score: 89,
      growth: '+185%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '4 gün' : '4 days',
      reason: lang === 'tr' ? 'Az parçayla çok kombin üretme stili TikTok kıyafet ilhamlarında popüler.' : 'Styling 10 pieces into 30 outfits trending.',
      hook: lang === 'tr' ? 'Sadece 10 temel parçayla 30 farklı kombin oluşturma rehberi!' : '10 items, 30 outfits: The capsule wardrobe challenge!',
      angles: lang === 'tr' ? ['Nötr renk seçimi', 'Zamansız ceketler', 'Aksesuar dokunuşları'] : ['Neutral palette', 'Timeless blazers', 'Accessory touches']
    },
    {
      id: 23,
      name: lang === 'tr' ? 'Sonbahar Kombinleri & Renk Uyumu' : 'Fall Layering Outfit Pairings',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Moda & Stil' : 'Fashion & Style',
      score: 86,
      growth: '+150%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '8 gün' : '8 days',
      reason: lang === 'tr' ? 'Mevsim geçişi kombin ilhamları YouTube Shorts alanında izleniyor.' : 'Seasonal transition outfits gaining views.',
      hook: lang === 'tr' ? 'Bu sezonun trend renklerini gardırobunuza nasıl adapte edersiniz?' : 'How to style trending seasonal colors effortlessly!',
      angles: lang === 'tr' ? ['Toprak tonları', 'Katmanlı giyim (Layering)', 'Ayakkabı eşleştirmeleri'] : ['Earth tones', 'Layering guide', 'Shoe pairing']
    },
    {
      id: 24,
      name: lang === 'tr' ? 'Eski Kıyafetleri Dönüştürme (Upcycling)' : 'Thrift Flip & Upcycling DIY',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Moda & Stil' : 'Fashion & Style',
      score: 88,
      growth: '+175%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '6 gün' : '6 days',
      reason: lang === 'tr' ? 'Giyilmeyen eski kot ve tişörtleri dönüştürme projeleri ilgi çekiyor.' : 'Upcycling old denim into new pieces trending.',
      hook: lang === 'tr' ? 'Giyilmeyen eski kot pantolondan çanta yapma kendin yap projesi!' : 'Flipping an old oversized shirt into a 2-piece set!',
      angles: lang === 'tr' ? ['Kumaş kesimi', 'Dikişsiz yapıştırma', 'Sokak stili'] : ['Fabric cutting', 'No-sew hacks', 'Streetwear style']
    },
    {
      id: 25,
      name: lang === 'tr' ? 'Ayakkabı Bakımı & Beyaz Sneaker Temizliği' : 'White Sneaker Cleaning Hacks',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Moda & Stil' : 'Fashion & Style',
      score: 84,
      growth: '+135%',
      lifecycle: lang === 'tr' ? 'Doyuma Ulaşıyor' : 'Maturing',
      remainingDays: lang === 'tr' ? '2 gün' : '2 days',
      reason: lang === 'tr' ? 'Sararmış ayakkabı tabanı beyazlatma yöntemleri kaydediliyor.' : 'Restoring yellowed sneaker soles reels trending.',
      hook: lang === 'tr' ? 'Sararmış tabanları sıfır gibi yapay 3 malzemeli temizlik kürü!' : 'How to make beat-up white sneakers look brand new!',
      angles: lang === 'tr' ? ['Karbonat sirke ikilisi', 'Fırçalama tekniği', 'Koruyucu sprey'] : ['Baking soda mix', 'Brush technique', 'Protective spray']
    },

    // Finans & İş (5)
    {
      id: 26,
      name: lang === 'tr' ? 'Pasif Gelir Kaynakları & Bütçeleme' : 'Passive Income & Budgeting',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Finans & İş' : 'Finance & Business',
      score: 95,
      growth: '+320%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '9 gün' : '9 days',
      reason: lang === 'tr' ? 'Finansal okuryazarlık ve bütçeleme rehberleri üst sıralarda.' : 'Personal finance & budgeting guides surging.',
      hook: lang === 'tr' ? '20\'li yaşlarda finansal özgürlük için uyguladığım 3 bütçe kuralı!' : '3 money rules I followed in my 20s for financial freedom!',
      angles: lang === 'tr' ? ['50/30/20 bütçe kuralı', 'Yatırım fonu başlangıcı', 'Otomatik birikim'] : ['50/30/20 budget rule', 'Index fund basics', 'Automated savings']
    },
    {
      id: 27,
      name: lang === 'tr' ? 'Freelancer İçin Fiyatlandırma Stratejisi' : 'Freelance Pricing Strategy',
      platform: 'Instagram',
      category: lang === 'tr' ? 'Finans & İş' : 'Finance & Business',
      score: 89,
      growth: '+205%',
      lifecycle: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating',
      remainingDays: lang === 'tr' ? '6 gün' : '6 days',
      reason: lang === 'tr' ? 'Serbest çalışanlar için değer bazlı fiyatlama ve müşteri edinme tüyoları.' : 'Value-based pricing reels trending for creators.',
      hook: lang === 'tr' ? 'Müşterilere düşük teklif vermeyi bırakın: Saatlik ücret nasıl belirlenir?' : 'Stop undercharging clients: How to set high freelance rates!',
      angles: lang === 'tr' ? ['Değer bazlı fiyatlama', 'Sözleşme hazırlığı', 'Müşteri görüşmesi'] : ['Value-based pricing', 'Contract prep', 'Client calls']
    },
    {
      id: 28,
      name: lang === 'tr' ? 'Genç Girişimciler İçin 3 Nakit Akışı Kuralı' : '3 Cash Flow Rules for Founders',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Finans & İş' : 'Finance & Business',
      score: 87,
      growth: '+175%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '3 gün' : '3 days',
      reason: lang === 'tr' ? 'Girişimcilik ve iş fikri tavsiyeleri TikTok iş dünyasında ivmeli.' : 'Startup cash flow tips trending on business TikTok.',
      hook: lang === 'tr' ? 'İlk işinizi kurarken paranızı çöpe atmamanızı sağlayacak 3 finansal öğüt...' : '3 money lessons before starting your first business...',
      angles: lang === 'tr' ? ['Minimum harcama MVP', 'Acil durum fonu', 'Vergi takibi'] : ['Lean MVP budget', 'Emergency runway', 'Tax tracking']
    },
    {
      id: 29,
      name: lang === 'tr' ? 'Kripto & Web3 Temel Yatırım Mantığı' : 'Crypto & Web3 Investing Basics',
      platform: 'YouTube',
      category: lang === 'tr' ? 'Finans & İş' : 'Finance & Business',
      score: 86,
      growth: '+160%',
      lifecycle: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal',
      remainingDays: lang === 'tr' ? '8 gün' : '8 days',
      reason: lang === 'tr' ? 'Risk yönetimi yaparak kripto piyasasını okuma rehberi.' : 'Risk management crypto guide gaining views.',
      hook: lang === 'tr' ? 'Risk yönetimi yaparak kripto piyasasını güvenle okuma rehberi!' : 'Crypto investing rules for beginners without panic selling!',
      angles: lang === 'tr' ? ['DCA kademeli alım', 'Soğuk cüzdan güvenliği', 'Proje analizi'] : ['DCA strategy', 'Cold storage security', 'Whitepaper review']
    },
    {
      id: 30,
      name: lang === 'tr' ? 'E-Ticaret Ürün Bulma & Dropshipping 2026' : 'E-Commerce Product Research 2026',
      platform: 'TikTok',
      category: lang === 'tr' ? 'Finans & İş' : 'Finance & Business',
      score: 92,
      growth: '+270%',
      lifecycle: lang === 'tr' ? 'Zirvede' : 'Peak',
      remainingDays: lang === 'tr' ? '4 gün' : '4 days',
      reason: lang === 'tr' ? 'E-ticarette yüksek kar marjlı ürün araştırma tüyoları.' : 'High margin product research videos trending.',
      hook: lang === 'tr' ? '2026\'da en yüksek kar marjına sahip 3 kazançlı e-ticaret nişi!' : '3 winning e-commerce niches with high margins in 2026!',
      angles: lang === 'tr' ? ['Tedarikçi seçimi', 'Viral ürün reklamı', 'Kargo süreçleri'] : ['Supplier vetting', 'Viral ad hooks', 'Fulfillment tips']
    }
  ];

  const handleConnect = (platform) => {
    // Limits connection on Starter Plan (Max 1 account)
    if (userPlan === 'Starter Plan' && platform !== 'tiktok') {
      handleOpenUpgrade('Professional Plan', '500₺');
      return;
    }
    setConnectedChannels(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleGenerateScript = (trendName) => {
    if (userPlan === 'Starter Plan' && aiCredits <= 0) {
      handleOpenUpgrade('Professional Plan', '500₺');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setStudioOutput({
        trend: trendName,
        angles: lang === 'tr' ? [
          'Kişisel deneyim ve ilk tepki odaklı anlatım.',
          'Adım adım eğitici rehber formatı.',
          'Hızlı tempolu, mizahi ve akıcı kurgu.'
        ] : [
          'Personal experience and reaction first.',
          'Step-by-step educational guide.',
          'Fast-paced, humorous cut pattern.'
        ],
        hook: lang === 'tr' ? 'İşte sosyal medyada herkesin konuştuğu o trendin arkasındaki gerçek sırlar...' : 'Here is the real secret behind that trend everyone is talking about...',
        script: lang === 'tr' ? [
          { scene: 'Sahne 1 (0-3s)', description: 'Yakın çekim kamera açısı, şaşırmış yüz ifadesi. Ekranda büyük başlık yazar.', voice: 'Sosyal medyada herkes bunu yapıyor ama kimse asıl sırrını söylemiyor!' },
          { scene: 'Sahne 2 (3-15s)', description: 'Kameraya dönük anlatım, arkada hızlı kesmelerle adımların gösterilmesi.', voice: 'İlk olarak bu adımı uyguluyoruz. Çoğu insan burada hata yapıyor çünkü...' },
          { scene: 'Sahne 3 (15-30s)', description: 'Sonucun gösterilmesi, şık bir bitiş ekranı, takip etme çağrısı.', voice: 'Ve sonuç işte bu! Siz bu konuda ne düşünüyorsunuz? Yorumlarda buluşalım.' }
        ] : [
          { scene: 'Scene 1 (0-3s)', description: 'Close-up camera, surprised facial expression. Big title overlays text on screen.', voice: 'Everyone is doing this on socials, but no one reveals the actual trick!' },
          { scene: 'Scene 2 (3-15s)', description: 'Speaking to camera, quick cuts displaying steps in background.', voice: 'First, we do this specific step. Most people fail here because...' },
          { scene: 'Scene 3 (15-30s)', description: 'Show the final result, smooth wrap-up screen with call to action.', voice: 'And here is the final output! What do you think about it? Meet me in the comments.' }
        ],
        voiceover: lang === 'tr' ? 'Sosyal medyada herkes bunu yapıyor ama kimse asıl sırrını söylemiyor! İlk olarak bu adımı uyguluyoruz. Çoğu insan burada hata yapıyor çünkü... Ve sonuç işte bu! Siz bu konuda ne düşünüyorsunuz? Yorumlarda buluşalım.' : 'Everyone is doing this on socials, but no one reveals the actual trick! First, we do this specific step. Most people fail here because... And here is the final output! What do you think about it? Meet me in the comments.',
        description: lang === 'tr' ? 'Bu trendi uygulayarak hazırladığım video! 🚀 #SosyalMedya #AI #Yaratıcıİçerik #TrendVista' : 'My take on this viral trend! 🚀 #SocialMedia #AI #CreatorHub #TrendVista',
        tags: '#trend #viral #kesfet #yaratıcı #icerikureticisi #AI #TrendVista',
        tips: lang === 'tr' ? 'Videonun ilk 3 saniyesindeki kancayı çok enerjik söyleyin. Arkaya hafif tempolu viral bir ses ekleyin.' : 'Deliver the first 3 seconds hook with extreme energy. Add a trending background beat.',
        seoHashtags: [
          { tag: '#trendlab', volume: '1.2M', competition: lang === 'tr' ? 'Düşük' : 'Low' },
          { tag: '#viralcontent', volume: '850K', competition: lang === 'tr' ? 'Orta' : 'Medium' },
          { tag: '#skincarehacks', volume: '2.4M', competition: lang === 'tr' ? 'Yüksek' : 'High' },
          { tag: '#foryou', volume: '15.8M', competition: lang === 'tr' ? 'Yüksek' : 'High' }
        ],
        seoKeywords: [
          { keyword: lang === 'tr' ? 'salyangoz özü kullananlar' : 'snail mucin routine', volume: '450K', competition: lang === 'tr' ? 'Düşük' : 'Low' },
          { keyword: lang === 'tr' ? 'doğal cilt parlatma' : 'natural glowing skin tips', volume: '620K', competition: lang === 'tr' ? 'Orta' : 'Medium' },
          { keyword: lang === 'tr' ? 'en viral akımlar' : 'viral tiktok trends', volume: '1.1M', competition: lang === 'tr' ? 'Yüksek' : 'High' }
        ]
      });

      if (userPlan === 'Starter Plan' && aiCredits > 0) {
        setAiCredits(prev => prev - 1);
      }
      setGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const exportScriptAsMarkdown = () => {
    if (!studioOutput) return;
    const text = `# TrendVista AI Script - Trend: ${studioOutput.trend}
Tone of Voice: ${selectedTone}

## Gold Hook
${studioOutput.hook}

## Script Outline & Scene Flow
${studioOutput.script.map((scene) => `### ${scene.scene}
- Visual Cues: ${scene.description}
- Voiceover: ${scene.voice}`).join('\n\n')}

## Posting Metadata
- Description: ${studioOutput.description}
- Tags: ${studioOutput.tags}

## Shooting & Editing Tips
${studioOutput.tips}
`;
    exportToMarkdown({ filename: `${studioOutput.trend}_senaryo`, content: text });
  };

  const handleScoreIdea = (e) => {
    e.preventDefault();
    if (!customIdea.trim()) return;

    setPredicting(true);
    setTimeout(() => {
      const ideaLen = customIdea.length;
      const hookScore = Math.min(65 + (ideaLen % 25) + (customIdea.includes('?') ? 10 : 0) + (customIdea.includes('!') ? 5 : 0), 99);
      const viralScore = Math.min(60 + (ideaLen % 30) + (customIdea.length > 50 ? 8 : 0), 98);
      const audienceScore = Math.min(70 + (ideaLen % 20), 96);

      const retentionData = [
        100,
        Math.max(75, hookScore - 5),
        Math.max(50, Math.floor(hookScore * 0.7)),
        Math.max(35, Math.floor(hookScore * 0.5)),
        Math.max(25, Math.floor(hookScore * 0.4))
      ];

      setPredictorResult({
        hook: hookScore,
        viral: viralScore,
        audience: audienceScore,
        retention: retentionData
      });
      setPredicting(false);

      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }, 1200);
  };

  const handleOpenUpgrade = (name, price) => {
    if (onIyzicoCheckout) {
      onIyzicoCheckout(name);
    } else {
      setCheckoutPlan({ name, price, period: lang === 'tr' ? '/ay' : '/month' });
      setPaymentStep('form');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentStep('loading');
    setTimeout(() => {
      setPaymentStep('success');
      setUserPlan(checkoutPlan.name);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const currentPlan = userPlan || 'Professional Plan';
  const isStarter = currentPlan === 'Starter Plan';

  return (
    <div className={`workspace-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Sidebar */}
      <aside className="workspace-sidebar">
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
            <Crown size={10} />
            {userPlan}
          </span>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: '800' }}>{t[lang].sidebarTitle}</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

          {/* Section: Üretim */}
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem 0.1rem 0.5rem' }}>
            🚀 {isTr ? 'Üretim & İçerik' : 'Creation & Content'}
          </span>

          <button
            onClick={() => { setActiveTab('dashboard'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'dashboard' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'dashboard' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'dashboard' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <TrendingUp size={16} style={{ color: activeTab === 'dashboard' ? 'var(--color-secondary)' : 'inherit' }} /> {t[lang].tabDashboard}
          </button>

          <button
            onClick={() => { setActiveTab('studio'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'studio' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'studio' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'studio' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'studio' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'studio' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} style={{ color: activeTab === 'studio' ? 'var(--color-secondary)' : 'inherit' }} /> {t[lang].tabStudio}
          </button>

          <button
            onClick={() => { setActiveTab('calendar'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'calendar' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'calendar' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'calendar' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'calendar' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'calendar' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: '0.35rem' }}>🗓️</span> {lang === 'tr' ? 'İçerik Takvimi' : 'Content Calendar'}
          </button>

          <button
            onClick={() => { setActiveTab('hooks'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'hooks' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'hooks' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'hooks' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'hooks' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'hooks' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: '0.35rem' }}>📚</span> {lang === 'tr' ? 'Viral Kanca Bankası' : 'Viral Hook Bank'}
          </button>

          <button
            onClick={() => { setActiveTab('audio'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'audio' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'audio' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'audio' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'audio' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'audio' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <Music size={16} style={{ color: activeTab === 'audio' ? 'var(--color-secondary)' : 'inherit' }} /> {lang === 'tr' ? 'Viral Ses Laboratuvarı' : 'Viral Audio Lab'}
          </button>

          {/* Section: Analitik & Yönetim */}
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.6rem 0.5rem 0.1rem 0.5rem' }}>
            📊 {isTr ? 'Analitik & İş Yönetimi' : 'Analytics & Business'}
          </span>

          <button
            onClick={() => { setActiveTab('analytics'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'analytics' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'analytics' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'analytics' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart2 size={16} style={{ color: activeTab === 'analytics' ? 'var(--color-secondary)' : 'inherit' }} /> {lang === 'tr' ? 'İçerik Analitiği' : 'Content Analytics'}
          </button>

          <button
            onClick={() => { setActiveTab('inbox'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'inbox' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'inbox' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'inbox' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'inbox' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'inbox' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={16} style={{ color: activeTab === 'inbox' ? 'var(--color-secondary)' : 'inherit' }} /> {lang === 'tr' ? 'Teklifler & Mesajlar' : 'Deals & Messages'}
          </button>

          <button
            onClick={() => { setActiveTab('channels'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'channels' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'channels' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'channels' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'channels' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'channels' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <Link2 size={16} style={{ color: activeTab === 'channels' ? 'var(--color-secondary)' : 'inherit' }} /> {t[lang].tabChannels}
          </button>

          <button
            onClick={() => { setActiveTab('saved'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'saved' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.12) 100%)' : 'transparent',
              color: activeTab === 'saved' ? '#f59e0b' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'saved' ? '4px solid #f59e0b' : '4px solid transparent',
              boxShadow: activeTab === 'saved' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'saved' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: '0.35rem' }}>⭐</span> {lang === 'tr' ? 'Favori Trendler' : 'Saved Trends'} ({savedTrends.length})
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setSelectedTrend(null); }}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'settings' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'settings' ? '4px solid var(--color-secondary)' : '4px solid transparent',
              boxShadow: activeTab === 'settings' ? '0 4px 12px rgba(0, 210, 255, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'settings' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: '0.35rem' }}>⚙️</span> {lang === 'tr' ? 'Profil & Ayarlar' : 'Profile & Settings'}
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="workspace-content">

        {/* Upgrade alert banner */}
        {isStarter && activeTab === 'dashboard' && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'rgba(0, 210, 255, 0.05)', borderColor: 'rgba(0, 210, 255, 0.2)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Crown size={18} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t[lang].upgradeBanner}</span>
            </div>
            <button onClick={() => handleOpenUpgrade('Professional Plan', '500₺')} className="btn btn-glow-cyan" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>
              {t[lang].upgradeBtn}
            </button>
          </div>
        )}

        {!isStarter && activeTab === 'dashboard' && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Crown size={18} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-success)', fontWeight: '600' }}>{t[lang].premiumActive}</span>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && !selectedTrend && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].dashboardTitle}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].dashboardSub}</p>
              </div>
              <span className="badge badge-success">{t[lang].statusActive}</span>
            </div>

            {/* Quick Stat Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].statConnected}</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', marginTop: '0.25rem' }}>
                  {Object.values(connectedChannels).filter(Boolean).length} / {isStarter ? 1 : 3}
                </h3>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].statCategory}</span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', marginTop: '0.25rem' }}>{t[lang].statCategoryValue}</h3>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].statSaved}</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', marginTop: '0.25rem' }}>8 Aktif</h3>
              </div>
            </div>

            {/* Webhook Alert Banner */}
            {webhookAlert && (
              <div className="glass-card" style={{
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                marginBottom: '1.5rem',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                animation: 'float 0.5s ease-in-out infinite alternate'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Radio size={20} style={{ color: '#ef4444' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171', display: 'block' }}>
                      {webhookAlert.message}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {lang === 'tr' ? 'Canlı Webhook Olayı Alındı' : 'Live Webhook Event Received'} • {webhookAlert.timestamp}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setWebhookAlert(null)}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Live API & Webhook Control Bar */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Radio size={18} style={{ color: '#ef4444' }} />
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {lang === 'tr' ? 'Canlı Sosyal Medya API Akışı' : 'Live Social Media API Stream'}
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{liveApiStatus.source}</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {lang === 'tr' ? 'Son Güncelleme:' : 'Last Synced:'} {liveApiStatus.timestamp || 'Anlık'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Country Selector */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-secondary)', color: 'var(--color-text)', cursor: 'pointer' }}
                  >
                    <option value="TR">🇹🇷 Türkiye</option>
                    <option value="US">🇺🇸 ABD (United States)</option>
                    <option value="DE">🇩🇪 Almanya (Germany)</option>
                    <option value="GB">🇬🇧 İngiltere (UK)</option>
                  </select>

                  <button
                    onClick={() => loadTrends(platformFilter, selectedRegion)}
                    disabled={liveApiStatus.loading}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={14} className={liveApiStatus.loading ? 'spin' : ''} />
                    {lang === 'tr' ? 'Canlı Yenile' : 'Refresh Live'}
                  </button>

                  <button
                    onClick={() => triggerDemoWebhookSpike(platformFilter, lang)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Zap size={14} />
                    {lang === 'tr' ? 'Webhook Test Et' : 'Test Webhook'}
                  </button>
                </div>
              </div>

              {/* Platform Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { key: 'all', label: lang === 'tr' ? '🌐 Tüm Platformlar' : '🌐 All Platforms' },
                  { key: 'TikTok', label: '🎵 TikTok Trendleri' },
                  { key: 'Instagram', label: '📸 Instagram Reels' },
                  { key: 'YouTube', label: '▶️ YouTube Shorts/Popular' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatformFilter(p.key)}
                    className={`btn ${platformFilter === p.key ? 'btn-glow-cyan' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '20px' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Category Personalization Filter Chips */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', marginRight: '0.2rem' }}>
                  🎯 {lang === 'tr' ? 'Kategori Radar:' : 'Niche Radar:'}
                </span>
                {[
                  { key: 'all', label: lang === 'tr' ? 'Tüm İlgiler' : 'All Niches' },
                  { key: 'güzellik', label: '💄 Güzellik & Bakım' },
                  { key: 'moda', label: '👗 Moda & Stil' },
                  { key: 'teknoloji', label: '💻 Teknoloji' },
                  { key: 'eğitim', label: '📚 Eğitim & Verimlilik' },
                  { key: 'yeme', label: '🍕 Yeme & İçme' },
                  { key: 'finans', label: '📈 Finans & İş' }
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategoryFilter(c.key)}
                    style={{
                      padding: '0.28rem 0.65rem',
                      fontSize: '0.72rem',
                      borderRadius: '16px',
                      border: categoryFilter === c.key ? '1px solid var(--color-secondary)' : '1px solid rgba(255,255,255,0.08)',
                      background: categoryFilter === c.key ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.03)',
                      color: categoryFilter === c.key ? 'var(--color-secondary)' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      fontWeight: categoryFilter === c.key ? '700' : '400',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '1.25rem' }}>{t[lang].matchTitle}</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {((liveTrends.length > 0 ? liveTrends : creatorTrends).filter(t => {
                if (categoryFilter === 'all') return true;
                const c = (t.category || '').toLowerCase();
                const f = categoryFilter.toLowerCase();
                const matchMap = {
                  'güzellik': ['güzellik', 'beauty', 'care', 'bakım', 'kozmetik'],
                  'moda': ['moda', 'fashion', 'style', 'stil'],
                  'teknoloji': ['teknoloji', 'tech', 'ai'],
                  'yeme': ['yeme', 'içme', 'food', 'drink', 'gastronomi'],
                  'eğitim': ['eğitim', 'verimlilik', 'education', 'productivity'],
                  'finans': ['finans', 'iş', 'finance', 'business']
                };
                const allowedKeywords = matchMap[f] || [f];
                return allowedKeywords.some(kw => c.includes(kw));
              })).map((trend, index) => {
                // Lock tech/fashion categories on Starter Plan
                const isLocked = isStarter && index > 0;
                const trendTitle = trend.name || trend.title || 'Viral Social Trend';
                return (
                  <div
                    key={trend.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem 1.75rem',
                      borderRadius: '16px',
                      background: 'rgba(15, 22, 43, 0.85)',
                      border: '1px solid rgba(0, 210, 255, 0.18)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      opacity: isLocked ? 0.65 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header Row: Badges, Title, Metrics & Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            background: trend.platform === 'TikTok' ? 'rgba(255, 255, 255, 0.1)' : trend.platform === 'Instagram' ? 'rgba(225, 48, 108, 0.2)' : 'rgba(255, 0, 0, 0.18)',
                            color: trend.platform === 'TikTok' ? '#e2e8f0' : trend.platform === 'Instagram' ? '#f472b6' : '#f87171',
                            fontWeight: '700'
                          }}>
                            {trend.platform}
                          </span>
                          <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                            {trend.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: '800', background: 'rgba(74, 222, 128, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                            🔥 {trend.growth || `+${trend.score * 3}%`}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.12rem', color: '#ffffff', fontWeight: '800', margin: '0 0 0.25rem 0', lineHeight: '1.3' }}>
                          {trendTitle}
                          {isLocked && <Lock size={14} style={{ color: 'var(--color-accent)', marginLeft: '0.4rem' }} />}
                        </h4>
                      </div>

                      {/* Metrics & Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{t[lang].matchScoreLabel}</span>
                          <span style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <TrendingUp size={15} /> {trend.score}%
                          </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{t[lang].lifecycleLabel}</span>
                          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '700' }}>
                            {trend.lifecycle} <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)' }}>({trend.remainingDays})</span>
                          </span>
                        </div>

                        {isLocked ? (
                          <button
                            onClick={() => handleOpenUpgrade('Professional Plan', '500₺')}
                            className="btn btn-secondary"
                            style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                          >
                            Kilitli <Lock size={12} />
                          </button>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleToggleBookmark({ id: trend.id, title: trendTitle, category: trend.category, growth: trend.growth || `+${trend.score * 3}%` })}
                              className="btn btn-secondary"
                              style={{
                                padding: '0.45rem',
                                color: savedTrends.some(t => t.title === trendTitle) ? '#f59e0b' : 'var(--color-text-muted)',
                                borderColor: savedTrends.some(t => t.title === trendTitle) ? 'rgba(245, 158, 11, 0.4)' : 'var(--color-border)'
                              }}
                              title={lang === 'tr' ? 'Favorilere Ekle' : 'Bookmark Trend'}
                            >
                              <Star size={15} fill={savedTrends.some(t => t.title === trendTitle) ? '#f59e0b' : 'none'} />
                            </button>
                            <button
                              onClick={() => setSelectedTrend(trend)}
                              className="btn btn-glow-cyan"
                              style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              {t[lang].examineBtn} <ChevronRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reason & Hook Info Row */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.4' }}>
                        <strong style={{ color: 'var(--color-secondary)' }}>💡 {lang === 'tr' ? 'Neden Yükseliyor?' : 'Why Rising?'} </strong>
                        {trend.reason || (lang === 'tr' ? 'Bu trend sosyal medya algoritmasında yüksek izlenme oranıyla ivme kazandı.' : 'Flagged with high engagement by algorithm.')}
                      </div>
                      {trend.hook && (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                          <strong style={{ color: '#f59e0b', fontStyle: 'normal' }}>🎬 {lang === 'tr' ? 'Önerilen Kanca:' : 'Suggested Hook:'} </strong>
                          "{trend.hook}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 1 DETAIL VIEW: TREND DETAIL */}
        {activeTab === 'dashboard' && selectedTrend && (
          <div>
            <button
              onClick={() => setSelectedTrend(null)}
              className="btn btn-secondary"
              style={{ marginBottom: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={14} /> {lang === 'tr' ? 'Geri' : 'Back'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Trend Main Info */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="badge badge-cyan">{selectedTrend.platform}</span>
                  <span className="badge badge-blue">{selectedTrend.category}</span>
                </div>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{selectedTrend.name}</h2>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <Info size={16} style={{ color: 'var(--color-secondary)' }} />
                    {t[lang].whyRising}
                  </h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {selectedTrend.reason}
                  </p>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].anglesTitle}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {selectedTrend.angles.map((angle, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ background: 'var(--color-primary)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>{idx + 1}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{angle}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      setStudioTrend(selectedTrend.name);
                      setActiveTab('studio');
                      handleGenerateScript(selectedTrend.name);
                    }}
                    className="btn btn-primary"
                  >
                    {t[lang].sendToStudioBtn} <Sparkles size={16} />
                  </button>
                  <button className="btn btn-secondary">{t[lang].setAlertBtn}</button>
                </div>
              </div>

              {/* Trend Analytics Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1.25rem' }}>{t[lang].lifecycleTitle}</h3>

                  {/* Visual Timeline representation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', position: 'relative', padding: '0 0.5rem' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '0', width: '100%', height: '2px', background: 'rgba(255,255,255,0.08)', zIndex: '0' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '0', width: selectedTrend.lifecycle.includes('Zirve') || selectedTrend.lifecycle.includes('Peak') ? '60%' : selectedTrend.lifecycle.includes('Hız') || selectedTrend.lifecycle.includes('Acc') ? '40%' : '20%', height: '2px', background: 'var(--color-secondary)', zIndex: '0' }} />

                    {t[lang].lifecycleStages.map((step, idx) => {
                      const isActive = (idx === 0 && (selectedTrend.lifecycle.includes('Sinyal') || selectedTrend.lifecycle.includes('Signal'))) ||
                        (idx === 1 && (selectedTrend.lifecycle.includes('Hız') || selectedTrend.lifecycle.includes('Acc'))) ||
                        (idx === 2 && (selectedTrend.lifecycle.includes('Zirve') || selectedTrend.lifecycle.includes('Peak')));
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: '1' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: isActive ? 'var(--color-secondary)' : 'var(--bg-secondary)',
                            border: isActive ? '4px solid rgba(0, 210, 255, 0.3)' : '2px solid rgba(255,255,255,0.1)',
                            marginBottom: '0.5rem'
                          }} />
                          <span style={{ fontSize: '0.75rem', color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: isActive ? 'bold' : 'normal' }}>{step}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{t[lang].lifecycleRemaining}</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{selectedTrend.remainingDays}</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].matchFactorsTitle}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div>
                      <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span>{t[lang].factorCategory}</span>
                        <span>%95</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: '95%', height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span>{t[lang].factorAudience}</span>
                        <span>%88</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: '88%', height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span>{t[lang].factorFormat}</span>
                        <span>%90</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: '90%', height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI CONTENT STUDIO */}
        {activeTab === 'studio' && (
          <div>
            {userPlan === 'Free Plan' ? (
              <div className="glass-card animate-float" style={{ padding: '5rem 2rem', textAlign: 'center', border: '1px solid rgba(0, 210, 255, 0.25)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
                  <Lock size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                  {lang === 'tr' ? 'AI İçerik Stüdyosu Kilitli' : 'AI Content Studio Locked'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                  {lang === 'tr'
                    ? 'AI ile saniyeler içerisinde viral video senaryoları, kancalar (hooks) ve sahne planları üretmek için hesabınızı yükseltin!'
                    : 'Upgrade your subscription to unlock AI script generation, gold hooks, and multi-platform video frameworks instantly!'}
                </p>
                <button onClick={() => setUserPlan(null)} className="btn btn-primary" style={{ padding: '0.65rem 2.5rem' }}>
                  {lang === 'tr' ? 'Şimdi Yükselt' : 'Upgrade Now'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].studioTitle}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].studioSub}</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].studioSelectTitle}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                    <select
                      value={studioTrend}
                      onChange={(e) => setStudioTrend(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'rgba(5, 8, 17, 0.8)',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="">{t[lang].selectPlaceholder}</option>
                      {creatorTrends.filter((_, idx) => !isStarter || idx === 0).map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.platform})</option>
                      ))}
                    </select>

                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'rgba(5, 8, 17, 0.8)',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="energetic">🔥 {lang === 'tr' ? 'Enerjik & Dinamik' : 'Energetic & Dynamic'}</option>
                      <option value="mysterious">👁️ {lang === 'tr' ? 'Gizemli & Meraklı' : 'Mysterious & Curious'}</option>
                      <option value="educational">🎓 {lang === 'tr' ? 'Eğitici & Analitik' : 'Educational & Analytical'}</option>
                      <option value="humorous">🎭 {lang === 'tr' ? 'Mizahi & Samimi' : 'Humorous & Warm'}</option>
                      <option value="minimalist">🌿 {lang === 'tr' ? 'Minimalist & ASMR' : 'Minimalist & ASMR'}</option>
                    </select>

                    <button
                      onClick={() => handleGenerateScript(studioTrend)}
                      disabled={!studioTrend || generating || (isStarter && aiCredits <= 0)}
                      className="btn btn-glow-cyan"
                      style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem' }}
                    >
                      {generating ? '...' : t[lang].generateBtn} <Sparkles size={16} />
                    </button>
                  </div>

                  {isStarter && aiCredits <= 0 && (
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '600' }}>
                      {t[lang].limitWarning}
                    </p>
                  )}
                </div>

                {/* AI STUDIO SIMULATION OUTPUT */}
                {generating && (
                  <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0, 210, 255, 0.1)', borderTopColor: 'var(--color-secondary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
                    <h4 style={{ color: 'var(--color-text-muted)' }}>{t[lang].generatingMsg}</h4>
                  </div>
                )}

                {!generating && studioOutput && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Left: Script, Hooks Lab and Scene Flow */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                      {/* Hooks Lab (A/B testing) */}
                      <div className="glass-card animate-float" style={{ padding: '1.75rem', border: '1px solid rgba(0, 210, 255, 0.2)', animation: 'none' }}>
                        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Sparkles size={18} color="var(--color-secondary)" /> 🧪 AI Hook Lab (A/B Test)
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                              {lang === 'tr' ? 'Videonuzun izlenme tutma oranını artıran farklı kancaları test edin.' : 'A/B test hook formats built to optimize viewer retention rates.'}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowHookLab(!showHookLab)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            {showHookLab ? (lang === 'tr' ? 'Kapat' : 'Hide') : (lang === 'tr' ? 'Detayları Aç' : 'Expand Lab')}
                          </button>
                        </div>

                        {showHookLab && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {studioOutput.hooks?.map((hk, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '1rem',
                                  borderRadius: '8px',
                                  background: activeHookIdx === idx ? 'rgba(0, 210, 255, 0.08)' : 'rgba(5, 8, 17, 0.6)',
                                  border: activeHookIdx === idx ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div>
                                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: activeHookIdx === idx ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}>
                                      {hk.type}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)' }}>
                                      {hk.score} ROI
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.4', marginBottom: '1rem' }}>
                                    "{hk.text}"
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveHookIdx(idx);
                                    setStudioOutput(prev => {
                                      const updatedScript = [...prev.script];
                                      updatedScript[0] = { ...updatedScript[0], voice: hk.text };
                                      return { ...prev, hook: hk.text, script: updatedScript };
                                    });
                                  }}
                                  className={`btn ${activeHookIdx === idx ? 'btn-glow-cyan' : 'btn-secondary'}`}
                                  style={{ width: '100%', padding: '0.3rem', fontSize: '0.75rem', borderRadius: '6px' }}
                                >
                                  {activeHookIdx === idx ? (lang === 'tr' ? 'Seçildi' : 'Applied') : (lang === 'tr' ? 'Senaryoya Uygula' : 'Apply to Script')}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Main Script Editor Outline */}
                      <div className="glass-card" style={{ padding: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>
                            {t[lang].outlineTitle} <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>(Sandbox Editor)</span>
                          </h3>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => copyToClipboard(studioOutput.voiceover, 'script')}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              {copiedText === 'script' ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />} {t[lang].copyBtn}
                            </button>
                            <button
                              onClick={handleScheduleCurrentScript}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399' }}
                            >
                              🗓️ {lang === 'tr' ? 'Takvime Ekle' : 'Schedule to Calendar'}
                            </button>
                            <button
                              onClick={() => exportScriptToPdf({ studioOutput, selectedTone, lang })}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                            >
                              📄 {lang === 'tr' ? 'PDF Raporu İndir' : 'Download PDF Report'}
                            </button>
                            <button
                              onClick={exportScriptAsMarkdown}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', color: 'var(--color-secondary)' }}
                            >
                              📥 {lang === 'tr' ? 'Dışa Aktar (.md)' : 'Export (.md)'}
                            </button>
                          </div>
                        </div>



                        {/* Editable Hook Input */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                            {t[lang].hookLabel}
                          </span>
                          <textarea
                            value={studioOutput.hook}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStudioOutput(prev => {
                                const updatedScript = [...prev.script];
                                updatedScript[0] = { ...updatedScript[0], voice: val };
                                return { ...prev, hook: val, script: updatedScript };
                              });
                            }}
                            style={{
                              width: '100%',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              background: 'rgba(5, 8, 17, 0.6)',
                              color: 'var(--color-secondary)',
                              fontWeight: '600',
                              fontSize: '1rem',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              lineHeight: '1.5'
                            }}
                            rows={2}
                          />
                        </div>

                        {/* Editable Scenes Inputs */}
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].sceneAkis}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {studioOutput.script?.map((scene, idx) => (
                            <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--color-primary)', borderRadius: '0 8px 8px 0', borderRight: '1px solid rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.65rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', color: 'var(--color-secondary)', fontSize: '0.85rem' }}>{scene.scene}</span>
                                <input
                                  type="text"
                                  value={scene.description}
                                  onChange={(e) => {
                                    const updated = [...studioOutput.script];
                                    updated[idx] = { ...updated[idx], description: e.target.value };
                                    setStudioOutput(prev => ({ ...prev, script: updated }));
                                  }}
                                  style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px dashed rgba(255,255,255,0.15)',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.8rem',
                                    padding: '0.1rem 0.5rem',
                                    outline: 'none',
                                    textAlign: 'right'
                                  }}
                                />
                              </div>
                              <textarea
                                value={scene.voice}
                                onChange={(e) => {
                                  const updated = [...studioOutput.script];
                                  updated[idx] = { ...updated[idx], voice: e.target.value };
                                  setStudioOutput(prev => ({ ...prev, script: updated, voiceover: updated.map(s => s.voice).join(' ') }));
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.6rem',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  background: 'rgba(0,0,0,0.2)',
                                  color: '#fff',
                                  fontSize: '0.9rem',
                                  lineHeight: '1.5',
                                  outline: 'none',
                                  resize: 'vertical',
                                  fontFamily: 'inherit'
                                }}
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tags & Metadata (Editable) & Tips */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].metaTitle}</h3>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].descLabel}</span>
                            <button
                              onClick={() => copyToClipboard(studioOutput.description, 'desc')}
                              className="btn"
                              style={{ background: 'transparent', padding: '0.2rem', color: 'var(--color-text-muted)' }}
                            >
                              {copiedText === 'desc' ? t[lang].copiedMsg : <Copy size={12} />}
                            </button>
                          </div>
                          <textarea
                            value={studioOutput.description}
                            onChange={(e) => setStudioOutput(prev => ({ ...prev, description: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid var(--color-border)',
                              background: 'rgba(0,0,0,0.2)',
                              fontSize: '0.8rem',
                              color: '#fff',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              lineHeight: '1.4'
                            }}
                            rows={3}
                          />
                        </div>

                        <div>
                          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].tagsLabel}</span>
                            <button
                              onClick={() => copyToClipboard(studioOutput.tags, 'tags')}
                              className="btn"
                              style={{ background: 'transparent', padding: '0.2rem', color: 'var(--color-text-muted)' }}
                            >
                              {copiedText === 'tags' ? t[lang].copiedMsg : <Copy size={12} />}
                            </button>
                          </div>
                          <textarea
                            value={studioOutput.tags}
                            onChange={(e) => setStudioOutput(prev => ({ ...prev, tags: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid var(--color-border)',
                              background: 'rgba(0,0,0,0.2)',
                              fontSize: '0.8rem',
                              color: 'var(--color-secondary)',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              lineHeight: '1.4'
                            }}
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* SEO & Hashtag Laboratuvarı card */}
                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                            🏷️ {lang === 'tr' ? 'SEO & Hashtag Laboratuvarı' : 'SEO & Hashtags Lab'}
                          </h3>
                          <button
                            onClick={() => {
                              const tagsStr = (studioOutput.seoHashtags?.map(h => h.tag).join(' ') || '') + ' ' + (studioOutput.seoKeywords?.map(k => k.keyword).join(', ') || '');
                              copyToClipboard(tagsStr, 'seo_lab');
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
                          >
                            {copiedText === 'seo_lab' ? t[lang].copiedMsg : (lang === 'tr' ? 'Kopyala' : 'Copy All')}
                          </button>
                        </div>

                        {/* Hashtags list */}
                        <div style={{ marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                            🔥 {lang === 'tr' ? 'Önerilen Viral Hashtagler' : 'Suggested Viral Hashtags'}
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {studioOutput.seoHashtags?.map((h, idx) => (
                              <div key={idx} style={{ background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.15)', padding: '0.35rem 0.65rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>{h.tag}</span>
                                <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
                                  <span>📊 {h.volume}</span>
                                  <span style={{ color: h.competition === 'Yüksek' || h.competition === 'High' ? 'var(--color-accent)' : h.competition === 'Orta' || h.competition === 'Medium' ? '#ff9f43' : 'var(--color-success)' }}>
                                    🎯 {h.competition}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Search Keywords list */}
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                            🔍 {lang === 'tr' ? 'Popüler Arama Terimleri' : 'Popular Search Keywords'}
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {studioOutput.seoKeywords?.map((k, idx) => (
                              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-border)', padding: '0.35rem 0.65rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#fff' }}>{k.keyword}</span>
                                <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
                                  <span>📊 {k.volume}</span>
                                  <span style={{ color: k.competition === 'Yüksek' || k.competition === 'High' ? 'var(--color-accent)' : k.competition === 'Orta' || k.competition === 'Medium' ? '#ff9f43' : 'var(--color-success)' }}>
                                    🎯 {k.competition}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                          <Video size={16} /> {t[lang].notesTitle}
                        </h4>
                        <textarea
                          value={studioOutput.tips}
                          onChange={(e) => setStudioOutput(prev => ({ ...prev, tips: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            lineHeight: '1.5',
                            outline: 'none',
                            resize: 'none',
                            fontFamily: 'inherit'
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AI VIDEO SCORER (AI Performance Predictor) */}
                <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={18} color="var(--color-secondary)" /> {lang === 'tr' ? 'AI Video Skorer (Performans Tahmini)' : 'AI Video Scorer (Performance Predictor)'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {lang === 'tr'
                        ? 'Kendi yazdığınız kancayı (Hook) veya video fikrini girin, yapay zeka viral olma potansiyelini ve izleyici tutma grafiğini tahmin etsin.'
                        : 'Enter your custom hook or video draft to forecast hook strength, viral probability, and viewer drop-off curve.'}
                    </p>
                  </div>

                  <form onSubmit={handleScoreIdea} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      required
                      value={customIdea}
                      onChange={(e) => setCustomIdea(e.target.value)}
                      placeholder={lang === 'tr' ? 'Örn: "Hayatımı kolaylaştıran o minimal ve estetik rutini paylaşıyorum..."' : 'e.g. "Sharing that minimal and aesthetic routine that makes my life easier..."'}
                      style={{
                        flex: 1,
                        padding: '0.8rem 1.25rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'rgba(5, 8, 17, 0.6)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={predicting || !customIdea.trim()}
                      className="btn btn-glow-cyan"
                      style={{ minWidth: '150px' }}
                    >
                      {predicting ? '...' : (lang === 'tr' ? 'Skoru Hesapla' : 'Predict Score')}
                    </button>
                  </form>

                  {/* Scorer results */}
                  {predicting && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0, 210, 255, 0.1)', borderTopColor: 'var(--color-secondary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}

                  {!predicting && predictorResult && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginTop: '1rem' }}>
                      {/* Metric Scores */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                          <div className="flex-between" style={{ marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>
                              ⚡ {lang === 'tr' ? 'Kanca Gücü (Hook Strength)' : 'Hook Strength'}
                            </span>
                            <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{predictorResult.hook}/100</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${predictorResult.hook}%`, height: '100%', background: 'var(--color-secondary)', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex-between" style={{ marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>
                              🔥 {lang === 'tr' ? 'Viral Olma Olasılığı' : 'Viral Probability'}
                            </span>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>%{predictorResult.viral}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${predictorResult.viral}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex-between" style={{ marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>
                              🎯 {lang === 'tr' ? 'Hedef Kitle Eşleşmesi' : 'Target Audience Fit'}
                            </span>
                            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>%{predictorResult.audience}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${predictorResult.audience}%`, height: '100%', background: 'var(--color-success)', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      </div>

                      {/* Retention Curve Chart */}
                      <div>
                        <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                          📈 {lang === 'tr' ? 'Tahmini İzleyici Tutma Eğrisi (Retention)' : 'Estimated Viewer Retention Curve'}
                        </h4>
                        <div style={{ height: '100px', width: '100%', position: 'relative' }}>
                          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '80px', display: 'block' }}>
                            {/* Retention curve path */}
                            <path
                              d={`M 0 0 C 25 ${30 - predictorResult.retention[1] * 0.3}, 50 ${30 - predictorResult.retention[2] * 0.3}, 100 ${30 - predictorResult.retention[4] * 0.3}`}
                              fill="none"
                              stroke="var(--color-secondary)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            {/* Grid lines */}
                            <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3" />
                            <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          </svg>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            <span>0s (Hook)</span>
                            <span>15s (Mid)</span>
                            <span>30s (End)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
        {/* TAB 3: CHANNELS */}
        {activeTab === 'channels' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].channelsTitle}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].channelsSub}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {/* TikTok */}
              <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎵</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>TikTok Creator</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', minHeight: '40px' }}>
                  {t[lang].channelDesc}
                </p>
                <button
                  onClick={() => handleConnect('tiktok')}
                  className={`btn ${connectedChannels.tiktok ? 'btn-secondary' : 'btn-glow-cyan'}`}
                  style={{ width: '100%' }}
                >
                  {connectedChannels.tiktok ? t[lang].disconnectBtn : `TikTok ${t[lang].connectBtn}`}
                </button>
              </div>

              {/* Instagram */}
              <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', opacity: isStarter ? 0.6 : 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Instagram Business</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', minHeight: '40px' }}>
                  {t[lang].channelDesc}
                  {isStarter && <span style={{ display: 'block', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.25rem' }}>(Pro / Enterprise Only)</span>}
                </p>
                <button
                  onClick={() => handleConnect('instagram')}
                  className={`btn ${connectedChannels.instagram ? 'btn-secondary' : 'btn-glow-cyan'}`}
                  style={{ width: '100%', borderColor: isStarter ? 'var(--color-accent)' : 'none' }}
                >
                  {isStarter ? <Lock size={12} style={{ marginRight: '0.25rem' }} /> : null}
                  {connectedChannels.instagram ? t[lang].disconnectBtn : `Instagram ${t[lang].connectBtn}`}
                </button>
              </div>

              {/* YouTube */}
              <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', opacity: isStarter ? 0.6 : 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎥</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>YouTube Partner</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', minHeight: '40px' }}>
                  {t[lang].channelDesc}
                  {isStarter && <span style={{ display: 'block', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.25rem' }}>(Pro / Enterprise Only)</span>}
                </p>
                <button
                  onClick={() => handleConnect('youtube')}
                  className={`btn ${connectedChannels.youtube ? 'btn-secondary' : 'btn-glow-cyan'}`}
                  style={{ width: '100%', borderColor: isStarter ? 'var(--color-accent)' : 'none' }}
                >
                  {isStarter ? <Lock size={12} style={{ marginRight: '0.25rem' }} /> : null}
                  {connectedChannels.youtube ? t[lang].disconnectBtn : `YouTube ${t[lang].connectBtn}`}
                </button>
              </div>
            </div>

            {/* CHANNEL ANALYTICS DASHBOARD */}
            {(connectedChannels.tiktok || connectedChannels.instagram || connectedChannels.youtube) && (
              <div className="glass-card animate-float" style={{ padding: '2rem', marginTop: '2.5rem', animation: 'none' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📊 {lang === 'tr' ? 'Bağlı Kanal Analitik Paneli' : 'Connected Channels Analytics Dashboard'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                  {/* Growth Sparkline chart 1: Followers */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      👥 {lang === 'tr' ? 'Toplam Takipçi Büyümesi' : 'Total Followers Growth'}
                    </span>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>
                      24.8K <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 'bold' }}>+12.4%</span>
                    </h2>
                    {/* SVG Line Chart */}
                    <div style={{ height: '60px' }}>
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0 18 Q 20 15 40 10 T 80 5 T 100 2" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 0 18 Q 20 15 40 10 T 80 5 T 100 2 L 100 20 L 0 20 Z" fill="rgba(0, 210, 255, 0.05)" />
                      </svg>
                    </div>
                  </div>

                  {/* Growth Sparkline chart 2: Video Views */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      🎬 {lang === 'tr' ? 'Video İzlenme Trendi' : 'Video Views Trend'}
                    </span>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>
                      185.3K <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 'bold' }}>+24.1%</span>
                    </h2>
                    {/* SVG Line Chart */}
                    <div style={{ height: '60px' }}>
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0 18 Q 20 16 40 8 T 80 4 T 100 1" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 0 18 Q 20 16 40 8 T 80 4 T 100 1 L 100 20 L 0 20 Z" fill="rgba(255, 107, 107, 0.05)" />
                      </svg>
                    </div>
                  </div>

                  {/* Growth Sparkline chart 3: Engagement Rates */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      ❤️ {lang === 'tr' ? 'Ortalama Etkileşim Oranı' : 'Average Engagement Rate'}
                    </span>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>
                      8.7% <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 'bold' }}>+3.2%</span>
                    </h2>
                    {/* SVG Line Chart */}
                    <div style={{ height: '60px' }}>
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0 18 Q 20 14 40 12 T 80 6 T 100 3" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 0 18 Q 20 14 40 12 T 80 6 T 100 3 L 100 20 L 0 20 Z" fill="rgba(16, 185, 129, 0.05)" />
                      </svg>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  {lang === 'tr' ? 'Profil & Ayarlar' : 'Profile & Settings'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {lang === 'tr' ? 'Hesap bilgilerinizi güncelleyin ve abonelik geçmişinizi inceleyin.' : 'Update your personal details, invoice logs, and platform configurations.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Profile details form */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  {lang === 'tr' ? 'Kişisel Bilgiler' : 'Personal Information'}
                </h3>

                {profileSaveSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', padding: '0.75rem 1rem', borderRadius: '6px', color: 'var(--color-success)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} /> {lang === 'tr' ? 'Profil başarıyla güncellendi!' : 'Profile details updated successfully!'}
                  </div>
                )}

                {profileError && (
                  <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid var(--color-accent)', padding: '0.75rem 1rem', borderRadius: '6px', color: 'var(--color-accent)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <X size={16} /> {profileError}
                  </div>
                )}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setProfileError('');
                  setProfileSaveSuccess(false);

                  if (profilePassword && profilePassword !== profileConfirmPassword) {
                    setProfileError(lang === 'tr' ? 'Şifreler eşleşmiyor!' : 'Passwords do not match!');
                    return;
                  }

                  // Update global state and localStorage
                  const updatedUser = {
                    ...user,
                    name: profileName,
                    phone: profilePhone
                  };
                  setUser(updatedUser);
                  localStorage.setItem('trendlab_user', JSON.stringify(updatedUser));

                  setProfileSaveSuccess(true);
                  confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.6 }
                  });
                  setTimeout(() => setProfileSaveSuccess(false), 3000);
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Email field */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      {lang === 'tr' ? 'E-Posta Adresi' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="ornek@trendlab.ai"
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  {/* Name field */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      {lang === 'tr' ? 'Ad Soyad' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      {lang === 'tr' ? 'Telefon Numarası' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+90 555 123 4567"
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  {/* Business category niche */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      {lang === 'tr' ? 'Takip Edilen Kategori' : 'Target Niche'}
                    </label>
                    <select
                      value={profileNiche}
                      onChange={(e) => setProfileNiche(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    >
                      <option value="Verimlilik & Teknoloji">{lang === 'tr' ? 'Verimlilik & Teknoloji' : 'Productivity & Tech'}</option>
                      <option value="Yeme & İçme">{lang === 'tr' ? 'Yeme & İçme' : 'Food & Drink'}</option>
                      <option value="Eğlence & Komedi">{lang === 'tr' ? 'Eğlence & Komedi' : 'Entertainment & Comedy'}</option>
                      <option value="Güzellik & Moda">{lang === 'tr' ? 'Güzellik & Moda' : 'Beauty & Fashion'}</option>
                    </select>
                  </div>

                  {/* Password Update section */}
                  <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    {/* New Password */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                        {lang === 'tr' ? 'Yeni Şifre' : 'New Password'}
                      </label>
                      <div className="auth-input-wrapper">
                        <input
                          type={profileShowPass ? 'text' : 'password'}
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          placeholder="••••••"
                          style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none', paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setProfileShowPass(!profileShowPass)}
                          className="auth-eye-btn"
                          style={{ background: 'none', border: 'none', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                          {profileShowPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                        {lang === 'tr' ? 'Şifreyi Onayla' : 'Confirm Password'}
                      </label>
                      <div className="auth-input-wrapper">
                        <input
                          type={profileShowConfirmPass ? 'text' : 'password'}
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          placeholder="••••••"
                          style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none', paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setProfileShowConfirmPass(!profileShowConfirmPass)}
                          className="auth-eye-btn"
                          style={{ background: 'none', border: 'none', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                          {profileShowConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                  </div>

                  <button type="submit" className="btn btn-glow-cyan" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.65rem 2rem' }}>
                    {lang === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes'}
                  </button>

                </form>
              </div>

              {/* Right Side: Theme toggler & Fatura Geçmişi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Interface Theme Switcher */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
                    {lang === 'tr' ? 'Görünüm Teması' : 'Interface Appearance'}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`btn \${theme === 'dark' ? 'btn-glow-cyan' : 'btn-secondary'}`}
                      style={{ padding: '0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Moon size={16} /> Dark Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`btn \${theme === 'light' ? 'btn-glow-cyan' : 'btn-secondary'}`}
                      style={{ padding: '0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Sun size={16} /> Light Mode
                    </button>
                  </div>
                </div>

                {/* Billing / Invoice Receipts history */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
                    {lang === 'tr' ? 'Fatura Geçmişi' : 'Invoice History'}
                  </h3>

                  {userPlan === 'Free Plan' ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                      {lang === 'tr'
                        ? 'Kayıtlı premium aboneliğiniz veya ödeme geçmişiniz bulunmamaktadır.'
                        : 'No active premium subscription or billing receipts found.'}
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                        <span>{lang === 'tr' ? 'Detay' : 'Plan'}</span>
                        <span>{lang === 'tr' ? 'Tutar' : 'Amount'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: 'var(--color-secondary)', display: 'block' }}>
                            {userPlan}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            2026-07-23 | INV-2026-0891
                          </span>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#fff', display: 'block' }}>
                            {userPlan === 'Starter Plan' ? '200₺' : userPlan === 'Professional Plan' ? '499₺' : '1.499₺'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              exportInvoiceToPdf({
                                invoiceNumber: 'INV-2026-0891',
                                userPlan: userPlan || 'Professional Plan',
                                amount: userPlan === 'Enterprise Plan' ? '1499.00 ₺' : '499.00 ₺',
                                user,
                                lang
                              });
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', color: '#60a5fa', borderColor: 'rgba(96, 165, 250, 0.4)' }}
                          >
                            📄 {lang === 'tr' ? 'PDF İndir' : 'PDF Receipt'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Content Calendar Tab */}
        {activeTab === 'calendar' && (
          <ContentCalendar
            lang={lang}
            scheduledItems={scheduledItems}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {/* Viral Hook Bank Tab */}
        {activeTab === 'hooks' && (
          <ViralHookBank
            lang={lang}
            onSelectHook={handleSelectHookFromBank}
          />
        )}

        {/* Viral Audio & Music Lab Tab */}
        {activeTab === 'audio' && (
          <ViralAudioLab
            lang={lang}
            onUseAudioInStudio={(audioTitle) => {
              setStudioTrend(audioTitle);
              setActiveTab('studio');
            }}
          />
        )}

        {/* Analytics Dashboard Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            lang={lang}
            role="creator"
          />
        )}

        {/* Deal Inbox & Direct Chat Tab */}
        {activeTab === 'inbox' && (
          <DealInbox
            lang={lang}
            role="creator"
          />
        )}

        {/* Saved Trends Bookmarks Tab */}
        {activeTab === 'saved' && (
          <SavedTrendsLibrary
            lang={lang}
            savedTrends={savedTrends}
            onRemoveBookmark={(id) => setSavedTrends(prev => prev.filter(t => t.id !== id))}
            onUseInStudio={(trendTitle) => {
              setStudioTrend(trendTitle);
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* Checkout Modal Overlay inside Workspace */}
      {checkoutPlan && (
        <CheckoutModal
          checkoutPlan={checkoutPlan}
          paymentStep={paymentStep}
          cardHolder={cardHolder}
          setCardHolder={setCardHolder}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          handlePaymentSubmit={handlePaymentSubmit}
          setCheckoutPlan={setCheckoutPlan}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

// Modal helper component for cleaner look
function CheckoutModal({
  checkoutPlan,
  paymentStep,
  cardHolder,
  setCardHolder,
  cardNumber,
  setCardNumber,
  handlePaymentSubmit,
  setCheckoutPlan,
  t,
  lang
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 8, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-card" style={{
        width: '90%',
        maxWidth: '480px',
        padding: '2.5rem',
        border: '1px solid rgba(0, 210, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
      }}>

        <button
          onClick={() => setCheckoutPlan(null)}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {paymentStep === 'form' && (
          <form onSubmit={handlePaymentSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(0, 210, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                marginBottom: '0.75rem'
              }}>
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>{t[lang].checkoutTitle}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {checkoutPlan.name} — <strong style={{ color: 'var(--color-text)' }}>{checkoutPlan.price}</strong> {checkoutPlan.period}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t[lang].cardHolderLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="Kaan Kaplan"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(5, 8, 17, 0.6)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t[lang].cardNumberLabel}</label>
                <input
                  type="text"
                  required
                  maxLength="19"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(5, 8, 17, 0.6)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Skt</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'rgba(5, 8, 17, 0.6)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CVV</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    placeholder="***"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'rgba(5, 8, 17, 0.6)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Lock size={14} /> {t[lang].payBtn}
            </button>
          </form>
        )}

        {paymentStep === 'loading' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 210, 255, 0.1)',
              borderTopColor: 'var(--color-secondary)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <h4 style={{ color: '#fff' }}>{t[lang].paying}</h4>
          </div>
        )}

        {paymentStep === 'success' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              display: 'inline-flex',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--color-success)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-success)',
              marginBottom: '1.5rem'
            }}>
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '0.75rem' }}>{t[lang].successTitle}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '2rem' }}>
              {t[lang].successDesc}
            </p>
            <button
              onClick={() => setCheckoutPlan(null)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              {t[lang].close}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
