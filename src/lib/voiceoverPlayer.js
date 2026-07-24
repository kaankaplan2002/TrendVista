/**
 * Web Speech Synthesis Helper for AI Voiceover Simulation
 */

let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export const isSpeechSupported = !!synth;

/**
 * Get available system voices for a given language code
 */
export const getSystemVoices = (lang = 'tr') => {
  if (!synth) return [];
  const voices = synth.getVoices();

  const targetLangPrefix = lang === 'tr' ? 'tr' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : lang === 'es' ? 'es' : 'en';

  const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLangPrefix));
  return matchingVoices.length > 0 ? matchingVoices : voices.slice(0, 10);
};

/**
 * Play voiceover audio using Web Speech API
 */
export const playVoiceover = ({
  text,
  lang = 'tr',
  voice = null,
  rate = 1.0,
  pitch = 1.0,
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
}) => {
  if (!synth || !text) return;

  // Stop any ongoing speech
  stopVoiceover();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Math.max(0.5, Math.min(2.0, rate));
  utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
  utterance.lang = lang === 'tr' ? 'tr-TR' : 'en-US';

  if (voice) {
    utterance.voice = voice;
  } else {
    const available = getSystemVoices(lang);
    if (available.length > 0) utterance.voice = available[0];
  }

  utterance.onstart = () => {
    onStart();
  };

  utterance.onend = () => {
    onEnd();
  };

  utterance.onerror = (err) => {
    console.warn('[TrendVista Voiceover] Speech error:', err);
    onError(err);
  };

  synth.speak(utterance);
};

/**
 * Stop active voiceover
 */
export const stopVoiceover = () => {
  if (synth) {
    synth.cancel();
  }
};

/**
 * Pause active voiceover
 */
export const pauseVoiceover = () => {
  if (synth && synth.speaking) {
    synth.pause();
  }
};

/**
 * Resume paused voiceover
 */
export const resumeVoiceover = () => {
  if (synth && synth.paused) {
    synth.resume();
  }
};
