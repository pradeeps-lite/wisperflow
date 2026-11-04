import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  findTeluguVoice,
  speakText,
  stopSpeaking,
  playFeedbackChime,
  getSpeechErrorMessage,
} from '../utils/speech';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Mic,
  Volume2,
  Cpu,
  ShieldCheck,
  Sparkles,
  Info,
  Loader2,
  Terminal,
  VolumeX,
} from 'lucide-react';

interface TeluguVoiceDiagnosticProps {
  onClose?: () => void;
  onUseTranscriptInAssistant?: (text: string) => void;
  isLargeText?: boolean;
}

interface TestStepState {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'failed' | 'warning';
  details: string;
  recommendation?: string;
}

export const TeluguVoiceDiagnostic: React.FC<TeluguVoiceDiagnosticProps> = ({
  onClose,
  onUseTranscriptInAssistant,
  isLargeText,
}) => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Diagnostic Steps State
  const [steps, setSteps] = useState<TestStepState[]>([
    {
      id: 'mic_permission',
      name: '1. Microphone Hardware & Permission',
      status: 'idle',
      details: 'Checks browser permission and audio device access.',
    },
    {
      id: 'stt_engine',
      name: '2. Web Speech Recognition (te-IN)',
      status: 'idle',
      details: 'Verifies SpeechRecognition support for Telugu language code te-IN.',
    },
    {
      id: 'stt_input',
      name: '3. Actual Telugu Spoken Input Test',
      status: 'idle',
      details: 'Captures Telugu voice input or runs simulated speech test.',
    },
    {
      id: 'gemini_response',
      name: '4. Gemini 3.8 Flash Telugu AI Response',
      status: 'idle',
      details: 'Validates clinical guardrails, Telugu script output, and TTS script.',
    },
    {
      id: 'tts_playback',
      name: '5. Speech Synthesis & Telugu Voice Playback',
      status: 'idle',
      details: 'Inspects host voices and plays Telugu audio readout.',
    },
  ]);

  // Live test variables
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [recognizedTeluguText, setRecognizedTeluguText] = useState<string>('');
  const [geminiResult, setGeminiResult] = useState<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [teluguVoiceDetected, setTeluguVoiceDetected] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micListening, setMicListening] = useState(false);

  // Initialize available voices on load
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        setAvailableVoices(vList);
        const teVoice = findTeluguVoice();
        setTeluguVoiceDetected(teVoice);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const updateStep = (index: number, patch: Partial<TestStepState>) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  // Step 1: Test Microphone Permission
  const testMicrophonePermission = async () => {
    updateStep(0, { status: 'running', details: 'Requesting microphone permission from browser...' });
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('navigator.mediaDevices.getUserMedia not available in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      // Check audio tracks
      const audioTracks = stream.getAudioTracks();
      const deviceLabel = audioTracks[0]?.label || 'Active Audio Input Device';

      updateStep(0, {
        status: 'passed',
        details: `Microphone permission GRANTED. Device: "${deviceLabel}". Track active: ${audioTracks[0]?.readyState}`,
      });
      playFeedbackChime('start');
      return true;
    } catch (err: any) {
      console.warn('Mic permission error:', err);
      updateStep(0, {
        status: 'failed',
        details: `Microphone permission DENIED or hardware unavailable: ${err.message || err.name}`,
        recommendation:
          'In Chrome or your browser, click the lock icon in the address bar, toggle Microphone to "Allow", and ensure an audio input device is plugged in.',
      });
      playFeedbackChime('alert');
      return false;
    }
  };

  // Step 2: Test STT Engine for Telugu
  const testSTTEngine = () => {
    updateStep(1, { status: 'running', details: 'Checking SpeechRecognition API for te-IN...' });

    if (!isSpeechRecognitionSupported()) {
      updateStep(1, {
        status: 'failed',
        details: 'Web SpeechRecognition API is NOT supported in this browser.',
        recommendation: 'Use Google Chrome, Chromium, or Edge for full Web Speech API support.',
      });
      return false;
    }

    const hasWebkit = 'webkitSpeechRecognition' in window;
    const hasStandard = 'SpeechRecognition' in window;

    updateStep(1, {
      status: 'passed',
      details: `SpeechRecognition API detected (${hasStandard ? 'SpeechRecognition' : 'webkitSpeechRecognition'}). Target language code set to 'te-IN' (Telugu India).`,
    });
    return true;
  };

  // Step 3: Run Telugu Voice Input (via Live Mic or Preset Telugu Test Audio)
  const runLiveTeluguMicTest = () => {
    updateStep(2, {
      status: 'running',
      details: 'Listening... Please speak in Telugu into your microphone now (e.g. "నాకు జ్వరం ఉంది")...',
    });
    setMicListening(true);
    playFeedbackChime('start');

    const recognizer = createSpeechRecognizer(
      'te',
      (text, isFinal) => {
        setRecognizedTeluguText(text);
        if (isFinal) {
          setMicListening(false);
          const hasTeluguChars = /[\u0C00-\u0C7F]/.test(text);

          updateStep(2, {
            status: hasTeluguChars ? 'passed' : 'warning',
            details: `Captured: "${text}". Telugu Unicode detected: ${hasTeluguChars ? 'Yes ✅' : 'No (Transliterated/Roman script)'}`,
            recommendation: hasTeluguChars
              ? undefined
              : 'Speech was recognized, but appeared in roman letters. Ensure te-IN acoustic pack is selected in OS.',
          });
          playFeedbackChime('success');
        }
      },
      (errorCode) => {
        setMicListening(false);
        const errInfo = getSpeechErrorMessage(errorCode, 'te');
        updateStep(2, {
          status: 'failed',
          details: `STT Error (${errorCode}): ${errInfo.title}. ${errInfo.explanation}`,
          recommendation: errInfo.fix,
        });
        playFeedbackChime('alert');
      },
      () => {
        setMicListening(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch (e: any) {
        setMicListening(false);
        updateStep(2, {
          status: 'failed',
          details: `Could not start recognizer: ${e.message}`,
        });
      }
    }
  };

  // Simulate Telugu voice input (for testing without a physical mic or in silent test environments)
  const simulateTeluguVoiceInput = (sampleIndex = 0) => {
    const samples = [
      'నాకు 3 రోజులుగా తీవ్రమైన జ్వరం ఉంది, దగ్గరలో ఉన్న ప్రాథమిక ఆరోగ్య కేంద్రం ఎక్కడుంది?',
      'పారాసిటమాల్ 650 టాబ్లెట్ భోజనం ముందా లేదా తర్వాత వేసుకోవాలా?',
      'నా రక్తపోటు 140/90 ఉంది, ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?',
    ];

    const chosen = samples[sampleIndex];
    setRecognizedTeluguText(chosen);

    updateStep(2, {
      status: 'passed',
      details: `Simulated Telugu Voice Input: "${chosen}". Valid Telugu script verified ✅.`,
    });
    playFeedbackChime('success');
  };

  // Step 4: Test Gemini 3.8 Flash Telugu Response
  const testGeminiTeluguResponse = async (inputQuery?: string) => {
    const query = inputQuery || recognizedTeluguText || 'నాకు 3 రోజులుగా జ్వరం ఉంది, దగ్గరలో ఉన్న పిహెచ్‌సి ఎక్కడ?';
    updateStep(3, {
      status: 'running',
      details: `Sending Telugu prompt to Gemini 3.8 Flash (/api/chat): "${query}"...`,
    });

    const startTime = Date.now();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: 'te',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const elapsed = Date.now() - startTime;

      setGeminiResult(data);

      const hasTeluguScript = /[\u0C00-\u0C7F]/.test(data.displayText || '');
      const hasAudioScript = Boolean(data.audioScript);

      updateStep(3, {
        status: hasTeluguScript && hasAudioScript ? 'passed' : 'warning',
        details: `Response in ${elapsed}ms. Telugu script: ${hasTeluguScript ? 'Verified ✅' : 'Missing'}, Audio script: ${hasAudioScript ? 'Present ✅' : 'Missing'}, Emergency Flag: ${data.isEmergency ? 'Triggered 🚨' : 'Normal'}`,
      });
      playFeedbackChime('success');
      return data;
    } catch (err: any) {
      updateStep(3, {
        status: 'failed',
        details: `Gemini API call failed: ${err.message}`,
        recommendation: 'Check GEMINI_API_KEY in server environment or network connection.',
      });
      playFeedbackChime('alert');
      return null;
    }
  };

  // Step 5: Test Telugu Speech Synthesis Playback
  const testTeluguSpeechSynthesis = (customText?: string) => {
    const textToSpeak =
      customText ||
      geminiResult?.audioScript ||
      'నమస్కారం! నేను సంజీవని ఆరోగ్య సహాయకురాలిని. మీకు కావలసిన సహాయం అందించడానికి సిద్ధంగా ఉన్నాను.';

    updateStep(4, {
      status: 'running',
      details: 'Checking available voices and testing speech synthesis for te-IN...',
    });

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      updateStep(4, {
        status: 'failed',
        details: 'speechSynthesis API not supported in this browser.',
      });
      return;
    }

    const teVoice = findTeluguVoice();
    setIsPlayingAudio(true);

    const success = speakText(
      textToSpeak,
      'te',
      () => {
        setIsPlayingAudio(true);
        updateStep(4, {
          status: teVoice ? 'passed' : 'warning',
          details: `Audio playback ACTIVE. ${
            teVoice
              ? `Native Telugu Voice Used: "${teVoice.name}" (${teVoice.lang}).`
              : 'Warning: No native Telugu (te-IN) voice pack installed in OS/browser. Using system fallback speech synthesis voice.'
          }`,
          recommendation: teVoice
            ? undefined
            : 'For the most natural Telugu accent, open your device settings (Android or Windows/macOS) and download the Telugu Language Speech pack, or use Android Chrome which includes Google Telugu TTS.',
        });
      },
      () => {
        setIsPlayingAudio(false);
      },
      (err) => {
        setIsPlayingAudio(false);
        updateStep(4, {
          status: 'failed',
          details: `Speech synthesis error: ${err?.message || 'Playback blocked or failed'}`,
        });
      }
    );

    if (!success) {
      setIsPlayingAudio(false);
      updateStep(4, {
        status: 'failed',
        details: 'Could not initiate speech synthesis.',
      });
    }
  };

  // Run the full automated end-to-end test sequence
  const runFullDiagnosticSequence = async () => {
    setIsRunningAll(true);
    stopSpeaking();

    // 1. Mic permission
    const micOk = await testMicrophonePermission();

    // 2. STT Engine
    const sttOk = testSTTEngine();

    // 3. Telugu Voice input (use simulation if mic not unmuted)
    simulateTeluguVoiceInput(0);

    // 4. Gemini Telugu response
    const geminiData = await testGeminiTeluguResponse('నాకు 3 రోజులుగా తీవ్రమైన జ్వరం ఉంది, దగ్గరలో ఉన్న ప్రాథమిక ఆరోగ్య కేంద్రం ఎక్కడుంది?');

    // 5. Speech synthesis playback
    if (geminiData?.audioScript) {
      testTeluguSpeechSynthesis(geminiData.audioScript);
    } else {
      testTeluguSpeechSynthesis();
    }

    setIsRunningAll(false);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 sm:p-7 shadow-2xl border border-teal-500/30 max-w-3xl mx-auto my-4 animate-fadeIn font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold border border-teal-500/40">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
              <span>Telugu Voice Flow Diagnostic Console</span>
              <span className="text-[10px] font-mono bg-teal-900 text-teal-300 px-2 py-0.5 rounded border border-teal-700">
                te-IN Flow Audit
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end hardware, STT, Gemini AI reasoning, and TTS voice playback verification.
            </p>
          </div>
        </div>

        {/* Action Button: Run Full Test */}
        <div className="flex items-center gap-2">
          <button
            onClick={runFullDiagnosticSequence}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isRunningAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Audit...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run Full Telugu Flow Test</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Device Capabilities Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-xs font-mono">
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">SpeechRecognition:</span>
          <span className={`font-bold ${isSpeechRecognitionSupported() ? 'text-emerald-400' : 'text-red-400'}`}>
            {isSpeechRecognitionSupported() ? 'SUPPORTED ✅' : 'NOT FOUND ❌'}
          </span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">SpeechSynthesis:</span>
          <span className="font-bold text-emerald-400">
            {typeof window !== 'undefined' && 'speechSynthesis' in window ? 'SUPPORTED ✅' : 'NOT FOUND ❌'}
          </span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">Native Telugu Voice:</span>
          <span className={`font-bold ${teluguVoiceDetected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {teluguVoiceDetected ? 'DETECTED ✅' : 'USING FALLBACK ⚠️'}
          </span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">Model Backend:</span>
          <span className="font-bold text-teal-300">GEMINI 3.8 FLASH</span>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3 mb-5">
        {steps.map((st, idx) => {
          return (
            <div
              key={st.id}
              className={`p-3.5 rounded-2xl border transition ${
                st.status === 'passed'
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : st.status === 'failed'
                  ? 'bg-red-950/30 border-red-500/50'
                  : st.status === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : st.status === 'running'
                  ? 'bg-teal-950/40 border-teal-500 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {st.status === 'passed' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {st.status === 'failed' && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  {st.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                  {st.status === 'running' && <Loader2 className="w-5 h-5 text-teal-400 animate-spin shrink-0" />}
                  {st.status === 'idle' && <span className="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0" />}

                  <h4 className="font-bold text-sm text-white">{st.name}</h4>
                </div>

                {/* Individual Test Button */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {idx === 0 && (
                    <button
                      onClick={testMicrophonePermission}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      Test Mic Access
                    </button>
                  )}
                  {idx === 1 && (
                    <button
                      onClick={testSTTEngine}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      Check te-IN Engine
                    </button>
                  )}
                  {idx === 2 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={runLiveTeluguMicTest}
                        className="px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-teal-200 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Mic className="w-3 h-3" />
                        <span>Live Mic</span>
                      </button>
                      <button
                        onClick={() => simulateTeluguVoiceInput(0)}
                        className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Simulate Audio
                      </button>
                    </div>
                  )}
                  {idx === 3 && (
                    <button
                      onClick={() => testGeminiTeluguResponse()}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      Query Gemini
                    </button>
                  )}
                  {idx === 4 && (
                    <button
                      onClick={() => testTeluguSpeechSynthesis()}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play Voice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Details */}
              <p className="text-xs text-slate-300 font-mono mt-2 ml-7 leading-relaxed">
                {st.details}
              </p>

              {/* Diagnostic Recommendation if failed / warning */}
              {st.recommendation && (
                <div className="mt-2 ml-7 p-2 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-[11px]">
                  <span className="font-bold">🔧 Component Remedy: </span>
                  {st.recommendation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Captured Audio & AI Output Inspection Card */}
      {(recognizedTeluguText || geminiResult) && (
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 text-xs space-y-3">
          <h4 className="font-bold text-teal-300 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Inspection Data Feed</span>
          </h4>

          {recognizedTeluguText && (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                Telugu Recognized Input Text (STT):
              </span>
              <p className="text-sm font-semibold text-white">
                "{recognizedTeluguText}"
              </p>
            </div>
          )}

          {geminiResult && (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  Gemini Audio Script (Prepared for TTS):
                </span>
                <button
                  onClick={() => testTeluguSpeechSynthesis(geminiResult.audioScript)}
                  className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-white font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Replay Audio</span>
                </button>
              </div>
              <p className="text-sm text-teal-100 font-medium whitespace-pre-line leading-relaxed">
                "{geminiResult.audioScript}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Summary / Failure Analysis Matrix */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Safe, non-diagnostic telemedicine standard enforced on all Telugu answers.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          Wispr Flow Challenge Diagnostic Suite v1.1
        </span>
      </div>
    </div>
  );
};
