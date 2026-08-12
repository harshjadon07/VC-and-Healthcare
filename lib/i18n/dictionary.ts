export type Language = 'en' | 'hi' | 'mr' | 'ta';

export interface Translations {
  appName: string;
  appTagline: string;
  languageLabel: string;
  talkToAi: string;
  loginRegister: string;
  navHome: string;
  navPatient: string;
  navHealthWorker: string;
  navDoctor: string;
  heroTitle: string;
  heroSubtitle: string;
  patientDashboard: string;
  healthWorkerDashboard: string;
  doctorDashboard: string;
  emergencyBanner: string;
  emergencyCall: string;
  riskMapTitle: string;
  riskMapSubtitle: string;
  aiAssistantCard: string;
  aiAssistantDesc: string;
  bookAppointmentCard: string;
  bookAppointmentDesc: string;
  familyRecordsCard: string;
  familyRecordsDesc: string;
  emergencyCard: string;
  emergencyDesc: string;
  statsTodayPatients: string;
  statsWaiting: string;
  statsEmergencyAlerts: string;
  statsDoctorConsults: string;
  patientQueueTitle: string;
  patientName: string;
  ageGender: string;
  village: string;
  chiefComplaint: string;
  triageStatus: string;
  actions: string;
  todaySchedule: string;
  patientDetails: string;
  vitals: string;
  aiSummaryTitle: string;
  startConsultation: string;
  prescription: string;
}

export const dictionaries: Record<Language, Translations> = {
  en: {
    appName: "SevaHealth",
    appTagline: "Rural Health AI Telemedicine Platform",
    languageLabel: "Language / भाषा / भाषा / भाषा",
    talkToAi: "Talk to AI Health Assistant",
    loginRegister: "Login / Register",
    navHome: "Home",
    navPatient: "Patient Portal",
    navHealthWorker: "Health Worker (ASHA)",
    navDoctor: "Doctor Portal",
    heroTitle: "Quality Healthcare for Every Rural Community",
    heroSubtitle: "Instant AI Triage, Community Worker Queue, and Direct Telemedicine Doctor Consultations in your local language.",
    patientDashboard: "Patient Healthcare Dashboard",
    healthWorkerDashboard: "ASHA Health Worker Command Center",
    doctorDashboard: "Rural Tele-Consultation Hub",
    emergencyBanner: "Medical Emergency Hotline available 24/7. In immediate danger, call 108 or tap emergency button.",
    emergencyCall: "Call Ambulance (108)",
    riskMapTitle: "Regional Disease Risk Map & Alerts",
    riskMapSubtitle: "Live surveillance of endemic outbreaks, seasonal fever spikes, and preventive guidelines in your district.",
    aiAssistantCard: "AI Health Assistant",
    aiAssistantDesc: "Describe symptoms in plain text or regional voice to receive instant triage guidance & clinical summary.",
    bookAppointmentCard: "Book Appointment",
    bookAppointmentDesc: "Schedule a tele-consultation with verified rural specialist doctors or local PHC health worker.",
    familyRecordsCard: "Family Records",
    familyRecordsDesc: "Digital ABHA health identity, immunization logs, lab reports, and historic prescriptions.",
    emergencyCard: "Emergency SOS",
    emergencyDesc: "Direct alert dispatch to nearest ASHA worker, PHC medical officer, and local emergency response.",
    statsTodayPatients: "Today's Patients",
    statsWaiting: "Waiting for Triage",
    statsEmergencyAlerts: "Emergency Alerts",
    statsDoctorConsults: "Active Consultations",
    patientQueueTitle: "Community Patient Triage Queue",
    patientName: "Patient Name",
    ageGender: "Age / Gender",
    village: "Village / Gram",
    chiefComplaint: "Chief Complaint",
    triageStatus: "Triage Level",
    actions: "Actions",
    todaySchedule: "Today's Appointment Queue",
    patientDetails: "Patient Clinical Detail Panel",
    vitals: "Vitals & Biometrics",
    aiSummaryTitle: "AI Clinical Triage Summary",
    startConsultation: "Start Video/Tele Consultation",
    prescription: "Issue E-Prescription"
  },
  hi: {
    appName: "सेवा हेल्थ (SevaHealth)",
    appTagline: "ग्रामीण स्वास्थ्य एआई टेलीमेडिसिन मंच",
    languageLabel: "भाषा चुनें",
    talkToAi: "एआई स्वास्थ्य सहायक से बात करें",
    loginRegister: "लॉगिन / पंजीकरण",
    navHome: "मुख्य पृष्ठ",
    navPatient: "मरीज़ पोर्टल",
    navHealthWorker: "स्वास्थ्य कार्यकर्ता (आशा)",
    navDoctor: "डॉक्टर पोर्टल",
    heroTitle: "हर ग्रामीण समुदाय के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा",
    heroSubtitle: "त्वरित एआई ट्राइएज, आशा कार्यकर्ता कतार, और अपनी भाषा में डॉक्टरों से सीधी सलाह।",
    patientDashboard: "मरीज़ स्वास्थ्य डैशबोर्ड",
    healthWorkerDashboard: "आशा स्वास्थ्य कार्यकर्ता कमांड सेंटर",
    doctorDashboard: "ग्रामीण टेली-परामर्श केंद्र",
    emergencyBanner: "आपातकालीन नंबर 108 पर संपर्क करें। आपात स्थिति में तुरंत सहायता प्राप्त करें।",
    emergencyCall: "एम्बुलेंस 108 डायल करें",
    riskMapTitle: "क्षेत्रीय बीमारी जोखिम मानचित्र एवं चेतावनी",
    riskMapSubtitle: "आपके जिले में मौसमी बुखार, डेंगू, और संक्रामक बीमारियों की लाइव निगरानी।",
    aiAssistantCard: "एआई स्वास्थ्य सहायक",
    aiAssistantDesc: "अपनी भाषा में लक्षण बताएं और तुरंत सलाह व रिपोर्ट प्राप्त करें।",
    bookAppointmentCard: "डॉक्टर अपॉइंटमेंट बुक करें",
    bookAppointmentDesc: "प्राथमिक स्वास्थ्य केंद्र या विशेषज्ञ डॉक्टरों के साथ टेली-परामर्श तय करें।",
    familyRecordsCard: "परिवार स्वास्थ्य रिकॉर्ड",
    familyRecordsDesc: "डिजिटल स्वास्थ्य कार्ड, टीकाकरण रिकॉर्ड और पिछली दवा पर्चियां।",
    emergencyCard: "आपातकालीन सहायता (SOS)",
    emergencyDesc: "निकटतम आशा कार्यकर्ता और अस्पताल को तुरंत आपातकालीन अलर्ट भेजें।",
    statsTodayPatients: "आज के कुल मरीज़",
    statsWaiting: "प्रतीक्षारत ट्राइएज",
    statsEmergencyAlerts: "आपातकालीन अलर्ट",
    statsDoctorConsults: "सक्रिय डॉक्टर परामर्श",
    patientQueueTitle: "समुदाय मरीज़ ट्राइएज कतार",
    patientName: "मरीज़ का नाम",
    ageGender: "आयु / लिंग",
    village: "गांव / ग्राम",
    chiefComplaint: "मुख्य समस्या",
    triageStatus: "प्राथमिकता स्तर",
    actions: "कार्रवाई",
    todaySchedule: "आज की अपॉइंटमेंट सूची",
    patientDetails: "मरीज़ का नैदानिक विवरण",
    vitals: "शारीरिक मापदंड (Vitals)",
    aiSummaryTitle: "एआई क्लिनिकल ट्राइएज सारांश",
    startConsultation: "टेली-परामर्श शुरू करें",
    prescription: "ई-दवा पर्ची जारी करें"
  },
  mr: {
    appName: "सेवा हेल्थ (SevaHealth)",
    appTagline: "ग्रामीण आरोग्य एआय टेलिमेडिसिन प्लॅटफॉर्म",
    languageLabel: "भाषा निवडा",
    talkToAi: "एआय आरोग्य सहाय्यकाशी बोला",
    loginRegister: "लॉगिन / नोंदणी",
    navHome: "मुख्य पृष्ठ",
    navPatient: "रुग्ण पोर्टल",
    navHealthWorker: "आरोग्य सेविका (आशा)",
    navDoctor: "डॉक्टर पोर्टल",
    heroTitle: "प्रत्येक ग्रामीण कुटुंबासाठी गुणवत्तापूर्ण आरोग्य सेवा",
    heroSubtitle: "त्वरित एआय तपासणी, आशा कार्यकर्त्यांची यादी आणि डॉक्टरांशी थेट संवाद.",
    patientDashboard: "रुग्ण आरोग्य डैशबोर्ड",
    healthWorkerDashboard: "आशा आरोग्य केंद्र",
    doctorDashboard: "ग्रामीण टेलि-सल्ला केंद्र",
    emergencyBanner: "वैद्यकीय आणीबाणीसाठी 108 वर कॉल करा.",
    emergencyCall: "ॲम्ब्युलन्स 108 कॉल करा",
    riskMapTitle: "प्रादेशिक आजार धोका नकाशा",
    riskMapSubtitle: "तुमच्या तालुक्यातील साथीच्या आजारांची थेट माहिती व प्रतिबंधात्मक उपाय.",
    aiAssistantCard: "एआय आरोग्य सहाय्यक",
    aiAssistantDesc: "आपल्या भाषेत लक्षणे सांगा आणि त्वरित वैद्यकीय सल्ला मिळवा.",
    bookAppointmentCard: "डॉक्टर अपॉइंटमेंट बुक करा",
    bookAppointmentDesc: "तज्ज्ञ डॉक्टरांसोबत व्हिडिओ किंवा फोनवर वैद्यकीय सल्ला घ्या.",
    familyRecordsCard: "कुटुंब आरोग्य नोंदी",
    familyRecordsDesc: "डिजिटल आरोग्य कार्ड, लसीकरण नोंदी व औषधांच्या चिठ्ठ्या.",
    emergencyCard: "आणीबाणी अलर्ट",
    emergencyDesc: "जवळच्या आशा सेविका आणि प्राथमिक आरोग्य केंद्राला थेट संदेश पाठवा.",
    statsTodayPatients: "आजचे एकूण रुग्ण",
    statsWaiting: "प्रतीक्षेतील रुग्ण",
    statsEmergencyAlerts: "आणीबाणी इशारे",
    statsDoctorConsults: "सुरू असलेले सल्लामसलत",
    patientQueueTitle: "ग्राम रुग्ण ट्राइएज यादी",
    patientName: "रुग्णाचे नाव",
    ageGender: "वय / लिंग",
    village: "गाव / वाडी",
    chiefComplaint: "मुख्य तक्रार",
    triageStatus: "प्राधान्य स्तर",
    actions: "कृती",
    todaySchedule: "आजची अपॉइंटमेंट यादी",
    patientDetails: "रुग्णाचे सविस्तर माहिती",
    vitals: "शरीर स्थिती (Vitals)",
    aiSummaryTitle: "एआय क्लिनिकल सारांश",
    startConsultation: "सल्लामसलत सुरू करा",
    prescription: "ई-औषध चिठ्ठी द्या"
  },
  ta: {
    appName: "சேவா ஹெல்த் (SevaHealth)",
    appTagline: "கிராமப்புற சுகாதார AI தளம்",
    languageLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
    talkToAi: "AI சுகாதார உதவியாளரிடம் பேசுங்கள்",
    loginRegister: "உள்நுழைவு / பதிவு",
    navHome: "முகப்பு",
    navPatient: "நோயாளி போர்டல்",
    navHealthWorker: "சுகாதாரப் பணியாளர் (ஆஷா)",
    navDoctor: "மருத்துவர் போர்டல்",
    heroTitle: "ஒவ்வொரு கிராமப்புற சமூகத்திற்கும் தரமான சுகாதாரம்",
    heroSubtitle: "உடனடி AI பரிசோதனை, ஆஷா பணியாளர் வரிசை மற்றும் நேரடி மருத்துவர் ஆலோசனை.",
    patientDashboard: "நோயாளி சுகாதார டாஷ்போர்டு",
    healthWorkerDashboard: "ஆஷா சுகாதார மையக் கட்டுப்பாட்டு அறை",
    doctorDashboard: "கிராமப்புற தொலை மருத்துவ மையம்",
    emergencyBanner: "அவசர உதவிக்கு 108 ஐ அழைக்கவும்.",
    emergencyCall: "ஆம்புலன்ஸ் 108 அழைக்கவும்",
    riskMapTitle: "பிராந்திய நோய் அபாய வரைபடம்",
    riskMapSubtitle: "உங்கள் மாவட்டத்தில் உள்ள நோய்கள் பற்றிய நேரடி எச்சரிக்கைகள்.",
    aiAssistantCard: "AI சுகாதார உதவியாளர்",
    aiAssistantDesc: "உங்கள் மொழியில் அறிகுறிகளைக் கூறி உடனடி ஆலோசனை பெறுங்கள்.",
    bookAppointmentCard: "மருத்துவர் முன்பதிவு",
    bookAppointmentDesc: "சிறப்பு மருத்துவர்களுடன் தொலை மருத்துவ ஆலோசனை பெறவும்.",
    familyRecordsCard: "குடும்ப மருத்துவப் பதிவுகள்",
    familyRecordsDesc: "டிஜிட்டல் சுகாதார அட்டை மற்றும் தடுப்பூசி பதிவுகள்.",
    emergencyCard: "அவசர உதவி (SOS)",
    emergencyDesc: "அருகிலுள்ள ஆஷா பணியாளருக்கு உடனடி எச்சரிக்கை அனுப்பவும்.",
    statsTodayPatients: "இன்றைய நோயாளிகள்",
    statsWaiting: "காத்திருப்போர்",
    statsEmergencyAlerts: "அவசர எச்சரிக்கைகள்",
    statsDoctorConsults: "செயலில் உள்ள ஆலோசனைகள்",
    patientQueueTitle: "கிராமப்புற நோயாளி வரிசை",
    patientName: "நோயாளி பெயர்",
    ageGender: "வயது / பாலினம்",
    village: "கிராமம்",
    chiefComplaint: "முக்கிய பிரச்சனை",
    triageStatus: "முன்னுரிமை நிலை",
    actions: "செயல்கள்",
    todaySchedule: "இன்றைய முன்பதிவு வரிசை",
    patientDetails: "நோயாளி விவரங்கள்",
    vitals: "உடல் அளவீடுகள் (Vitals)",
    aiSummaryTitle: "AI மருத்துவ சுருக்கம்",
    startConsultation: "ஆலோசனையைத் தொடங்குங்கள்",
    prescription: "மின்-மருந்துச் சீட்டு"
  }
};
