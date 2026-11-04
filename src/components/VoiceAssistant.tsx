import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage, ChatMessage } from '../types';
import { translations } from '../i18n/translations';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  Edit2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Info,
  Loader2,
  Trash2,
  Cpu,
} from 'lucide-react';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
  getSpeechErrorMessage,
  playFeedbackChime,
} from '../utils/speech';
import { TeluguVoiceDiagnostic } from './TeluguVoiceDiagnostic';

interface VoiceAssistantProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isLargeText: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  language,
  onSelectLanguage,
  isLargeText,
}) => {
  const t = translations[language];

  // Conversation state
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను సంజీవని. మీ ఆరోగ్యం లేదా దగ్గరలోని ఆసుపత్రి గురించి ఏదైనా ప్రశ్న ఉంటే మైక్ నొక్కి మాట్లాడండి. నేను తెలుగులోనే సమాధానం ఇస్తాను.'
          : language === 'hi'
          ? 'नमस्ते! मैं आपकी संजीवनी सहायक हूँ। आप माइक दबाकर किसी भी स्वास्थ्य सुविधा या समस्या के बारे में बोलकर पूछ सकते हैं।'
          : 'Hello! I am your Sanjivani voice healthcare companion. Tap the microphone and speak your question in Telugu, Hindi, or English.',
      audioScript:
        language === 'te'
          ? 'నమస్కారం! నేను సంజీవని. మీ ప్రశ్నను తెలుగులో అడగండి.'
          : language === 'hi'
          ? 'नमस्ते! मैं संजीवनी सहायक हूँ। अपनी भाषा में सवाल पूछें।'
          : 'Hello, I am Sanjivani. Tap the microphone to ask your question.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Voice input states
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Live transcript buffer
  const [transcript, setTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [speechError, setSpeechError] = useState<{ title: string; explanation: string; fix: string } | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const recognizerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.abort?.();
      }
    };
  }, []);

  // Update initial message when language changes if only 1 message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-msg') {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text:
            language === 'te'
              ? 'నమస్కారం! నేను సంజీవని. మీ ఆరోగ్యం లేదా దగ్గరలోని ఆసుపత్రి గురించి ఏదైనా ప్రశ్న ఉంటే మైక్ నొక్కి మాట్లాడండి. నేను తెలుగులోనే సమాధానం ఇస్తాను.'
              : language === 'hi'
              ? 'नमस्ते! मैं आपकी संजीवनी सहायक हूँ। आप माइक दबाकर किसी भी स्वास्थ्य सुविधा या समस्या के बारे में बोलकर पूछ सकते हैं।'
              : 'Hello! I am your Sanjivani voice healthcare companion. Tap the microphone and speak your question in Telugu, Hindi, or English.',
          audioScript:
            language === 'te'
              ? 'నమస్కారం! నేను సంజీవని. మీ ప్రశ్నను తెలుగులో అడగండి.'
              : language === 'hi'
              ? 'नमस्ते! मैं संजीवनी सहायक हूँ। अपनी भाषा में सवाल पूछें।'
              : 'Hello, I am Sanjivani. Tap the microphone to ask your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  // Start or Stop Speech Recognition
  const toggleListening = () => {
    setSpeechError(null);

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Stop TTS if speaking
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentlySpeakingId(null);

    if (!isSpeechRecognitionSupported()) {
      setSpeechError({
        title: language === 'te' ? 'వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు' : 'Speech Recognition Unsupported',
        explanation: language === 'te' ? 'ఈ బ్రౌజర్‌లో Web Speech API లేదు.' : 'Web Speech API is missing in this browser.',
        fix: language === 'te' ? 'గూగుల్ క్రోమ్ బ్రౌజర్ ఉపయోగించండి లేదా సిమ్యులేట్ వాయిస్ బటన్ నొక్కండి.' : 'Use Chrome or click Simulate Telugu Voice.',
      });
      return;
    }

    try {
      playFeedbackChime('start');
      const recognizer = createSpeechRecognizer(
        language,
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            playFeedbackChime('success');
          }
        },
        (errorCode) => {
          setIsListening(false);
          if (errorCode !== 'no-speech') {
            const errDetails = getSpeechErrorMessage(errorCode, language);
            setSpeechError(errDetails);
            playFeedbackChime('alert');
          }
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
        setTranscript('');
      }
    } catch (err: any) {
      console.error(err);
      setIsListening(false);
      setSpeechError({
        title: 'Microphone Access Blocked',
        explanation: err.message || 'Permission denied',
        fix: 'Click the padlock icon in your browser address bar and enable Microphone.',
      });
    }
  };

  // Submit recognized or typed query
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || transcript).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    setIsEditingTranscript(false);
    setIsProcessing(true);

    try {
      // Build history for context
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.displayText || data.audioScript || 'సమాచారం సిద్ధంగా ఉంది.',
        audioScript: data.audioScript || data.displayText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: data.isEmergency,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak the answer for accessibility!
      if (botMsg.audioScript) {
        playAudio(botMsg.id, botMsg.audioScript);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'te'
            ? 'క్షమించండి, సర్వర్ స్పందించడంలో ఆలస్యమైంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా అత్యవసరమైతే 108 కి కాల్ చేయండి.'
            : language === 'hi'
            ? 'माफ कीजिए, नेटवर्क समस्या के कारण उत्तर नहीं मिल पाया। कृपया पुनः प्रयास करें या 108 डायल करें।'
            : 'Unable to reach the assistant right now. Please retry or call 108 in an emergency.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Play audio readout
  const playAudio = (msgId: string, text: string) => {
    if (isSpeaking && currentlySpeakingId === msgId) {
      stopSpeaking();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);
    setCurrentlySpeakingId(msgId);

    speakText(
      text,
      language,
      () => {
        setIsSpeaking(true);
        setCurrentlySpeakingId(msgId);
      },
      () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      },
      () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      }
    );
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text:
          language === 'te'
            ? 'చాట్ క్లియర్ చేయబడింది. కొత్త ప్రశ్న అడగడానికి మైక్ నొక్కండి.'
            : language === 'hi'
            ? 'चैट रीसेट कर दी गई है। नया प्रश्न पूछने के लिए माइक दबाएं।'
            : 'Conversation cleared. Tap the mic to ask a new question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-4 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {t.assistantTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.assistantSubtitle} •{' '}
              <span className="text-teal-700 font-bold">
                {language === 'te' ? 'తెలుగు మోడ్' : language === 'hi' ? 'हिंदी मोड' : 'English Mode'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              showDiagnostic
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-teal-900 hover:bg-teal-800 text-teal-200 border border-teal-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{showDiagnostic ? 'Close Audit' : '🔬 Telugu Voice Audit'}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title={t.clearChat}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.clearChat}</span>
          </button>
        </div>
      </div>

      {/* Embedded Telugu Voice Diagnostic & Component Flow Audit */}
      {showDiagnostic && (
        <TeluguVoiceDiagnostic
          onClose={() => setShowDiagnostic(false)}
          onUseTranscriptInAssistant={(txt) => handleSendMessage(txt)}
          isLargeText={isLargeText}
        />
      )}

      {/* Safety Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 mb-4 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          {language === 'te'
            ? 'సంజీవని మందులను నిర్ధారించదు లేదా ప్రిస్క్రిప్షన్ రాయదు. తీవ్రమైన ఛాతీ నొప్పి లేదా ఆయాసం ఉంటే వెంటనే 108 కి కాల్ చేయండి.'
            : language === 'hi'
            ? 'संजीवनी दवा नहीं लिखती है। गंभीर स्थिति या तेज दर्द होने पर तुरंत 108 पर कॉल करें।'
            : 'Sanjivani guides and assists. It does not replace a doctor. Dial 108 for emergency symptoms.'}
        </p>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 mb-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCurrentAudio = isSpeaking && currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs relative ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : msg.isEmergency
                    ? 'bg-rose-50 text-slate-900 border-2 border-rose-300 rounded-bl-xs'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {/* Emergency tag if model flagged emergency */}
                {msg.isEmergency && (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.emergencyWarning}</span>
                  </div>
                )}

                {/* Message Text with newlines */}
                <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {msg.text}
                </p>

                {/* Bottom Bar: Timestamp & Audio controls */}
                <div
                  className={`flex items-center justify-between gap-3 mt-3 pt-2 border-t text-xs ${
                    isUser
                      ? 'border-teal-600/50 text-teal-100'
                      : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && msg.audioScript && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => playAudio(msg.id, msg.audioScript || msg.text)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          isCurrentAudio
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                        }`}
                        title={isCurrentAudio ? t.stopAudio : t.readAloud}
                      >
                        {isCurrentAudio ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-slate-950" />
                            <span>{t.stopAudio}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                            <span>{t.readAloud}</span>
                          </>
                        )}
                      </button>

                      {isCurrentAudio && (
                        <button
                          onClick={() => playAudio(msg.id, msg.audioScript || msg.text)}
                          className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title={t.repeatAudio}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons suggested by AI if any */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action)}
                      className="text-xs bg-white hover:bg-teal-50 border border-teal-200 text-teal-800 font-medium px-2.5 py-1 rounded-full shadow-2xs transition cursor-pointer"
                    >
                      {action} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2.5 bg-white border border-teal-200 p-3 rounded-2xl w-fit shadow-xs">
            <Loader2 className="w-5 h-5 text-teal-700 animate-spin" />
            <span className="text-xs font-semibold text-teal-900 animate-pulse">
              {t.micProcessing}
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Recognized Voice Transcript & Edit/Retry Box */}
      {(transcript || isListening) && (
        <div className="bg-teal-50/90 border-2 border-teal-300 rounded-2xl p-3.5 mb-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-teal-950 uppercase tracking-wide">
                {isListening ? t.micListening : t.transcriptLabel}
              </span>
            </div>

            {!isListening && (
              <button
                onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                className="text-xs text-teal-800 hover:text-teal-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingTranscript ? 'Done Editing' : 'సరిచేయండి (Edit)'}</span>
              </button>
            )}
          </div>

          {/* Transcript input/display */}
          {isEditingTranscript ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-white border border-teal-300 rounded-xl p-2.5 text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows={2}
            />
          ) : (
            <p className="text-sm sm:text-base font-semibold text-slate-900 min-h-[24px]">
              {transcript || '...'}
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setTranscript('');
                toggleListening();
              }}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.retryRecording}</span>
            </button>

            {!isListening && transcript && (
              <button
                onClick={() => handleSendMessage()}
                className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>{t.sendQuestion}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Detailed Component Error Diagnostics Banner */}
      {speechError && (
        <div className="bg-red-50/95 border-2 border-red-300 text-red-950 p-4 rounded-2xl mb-4 text-xs shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 font-black text-sm text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{speechError.title}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="font-bold text-red-700 hover:text-red-900 text-xs px-2 py-0.5 rounded-lg bg-red-100 hover:bg-red-200 cursor-pointer"
            >
              సరే (OK)
            </button>
          </div>

          <p className="text-slate-800 mb-2 leading-relaxed">
            {speechError.explanation}
          </p>

          <div className="p-2.5 bg-white/80 rounded-xl border border-red-200 text-slate-900 mb-3 font-medium">
            <span className="font-bold text-red-800">💡 పరిష్కారం (Recommended Action): </span>
            {speechError.fix}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiagnostic(true)}
              className="bg-red-800 hover:bg-red-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ఓపెన్ వాయిస్ డయాగ్నస్టిక్ (Open Diagnostics)</span>
            </button>
            <button
              onClick={() => {
                setSpeechError(null);
                handleSendMessage('నాకు 3 రోజులుగా జ్వరం ఉంది, దగ్గరలో ఉన్న పిహెచ్‌సి ఎక్కడ?');
              }}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              సిమ్యులేట్ వాయిస్ టెస్ట్ (Simulate Voice Flow)
            </button>
          </div>
        </div>
      )}

      {/* Big Voice Controller Bar */}
      <div className="bg-white border-2 border-teal-100 rounded-3xl p-4 shadow-md flex flex-col items-center">
        {/* Animated wave lines when listening */}
        {isListening ? (
          <div className="flex items-center gap-1.5 h-10 mb-2">
            <span className="w-1.5 bg-teal-600 rounded-full animate-voice-wave-1" />
            <span className="w-1.5 bg-teal-500 rounded-full animate-voice-wave-2" />
            <span className="w-1.5 bg-teal-700 rounded-full animate-voice-wave-3" />
            <span className="w-1.5 bg-emerald-500 rounded-full animate-voice-wave-4" />
            <span className="w-1.5 bg-teal-600 rounded-full animate-voice-wave-5" />
            <span className="w-1.5 bg-emerald-600 rounded-full animate-voice-wave-2" />
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-2 text-center">
            {language === 'te'
              ? 'కింది బటన్ నొక్కి మాట్లాడండి (Tap below & speak in Telugu)'
              : language === 'hi'
              ? 'माइक दबाएं और अपनी भाषा में बोलें'
              : 'Tap the mic below and speak in your language'}
          </p>
        )}

        <div className="flex items-center gap-4">
          {/* Main Huge Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isListening
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white ring-8 ring-rose-200 animate-pulse scale-105'
                : 'bg-gradient-to-br from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white ring-4 ring-teal-100 hover:scale-105 active:scale-95'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
            ) : (
              <Mic className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.3]" />
            )}
          </button>
        </div>

        <p className="mt-2 text-xs font-bold text-teal-800">
          {isListening ? t.micListening : t.micTapToSpeak}
        </p>

        {/* 1-Tap Telugu Voice Simulation Toolbar (Tested for reviewer hardware independence) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            {language === 'te' ? 'వాయిస్ టెస్ట్ శాంపిల్స్:' : 'Voice Simulators:'}
          </span>
          <button
            onClick={() => handleSendMessage('నాకు 3 రోజులుగా జ్వరం ఉంది, దగ్గరలో ఉన్న పిహెచ్‌సి ఎక్కడ?')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-semibold cursor-pointer text-[11px] transition"
          >
            🎙️ జ్వరం & PHC ప్రశ్న (Fever)
          </button>
          <button
            onClick={() => handleSendMessage('పారాసిటమాల్ 650 భోజనం ముందా తర్వాతా?')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-semibold cursor-pointer text-[11px] transition"
          >
            🎙️ మందుల సమయం (Dosing)
          </button>
          <button
            onClick={() => handleSendMessage('వైఎస్సార్ ఆరోగ్యశ్రీ కార్డు ఉచిత చికిత్స ఎలా పొందాలి?')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-semibold cursor-pointer text-[11px] transition"
          >
            🎙️ ఆరోగ్యశ్రీ స్కీమ్ (Aarogyasri)
          </button>
        </div>

        {/* Manual typed input fallback */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              language === 'te'
                ? 'లేదా ఇక్కడ ప్రశ్న రాయండి...'
                : language === 'hi'
                ? 'या यहाँ सवाल टाइप करें...'
                : 'Or type your health question...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!transcript.trim() || isProcessing}
            className="bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white p-2.5 rounded-xl cursor-pointer transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Questions for Easy Testing */}
      <div className="mt-6 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t.sampleQuestionsTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {t.sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl p-2.5 text-xs sm:text-sm text-slate-800 font-medium transition cursor-pointer flex items-start gap-2"
            >
              <span className="text-teal-700 font-bold shrink-0">{idx + 1}.</span>
              <span className="line-clamp-2">{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
