import { SupportedLanguage } from '../types';

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export interface VoiceDiagnosticResult {
  step: 'microphone_permission' | 'speech_recognition' | 'gemini_response' | 'speech_synthesis';
  componentName: string;
  status: 'passed' | 'failed' | 'warning' | 'testing';
  details: string;
  recommendation?: string;
  technicalCode?: string;
}

// Check if Web Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}

// Map Web Speech API error codes to human-readable explanations in Telugu and English
export function getSpeechErrorMessage(errorCode: string, language: SupportedLanguage): { title: string; explanation: string; fix: string } {
  const isTe = language === 'te';
  const isHi = language === 'hi';

  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return {
        title: isTe ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది' : isHi ? 'माइक अनुमति अस्वीकृत' : 'Microphone Permission Blocked',
        explanation: isTe
          ? 'బ్రౌజర్ లేదా పరికరం మైక్రోఫోన్ వినియోగాన్ని బ్లాక్ చేసింది.'
          : 'Microphone permission was denied by the user, browser privacy settings, or iframe sandbox.',
        fix: isTe
          ? 'అడ్రస్ బార్‌లోని లాక్ (🔒) గుర్తును నొక్కి మైక్రోఫోన్‌ను "Allow" చేయండి.'
          : 'Click the padlock icon in the browser address bar and set Microphone to "Allow".',
      };
    case 'no-speech':
      return {
        title: isTe ? 'మాటలు వినిపించలేదు' : isHi ? 'आवाज नहीं सुनी गई' : 'No Speech Detected',
        explanation: isTe
          ? 'మైక్రోఫోన్ ఎలాంటి శబ్దాన్ని గుర్తించలేదు. మైక్ మ్యూట్‌లో ఉందేమో చూడండి.'
          : 'The microphone was open, but no audible speech was captured within the timeout.',
        fix: isTe
          ? 'మైక్రోఫోన్‌కు దగ్గరగా వచ్చి కాస్త బిగ్గరగా తెలుగులో మాట్లాడండి.'
          : 'Ensure microphone is unmuted, speak closer to the device, and try again.',
      };
    case 'audio-capture':
      return {
        title: isTe ? 'మైక్రోఫోన్ హార్డ్‌వేర్ దొరకలేదు' : isHi ? 'माइक हार्डवेयर नहीं मिला' : 'Microphone Device Error',
        explanation: isTe
          ? 'మీ పరికరంలో మైక్రోఫోన్ దొరకలేదు లేదా వేరొక యాప్ దీనిని ఉపయోగిస్తోంది.'
          : 'No microphone input hardware was detected on this device, or it is exclusively locked by another application.',
        fix: isTe
          ? 'హెడ్‌సెట్ లేదా మైక్రోఫోన్ కనెక్ట్ అయిందో లేదో తనిఖీ చేయండి.'
          : 'Connect a headset or verify audio input settings in your operating system.',
      };
    case 'network':
      return {
        title: isTe ? 'నెట్‌వర్క్ కనెక్షన్ లోపం' : isHi ? 'नेटवर्क त्रुटि' : 'STT Cloud Network Required',
        explanation: isTe
          ? 'తెలుగు వాయిస్ రికగ్నిషన్ కోసం ఇంటర్నెట్ కనెక్షన్ అవసరం (Google Cloud Speech).'
          : 'Telugu (te-IN) speech recognition in Chrome delegates to Google cloud speech models, requiring active internet.',
        fix: isTe
          ? 'ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.'
          : 'Verify your internet connection. Desktop Chrome requires cloud connectivity for Telugu STT.',
      };
    case 'language-not-supported':
      return {
        title: isTe ? 'భాష సపోర్ట్ లేదు' : isHi ? 'भाषा समर्थित नहीं' : 'Telugu (te-IN) Engine Missing',
        explanation: isTe
          ? 'ఈ బ్రౌజర్‌లో తెలుగు వాయిస్ రికగ్నిషన్ ప్యాక్ ఇన్‌స్టాల్ కాలేదు.'
          : 'The current browser or OS lacks native acoustic/language models for Telugu (te-IN).',
        fix: isTe
          ? 'గూగుల్ క్రోమ్ లేదా ఆండ్రాయిడ్ బ్రౌజర్‌ను ఉపయోగించండి లేదా మా నమూనా వాయిస్ బటన్ వాడండి.'
          : 'Use Chrome on Android or desktop, or test using the Telugu Audio Simulator below.',
      };
    default:
      return {
        title: isTe ? 'వాయిస్ రికగ్నిషన్ లోపం' : 'Speech Recognition Notice',
        explanation: `Error code: ${errorCode}`,
        fix: isTe ? 'దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Please retry or type your query.',
      };
  }
}

// Create SpeechRecognizer with Telugu / Hindi / English
export function createSpeechRecognizer(
  language: SupportedLanguage,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (errorCode: string) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError('language-not-supported');
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();

  const langCodes: Record<SupportedLanguage, string> = {
    te: 'te-IN',
    hi: 'hi-IN',
    en: 'en-IN',
  };

  recognizer.lang = langCodes[language] || 'en-IN';
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const currentText = final || interim;
    onResult(currentText, Boolean(final));
  };

  recognizer.onerror = (event: any) => {
    console.warn('[Sanjivani SpeechRecognition] Error:', event.error);
    onError(event.error || 'unknown');
  };

  recognizer.onend = () => {
    onEnd();
  };

  return recognizer;
}

// Gentle audio cues using Web Audio API (helpful for rural elders)
export function playFeedbackChime(type: 'start' | 'success' | 'alert') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      // Pleasant rising ding
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'success') {
      // Reassuring chord
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else {
      // Alert low pulse
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    }
  } catch (e) {
    // AudioContext blocked by browser policy prior to user interaction
  }
}

// Find available Telugu TTS voice
export function findTeluguVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  // Look for exact te-IN or te voices
  const teluguVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === 'te-in' ||
      v.lang.toLowerCase().startsWith('te') ||
      v.name.toLowerCase().includes('telugu')
  );

  return teluguVoice || null;
}

// Speech Synthesis execution
export function speakText(
  text: string,
  language: SupportedLanguage,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('Speech synthesis not supported');
    return false;
  }

  window.speechSynthesis.cancel();

  const langCode = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
  const cleanText = text
    .replace(/[*#_`~>\[\]\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langCode;
  utterance.rate = 0.95; // Slightly slower for elderly and rural users
  utterance.pitch = 1.0;

  // Attempt to attach matched voice
  const matched = findTeluguVoice();
  if (language === 'te' && matched) {
    utterance.voice = matched;
  } else {
    const voices = window.speechSynthesis.getVoices();
    const fallback = voices.find(
      (v) => v.lang.toLowerCase().startsWith(language) || v.lang.toLowerCase() === langCode.toLowerCase()
    );
    if (fallback) utterance.voice = fallback;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    console.warn('[Sanjivani SpeechSynthesis] Error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
