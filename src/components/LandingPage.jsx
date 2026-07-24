import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight,
  Layers,
  Shield,
  MessageSquare,
  CreditCard,
  X,
  Lock,
  Check,
  Star,
  User,
  Send,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { chatWithAiAssistant, isGeminiEnabled } from '../lib/gemini.js';
import LegalNoticeModal from './LegalNoticeModal.jsx';

// Translations covering 10 languages: TR, EN, DE, FR, ES, IT, RU, JA, ZH, AR
const t = {
  tr: {
    heroBadge: 'AI Trend İşletim Sistemi',
    heroTitle1: 'Sosyal Medyadaki',
    heroTitle2: 'Yükselen Trendleri',
    heroTitle3: 'Doygunlaşmadan Yakalayın',
    heroDesc: 'TrendVista; TikTok, Instagram ve YouTube\'daki viral sinyalleri erkenden algılar, AI ile markanıza veya kanalınıza özel içerik fikirlerine dönüştürür.',
    heroBtnCreator: 'Creator Alanı',
    heroBtnBrand: 'Brand Alanı',
    statAccuracy: 'Doğru Trend Tahmini',
    statEngagement: 'Daha Yüksek Etkileşim',
    statAlert: 'Erken Uyarı Süresi',
    radarTitle: 'Canlı Trend Radarı',
    radarSub: 'Farklı kategoriler seçerek trend eşleşmelerini simüle edebilirsiniz.',
    howItWorksTitle: 'Trend Keşfinin 6 Adımlı Gücü',
    howItWorksSub: 'TrendVista, sosyal verileri analiz edip bunları viral performans kartlarına ve kampanya brieflerine dönüştüren kapalı döngü bir motordur.',
    pricingTitle: 'Yatırım Planları ve Üyelikler',
    pricingSub: 'Size en uygun olan lisans seviyesini seçerek trend avantajını bugünden elde edin.',
    buyBtn: 'Planı Satın Al',
    checkoutTitle: 'Güvenli Ödeme',
    cardHolderLabel: 'Kart Sahibi',
    cardNumberLabel: 'Kart Numarası',
    payBtn: 'Ödemeyi Tamamla',
    paying: 'Ödeme İşleniyor...',
    successTitle: 'Ödeme Başarılı!',
    successDesc: 'Aboneliğiniz başarıyla aktif edilmiştir. TrendVista dünyasına hoş geldiniz!',
    close: 'Kapat',
    testimonialsTitle: 'Kullanıcı Geri Bildirimleri',
    testimonialsSub: 'Dünyanın dört bir yanından creator ve markaların TrendVista ile elde ettiği viral başarılar.',
    chatbotWelcome: 'Merhaba! Ben TrendVista AI asistanıyım. Size nasıl yardımcı olabilirim?',
    chatPlaceholder: 'Bir soru sorun...',
    quickPricing: 'Paket fiyatları nedir?',
    quickHow: 'Sistem nasıl çalışır?',
    quickConnect: 'Kanalımı nasıl bağlarım?',
    botReplyPricing: 'TrendVista 3 ücretli plan sunar: Starter (200₺), Professional (500₺) ve Enterprise (800₺). Profilinize en uygun olanı seçerek başlayabilirsiniz.',
    botReplyHow: 'TrendVista sosyal medyadaki viral akımları erkenden tespit eder, profilinizle uyum skorunu hesaplar ve size özel video senaryosu üretir.',
    botReplyConnect: 'Oturum açtıktan sonra, Creator panelindeki "Hesap Bağlantıları" sekmesinden TikTok, Instagram veya YouTube hesabınızı tek tıkla bağlayabilirsiniz.',
    categoryBeauty: 'Güzellik & Kozmetik',
    categoryTech: 'Teknoloji & AI',
    categoryFashion: 'Moda & Stil',
    categoryGaming: 'Oyun & Espor',
    categoryFood: 'Yemek & Gastronomi',
    categoryFitness: 'Sağlık & Spor',
    step1: '1. Profil Analizi', step1Desc: 'Sosyal kanallarınızı bağlayın. Kitle veriniz ve geçmiş performansınız saniyeler içinde analiz edilir.',
    step2: '2. Yükselen Akım Keşfi', step2Desc: 'TikTok, Reels ve Shorts ağlarındaki global viral sinyaller algoritmik olarak taranır.',
    step3: '3. Uyum Skoru Eşleşmesi', step3Desc: 'Yapay zeka, her trendi hedef kitlenizin demografik yapısıyla karşılaştırıp uyum puanı üretir.',
    step4: '4. AI Senaryo Hazırlığı', step4Desc: 'Eşleşen trende özel kanca (hook), video akışı ve ses metni saniyeler içinde stüdyoda hazırlanır.',
    step5: '5. Kampanya Entegrasyonu', step5Desc: 'Markalar için trende uyumlu AI kampanya motoru ile otomatik briefler ve creator listeleri oluşturulur.',
    step6: '6. Performans Geri Besleme', step6Desc: 'Yayınlanan videoların performans verileri toplanarak sonraki trend önerileri daha akıllı hale getirilir.'
  },
  en: {
    heroBadge: 'AI Trend Operating System',
    heroTitle1: 'Capture the',
    heroTitle2: 'Rising Trends',
    heroTitle3: 'Before They Saturate',
    heroDesc: 'TrendVista captures viral signals on TikTok, Instagram and YouTube early, converting them into custom content and campaign ideas tailored to your channel or brand.',
    heroBtnCreator: 'Creator Hub',
    heroBtnBrand: 'Brand Hub',
    statAccuracy: 'Accurate Trend Forecast',
    statEngagement: 'Higher Engagement',
    statAlert: 'Early Warning Window',
    radarTitle: 'Live Trend Radar',
    radarSub: 'Select different categories to simulate trend matches.',
    howItWorksTitle: '6-Step Trend Intelligence Flow',
    howItWorksSub: 'TrendVista is a closed-loop engine that analyzes social data and transforms it into viral performance briefs and campaign files.',
    pricingTitle: 'Investment Plans & Memberships',
    pricingSub: 'Select the subscription model that best fits your budget scale, creative goals and business volume.',
    buyBtn: 'Subscribe Now',
    checkoutTitle: 'Secure Checkout',
    cardHolderLabel: 'Cardholder Name',
    cardNumberLabel: 'Card Number',
    payBtn: 'Complete Payment',
    paying: 'Processing Payment...',
    successTitle: 'Payment Successful!',
    successDesc: 'Your subscription has been activated successfully. Welcome to TrendVista!',
    close: 'Close',
    testimonialsTitle: 'User Testimonials',
    testimonialsSub: 'See how creators and brands worldwide achieve viral growth using TrendVista.',
    chatbotWelcome: 'Hello! I am the TrendVista AI Assistant. How can I help you today?',
    chatPlaceholder: 'Type a question...',
    quickPricing: 'What are the plans?',
    quickHow: 'How does it work?',
    quickConnect: 'How do I connect my channel?',
    botReplyPricing: 'TrendVista offers 3 paid plans: Starter (200₺), Professional (500₺) and Enterprise (800₺). Choose the best tier for your workspace.',
    botReplyHow: 'TrendVista identifies rising viral signals early, computes an affinity score with your channel, and generates custom script formats.',
    botReplyConnect: 'After logging in, go to the "Connected Channels" tab inside the Creator Workspace to link TikTok, Instagram, or YouTube.',
    categoryBeauty: 'Beauty & Cosmetics',
    categoryTech: 'Tech & AI',
    categoryFashion: 'Fashion & Style',
    categoryGaming: 'Gaming & Esports',
    categoryFood: 'Food & Cooking',
    categoryFitness: 'Fitness & Health',
    step1: '1. Profile Audit', step1Desc: 'Link your social channels. Your target audience demographics and metrics are indexed.',
    step2: '2. Signal Capture', step2Desc: 'Global viral vectors from TikTok, Reels, and Shorts are parsed in real time.',
    step3: '3. Affinity Matching', step3Desc: 'AI computes a match score between your channel persona and rising trend graphs.',
    step4: '4. Script Drafting', step4Desc: 'Get customized viral hooks, editing drafts, and complete scripts ready in the AI Studio.',
    step5: '5. Brand Campaigns', step5Desc: 'Auto-generate trend-aligned brief books and targeted creator safety parameters.',
    step6: '6. Closed-Loop Feed', step6Desc: 'Video performances feed back into the learning model, making your next signals even more accurate.'
  },
  de: {
    heroBadge: 'KI-Trend-Betriebssystem',
    heroTitle1: 'Erfassen Sie die',
    heroTitle2: 'Aufsteigenden Trends',
    heroTitle3: 'Bevor sie sättigen',
    heroDesc: 'TrendVista erkennt virale Signale auf TikTok, Instagram und YouTube frühzeitig und konvertiert sie in maßgeschneiderte Inhalte.',
    heroBtnCreator: 'Creator-Bereich',
    heroBtnBrand: 'Marken-Bereich',
    statAccuracy: 'Genaue Trendprognose',
    statEngagement: 'Höheres Engagement',
    statAlert: 'Frühwarnfenster',
    radarTitle: 'Live Trend Radar',
    radarSub: 'Wählen Sie Kategorien aus, um Trendübereinstimmungen zu simulieren.',
    howItWorksTitle: 'Der 6-Schritte-Ablauf',
    howItWorksSub: 'TrendVista analysiert soziale Daten und konvertiert sie in virale Drehbücher und Kampagnenbriefs.',
    pricingTitle: 'Investitionspläne & Abonnements',
    pricingSub: 'Wählen Sie die Lizenzstufe, die am besten zu Ihren Zielen und Ihrem Budget passt.',
    buyBtn: 'Plan Abonnieren',
    checkoutTitle: 'Sichere Kasse',
    cardHolderLabel: 'Karteninhaber',
    cardNumberLabel: 'Kartennummer',
    payBtn: 'Zahlung abschließen',
    paying: 'Zahlung wird verarbeitet...',
    successTitle: 'Zahlung Erfolgreich!',
    successDesc: 'Ihr Abonnement wurde erfolgreich aktiviert. Willkommen bei TrendVista!',
    close: 'Schließen',
    testimonialsTitle: 'Kundenbewertungen',
    testimonialsSub: 'Wie Ersteller und Marken weltweit mit TrendVista virales Wachstum erzielen.',
    chatbotWelcome: 'Hallo! Ich bin der TrendVista KI-Assistent. Wie kann ich Ihnen helfen?',
    chatPlaceholder: 'Frage eingeben...',
    quickPricing: 'Preise der Tarife?',
    quickHow: 'Wie funktioniert es?',
    quickConnect: 'Kanal verbinden?',
    botReplyPricing: 'TrendVista bietet 3 Tarife: Starter (200₺), Professional (500₺) und Enterprise (800₺).',
    botReplyHow: 'Wir erkennen virale Wellen frühzeitig, berechnen Übereinstimmungen und schreiben Drehbücher.',
    botReplyConnect: 'Verbinden Sie Ihre Kanäle im Creator-Bereich unter "Kanäle verbinden" mit einem Klick.',
    categoryBeauty: 'Schönheit & Kosmetik',
    categoryTech: 'Technologie & KI',
    categoryFashion: 'Mode & Stil',
    categoryGaming: 'Gaming & E-Sport',
    categoryFood: 'Essen & Kochen',
    categoryFitness: 'Fitness & Gesundheit',
    step1: '1. Profilanalyse', step1Desc: 'Verknüpfen Sie Ihre Kanäle zur sofortigen Zielgruppen- und Metrikanalyse.',
    step2: '2. Signalerkennung', step2Desc: 'Weltweite virale Vektoren von TikTok, Reels und Shorts werden in Echtzeit analysiert.',
    step3: '3. Affinitätsabgleich', step3Desc: 'KI berechnet die Passgenauigkeit zwischen Ihrem Profil und dem Trend.',
    step4: '4. Skriptentwurf', step4Desc: 'Erhalten Sie maßgeschneiderte Hooks und Szenen-Skripte im KI-Studio.',
    step5: '5. Kampagnenintegration', step5Desc: 'Erstellen Sie automatisch markenkompatible Briefings und Creator-Listen.',
    step6: '6. Leistungs-Feedback', step6Desc: 'Ergebnisse fließen zurück in das Modell, um zukünftige Vorschläge zu optimieren.'
  },
  fr: {
    heroBadge: 'Système d\'Exploitation de Tendances IA',
    heroTitle1: 'Capturez les',
    heroTitle2: 'Tendances Émergentes',
    heroTitle3: 'Avec saturation',
    heroDesc: 'TrendVista détecte tôt les signaux viraux sur TikTok, Instagram et YouTube pour les convertir en concepts créatifs personnalisés.',
    heroBtnCreator: 'Espace Créateur',
    heroBtnBrand: 'Espace Marque',
    statAccuracy: 'Prévision de Tendance Précise',
    statEngagement: 'Engagement Plus Élevé',
    statAlert: 'Délai d\'Alerte Précoce',
    radarTitle: 'Radar de Tendances en Direct',
    radarSub: 'Sélectionnez différentes catégories pour simuler les correspondances.',
    howItWorksTitle: 'Le flux d\'intelligence en 6 étapes',
    howItWorksSub: 'Un moteur en boucle fermée qui transforme les données sociales en briefs de performance et en scénarios.',
    pricingTitle: 'Plans d\'Investissement & Abonnements',
    pricingSub: 'Sélectionnez le modèle d\'abonnement qui correspond le mieux à votre budget et à vos objectifs.',
    buyBtn: 'S\'abonner au plan',
    checkoutTitle: 'Paiement Sécurisé',
    cardHolderLabel: 'Titulaire de la carte',
    cardNumberLabel: 'Numéro de carte',
    payBtn: 'Finaliser le paiement',
    paying: 'Traitement du paiement...',
    successTitle: 'Paiement Réussi !',
    successDesc: 'Votre abonnement a été activé avec succès. Bienvenue chez TrendVista !',
    close: 'Fermer',
    testimonialsTitle: 'Avis des Utilisateurs',
    testimonialsSub: 'Découvrez comment les créateurs du monde entier se développent avec TrendVista.',
    chatbotWelcome: 'Bonjour ! Je suis l\'assistant IA de TrendVista. Comment puis-je vous aider ?',
    chatPlaceholder: 'Posez une question...',
    quickPricing: 'Quels sont les tarifs ?',
    quickHow: 'Comment ça marche ?',
    quickConnect: 'Comment connecter mon canal ?',
    botReplyPricing: 'TrendVista propose 3 plans : Starter (200₺), Professional (500₺) et Enterprise (800₺).',
    botReplyHow: 'We detect viral signals, calculate affinity with your profile, and generate script formats.',
    botReplyConnect: 'Connect accounts safely under the Creator Workspace "Connections" tab.',
    categoryBeauty: 'Beauté & Cosmétiques',
    categoryTech: 'Technologie & IA',
    categoryFashion: 'Mode & Style',
    categoryGaming: 'Jeux & E-sport',
    categoryFood: 'Cuisine & Gastronomie',
    categoryFitness: 'Fitness & Santé',
    step1: '1. Audit de Profil', step1Desc: 'Connectez vos réseaux. Votre audience et vos performances sont indexées en quelques secondes.',
    step2: '2. Capture de Signaux', step2Desc: 'Les flux TikTok, Reels et Shorts sont scannés en continu pour détecter la viralité.',
    step3: '3. Score d\'Affinité', step3Desc: 'L\'IA compare chaque tendance avec les données démographiques de votre profil.',
    step4: '4. Scénarisation IA', step4Desc: 'Obtenez des hooks personnalisés et des dialogues prêts à l\'emploi dans le Studio.',
    step5: '5. Briefs de Campagne', step5Desc: 'Générez des concepts de marque et des analyses de sécurité des créateurs.',
    step6: '6. Boucle de Performance', step6Desc: 'Les statistiques des vidéos publiées affinent les algorithmes pour les futurs signaux.'
  },
  es: {
    heroBadge: 'Sistema Operativo de Tendencias IA',
    heroTitle1: 'Capture las',
    heroTitle2: 'Tendencias Emergentes',
    heroTitle3: 'Antes de que se saturen',
    heroDesc: 'TrendVista detecta señales virales en TikTok, Instagram y YouTube de forma temprana y las convierte en ideas de contenido.',
    heroBtnCreator: 'Área de Creadores',
    heroBtnBrand: 'Área de Marcas',
    statAccuracy: 'Pronóstico de Tendance Preciso',
    statEngagement: 'Mayor Interacción',
    statAlert: 'Ventana de Alerta Temprana',
    radarTitle: 'Radar de Tendencias en Vivo',
    radarSub: 'Seleccione categorías para simular coincidencias de tendencias.',
    howItWorksTitle: 'El flujo de inteligencia en 6 pasos',
    howItWorksSub: 'TrendVista analiza datos sociales para generar guiones virales y briefs de campaña automatizados.',
    pricingTitle: 'Planes de Inversión y Suscripciones',
    pricingSub: 'Seleccione el modelo de suscripción que mejor se adapte a sus metas y presupuesto.',
    buyBtn: 'Suscribirse al plan',
    checkoutTitle: 'Pago Seguro',
    cardHolderLabel: 'Titular de la tarjeta',
    cardNumberLabel: 'Número de tarjeta',
    payBtn: 'Completar pago',
    paying: 'Procesando pago...',
    successTitle: '¡Pago Exitoso!',
    successDesc: 'Su suscripción ha sido activada con éxito. ¡Bienvenido a TrendVista!',
    close: 'Cerrar',
    testimonialsTitle: 'Opiniones de Usuarios',
    testimonialsSub: 'Cómo creadores y marcas de todo el mundo logran un crecimiento viral con TrendVista.',
    chatbotWelcome: '¡Hola! Soy el asistente IA de TrendVista. ¿Cómo puedo ayudarte hoy?',
    chatPlaceholder: 'Escribe una pregunta...',
    quickPricing: '¿Precios de los planes?',
    quickHow: '¿Cómo funciona?',
    quickConnect: '¿Cómo conectar mi canal?',
    botReplyPricing: 'TrendVista ofrece 3 planes: Starter (200₺), Professional (500₺) y Enterprise (800₺).',
    botReplyHow: 'We discover viral waves, calculate match metrics, and write scripts.',
    botReplyConnect: 'Link social channels safely inside the Creator Workspace under "Connected Channels" panel.',
    categoryBeauty: 'Belleza y Cosmética',
    categoryTech: 'Tecnología e IA',
    categoryFashion: 'Moda y Estilo',
    categoryGaming: 'Juegos y Esports',
    categoryFood: 'Comida y Cocina',
    categoryFitness: 'Fitness y Salud',
    step1: '1. Auditoría del Perfil', step1Desc: 'Conecta tus redes para indexar tu audiencia y métricas de rendimiento.',
    step2: '2. Captura de Señales', step2Desc: 'Escaneo en tiempo real de tendencias en TikTok, Reels y Shorts.',
    step3: '3. Puntuación de Afinidad', step3Desc: 'La IA evalúa la coincidencia entre el tono de tu canal y la tendencia actual.',
    step4: '4. Creación de Guiones', step4Desc: 'Obtén ganchos de video y guiones estructurados listos en el Studio.',
    step5: '5. Campañas de Marca', step5Desc: 'Genera de forma automática briefs alineados con tendencias y listas de creadores.',
    step6: '6. Feedback Continuo', step6Desc: 'El rendimiento de tus videos alimenta el modelo para afinar las futuras alertas.'
  },
  it: {
    heroBadge: 'Sistema Operativo di Tendenze IA',
    heroTitle1: 'Cattura le',
    heroTitle2: 'Tendenze Emergenti',
    heroTitle3: 'Prima della saturazione',
    heroDesc: 'TrendVista rileva tempestivamente i segnali virali su TikTok, Instagram e YouTube e li converte in idee di contenuto.',
    heroBtnCreator: 'Area Creator',
    heroBtnBrand: 'Area Brand',
    statAccuracy: 'Previsione Tendenze Accurata',
    statEngagement: 'Maggiore Coinvolgimento',
    statAlert: 'Finestra di Allerta Precoce',
    radarTitle: 'Radar delle Tendenze in Tempo Reale',
    radarSub: 'Seleziona le categorie per simulare le corrispondenze.',
    howItWorksTitle: 'Il flusso di intelligence in 6 passaggi',
    howItWorksSub: 'TrendVista è un motore a circuito chiuso che trasforma i dati social in sceneggiature virali.',
    pricingTitle: 'Piani di Investimento e Abbonamenti',
    pricingSub: 'Scegli il livello di licenza più adatto alle tue esigenze e al tuo budget.',
    buyBtn: 'Acquista piano',
    checkoutTitle: 'Pagamento Sicuro',
    cardHolderLabel: 'Titolare della carta',
    cardNumberLabel: 'Numero di carta',
    payBtn: 'Completa il pagamento',
    paying: 'Elaborazione del pagamento...',
    successTitle: 'Pagamento Riuscito!',
    successDesc: 'Il tuo abbonamento è stato attivato con successo. Benvenuto in TrendVista!',
    close: 'Chiudi',
    testimonialsTitle: 'Recensioni degli Utenti',
    testimonialsSub: 'Come creator e brand in tutto il mondo ottengono una crescita virale con TrendVista.',
    chatbotWelcome: 'Ciao! Sono l\'assistente IA di TrendVista. Come posso aiutarti oggi?',
    chatPlaceholder: 'Scrivi una domanda...',
    quickPricing: 'Quali sono i prezzi?',
    quickHow: 'Come funziona?',
    quickConnect: 'Come collego il canale?',
    botReplyPricing: 'TrendVista offre 3 piani: Starter (200₺), Professional (500₺) e Enterprise (800₺).',
    botReplyHow: 'We parse viral signals, compute affinity index, and export creative scripts.',
    botReplyConnect: 'Simply link social channels from the Creator panel "Connections" tab.',
    categoryBeauty: 'Bellezza & Cosmetica',
    categoryTech: 'Tecnologia & IA',
    categoryFashion: 'Moda & Stile',
    categoryGaming: 'Gaming & Esports',
    categoryFood: 'Cucina & Gastronomia',
    categoryFitness: 'Fitness & Salute',
    step1: '1. Analisi Profilo', step1Desc: 'Collega i tuoi canali per analizzare il tuo pubblico e le tue metriche storiche.',
    step2: '2. Rilevamento Segnali', step2Desc: 'Scansione in tempo real dei flussi video di TikTok, Reels e Shorts.',
    step3: '3. Score di Affinità', step3Desc: 'L\'IA confronta ogni tendenza con i dati demografici del tuo canale.',
    step4: '4. Script automatici', step4Desc: 'Ottieni ganci accattivanti e sceneggiature pronte per la registrazione nel Studio.',
    step5: '5. Brief di Campagna', step5Desc: 'Genera concept per brand e liste di creator sicuri da contrattualizzare.',
    step6: '6. Ottimizzazione continua', step6Desc: 'I dati dei video pubblicati aggiornano il motore per affinare i futuri suggerimenti.'
  },
  ru: {
    heroBadge: 'Операционная Система Трендов на базе ИИ',
    heroTitle1: 'Ловите',
    heroTitle2: 'Восходящие Тренды',
    heroTitle3: 'До насыщения рынка',
    heroDesc: 'TrendVista рано обнаруживает вирусные сигналы в TikTok, Instagram и YouTube, превращая их в сценарии под ваш канал.',
    heroBtnCreator: 'Панель Creator',
    heroBtnBrand: 'Панель Brand',
    statAccuracy: 'Точный Прогноз Трендов',
    statEngagement: 'Выше Вовлеченность',
    statAlert: 'Окно Раннего Предупреждения',
    radarTitle: 'Радар Трендов в Реальном Времени',
    radarSub: 'Выберите категорию для симуляции соответствия трендов.',
    howItWorksTitle: '6-шаговый цикл аналитики',
    howItWorksSub: 'Замкнутая система TrendVista преобразует социальные данные в сценарии и рекламные брифы.',
    pricingTitle: 'Инвестиционные Планы и Подписки',
    pricingSub: 'Выберите уровень подписки, соответствующий вашему бюджету.',
    buyBtn: 'Купить подписку',
    checkoutTitle: 'Безопасная Оплата',
    cardHolderLabel: 'Владелец карты',
    cardNumberLabel: 'Номер карты',
    payBtn: 'Завершить оплату',
    paying: 'Обработка платежа...',
    successTitle: 'Оплата Прошла Успешно!',
    successDesc: 'Ваша подписка успешно активирована. Добро пожаловать в TrendVista!',
    close: 'Закрыть',
    testimonialsTitle: 'Отзывы Пользователей',
    testimonialsSub: 'Как авторы и бренды по всему миру добиваются вирусного роста с TrendVista.',
    chatbotWelcome: 'Привет! Я ИИ-ассистент TrendVista. Чем могу помочь?',
    chatPlaceholder: 'Введите вопрос...',
    quickPricing: 'Сколько стоят тарифы?',
    quickHow: 'Как это работает?',
    quickConnect: 'Как привязать канал?',
    botReplyPricing: 'TrendVista предлагает 3 тарифа: Starter (200₺), Professional (500₺) и Enterprise (800₺).',
    botReplyHow: 'Мы обнаруживаем вирусные тренды, оцениваем соответствие каналу и пишем сценарии.',
    botReplyConnect: 'Просто привяжите каналы во вкладке "Подключение каналов" в панели автора.',
    categoryBeauty: 'Красота и Косметика',
    categoryTech: 'Технологии и ИИ',
    categoryFashion: 'Moda и Стиль',
    categoryGaming: 'Игры и Киберспорт',
    categoryFood: 'Еда и Кулинария',
    categoryFitness: 'Фитнес и Здоровье',
    step1: '1. Аудит Профиля', step1Desc: 'Подключите ваши каналы для мгновенного анализа аудитории и прошлых видео.',
    step2: '2. Сбор Сигналов', step2Desc: 'Алгоритмы сканируют глобальные вирусные тренды в TikTok, Reels и Shorts.',
    step3: '3. Оценка Совместимости', step3Desc: 'ИИ сравнивает показатели тренда с демографией вашего канала.',
    step4: '4. Генерация Сценария', step4Desc: 'Получите готовые хуки, структуру видео и дикторский текст в ИИ-студии.',
    step5: '5. Интеграция с Брендами', step5Desc: 'Автоматически создавайте рекламные брифы и списки безопасных блогеров.',
    step6: '6. Анализ Результатов', step6Desc: 'Данные о просмотрах возвращаются в систему, улучшая точность будущих трендов.'
  },
  ja: {
    heroBadge: 'AIトレンド・オペレーティングシステム',
    heroTitle1: '飽和する前に',
    heroTitle2: '急上昇トレンドを',
    heroTitle3: 'いち早くキャッチする',
    heroDesc: 'TrendVistaはTikTok、Instagram、YouTubeのバイラルシグナルを早期検知し、AIでチャンネルに合わせた台本を作成します。',
    heroBtnCreator: 'クリエイター領域',
    heroBtnBrand: 'ブランド領域',
    statAccuracy: '正確なトレンド予測',
    statEngagement: '高いエンゲージメント',
    statAlert: '早期警告ウィンドウ',
    radarTitle: 'ライブトレンドレーダー',
    radarSub: 'カテゴリーを選択して適合スコアを確認できます。',
    howItWorksTitle: '6段階のトレンドインテリジェンスフロー',
    howItWorksSub: 'ソーシャルデータをバイラルな台本やキャンペーン用ブリーフに変換する閉ループエンジンです。',
    pricingTitle: '投資プランとメンバーシップ',
    pricingSub: 'ご予算やクリエイティブな目標に合わせた最適なプランをお選びください。',
    buyBtn: 'プランを購入する',
    checkoutTitle: '安全な決済',
    cardHolderLabel: 'カード名義人',
    cardNumberLabel: 'カード番号',
    payBtn: '決済を完了する',
    paying: '決済処理中...',
    successTitle: '決済が完了しました！',
    successDesc: 'サブスクリプションが有効化されました。TrendVistaへようこそ！',
    close: '閉じる',
    testimonialsTitle: '利用者の声',
    testimonialsSub: '世界中のクリエイターやブランドがTrendVistaでバイラル成長を達成した事例。',
    chatbotWelcome: 'こんにちは！TrendVista AIアシスタントです。何かお困りですか？',
    chatPlaceholder: '質問を入力してください...',
    quickPricing: '料金プランについて',
    quickHow: '仕組みについて',
    quickConnect: 'チャンネルの連携方法',
    botReplyPricing: 'Starter（200₺）、Professional（500₺）、Enterprise（800₺）の3プランをご用意しています。',
    botReplyHow: 'バイラルシグナルを検出、スコア化し、動画台本を出力します。',
    botReplyConnect: 'ログイン後、クリエイターワークスペースの「連携」パネルから行えます。',
    categoryBeauty: '美容・コスメ',
    categoryTech: 'テクノロジー・AI',
    categoryFashion: 'ファッション・スタイル',
    categoryGaming: 'ゲーム・eスポーツ',
    categoryFood: '料理・グルメ',
    categoryFitness: 'フィットネス・健康',
    step1: '1. プロフィール監査', step1Desc: 'SNS連携により、視聴者の属性データや過去 of 投稿数値を秒速で解析します。',
    step2: '2. シグナル収集', step2Desc: 'TikTok、Reels、Shortsのグローバルバイラルシグナルをリアルタイムでスキャンします。',
    step3: '3. マッチングスコア', step3Desc: 'AIがあなたのチャンネルの特性とトレンドデータを突合し、適合率を算出します。',
    step4: '4. AI台本作成', step4Desc: '視聴者を引きつけるフック（冒頭3秒）、動画の構成案、音声ナレーションを自動生成します。',
    step5: '5. キャンペーン連携', step5Desc: 'ブランド向けに、トレンドに連動したAI企画書や最適なクリエイター候補リストを出力します。',
    step6: '6. フィードバックループ', step6Desc: '投稿後の数値をAIモデルに再学習させ、次回シグナルの精度をさらに向上させます。'
  },
  zh: {
    heroBadge: 'AI 趋势操作系统',
    heroTitle1: '在饱和之前',
    heroTitle2: '精准捕获',
    heroTitle3: '社交媒体上升趋势',
    heroDesc: 'TrendVista 能够提早捕捉 TikTok、Instagram 和 YouTube 的病毒式传播信号，并利用 AI 转化为适合您频道的定制化台本。',
    heroBtnCreator: '创作者中心',
    heroBtnBrand: '品牌中心',
    statAccuracy: '精准趋势预测',
    statEngagement: '超高互动率',
    statAlert: '早期预警窗口',
    radarTitle: '实时趋势雷达',
    radarSub: '选择不同分类以模拟趋势匹配度。',
    howItWorksTitle: '6步趋势情报循环',
    howItWorksSub: 'TrendVista 是一个闭环引擎，分析社交数据并转化为热门视频脚本和品牌广告案。',
    pricingTitle: '订阅计划与会员权益',
    pricingSub: '选择最适合您的预算规模 and 创意目标的订阅方案。',
    buyBtn: '购买该计划',
    checkoutTitle: '安全结账',
    cardHolderLabel: '持卡人姓名',
    cardNumberLabel: '卡号',
    payBtn: '完成付款',
    paying: '付款处理中...',
    successTitle: '付款成功！',
    successDesc: '您的订阅已成功激活。欢迎加入 TrendVista！',
    close: '关闭',
    testimonialsTitle: '用户评价',
    testimonialsSub: '全球各地的创作者和品牌如何通过 TrendVista 实现爆发式增长。',
    chatbotWelcome: '您好！我是 TrendVista 智能助手。今天有什么我可以帮您的？',
    chatPlaceholder: '输入您的问题...',
    quickPricing: '价格方案是什么？',
    quickHow: '这是如何运作的？',
    quickConnect: '如何关联我的账号？',
    botReplyPricing: '我们提供3个付费方案：Starter (200₺), Professional (500₺) 和 Enterprise (800₺)。',
    botReplyHow: '我们定位热门趋势，计算账号关联度，并输出匹配的台本和视频框架。',
    botReplyConnect: '登录后，进入创作者后台的“账号关联”选项卡即可链接您的社交媒体。',
    categoryBeauty: '美容与化妆品',
    categoryTech: '科技与人工智能',
    categoryFashion: '时尚与穿搭',
    categoryGaming: '游戏与电竞',
    categoryFood: '美食与烹饪',
    categoryFitness: '健身与健康',
    step1: '1. 频道分析', step1Desc: '一键关联社交频道，秒级拆解分析您的受众画像和历史视频数据。',
    step2: '2. 信号检索', step2Desc: '自动扫描 TikTok、Reels 和 Shorts 上的全球热门趋势指标。',
    step3: '3. 契合度匹配', step3Desc: 'AI 引擎智能评估您的账号属性与当前趋势图谱的贴合分值。',
    step4: '4. AI 脚本生成', step4Desc: '几秒内即可在工作室获得定制的黄金3秒开头（Hook）、镜头大纲及旁白台词。',
    step5: '5. 品牌方案输出', step5Desc: '自动生成符合当前趋势的 AI 方案策划案以及安全性分析过的网红达人列表。',
    step6: '6. 数据回馈优化', step6Desc: '发布的视频数据会自动回传至算法模型，让下一次的趋势推送更加精准。'
  },
  ar: {
    heroBadge: 'نظام تشغيل التوجهات بالذكاء الاصطناعي',
    heroTitle1: 'اقتنص',
    heroTitle2: 'التوجهات الصاعدة',
    heroTitle3: 'قبل تشبع السوق',
    heroDesc: 'يلتقط TrendVista الإشارات الفيروسية على TikTok و Instagram و YouTube مبكرًا، ويحولها إلى نصوص مخصصة لقناتك باستخدام الذاء الاصطناعي.',
    heroBtnCreator: 'مساحة المبدعين',
    heroBtnBrand: 'مساحة العلامات التجارية',
    statAccuracy: 'توقع توجهات دقيق',
    statEngagement: 'تفاعل أعلى',
    statAlert: 'نافذة إنذار مبكر',
    radarTitle: 'رادار التوجهات المباشر',
    radarSub: 'اختر فئات مختلفة لمحاكاة مطابقة التوجهات.',
    howItWorksTitle: 'تدفق ذكاء التوجهات في 6 خطوات',
    howItWorksSub: 'TrendVista هو محرك حلقة مغلقة يحلل البيانات الاجتماعية ويحولها إلى سيناريوهات فيروسية.',
    pricingTitle: 'خطط الاستثمار والعضويات',
    pricingSub: 'اختر نموذج الاشتراك الأنسب لميزانيتك وأهدافك الإبداعية.',
    buyBtn: 'اشترك الآن',
    checkoutTitle: 'الدفع الآمن',
    cardHolderLabel: 'صاحب البطاقة',
    cardNumberLabel: 'رقم البطاقة',
    payBtn: 'إتمام عملية الدفع',
    paying: 'جاري معالجة الدفع...',
    successTitle: 'تم الدفع بنجاح!',
    successDesc: 'تم تفعيل اشتراكك بنجاح. مرحبًا بك في TrendVista!',
    close: 'إغلاق',
    testimonialsTitle: 'آراء المستخدمين',
    testimonialsSub: 'كيف يحقق المبدعون والعلامات التجارية حول العالم نموًا فيروسيًا مع TrendVista.',
    chatbotWelcome: 'مرحبًا! أنا مساعد الذكاء الاصطناعي من TrendVista. كيف يمكنني مساعدتك اليوم؟',
    chatPlaceholder: 'اكتب سؤالاً...',
    quickPricing: 'ما هي أسعار الباقات؟',
    quickHow: 'كيف يعمل النظام؟',
    quickConnect: 'كيف أربط قناتي؟',
    botReplyPricing: 'يقدم TrendVista ثلاث باقات: Starter (200₺) و Professional (500₺) و Enterprise (800₺).',
    botReplyHow: 'نحن نحلل الإشارات، ونقيس ملاءمتها لقناتك، ونصنع نصوص فيديو متكاملة.',
    botReplyConnect: 'ببساطة، قم بربط حساباتك من لوحة التحكم "الاتصالات" في مساحة المبدع.',
    categoryBeauty: 'الجمال ومستحضرات التجميل',
    categoryTech: 'التكنولوجيا والذكاء الاصطناعي',
    categoryFashion: 'الموضة والأناقة',
    categoryGaming: 'الألعاب والرياضات الإلكترونية',
    categoryFood: 'الطعام والطبخ',
    categoryFitness: 'اللياقة البدنية والصحة',
    step1: '1. تحليل الملف الشخصي', step1Desc: 'اربط قنواتك الاجتماعية. يتم تحليل جمهورك وأدائك السابق في ثوانٍ.',
    step2: '2. التقاط الإشارات', step2Desc: 'مسح فوري للتوجهات الفيروسية العالمية على TikTok و Reels و Shorts.',
    step3: '3. حساب التوافق', step3Desc: 'يقارن الذكاء الاصطناعي التوجه مع التركيبة السكانية لقناتك لتوليد نتيجة المطابقة.',
    step4: '4. صياغة النص', step4Desc: 'احصل على خطافات فيديو مخصصة ومخططات للمشاهد جاهزة للاستخدام في الأستوديو.',
    step5: '5. حملات العلامات التجارية', step5Desc: 'إنشاء موجزات تسويقية متوافقة مع التوجهات وقوائم صناع المحتوى المؤهلين تلقائيًا.',
    step6: '6. حلقة التغذية المرتدة', step6Desc: 'تغذي بيانات أداء الفيديو نموذج التعلم، مما يجعل التنبؤات المستقبلية أكثر دقة.'
  }
};

const chatbotKnowledgeBase = {
  tr: [
    {
      category: '💰 Üyelikler & Ödemeler',
      questions: [
        {
          q: 'Üyelik paketleri ve fiyatlar nedir?',
          keywords: ['fiyat', 'plan', 'paket', 'ücret', 'para', 'ödem', 'abonelik', 'fiyatı', 'kaç para', 'ne kadar', 'cost', 'price', 'pricing'],
          a: 'TrendVista 3 ana ödeme planı sunar:\n\n• Starter Plan: Ayda 200₺ (Tek kanal bağlama, limitli trend analizi)\n• Professional Plan: Ayda 500₺ (Çoklu kanal bağlama, sınırsız AI İçerik Stüdyosu, rakip analizi)\n• Enterprise Plan: Ayda 800₺ (Özel API entegrasyonu, 7/24 premium destek, özel pazarlama kampanyaları).\n\nKayıt olmak tamamen ücretsizdir ve ücretsiz hesap sahipleri gösterge panellerini (dashboard) inceleyebilir.'
        },
        {
          q: 'Ücretsiz üyelikte (Free Plan) hangi özellikler var?',
          keywords: ['ücretsiz', 'bedava', 'beleş', 'free', 'sınır', 'kısıt'],
          a: 'Ücretsiz üyelikle (Free Plan) TrendVista dünyasına giriş yapabilirsiniz. Canlı Trend Radar panelini görüntüleyerek genel trend listelerine göz atabilirsiniz. Ancak, viral video senaryoları üreten AI İçerik Stüdyosu ve AI Kampanya Motoru gibi yapay zeka araçları kilitlidir. Bu özellikleri kullanmak için planınızı yükseltmeniz gerekir.'
        },
        {
          q: 'İptal ve iade politikası nasıldır?',
          keywords: ['iade', 'iptal', 'bırak', 'geri ödeme', 'refund', 'cancel', 'politik'],
          a: 'Herhangi bir taahhüt yoktur. Aboneliğinizi dilediğiniz zaman profil ayarlarınızdan iptal edebilirsiniz. TrendVista hizmet kalitesinden memnun kalmamanız durumunda, satın alım tarihinden itibaren 14 gün içinde koşulsuz şartsız tam ücret iadesi talep edebilirsiniz.'
        }
      ]
    },
    {
      category: '⚙️ Sistem Nasıl Çalışır?',
      questions: [
        {
          q: 'TrendVista viral trendleri nasıl buluyor?',
          keywords: ['nasıl çalışır', 'nasıl buluyor', 'trendleri nasıl', 'işleyiş', 'teknoloji', 'veri', 'sistem'],
          a: 'TrendVista algoritmaları, TikTok, Instagram Reels ve YouTube Shorts platformlarındaki paylaşım hızlarını, beğeni ivmelerini ve müzik popülerliklerini 7/24 tarar. Elde edilen veriler yapay zeka süzgecinden geçirilerek kanalınızın kitlesine göre filtrelenir.'
        },
        {
          q: 'Uyum Skoru (Affinity Score) nedir?',
          keywords: ['uyum', 'skor', 'affinity', 'score', 'oran', 'yüzde', 'nasıl hesaplanır'],
          a: 'Uyum Skoru, yükselen bir trendin sizin takipçi demografinizle, dilinizle ve geçmişte başarılı olmuş video formatlarınızla olan benzerliğini ölçer. %80 ve üzeri skor alan trendleri kullanmanız, viral olma ihtimalinizi yüksek oranda artırır.'
        }
      ]
    },
    {
      category: '🔗 Kanal Bağlama',
      questions: [
        {
          q: 'Sosyal medya hesaplarımı nasıl bağlarım?',
          keywords: ['bağla', 'kanal', 'hesap', 'entegre', 'ekle', 'nasıl bağlanır', 'tiktok', 'instagram', 'youtube'],
          a: 'Hesabınıza giriş yaptıktan sonra, Creator panelindeki "Hesap Bağlantıları" sekmesinden TikTok, Instagram veya YouTube hesaplarınızı tek tıkla entegre edebilirsiniz. Entegrasyon tamamen resmi API altyapıları üzerinden gerçekleşir.'
        },
        {
          q: 'Hesap bağlamak güvenli mi? Bilgilerim çalınır mı?',
          keywords: ['güvenli', 'çalınır mı', 'şifre', 'gizlilik', 'güvenlik', 'emniyet', 'token'],
          a: 'Hesap bağlantıları resmi OAuth API yetkilendirmesiyle yapılır. TrendVista, sosyal medya şifrelerinizi asla talep etmez ve göremez. Sadece profil istatistiklerinizi analiz etmek üzere okuma izni alır. Verileriniz KVKK/GDPR uyumlu olarak şifrelenmiş sunucularda saklanır.'
        }
      ]
    },
    {
      category: '🎬 AI Senaryo & Kampanyalar',
      questions: [
        {
          q: 'AI İçerik Stüdyosu ne üretiyor?',
          keywords: ['senaryo', 'üret', 'yaz', 'stüdyo', 'kanca', 'video stüdyosu', 'script', 'gold hook'],
          a: 'AI İçerik Stüdyosu, seçtiğiniz trende uygun:\n\n• Dikkat çekici viral kancalar (Hooks)\n• Sahne sahne video akış planları (Scene Flow)\n• Seslendirme metinleri (Voiceover text)\n• Platforma özel açıklama ve etiket önerileri üretir. Bu sayede dakikalar içinde çekime hazır içerik taslağınız oluşur.'
        },
        {
          q: 'AI Kampanya Motoru markalara ne sağlar?',
          keywords: ['kampanya', 'marka', 'brief', 'risk', 'influencer', 'pazarlama', 'campaign'],
          a: 'Marka paneli (Brand Hub), şirketinizin ürününe ve hedef kitlesine göre trendlere uyumlu otomatik pazarlama briefleri yazar. Kampanya için en uygun influencer/creator önerilerini getirir ve marka güvenliği için risk analizi raporları hazırlar.'
        }
      ]
    },
    {
      category: '👨‍💻 Geliştirici & Destek',
      questions: [
        {
          q: 'TrendVista arkasında kim var?',
          keywords: ['kim yaptı', 'geliştirici', 'kaan kaplan', 'kimin', 'kurucu', 'founder', 'developer', 'yapan'],
          a: 'TrendVista, baş geliştiricimiz ve kurucumuz Kaan Kaplan liderliğindeki uzman yapay zeka mühendisleri ve veri bilimciler tarafından geliştirilmiştir. Amacımız içerik üreticilerinin ve markaların büyümesini akıllı veri analitiğiyle desteklemektir.'
        },
        {
          q: 'Destek ekibine nasıl ulaşabilirim?',
          keywords: ['iletişim', 'destek', 'yardım', 'mail', 'support', 'telefon', 'ulaş'],
          a: 'Her türlü soru ve teknik yardım talebiniz için support@trendlab.ai adresine e-posta gönderebilirsiniz. Professional ve Enterprise kullanıcılarımız panel üzerinden canlı öncelikli destek hattına 7/24 erişebilirler.'
        }
      ]
    }
  ],
  en: [
    {
      category: '💰 Memberships & Payments',
      questions: [
        {
          q: 'What are the subscription plans and pricing?',
          keywords: ['fiyat', 'plan', 'paket', 'ücret', 'para', 'ödem', 'abonelik', 'fiyatı', 'price', 'pricing', 'cost', 'subscription', 'how much'],
          a: 'TrendVista offers 3 payment plans:\n\n• Starter Plan: 200₺/mo (1 channel connection, limited trend radar)\n• Professional Plan: 500₺/mo (Unlimited channels, AI Content Studio, competitor metrics)\n• Enterprise Plan: 800₺/mo (Dedicated APIs, 24/7 premium support, marketing flows).\n\nSigning up is free, and Free tier users can access core dashboards.'
        },
        {
          q: 'What features are in the Free Plan?',
          keywords: ['free', 'unpaid', 'free plan', 'free tier', 'is it free', 'limits', 'locked'],
          a: 'The Free Plan allows you to log in and access the Live Trend Radar dashboard. However, AI generators like AI Content Studio and AI Campaign Engine are locked. To unlock them, you can upgrade to Starter or Professional plans.'
        },
        {
          q: 'What is your refund and cancellation policy?',
          keywords: ['refund', 'cancel', 'cancellation', 'money back', 'unsubscribe'],
          a: 'There are no contracts. You can cancel your subscription at any time under settings. We also provide a 14-day money-back guarantee if you are not fully satisfied with our signals.'
        }
      ]
    },
    {
      category: '⚙️ How It Works',
      questions: [
        {
          q: 'How does TrendVista detect viral trends?',
          keywords: ['how it works', 'how does it work', 'how to use', 'mechanism', 'workflow', 'concept', 'system'],
          a: 'Our algorithms scan TikTok, Reels, and YouTube Shorts 24/7 to measure sharing speed, view count acceleration, and audio momentum. AI then filters these signals tailored to your specific audience.'
        },
        {
          q: 'What is the Affinity Score?',
          keywords: ['affinity', 'score', 'match', 'percentage', 'demographics'],
          a: 'The Affinity Score calculates the correlation between a rising trend and your channel demographic, language, and historical formatting. Trends scoring 80% or higher have a high probability of going viral.'
        }
      ]
    },
    {
      category: '🔗 Channel Linking',
      questions: [
        {
          q: 'How do I link my social media accounts?',
          keywords: ['connect', 'link', 'account', 'integration', 'socials', 'tiktok', 'instagram', 'youtube'],
          a: 'Once authenticated, go to the "Account Connections" tab inside the Creator Workspace to securely connect TikTok, Instagram, or YouTube accounts via official API authorization.'
        },
        {
          q: 'Is it safe to connect accounts? Can they be stolen?',
          keywords: ['safe', 'secure', 'stolen', 'security', 'privacy', 'password', 'token'],
          a: 'Absolutely. We use official OAuth APIs. TrendVista never asks for or stores your password. We only request read-only permissions to compute channel metrics. Your data is encrypted and secure.'
        }
      ]
    },
    {
      category: '🎬 AI Scripts & Campaigns',
      questions: [
        {
          q: 'What does the AI Content Studio generate?',
          keywords: ['script', 'generate script', 'studio', 'voiceover', 'hook', 'tags', 'creator tools'],
          a: 'The AI Studio generates:\n\n• High-retention gold Hooks\n• Scene-by-scene visual blueprints\n• Voiceover audio scripts\n• Platform descriptions & trending hashtags.'
        },
        {
          q: 'How does AI Campaign Engine help brands?',
          keywords: ['campaign', 'brand', 'brief', 'risk', 'influencer', 'marketing'],
          a: 'Brand Hub auto-generates custom brief books tailored to your product and targeted audience, scans top creator demographic safety ratings, and produces risk assessment plans.'
        }
      ]
    },
    {
      category: '👨‍💻 Developer & Support',
      questions: [
        {
          q: 'Who is behind TrendVista?',
          keywords: ['founder', 'developer', 'who created', 'kaan kaplan', 'maker', 'team'],
          a: 'TrendVista is developed by expert AI engineers and data scientists led by Kaan Kaplan. We seek to empower the creator economy using cutting-edge predictive analytics.'
        },
        {
          q: 'How can I reach support?',
          keywords: ['contact', 'support', 'help', 'email', 'phone'],
          a: 'For any technical questions, email support@trendlab.ai. Professional and Enterprise members get direct access to priority 24/7 chat support lines.'
        }
      ]
    }
  ]
};

export default function LandingPage({
  setView,
  lang = 'tr',
  isAuthenticated,
  setAuthMode,
  setUserPlan,
  onIyzicoCheckout
}) {
  const [activeCategory, setActiveCategory] = useState('beauty');
  const [activeCountry, setActiveCountry] = useState('TR');
  const [selectedTrendId, setSelectedTrendId] = useState(1);
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  // Checkout states
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('form');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // Chatbot states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedChatCategory, setSelectedChatCategory] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Expanded Categories: 6 categories
  const categories = [
    { code: 'beauty', icon: '💄', label: t[lang].categoryBeauty },
    { code: 'tech', icon: '💻', label: t[lang].categoryTech },
    { code: 'fashion', icon: '👗', label: t[lang].categoryFashion },
    { code: 'gaming', icon: '🎮', label: t[lang].categoryGaming },
    { code: 'food', icon: '🍳', label: t[lang].categoryFood },
    { code: 'fitness', icon: '🏋️', label: t[lang].categoryFitness }
  ];


  // Geographic Country Localized Trends
  const countryTrends = {
    TR: {
      beauty: [
        { id: 1, name: 'Salyangoz Özlü Serum Rutini', platform: 'TikTok', score: 94, growth: '+240%', status: 'Hızlanıyor', volume: '1.2M', trajectory: [12, 35, 65, 88, 94] },
        { id: 2, name: '90lar Saç Kurutma Modeli', platform: 'Instagram', score: 88, growth: '+180%', status: 'Yükseliyor', volume: '850K', trajectory: [25, 45, 60, 75, 88] },
        { id: 3, name: 'Soğuk Kız (Cold Girl) Makyajı', platform: 'TikTok', score: 82, growth: '+95%', status: 'Zirvede', volume: '2.4M', trajectory: [40, 60, 80, 85, 82] },
        { id: 4, name: 'Kore Cam Cilt 4 Adım Rutini', platform: 'Instagram', score: 91, growth: '+210%', status: 'Hızlanıyor', volume: '1.6M', trajectory: [20, 48, 70, 85, 91] },
        { id: 5, name: 'Dudak Nemlendirme & Lip Combo', platform: 'TikTok', score: 86, growth: '+160%', status: 'Zirvede', volume: '980K', trajectory: [30, 52, 70, 80, 86] }
      ],
      tech: [
        { id: 1, name: 'AI Kodlama Araçları Karşılaştırma', platform: 'YouTube', score: 96, growth: '+310%', status: 'Hızlanıyor', volume: '450K', trajectory: [10, 30, 60, 85, 96] },
        { id: 2, name: 'Masa Kurulumu Estetiği (Setup)', platform: 'Instagram', score: 85, growth: '+120%', status: 'Yükseliyor', volume: '1.1M', trajectory: [15, 35, 55, 70, 85] },
        { id: 3, name: 'Katlanabilir Telefon Dayanıklılık Testi', platform: 'YouTube', score: 78, growth: '+75%', status: 'Doygun', volume: '3.2M', trajectory: [30, 50, 70, 80, 78] },
        { id: 4, name: 'Yapay Zeka Ses Klonlama Rehberi', platform: 'TikTok', score: 93, growth: '+260%', status: 'Hızlanıyor', volume: '890K', trajectory: [18, 42, 68, 86, 93] },
        { id: 5, name: 'Kablosuz Yaka Mikrofonu İncelemesi', platform: 'YouTube', score: 89, growth: '+185%', status: 'Zirvede', volume: '640K', trajectory: [25, 48, 68, 80, 89] }
      ],
      fashion: [
        { id: 1, name: 'Minimal Kapsül Gardırop Yapımı', platform: 'Instagram', score: 91, growth: '+195%', status: 'Hızlanıyor', volume: '920K', trajectory: [20, 45, 70, 85, 91] },
        { id: 2, name: 'Blokette Estetiği Sokak Modası', platform: 'TikTok', score: 89, growth: '+220%', status: 'Yükseliyor', volume: '1.5M', trajectory: [18, 38, 58, 78, 89] },
        { id: 3, name: 'Vintage Blazer Ceket Kombini', platform: 'TikTok', score: 80, growth: '+85%', status: 'Zirvede', volume: '4.1M', trajectory: [35, 55, 75, 82, 80] },
        { id: 4, name: 'Sonbahar Katmanlı Giyim (Layering)', platform: 'Instagram', score: 87, growth: '+175%', status: 'Hızlanıyor', volume: '1.3M', trajectory: [22, 46, 68, 82, 87] },
        { id: 5, name: 'Eski Kıyafet Dönüştürme (Upcycling)', platform: 'YouTube', score: 84, growth: '+145%', status: 'Yükseliyor', volume: '780K', trajectory: [15, 36, 56, 72, 84] }
      ],
      gaming: [
        { id: 1, name: 'Retro Konsol Restorasyon Akımı', platform: 'YouTube', score: 92, growth: '+150%', status: 'Hızlanıyor', volume: '620K', trajectory: [22, 42, 68, 88, 92] },
        { id: 2, name: 'Cozy Gaming Odası Dekorasyonu', platform: 'TikTok', score: 87, growth: '+110%', status: 'Yükseliyor', volume: '1.8M', trajectory: [10, 30, 55, 75, 87] },
        { id: 3, name: 'Hızlı Bitirme (Speedrun) Rekorları', platform: 'YouTube', score: 80, growth: '+90%', status: 'Zirvede', volume: '1.3M', trajectory: [40, 60, 75, 82, 80] },
        { id: 4, name: 'Elden Ring DLC Boss Stratejisi', platform: 'YouTube', score: 97, growth: '+340%', status: 'Hızlanıyor', volume: '2.1M', trajectory: [15, 45, 75, 92, 97] },
        { id: 5, name: 'El Konsolu Benchmarks Karşılaştırma', platform: 'TikTok', score: 88, growth: '+190%', status: 'Zirvede', volume: '950K', trajectory: [25, 48, 68, 80, 88] }
      ],
      food: [
        { id: 1, name: 'Bulut Ekmeği Tarifi (Cloud Bread)', platform: 'TikTok', score: 95, growth: '+290%', status: 'Hızlanıyor', volume: '3.1M', trajectory: [15, 40, 70, 90, 95] },
        { id: 2, name: 'Estetik Kahve ASMR Videoları', platform: 'Instagram', score: 90, growth: '+165%', status: 'Zirvede', volume: '4.2M', trajectory: [30, 55, 78, 88, 90] },
        { id: 3, name: 'Tek Tavada Pratik Makarna', platform: 'TikTok', score: 84, growth: '+98%', status: 'Yükseliyor', volume: '2.5M', trajectory: [20, 40, 60, 75, 84] },
        { id: 4, name: 'Ev Yapımı Ekşi Mayalı Ekmek', platform: 'Instagram', score: 89, growth: '+175%', status: 'Hızlanıyor', volume: '1.7M', trajectory: [22, 45, 68, 82, 89] },
        { id: 5, name: 'Airfryer Çıtır Tavuk Kanatları', platform: 'YouTube', score: 92, growth: '+220%', status: 'Zirvede', volume: '2.8M', trajectory: [28, 52, 74, 86, 92] }
      ],
      fitness: [
        { id: 1, name: 'Pilates Reformer Egzersizleri', platform: 'Instagram', score: 93, growth: '+205%', status: 'Hızlanıyor', volume: '1.4M', trajectory: [25, 50, 75, 88, 93] },
        { id: 2, name: 'Evde 10 Bin Adım Challenge', platform: 'YouTube', score: 86, growth: '+125%', status: 'Yükseliyor', volume: '950K', trajectory: [15, 35, 55, 72, 86] },
        { id: 3, name: 'Sabah Koşusu & 5 AM Kulübü', platform: 'TikTok', score: 81, growth: '+70%', status: 'Zirvede', volume: '1.9M', trajectory: [35, 50, 68, 78, 81] },
        { id: 4, name: 'Buz Banyosu (Cold Plunge) Rutini', platform: 'TikTok', score: 94, growth: '+270%', status: 'Hızlanıyor', volume: '2.2M', trajectory: [20, 48, 72, 88, 94] },
        { id: 5, name: 'Hibrit Atlet Güç & Kondisyon', platform: 'YouTube', score: 88, growth: '+180%', status: 'Yükseliyor', volume: '810K', trajectory: [18, 40, 62, 78, 88] }
      ]
    },
    US: {
      beauty: [
        { id: 1, name: 'Clean Girl Glass Skin Routine', platform: 'TikTok', score: 95, growth: '+320%', status: 'Hızlanıyor', volume: '4.5M', trajectory: [15, 40, 72, 90, 95] },
        { id: 2, name: '90s Blowout Haircut Tutorial', platform: 'Instagram', score: 91, growth: '+210%', status: 'Yükseliyor', volume: '2.8M', trajectory: [20, 45, 68, 85, 91] },
        { id: 3, name: 'Glazed Donut Nails Look', platform: 'TikTok', score: 85, growth: '+110%', status: 'Zirvede', volume: '6.2M', trajectory: [35, 55, 75, 88, 85] },
        { id: 4, name: 'Korean Skincare Double Cleanse', platform: 'Instagram', score: 92, growth: '+240%', status: 'Hızlanıyor', volume: '3.1M', trajectory: [22, 48, 72, 86, 92] },
        { id: 5, name: 'Hydrating Overnight Lip Mask', platform: 'TikTok', score: 87, growth: '+160%', status: 'Zirvede', volume: '1.9M', trajectory: [28, 50, 68, 80, 87] }
      ],
      tech: [
        { id: 1, name: 'ChatGPT-5 Model Forecasts', platform: 'YouTube', score: 98, growth: '+420%', status: 'Hızlanıyor', volume: '3.8M', trajectory: [10, 35, 70, 92, 98] },
        { id: 2, name: 'Ergonomic Desk Setup Aesthetics', platform: 'Instagram', score: 87, growth: '+140%', status: 'Yükseliyor', volume: '1.9M', trajectory: [18, 38, 58, 76, 87] },
        { id: 3, name: 'Apple Vision Pro Work Apps', platform: 'YouTube', score: 81, growth: '+85%', status: 'Zirvede', volume: '5.1M', trajectory: [40, 60, 75, 83, 81] },
        { id: 4, name: 'AI Voice Cloning Studio Test', platform: 'TikTok', score: 94, growth: '+290%', status: 'Hızlanıyor', volume: '2.4M', trajectory: [20, 45, 70, 88, 94] },
        { id: 5, name: 'Wireless Creator Mic Shootout', platform: 'YouTube', score: 89, growth: '+175%', status: 'Zirvede', volume: '1.5M', trajectory: [25, 48, 68, 80, 89] }
      ],
      fashion: [
        { id: 1, name: 'Sustainable Thrift Store Hauls', platform: 'Instagram', score: 93, growth: '+230%', status: 'Hızlanıyor', volume: '2.4M', trajectory: [25, 48, 72, 88, 93] },
        { id: 2, name: 'Y2K Streetwear Outfits', platform: 'TikTok', score: 88, growth: '+190%', status: 'Yükseliyor', volume: '3.1M', trajectory: [15, 35, 55, 75, 88] },
        { id: 3, name: 'Oversized Leather Jackets styling', platform: 'TikTok', score: 82, growth: '+95%', status: 'Zirvede', volume: '4.8M', trajectory: [30, 50, 70, 80, 82] },
        { id: 4, name: 'Fall Minimal Capsule Wardrobe', platform: 'Instagram', score: 90, growth: '+210%', status: 'Hızlanıyor', volume: '1.8M', trajectory: [20, 45, 68, 84, 90] },
        { id: 5, name: 'Sneaker Restoration & Care', platform: 'YouTube', score: 85, growth: '+130%', status: 'Zirvede', volume: '2.2M', trajectory: [25, 48, 66, 78, 85] }
      ],
      gaming: [
        { id: 1, name: 'GTA 6 Gameplay Theories', platform: 'YouTube', score: 97, growth: '+510%', status: 'Hızlanıyor', volume: '8.4M', trajectory: [10, 30, 65, 88, 97] },
        { id: 2, name: 'Cozy Nintendo Switch Games', platform: 'TikTok', score: 89, growth: '+130%', status: 'Yükseliyor', volume: '2.1M', trajectory: [20, 40, 60, 78, 89] },
        { id: 3, name: 'Speedrunning Elden Ring DLC', platform: 'YouTube', score: 84, growth: '+115%', status: 'Zirvede', volume: '3.9M', trajectory: [35, 55, 75, 86, 84] },
        { id: 4, name: 'Retro Handheld Console Mods', platform: 'YouTube', score: 91, growth: '+220%', status: 'Hızlanıyor', volume: '1.7M', trajectory: [18, 42, 68, 84, 91] },
        { id: 5, name: 'Custom Mechanical Keyboard Build', platform: 'TikTok', score: 86, growth: '+140%', status: 'Zirvede', volume: '2.6M', trajectory: [25, 48, 68, 78, 86] }
      ],
      food: [
        { id: 1, name: 'Spicy Vodka Pasta Recipe', platform: 'TikTok', score: 96, growth: '+310%', status: 'Hızlanıyor', volume: '5.2M', trajectory: [18, 42, 70, 92, 96] },
        { id: 2, name: 'Aesthetic Matcha Latte ASMR', platform: 'Instagram', score: 88, growth: '+150%', status: 'Yükseliyor', volume: '3.6M', trajectory: [22, 45, 62, 78, 88] },
        { id: 3, name: 'Sourdough Bread Scoring Art', platform: 'TikTok', score: 83, growth: '+85%', status: 'Zirvede', volume: '6.4M', trajectory: [45, 65, 78, 85, 83] },
        { id: 4, name: 'Airfryer Crispy Chicken Wings', platform: 'YouTube', score: 93, growth: '+270%', status: 'Hızlanıyor', volume: '4.1M', trajectory: [20, 48, 72, 88, 93] },
        { id: 5, name: 'High Protein Meal Prep Bowl', platform: 'TikTok', score: 89, growth: '+190%', status: 'Zirvede', volume: '2.8M', trajectory: [25, 50, 70, 82, 89] }
      ],
      fitness: [
        { id: 1, name: 'Reformer Pilates Studio Vlogs', platform: 'Instagram', score: 94, growth: '+250%', status: 'Hızlanıyor', volume: '2.9M', trajectory: [30, 55, 78, 90, 94] },
        { id: 2, name: 'Zone 2 Cardio Zone Running', platform: 'YouTube', score: 88, growth: '+140%', status: 'Yükseliyor', volume: '1.8M', trajectory: [15, 38, 58, 76, 88] },
        { id: 3, name: 'Hybrid Athlete Training Routine', platform: 'TikTok', score: 83, growth: '+90%', status: 'Zirvede', volume: '3.2M', trajectory: [35, 55, 72, 85, 83] },
        { id: 4, name: 'Cold Plunge Recovery Challenge', platform: 'TikTok', score: 92, growth: '+280%', status: 'Hızlanıyor', volume: '3.6M', trajectory: [20, 45, 70, 86, 92] },
        { id: 5, name: 'Mobility Routine for Desk Workers', platform: 'YouTube', score: 86, growth: '+150%', status: 'Zirvede', volume: '1.5M', trajectory: [25, 48, 66, 78, 86] }
      ]
    },
    GB: {
      beauty: [
        { id: 1, name: 'British Cold Girl Makeup style', platform: 'TikTok', score: 93, growth: '+210%', status: 'Hızlanıyor', volume: '820K', trajectory: [20, 42, 65, 84, 93] },
        { id: 2, name: '90s Blowout Curly Hair', platform: 'Instagram', score: 86, growth: '+150%', status: 'Yükseliyor', volume: '560K', trajectory: [15, 35, 55, 72, 86] },
        { id: 3, name: 'Dewy Skin Prep Routine', platform: 'TikTok', score: 80, growth: '+80%', status: 'Zirvede', volume: '1.2M', trajectory: [30, 50, 68, 78, 80] },
        { id: 4, name: 'K-Beauty Glass Skin Essence', platform: 'Instagram', score: 90, growth: '+190%', status: 'Hızlanıyor', volume: '940K', trajectory: [22, 45, 68, 82, 90] },
        { id: 5, name: 'Nude Lip Combo Tutorial', platform: 'TikTok', score: 84, growth: '+130%', status: 'Zirvede', volume: '680K', trajectory: [28, 48, 66, 76, 84] }
      ],
      tech: [
        { id: 1, name: 'Best AI Productivity Apps 2026', platform: 'YouTube', score: 95, growth: '+280%', status: 'Hızlanıyor', volume: '310K', trajectory: [10, 32, 62, 84, 95] },
        { id: 2, name: 'Minimalist Office Desk setups', platform: 'Instagram', score: 84, growth: '+110%', status: 'Yükseliyor', volume: '720K', trajectory: [15, 30, 50, 68, 84] },
        { id: 3, name: 'Handheld Gaming PC Benchmarks', platform: 'YouTube', score: 79, growth: '+80%', status: 'Zirvede', volume: '1.1M', trajectory: [35, 52, 68, 76, 79] },
        { id: 4, name: 'AI Voice Clone Review UK', platform: 'TikTok', score: 92, growth: '+250%', status: 'Hızlanıyor', volume: '520K', trajectory: [18, 42, 66, 84, 92] },
        { id: 5, name: 'Smart Home Lighting Automation', platform: 'YouTube', score: 87, growth: '+160%', status: 'Zirvede', volume: '810K', trajectory: [25, 46, 65, 78, 87] }
      ],
      fashion: [
        { id: 1, name: 'Sustainable Outerwear Winter coats', platform: 'Instagram', score: 92, growth: '+180%', status: 'Hızlanıyor', volume: '640K', trajectory: [25, 48, 70, 86, 92] },
        { id: 2, name: 'UK Streetwear Vintage Jackets', platform: 'TikTok', score: 87, growth: '+160%', status: 'Yükseliyor', volume: '980K', trajectory: [18, 38, 56, 74, 87] },
        { id: 3, name: 'Chelsea Boots outfit styling', platform: 'TikTok', score: 81, growth: '+75%', status: 'Zirvede', volume: '1.5M', trajectory: [40, 58, 72, 80, 81] },
        { id: 4, name: 'Capsule Closet Layering Guide', platform: 'Instagram', score: 89, growth: '+195%', status: 'Hızlanıyor', volume: '780K', trajectory: [20, 44, 66, 82, 89] },
        { id: 5, name: 'Thrift Flip Vintage Haul', platform: 'YouTube', score: 84, growth: '+125%', status: 'Zirvede', volume: '490K', trajectory: [26, 48, 64, 76, 84] }
      ],
      gaming: [
        { id: 1, name: 'Elden Ring DLC Speedrun Guide', platform: 'YouTube', score: 94, growth: '+320%', status: 'Hızlanıyor', volume: '1.2M', trajectory: [15, 38, 65, 86, 94] },
        { id: 2, name: 'Cozy PC Setup Room Makeovers', platform: 'TikTok', score: 88, growth: '+120%', status: 'Yükseliyor', volume: '850K', trajectory: [20, 42, 62, 78, 88] },
        { id: 3, name: 'Retro Gaming Handheld Reviews', platform: 'YouTube', score: 82, growth: '+90%', status: 'Zirvede', volume: '920K', trajectory: [35, 55, 72, 80, 82] },
        { id: 4, name: 'GTA 6 UK Map Theories', platform: 'YouTube', score: 96, growth: '+410%', status: 'Hızlanıyor', volume: '2.4M', trajectory: [12, 36, 68, 88, 96] },
        { id: 5, name: 'Custom Ergonomic Mouse Test', platform: 'TikTok', score: 86, growth: '+140%', status: 'Zirvede', volume: '620K', trajectory: [24, 46, 64, 78, 86] }
      ],
      food: [
        { id: 1, name: 'Aesthetic London Matcha Cafes', platform: 'Instagram', score: 95, growth: '+290%', status: 'Hızlanıyor', volume: '1.1M', trajectory: [20, 45, 72, 88, 95] },
        { id: 2, name: 'One-Pot Sunday Roast hacks', platform: 'TikTok', score: 89, growth: '+140%', status: 'Yükseliyor', volume: '1.4M', trajectory: [15, 35, 58, 76, 89] },
        { id: 3, name: 'Sourdough scoring technique ASMR', platform: 'TikTok', score: 82, growth: '+80%', status: 'Zirvede', volume: '1.9M', trajectory: [35, 55, 70, 78, 82] },
        { id: 4, name: 'Airfryer British Pub Chips', platform: 'YouTube', score: 91, growth: '+220%', status: 'Hızlanıyor', volume: '980K', trajectory: [18, 42, 66, 84, 91] },
        { id: 5, name: 'High Protein English Breakfast', platform: 'TikTok', score: 86, growth: '+150%', status: 'Zirvede', volume: '740K', trajectory: [25, 48, 66, 78, 86] }
      ],
      fitness: [
        { id: 1, name: 'London Reformer Pilates classes', platform: 'Instagram', score: 92, growth: '+195%', status: 'Hızlanıyor', volume: '750K', trajectory: [25, 48, 70, 85, 92] },
        { id: 2, name: 'Hybrid Running Strength program', platform: 'YouTube', score: 85, growth: '+110%', status: 'Yükseliyor', volume: '480K', trajectory: [12, 32, 52, 70, 85] },
        { id: 3, name: 'Outdoor Running vlog aesthetic', platform: 'TikTok', score: 80, growth: '+70%', status: 'Zirvede', volume: '890K', trajectory: [30, 48, 65, 76, 80] },
        { id: 4, name: 'Cold Water Swimming Dip Routine', platform: 'TikTok', score: 93, growth: '+260%', status: 'Hızlanıyor', volume: '1.1M', trajectory: [18, 42, 68, 85, 93] },
        { id: 5, name: 'Daily 10K Step Walk Vlog', platform: 'YouTube', score: 86, growth: '+130%', status: 'Zirvede', volume: '620K', trajectory: [24, 46, 64, 76, 86] }
      ]
    },
    DE: {
      beauty: [
        { id: 1, name: 'Glass Skin Routine Apotheke-Tipps', platform: 'TikTok', score: 92, growth: '+180%', status: 'Hızlanıyor', volume: '510K', trajectory: [18, 38, 60, 80, 92] },
        { id: 2, name: 'Locken ohne Hitze Flechttechnik', platform: 'Instagram', score: 85, growth: '+120%', status: 'Yükseliyor', volume: '390K', trajectory: [12, 32, 52, 70, 85] },
        { id: 3, name: 'Estetische Make-up Routine', platform: 'TikTok', score: 79, growth: '+75%', status: 'Zirvede', volume: '880K', trajectory: [30, 48, 64, 75, 79] },
        { id: 4, name: 'Korean Skincare Doppelreinigung', platform: 'Instagram', score: 91, growth: '+210%', status: 'Hızlanıyor', volume: '640K', trajectory: [20, 45, 68, 83, 91] },
        { id: 5, name: 'Lippenpflege & Gloss Kombi', platform: 'TikTok', score: 84, growth: '+130%', status: 'Zirvede', volume: '420K', trajectory: [26, 46, 64, 76, 84] }
      ],
      tech: [
        { id: 1, name: 'AI Software Entwickler Tools 2026', platform: 'YouTube', score: 94, growth: '+260%', status: 'Hızlanıyor', volume: '220K', trajectory: [10, 30, 58, 80, 94] },
        { id: 2, name: 'Minimalismus Home Office Setup', platform: 'Instagram', score: 83, growth: '+95%', status: 'Yükseliyor', volume: '480K', trajectory: [15, 30, 48, 66, 83] },
        { id: 3, name: 'Katlanabilir Smartphone Testbericht', platform: 'YouTube', score: 78, growth: '+70%', status: 'Zirvede', volume: '750K', trajectory: [32, 50, 65, 74, 78] },
        { id: 4, name: 'KI Sprachklonen Anleitung DE', platform: 'TikTok', score: 93, growth: '+290%', status: 'Hızlanıyor', volume: '390K', trajectory: [18, 42, 66, 84, 93] },
        { id: 5, name: 'Kabellose Mikrofone Test 2026', platform: 'YouTube', score: 88, growth: '+170%', status: 'Zirvede', volume: '510K', trajectory: [24, 46, 64, 78, 88] }
      ],
      fashion: [
        { id: 1, name: 'Estetische Kapsel Kleiderschrank', platform: 'Instagram', score: 90, growth: '+170%', status: 'Hızlanıyor', volume: '420K', trajectory: [20, 40, 62, 80, 90] },
        { id: 2, name: 'Streetwear Vintage Outfit-Ideen', platform: 'TikTok', score: 85, growth: '+135%', status: 'Yükseliyor', volume: '680K', trajectory: [15, 32, 50, 68, 85] },
        { id: 3, name: 'Lederjacke Oversized Kombinationen', platform: 'TikTok', score: 79, growth: '+80%', status: 'Zirvede', volume: '1.2M', trajectory: [35, 52, 68, 76, 79] },
        { id: 4, name: 'Herbst Outfit Layering Guide', platform: 'Instagram', score: 88, growth: '+180%', status: 'Hızlanıyor', volume: '530K', trajectory: [22, 44, 66, 80, 88] },
        { id: 5, name: 'Sneaker Reinigung Hacks DE', platform: 'YouTube', score: 83, growth: '+115%', status: 'Zirvede', volume: '360K', trajectory: [25, 46, 62, 74, 83] }
      ],
      gaming: [
        { id: 1, name: 'GTA 6 Trailer Analysen Deutsch', platform: 'YouTube', score: 95, growth: '+410%', status: 'Hızlanıyor', volume: '980K', trajectory: [10, 32, 60, 82, 95] },
        { id: 2, name: 'Cozy Gaming Zimmer Deko-Tipps', platform: 'TikTok', score: 86, growth: '+105%', status: 'Yükseliyor', volume: '580K', trajectory: [15, 32, 50, 70, 86] },
        { id: 3, name: 'Elden Ring DLC Speedrun Rekord', platform: 'YouTube', score: 81, growth: '+85%', status: 'Zirvede', volume: '620K', trajectory: [35, 52, 68, 77, 81] },
        { id: 4, name: 'Retro Handheld Konsole Modding', platform: 'YouTube', score: 90, growth: '+210%', status: 'Hızlanıyor', volume: '410K', trajectory: [18, 40, 64, 80, 90] },
        { id: 5, name: 'Custom Tastatur Bau Anleitung', platform: 'TikTok', score: 85, growth: '+130%', status: 'Zirvede', volume: '590K', trajectory: [24, 46, 64, 76, 85] }
      ],
      food: [
        { id: 1, name: 'Brot Backen scoring methoden ASMR', platform: 'TikTok', score: 94, growth: '+280%', status: 'Hızlanıyor', volume: '1.5M', trajectory: [15, 38, 65, 85, 94] },
        { id: 2, name: 'Eiskaffee Matcha Latte Rezept', platform: 'Instagram', score: 88, growth: '+140%', status: 'Yükseliyor', volume: '950K', trajectory: [20, 40, 58, 75, 88] },
        { id: 3, name: 'One-Pot Nudeln Schnelles Rezept', platform: 'TikTok', score: 81, growth: '+75%', status: 'Zirvede', volume: '1.1M', trajectory: [30, 48, 64, 76, 81] },
        { id: 4, name: 'Airfryer Knuspriges Hähnchen', platform: 'YouTube', score: 92, growth: '+240%', status: 'Hızlanıyor', volume: '870K', trajectory: [18, 44, 68, 84, 92] },
        { id: 5, name: 'Proteinreiches Frühstück Bowl', platform: 'TikTok', score: 87, growth: '+160%', status: 'Zirvede', volume: '630K', trajectory: [25, 48, 66, 78, 87] }
      ],
      fitness: [
        { id: 1, name: 'Pilates Reformer Training Übungen', platform: 'Instagram', score: 91, growth: '+180%', status: 'Hızlanıyor', volume: '540K', trajectory: [22, 45, 68, 83, 91] },
        { id: 2, name: 'Laufvlog 5 AM Club Motivation', platform: 'TikTok', score: 84, growth: '+105%', status: 'Yükseliyor', volume: '620K', trajectory: [15, 32, 52, 68, 84] },
        { id: 3, name: 'Zuhause 10K Schritte Workout', platform: 'YouTube', score: 79, growth: '+65%', status: 'Zirvede', volume: '710K', trajectory: [30, 48, 64, 75, 79] },
        { id: 4, name: 'Eisbad Regeneration Challenge', platform: 'TikTok', score: 93, growth: '+270%', status: 'Hızlanıyor', volume: '810K', trajectory: [18, 42, 66, 85, 93] },
        { id: 5, name: 'Hybrider Athlet Workout Plan', platform: 'YouTube', score: 87, growth: '+140%', status: 'Zirvede', volume: '490K', trajectory: [24, 46, 64, 76, 87] }
      ]
    }
  };

  const mockTrends = countryTrends[activeCountry];


  // Testimonials / User reviews: 3 glowing reviews
  const testimonials = [
    {
      name: 'Merve Demirel',
      role: lang === 'tr' ? 'Güzellik & Yaşam Creatorı' : 'Beauty & Lifestyle Creator',
      avatar: 'MD',
      rating: 5,
      comment: lang === 'tr' ? 'TrendVista sayesinde paylaştığım 3 video peş peşe keşfete düştü! Uyum skoru yüksek trendleri stüdyoda senaryolaştırmak tam bir oyun değiştirici.' : 'Thanks to TrendVista, 3 of my videos went viral back-to-back! Scripting trends with high affinity score is an absolute game changer.'
    },
    {
      name: 'Alex Mercer',
      role: lang === 'tr' ? 'Teknoloji Editörü & Youtuber' : 'Tech Reviewer & YouTuber',
      avatar: 'AM',
      rating: 5,
      comment: lang === 'tr' ? 'Doygunlaşan trendleri eliyorum, ilk sinyallerle anında içerik planlıyorum. Kodlama asistanı inceleme videosu ile izlenme oranlarım %300 arttı!' : 'I filter out saturated trends and script early signal trends immediately. My watch time grew by 300% after scripting the coding assistant trend!'
    },
    {
      name: 'Selin Şahin',
      role: lang === 'tr' ? 'Marka Pazarlama Müdürü' : 'Brand Marketing Manager',
      avatar: 'SŞ',
      rating: 5,
      comment: lang === 'tr' ? 'Markamız için AI kampanya motorunu kullanarak 15 dakikada brief çıkardık ve eşleşen creatorlar ile harika bir uyum yakaladık. 5 yıldızlı bir platform.' : 'Using the AI campaign engine for our skincare brand, we created a comprehensive brief in 15 minutes and matched perfect creators. A 5-star tool!'
    }
  ];

  // 3 Paid plans aligned with customized boundaries
  const plans = [
    {
      name: 'Starter Plan',
      price: '200₺',
      period: lang === 'tr' ? '/ay' : '/month',
      features: lang === 'tr' ? [
        'Hızla yükselen trend radarı',
        '1 Kategoriye özel trend akışı',
        '3 Akıllı alarm kurma',
        '1 Sosyal medya hesabı bağlama',
        'Temel rakip kıyaslama analizi',
        '1 Ekip koltuğu'
      ] : [
        'Rapidly rising trend radar',
        '1 Custom category feed',
        'Set up to 3 smart alerts',
        'Connect 1 social channel',
        'Basic competitor comparison',
        '1 Team seat'
      ]
    },
    {
      name: 'Professional Plan',
      price: '500₺',
      period: lang === 'tr' ? '/ay' : '/month',
      features: lang === 'tr' ? [
        '3 Kategoriye özel gelişmiş radar',
        'AI İçerik Stüdyosu (Senaryo & Kancalar)',
        'AI Kampanya Fikir Motoru',
        'Rakip İstihbaratı ve analiz raporları',
        '3 Sosyal medya hesabı bağlama',
        '3 Ekip koltuğu ile ortak çalışma',
        'Filigransız paylaşılabilir başarı kartları'
      ] : [
        'Advanced radar for 3 categories',
        'AI Content Studio (Scripts & Hooks)',
        'AI Campaign Concept Generator',
        'Competitor Intelligence & reports',
        'Connect up to 3 social channels',
        'Collaborate with 3 team seats',
        'Watermark-free success share cards'
      ],
      popular: true
    },
    {
      name: 'Enterprise Plan',
      price: '800₺',
      period: lang === 'tr' ? '/ay' : '/month',
      features: lang === 'tr' ? [
        'Tüm kategoriler & sektörlerin takibi',
        'Sınırsız hesap entegrasyonu',
        'Gelişmiş sosyal dinleme & kriz merkezi',
        'API ve Webhook veri bağlantısı',
        'SSO, SLA ve Denetim Kayıtları (Audit Logs)',
        'Sınırsız ekip koltuğu yetkilendirmesi',
        '7/24 öncelikli müşteri başarısı desteği'
      ] : [
        'Unrestricted category & sector radar',
        'Unlimited social connections',
        'Advanced social listening & crisis board',
        'API and Webhook data streams',
        'SSO, SLA and Audit Log compliance',
        'Unlimited team seats & delegation',
        '24/7 priority customer success support'
      ]
    }
  ];

  const handleOpenCheckout = (plan) => {
    if (!isAuthenticated) {
      setAuthMode('register');
    } else if (onIyzicoCheckout) {
      onIyzicoCheckout(plan.name);
    } else {
      setCheckoutPlan(plan);
      setPaymentStep('form');
      setCardHolder('');
      setCardNumber('');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentStep('loading');
    setTimeout(() => {
      setPaymentStep('success');
      setUserPlan(checkoutPlan.name);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const navigateToWorkspace = (targetView) => {
    setView(targetView);
  };

  // Chatbot logic helper
  useEffect(() => {
    // Initial welcome message
    setChatMessages([
      { sender: 'bot', text: t[lang].chatbotWelcome }
    ]);
  }, [lang]);

  const sendChatMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    // Simulate smart bot response based on rich local database
    if (isGeminiEnabled) {
      chatWithAiAssistant({ message: text, lang }).then((aiResponse) => {
        setChatMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
        setIsBotTyping(false);
      });
    } else {
      setTimeout(() => {
        let botText = '';
        const lowercaseText = text.toLowerCase();

        const dataset = chatbotKnowledgeBase[lang] || chatbotKnowledgeBase['en'];
        let foundAnswer = null;

        for (const cat of dataset) {
          for (const qObj of cat.questions) {
            const hasMatch = qObj.keywords.some(kw => lowercaseText.includes(kw));
            if (hasMatch) {
              foundAnswer = qObj.a;
              break;
            }
          }
          if (foundAnswer) break;
        }

        if (foundAnswer) {
          botText = foundAnswer;
        } else {
          botText = lang === 'tr'
            ? 'Sorunuzu tam olarak anlayamadım. TrendVista hakkında her şeyi biliyorum! Lütfen paneldeki kategorilerden bir soru seçin veya planlar, kanal bağlama, AI senaryoları veya güvenlik hakkında farklı kelimelerle sorun.'
            : 'I couldn\'t quite catch that. I am fully trained on TrendVista systems! Please choose one of the quick questions from the categories below or ask about pricing, linking channels, safety, or AI scripts.';
        }

        setChatMessages(prev => [...prev, { sender: 'bot', text: botText }]);
        setIsBotTyping(false);
      }, 900);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Background Glows */}
      <div className="bg-glow-spot bg-glow-blue" />
      <div className="bg-glow-spot bg-glow-cyan" />
      <div className="bg-glow-spot bg-glow-coral" />

      {/* Hero Section */}
      <section style={{ padding: '130px 0 60px 0', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="badge badge-cyan" style={{ marginBottom: '1.5rem' }}>
                <Sparkles size={12} /> {t[lang].heroBadge}
              </div>
              <h1 style={{ fontSize: '3.6rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: 800 }}>
                {t[lang].heroTitle1} <br />
                <span className="text-gradient-cyan-blue">{t[lang].heroTitle2}</span> <br />
                {t[lang].heroTitle3}
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '540px' }}>
                {t[lang].heroDesc}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigateToWorkspace('creator')} className="btn btn-primary">
                  {t[lang].heroBtnCreator} <ArrowRight size={16} />
                </button>
                <button onClick={() => navigateToWorkspace('brand')} className="btn btn-secondary">
                  {t[lang].heroBtnBrand}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '3.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>%92</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t[lang].statAccuracy}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>%3.4x</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t[lang].statEngagement}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>24h</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t[lang].statAlert}</p>
                </div>
              </div>
            </div>

            {/* Interactive Trend Radar Preview */}
            <div style={{ position: 'relative', marginTop: '-3rem' }}>
              <div className="glass-card" style={{ padding: '1.8rem', border: '1px solid rgba(0, 210, 255, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red', animation: 'pulse 1.5s infinite' }} />
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{t[lang].radarTitle}</h3>
                  </div>

                  {/* Dynamic Country Selector Flags */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {[
                      { code: 'TR', flag: '🇹🇷', label: 'TR' },
                      { code: 'US', flag: '🇺🇸', label: 'US' },
                      { code: 'GB', flag: '🇬🇧', label: 'GB' },
                      { code: 'DE', flag: '🇩🇪', label: 'DE' }
                    ].map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setActiveCountry(c.code);
                          setSelectedTrendId(1); // reset to first trend of category
                        }}
                        className={`btn ${activeCountry === c.code ? 'btn-glow-cyan' : 'btn-secondary'}`}
                        style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <span>{c.flag}</span> {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category selectors */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
                  {categories.map(cat => (
                    <button
                      key={cat.code}
                      onClick={() => {
                        setActiveCategory(cat.code);
                        setSelectedTrendId(mockTrends[cat.code]?.[0]?.id || 1);
                      }}
                      className="btn"
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        background: activeCategory === cat.code ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.03)',
                        borderColor: activeCategory === cat.code ? 'var(--color-secondary)' : 'var(--color-border)',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        color: activeCategory === cat.code ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Two-Column Grid: Trend List vs Details / Live Stream */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2rem', alignItems: 'start' }}>

                  {/* Left Column: Trend List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {mockTrends[activeCategory]?.map((trend) => (
                      <div
                        key={trend.id}
                        onClick={() => setSelectedTrendId(trend.id)}
                        className="trend-list-item"
                        style={{
                          background: selectedTrendId === trend.id ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                          padding: '1rem',
                          borderRadius: '12px',
                          border: selectedTrendId === trend.id ? '1px solid var(--color-secondary)' : '1px solid var(--color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              background: trend.platform === 'TikTok' ? 'rgba(255, 255, 255, 0.08)' : trend.platform === 'Instagram' ? 'rgba(225, 48, 108, 0.15)' : 'rgba(255, 0, 0, 0.12)',
                              color: trend.platform === 'TikTok' ? '#888' : trend.platform === 'Instagram' ? '#e1306c' : '#ff0000',
                              fontWeight: '600'
                            }}>
                              {trend.platform}
                            </span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{trend.volume}</span>
                          </div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>{trend.name}</h4>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary)', fontWeight: '700', fontSize: '1rem' }}>
                            <TrendingUp size={14} /> {trend.score}%
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>{trend.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Trend Details, Trajectory & Social Listener */}
                  {(() => {
                    const activeTrend = mockTrends[activeCategory]?.find(t => t.id === selectedTrendId) || mockTrends[activeCategory]?.[0];
                    if (!activeTrend) return null;

                    // Mock social feed matching current trend
                    const mockSocialPosts = [
                      { id: 1, user: '@ayse_trends', text: lang === 'tr' ? `Bu yeni trendi denedim: "${activeTrend.name}"! Gerçekten söylendiği kadar varmış, kesinlikle tavsiye ediyorum. ✨` : `Tried this new trend: "${activeTrend.name}"! Extremely viral right now, highly recommended. ✨`, platform: 'TikTok', likes: '12.4K', time: '2m' },
                      { id: 2, user: '@john_creator', text: lang === 'tr' ? `Just posted a new script showcasing "${activeTrend.name}". The engagement is rising fast! 🚀` : `Just posted a new script showcasing "${activeTrend.name}". The engagement is rising fast! 🚀`, platform: 'Instagram', likes: '4.8K', time: '5m' },
                      { id: 3, user: '@social_expert_tr', text: lang === 'tr' ? `Sırf bu "${activeTrend.name}" akımı için özel bir video hazırladım. Bu akşam keşfette! 🎬` : `Prepared a special video just for "${activeTrend.name}" buzz. Hits feed tonight! 🎬`, platform: 'TikTok', likes: '8.7K', time: '12m' }
                    ];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Buzz Trajectory Line Graph */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                          <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                              📈 {lang === 'tr' ? '24 Saatlik Buzz Traktörü (Trend Eğrisi)' : '24h Buzz Trajectory'}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                              {lang === 'tr' ? 'Maksimum Skora Doğru' : 'Rising to Peak'} ({activeTrend.status})
                            </span>
                          </div>

                          <div style={{ height: '70px', width: '100%', position: 'relative' }}>
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                              {/* Path matching trend trajectory numbers */}
                              <path
                                d={`M 0 ${20 - activeTrend.trajectory[0] * 0.15} L 25 ${20 - activeTrend.trajectory[1] * 0.15} L 50 ${20 - activeTrend.trajectory[2] * 0.15} L 75 ${20 - activeTrend.trajectory[3] * 0.15} L 100 ${20 - activeTrend.trajectory[4] * 0.15}`}
                                fill="none"
                                stroke="var(--color-secondary)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              {/* Filled gradient under path */}
                              <path
                                d={`M 0 ${20 - activeTrend.trajectory[0] * 0.15} L 25 ${20 - activeTrend.trajectory[1] * 0.15} L 50 ${20 - activeTrend.trajectory[2] * 0.15} L 75 ${20 - activeTrend.trajectory[3] * 0.15} L 100 ${20 - activeTrend.trajectory[4] * 0.15} L 100 20 L 0 20 Z`}
                                fill="rgba(0, 210, 255, 0.05)"
                              />
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                              <span>-24h</span>
                              <span>-12h</span>
                              <span>Now (Peak)</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Social Listening Post Stream */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                          <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'red', display: 'inline-block' }} />
                            📻 {lang === 'tr' ? 'Canlı Sosyal Medya Dinleme (Real-time Feed)' : 'Real-time Social Listening Feed'}
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {mockSocialPosts.map(p => (
                              <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ fontSize: '1.2rem' }}>{p.platform === 'TikTok' ? '🎵' : p.platform === 'Instagram' ? '📸' : '🐦'}</div>
                                <div style={{ flex: 1 }}>
                                  <div className="flex-between" style={{ marginBottom: '0.2rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{p.user}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{p.time}</span>
                                  </div>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{p.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {t[lang].radarSub}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Nasıl Çalışır Section - 6 adımlı simetrik dizilim */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>{t[lang].howItWorksTitle}</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {t[lang].howItWorksSub}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Step 1 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(27, 79, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <User size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step1}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step2}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 107, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step3}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step3Desc}
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-success)' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step4}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step4Desc}
              </p>
            </div>

            {/* Step 5 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-info)' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step5}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step5Desc}
              </p>
            </div>

            {/* Step 6 */}
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 107, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{t[lang].step6}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {t[lang].step6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Packages Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--color-border)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-coral" style={{ marginBottom: '1rem' }}>
              <CreditCard size={12} /> {lang === 'tr' ? 'YATIRIM' : 'INVESTMENT'}
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>{t[lang].pricingTitle}</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {t[lang].pricingSub}
            </p>
          </div>

          {/* Render Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: plan.popular ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  boxShadow: plan.popular ? `0 15px 30px rgba(0,210,255,0.06)` : 'none'
                }}
              >
                {plan.popular && (
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--color-secondary)',
                    color: '#050811',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {lang === 'tr' ? 'En Popüler' : 'Popular'}
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', marginBottom: '0.75rem' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text)' }}>{plan.price}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginLeft: '0.25rem' }}>{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                        <Check size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '0.1rem' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenCheckout(plan)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    background: plan.popular ? 'linear-gradient(135deg, var(--color-secondary) 0%, #009cb9 100%)' : 'linear-gradient(135deg, var(--color-primary) 0%, #1234c7 100%)',
                    color: plan.popular ? '#050811' : '#fff'
                  }}
                >
                  {t[lang].buyBtn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Replacing Beta sign up) */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--color-border)', background: 'linear-gradient(180deg, transparent 0%, rgba(0, 210, 255, 0.03) 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>{t[lang].testimonialsTitle}</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {t[lang].testimonialsSub}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((test, index) => (
              <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-secondary)" color="var(--color-secondary)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    "{test.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-glow)',
                    color: 'var(--color-secondary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>
                    {test.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '700' }}>{test.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal Overlay */}
      {checkoutPlan && (
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

            {/* Close Button */}
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
                  style={{ width: '100%', background: 'linear-gradient(135deg, var(--color-primary) 0%, #1234c7 100%)' }}
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
      )}

      {/* Floating Chatbot Assistant Component */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
        {/* Toggle Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="btn btn-glow-cyan"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 210, 255, 0.4)',
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            border: 'none',
            color: '#050811'
          }}
        >
          {showChat ? <X size={24} /> : <MessageSquare size={24} />}
        </button>

        {/* Chat Widget Panel */}
        {showChat && (
          <div className="glass-card animate-float" style={{
            position: 'absolute',
            bottom: '75px',
            right: 0,
            width: '380px',
            height: '520px',
            padding: '1.25rem',
            border: '1px solid var(--color-border-hover)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
            animation: 'none'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color="#fff" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 'bold' }}>TrendVista AI Assistant</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>● Online</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {/* Reset Conversation Button */}
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages([{ sender: 'bot', text: t[lang].chatbotWelcome }]);
                    setSelectedChatCategory(0);
                  }}
                  title={lang === 'tr' ? 'Sohbeti Sıfırla' : 'Reset Chat'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  <X size={16} />
                </button>
                {/* Minimize/Close Button (Line/Minus icon) */}
                <button
                  type="button"
                  onClick={() => setShowChat(false)}
                  title={lang === 'tr' ? 'Küçült' : 'Minimize'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem', marginBottom: '0.75rem' }}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--color-border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    maxWidth: '85%',
                    fontSize: '0.8rem',
                    color: 'var(--color-text)',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>
              ))}

              {isBotTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-border)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px 12px 12px 0',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--color-secondary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Yazıyor...</span>
                </div>
              )}
            </div>

            {/* Category Scroll Container */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '0.4rem',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              scrollbarWidth: 'none'
            }}>
              {(chatbotKnowledgeBase[lang] || chatbotKnowledgeBase['en']).map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedChatCategory(idx)}
                  className="btn"
                  style={{
                    flexShrink: 0,
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: selectedChatCategory === idx ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: selectedChatCategory === idx ? '1px solid var(--color-secondary)' : '1px solid var(--color-border)',
                    color: selectedChatCategory === idx ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Quick Prompt Bubbles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxHeight: '110px',
              overflowY: 'auto',
              marginBottom: '0.75rem',
              paddingRight: '2px'
            }}>
              {(chatbotKnowledgeBase[lang] || chatbotKnowledgeBase['en'])[selectedChatCategory]?.questions.map((qObj, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendChatMessage(qObj.q)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    lineHeight: '1.3'
                  }}
                >
                  💡 {qObj.q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
              style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}
            >
              <input
                type="text"
                placeholder={t[lang].chatPlaceholder}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(5, 8, 17, 0.4)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#fff',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-glow-cyan"
                style={{ width: '36px', height: '36px', padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Rich 4-Column Footer */}
      <footer style={{ padding: '60px 0 30px 0', borderTop: '1px solid rgba(0, 210, 255, 0.15)', background: 'rgba(5, 8, 17, 0.95)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem', textAlign: 'left' }}>
            {/* Col 1: Brand & Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#050811" strokeWidth={3} />
                </div>
                <span style={{ fontFamily: 'var(--font-title)', fontWeight: '800', fontSize: '1.3rem', color: '#fff' }}>
                  TrendVista <span style={{ color: 'var(--color-secondary)' }}>AI</span>
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.83rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                {lang === 'tr'
                  ? 'Yapay zeka destekli sosyal medya iletişim ve viral trend analiz platformu.'
                  : 'AI-powered social media intelligence & viral trend prediction engine.'}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.72rem', color: '#4ade80', fontWeight: '700' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                {lang === 'tr' ? 'Tüm Sistemler Aktif (%99.9 Uptime)' : 'All Systems Operational (%99.9 Uptime)'}
              </div>
            </div>

            {/* Col 2: Product & Tools */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'tr' ? 'Ürün & Araçlar' : 'Product & Tools'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.83rem' }}>
                <li><a onClick={() => navigateToWorkspace && navigateToWorkspace('creator')} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', cursor: 'pointer' }}>{lang === 'tr' ? 'Canlı Trend Radarı' : 'Live Trend Radar'}</a></li>
                <li><a onClick={() => navigateToWorkspace && navigateToWorkspace('creator')} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', cursor: 'pointer' }}>{lang === 'tr' ? 'AI İçerik Stüdyosu' : 'AI Content Studio'}</a></li>
                <li><a onClick={() => navigateToWorkspace && navigateToWorkspace('creator')} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', cursor: 'pointer' }}>{lang === 'tr' ? 'Viral Kanca Laboratuvarı' : 'Viral Hook Bank'}</a></li>
                <li><a onClick={() => navigateToWorkspace && navigateToWorkspace('brand')} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', cursor: 'pointer' }}>{lang === 'tr' ? 'Marka Kampanya Hub' : 'Brand Campaign Hub'}</a></li>
              </ul>
            </div>

            {/* Col 3: Corporate & Legal */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'tr' ? 'Kurumsal & Yasal' : 'Legal & Compliance'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.83rem' }}>
                <li><button onClick={() => setActiveLegalModal('privacy')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.83rem' }}>{lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</button></li>
                <li><button onClick={() => setActiveLegalModal('kvkk')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.83rem' }}>{lang === 'tr' ? 'KVKK Aydınlatma Metni' : 'KVKK Compliance'}</button></li>
                <li><button onClick={() => setActiveLegalModal('terms')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.83rem' }}>{lang === 'tr' ? 'Kullanım Şartları' : 'Terms of Use'}</button></li>
                <li><a style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>{lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}</a></li>
              </ul>
            </div>

            {/* Col 4: Contact & Creator */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'tr' ? 'İletişim & Kurucu' : 'Contact & Team'}
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.83rem', lineHeight: '1.6', margin: 0 }}>
                📩 <strong>{lang === 'tr' ? 'Destek:' : 'Support:'}</strong> destek@trendlab.ai<br />
                📍 <strong>{lang === 'tr' ? 'Konum:' : 'HQ:'}</strong> İstanbul / Türkiye<br />
                👨‍💻 <strong>{lang === 'tr' ? 'Geliştirici:' : 'Founder:'}</strong> Kaan Kaplan
              </p>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            <div>
              &copy; 2026 TrendVista AI. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button onClick={() => setActiveLegalModal('privacy')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>{lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</button>
              <button onClick={() => setActiveLegalModal('kvkk')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>{lang === 'tr' ? 'KVKK Metni' : 'KVKK'}</button>
              <button onClick={() => setActiveLegalModal('terms')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>{lang === 'tr' ? 'Kullanım Şartları' : 'Terms'}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Notice Popups */}
      {activeLegalModal && (
        <LegalNoticeModal
          type={activeLegalModal}
          onClose={() => setActiveLegalModal(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
