import React, { useState, useEffect } from 'react';
import {
  Target,
  AlertTriangle,
  Check,
  Copy,
  Shield,
  Activity,
  FileText,
  Lock,
  X,
  Crown,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Radio,
  Zap,
  BarChart2,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportBrandBriefToPdf, exportToMarkdown, exportInvoiceToPdf } from '../lib/pdfExporter.js';
import ContentCalendar from './ContentCalendar.jsx';
import SavedTrendsLibrary from './SavedTrendsLibrary.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import DealInbox from './DealInbox.jsx';
import { fetchLiveSocialTrends } from '../lib/socialTrendFetcher.js';
import { subscribeToTrendWebhooks, triggerDemoWebhookSpike } from '../lib/trendWebhookListener.js';

export default function BrandWorkspace({ _setView, lang = 'tr', userPlan, setUserPlan, onIyzicoCheckout, theme, setTheme, user }) {
  const isTr = lang === 'tr';
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedIndustry, setSelectedIndustry] = useState('cosmetics');
  const [campaignInput, setCampaignInput] = useState({
    product: '',
    target: 'genz',
    tone: 'energetic',
    platform: 'tiktok'
  });
  const [campaignOutput, setCampaignOutput] = useState(null);

  // Scheduled Calendar Items State for Brand
  const [scheduledItems, setScheduledItems] = useState([
    { id: 'b1', title: 'Matcha Cilt Serumu Lansman Kampanyası', day: lang === 'tr' ? 'Salı' : 'Tuesday', platform: 'tiktok', time: '20:00', status: 'scheduled' },
    { id: 'b2', title: 'GenZ Yaz Stili İndirim Duyurusu', day: lang === 'tr' ? 'Cuma' : 'Friday', platform: 'instagram', time: '18:00', status: 'scheduled' }
  ]);

  // Saved Trends Bookmarks State for Brand
  const [savedTrends, setSavedTrends] = useState([
    { id: 'bst1', title: 'Matcha Cilt Serumu Lansman Kampanyası', category: 'Güzellik & Bakım', growth: '+420%', platform: 'tiktok' },
    { id: 'bst2', title: 'GenZ Yaz Stili İndirim Duyurusu', category: 'Moda & Stil', growth: '+180%', platform: 'instagram' }
  ]);

  // Live API & Webhook State for Brand
  const [_liveTrends, setLiveTrends] = useState([]);
  const [liveApiStatus, setLiveApiStatus] = useState({ source: 'Hybrid Realtime Engine', timestamp: '', loading: true });
  const [platformFilter, setPlatformFilter] = useState('all');
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
      loadTrends(selectedRegion);
      setTimeout(() => setWebhookAlert(null), 8000);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion]);

  const handleAddSchedule = (newItem) => {
    setScheduledItems(prev => [newItem, ...prev]);
  };

  const handleDeleteSchedule = (id) => {
    setScheduledItems(prev => prev.filter(item => item.id !== id));
  };
  const [generating, setGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [profileName, setProfileName] = useState(user?.name || (user?.email ? user.email.split('@')[0] : 'Demo Brand'));
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileNiche, setProfileNiche] = useState(lang === 'tr' ? 'Kozmetik & Güzellik' : 'Cosmetics & Beauty');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileShowPass, setProfileShowPass] = useState(false);
  const [profileShowConfirmPass, setProfileShowConfirmPass] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [customIdea, setCustomIdea] = useState('');
  const [predictorResult, setPredictorResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [campaignBudget, setCampaignBudget] = useState('50000');
  const [activeCreatorModal, setActiveCreatorModal] = useState(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalState, setProposalState] = useState('idle');
  const [counterPrice, setCounterPrice] = useState(0);
  const [activeCompetitor, setActiveCompetitor] = useState('Competitor A');

  // Premium Simulator state
  const [campaignQuota, setCampaignQuota] = useState(1);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('form');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // 10 languages translations dictionary for Brand Workspace
  const t = {
    tr: {
      sidebarTitle: 'Marka Paneli', tabRadar: 'Sektörel Trend Radarı', tabCompetitors: 'Rakip Takibi', tabCampaign: 'AI Kampanya Motoru',
      backBtn: 'Ana Sayfaya Dön', radarTitle: 'Sektörel Trend Radarı', radarSub: 'Sektörünüzdeki en son trendleri, uyumluluk skorlarını ve risk derecelerini izleyin.',
      krizTitle: 'Erken Kriz Uyarısı', krizDesc: 'Sektörünüzle ilişkili "Silikon İçeren Serumlar" başlığı altında olumsuz yorum yoğunluğu son 3 saatte %140 arttı. Kampanyaları askıya almanız önerilir.',
      tableTrend: 'Trend İsmi', tableMatch: 'Uyum Skoru', tableStatus: 'Durum', tableRisk: 'Risk Analizi',
      tableCompetitor: 'Rakip Hareketi', cosmeticsVal: 'Kozmetik & Güzellik', techVal: 'Teknoloji', statFastest: 'En Hızlı Adapte Olan Rakip',
      statFastestSub: 'Ortalama 1.5 günde trende katılıyor', statMissed: 'Kaçırılan Trend Fırsatları', statMissedSub: 'Rakipler paylaştı, siz henüz paylaşmadınız',
      compTitle: 'Rakip Kıyaslama Tablosu', compName: 'Rakip İsmi', compFrequency: 'Paylaşım Sıklığı', compSpeed: 'Trendlere Uyum Hızı',
      compFormat: 'En Başarılı Format', campaignTitle: 'AI Kampanya Motoru', campaignSub: 'Ürün ve hedef kitle bilgilerinizi girerek trende uyumlu otomatik brief ve pazarlama konseptleri üretin.',
      productLabel: 'Pazarlayacağınız Ürün Nedir?', productPlaceholder: 'Örn: Doğal Kolajenli Göz Altı Serumu', targetLabel: 'Hedef Kitle',
      toneLabel: 'Marka Tonu', platformLabel: 'Ana Platform', generateCampaignBtn: 'Kampanya Planı Üret',
      generatingMsg: 'AI kampanya fikirleri ve creator listeleri hesaplıyor...', copyBtn: 'Kopya', copiedMsg: 'Kopyalandı',
      ideasTitle: 'Önerilen Kampanya Fikirleri', creatorsTitle: 'Önerilen Creatorlar', riskTitle: 'Risk Azaltma Planı',
      upgradeBanner: 'AI Kampanya oluşturma limitiniz (1/5) tükenmek üzere. Professional Plan\'a yükseltin!',
      premiumActive: 'Professional / Enterprise Aktif: Limitsiz Kampanya & Rakip İstihbaratı!', upgradeBtn: 'Yükselt', checkoutTitle: 'Plan Satın Al',
      cardHolderLabel: 'Kart Sahibi', cardNumberLabel: 'Kart Numarası', payBtn: 'Ödemeyi Tamamla', paying: 'Ödeme İşleniyor...',
      successTitle: 'Abonelik Aktif!', successDesc: 'Hesabınız başarıyla yükseltildi. Sınırsız AI Kampanya ve Rakip İstihbaratı aktif!', close: 'Kapat',
      quotaLabel: 'Kampanya Kotası', followersLabel: 'takipçi', matchRate: 'Uyum', planRequiredTitle: 'Plan Seçimi Gerekli',
      planRequiredSub: 'Brand Workspace alanına erişmek için lütfen 3 premium plandan birini satın alın.', selectBtn: 'Seç', popularBadge: 'Popüler', limitWarning: 'Starter Plan kampanya limitiniz doldu. Limitsiz kampanya planlamak için Professional Plan\'a yükseltin!'
    },
    en: {
      sidebarTitle: 'Brand Hub', tabRadar: 'Industry Trend Radar', tabCompetitors: 'Competitor Tracking', tabCampaign: 'AI Campaign Engine',
      backBtn: 'Back to Home', radarTitle: 'Industry Trend Radar', radarSub: 'Monitor rising industry trend vectors, brand affinity parameters and alert risks.',
      krizTitle: 'Early Crisis Warning', krizDesc: 'Negative sentiment around "Silicon-infused Serums" has spiked by 140% in the last 3 hours. Suspending active beauty campaigns is recommended.',
      tableTrend: 'Trend Concept', tableMatch: 'Affinity Score', tableStatus: 'Status', tableRisk: 'Risk Analysis',
      tableCompetitor: 'Competitor Action', cosmeticsVal: 'Cosmetics & Beauty', techVal: 'Technology', statFastest: 'Fastest Adopting Competitor',
      statFastestSub: 'Averages 1.5 days response time', statMissed: 'Missed Trend Vectors', statMissedSub: 'Competitors joined; your brand is inactive',
      compTitle: 'Competitor Benchmark Table', compName: 'Competitor', compFrequency: 'Post Frequency', compSpeed: 'Adoption Rate',
      compFormat: 'Top Performing Format', campaignTitle: 'AI Campaign Engine', campaignSub: 'Input product attributes and target demographics to auto-generate matching brief plans.',
      productLabel: 'What product are you marketing?', productPlaceholder: 'e.g. Organic Collagen Under-eye Serum', targetLabel: 'Target Demographics',
      toneLabel: 'Brand Persona Tone', platformLabel: 'Priority Channel', generateCampaignBtn: 'Generate Campaign Plan',
      generatingMsg: 'AI engine is drafting campaigns and indexing creator safety...', copyBtn: 'Copy', copiedMsg: 'Copied',
      ideasTitle: 'Proposed Creative Concept Bundles', creatorsTitle: 'Identified Creator Affiliates', riskTitle: 'Risk Mitigation Protocol',
      upgradeBanner: 'Your AI Campaign quota is almost full (1/5). Upgrade to Professional Plan!',
      premiumActive: 'Professional / Enterprise Active: Unlimited Quotas!', upgradeBtn: 'Upgrade Now', checkoutTitle: 'Purchase Plan',
      cardHolderLabel: 'Cardholder Name', cardNumberLabel: 'Card Number', payBtn: 'Complete Payment', paying: 'Processing Payment...',
      successTitle: 'Upgrade Successful!', successDesc: 'Your workspace has been successfully upgraded. Unlimited campaign briefs active!', close: 'Close',
      quotaLabel: 'Campaign Quota', followersLabel: 'followers', matchRate: 'Match', planRequiredTitle: 'Pricing Plan Required',
      planRequiredSub: 'To access the Brand Workspace hub, please subscribe to one of our premium plans.', selectBtn: 'Select', popularBadge: 'Popular', limitWarning: 'Starter Plan campaign limit reached. Upgrade to Professional Plan for unlimited campaigns!'
    },
    de: {
      sidebarTitle: 'Marken-Bereich', tabRadar: 'Trendradar der Branche', tabCompetitors: 'Wettbewerber-Tracking', tabCampaign: 'KI-Kampagnen-Engine',
      backBtn: 'Zur Startseite', radarTitle: 'Trendradar der Branche', radarSub: 'Überwachen Sie steigende Branchentrendvektoren und Risiken.',
      krizTitle: 'Frühwarnung vor Krisen', krizDesc: 'Negatives Feedback zu Silikon-Serum ist in den letzten 3 Stunden um 140% gestiegen. Pausierung empfohlen.',
      tableTrend: 'Trend-Konzept', tableMatch: 'Affinitätswert', tableStatus: 'Status', tableRisk: 'Risikoanalyse',
      tableCompetitor: 'Wettbewerber', cosmeticsVal: 'Kosmetik & Schönheit', techVal: 'Technologie', statFastest: 'Schnellster Wettbewerber',
      statFastestSub: 'Reagiert im Schnitt nach 1,5 Tagen', statMissed: 'Verpasste Trends', statMissedSub: 'Wettbewerber beigetreten, Ihre Marke nicht',
      compTitle: 'Wettbewerber-Benchmark-Tabelle', compName: 'Wettbewerber', compFrequency: 'Frequenz', compSpeed: 'Reaktionszeit',
      compFormat: 'Bestes Format', campaignTitle: 'KI-Kampagnen-Engine', campaignSub: 'Geben Sie Produktattribute ein, um Briefings zu generieren.',
      productLabel: 'Welches Produkt vermarkten Sie?', productPlaceholder: 'z.B. Bio-Kollagen-Serum', targetLabel: 'Zielgruppe',
      toneLabel: 'Marken-Ton', platformLabel: 'Kanal', generateCampaignBtn: 'Kampagne generieren',
      generatingMsg: 'KI entwirft Kampagnen...', copyBtn: 'Kopieren', copiedMsg: 'Kopiert',
      ideasTitle: 'Kreative Konzepte', creatorsTitle: 'Creator-Vorschläge', riskTitle: 'Risikominderung',
      upgradeBanner: 'Ihr Kampagnenlimit läuft bald ab (1/5). Upgrade auf Professional!',
      premiumActive: 'Professional / Enterprise aktiv: Unbegrenzt!', upgradeBtn: 'Jetzt upgraden', checkoutTitle: 'Plan kaufen',
      cardHolderLabel: 'Karteninhaber', cardNumberLabel: 'Kartennummer', payBtn: 'Zahlung abschließen', paying: 'Verarbeitung...',
      successTitle: 'Abonnement aktiv!', successDesc: 'Abonnement erfolgreich aktiviert!', close: 'Schließen',
      quotaLabel: 'Kampagnenlimit', followersLabel: 'Follower', matchRate: 'Match', planRequiredTitle: 'Plan erforderlich',
      planRequiredSub: 'Bitte abonnieren Sie einen Premium-Plan, um fortzufahren.', selectBtn: 'Auswählen', popularBadge: 'Beliebt', limitWarning: 'Kampagnenlimit für den Starter-Plan erreicht. Aktualisieren Sie auf den Professional-Plan für unbegrenzte Kampagnen!'
    },
    fr: {
      sidebarTitle: 'Marque Hub', tabRadar: 'Radar de tendances', tabCompetitors: 'Suivi concurrentiel', tabCampaign: 'Moteur de campagne IA',
      backBtn: 'Retour à l\'accueil', radarTitle: 'Radar de tendances sectorielles', radarSub: 'Surveillez les tendances émergentes et les alertes de risque.',
      krizTitle: 'Alerte précoce de crise', krizDesc: 'Les commentaires négatifs ont bondi de 140 % en 3 heures. Il est conseillé de suspendre les campagnes beauté.',
      tableTrend: 'Concept de tendance', tableMatch: 'Score d\'affinité', tableStatus: 'Statut', tableRisk: 'Analyse de risque',
      tableCompetitor: 'Action concurrent', cosmeticsVal: 'Cosmétiques & Beauté', techVal: 'Technologie', statFastest: 'Concurrent le plus rapide',
      statFastestSub: 'Réagit en moyenne en 1.5 jour', statMissed: 'Tendances manquées', statMissedSub: 'Les concurrents y ont adhéré, pas vous',
      compTitle: 'Tableau comparatif concurrentiel', compName: 'Concurrent', compFrequency: 'Fréquence de post', compSpeed: 'Vitesse d\'adoption',
      compFormat: 'Meilleur format', campaignTitle: 'Moteur de campagne IA', campaignSub: 'Saisissez les détails pour générer des concepts de marketing.',
      productLabel: 'Quel produit vendez-vous ?', productPlaceholder: 'Ex: sérum collagène bio', targetLabel: 'Public cible',
      toneLabel: 'Ton de la marque', platformLabel: 'Plateforme principale', generateCampaignBtn: 'Générer la campagne',
      generatingMsg: 'Génération de campagne IA...', copyBtn: 'Copier', copiedMsg: 'Copié',
      ideasTitle: 'Concepts créatifs', creatorsTitle: 'Créateurs recommandés', riskTitle: 'Atténuation des risques',
      upgradeBanner: 'Votre quota de campagne est presque épuisé (1/5). Passez au plan Professional !',
      premiumActive: 'Professional / Enterprise actif : Utilisation illimitée !', upgradeBtn: 'Mettre à niveau', checkoutTitle: 'S\'abonner',
      cardHolderLabel: 'Titulaire de la carte', cardNumberLabel: 'Numéro de carte', payBtn: 'Payer', paying: 'Traitement...',
      successTitle: 'Abonnement actif !', successDesc: 'Abonnement activé avec succès !', close: 'Fermer',
      quotaLabel: 'Quota de campagne', followersLabel: 'abonnés', matchRate: 'Match', planRequiredTitle: 'Abonnement requis',
      planRequiredSub: 'Pour accéder à l\'espace marque, veuillez souscrire à l\'un de nos plans.', selectBtn: 'Choisir', popularBadge: 'Populaire', limitWarning: 'Limite de campagne du plan Starter atteinte. Passez au plan Professional pour des campagnes illimitées !'
    },
    es: {
      sidebarTitle: 'Panel Brand', tabRadar: 'Radar de tendencias', tabCompetitors: 'Seguimiento de rivales', tabCampaign: 'Motor de campaña IA',
      backBtn: 'Volver a inicio', radarTitle: 'Radar de tendencias del sector', radarSub: 'Monitorea tendencias crecientes y alertas de riesgo.',
      krizTitle: 'Alerta temprana de crisis', krizDesc: 'Opiniones negativas sobre serum aumentaron 140% en 3 horas. Se recomienda pausar campañas.',
      tableTrend: 'Concepto de tendencia', tableMatch: 'Afinidad', tableStatus: 'Estado', tableRisk: 'Análisis de riesgo',
      tableCompetitor: 'Acción de rivales', cosmeticsVal: 'Cosmética y Belleza', techVal: 'Tecnología', statFastest: 'Competidor más rápido',
      statFastestSub: 'Reacciona en 1.5 días promedio', statMissed: 'Oportunidades perdidas', statMissedSub: 'Los rivales se unieron; tú marca no',
      compTitle: 'Tabla comparativa de rivales', compName: 'Rival', compFrequency: 'Frecuencia de post', compSpeed: 'Adopción',
      compFormat: 'Mejor formato', campaignTitle: 'Motor de campaña IA', campaignSub: 'Inserta detalles para auto-generar briefs.',
      productLabel: '¿Qué producto promocionas?', productPlaceholder: 'Ej: serum de colágeno natural', targetLabel: 'Público objetivo',
      toneLabel: 'Tono de marca', platformLabel: 'Canal', generateCampaignBtn: 'Generar campaña',
      generatingMsg: 'IA diseñando campañas...', copyBtn: 'Copiar', copiedMsg: 'Copiado',
      ideasTitle: 'Propuestas creativas', creatorsTitle: 'Creadores recomendados', riskTitle: 'Mitigación de riesgos',
      upgradeBanner: 'Tu límite de campañas está por vencer (1/5). ¡Actualiza a Professional!',
      premiumActive: 'Professional / Enterprise activo: ¡Acceso ilimitado!', upgradeBtn: 'Actualizar', checkoutTitle: 'Comprar plan',
      cardHolderLabel: 'Titular', cardNumberLabel: 'Número de tarjeta', payBtn: 'Completar pago', paying: 'Procesando...',
      successTitle: '¡Suscripción activa!', successDesc: '¡Tu suscripción se ha activado correctamente!', close: 'Cerrar',
      quotaLabel: 'Límite de campañas', followersLabel: 'seguidores', matchRate: 'Afinidad', planRequiredTitle: 'Plan requerido',
      planRequiredSub: 'Suscríbete a un plan para acceder al panel de marcas.', selectBtn: 'Seleccionar', popularBadge: 'Popular', limitWarning: 'Límite de campañas del plan Starter alcanzado. ¡Actualiza al plan Professional para campaigns ilimitadas!'
    },
    it: {
      sidebarTitle: 'Hub Brand', tabRadar: 'Radar di tendenze', tabCompetitors: 'Monitoraggio competitor', tabCampaign: 'Moteur di campagna IA',
      backBtn: 'Torna alla Home', radarTitle: 'Radar delle tendenze di settore', radarSub: 'Monitora l\'ascesa delle tendenze del settore e riduci i rischi.',
      krizTitle: 'Allerta crisi precoce', krizDesc: 'I commenti negativi sul siero sono aumentati del 140% nelle ultime 3 ore. Si consiglia di sospendere le campagne.',
      tableTrend: 'Tendenza', tableMatch: 'Compatibilità', tableStatus: 'Stato', tableRisk: 'Analisi del rischio',
      tableCompetitor: 'Azione competitor', cosmeticsVal: 'Cosmetica & Bellezza', techVal: 'Tecnologia', statFastest: 'Competitore più rapido',
      statFastestSub: 'Reagisce in media in 1.5 giorni', statMissed: 'Tendenze perse', statMissedSub: 'I competitor partecipano; il tuo brand no',
      compTitle: 'Tabella di confronto dei competitor', compName: 'Competitor', compFrequency: 'Frequenza post', compSpeed: 'Adozione',
      compFormat: 'Miglior formato', campaignTitle: 'Motore di campagna IA', campaignSub: 'Inserisci le specifiche per generare i brief.',
      productLabel: 'Quale prodotto promuovi?', productPlaceholder: 'es: siero al collagene bio', targetLabel: 'Target',
      toneLabel: 'Tono del brand', platformLabel: 'Canale', generateCampaignBtn: 'Genera campagna',
      generatingMsg: 'L\'IA elabora la campagna...', copyBtn: 'Copia', copiedMsg: 'Copiato',
      ideasTitle: 'Concept creativi', creatorsTitle: 'Creator consigliati', riskTitle: 'Riduzione del rischio',
      upgradeBanner: 'Il tuo limite per le campagne sta per scadere (1/5). Passa a Professional!',
      premiumActive: 'Professional / Enterprise attivo: Crediti illimitati!', upgradeBtn: 'Aggiorna', checkoutTitle: 'Acquista plan',
      cardHolderLabel: 'Titolare', cardNumberLabel: 'Numero carta', payBtn: 'Paga', paying: 'Elaborazione...',
      successTitle: 'Abbonamento attivo!', successDesc: 'Il tuo abbonamento è attivo. Buona creazione!', close: 'Chiudi',
      quotaLabel: 'Quota campagne', followersLabel: 'follower', matchRate: 'Match', planRequiredTitle: 'Piano richiesto',
      planRequiredSub: 'Abbonati a un piano per accedere al Workspace Brand.', selectBtn: 'Seleziona', popularBadge: 'Popolare', limitWarning: 'Limite campagne del piano Starter raggiunto. Passa al piano Professional per campagne illimitate!'
    },
    ru: {
      sidebarTitle: 'Панель Brand', tabRadar: 'Радар трендов индустрии', tabCompetitors: 'Отслеживание конкурентов', tabCampaign: 'Генератор рекламных кампаний',
      backBtn: 'Назад на главную', radarTitle: 'Радар трендов индустрии', radarSub: 'Мониторинг восходящих векторов отрасли и оценка рисков.',
      krizTitle: 'Раннее предупреждение о кризисе', krizDesc: 'Негативные отзывы о сыворотках выросли на 140% за последние 3 часа. Рекомендуется приостановить рекламу.',
      tableTrend: 'Вирусная концепция', tableMatch: 'Совместимость', tableStatus: 'Статус', tableRisk: 'Анализ рисков',
      tableCompetitor: 'Действия конкурентов', cosmeticsVal: 'Косметика и уход', techVal: 'Технологии', statFastest: 'Самый быстрый конкурент',
      statFastestSub: 'В среднем реагирует за 1.5 дня', statMissed: 'Упущенные тренды', statMissedSub: 'Конкуренты уже участвуют, ваш бренд - нет',
      compTitle: 'Сравнительная таблица конкурентов', compName: 'Конкурент', compFrequency: 'Частота постов', compSpeed: 'Скорость реакции',
      compFormat: 'Лучший формат', campaignTitle: 'Генератор кампаний', campaignSub: 'Введите параметры продукта для автоматического создания брифов.',
      productLabel: 'Какой продукт рекламируем?', productPlaceholder: 'Например: органическая сыворотка', targetLabel: 'Целевая аудитория',
      toneLabel: 'Тональность бренда', platformLabel: 'Канал продвижения', generateCampaignBtn: 'Создать кампанию',
      generatingMsg: 'ИИ проектирует брифы...', copyBtn: 'Копировать', copiedMsg: 'Скопировано',
      ideasTitle: 'Креативные концепции', creatorsTitle: 'Рекомендуемые блогеры', riskTitle: 'Снижение рисков',
      upgradeBanner: 'Лимит рекламных кампаний Starter почти исчерпан (1/5). Обновитесь до Professional!',
      premiumActive: 'Professional / Enterprise активен: Безлимитно!', upgradeBtn: 'Обновить тариф', checkoutTitle: 'Оплата подписки',
      cardHolderLabel: 'Имя на карте', cardNumberLabel: 'Номер карты', payBtn: 'Оплатить', paying: 'Платеж обрабатывается...',
      successTitle: 'Подписка активна!', successDesc: 'Подписка успешно активирована!', close: 'Закрыть',
      quotaLabel: 'Лимит кампаний', followersLabel: 'подписчиков', matchRate: 'Совместимость', planRequiredTitle: 'Необходим тарифный план',
      planRequiredSub: 'Для входа в рабочий кабинет выберите тариф.', selectBtn: 'Выбрать', popularBadge: 'Популярно', limitWarning: 'Лимит кампаний для тарифного плана Starter исчерпан. Обновитесь до Professional для безлимитных кампаний!'
    },
    ja: {
      sidebarTitle: 'ブランド領域', tabRadar: '業界トレンドレーダー', tabCompetitors: '競合分析トラッカー', tabCampaign: 'AI企画キャンペーンエンジン',
      backBtn: 'ホームに戻る', radarTitle: '業界トレンドレーダー', radarSub: '業界の最新バイラルトレンドや炎上・リスクの兆候を監視します。',
      krizTitle: '早期リスク炎上警告', krizDesc: '特定美容成分に対するネガティブフィードバックが急増（過去3時間で+140%）。キャンペーンの一時停止を推奨します。',
      tableTrend: 'トレンドキーワード', tableMatch: '適合スコア', tableStatus: '状況', tableRisk: 'リスク分析',
      tableCompetitor: '競合の対応', cosmeticsVal: 'コスメ＆ビューティー', techVal: 'テクノロジー', statFastest: '対応が最も早い競合',
      statFastestSub: '平均1.5日でトレンドに対応', statMissed: '見逃したトレンド数', statMissedSub: '競合は対応済みですが、あなたのブランドは未対応です',
      compTitle: '競合パフォーマンスベンチマーク', compName: '競合ブランド', compFrequency: '投稿頻度', compSpeed: '反応速度',
      compFormat: '推奨ヒット形式', campaignTitle: 'AIキャンペーンエンジン', campaignSub: '商品仕様とターゲット属性を入力し、キャンペーン企画書（ブリーフ）を即時生成します。',
      productLabel: 'プロモーションする商品は何ですか？', productPlaceholder: '例: オーガニックコラーゲン美容液', targetLabel: 'ターゲット属性',
      toneLabel: 'ブランドトーン', platformLabel: '推奨配信チャネル', generateCampaignBtn: 'キャンペーン企画を生成',
      generatingMsg: 'AIがプロモーション資料を構成中...', copyBtn: 'コピー', copiedMsg: 'コピーしました',
      ideasTitle: '提案されたプロモーションコンセプト案', creatorsTitle: '起用候補クリエイター', riskTitle: '想定リスク回避策',
      upgradeBanner: 'キャンペーン生成制限（残り1/5回）が迫っています。Professionalプランへアップグレード！',
      premiumActive: 'Professional / Enterprise 有効：競合・企画レポート無制限！', upgradeBtn: 'アップグレード', checkoutTitle: 'プランの購入',
      cardHolderLabel: 'カード名義', cardNumberLabel: 'カード番号', payBtn: '決済を完了する', paying: '決済処理中...',
      successTitle: 'プラン適用完了！', successDesc: 'サブスクリプションが有効化され、各種データに無制限でアクセスいただけます。', close: '閉じる',
      quotaLabel: '生成可能回数', followersLabel: 'フォロワー', matchRate: '適合', planRequiredTitle: 'プランの未選択',
      planRequiredSub: 'ブランド領域を利用するには有料プランのご契約が必要です。', selectBtn: '選択する', popularBadge: '人気', limitWarning: 'Starterプランのキャンペーン制限に達しました。無制限にキャンペーンを企画するにはProfessionalプランにアップグレードしてください！'
    },
    zh: {
      sidebarTitle: '品牌工作区', tabRadar: '行业趋势雷达', tabCompetitors: '竞品动态追踪', tabCampaign: 'AI 营销策划引擎',
      backBtn: '返回首页', radarTitle: '行业趋势雷达', radarSub: '全天候监测行业最新上升趋势、配比契合度与公关风险。',
      krizTitle: '早期危机风险公关预警', krizDesc: '针对“含硅精华”的负面评论率在过去3小时内猛增140%，建议暂停当前相关美妆广告投放。',
      tableTrend: '趋势主题', tableMatch: '契合评分', tableStatus: '热度状态', tableRisk: '合规风险评估',
      tableCompetitor: '竞品动态', cosmeticsVal: '美妆护肤', techVal: '智能科技', statFastest: '最快响应竞品',
      statFastestSub: '平均1.5天内跟进新趋势', statMissed: '错失的热点机会', statMissedSub: '竞品已跟进发布，您尚未行动',
      compTitle: '主要竞品对标榜单', compName: '竞品品牌', compFrequency: '内容发布频次', compSpeed: '新趋势跟进速度',
      compFormat: '最成功的内容格式', campaignTitle: 'AI 营销策划引擎', campaignSub: '输入您的核心卖点与受众画像，AI 智能输出定制营销策划案（Brief）及达人推介。',
      productLabel: '您要推广的核心商品是什么？', productPlaceholder: '例如：天然骨胶原眼部精华', targetLabel: '目标人群',
      toneLabel: '品牌调性', platformLabel: '主推平台', generateCampaignBtn: '一键生成营销策划案',
      generatingMsg: 'AI 正在梳理营销策划方案...', copyBtn: '复制', copiedMsg: '已复制',
      ideasTitle: 'AI 推荐的营销创意概念', creatorsTitle: '推荐关联达人', riskTitle: '合规防撕避雷指南',
      upgradeBanner: '当前 Starter 计划限额（生成次数: 1/5）即将用尽。请升级至 Professional 计划！',
      premiumActive: 'Professional / Enterprise 计划已激活：无限次竞品分析与营销策划！', upgradeBtn: '立即升级', checkoutTitle: '购买品牌版服务',
      cardHolderLabel: '持卡人姓名', cardNumberLabel: '卡号', payBtn: '完成付款', paying: '正在处理付款...',
      successTitle: '订阅已生效！', successDesc: '您的品牌版订阅已成功支付激活，无限额营销策划权限已开启！', close: '关闭',
      quotaLabel: '剩余生成次数', followersLabel: '粉丝数', matchRate: '契合', planRequiredTitle: '请选择订阅计划',
      planRequiredSub: '要访问品牌管理中心，请先选择购买我们其中的一款订阅服务。', selectBtn: '选择', popularBadge: '热门', limitWarning: '已达到 Starter 计划的营销策划次数限制。升级到 Professional 计划以获取无限次策划！'
    },
    ar: {
      sidebarTitle: 'لوحة تحكم العلامة التجارية', tabRadar: 'رادار التوجهات القطاعية', tabCompetitors: 'تتبع المنافسين', tabCampaign: 'محرك حملات الذكاء الاصطناعي',
      backBtn: 'العودة للرئيسية', radarTitle: 'رادار التوجهات القطاعية', radarSub: 'راقب أحدث توجهات قطاعك، ونسب التوافق، ومستويات المخاطر.',
      krizTitle: 'تحذير مبكر من الأزمات', krizDesc: 'زاد حجم التعليقات السلبية حول "أمصال السيليكون" المرتبطة بقطاعك بنسبة 140% في آخر 3 ساعات. يوصى بتعليق الحملات النشطة.',
      tableTrend: 'اسم التوجه', tableMatch: 'نسبة التوافق', tableStatus: 'الحالة', tableRisk: 'تحليل المخاطر',
      tableCompetitor: 'حركة المنافسين', cosmeticsVal: 'مستحضرات التجميل والجمال', techVal: 'التكنولوجيا', statFastest: 'المنافس الأسرع استجابة',
      statFastestSub: 'يستجيب للتوجهات في غضون 1.5 يوم في المتوسط', statMissed: 'فرص التوجهات الضائعة', statMissedSub: 'شارك فيها المنافسون ولم تشارك فيها بعد',
      compTitle: 'جدول مقارنة المنافسين', compName: 'اسم المنافس', compFrequency: 'تكرار النشر', compSpeed: 'سرعة الاستجابة للتوجهات',
      compFormat: 'التنسيق الأكثر نجاحًا', campaignTitle: 'محرك حملات الذكاء الاصطناعي', campaignSub: 'أدخل معلومات منتجك وجمهورك المستهدف لإنشاء موجزات وأفكار تسويقية متوافقة مع التوجهات تلقائيًا.',
      productLabel: 'ما هو المنتج الذي تروج له؟', productPlaceholder: 'مثال: سيروم طبيعي لأسفل العينين بالكولاجين', targetLabel: 'الجمهور المستهدف',
      toneLabel: 'نبرة العلامة التجارية', platformLabel: 'المنصة الرئيسية', generateCampaignBtn: 'إنشاء خطة الحملة',
      generatingMsg: 'يقوم الذكاء الاصطناعي بحساب أفكار الحملة وقوائم المبدعين...', copyBtn: 'نسخ', copiedMsg: 'تم النسخ',
      ideasTitle: 'أفكار الحملات المقترحة', creatorsTitle: 'المبدعون المقترحون', riskTitle: 'خطة تقليل المخاطر',
      upgradeBanner: 'شارف حد إنشاء حملات الذكاء الاصطناعي على النفاد (1/5). يرجى الترقية إلى الباقة الاحترافية!',
      premiumActive: 'الباقة الاحترافية / باقة المؤسسات نشطة: حملات وتحليلات منافسين غير محدودة!', upgradeBtn: 'ترقية', checkoutTitle: 'شراء باقة الاشتراك',
      cardHolderLabel: 'صاحب البطاقة', cardNumberLabel: 'رقم البطاقة', payBtn: 'إتمام عملية الدفع', paying: 'جاري معالجة الدفع...',
      successTitle: 'الاشتراك نشط!', successDesc: 'تم ترقية حسابك بنجاح. تفعيل محرك الحملات واستخبارات المنافسين غير المحدودة!', close: 'إغلاق',
      quotaLabel: 'حصة الحملات', followersLabel: 'متابع', matchRate: 'توافق', planRequiredTitle: 'مطلوب تفعيل باقة اشتراك',
      planRequiredSub: 'للدخول إلى مساحة العمل الخاصة بالعلامات التجارية، يرجى الاشتراك في إحدى باقاتنا المميزة.', selectBtn: 'تحديد', popularBadge: 'شائع', limitWarning: 'تم الوصول إلى حد الحملات للباقة الأساسية. يرجى الترقية إلى الباقة الاحترافية للحصول على حملات غير محدودة!'
    }
  };

  const brandTrends = {
    cosmetics: [
      { id: 1, name: lang === 'tr' ? 'Salyangoz Özlü Serum Rutini' : 'Snail Mucin Serum Routine', risk: lang === 'tr' ? 'Düşük Risk' : 'Low Risk', score: 94, status: lang === 'tr' ? 'Yükseliyor' : 'Rising', competitors: lang === 'tr' ? '2 rakip katıldı' : '2 competitors joined' },
      { id: 2, name: lang === 'tr' ? 'Erkekler İçin Renkli Nemlendirici' : 'Tinted Moisturizer for Men', risk: lang === 'tr' ? 'Orta Risk (Satış Doygunluğu)' : 'Medium Risk (Sales Saturation)', score: 81, status: lang === 'tr' ? 'Zirvede' : 'Peak', competitors: lang === 'tr' ? '1 rakip katıldı' : '1 competitor joined' },
      { id: 3, name: lang === 'tr' ? 'Tıbbi Sınıf Akne Bantları' : 'Medical Grade Acne Patches', risk: lang === 'tr' ? 'Yüksek Risk (Telif/Sağlık İddiası)' : 'High Risk (Medical claims)', score: 68, status: lang === 'tr' ? 'İlk Sinyal' : 'Early Signal', competitors: lang === 'tr' ? 'Rakip yok' : 'No competitors yet' }
    ],
    tech: [
      { id: 1, name: lang === 'tr' ? 'AI Kodlama Asistanları' : 'AI Coding Assistants', risk: lang === 'tr' ? 'Düşük Risk' : 'Low Risk', score: 96, status: lang === 'tr' ? 'Hızlanıyor' : 'Accelerating', competitors: lang === 'tr' ? '1 rakip katıldı' : '1 competitor joined' },
      { id: 2, name: lang === 'tr' ? 'Katlanabilir Ekran Testleri' : 'Foldable Display Durability', risk: lang === 'tr' ? 'Düşük Risk' : 'Low Risk', score: 85, status: lang === 'tr' ? 'Yükseliyor' : 'Rising', competitors: lang === 'tr' ? '3 rakip katıldı' : '3 competitors joined' },
      { id: 3, name: lang === 'tr' ? 'VR Gözlük ile Sanal Ofis' : 'Virtual Office inside VR Headsets', risk: lang === 'tr' ? 'Orta Risk (Niş Kitle)' : 'Medium Risk (Niche demographic)', score: 72, status: lang === 'tr' ? 'Zirvede' : 'Peak', competitors: lang === 'tr' ? 'Rakip yok' : 'No competitors yet' }
    ]
  };

  const competitorsData = lang === 'tr' ? [
    { name: 'Rakip A', postFrequency: 'Günde 2 video', adoptionSpeed: 'Çok Hızlı (1-2 gün)', successfulFormat: 'ASMR / Kutu Açılımı' },
    { name: 'Rakip B', postFrequency: 'Haftada 3 video', adoptionSpeed: 'Yavaş (5-7 gün)', successfulFormat: 'Eğitici / Nasıl Yapılır?' },
    { name: 'Rakip C', postFrequency: 'Günde 1 video', adoptionSpeed: 'Orta (3-4 gün)', successfulFormat: 'Mizah / Skeç' }
  ] : [
    { name: 'Competitor A', postFrequency: '2 videos / day', adoptionSpeed: 'Extremely Fast (1-2 days)', successfulFormat: 'ASMR / Unboxing' },
    { name: 'Competitor B', postFrequency: '3 videos / week', adoptionSpeed: 'Slow (5-7 days)', successfulFormat: 'Educational / How-to' },
    { name: 'Competitor C', postFrequency: '1 video / day', adoptionSpeed: 'Moderate (3-4 days)', successfulFormat: 'Humor / Sketch' }
  ];

  const handleGenerateCampaign = (e) => {
    e.preventDefault();
    if (userPlan === 'Starter Plan' && campaignQuota <= 0) {
      handleOpenUpgrade('Professional Plan', '500₺');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      const budgetNum = parseFloat(campaignBudget) || 50000;
      const influencerFee = Math.floor(budgetNum * 0.55);
      const paidAdsFee = Math.floor(budgetNum * 0.30);
      const productionFee = Math.floor(budgetNum * 0.15);

      const estViews = Math.floor(budgetNum * 4.5);
      const estClicks = Math.floor(budgetNum * 0.45);
      const estCpc = (budgetNum / estClicks).toFixed(2);
      const estRoi = (3.2 + (budgetNum % 10) * 0.1).toFixed(1);

      setCampaignOutput({
        title: lang === 'tr' ? 'TrendVista AI: Doğal Işıltı Kampanyası' : 'TrendVista AI: Glow & Radiance Campaign',
        tagline: lang === 'tr' ? 'Kendi Filtreni Kendin Yarat!' : 'Be Your Own Filter!',
        brief: lang === 'tr' ? 'Gen-Z kitlesini hedefleyen, salyangoz özü trendine entegre edilmiş, aşırı makyajdan uzak doğal cilt güzelliği konseptli bir viral kampanya planıdır.' : 'Gen-Z oriented skincare brief integrated into the snail mucin trend, highlighting raw natural look over heavy filter layers.',
        ideas: lang === 'tr' ? [
          { concept: 'Sihirli Damlalar Challange', description: 'Kullanıcıların ürünü ilk kullandıkları an ile 1 hafta sonraki cilt parlaklığı farkını split-screen (bölünmüş ekran) olarak paylaştıkları akım.' },
          { concept: 'Gece Bakımı ASMR', description: 'Rahatlatıcı ses efektleriyle gece cilt bakım rutininde ürünün estetik kullanımı.' },
          { concept: 'Güzellik Efsaneleri: Gerçek vs Yalan', description: 'Bir dermatolog creator ile popüler güzellik iddialarını inceleme ve ürünün bilimsel arkasını açıklama.' }
        ] : [
          { concept: 'Magic Drops Challenge', description: 'Users upload split-screen edits documenting skin glow progress on Day 1 vs Day 7 of application.' },
          { concept: 'Night Care ASMR Routine', description: 'Tranquil whispering, packaging crinkles, and macro fluid shots of the product application.' },
          { concept: 'Beauty Myths: True vs Fake', description: 'Co-creating content with derm creators debunking common ingredient myths.' }
        ],
        creators: lang === 'tr' ? [
          { id: 'ece', name: 'Ece Yıldırım', handle: '@ece_yildirim', followers: '450K', match: '%94 Uyum', rate: '8.4%', views: '280K', ageGroup: '18-24 (%65)', location: 'İstanbul', cost: 35000 },
          { id: 'can', name: 'Can Tekin', handle: '@can_tekin_gaming', followers: '1.2M', match: '%89 Uyum', rate: '6.2%', views: '750K', ageGroup: '18-24 (%50)', location: 'İzmir', cost: 75000 }
        ] : [
          { id: 'ece', name: 'Ece Yildirim', handle: '@ece_yildirim', followers: '450K', match: '94% Affinity', rate: '8.4%', views: '280K', ageGroup: '18-24 (65%)', location: 'Istanbul', cost: 35000 },
          { id: 'can', name: 'Can Tekin', handle: '@can_tekin_gaming', followers: '1.2M', match: '89% Affinity', rate: '6.2%', views: '750K', ageGroup: '18-24 (50%)', location: 'Izmir', cost: 75000 }
        ],
        riskMitigation: lang === 'tr' ? 'Telif içeren müzik kullanımları önlenecek, dermatolog onaylı açıklamalar kullanılacaktır.' : 'Avoid un-licensed sound assets; verify ingredient efficiency claims with certified professionals.',
        budget: budgetNum,
        influencerFee,
        paidAdsFee,
        productionFee,
        estViews,
        estClicks,
        estCpc,
        estRoi,
        seoHashtags: [
          { tag: '#doğalbakım', volume: '950K', competition: lang === 'tr' ? 'Düşük' : 'Low' },
          { tag: '#salyangozozu', volume: '1.4M', competition: lang === 'tr' ? 'Orta' : 'Medium' },
          { tag: '#genzbeauty', volume: '3.2M', competition: lang === 'tr' ? 'Yüksek' : 'High' },
          { tag: '#glowinggoals', volume: '820K', competition: lang === 'tr' ? 'Düşük' : 'Low' }
        ],
        seoKeywords: [
          { keyword: lang === 'tr' ? 'cilt bariyeri onarma' : 'skin barrier repair serum', volume: '580K', competition: lang === 'tr' ? 'Orta' : 'Medium' },
          { keyword: lang === 'tr' ? 'en temiz kozmetik ürünleri' : 'clean cosmetic brands', volume: '320K', competition: lang === 'tr' ? 'Düşük' : 'Low' },
          { keyword: lang === 'tr' ? 'cilt bakımı rutin önerileri' : 'skincare routines for genz', volume: '980K', competition: lang === 'tr' ? 'Yüksek' : 'High' }
        ]
      });

      if (userPlan === 'Starter Plan' && campaignQuota > 0) {
        setCampaignQuota(prev => prev - 1);
      }
      setGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
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

  const exportCampaignBriefAsMarkdown = () => {
    if (!campaignOutput) return;

    const text = `# ${campaignOutput.title}
*${campaignOutput.tagline}*

## ${lang === 'tr' ? 'Kampanya Özeti & Strateji' : 'Campaign Brief & Strategy'}
${campaignOutput.brief}

## ${lang === 'tr' ? 'Finansal Bütçe Dağılımı & ROI Tahminleri' : 'Financial Budget Allocation & ROI Forecasts'}
- **${lang === 'tr' ? 'Toplam Bütçe' : 'Total Budget'}**: ${campaignOutput.budget?.toLocaleString()}₺
- **${lang === 'tr' ? 'Influencer Ücretleri (55%)' : 'Influencer Fees (55%)'}**: ${campaignOutput.influencerFee?.toLocaleString()}₺
- **${lang === 'tr' ? 'Sponsorlu Reklamlar (30%)' : 'Paid Ads (30%)'}**: ${campaignOutput.paidAdsFee?.toLocaleString()}₺
- **${lang === 'tr' ? 'Kreatif Yapım (15%)' : 'Creative Production (15%)'}**: ${campaignOutput.productionFee?.toLocaleString()}₺
- **${lang === 'tr' ? 'Tahmini Görüntülenme' : 'Estimated Views'}**: ${campaignOutput.estViews?.toLocaleString()}
- **${lang === 'tr' ? 'Tahmini Tıklama' : 'Estimated Clicks'}**: ${campaignOutput.estClicks?.toLocaleString()}
- **${lang === 'tr' ? 'Tıklama Başı Maliyet (CPC)' : 'Cost Per Click (CPC)'}**: ${campaignOutput.estCpc}₺
- **${lang === 'tr' ? 'Öngörülen ROI Oranı' : 'Forecasted ROI Ratio'}**: ${campaignOutput.estRoi}x

## ${lang === 'tr' ? 'Yaratıcı Viral Konseptler' : 'Creative Viral Concepts'}
${campaignOutput.ideas?.map((idea) => `### ${idea.concept}
- ${idea.description}`).join('\n\n')}

## ${lang === 'tr' ? 'Eşleşen Öneri Creatorlar' : 'Suggested Matching Creators'}
${campaignOutput.creators?.map((c) => `- **${c.name}**: ${c.followers} (${c.match})`).join('\n')}

## ${lang === 'tr' ? 'Risk Yönetim Planı' : 'Risk Mitigation Plan'}
${campaignOutput.riskMitigation}
`;

    exportToMarkdown({ filename: `${campaignOutput.title}_brief`, content: text });
  };

  const handleSendProposal = (e) => {
    e.preventDefault();
    if (!proposalPrice || isNaN(proposalPrice)) return;

    setProposalState('sending');
    const offer = parseFloat(proposalPrice);

    setTimeout(() => {
      if (offer >= activeCreatorModal.cost) {
        setProposalState('accepted');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        const counter = activeCreatorModal.cost - Math.floor((activeCreatorModal.cost - offer) * 0.4);
        setCounterPrice(counter);
        setProposalState('counter_offer');
      }
    }, 1500);
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
  const isStarter = currentPlan === 'Starter Plan' || currentPlan === 'Free Plan';

  return (
    <div className={`workspace-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Sidebar */}
      <aside className="workspace-sidebar">
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="badge badge-coral" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
            <Crown size={10} />
            {userPlan}
          </span>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: '800' }}>{t[lang].sidebarTitle}</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

          {/* Section: Marka Stratejisi */}
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem 0.1rem 0.5rem' }}>
            🎯 {isTr ? 'Marka & Strateji' : 'Brand & Strategy'}
          </span>

          <button
            onClick={() => setActiveTab('radar')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'radar' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'radar' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'radar' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'radar' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'radar' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={16} style={{ color: activeTab === 'radar' ? 'var(--color-accent)' : 'inherit' }} /> {t[lang].tabRadar}
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'competitors' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'competitors' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'competitors' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'competitors' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'competitors' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <Target size={16} style={{ color: activeTab === 'competitors' ? 'var(--color-accent)' : 'inherit' }} /> {t[lang].tabCompetitors}
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'campaign' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'campaign' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'campaign' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'campaign' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'campaign' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={16} style={{ color: activeTab === 'campaign' ? 'var(--color-accent)' : 'inherit' }} /> {t[lang].tabCampaign}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'calendar' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'calendar' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'calendar' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'calendar' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'calendar' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: '0.35rem' }}>🗓️</span> {lang === 'tr' ? 'Kampanya Takvimi' : 'Campaign Calendar'}
          </button>

          {/* Section: Analitik & Teklifler */}
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.6rem 0.5rem 0.1rem 0.5rem' }}>
            📊 {lang === 'tr' ? 'Performans & Teklifler' : 'Performance & Deals'}
          </span>

          <button
            onClick={() => setActiveTab('analytics')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'analytics' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'analytics' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'analytics' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart2 size={16} style={{ color: activeTab === 'analytics' ? 'var(--color-accent)' : 'inherit' }} /> {lang === 'tr' ? 'Performans Analitiği' : 'Performance Analytics'}
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'inbox' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'inbox' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'inbox' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'inbox' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
              width: '100%',
              borderRadius: '8px',
              padding: '0.52rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'inbox' ? '700' : '500',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={16} style={{ color: activeTab === 'inbox' ? 'var(--color-accent)' : 'inherit' }} /> {lang === 'tr' ? 'Teklifler & Mesajlar' : 'Deals & Messages'}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
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
            onClick={() => setActiveTab('settings')}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'settings' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.18) 0%, rgba(225, 29, 72, 0.12) 100%)' : 'transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              borderLeft: activeTab === 'settings' ? '4px solid var(--color-accent)' : '4px solid transparent',
              boxShadow: activeTab === 'settings' ? '0 4px 12px rgba(255, 107, 107, 0.15)' : 'none',
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
        {isStarter && activeTab === 'radar' && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'rgba(255, 107, 107, 0.05)', borderColor: 'rgba(255, 107, 107, 0.2)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Crown size={18} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{t[lang].upgradeBanner}</span>
            </div>
            <button onClick={() => handleOpenUpgrade('Professional Plan', '500₺')} className="btn btn-glow-cyan" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b84141 100%)', boxShadow: '0 4px 15px rgba(255,107,107,0.3)' }}>
              {t[lang].upgradeBtn}
            </button>
          </div>
        )}

        {!isStarter && activeTab === 'radar' && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Crown size={18} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-success)', fontWeight: '600' }}>{t[lang].premiumActive}</span>
          </div>
        )}

        {/* TAB 1: SEKTÖREL RADAR */}
        {activeTab === 'radar' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].radarTitle}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].radarSub}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={selectedIndustry}
                  onChange={(e) => {
                    // Lock technology radar on Starter plan
                    if (isStarter && e.target.value === 'tech') {
                      handleOpenUpgrade('Professional Plan', '500₺');
                    } else {
                      setSelectedIndustry(e.target.value);
                    }
                  }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(5, 8, 17, 0.8)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="cosmetics">{t[lang].cosmeticsVal}</option>
                  <option value="tech" disabled={isStarter}>{t[lang].techVal} {isStarter ? '🔒' : ''}</option>
                </select>
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
                justifyContent: 'space-between',
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
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Radio size={18} style={{ color: '#ef4444' }} />
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {lang === 'tr' ? 'Canlı Pazar Trend API Akışı' : 'Live Market Trend API Stream'}
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{liveApiStatus.source}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {lang === 'tr' ? 'Son Senkronizasyon:' : 'Last Synced:'} {liveApiStatus.timestamp || 'Anlık'}
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
                  onClick={() => loadTrends(selectedRegion)}
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

              {/* Platform Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%' }}>
                {[
                  { key: 'all', label: lang === 'tr' ? '🌐 Tüm Platformlar' : '🌐 All Platforms' },
                  { key: 'TikTok', label: '🎵 TikTok Trendleri' },
                  { key: 'Instagram', label: '📸 Instagram Reels' },
                  { key: 'YouTube', label: '▶️ YouTube Shorts/Popular' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      setPlatformFilter(p.key);
                      loadTrends(p.key, selectedRegion);
                    }}
                    className={`btn ${platformFilter === p.key ? 'btn-glow-cyan' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '20px' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Alerts Box */}
            <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255, 107, 107, 0.05)', borderColor: 'rgba(255, 107, 107, 0.2)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <AlertTriangle style={{ color: 'var(--color-accent)', flexShrink: 0 }} size={24} />
              <div>
                <h4 style={{ color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: '600' }}>{t[lang].krizTitle}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t[lang].krizDesc}</p>
              </div>
            </div>

            {/* Radar Table */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                    <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{t[lang].tableTrend}</th>
                    <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{t[lang].tableMatch}</th>
                    <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{t[lang].tableStatus}</th>
                    <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{t[lang].tableRisk}</th>
                    <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{t[lang].tableCompetitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {brandTrends[selectedIndustry].map((trend) => (
                    <tr key={trend.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1.25rem 0.75rem', fontWeight: '600', color: 'var(--color-text)' }}>{trend.name}</td>
                      <td style={{ padding: '1.25rem 0.75rem' }}>
                        <span style={{ color: trend.score > 80 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 'bold' }}>
                          %{trend.score}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 0.75rem' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{trend.status}</span>
                      </td>
                      <td style={{ padding: '1.25rem 0.75rem' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          color: trend.risk.includes('Düşük') || trend.risk.includes('Low') ? 'var(--color-success)' : trend.risk.includes('Orta') || trend.risk.includes('Medium') ? 'var(--color-warning)' : 'var(--color-accent)'
                        }}>
                          {trend.risk}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{trend.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: COMPETITOR INTELLIGENCE */}
        {activeTab === 'competitors' && (
          <div>
            {userPlan === 'Free Plan' ? (
              <div className="glass-card animate-float" style={{ padding: '5rem 2rem', textAlign: 'center', border: '1px solid rgba(255, 107, 107, 0.25)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 107, 107, 0.1)', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                  <Lock size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                  {lang === 'tr' ? 'Rakip Analizi Kilitli' : 'Competitor Intelligence Locked'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                  {lang === 'tr'
                    ? 'Rakiplerinizin performans verilerini, içerik stratejilerini ve pazar paylarını detaylıca incelemek için hesabınızı yükseltin!'
                    : 'Upgrade your subscription to unlock deep-dive competitor analytics, performance metrics, and content strategy insights.'}
                </p>
                <button onClick={() => setUserPlan(null)} className="btn btn-primary" style={{ padding: '0.65rem 2.5rem' }}>
                  {lang === 'tr' ? 'Şimdi Yükselt' : 'Upgrade Now'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].tabCompetitors}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].radarSub}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].statFastest}</span>
                    <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', marginTop: '0.25rem' }}>Rakip A</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>{t[lang].statFastestSub}</span>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t[lang].statMissed}</span>
                    <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', marginTop: '0.25rem' }}>{isStarter ? '1 Trend' : '4 Trend'}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{t[lang].statMissedSub}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '1.2rem' }}>{t[lang].compTitle}</h3>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                        <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t[lang].compName}</th>
                        <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t[lang].compFrequency}</th>
                        <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t[lang].compSpeed}</th>
                        <th style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t[lang].compFormat}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitorsData.filter((_, index) => !isStarter || index === 0).map((comp, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '1.25rem 0.75rem', fontWeight: '600', color: 'var(--color-text)' }}>{comp.name}</td>
                          <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{comp.postFrequency}</td>
                          <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{comp.adoptionSpeed}</td>
                          <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.9rem', color: 'var(--color-secondary)' }}>{comp.successfulFormat}</td>
                        </tr>
                      ))}

                      {isStarter && (
                        <tr style={{ opacity: 0.5, background: 'rgba(255, 107, 107, 0.02)' }}>
                          <td colSpan="4" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--color-accent)' }}>
                            <Lock size={12} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Diğer rakipleri izlemek için Professional Plan'a yükseltin!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Competitor Comparison Matrix */}
                <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid rgba(255, 107, 107, 0.15)' }}>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        ⚔️ {lang === 'tr' ? 'Rakip Kıyaslama & Analiz Matrisi' : 'Competitor Comparison Matrix'}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {lang === 'tr' ? 'Sektör rakiplerinizle haftalık performans karşılaştırma ve kitle erişim analiz grafiği.' : 'Weekly performance benchmark and reach trajectory comparisons against top industry rivals.'}
                      </p>
                    </div>

                    {/* Competitor filter selectors */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[
                        { code: 'Competitor A', label: lang === 'tr' ? 'Rakip A (Güzellik)' : 'Competitor A' },
                        { code: 'Competitor B', label: lang === 'tr' ? 'Rakip B (Kozmetik)' : 'Competitor B' },
                        { code: 'Competitor C', label: lang === 'tr' ? 'Rakip C (Wellness)' : 'Competitor C' }
                      ].map((comp, idx) => {
                        // Lock B & C on Starter Plan
                        const isLocked = isStarter && idx > 0;
                        return (
                          <button
                            key={comp.code}
                            type="button"
                            disabled={isLocked}
                            onClick={() => setActiveCompetitor(comp.code)}
                            className={`btn ${activeCompetitor === comp.code ? 'btn-glow-cyan' : 'btn-secondary'}`}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              opacity: isLocked ? 0.4 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            {isLocked && <Lock size={10} />}
                            {comp.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Two-Column Grid: SVG Graph vs Side-by-Side metrics table */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Column 1: SVG Dual-Line Weekly Graph */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
                          📈 {lang === 'tr' ? 'Haftalık Takipçi Kazanım Eğrisi' : 'Weekly Follower Growth Curves'}
                        </span>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-secondary)' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
                            {lang === 'tr' ? 'Sizin Markanız' : 'Your Brand'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-accent)' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                            {activeCompetitor}
                          </span>
                        </div>
                      </div>

                      {/* SVG Line Graph charting comparison values dynamically */}
                      {(() => {
                        // Simulated data coordinates based on active competitor selection
                        const chartData = activeCompetitor === 'Competitor A'
                          ? { own: 'M 0 15 Q 25 12 50 8 T 100 2', comp: 'M 0 18 Q 25 16 50 14 T 100 11' }
                          : activeCompetitor === 'Competitor B'
                            ? { own: 'M 0 15 Q 25 12 50 8 T 100 2', comp: 'M 0 12 Q 25 9 50 7 T 100 1' }
                            : { own: 'M 0 15 Q 25 12 50 8 T 100 2', comp: 'M 0 19 Q 25 15 50 12 T 100 9' };

                        return (
                          <div style={{ height: '110px', width: '100%' }}>
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                              {/* Own brand path */}
                              <path d={chartData.own} fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                              {/* Competitor path */}
                              <path d={chartData.comp} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3,1" strokeLinecap="round" />
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                              <span>Pzt</span>
                              <span>Çar</span>
                              <span>Cuma</span>
                              <span>Pazar</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Column 2: Sleek Side-by-Side metrics table */}
                    {(() => {
                      // Stats mapping
                      const stats = activeCompetitor === 'Competitor A'
                        ? { ownRate: '6.4%', compRate: '5.2%', ownViews: '420K', compViews: '310K', ownGrowth: '+14.5%', compGrowth: '+9.2%' }
                        : activeCompetitor === 'Competitor B'
                          ? { ownRate: '6.4%', compRate: '7.1%', ownViews: '420K', compViews: '490K', ownGrowth: '+14.5%', compGrowth: '+18.4%' }
                          : { ownRate: '6.4%', compRate: '4.8%', ownViews: '420K', compViews: '250K', ownGrowth: '+14.5%', compGrowth: '+7.5%' };

                      const isHigherRate = parseFloat(stats.ownRate) >= parseFloat(stats.compRate);
                      const isHigherViews = parseFloat(stats.ownViews) >= parseFloat(stats.compViews);
                      const isHigherGrowth = parseFloat(stats.ownGrowth) >= parseFloat(stats.compGrowth);

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                          {/* Row 1: Engagement Rate */}
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {lang === 'tr' ? 'Etkileşim Oranı' : 'Engagement Rate'}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                {stats.ownRate} vs {stats.compRate}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: isHigherRate ? 'rgba(16,185,129,0.1)' : 'rgba(255,107,107,0.1)', color: isHigherRate ? 'var(--color-success)' : 'var(--color-accent)' }}>
                              {isHigherRate ? (lang === 'tr' ? 'Öndesiniz' : 'Leading') : (lang === 'tr' ? 'Geride' : 'Behind')}
                            </span>
                          </div>

                          {/* Row 2: Average Views */}
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {lang === 'tr' ? 'Ortalama İzlenme' : 'Avg Views'}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                {stats.ownViews} vs {stats.compViews}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: isHigherViews ? 'rgba(16,185,129,0.1)' : 'rgba(255,107,107,0.1)', color: isHigherViews ? 'var(--color-success)' : 'var(--color-accent)' }}>
                              {isHigherViews ? (lang === 'tr' ? 'Öndesiniz' : 'Leading') : (lang === 'tr' ? 'Geride' : 'Behind')}
                            </span>
                          </div>

                          {/* Row 3: Monthly Growth */}
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {lang === 'tr' ? 'Aylık Takipçi Büyümesi' : 'Monthly Growth'}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                {stats.ownGrowth} vs {stats.compGrowth}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: isHigherGrowth ? 'rgba(16,185,129,0.1)' : 'rgba(255,107,107,0.1)', color: isHigherGrowth ? 'var(--color-success)' : 'var(--color-accent)' }}>
                              {isHigherGrowth ? (lang === 'tr' ? 'Öndesiniz' : 'Leading') : (lang === 'tr' ? 'Geride' : 'Behind')}
                            </span>
                          </div>

                        </div>
                      );
                    })()}

                  </div>
                </div>


              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI CAMPAIGN ENGINE */}
        {activeTab === 'campaign' && (
          <div>
            {userPlan === 'Free Plan' ? (
              <div className="glass-card animate-float" style={{ padding: '5rem 2rem', textAlign: 'center', border: '1px solid rgba(255, 107, 107, 0.25)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 107, 107, 0.1)', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                  <Lock size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                  {lang === 'tr' ? 'AI Kampanya Motoru Kilitli' : 'AI Campaign Engine Locked'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                  {lang === 'tr'
                    ? 'AI ile saniyeler içerisinde trendlere uyumlu otomatik brief ve pazarlama planları hazırlamak için hesabınızı yükseltin!'
                    : 'Upgrade your subscription to unlock AI marketing plans, creator recommendations, and risk assessment briefs instantly!'}
                </p>
                <button onClick={() => setUserPlan(null)} className="btn btn-primary" style={{ padding: '0.65rem 2.5rem' }}>
                  {lang === 'tr' ? 'Şimdi Yükselt' : 'Upgrade Now'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t[lang].campaignTitle}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t[lang].campaignSub}</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <form onSubmit={handleGenerateCampaign} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{t[lang].productLabel}</label>
                      <input
                        type="text"
                        placeholder={t[lang].productPlaceholder}
                        value={campaignInput.product}
                        onChange={(e) => setCampaignInput(prev => ({ ...prev, product: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(5, 8, 17, 0.8)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                        {lang === 'tr' ? 'Kampanya Bütçesi (₺)' : 'Campaign Budget ($)'}
                      </label>
                      <input
                        type="number"
                        value={campaignBudget}
                        onChange={(e) => setCampaignBudget(e.target.value)}
                        required
                        min="1000"
                        style={{
                          width: '100%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(5, 8, 17, 0.8)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{t[lang].targetLabel}</label>
                      <select
                        value={campaignInput.target}
                        onChange={(e) => setCampaignInput(prev => ({ ...prev, target: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(5, 8, 17, 0.8)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="genz">Gen-Z (18-25 Yaş)</option>
                        <option value="millennials">Millennials (26-40 Yaş)</option>
                        <option value="professional">Profesyoneller / İş Dünyası</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{t[lang].toneLabel}</label>
                      <select
                        value={campaignInput.tone}
                        onChange={(e) => setCampaignInput(prev => ({ ...prev, tone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(5, 8, 17, 0.8)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="energetic">Enerjik & Dinamik</option>
                        <option value="professional">Kurumsal & Güvenilir</option>
                        <option value="humorous">Eğlenceli & Samimi</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{t[lang].platformLabel}</label>
                      <select
                        value={campaignInput.platform}
                        onChange={(e) => setCampaignInput(prev => ({ ...prev, platform: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(5, 8, 17, 0.8)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="tiktok">TikTok Shorts / Reels</option>
                        <option value="youtube">YouTube Uzun Video</option>
                        <option value="linkedin">LinkedIn Yazı + Görsel</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={generating || (isStarter && campaignQuota <= 0)}
                        className="btn btn-glow-coral"
                        style={{ width: '100%', padding: '0.9rem' }}
                      >
                        {generating ? t[lang].generatingMsg : t[lang].generateCampaignBtn}
                      </button>
                    </div>
                  </form>

                  {isStarter && campaignQuota <= 0 && (
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center', fontWeight: '600' }}>
                      {t[lang].limitWarning}
                    </p>
                  )}
                </div>

                {/* CAMPAIGN OUTPUT */}
                {generating && (
                  <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 107, 107, 0.1)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
                    <h4 style={{ color: 'var(--color-text-muted)' }}>{t[lang].generatingMsg}</h4>
                  </div>
                )}

                {!generating && campaignOutput && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Brief Details */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                      <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>{t[lang].ideasTitle}</h3>
                        <button
                          onClick={() => copyToClipboard(campaignOutput.brief, 'brief')}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          {copiedText === 'brief' ? t[lang].copiedMsg : <Copy size={14} />} {t[lang].copyBtn}
                        </button>
                        <button
                          onClick={() => exportBrandBriefToPdf({ briefOutput: campaignOutput, campaignInput, lang })}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                        >
                          📄 {lang === 'tr' ? 'PDF Brief İndir' : 'Download PDF Brief'}
                        </button>
                        <button
                          onClick={exportCampaignBriefAsMarkdown}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)', color: 'var(--color-accent)' }}
                        >
                          📥 {lang === 'tr' ? 'Brief İndir (.md)' : 'Download Brief (.md)'}
                        </button>
                      </div>
                      <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
                        {campaignOutput.brief}
                      </div>
                    </div>

                    {/* Creators and Risk Assessment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                      {/* Budget ROI and Allocation dashboard */}
                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
                          💰 {lang === 'tr' ? 'Bütçe ROI & Kanal Dağılımı' : 'Budget ROI & Channel Allocation'}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Toplam Bütçe' : 'Total Budget'}</span>
                            <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 'bold' }}>{campaignOutput.budget?.toLocaleString()}₺</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Öngörülen ROI' : 'Forecasted ROI'}</span>
                            <span style={{ fontSize: '1.1rem', color: 'var(--color-success)', fontWeight: 'bold' }}>{campaignOutput.estRoi}x</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Tahmini Gösterim' : 'Est. Impressions'}</span>
                            <span style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{campaignOutput.estViews?.toLocaleString()}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Tıklama Başı Maliyet' : 'Est. CPC'}</span>
                            <span style={{ fontSize: '1.1rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{campaignOutput.estCpc}₺</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          <div>
                            <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>📣 {lang === 'tr' ? 'Influencer Ücretleri (55%)' : 'Influencer Fees (55%)'}</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>{campaignOutput.influencerFee?.toLocaleString()}₺</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: '55%', height: '100%', background: 'var(--color-secondary)' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>🎯 {lang === 'tr' ? 'Sponsorlu Reklamlar (30%)' : 'Paid Ads (30%)'}</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>{campaignOutput.paidAdsFee?.toLocaleString()}₺</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: '30%', height: '100%', background: 'var(--color-accent)' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>🎨 {lang === 'tr' ? 'Kreatif Yapım (15%)' : 'Creative Production (15%)'}</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>{campaignOutput.productionFee?.toLocaleString()}₺</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: '15%', height: '100%', background: 'var(--color-success)' }} />
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{t[lang].creatorsTitle}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {campaignOutput.creators.map((c, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setActiveCreatorModal(c);
                                setProposalPrice(c.cost.toString());
                                setProposalState('idle');
                              }}
                              className="creator-list-row"
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.6rem 0.5rem',
                                borderBottom: idx < campaignOutput.creators.length - 1 ? '1px solid var(--color-border)' : 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div>
                                <h5 style={{ color: '#fff', fontSize: '0.85rem', textDecoration: 'underline' }}>{c.handle}</h5>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.followers} {t[lang].followersLabel}</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: '600' }}>
                                %{c.fit} {t[lang].matchRate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255, 107, 107, 0.05)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                          <Shield size={16} /> {t[lang].riskTitle}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                          {campaignOutput.riskPlan}
                        </p>
                      </div>

                      {/* SEO & Hashtag Laboratuvarı card */}
                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                            🏷️ {lang === 'tr' ? 'SEO & Hashtag Laboratuvarı' : 'SEO & Hashtags Lab'}
                          </h3>
                          <button
                            onClick={() => {
                              const tagsStr = (campaignOutput.seoHashtags?.map(h => h.tag).join(' ') || '') + ' ' + (campaignOutput.seoKeywords?.map(k => k.keyword).join(', ') || '');
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
                            {campaignOutput.seoHashtags?.map((h, idx) => (
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
                            {campaignOutput.seoKeywords?.map((k, idx) => (
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
                    </div>
                  </div>
                )}

                {/* AI CAMPAIGN SCORER (AI Performance Predictor) */}
                <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={18} color="var(--color-accent)" /> {lang === 'tr' ? 'AI Kampanya Fikri Skorer' : 'AI Campaign Scorer'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {lang === 'tr'
                        ? 'Geliştirdiğiniz reklam fikrini veya brief başlığını girin, yapay zeka viral etkileşim potansiyelini ve hedef kitle uyum grafiğini analiz etsin.'
                        : 'Enter your custom marketing brief draft to forecast engagement ROI, virality probability, and audience retention.'}
                    </p>
                  </div>

                  <form onSubmit={handleScoreIdea} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      required
                      value={customIdea}
                      onChange={(e) => setCustomIdea(e.target.value)}
                      placeholder={lang === 'tr' ? 'Örn: "Yeni ruj serimiz için TikTok influencer kutu açılımı kampanyası..."' : 'e.g. "TikTok unboxing campaign with micro-influencers for our new lip balm..."'}
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
                      style={{ minWidth: '150px', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b84141 100%)' }}
                    >
                      {predicting ? '...' : (lang === 'tr' ? 'Skoru Hesapla' : 'Predict Score')}
                    </button>
                  </form>

                  {/* Scorer results */}
                  {predicting && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255, 107, 107, 0.1)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}

                  {!predicting && predictorResult && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginTop: '1rem' }}>
                      {/* Metric Scores */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                          <div className="flex-between" style={{ marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>
                              ⚡ {lang === 'tr' ? 'Brief Kalitesi (Brief Score)' : 'Brief Strength'}
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
                              🔥 {lang === 'tr' ? 'Viral Olma Potansiyeli' : 'Viral Probability'}
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
                              🎯 {lang === 'tr' ? 'Pazar/Kitle Uyumu' : 'Market/Audience Fit'}
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
                          📈 {lang === 'tr' ? 'Tahmini Kitle Tutma Eğrisi' : 'Estimated Viewer Retention Curve'}
                        </h4>
                        <div style={{ height: '100px', width: '100%', position: 'relative' }}>
                          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '80px', display: 'block' }}>
                            {/* Retention curve path */}
                            <path
                              d={`M 0 0 C 25 ${30 - predictorResult.retention[1] * 0.3}, 50 ${30 - predictorResult.retention[2] * 0.3}, 100 ${30 - predictorResult.retention[4] * 0.3}`}
                              fill="none"
                              stroke="var(--color-accent)"
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

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  {lang === 'tr' ? 'Profil & Ayarlar' : 'Profile & Settings'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {lang === 'tr' ? 'Marka hesap bilgilerinizi güncelleyin ve ödeme geçmişinizi inceleyin.' : 'Update your brand details, invoice logs, and platform configurations.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Profile details form */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  {lang === 'tr' ? 'Kişisel & Şirket Bilgileri' : 'Brand Information'}
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

                  {/* Name field */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      {lang === 'tr' ? 'Marka Temsilci Adı' : 'Brand Rep Name'}
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
                      {lang === 'tr' ? 'Sektör Kapsamı' : 'Industry Niche'}
                    </label>
                    <select
                      value={profileNiche}
                      onChange={(e) => setProfileNiche(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    >
                      <option value="Kozmetik & Güzellik">{lang === 'tr' ? 'Kozmetik & Güzellik' : 'Cosmetics & Beauty'}</option>
                      <option value="Teknoloji & Yazılım">{lang === 'tr' ? 'Teknoloji & Yazılım' : 'Tech & Software'}</option>
                      <option value="Gıda & Restoran">{lang === 'tr' ? 'Gıda & Restoran' : 'Food & Restaurant'}</option>
                      <option value="Finans & Yatırım">{lang === 'tr' ? 'Finans & Yatırım' : 'Finance & Investment'}</option>
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

        {/* Campaign Calendar Tab */}
        {activeTab === 'calendar' && (
          <ContentCalendar
            lang={lang}
            scheduledItems={scheduledItems}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {/* Analytics Dashboard Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            lang={lang}
            role="brand"
          />
        )}

        {/* Deal Inbox & Direct Chat Tab */}
        {activeTab === 'inbox' && (
          <DealInbox
            lang={lang}
            role="brand"
          />
        )}

        {/* Saved Trends Bookmarks Tab */}
        {activeTab === 'saved' && (
          <SavedTrendsLibrary
            lang={lang}
            savedTrends={savedTrends}
            onRemoveBookmark={(id) => setSavedTrends(prev => prev.filter(t => t.id !== id))}
            onUseInStudio={() => {
              setActiveTab('brief');
            }}
          />
        )}
      </main>

      {/* Influencer Detail & Deal Negotiation Simulator Modal */}
      {activeCreatorModal && (
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
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="glass-card animate-float" style={{ width: '100%', maxWidth: '520px', padding: '2rem', border: '1px solid rgba(255, 107, 107, 0.25)', animation: 'none', position: 'relative' }}>
            <button
              onClick={() => setActiveCreatorModal(null)}
              className="btn btn-secondary"
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', padding: '0.4rem', borderRadius: '50%' }}
            >
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👤</div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 'bold' }}>{activeCreatorModal.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{activeCreatorModal.handle}</span>
            </div>

            {/* Stats section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Takipçi Sayısı' : 'Followers'}</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{activeCreatorModal.followers}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Ort. Görüntülenme' : 'Avg. Views'}</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{activeCreatorModal.views}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Etkileşim Oranı' : 'Engagement Rate'}</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{activeCreatorModal.rate}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Hedef Kitle' : 'Top Audience'}</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{activeCreatorModal.ageGroup}</span>
              </div>
            </div>

            {/* Negotiation Simulation Status and Forms */}
            {proposalState === 'idle' && (
              <form onSubmit={handleSendProposal}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  {lang === 'tr' ? 'Teklif Etmek İstediğiniz Ücret (₺)' : 'Budget Proposal Offer ($)'}
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    required
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(e.target.value)}
                    style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(5, 8, 17, 0.6)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button type="submit" className="btn btn-glow-cyan" style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b84141 100%)' }}>
                    {lang === 'tr' ? 'Teklif Gönder' : 'Send Offer'}
                  </button>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                  * {lang === 'tr' ? `Creator varsayılan talep fiyatı: ${activeCreatorModal.cost.toLocaleString()}₺` : `Creator default request cost: $${activeCreatorModal.cost.toLocaleString()}`}
                </span>
              </form>
            )}

            {proposalState === 'sending' && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255, 107, 107, 0.1)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {lang === 'tr' ? 'Creator teklifi inceliyor, lütfen bekleyin...' : 'Creator is reviewing your proposal offer, please wait...'}
                </p>
              </div>
            )}

            {proposalState === 'accepted' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid var(--color-success)', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', marginBottom: '1rem' }}>
                  <Check size={24} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--color-success)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {lang === 'tr' ? 'Teklif Kabul Edildi!' : 'Proposal Accepted!'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                  {lang === 'tr'
                    ? `${activeCreatorModal.name} teklifinizi onayladı. Akıllı kampanya anlaşması imzalandı, ortak çalışma alanı açılıyor.`
                    : `${activeCreatorModal.name} has approved your offer. Smart partnership deal successfully signed!`}
                </p>
                <button onClick={() => setActiveCreatorModal(null)} className="btn btn-secondary" style={{ width: '100%' }}>
                  {lang === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </div>
            )}

            {proposalState === 'counter_offer' && (
              <div>
                <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid var(--color-accent)', padding: '0.75rem 1rem', borderRadius: '6px', color: 'var(--color-accent)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  ⚠️ {lang === 'tr'
                    ? `Teklifiniz reddedildi. Creator karşı teklif (Counter-Offer) iletti.`
                    : `Your offer was rejected. Creator sent a counter-offer proposal.`}
                </div>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>{lang === 'tr' ? 'Creator Karşı Teklif Talebi' : 'Creator Counter-Offer Request'}</span>
                  <span style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>{counterPrice.toLocaleString()}₺</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setProposalState('accepted');
                      confetti({
                        particleCount: 80,
                        spread: 60,
                        origin: { y: 0.6 }
                      });
                    }}
                    className="btn btn-glow-cyan"
                    style={{ background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)' }}
                  >
                    {lang === 'tr' ? 'Kabul Et ve Anlaş' : 'Accept & Sign'}
                  </button>
                  <button
                    onClick={() => {
                      setProposalPrice(counterPrice.toString());
                      setProposalState('idle');
                    }}
                    className="btn btn-secondary"
                  >
                    {lang === 'tr' ? 'Teklifi Revize Et' : 'Revise Price'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
        border: '1px solid rgba(255, 107, 107, 0.2)',
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
                background: 'rgba(255, 107, 107, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
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
              style={{ width: '100%', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b84141 100%)' }}
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
              border: '3px solid rgba(255, 107, 107, 0.1)',
              borderTopColor: 'var(--color-accent)',
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
