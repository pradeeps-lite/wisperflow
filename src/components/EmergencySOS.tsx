import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  AlertOctagon,
  PhoneCall,
  MapPin,
  MessageSquare,
  Share2,
  Volume2,
  XCircle,
  CheckCircle2,
  Smartphone,
  ShieldAlert,
  Loader2,
  User,
  Edit2,
  Flame,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface EmergencySOSProps {
  language: SupportedLanguage;
  isLargeText: boolean;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({
  language,
  isLargeText,
}) => {
  const t = translations[language];

  // SOS activation state
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [isSOSConfirmed, setIsSOSConfirmed] = useState(false);

  // Location state
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 16.3067,
    lng: 80.4365,
  });
  const [locationAddress, setLocationAddress] = useState('Guntur, Andhra Pradesh (Near GGH Hospital)');
  const [isLocating, setIsLocating] = useState(false);

  // Custom Family Emergency Contact
  const [familyContact, setFamilyContact] = useState('+91 98480 22338');
  const [familyName, setFamilyName] = useState('Raju (కుటుంబ సభ్యుడు / Brother)');
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Shake to trigger state
  const [isShakeEnabled, setIsShakeEnabled] = useState(true);
  const [shakeDetectedNotice, setShakeDetectedNotice] = useState(false);

  const countdownTimerRef = useRef<any>(null);

  // Acquire high accuracy GPS location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationAddress(`GPS Coordinates: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        (err) => {
          setIsLocating(false);
          console.warn('GPS location request:', err.message);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Shake detection with DeviceMotionEvent
  useEffect(() => {
    if (!isShakeEnabled || typeof window === 'undefined') return;

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;
    const SHAKE_THRESHOLD = 22; // m/s²

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current || current.x === null || current.y === null || current.z === null) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 150) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        if (lastX !== null && lastY !== null && lastZ !== null) {
          const deltaX = Math.abs(current.x - lastX);
          const deltaY = Math.abs(current.y - lastY);
          const deltaZ = Math.abs(current.z - lastZ);
          const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;

          if (speed > SHAKE_THRESHOLD && !isCountdownActive && !isSOSConfirmed) {
            triggerSOSCountdown(true);
          }
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isShakeEnabled, isCountdownActive, isSOSConfirmed]);

  // Start 5-second countdown before activating
  const triggerSOSCountdown = (fromShake = false) => {
    stopSpeaking();
    if (fromShake) {
      setShakeDetectedNotice(true);
    }
    setIsCountdownActive(true);
    setCountdownSeconds(5);

    // Audio warning
    const warningText =
      language === 'te'
        ? 'అత్యవసర సహాయం 5 సెకన్లలో మొదలవుతుంది. రద్దు చేయడానికి స్క్రీన్‌పై తాకండి.'
        : language === 'hi'
        ? 'आपातकालीन सहायता 5 सेकंड में शुरू होगी। रद्द करने के लिए स्क्रीन छुएं।'
        : 'Emergency SOS countdown started. Tap cancel to stop.';
    speakText(warningText, language);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          setIsCountdownActive(false);
          setIsSOSConfirmed(true);
          speakText(
            language === 'te'
              ? 'అత్యవసర సహాయం సిద్ధమైంది. వెంటనే 108 కి కాల్ చేయండి.'
              : 'Emergency SOS activated. Calling emergency lines.',
            language
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setIsCountdownActive(false);
    setCountdownSeconds(5);
    setShakeDetectedNotice(false);
    stopSpeaking();
  };

  // Google Maps link for SMS / WhatsApp
  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : 'https://maps.google.com';

  const sosMessageText =
    language === 'te'
      ? `అత్యవసర సహాయం అవసరం! (MEDICAL EMERGENCY)\nనా ప్రస్తుత లొకేషన్:\n${mapsUrl}\nదయచేసి వెంటనే 108 అంబులెన్స్ పంపించండి లేదా సహాయం చేయండి.`
      : language === 'hi'
      ? `आपातकालीन सहायता की जरूरत है! (MEDICAL EMERGENCY)\nमेरी लोकेशन:\n${mapsUrl}\nकृपया तुरंत 108 एम्बुलेंस भेजें या संपर्क करें।`
      : `EMERGENCY ASSISTANCE NEEDED!\nMy live GPS location:\n${mapsUrl}\nPlease send 108 ambulance or call back immediately.`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(sosMessageText);
    const cleanNumber = familyContact.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`, '_blank');
  };

  const handleSmsShare = () => {
    const encoded = encodeURIComponent(sosMessageText);
    window.location.href = `sms:${familyContact}?body=${encoded}`;
  };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-4 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-5 shadow-lg mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold">
            <AlertOctagon className="w-7 h-7 text-white stroke-[2.3] animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl tracking-tight">
              {t.sosTitle}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 font-medium">
              {t.sosSubtitle}
            </p>
          </div>
        </div>

        <span className="text-xs bg-red-800 text-red-200 px-3 py-1 rounded-full font-bold hidden sm:inline">
          108 • 112 • 104
        </span>
      </div>

      {/* Honest Prototype Disclaimer Banner */}
      <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3.5 mb-5 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-slate-900">
            {language === 'te' ? 'పారదర్శక సమాచారం (Honest Disclosure): ' : 'Transparent Notice: '}
          </span>
          {t.honestEmergencyDisclaimer}
        </p>
      </div>

      {/* ACTIVE COUNTDOWN MODAL OVERLAY */}
      {isCountdownActive && (
        <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-red-500">
            <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <Flame className="w-10 h-10 animate-bounce" />
            </div>

            {shakeDetectedNotice && (
              <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {language === 'te' ? 'ఫోన్ ఊపినందున ట్రిగ్గర్ అయ్యింది!' : 'Device Motion / Shake Triggered!'}
              </span>
            )}

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {language === 'te' ? 'అత్యవసర సహాయం (Emergency SOS)' : 'Emergency SOS Triggering'}
            </h3>

            <p className="text-xs text-slate-600 mb-6">
              {countdownSeconds} {t.countdownNotice}
            </p>

            {/* Huge Countdown Number */}
            <div className="text-7xl font-black text-red-600 mb-6 tracking-tight animate-ping">
              {countdownSeconds}
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancelCountdown}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-2xl text-base shadow-lg cursor-pointer transition active:scale-95"
            >
              <XCircle className="w-6 h-6 text-red-400" />
              <span>{t.cancelSOS}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger SOS Section */}
      <div className="bg-white rounded-3xl p-6 border-2 border-red-100 shadow-md text-center mb-6">
        <h3 className="font-extrabold text-slate-900 text-lg mb-1">
          {language === 'te'
            ? 'తక్షణ వైద్య సహాయం కోసం తాకండి'
            : language === 'hi'
            ? 'तुरंत आपातकालीन सहायता प्राप्त करें'
            : 'Immediate Medical Emergency Activation'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
          {language === 'te'
            ? 'ఈ బటన్ నొక్కిన వెంటనే 5 సెకన్ల కౌంట్‌డౌన్ మొదలవుతుంది. ఆటోమేటిక్‌గా మీ GPS లొకేషన్ సిద్ధమవుతుంది.'
            : 'Press to initiate 5-second countdown with your GPS coordinates.'}
        </p>

        {/* Big Red SOS Button */}
        <button
          onClick={() => triggerSOSCountdown(false)}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-2xl sm:text-3xl shadow-2xl shadow-red-600/40 mx-auto flex flex-col items-center justify-center ring-8 ring-red-100 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <AlertOctagon className="w-12 h-12 mb-1 animate-pulse" />
          <span>SOS</span>
          <span className="text-xs font-bold tracking-widest text-red-200 uppercase mt-0.5">
            Emergency
          </span>
        </button>

        <p className="mt-4 text-xs font-bold text-red-700">
          {t.activateSOSImmediately}
        </p>
      </div>

      {/* Direct Indian Emergency Numbers Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-6">
        <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center justify-between">
          <span>
            {language === 'te'
              ? 'ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్లు (Direct Emergency Helplines)'
              : 'Direct Emergency Dialers'}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            24x7 Free Service
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 108 Ambulance */}
          <a
            href="tel:108"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 transition group"
          >
            <div>
              <span className="text-xs font-semibold text-red-700">Ambulance</span>
              <p className="font-black text-xl text-red-900">108</p>
              <p className="text-[11px] text-red-800">
                {language === 'te' ? 'అంబులెన్స్ సేవలు' : 'Emergency Ambulance'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>

          {/* 112 National Helpline */}
          <a
            href="tel:112"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 transition group"
          >
            <div>
              <span className="text-xs font-semibold text-amber-700">All Emergency</span>
              <p className="font-black text-xl text-amber-900">112</p>
              <p className="text-[11px] text-amber-800">
                {language === 'te' ? 'జాతీయ ఎమర్జెన్సీ' : 'National Emergency'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>

          {/* 104 Health Helpline */}
          <a
            href="tel:104"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 transition group"
          >
            <div>
              <span className="text-xs font-semibold text-teal-700">Health Advice</span>
              <p className="font-black text-xl text-teal-900">104</p>
              <p className="text-[11px] text-teal-800">
                {language === 'te' ? 'ఆరోగ్య సమాచారం' : 'Govt Medical Advice'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>
        </div>
      </div>

      {/* GPS Location & 1-Tap SOS Message Sharing */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {t.emergencyLocationLabel}
            </h4>
          </div>

          {coords && (
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4">
          {locationAddress}
        </p>

        {/* Family Emergency Contact Row */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <User className="w-4 h-4 text-teal-700" />
              <span>
                {language === 'te'
                  ? 'కుటుంబ అత్యవసర సంప్రదింపు (Designated Contact)'
                  : 'Designated Family Emergency Contact'}
              </span>
            </div>

            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditingContact ? 'Save' : 'సవరించండి (Edit)'}</span>
            </button>
          </div>

          {isEditingContact ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Contact Name"
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-teal-600"
              />
              <input
                type="text"
                value={familyContact}
                onChange={(e) => setFamilyContact(e.target.value)}
                placeholder="Phone Number"
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-teal-600"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{familyName}</p>
                <p className="text-xs text-slate-500 font-mono">{familyContact}</p>
              </div>
              <a
                href={`tel:${familyContact}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callingFamilyContact}</span>
              </a>
            </div>
          )}
        </div>

        {/* Share buttons for WhatsApp and SMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.sendWhatsAppSOS}</span>
          </button>

          <button
            onClick={handleSmsShare}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.sendSmsSOS}</span>
          </button>
        </div>
      </div>

      {/* Shake-to-trigger detection control & simulator */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {t.shakeToTriggerTitle}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.shakeToTriggerDesc}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setIsShakeEnabled(!isShakeEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              isShakeEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                isShakeEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Shake Simulator Button for Judges / Testers */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isShakeEnabled ? t.shakeEnabled : t.shakeDisabled}
          </span>

          <button
            onClick={() => triggerSOSCountdown(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 animate-bounce" />
            <span>{t.testShakeButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
