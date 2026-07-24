import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import CreatorWorkspace from './components/CreatorWorkspace';
import BrandWorkspace from './components/BrandWorkspace';
import { TrendingUp, Globe, User, LogOut, X, Check, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './contexts/useAuth.js';
import IyzicoModal from './components/IyzicoModal.jsx';
import PwaInstallBanner from './components/PwaInstallBanner.jsx';
import UserProfileModal from './components/UserProfileModal.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';

const languagesList = [
  { code: 'tr', label: 'Türkçe (TR)' },
  { code: 'en', label: 'English (EN)' },
  { code: 'de', label: 'Deutsch (DE)' },
  { code: 'fr', label: 'Français (FR)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'it', label: 'Italiano (IT)' },
  { code: 'ru', label: 'Русский (RU)' },
  { code: 'ja', label: '日本語 (JA)' },
  { code: 'zh', label: '简体中文 (ZH)' },
  { code: 'ar', label: 'العربية (AR)' }
];

function App() {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('tr');
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // --- Supabase Auth Context ---
  const auth = useAuth();

  // Local-state fallback for demo mode (when Supabase not configured)
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const [demoUser, setDemoUser] = useState(null);
  const [demoPlan, setDemoPlan] = useState(null);

  // Unified auth values: prefer Supabase, fall back to demo
  const isAuthenticated = auth.isSupabaseEnabled ? auth.isAuthenticated : demoAuthenticated;
  const user = auth.isSupabaseEnabled
    ? (auth.user ? { name: auth.profile?.full_name || auth.user.email.split('@')[0], email: auth.user.email, phone: auth.profile?.phone || '' } : null)
    : demoUser;
  const userPlan = auth.isSupabaseEnabled
    ? (auth.profile?.plan || 'Professional Plan')
    : (demoPlan || 'Professional Plan');
  const setUserPlan = auth.isSupabaseEnabled ? auth.updatePlan : setDemoPlan;

  // Auth form states
  const [authMode, setAuthMode] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  const formatPhone = (value) => {
    // Extract digits, skip country code 90 if present
    let digits = value.replace(/[^0-9]/g, '');
    if (digits.startsWith('90')) digits = digits.slice(2);
    const d = digits.slice(0, 10);
    if (d.length === 0) return '';
    let out = '+90 (';
    if (d.length <= 3) return out + d;
    out += d.slice(0, 3) + ') ';
    if (d.length <= 6) return out + d.slice(3);
    out += d.slice(3, 6) + ' ';
    if (d.length <= 8) return out + d.slice(6);
    return out + d.slice(6, 8) + ' ' + d.slice(8, 10);
  };

  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState('');
  const [theme, setTheme] = useState('dark');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const langMenuRef = useRef(null);

  // Sync theme to body class
  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
  }, [theme]);

  // Close language menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll tracking for nav animation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Demo mode: restore session from localStorage
  useEffect(() => {
    if (auth.isSupabaseEnabled) return; // Supabase handles session
    const savedUser = localStorage.getItem('trendlab_user');
    const savedPlan = localStorage.getItem('trendlab_plan');
    if (savedUser) {
      setDemoUser(JSON.parse(savedUser));
      setDemoAuthenticated(true);
      setDemoPlan(savedPlan || 'Free Plan');
    }
  }, [auth.isSupabaseEnabled]);

  // Handle payment success redirect if needed (runs once on mount)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const plan = params.get('plan');
    if (payment === 'success' && plan) {
      window.history.replaceState({}, '', window.location.pathname);
      setDemoPlan(plan);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once at mount to process redirect params

  // Reset form on mode switch
  useEffect(() => {
    setAuthError('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthPhone('');
    setAuthName('');
    setSelectedPlatforms([]);
    setForgotSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authMode]);

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'register' && authPassword !== authConfirmPassword) {
      setAuthError(lang === 'tr' ? 'Şifreler eşleşmiyor!' : 'Passwords do not match!');
      return;
    }

    setAuthLoading(true);

    // ── Supabase path ──
    if (auth.isSupabaseEnabled) {
      let result;
      if (authMode === 'register') {
        result = await auth.signUp({ email: authEmail, password: authPassword, fullName: authName, phone: authPhone });
      } else {
        result = await auth.signIn({ email: authEmail, password: authPassword });
      }

      setAuthLoading(false);

      if (result.error) {
        const msg = result.error.message || (lang === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.');
        setAuthError(msg);
        return;
      }

      setAuthMode(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      return;
    }

    // ── Demo mode fallback ──
    setTimeout(() => {
      const loggedUser = {
        name: authMode === 'register' ? authName : authEmail.split('@')[0],
        email: authEmail,
        phone: authMode === 'register' ? authPhone : ''
      };
      setDemoAuthenticated(true);
      setDemoUser(loggedUser);
      setDemoPlan('Free Plan');
      if (rememberMe) {
        localStorage.setItem('trendlab_user', JSON.stringify(loggedUser));
        localStorage.setItem('trendlab_plan', 'Free Plan');
      }
      setAuthLoading(false);
      setAuthMode(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }, 1000);
  };

  const handleLogout = async () => {
    if (auth.isSupabaseEnabled) {
      await auth.signOut();
    } else {
      setDemoAuthenticated(false);
      setDemoUser(null);
      setDemoPlan(null);
      localStorage.removeItem('trendlab_user');
      localStorage.removeItem('trendlab_plan');
    }
    setView('landing');
  };

  // iyzico Sandbox modal state
  const [iyzicoPlanModal, setIyzicoPlanModal] = useState(null);

  // Open iyzico Sandbox Checkout Modal
  const handleIyzicoCheckout = (planName) => {
    setIyzicoPlanModal(planName);
  };

  const handleIyzicoSuccess = async (planName) => {
    setIyzicoPlanModal(null);
    if (auth.isSupabaseEnabled) {
      await auth.updatePlan(planName);
    } else {
      setDemoPlan(planName);
    }
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  const t = {
    tr: {
      landing: 'Tanıtım',
      creator: 'Creator',
      brand: 'Brand',
      start: 'Hemen Başla',
      guide: 'Kılavuz',
      logo: 'TrendVista',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      email: 'E-posta Adresi',
      password: 'Şifre',
      fullname: 'Ad Soyad',
      authTitleLogin: 'Giriş Yap',
      authTitleReg: 'Kayıt Ol',
      authSubmitLogin: 'Giriş Yap',
      authSubmitReg: 'Kayıt Ol',
      switchReg: 'Hesabınız yok mu? Kayıt olun',
      switchLogin: 'Zaten üye misiniz? Giriş yapın',
      authNotice: 'Workspace alanlarına girmek için giriş yapmanız gerekmektedir.',
      authTitleForgot: 'Şifremi Unuttum',
      authSubmitForgot: 'Sıfırlama Bağlantısı Gönder',
      forgotSuccessText: 'Sıfırlama bağlantısı e-posta adresinize gönderildi.',
      backToLogin: 'Giriş Yap sekmesine dön',
      socialPlatforms: 'Kullandığınız Sosyal Medyalar',
      rememberMe: 'Beni Hatırla'
    },
    en: {
      landing: 'Overview',
      creator: 'Creator Hub',
      brand: 'Brand Hub',
      start: 'Get Started',
      guide: 'Guide',
      logo: 'TrendVista',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      email: 'Email Address',
      password: 'Password',
      fullname: 'Full Name',
      authTitleLogin: 'Sign In',
      authTitleReg: 'Create Account',
      authSubmitLogin: 'Sign In',
      authSubmitReg: 'Sign Up',
      switchReg: 'Don\'t have an account? Sign up',
      switchLogin: 'Already have an account? Sign in',
      authNotice: 'Authentication is required to enter workspace hubs.',
      authTitleForgot: 'Forgot Password',
      authSubmitForgot: 'Send Reset Link',
      forgotSuccessText: 'A password reset link has been sent to your email address.',
      backToLogin: 'Back to Login',
      socialPlatforms: 'Social Media Channels Used',
      rememberMe: 'Remember Me'
    },
    de: {
      landing: 'Übersicht',
      creator: 'Creator Hub',
      brand: 'Marken-Bereich',
      start: 'Jetzt starten',
      guide: 'Leitfaden',
      logo: 'TrendVista',
      login: 'Einloggen',
      register: 'Registrieren',
      logout: 'Abmelden',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      fullname: 'Vollständiger Name',
      authTitleLogin: 'Einloggen',
      authTitleReg: 'Konto erstellen',
      authSubmitLogin: 'Einloggen',
      authSubmitReg: 'Registrieren',
      switchReg: 'Noch kein Konto? Registrieren',
      switchLogin: 'Bereits Mitglied? Einloggen',
      authNotice: 'Eine Anmeldung ist erforderlich, um die Workspaces zu betreten.',
      authTitleForgot: 'Passwort vergessen',
      authSubmitForgot: 'Link senden',
      forgotSuccessText: 'Ein Link zum Zurücksetzen wurde an Ihre E-Mail-Adresse gesendet.',
      backToLogin: 'Zurück zum Login',
      socialPlatforms: 'Verwendete Social-Media-Kanäle',
      rememberMe: 'Angemeldet bleiben'
    },
    fr: {
      landing: 'Présentation',
      creator: 'Espace Créateur',
      brand: 'Espace Marque',
      start: 'Commencer',
      guide: 'Guide',
      logo: 'TrendVista',
      login: 'Se connecter',
      register: 'S\'inscrire',
      logout: 'Se déconnecter',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      fullname: 'Nom complet',
      authTitleLogin: 'Se connecter',
      authTitleReg: 'Créer un compte',
      authSubmitLogin: 'Se connecter',
      authSubmitReg: 'S\'inscrire',
      switchReg: 'Pas de compte ? S\'inscrire',
      switchLogin: 'Déjà membre ? Se connecter',
      authNotice: 'Une authentification est requise pour accéder aux espaces de travail.',
      authTitleForgot: 'Mot de passe oublié',
      authSubmitForgot: 'Envoyer le lien',
      forgotSuccessText: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
      backToLogin: 'Retour à la connexion',
      socialPlatforms: 'Réseaux sociaux utilisés',
      rememberMe: 'Se souvenir de moi'
    },
    es: {
      landing: 'Inicio',
      creator: 'Área de Creadores',
      brand: 'Área de Marcas',
      start: 'Empezar',
      guide: 'Guía',
      logo: 'TrendVista',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      logout: 'Cerrar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      fullname: 'Nombre completo',
      authTitleLogin: 'Iniciar sesión',
      authTitleReg: 'Crear cuenta',
      authSubmitLogin: 'Iniciar sesión',
      authSubmitReg: 'Registrarse',
      switchReg: '¿No tienes cuenta? Regístrate',
      switchLogin: '¿Ya tienes cuenta? Inicia sesión',
      authNotice: 'Se requiere autenticación para acceder a los paneles de trabajo.',
      authTitleForgot: 'Olvidé mi contraseña',
      authSubmitForgot: 'Enviar enlace',
      forgotSuccessText: 'Se ha enviado un enlace de restablecimiento a su correo.',
      backToLogin: 'Volver a iniciar sesión',
      socialPlatforms: 'Redes sociales utilizadas',
      rememberMe: 'Recordarme'
    },
    it: {
      landing: 'Panoramica',
      creator: 'Hub Creator',
      brand: 'Hub Brand',
      start: 'Inizia',
      guide: 'Guida',
      logo: 'TrendVista',
      login: 'Accedi',
      register: 'Registrati',
      logout: 'Esci',
      email: 'Indirizzo e-mail',
      password: 'Password',
      fullname: 'Nome completo',
      authTitleLogin: 'Accedi',
      authTitleReg: 'Crea account',
      authSubmitLogin: 'Accedi',
      authSubmitReg: 'Registrati',
      switchReg: 'Non hai un account? Registrati',
      switchLogin: 'Hai già un account? Accedi',
      authNotice: 'È richiesta l\'autenticazione per accedere ai workspace.',
      authTitleForgot: 'Password dimenticata',
      authSubmitForgot: 'Invia link',
      forgotSuccessText: 'Un link di ripristino è stato inviato alla tua e-mail.',
      backToLogin: 'Torna all\'accesso',
      socialPlatforms: 'Canali Social Utilizzati',
      rememberMe: 'Ricordami'
    },
    ru: {
      landing: 'Обзор',
      creator: 'Панель Creator',
      brand: 'Панель Brand',
      start: 'Начать',
      guide: 'Руководство',
      logo: 'TrendVista',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      email: 'Электронная почта',
      password: 'Пароль',
      fullname: 'Полное имя',
      authTitleLogin: 'Вход',
      authTitleReg: 'Создать аккаунт',
      authSubmitLogin: 'Войти',
      authSubmitReg: 'Регистрация',
      switchReg: 'Нет аккаунта? Зарегистрируйтесь',
      switchLogin: 'Уже есть аккаунт? Войдите',
      authNotice: 'Для входа в рабочие кабинеты требуется авторизация.',
      authTitleForgot: 'Забыли пароль',
      authSubmitForgot: 'Отправить ссылку',
      forgotSuccessText: 'Ссылка для сброса пароля отправлена на ваш e-mail.',
      backToLogin: 'Назад к входу',
      socialPlatforms: 'Используемые соцсети',
      rememberMe: 'Запомнить меня'
    },
    ja: {
      landing: '概要',
      creator: 'クリエイター領域',
      brand: 'ブランド領域',
      start: '始める',
      guide: 'ガイド',
      logo: 'TrendVista',
      login: 'ログイン',
      register: '新規登録',
      logout: 'ログアウト',
      email: 'メールアドレス',
      password: 'パスワード',
      fullname: 'フルネーム',
      authTitleLogin: 'ログイン',
      authTitleReg: 'アカウント作成',
      authSubmitLogin: 'ログイン',
      authSubmitReg: '新規登録',
      switchReg: 'アカウントをお持ちでないですか？登録する',
      switchLogin: 'すでに登録済みですか？ログインする',
      authNotice: 'ワークスペースを利用するにはログインが必要です。',
      authTitleForgot: 'パスワード再設定',
      authSubmitForgot: '再設定リンクを送信',
      forgotSuccessText: 'パスワード再設定リンクをメールで送信しました。',
      backToLogin: 'ログインに戻る',
      socialPlatforms: '利用中のSNSチャンネル',
      rememberMe: 'ログイン状態を保持する'
    },
    zh: {
      landing: '首页',
      creator: '创作者中心',
      brand: '品牌中心',
      start: '开始使用',
      guide: '使用指南',
      logo: 'TrendVista',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      email: '电子邮箱',
      password: '密码',
      fullname: '全名',
      authTitleLogin: '登录',
      authTitleReg: '创建账户',
      authSubmitLogin: '登录',
      authSubmitReg: '注册',
      switchReg: '还没有账户？去注册',
      switchLogin: '已有账户？去登录',
      authNotice: '进入工作区需要先登录账户。',
      authTitleForgot: '忘记密码',
      authSubmitForgot: '发送重置链接',
      forgotSuccessText: '重置密码链接已发送至您的邮箱。',
      backToLogin: '返回登录',
      socialPlatforms: '您使用的社交媒体',
      rememberMe: '记住我'
    },
    ar: {
      landing: 'الرئيسية',
      creator: 'مساحة المبدعين',
      brand: 'مساحة العلامات التجارية',
      start: 'ابدأ الآن',
      guide: 'الدليل',
      logo: 'TrendVista',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullname: 'الاسم الكامل',
      authTitleLogin: 'تسجيل الدخول',
      authTitleReg: 'إنشاء حساب',
      authSubmitLogin: 'تسجيل الدخول',
      authSubmitReg: 'إنشاء حساب',
      switchReg: 'ليس لديك حساب؟ سجل الآن',
      switchLogin: 'لديك حساب بالفعل؟ سجل دخولك',
      authNotice: 'تسجيل الدخول مطلوب للوصول إلى مساحات العمل.',
      authTitleForgot: 'هل نسيت كلمة المرور',
      authSubmitForgot: 'إرسال رابط إعادة التعيين',
      forgotSuccessText: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
      backToLogin: 'العودة لتسجيل الدخول',
      socialPlatforms: 'قنوات التواصل الاجتماعي المستخدمة',
      rememberMe: 'تذكرني'
    }
  };

  const navigateToWorkspace = (targetView) => {
    if (!isAuthenticated && !auth.isSupabaseEnabled) {
      // Auto-set demo session for seamless access
      setDemoUser({ name: 'Kaan Kaplan', email: 'kaan@trendlab.ai' });
      setDemoAuthenticated(true);
      setDemoPlan('Professional Plan');
      localStorage.setItem('trendlab_user', JSON.stringify({ name: 'Kaan Kaplan', email: 'kaan@trendlab.ai' }));
      localStorage.setItem('trendlab_plan', 'Professional Plan');
    }
    setView(targetView);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>

      {/* Global Navigation Header */}
      <header className={`header-nav ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container flex-between">

          {/* Logo */}
          <div
            onClick={() => setView('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
          >
            <div style={{
              background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 210, 255, 0.3)'
            }}>
              <TrendingUp size={20} color="#050811" strokeWidth={3} />
            </div>
            <span style={{
              fontFamily: 'var(--font-title)',
              fontWeight: '800',
              fontSize: '1.4rem',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #fff 40%, var(--color-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t[lang].logo}
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.3rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <button
              onClick={() => setView('landing')}
              className="btn"
              style={{
                background: view === 'landing' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
                color: view === 'landing' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                borderColor: view === 'landing' ? 'rgba(0, 210, 255, 0.35)' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                fontSize: '0.85rem',
                fontWeight: view === 'landing' ? '700' : '500',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                transition: 'all 0.2s ease'
              }}
            >
              {t[lang].landing}
            </button>
            <button
              onClick={() => navigateToWorkspace('creator')}
              className="btn"
              style={{
                background: view === 'creator' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
                color: view === 'creator' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                borderColor: view === 'creator' ? 'rgba(0, 210, 255, 0.35)' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                fontSize: '0.85rem',
                fontWeight: view === 'creator' ? '700' : '500',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                transition: 'all 0.2s ease'
              }}
            >
              {t[lang].creator}
            </button>
            <button
              onClick={() => navigateToWorkspace('brand')}
              className="btn"
              style={{
                background: view === 'brand' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.18) 0%, rgba(27, 79, 255, 0.12) 100%)' : 'transparent',
                color: view === 'brand' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                borderColor: view === 'brand' ? 'rgba(0, 210, 255, 0.35)' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                fontSize: '0.85rem',
                fontWeight: view === 'brand' ? '700' : '500',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                transition: 'all 0.2s ease'
              }}
            >
              {t[lang].brand}
            </button>
          </nav>

          {/* Action Button & Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Notification Center */}
            <NotificationCenter lang={lang} navigateToWorkspace={navigateToWorkspace} />

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary"
              style={{
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer'
              }}
              title={lang === 'tr' ? 'Temayı Değiştir' : 'Toggle Theme'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Language Dropdown */}
            <div ref={langMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Globe size={14} />
                <span style={{ textTransform: 'uppercase' }}>{lang}</span>
              </button>

              {showLangMenu && (
                <div
                  className="lang-dropdown"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'rgba(11, 15, 29, 0.95)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0, 210, 255, 0.25)',
                    borderRadius: '12px',
                    overflowY: 'auto',
                    maxHeight: '220px',
                    boxShadow: '0 10px 30px rgba(0, 210, 255, 0.15), 0 5px 15px rgba(0,0,0,0.5)',
                    zIndex: 200,
                    minWidth: '170px',
                    padding: '0.4rem'
                  }}
                >
                  {languagesList.map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => { setLang(langItem.code); setShowLangMenu(false); }}
                      className={`lang-dropdown-btn ${lang === langItem.code ? 'active' : ''}`}
                    >
                      <span>{langItem.label}</span>
                      {lang === langItem.code && <Check size={14} style={{ color: 'var(--color-secondary)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth button states */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  onClick={() => setShowProfileModal(true)}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.2s ease'
                  }}
                  title={lang === 'tr' ? 'Profil Detayları İçin Tıkla' : 'Click for Profile Details'}
                >
                  <User size={14} style={{ marginRight: '0.35rem', color: 'var(--color-secondary)' }} />
                  <strong style={{ color: 'var(--color-text)' }}>{user.name}</strong>
                  {userPlan && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem', marginLeft: '0.4rem', textTransform: 'none', cursor: 'pointer' }}>
                      {userPlan}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <LogOut size={12} /> {t[lang].logout}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setAuthMode('login')} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                  {t[lang].login}
                </button>
                <button onClick={() => setAuthMode('register')} className="btn btn-glow-cyan" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                  {t[lang].register}
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Auth Modal Overlay */}
      {authMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 17, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '1.75rem 2rem',
            maxHeight: '95vh',
            overflowY: 'auto',
            borderRadius: '16px',
            border: '1px solid rgba(0,210,255,0.15)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
          }}>
            <button
              onClick={() => setAuthMode(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--color-text-muted)', cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <form onSubmit={authMode === 'forgot' ? handleForgotPasswordSubmit : handleAuthSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'inline-flex',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0,210,255,0.15) 0%, rgba(27,79,255,0.1) 100%)',
                  border: '1px solid rgba(0,210,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)',
                  marginBottom: '0.6rem'
                }}>
                  <User size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: '0 0 0.2rem 0' }}>
                  {authMode === 'login' ? t[lang].authTitleLogin : (authMode === 'register' ? t[lang].authTitleReg : t[lang].authTitleForgot)}
                </h3>
                {authMode !== 'register' && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {t[lang].authNotice}
                  </p>
                )}
              </div>

              {authMode === 'forgot' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {forgotSuccess ? (
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '6px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: '600', margin: 0 }}>
                        {t[lang].forgotSuccessText}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t[lang].email}</label>
                        <input
                          type="email"
                          required
                          placeholder="ornek@trendlab.ai"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
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
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      >
                        {t[lang].authSubmitForgot}
                      </button>
                    </>
                  )}

                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setForgotSuccess(false); }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                    >
                      {t[lang].backToLogin}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {authError && (
                      <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.25)', borderRadius: '6px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-accent)', fontSize: '0.78rem', fontWeight: '600', margin: 0 }}>
                          {authError}
                        </p>
                      </div>
                    )}

                    {authMode === 'register' && (
                      <>
                        {/* Name + Phone row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t[lang].fullname}</label>
                            <input
                              type="text"
                              required
                              placeholder="Ad Soyad"
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '0.85rem',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {lang === 'tr' ? 'Telefon' : 'Phone'}
                            </label>
                            <input
                              type="tel"
                              placeholder="+90 (5xx) xxx xx xx"
                              value={authPhone}
                              onChange={(e) => setAuthPhone(formatPhone(e.target.value))}
                              style={{
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '0.85rem',
                                boxSizing: 'border-box',
                                letterSpacing: '0.03em'
                              }}
                            />
                          </div>
                        </div>

                        {/* Social platforms - compact pill chips */}
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {t[lang].socialPlatforms}
                          </label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {['TikTok', 'Instagram', 'YouTube'].map((platform) => {
                              const isChecked = selectedPlatforms.includes(platform);
                              const icons = { TikTok: '🎵', Instagram: '📸', YouTube: '▶️' };
                              const colors = { TikTok: '#69C9D0', Instagram: '#E1306C', YouTube: '#FF0000' };
                              return (
                                <div
                                  key={platform}
                                  onClick={() => {
                                    if (isChecked) {
                                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                                    } else {
                                      setSelectedPlatforms([...selectedPlatforms, platform]);
                                    }
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.3rem 0.65rem',
                                    borderRadius: '20px',
                                    border: isChecked ? `1px solid ${colors[platform]}` : '1px solid rgba(255,255,255,0.1)',
                                    background: isChecked ? `${colors[platform]}1a` : 'rgba(255,255,255,0.03)',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                    userSelect: 'none'
                                  }}
                                >
                                  <span style={{ fontSize: '0.75rem' }}>{icons[platform]}</span>
                                  <span style={{ fontSize: '0.75rem', color: isChecked ? colors[platform] : 'rgba(255,255,255,0.6)', fontWeight: isChecked ? '600' : '400' }}>{platform}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t[lang].email}</label>
                      <input
                        type="email"
                        required
                        placeholder="ornek@trendlab.ai"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
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
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t[lang].password}</label>
                      <div className="auth-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="******"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            background: 'rgba(5, 8, 17, 0.6)',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-eye-btn"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {authMode === 'register' && (
                      <div>
                        <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {lang === 'tr' ? 'Şifre Tekrarı' : 'Confirm Password'}
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem 2.5rem 0.55rem 0.75rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(255,255,255,0.04)',
                              color: '#fff',
                              outline: 'none',
                              fontSize: '0.85rem',
                              boxSizing: 'border-box'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="auth-eye-btn"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {authMode === 'login' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                          }}
                          onClick={() => setRememberMe(!rememberMe)}
                        >
                          {/* Custom styled checkbox */}
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            border: rememberMe ? '2px solid var(--color-secondary)' : '2px solid rgba(255,255,255,0.2)',
                            background: rememberMe ? 'rgba(0,210,255,0.18)' : 'rgba(255,255,255,0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.18s ease',
                            flexShrink: 0
                          }}>
                            {rememberMe && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: rememberMe ? 'rgba(255,255,255,0.85)' : 'var(--color-text-muted)', userSelect: 'none', transition: 'color 0.18s' }}>
                            {t[lang].rememberMe}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', padding: 0 }}
                        >
                          {t[lang].authTitleForgot}?
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.02em' }}
                  >
                    {authLoading ? '...' : (authMode === 'login' ? t[lang].authSubmitLogin : t[lang].authSubmitReg)}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', opacity: 0.85 }}
                    >
                      {authMode === 'login' ? t[lang].switchReg : t[lang].switchLogin}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <div>
        {view === 'landing' && (
          <LandingPage
            setView={setView}
            lang={lang}
            isAuthenticated={isAuthenticated}
            setAuthMode={setAuthMode}
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            onIyzicoCheckout={handleIyzicoCheckout}
            theme={theme}
            setTheme={setTheme}
          />
        )}
        {view === 'creator' && (
          <CreatorWorkspace
            setView={setView}
            lang={lang}
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            onIyzicoCheckout={handleIyzicoCheckout}
            theme={theme}
            setTheme={setTheme}
            user={user}
          />
        )}
        {view === 'brand' && (
          <BrandWorkspace
            setView={setView}
            lang={lang}
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            onIyzicoCheckout={handleIyzicoCheckout}
            theme={theme}
            setTheme={setTheme}
            user={user}
          />
        )}
      </div>

      {/* iyzico Sandbox Payment Modal */}
      {iyzicoPlanModal && (
        <IyzicoModal
          planName={iyzicoPlanModal}
          onClose={() => setIyzicoPlanModal(null)}
          onSuccess={handleIyzicoSuccess}
          userEmail={user?.email || ''}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={auth.user || { name: user.name, email: user.email }}
          userPlan={userPlan}
          onClose={() => setShowProfileModal(false)}
          onSignOut={handleLogout}
          onUpgradePlan={(planName) => handleIyzicoCheckout(planName)}
          lang={lang}
        />
      )}

      {/* PWA Mobile Install Banner */}
      <PwaInstallBanner lang={lang} />
    </div>
  );
}

export default App;
