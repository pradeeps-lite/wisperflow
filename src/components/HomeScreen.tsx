import React, { useState } from 'react';
import { SupportedLanguage, AppTab } from '../types';
import { translations } from '../i18n/translations';
import {
  Mic,
  FileText,
  MapPin,
  AlertOctagon,
  ShoppingBag,
  Volume2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface HomeScreenProps {
  language: SupportedLanguage;
  onSelectTab: (tab: AppTab) => void;
  onStartVoiceWithQuery?: (initialPrompt?: string) => void;
  isLargeText: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onSelectTab,
  onStartVoiceWithQuery,
  isLargeText,
}) => {
  const t = translations[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayWelcomeAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const audioText =
      language === 'te'
        ? 'నమస్కారం! నేను సంజీవని ఆరోగ్య సహాయకురాలిని. మీకు కావలసిన ఆరోగ్య సమాచారాన్ని తెలుగులోనే అడగవచ్చు, ప్రిస్క్రిప్షన్ ఫోటో చూపించవచ్చు, లేదా దగ్గరలోని ఆసుపత్రులు మరియు మందుల దుకాణాలను కనుగొనవచ్చు.'
        : language === 'hi'
        ? 'नमस्ते! मैं संजीवनी स्वास्थ्य सहायिका हूँ। आप अपनी भाषा में स्वास्थ्य संबंधी सवाल पूछ सकते हैं, पर्चे की फोटो दिखा सकते हैं, या नजदीकी अस्पताल और दवाएं खोज सकते हैं।'
        : 'Welcome to Sanjivani AI. You can speak naturally in your language, scan your prescription, find verified nearby hospitals, or get immediate emergency assistance.';

    setIsPlayingAudio(true);
    speakText(
      audioText,
      language,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const actionCards = [
    {
      id: 'assistant' as AppTab,
      title: t.speakToSanjivaniTitle,
      desc: t.speakToSanjivaniDesc,
      icon: Mic,
      color: 'from-teal-600 to-teal-800',
      badgeColor: 'bg-teal-100 text-teal-900',
      badgeText: language === 'te' ? 'వాయిస్ మైక్' : language === 'hi' ? 'बोलकर पूछें' : 'Voice First',
      popular: true,
    },
    {
      id: 'prescription' as AppTab,
      title: t.prescriptionTitle,
      desc: t.prescriptionDesc,
      icon: FileText,
      color: 'from-emerald-600 to-emerald-800',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      badgeText: language === 'te' ? 'కెమెరా స్కాన్' : language === 'hi' ? 'पर्चा फोटो' : 'OCR Scan',
      popular: false,
    },
    {
      id: 'facilities' as AppTab,
      title: t.facilitiesTitle,
      desc: t.facilitiesDesc,
      icon: MapPin,
      color: 'from-cyan-700 to-teal-900',
      badgeColor: 'bg-cyan-100 text-cyan-900',
      badgeText: language === 'te' ? 'జీపీఎస్ మ్యాప్' : language === 'hi' ? 'नक्शा व दूरी' : 'GPS Nearby',
      popular: false,
    },
    {
      id: 'emergency' as AppTab,
      title: t.emergencyTitle,
      desc: t.emergencyDesc,
      icon: AlertOctagon,
      color: 'from-rose-600 to-red-800',
      badgeColor: 'bg-red-100 text-red-950 font-bold',
      badgeText: '108 Ambulance SOS',
      popular: false,
    },
    {
      id: 'order' as AppTab,
      title: t.orderTitle,
      desc: t.orderDesc,
      icon: ShoppingBag,
      color: 'from-emerald-700 to-teal-900',
      badgeColor: 'bg-amber-100 text-amber-900',
      badgeText: language === 'te' ? 'జన ఔషధి 70% ఆదా' : language === 'hi' ? 'जन औषधि बचत' : 'Fast Delivery',
      popular: false,
    },
  ];

  return (
    <div className={`pb-20 md:pb-12 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Hero Welcome Section with Deep Teal gradient and audio readout */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 text-white pt-8 pb-12 px-4 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/80 border border-teal-500/30 text-teal-100 text-xs font-semibold mb-2">
                <span>
                  {language === 'te'
                    ? 'గ్రామీణ మరియు పెద్దల ఆరోగ్య సహకారి'
                    : language === 'hi'
                    ? 'ग्रामीण एवं वरिष्ठ नागरिक स्वास्थ्य मित्र'
                    : 'Accessible Healthcare for Everyone'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.greeting}
              </h1>
            </div>

            {/* Read Aloud button for non-readers / elders */}
            <button
              onClick={handlePlayWelcomeAudio}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition cursor-pointer shrink-0 self-start sm:self-auto ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md animate-pulse'
                  : 'bg-teal-700/60 hover:bg-teal-700 text-white border-teal-500/40'
              }`}
              title="Listen to introduction audio"
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce text-slate-900' : 'text-teal-200'}`} />
              <span>
                {isPlayingAudio
                  ? t.stopAudio
                  : language === 'te'
                  ? 'పరిచయం వినండి'
                  : language === 'hi'
                  ? 'आवाज़ में सुनें'
                  : 'Listen to Voice'}
              </span>
            </button>
          </div>

          {/* Quick Voice Bar - 1 Tap to Speak right on Home Screen */}
          <div className="mt-6 bg-white/95 backdrop-blur p-2.5 sm:p-3 rounded-2xl shadow-xl border border-teal-100 text-slate-900 flex items-center justify-between gap-3">
            <button
              onClick={() => onSelectTab('assistant')}
              className="flex-1 flex items-center gap-3 text-left pl-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:bg-teal-100 transition">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {t.tapToSpeakPrompt}
                </p>
                <p className="text-xs text-slate-500">
                  {language === 'te'
                    ? 'ఉదా: "దగ్గర్లో ఉన్న ప్రభుత్వ ఆసుపత్రి ఎక్కడుంది?"'
                    : language === 'hi'
                    ? 'उदा: "पास में सरकारी अस्पताल कहाँ है?"'
                    : 'e.g. "Where is the nearest primary health centre?"'}
                </p>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('assistant')}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer shrink-0"
              aria-label="Start voice assistant"
            >
              <Mic className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Action Cards Grid */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>
              {language === 'te'
                ? 'ముఖ్యమైన సేవలు (Main Actions)'
                : language === 'hi'
                ? 'प्रमुख सेवाएं (Main Actions)'
                : 'Primary Healthcare Actions'}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectTab(card.id)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-md transition text-left cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Accent top stripe */}
                <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${card.color}`} />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}
                    >
                      {card.badgeText}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-snug">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-900">
                  <span>
                    {language === 'te' ? 'ప్రారంభించండి' : language === 'hi' ? 'शुरू करें' : 'Open Feature'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Emergency Quick Notice Banner */}
      <section className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-sm sm:text-base">
                {t.emergencyBannerTitle}
              </h4>
              <p className="text-xs sm:text-sm text-rose-800/90 mt-0.5">
                {t.emergencyBannerDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:108"
              className="flex-1 sm:flex-none text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition"
            >
              108 కి కాల్ (Call 108)
            </a>
            <button
              onClick={() => onSelectTab('emergency')}
              className="flex-1 sm:flex-none text-center bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 font-bold text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              SOS వివరాలు
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {language === 'te'
                ? 'వైద్య భద్రతా ప్రమాణాలు (Medical Safety Principles):'
                : language === 'hi'
                ? 'चिकित्सा सुरक्षा मानक (Medical Safety Principles):'
                : 'Medical Safety Principles:'}
            </p>
            <p>{t.disclaimerFoot}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
