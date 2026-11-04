import React, { useState, useRef } from 'react';
import { SupportedLanguage, PrescriptionAnalysis, ExtractedMedicine } from '../types';
import { translations } from '../i18n/translations';
import { samplePrescriptionImages } from '../data/mockData';
import {
  Camera,
  Upload,
  RotateCw,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  FileText,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Check,
  HelpCircle,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface PrescriptionScannerProps {
  language: SupportedLanguage;
  onAddMedicinesToCart?: (medicines: ExtractedMedicine[]) => void;
  isLargeText: boolean;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  language,
  onAddMedicinesToCart,
  isLargeText,
}) => {
  const t = translations[language];

  // Image & Camera state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PrescriptionAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Rotate preview image by 90 degrees
  const handleRotate = () => {
    setRotationDegrees((prev) => (prev + 90) % 360);
  };

  // Trigger file browser
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setRotationDegrees(0);
        setAnalysisResult(null);
        setAnalysisError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start live camera stream
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
      setAnalysisError(
        language === 'te'
          ? 'కెమెరా అందుబాటులో లేదు. దయచేసి ఫోటోను అప్‌లోడ్ చేయండి.'
          : 'Could not access camera. Please upload a photo instead.'
      );
    }
  };

  // Capture frame from live video
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageSrc(dataUrl);
      setRotationDegrees(0);
      setAnalysisResult(null);
    }
    stopCamera();
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Load sample prescription for instant evaluation
  const loadSamplePrescription = (sampleIndex: number) => {
    stopCamera();
    stopSpeaking();
    const sample = samplePrescriptionImages[sampleIndex] || samplePrescriptionImages[0];
    setImageSrc(sample.previewSvg);
    setRotationDegrees(0);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Analyze image with Gemini OCR backend
  const handleAnalyze = async () => {
    if (!imageSrc) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    stopSpeaking();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: imageSrc.includes('image/svg') ? 'image/png' : 'image/jpeg',
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: PrescriptionAnalysis = await res.json();
      setAnalysisResult(data);

      // Play audio readout automatically for elderly assistance
      if (data.audioScript) {
        speakText(
          data.audioScript,
          language,
          () => setIsPlayingAudio(true),
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false)
        );
      }
    } catch (err: any) {
      console.error('Prescription error:', err);
      setAnalysisError(
        language === 'te'
          ? 'ప్రిస్క్రిప్షన్ చదవడంలో లోపం ఏర్పడింది. దయచేసి స్పష్టమైన ఫోటో తీయండి.'
          : language === 'hi'
          ? 'पर्चा पढ़ने में त्रुटि हुई। कृपया स्पष्ट फोटो लें।'
          : 'Could not extract prescription details. Please try with clearer lighting.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio Play / Pause
  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    if (analysisResult?.audioScript || analysisResult?.explanationLocalized) {
      const textToSpeak = analysisResult.audioScript || analysisResult.explanationLocalized;
      setIsPlayingAudio(true);
      speakText(
        textToSpeak,
        language,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleRetake = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
    setImageSrc(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setAddedToCartSuccess(false);
    stopCamera();
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-4 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {t.prescTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.prescSubtitle}
            </p>
          </div>
        </div>

        {/* Quick Sample Prescriptions Demo Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadSamplePrescription(0)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.samplePrescriptionButton}</span>
          </button>
        </div>
      </div>

      {/* Strict Clinical Safety Principle Disclaimer */}
      <div className="bg-amber-50/90 border-l-4 border-amber-500 p-3.5 rounded-r-xl mb-5 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {language === 'te'
              ? 'ముఖ్యమైన భద్రతా నిబంధన (Clinical Principle):'
              : language === 'hi'
              ? 'महत्वपूर्ण सुरक्षा नियम (Clinical Principle):'
              : 'Strict Safety Principle:'}
          </span>{' '}
          {language === 'te'
            ? 'మేము ఊహించి మందుల పేర్లు చెప్పము. చేతిరాత స్పష్టంగా లేని చోట తప్పనిసరిగా "ఫార్మసిస్ట్ నిర్ధారణ అవసరం" అని చూపిస్తాము. ఏ మందునైనా ఫార్మసిస్ట్‌కు చూపించి మాత్రమే వేసుకోవాలి.'
            : language === 'hi'
            ? 'हम कभी भी अधूरी जानकारी या अनुमान के आधार पर दवा नहीं बताते। अस्पष्ट लिखावट को सत्यापित करने का निर्देश दिया जाता है।'
            : 'We never guess unreadable text. Ambiguous dosages and handwritten scribbles are strictly flagged for pharmacist verification.'}
        </div>
      </div>

      {/* Main Workspace: Capture / Upload or Preview */}
      {!imageSrc && !isCameraActive && (
        <div className="bg-white border-2 border-dashed border-emerald-300 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-4">
            <Camera className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {language === 'te'
              ? 'డాక్టర్ చీటీ ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి'
              : language === 'hi'
              ? 'डॉक्टर के पर्चे की फोटो खींचें या अपलोड करें'
              : 'Take a photo or upload doctor prescription'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            {language === 'te'
              ? 'మందుల పేర్లు, ఉదయం-రాత్రి మోతాదులు మరియు సూచనలను తెలుగులోనే స్పష్టంగా అర్థం చేసుకోవచ్చు.'
              : language === 'hi'
              ? 'दवाइयों के नाम, खुराक और समय अपनी भाषा में सरलता से समझें।'
              : 'Extract prescribed medicines, timings, and verify handwritten dosages.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            {/* Live Camera Button */}
            <button
              onClick={startCamera}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-5 rounded-2xl shadow-md transition cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>{t.useCamera}</span>
            </button>

            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-emerald-200 text-emerald-900 font-bold py-3 px-5 rounded-2xl transition cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>{t.uploadPhoto}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Quick 1-click test button for judges / testers */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {language === 'te' ? 'పరీక్షించడానికి నమూనాలు' : 'Quick Samples to Test'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => loadSamplePrescription(0)}
                className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition cursor-pointer"
              >
                Sample 1: Acute Fever & Antibiotic Rx (Guntur)
              </button>
              <button
                onClick={() => loadSamplePrescription(1)}
                className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition cursor-pointer"
              >
                Sample 2: Chronic BP & Diabetes Rx (Vijayawada)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Video Camera Stream */}
      {isCameraActive && (
        <div className="bg-black rounded-3xl overflow-hidden relative shadow-xl max-w-xl mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[360px] object-cover"
          />

          <div className="absolute inset-0 border-2 border-dashed border-emerald-400 m-8 rounded-2xl pointer-events-none flex items-center justify-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {language === 'te' ? 'ప్రిస్క్రిప్షన్‌ను ఫ్రేమ్‌లో ఉంచండి' : 'Align prescription within frame'}
            </span>
          </div>

          <div className="p-4 bg-slate-900/90 backdrop-blur flex items-center justify-between">
            <button
              onClick={stopCamera}
              className="text-white text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              రద్దు (Cancel)
            </button>
            <button
              onClick={captureFrame}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center ring-4 ring-white/50 cursor-pointer shadow-lg"
              title="Capture photo"
            >
              <Camera className="w-6 h-6" />
            </button>
            <div className="w-16" />
          </div>
        </div>
      )}

      {/* Image Preview & Analysis Card */}
      {imageSrc && !isCameraActive && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Preview Box with rotation control */}
              <div className="md:w-1/2 flex flex-col items-center">
                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative min-h-[280px] max-h-[380px] flex items-center justify-center p-2">
                  <img
                    src={imageSrc}
                    alt="Prescription preview"
                    className="max-h-[360px] w-auto object-contain transition-transform duration-300"
                    style={{ transform: `rotate(${rotationDegrees}deg)` }}
                  />
                </div>

                {/* Control bar under image: Rotate & Retake */}
                <div className="flex items-center gap-2 mt-3 w-full justify-between">
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{t.rotateImage}</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold cursor-pointer transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.retakeImage}</span>
                  </button>
                </div>
              </div>

              {/* Action / Analyze Column */}
              <div className="md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">
                    {language === 'te'
                      ? 'ప్రిస్క్రిప్షన్ విశ్లేషణ సిద్ధంగా ఉంది'
                      : language === 'hi'
                      ? 'पर्चे का विश्लेषण करने के लिए तैयार'
                      : 'Ready for AI OCR Analysis'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {language === 'te'
                      ? 'జెమిని AI ద్వారా వైద్య చేతిరాతను స్కాన్ చేసి, ప్రతి ఔషధం యొక్క మోతాదు మరియు సమయాన్ని తెలుగులో క్రమపద్ధతిలో విభజిస్తుంది.'
                      : language === 'hi'
                      ? 'जेमिनी विजन द्वारा लिखावट को स्कैन करके दवाओं और समय की सूची बनाई जाएगी।'
                      : 'Extract medicines, daily dosages, before/after meals instructions, and flag scribbled items requiring pharmacist review.'}
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{language === 'te' ? 'మందుల పేర్లు & మోతాదుల గుర్తింపు' : 'Medicines & dosage timings'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{language === 'te' ? 'అస్పష్టమైన రాతల ప్రత్యేక హెచ్చరిక' : 'Clear flagging of illegible handwriting'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{language === 'te' ? 'వాయిస్ ద్వారా చదివి వినిపించే సదుపాయం' : 'Spoken audio explanation in chosen language'}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition cursor-pointer text-sm sm:text-base"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t.analyzingPrescription}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{t.analyzePrescription}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Error Message */}
          {analysisError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-2xl text-sm flex items-center justify-between">
              <span>{analysisError}</span>
              <button
                onClick={() => setAnalysisError(null)}
                className="font-bold underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Structured OCR Results Display */}
          {analysisResult && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-md space-y-6">
              {/* Doctor and Patient Meta Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {t.doctorClinicLabel}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1">
                    {analysisResult.doctorOrClinic || 'General Physician Clinic'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {analysisResult.patientInfo && `Patient: ${analysisResult.patientInfo} • `}
                    {analysisResult.date && `Date: ${analysisResult.date}`}
                  </p>
                </div>

                {/* Voice Readout of Prescription Summary */}
                <button
                  onClick={toggleAudio}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer self-start sm:self-auto ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-950" />
                      <span>{t.stopAudio}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <span>{t.readAloud}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Localized Explanation Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                <h5 className="font-bold text-emerald-950 text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>
                    {language === 'te'
                      ? 'మీ భాషలో వివరణ (Summary in Telugu):'
                      : language === 'hi'
                      ? 'सरल भाषा में सारांश:'
                      : 'Patient Explanation:'}
                  </span>
                </h5>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {analysisResult.explanationLocalized}
                </p>
              </div>

              {/* Extracted Medicines List */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-3 flex items-center justify-between">
                  <span>{t.extractedMedicines}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {analysisResult.medicines.length} items found
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.medicines.map((med, idx) => {
                    const isUnclear = med.verificationNeeded || med.confidence === 'unclear';

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl p-4 border transition ${
                          isUnclear
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {idx + 1}. {med.name}
                          </h5>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                              isUnclear
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isUnclear ? t.verifyWithPharmacistTag : t.safeToTakeTag}
                          </span>
                        </div>

                        {/* Dosage Timing Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                          <div>
                            <span className="font-semibold text-slate-500">Dosage: </span>
                            <span className="font-bold text-slate-800">{med.dosage}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500">Frequency: </span>
                            <span className="font-bold text-slate-800">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500">Timing: </span>
                            <span className="font-bold text-slate-800">{med.timing}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500">Duration: </span>
                            <span className="font-bold text-slate-800">{med.duration}</span>
                          </div>
                        </div>

                        {med.instructions && (
                          <p className="text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                            {med.instructions}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unclear Items Banner (Verification Mandatory) */}
              {analysisResult.unclearItems && analysisResult.unclearItems.length > 0 && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm mb-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{t.verificationRequiredTitle}</span>
                  </div>
                  <p className="text-xs text-rose-800 mb-3">{t.verificationRequiredDesc}</p>
                  <ul className="space-y-1.5">
                    {analysisResult.unclearItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs font-semibold text-rose-950 flex items-start gap-1.5"
                      >
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action: Add Extracted Medicines to Order Cart */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (onAddMedicinesToCart && analysisResult.medicines.length > 0) {
                      onAddMedicinesToCart(analysisResult.medicines);
                      setAddedToCartSuccess(true);
                      setTimeout(() => setAddedToCartSuccess(false), 3000);
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer text-sm shadow-xs"
                >
                  {addedToCartSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'te' ? 'మందుల బ్యాగ్‌కు చేర్చబడింది!' : 'Added to Medicine Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.addMedicinesToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto text-xs text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  {t.retakeImage}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
