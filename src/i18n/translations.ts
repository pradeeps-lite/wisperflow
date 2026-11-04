import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  badgePrototype: string;
  navHome: string;
  navAssistant: string;
  navPrescription: string;
  navFacilities: string;
  navEmergency: string;
  navOrder: string;
  textLargeToggle: string;
  languageSelectLabel: string;
  
  // Home
  greeting: string;
  greetingSub: string;
  speakToSanjivaniTitle: string;
  speakToSanjivaniDesc: string;
  prescriptionTitle: string;
  prescriptionDesc: string;
  facilitiesTitle: string;
  facilitiesDesc: string;
  emergencyTitle: string;
  emergencyDesc: string;
  orderTitle: string;
  orderDesc: string;
  tapToSpeakPrompt: string;
  listeningNow: string;
  emergencyBannerTitle: string;
  emergencyBannerDesc: string;
  disclaimerFoot: string;
  
  // Assistant
  assistantTitle: string;
  assistantSubtitle: string;
  micTapToSpeak: string;
  micListening: string;
  micProcessing: string;
  micSpeaking: string;
  transcriptLabel: string;
  transcriptEditHelp: string;
  sendQuestion: string;
  retryRecording: string;
  readAloud: string;
  stopAudio: string;
  repeatAudio: string;
  emergencyWarning: string;
  sampleQuestionsTitle: string;
  sampleQuestions: string[];
  clearChat: string;
  
  // Prescription
  prescTitle: string;
  prescSubtitle: string;
  uploadPhoto: string;
  useCamera: string;
  rotateImage: string;
  retakeImage: string;
  analyzePrescription: string;
  analyzingPrescription: string;
  samplePrescriptionButton: string;
  extractedMedicines: string;
  verificationRequiredTitle: string;
  verificationRequiredDesc: string;
  doctorClinicLabel: string;
  patientLabel: string;
  dateLabel: string;
  safeToTakeTag: string;
  verifyWithPharmacistTag: string;
  addMedicinesToCart: string;
  
  // Facilities
  facTitle: string;
  facSubtitle: string;
  useMyLocation: string;
  locatingUser: string;
  searchTownPlaceholder: string;
  searchButton: string;
  filterAll: string;
  filterHospitals: string;
  filterPHC: string;
  filterPharmacies: string;
  filterJanAushadhi: string;
  filter24x7: string;
  callHospital: string;
  getDirections: string;
  emergencyBadge: string;
  kmAway: string;
  
  // Emergency
  sosTitle: string;
  sosSubtitle: string;
  countdownNotice: string;
  cancelSOS: string;
  activateSOSImmediately: string;
  calling108Ambulance: string;
  calling112National: string;
  calling104Helpline: string;
  callingFamilyContact: string;
  emergencyLocationLabel: string;
  sendWhatsAppSOS: string;
  sendSmsSOS: string;
  shakeToTriggerTitle: string;
  shakeToTriggerDesc: string;
  testShakeButton: string;
  shakeEnabled: string;
  shakeDisabled: string;
  honestEmergencyDisclaimer: string;
  
  // Pharmacy Order
  orderSubtitle: string;
  searchMedicinePlaceholder: string;
  searchMedicineVoice: string;
  categoryAll: string;
  categoryFever: string;
  categoryChronic: string;
  categoryGeneric: string;
  categoryFirstAid: string;
  addToCart: string;
  inCart: string;
  viewCart: string;
  checkoutTitle: string;
  patientNameLabel: string;
  villageTownLabel: string;
  landmarkLabel: string;
  phoneNumberLabel: string;
  paymentMethodLabel: string;
  cashOnDelivery: string;
  prescriptionStatusLabel: string;
  prescriptionAttachedNote: string;
  placeOrderButton: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  trackOrderSteps: string[];
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  te: {
    appName: 'సంజీవని AI',
    tagline: 'మీ భాషలోనే మాట్లాడే ఆరోగ్య రక్షకుడు',
    badgePrototype: 'విస్పర్ ఫ్లో ప్రోటోటైప్ — లైవ్ వాయిస్ & AI',
    navHome: 'హోమ్',
    navAssistant: 'సంజీవని వాయిస్',
    navPrescription: 'ప్రిస్క్రిప్షన్',
    navFacilities: 'ఆసుపత్రులు',
    navEmergency: 'అత్యవసరం SOS',
    navOrder: 'మందులు',
    textLargeToggle: 'పెద్ద అక్షరాలు',
    languageSelectLabel: 'భాష ఎంచుకోండి',

    greeting: 'నమస్కారం! నేను మీ సంజీవని',
    greetingSub: 'మీకు కావలసిన ఆరోగ్య సహాయాన్ని సూటిగా అడగండి లేదా ఫోటో చూపించండి.',
    speakToSanjivaniTitle: 'సంజీవనితో మాట్లాడండి',
    speakToSanjivaniDesc: 'మీ సమస్యను తెలుగులోనే చెప్పండి. వెంటనే సూచనలు పొందండి.',
    prescriptionTitle: 'ప్రిస్క్రిప్షన్ అర్థం చేసుకోండి',
    prescriptionDesc: 'డాక్టర్ చీటీ ఫోటో తీయండి. మందుల పేర్లు, సమయాలు స్పష్టంగా వినండి.',
    facilitiesTitle: 'దగ్గరలోని ఆసుపత్రులు & దుకాణాలు',
    facilitiesDesc: 'ప్రభుత్వ ఆసుపత్రులు (GGH), పీహెచ్‌సీలు, జన ఔషధి కేంద్రాలు కనుగొనండి.',
    emergencyTitle: 'అత్యవసర సహాయం (SOS)',
    emergencyDesc: 'తక్షణమే 108 అంబులెన్స్ లేదా కుటుంబ సభ్యులకు లొకేషన్‌తో సహాయం కోరండి.',
    orderTitle: 'మందులు ఆర్డర్ చేయండి',
    orderDesc: 'దగ్గరలోని మెడికల్ షాపు నుండి తక్కువ ధరకే మందులు తెప్పించుకోండి.',
    tapToSpeakPrompt: 'మాట్లాడటానికి మైక్ నొక్కండి...',
    listeningNow: 'వింటున్నాము... మాట్లాడండి',
    emergencyBannerTitle: 'తీవ్రమైన అత్యవసర పరిస్థితి ఉందా?',
    emergencyBannerDesc: 'ఆలస్యం చేయకుండా వెంటనే 108 నంబర్‌కు కాల్ చేయండి లేదా SOS బటన్ నొక్కండి.',
    disclaimerFoot: 'గమనిక: సంజీవని ఒక సమాచార సహాయక సాధనం. ఇది వైద్య చికిత్స కాదు. ఎల్లప్పుడూ అర్హత గల వైద్యుడిని లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.',

    assistantTitle: 'సంజీవని వాయిస్ అసిస్టెంట్',
    assistantSubtitle: 'తెలుగులో అడగండి. సూటిగా సమాధానం వినండి.',
    micTapToSpeak: 'మైక్రోఫోన్ నొక్కి మాట్లాడండి',
    micListening: 'మీ మాటలను వింటున్నాము... (మాట్లాడండి)',
    micProcessing: 'సమాధానం సిద్ధం చేస్తున్నాము...',
    micSpeaking: 'చదివి వినిపిస్తున్నాము...',
    transcriptLabel: 'మీరు మాట్లాడిన మాటలు:',
    transcriptEditHelp: 'తప్పుగా నమోదైతే సరిచేయవచ్చు లేదా మళ్లీ మాట్లాడవచ్చు.',
    sendQuestion: 'సమాధానం పొందండి',
    retryRecording: 'మళ్లీ మాట్లాడండి',
    readAloud: 'వాయిస్ వినండి',
    stopAudio: 'ఆపండి',
    repeatAudio: 'మళ్లీ వినండి',
    emergencyWarning: 'హెచ్చరిక: ఈ లక్షణాలు తీవ్రమైనవి కావచ్చు. వెంటనే ఆసుపత్రికి వెళ్లండి లేదా 108 కి కాల్ చేయండి.',
    sampleQuestionsTitle: 'ఈ ప్రశ్నలను అడగవచ్చు:',
    sampleQuestions: [
      'నాకు 2 రోజులుగా తీవ్రమైన జ్వరం మరియు ఒంటి నొప్పులు ఉన్నాయి, ఏమి చేయాలి?',
      'నా దగ్గరలో ఉన్న ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) ఎక్కడుంది?',
      'పారాసిటమాల్ మందు భోజనం ముందా లేదా భోజనం తర్వాత వేసుకోవాలా?',
      'వైఎస్సార్ ఆరోగ్యశ్రీ లేదా ఆయుష్మాన్ భారత్ కార్డుతో ఉచిత చికిత్స ఎలా పొందాలి?',
    ],
    clearChat: 'చాట్ క్లియర్ చేయండి',

    prescTitle: 'ప్రిస్క్రిప్షన్ స్కానర్ & అనలైజర్',
    prescSubtitle: 'చేతిరాత చీటీని సులభంగా అర్థం చేసుకోండి. అస్పష్టమైన రాతల పట్ల జాగ్రత్తగా ఉండండి.',
    uploadPhoto: 'ఫోటో అప్‌లోడ్ చేయండి',
    useCamera: 'కెమెరాతో తీయండి',
    rotateImage: 'తిప్పండి (90°)',
    retakeImage: 'మరో ఫోటో',
    analyzePrescription: 'చీటీని అర్థం చేసుకోండి (AI విశ్లేషణ)',
    analyzingPrescription: 'ప్రిస్క్రిప్షన్ రాతలను చదువుతున్నాము...',
    samplePrescriptionButton: 'నమూనా చీటీతో ప్రయత్నించండి (డెమో)',
    extractedMedicines: 'గుర్తించబడిన మందులు & సమయాలు',
    verificationRequiredTitle: '⚠️ ఫార్మసిస్ట్ నిర్ధారణ అవసరం',
    verificationRequiredDesc: 'చేతిరాత అస్పష్టంగా ఉన్న మందులను దుకాణదారుడికి చూపించి మాత్రమే వాడాలి. మేము ఊహించి మందుల పేర్లు చెప్పము.',
    doctorClinicLabel: 'డాక్టర్ / క్లినిక్ పేరు:',
    patientLabel: 'రోగి వివరాలు:',
    dateLabel: 'తేదీ:',
    safeToTakeTag: 'స్పష్టంగా ఉంది',
    verifyWithPharmacistTag: '⚠️ నిర్ధారణ అవసరం',
    addMedicinesToCart: 'ఈ మందులను ఆర్డర్ చేయండి',

    facTitle: 'దగ్గరలోని ఆరోగ్య కేంద్రాలు & దుకాణాలు',
    facSubtitle: 'ప్రభుత్వ ఆసుపత్రులు, పీహెచ్‌సీలు, చౌక ధర జన ఔషధి కేంద్రాలు.',
    useMyLocation: 'నా ప్రస్తుత లొకేషన్ ఉపయోగించండి (GPS)',
    locatingUser: 'లొకేషన్ గుర్తిస్తున్నాము...',
    searchTownPlaceholder: 'ఊరు, మండలం లేదా పిన్‌కోడ్ (ఉదా: గుంటూరు, 522001)',
    searchButton: 'వెతకండి',
    filterAll: 'అన్నీ',
    filterHospitals: 'ఆసుపత్రులు (GGH)',
    filterPHC: 'పీహెచ్‌సీ (PHC)',
    filterPharmacies: 'మెడికల్ షాపులు',
    filterJanAushadhi: 'జన ఔషధి (తక్కువ ధర)',
    filter24x7: '24 గంటల ఎమర్జెన్సీ',
    callHospital: 'కాల్ చేయండి',
    getDirections: 'దారి చూడండి',
    emergencyBadge: '24/7 ఎమర్జెన్సీ & అంబులెన్స్',
    kmAway: 'కి.మీ దూరంలో',

    sosTitle: 'అత్యవసర సహాయం (Emergency SOS)',
    sosSubtitle: 'ఆపద సమయంలో తక్షణ సహాయం కోసం మీ రక్షక బటన్',
    countdownNotice: 'సెకన్లలో అత్యవసర కాల్ ప్రారంభమవుతుంది. పొరపాటున నొక్కితే రద్దు చేయండి.',
    cancelSOS: 'రద్దు చేయండి (Cancel)',
    activateSOSImmediately: 'ఇప్పుడే SOS యాక్టివేట్ చేయండి',
    calling108Ambulance: '108 అంబులెన్స్ కాల్',
    calling112National: '112 జాతీయ ఎమర్జెన్సీ',
    calling104Helpline: '104 ఆరోగ్య సమాచార కేంద్రం',
    callingFamilyContact: 'కుటుంబ సభ్యులకు కాల్',
    emergencyLocationLabel: 'మీ ప్రస్తుత GPS లొకేషన్:',
    sendWhatsAppSOS: 'WhatsApp లో లొకేషన్ పంపండి',
    sendSmsSOS: 'SMS లో మెసేజ్ పంపండి',
    shakeToTriggerTitle: 'ఫోన్ ఊపితే SOS (Shake to Trigger)',
    shakeToTriggerDesc: 'ఫోన్‌ను గట్టిగా 3 సార్లు ఊపినప్పుడు ఆటోమేటిక్‌గా SOS కౌంట్‌డౌన్ మొదలవుతుంది.',
    testShakeButton: 'షేక్ మోషన్‌ను పరీక్షించండి (డెమో)',
    shakeEnabled: 'షేక్ ట్రిగ్గర్ ఆన్ చేయబడింది',
    shakeDisabled: 'షేక్ ట్రిగ్గర్ ఆఫ్ చేయబడింది',
    honestEmergencyDisclaimer: 'స్పష్టమైన సమాచారం: ఇది మీ ఫోన్ డైలర్ మరియు SMS/WhatsApp ద్వారా నేరుగా కాల్ చేస్తుంది. అధికారిక ప్రభుత్వ వ్యవస్థలో స్వయంచాలక బుకింగ్ ఉండదు.',

    orderSubtitle: 'సమీపంలోని మందుల దుకాణాల నుండి సులభంగా ఆర్డర్ చేసుకోండి',
    searchMedicinePlaceholder: 'మందు పేరు రాయండి లేదా మైక్ నొక్కండి...',
    searchMedicineVoice: 'మందు పేరు చెప్పండి',
    categoryAll: 'అన్ని మందులు',
    categoryFever: 'జ్వరం & నొప్పులు',
    categoryChronic: 'బీపీ & షుగర్',
    categoryGeneric: 'జన ఔషధి (70% తక్కువ)',
    categoryFirstAid: 'ప్రథమ చికిత్స',
    addToCart: 'జతచేయండి',
    inCart: 'బ్యాగ్‌లో ఉంది',
    viewCart: 'బ్యాగ్ చూడండి',
    checkoutTitle: 'డెలివరీ వివరాలు',
    patientNameLabel: 'రోగి లేదా మీ పేరు:',
    villageTownLabel: 'గ్రామం / ఊరు / మండలం:',
    landmarkLabel: 'గుర్తు (ల్యాండ్‌మార్క్ - ఉదా: రామాలయం దగ్గర):',
    phoneNumberLabel: 'ఫోన్ నంబర్:',
    paymentMethodLabel: 'చెల్లింపు విధానం:',
    cashOnDelivery: 'మందులు అందిన తర్వాత డబ్బులు (Cash on Delivery)',
    prescriptionStatusLabel: 'డాక్టర్ చీటీ స్థితి:',
    prescriptionAttachedNote: 'ప్రిస్క్రిప్షన్ జతచేయబడింది (ఫార్మసిస్ట్ తనిఖీ చేస్తారు)',
    placeOrderButton: 'ఆర్డర్ ఖరారు చేయండి',
    orderSuccessTitle: 'ఆర్డర్ విజయవంతంగా నమోదైంది!',
    orderSuccessDesc: 'స్థానిక ఫార్మసిస్ట్ మీ ఆర్డర్‌ను సిద్ధం చేస్తున్నారు.',
    trackOrderSteps: [
      'ఆర్డర్ నమోదైంది',
      'ఫార్మసిస్ట్ తనిఖీ చేస్తున్నారు',
      'డెలివరీ బయలుదేరింది',
      'మందులు చేరాయి',
    ],
  },
  hi: {
    appName: 'संजीवनी AI',
    tagline: 'आपकी अपनी भाषा में स्वास्थ्य सुरक्षा',
    badgePrototype: 'विस्पर फ्लो प्रोटोटाइप — लाइव वॉइस और AI',
    navHome: 'होम',
    navAssistant: 'संजीवनी वॉइस',
    navPrescription: 'पर्चा समझें',
    navFacilities: 'अस्पताल व दवा',
    navEmergency: 'आपातकाल SOS',
    navOrder: 'दवा मंगवाएं',
    textLargeToggle: 'बड़े अक्षर',
    languageSelectLabel: 'भाषा चुनें',

    greeting: 'नमस्ते! मैं आपकी संजीवनी हूँ',
    greetingSub: 'स्वास्थ्य संबंधी कोई भी सवाल पूछें या डॉक्टर का पर्चा दिखाएं।',
    speakToSanjivaniTitle: 'संजीवनी से बात करें',
    speakToSanjivaniDesc: 'अपनी समस्या बोलकर बताएं और तुरंत सरल सलाह पाएं।',
    prescriptionTitle: 'डॉक्टर का पर्चा समझें',
    prescriptionDesc: 'पर्चे की फोटो खींचें, दवाओं के नाम और खुराक हिंदी में सुनें।',
    facilitiesTitle: 'नजदीकी अस्पताल व केंद्र',
    facilitiesDesc: 'सरकारी अस्पताल (GGH), PHC और जन औषधि केंद्र खोजें।',
    emergencyTitle: 'आपातकालीन सहायता (SOS)',
    emergencyDesc: 'तुरंत 108 एम्बुलेंस और परिवार को लोकेशन के साथ कॉल करें।',
    orderTitle: 'दवाइयां मंगवाएं',
    orderDesc: 'पास की फार्मेसी से सस्ती और जरूरी दवाइयां आसानी से ऑर्डर करें।',
    tapToSpeakPrompt: 'बोलने के लिए माइक दबाएं...',
    listeningNow: 'सुन रहे हैं... बोलिए',
    emergencyBannerTitle: 'क्या यह गंभीर आपातकाल है?',
    emergencyBannerDesc: 'बिना देर किए 108 पर कॉल करें या तुरंत SOS बटन दबाएं।',
    disclaimerFoot: 'नोट: संजीवनी केवल सूचनात्मक सहायक है। किसी भी बीमारी के लिए डॉक्टर या फार्मासिस्ट से परामर्श अवश्य लें।',

    assistantTitle: 'संजीवनी वॉइस असिस्टेंट',
    assistantSubtitle: 'हिंदी में पूछें, बोलकर उत्तर सुनें।',
    micTapToSpeak: 'माइक दबाकर बोलें',
    micListening: 'आपकी आवाज़ सुनी जा रही है...',
    micProcessing: 'उत्तर तैयार किया जा रहा है...',
    micSpeaking: 'बोलकर बताया जा रहा है...',
    transcriptLabel: 'आपके द्वारा बोले गए शब्द:',
    transcriptEditHelp: 'गलती होने पर लिख कर बदलें या दोबारा बोलें।',
    sendQuestion: 'उत्तर पाएं',
    retryRecording: 'फिर से बोलें',
    readAloud: 'आवाज़ में सुनें',
    stopAudio: 'रोकें',
    repeatAudio: 'दोबारा सुनें',
    emergencyWarning: 'चेतावनी: ये लक्षण गंभीर हो सकते हैं। तुरंत नजदीकी अस्पताल जाएं या 108 डायल करें।',
    sampleQuestionsTitle: 'आप ऐसे सवाल पूछ सकते हैं:',
    sampleQuestions: [
      'मुझे 2 दिनों से तेज बुखार और बदन दर्द है, क्या करूं?',
      'मेरे सबसे पास प्राथमिक स्वास्थ्य केंद्र (PHC) कहाँ है?',
      'पैरासिटामोल खाना खाने से पहले लेनी है या बाद में?',
      'आयुष्मान भारत कार्ड से मुफ्त इलाज कैसे प्राप्त करें?',
    ],
    clearChat: 'चैट साफ करें',

    prescTitle: 'प्रिस्क्रिप्शन स्कैनर एवं विश्लेषक',
    prescSubtitle: 'डॉक्टर के पर्चे की लिखावट समझें। अस्पष्ट दवाओं की पहचान करें।',
    uploadPhoto: 'फोटो अपलोड करें',
    useCamera: 'कैमरे से फोटो लें',
    rotateImage: 'घुमाएं (90°)',
    retakeImage: 'दूसरी फोटो लें',
    analyzePrescription: 'पर्चा समझें (AI विश्लेषण)',
    analyzingPrescription: 'पर्चे की लिखावट पढ़ी जा रही है...',
    samplePrescriptionButton: 'नमूना पर्चे से जांचें (डेमो)',
    extractedMedicines: 'पहचानी गई दवाइयां और समय',
    verificationRequiredTitle: '⚠️ फार्मासिस्ट से जांच आवश्यक',
    verificationRequiredDesc: 'अस्पष्ट लिखावट वाली दवाओं को मेडिकल स्टोर से सत्यापित किए बिना कभी न लें।',
    doctorClinicLabel: 'डॉक्टर / क्लिनिक:',
    patientLabel: 'मरीज का नाम:',
    dateLabel: 'तारीख:',
    safeToTakeTag: 'स्पष्ट लिखावट',
    verifyWithPharmacistTag: '⚠️ जांच आवश्यक',
    addMedicinesToCart: 'ये दवाइयां ऑर्डर करें',

    facTitle: 'आसपास के अस्पताल एवं जन औषधि केंद्र',
    facSubtitle: 'सरकारी अस्पताल, प्राथमिक केंद्र और किफायती दवा स्टोर।',
    useMyLocation: 'मेरा स्थान उपयोग करें (GPS)',
    locatingUser: 'स्थान खोजा जा रहा है...',
    searchTownPlaceholder: 'शहर, कस्बा या पिनकोड (उदा: गुंटूर, 522001)',
    searchButton: 'खोजें',
    filterAll: 'सभी',
    filterHospitals: 'अस्पताल',
    filterPHC: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    filterPharmacies: 'मेडिकल स्टोर',
    filterJanAushadhi: 'जन औषधि केंद्र (कम दाम)',
    filter24x7: '24/7 इमरजेंसी',
    callHospital: 'कॉल करें',
    getDirections: 'रास्ता देखें',
    emergencyBadge: '24 घंटे इमरजेंसी व एम्बुलेंस',
    kmAway: 'किमी दूर',

    sosTitle: 'आपातकालीन सहायता (Emergency SOS)',
    sosSubtitle: 'संकट के समय तुरंत मदद पाने का सुरक्षित माध्यम',
    countdownNotice: 'सेकंड में कॉल शुरू हो जाएगा। गलती से दबने पर रद्द करें।',
    cancelSOS: 'रद्द करें (Cancel)',
    activateSOSImmediately: 'अभी SOS सक्रिय करें',
    calling108Ambulance: '108 एम्बुलेंस कॉल',
    calling112National: '112 राष्ट्रीय आपातकाल',
    calling104Helpline: '104 स्वास्थ्य हेल्पलाइन',
    callingFamilyContact: 'पारिवारिक संपर्क को कॉल',
    emergencyLocationLabel: 'आपकी GPS लोकेशन:',
    sendWhatsAppSOS: 'WhatsApp पर लोकेशन भेजें',
    sendSmsSOS: 'SMS संदेश भेजें',
    shakeToTriggerTitle: 'फोन हिलाने पर SOS (Shake to Trigger)',
    shakeToTriggerDesc: 'फोन को 3 बार तेजी से हिलाने पर SOS उलटी गिनती शुरू होगी।',
    testShakeButton: 'शेक मोशन टेस्ट करें (डेमो)',
    shakeEnabled: 'शेक ट्रिगर चालू है',
    shakeDisabled: 'शेक ट्रिगर बंद है',
    honestEmergencyDisclaimer: 'पारदर्शी सूचना: यह आपके फोन डायलर और SMS/WhatsApp द्वारा कॉल या संदेश भेजता है।',

    orderSubtitle: 'पास की अधिकृत फार्मेसी से दवाइयां घर मंगाएं',
    searchMedicinePlaceholder: 'दवा का नाम लिखें या माइक दबाएं...',
    searchMedicineVoice: 'दवा का नाम बोलें',
    categoryAll: 'सभी दवाइयां',
    categoryFever: 'बुखार व दर्द',
    categoryChronic: 'बीपी व शुगर',
    categoryGeneric: 'जन औषधि (70% बचत)',
    categoryFirstAid: 'प्राथमिक उपचार',
    addToCart: 'जोड़ें',
    inCart: 'बैग में है',
    viewCart: 'बैग देखें',
    checkoutTitle: 'डिलीवरी का पता',
    patientNameLabel: 'मरीज का नाम:',
    villageTownLabel: 'गांव / कस्बा / शहर:',
    landmarkLabel: 'पहचान का स्थान (लैंडमार्क):',
    phoneNumberLabel: 'फोन नंबर:',
    paymentMethodLabel: 'भुगतान का तरीका:',
    cashOnDelivery: 'दवा मिलने पर नकद (Cash on Delivery)',
    prescriptionStatusLabel: 'डॉक्टर का पर्चा:',
    prescriptionAttachedNote: 'पर्चा संलग्न है (फार्मासिस्ट द्वारा जांचा जाएगा)',
    placeOrderButton: 'ऑर्डर पक्का करें',
    orderSuccessTitle: 'ऑर्डर दर्ज हो गया है!',
    orderSuccessDesc: 'स्थानीय फार्मासिस्ट आपकी दवाइयां तैयार कर रहे हैं।',
    trackOrderSteps: [
      'ऑर्डर प्राप्त हुआ',
      'फार्मासिस्ट द्वारा जांच',
      'डिलीवरी के लिए रवाना',
      'दवाएं पहुंच गईं',
    ],
  },
  en: {
    appName: 'Sanjivani AI',
    tagline: 'Healthcare that speaks your language',
    badgePrototype: 'Wispr Flow Prototype — Live Voice & AI',
    navHome: 'Home',
    navAssistant: 'Voice Assistant',
    navPrescription: 'Prescription',
    navFacilities: 'Care Finder',
    navEmergency: 'Emergency SOS',
    navOrder: 'Order Meds',
    textLargeToggle: 'Large Text',
    languageSelectLabel: 'Choose Language',

    greeting: 'Welcome to Sanjivani AI',
    greetingSub: 'Speak in your language, scan prescriptions, or locate verified care.',
    speakToSanjivaniTitle: 'Talk to Sanjivani',
    speakToSanjivaniDesc: 'Speak in Telugu, Hindi, or English. Get simple, safe guidance.',
    prescriptionTitle: 'Understand my prescription',
    prescriptionDesc: 'Photo capture, medicine extraction, and clear safety checks.',
    facilitiesTitle: 'Find hospitals & pharmacies',
    facilitiesDesc: 'Discover nearby PHCs, General Hospitals, and Jan Aushadhi stores.',
    emergencyTitle: 'Emergency SOS',
    emergencyDesc: 'Instant 108 ambulance dialing, GPS location link, and shake trigger.',
    orderTitle: 'Order Medicines',
    orderDesc: 'Simple grocery-style medicine ordering from nearby verified stores.',
    tapToSpeakPrompt: 'Tap microphone to speak...',
    listeningNow: 'Listening... speak clearly',
    emergencyBannerTitle: 'Experiencing severe symptoms?',
    emergencyBannerDesc: 'Do not wait. Dial 108 or activate the SOS button immediately.',
    disclaimerFoot: 'Disclaimer: Sanjivani AI provides healthcare guidance and navigation. It does not replace clinical consultation with a registered doctor or pharmacist.',

    assistantTitle: 'Multilingual Voice Assistant',
    assistantSubtitle: 'Ask in Telugu, Hindi, or English. Hear natural spoken guidance.',
    micTapToSpeak: 'Tap microphone to talk',
    micListening: 'Listening to your voice...',
    micProcessing: 'Thinking and formatting advice...',
    micSpeaking: 'Speaking answer aloud...',
    transcriptLabel: 'Recognized Voice Input:',
    transcriptEditHelp: 'Edit or retry if transcription misheard your words.',
    sendQuestion: 'Get Guidance',
    retryRecording: 'Speak Again',
    readAloud: 'Read Aloud',
    stopAudio: 'Stop Audio',
    repeatAudio: 'Repeat Voice',
    emergencyWarning: 'Warning: These symptoms require immediate medical attention. Reach casualty or dial 108.',
    sampleQuestionsTitle: 'Sample healthcare questions:',
    sampleQuestions: [
      'I have had a high fever and body aches for 2 days. What should I do?',
      'Where is the nearest Primary Health Centre (PHC) open today?',
      'Should Paracetamol 650mg be taken before or after meals?',
      'How do I use my Ayushman Bharat / Aarogyasri health scheme card?',
    ],
    clearChat: 'Clear Conversation',

    prescTitle: 'Prescription Understanding',
    prescSubtitle: 'Extract written medicines, dosage timings, and flag illegible handwriting.',
    uploadPhoto: 'Upload Photo',
    useCamera: 'Take with Camera',
    rotateImage: 'Rotate (90°)',
    retakeImage: 'Retake Photo',
    analyzePrescription: 'Analyze Prescription',
    analyzingPrescription: 'Extracting medicine text & safety checks...',
    samplePrescriptionButton: 'Load Sample Prescription (Instant Demo)',
    extractedMedicines: 'Identified Medicines & Dosing',
    verificationRequiredTitle: '⚠️ Pharmacist Verification Required',
    verificationRequiredDesc: 'Illegible handwriting is strictly flagged. Never take unconfirmed medications.',
    doctorClinicLabel: 'Doctor / Clinic:',
    patientLabel: 'Patient Info:',
    dateLabel: 'Date:',
    safeToTakeTag: 'Clearly Legible',
    verifyWithPharmacistTag: '⚠️ Needs Verification',
    addMedicinesToCart: 'Order These Medicines',

    facTitle: 'Nearby Healthcare Facilities',
    facSubtitle: 'Government hospitals, Primary Health Centres, and affordable pharmacies.',
    useMyLocation: 'Use My Current Location (GPS)',
    locatingUser: 'Acquiring GPS location...',
    searchTownPlaceholder: 'Town, Mandal or PIN code (e.g. Guntur, 522001)',
    searchButton: 'Search Area',
    filterAll: 'All Facilities',
    filterHospitals: 'Hospitals',
    filterPHC: 'PHCs (Primary Care)',
    filterPharmacies: 'Pharmacies',
    filterJanAushadhi: 'Jan Aushadhi (Generic)',
    filter24x7: '24/7 Emergency',
    callHospital: 'Call Hospital',
    getDirections: 'Get Directions',
    emergencyBadge: '24/7 Trauma & Ambulance',
    kmAway: 'km away',

    sosTitle: 'Emergency SOS',
    sosSubtitle: 'Immediate safety response and location transmission',
    countdownNotice: 'Emergency call initiating in seconds. Tap cancel if triggered by mistake.',
    cancelSOS: 'Cancel SOS',
    activateSOSImmediately: 'Activate SOS Now',
    calling108Ambulance: 'Dial 108 Ambulance',
    calling112National: 'Dial 112 National Helpline',
    calling104Helpline: 'Dial 104 Health Helpline',
    callingFamilyContact: 'Call Family Contact',
    emergencyLocationLabel: 'Your GPS Coordinates:',
    sendWhatsAppSOS: 'Share SOS via WhatsApp',
    sendSmsSOS: 'Send SOS via SMS',
    shakeToTriggerTitle: 'Shake to Trigger SOS',
    shakeToTriggerDesc: 'Quickly shake your device 3 times to automatically initiate the countdown.',
    testShakeButton: 'Test Shake Trigger (Demo)',
    shakeEnabled: 'Shake trigger enabled',
    shakeDisabled: 'Shake trigger disabled',
    honestEmergencyDisclaimer: 'Transparent Prototype Notice: This feature prepares direct calls to Indian emergency helplines and formats GPS links for WhatsApp/SMS. It does not automate municipal ambulance dispatch.',

    orderSubtitle: 'Blinkit-simple medicine ordering from trusted nearby pharmacies',
    searchMedicinePlaceholder: 'Search medicine name or tap mic...',
    searchMedicineVoice: 'Speak Medicine Name',
    categoryAll: 'All Essentials',
    categoryFever: 'Fever & Pain',
    categoryChronic: 'BP & Diabetes',
    categoryGeneric: 'Jan Aushadhi (Save 70%)',
    categoryFirstAid: 'First Aid & Dressing',
    addToCart: 'Add to Cart',
    inCart: 'In Cart',
    viewCart: 'View Bag',
    checkoutTitle: 'Delivery Details',
    patientNameLabel: 'Patient Name:',
    villageTownLabel: 'Village / Town / Mandal:',
    landmarkLabel: 'Landmark (e.g., Near Temple / Panchayat Office):',
    phoneNumberLabel: 'Contact Phone Number:',
    paymentMethodLabel: 'Payment Method:',
    cashOnDelivery: 'Cash on Delivery (Pay when received)',
    prescriptionStatusLabel: 'Prescription Status:',
    prescriptionAttachedNote: 'Prescription attached (Pharmacist will verify Rx)',
    placeOrderButton: 'Place Medicine Order',
    orderSuccessTitle: 'Order Confirmed!',
    orderSuccessDesc: 'Your nearby pharmacy has received your order.',
    trackOrderSteps: [
      'Order Received',
      'Pharmacist Verifying',
      'Out for Delivery',
      'Delivered Safely',
    ],
  },
};
