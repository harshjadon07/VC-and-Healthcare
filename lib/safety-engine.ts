export interface SafetyEngineResult {
  triageLevel: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  summary: string;
  patientAdvice: string;
  symptomsDetected: string[];
  recommendedActions: string[];
  firstAidInstructions: string[];
  emergencyAlertTriggered: boolean;
}

export type SupportedLang = 'en' | 'hi' | 'mr' | 'ta';

// Multilingual First-Aid Protocol Lookup Table
export const FIRST_AID_PROTOCOLS: Record<SupportedLang, Record<string, string[]>> = {
  en: {
    CARDIAC: [
      "Loosen tight clothing around neck, waist, and chest",
      "Keep patient seated in an upright, comfortable position",
      "Do not give solid food, water, or coffee",
      "Monitor pulse and SpO2 continuously while waiting for ambulance"
    ],
    BLEEDING: [
      "Apply direct pressure to wound using clean cloth or bandage",
      "Elevate injured limb above heart level if no fracture is suspected",
      "Keep patient warm with a blanket to prevent hemorrhagic shock"
    ],
    SNAKE_BITE: [
      "Keep patient completely still; immobilize bitten limb below heart level",
      "DO NOT cut wound, suck venom, or apply tight tourniquet",
      "Remove rings, watches, or tight clothes before swelling occurs",
      "Transport immediately to nearest PHC for anti-snake venom (ASV)"
    ],
    STROKE: [
      "Note exact time symptoms started (FAST test)",
      "Lay patient on side (recovery position) if vomiting occurs",
      "Do not give any oral medicine, food, or liquid"
    ],
    FEVER: [
      "Apply damp tepid cloth on forehead, neck, and armpits",
      "Administer Oral Rehydration Salts (ORS) in small frequent sips",
      "Keep room well ventilated"
    ]
  },
  hi: {
    CARDIAC: [
      "गर्दन, कमर और छाती के पास के कसे कपड़ों को ढीला करें",
      "मरीज़ को सीधा और आरामदायक स्थिति में बैठाएं",
      "मरीज़ को खाना, पानी या चाय-कॉफी न दें",
      "एम्बुलेंस आने तक सांस और नाड़ी पर ध्यान रखें"
    ],
    BLEEDING: [
      "घाव पर साफ कपड़े या पट्टी से सीधा दबाव बनाएं",
      "चोट लगे अंग को हृदय के स्तर से ऊपर उठाएं",
      "मरीज़ को गर्म कपड़े या कंबल से ढककर रखें"
    ],
    SNAKE_BITE: [
      "मरीज़ को बिल्कुल शांत रखें; काटे गए अंग को हिलाएं-डुलायें नहीं",
      "घाव को न काटें, ज़हर न चूसें और न ही कसकर बांधें",
      "अंगूठी, घड़ी या कसे कपड़े तुरंत उतार दें",
      "तुरंत नजदीकी स्वास्थ्य केंद्र (PHC) ले जाएं"
    ],
    STROKE: [
      "लक्षण शुरू होने का सही समय नोट करें",
      "उल्टी होने पर मरीज़ को करवट के बल लिटाएं",
      "मरीज़ को मुंह से कुछ भी खाने-पीने न दें"
    ],
    FEVER: [
      "माथे, गर्दन और बगल पर ठंडे पानी की पट्टियां रखें",
      "ओआरएस (ORS) या उबला पानी थोड़ा-थोड़ा करके पिलाएं",
      "कमरे को हवादार रखें"
    ]
  },
  mr: {
    CARDIAC: [
      "मान, कंबर आणि छातीजवळील घट्ट कपडे सैल करा",
      "रुग्णाला सरळ आणि आरामदायी स्थितीत बसवा",
      "रुग्णाला अन्न, पाणी किंवा चहा-कॉफी देऊ नका",
      "रुग्णवाहिका येईपर्यंत नाडी व श्वासोच्छवासावर लक्ष ठेवा"
    ],
    BLEEDING: [
      "जखमेवर स्वच्छ कपड्याने थेट दाब द्या",
      "दुखापत झालेला भाग हृदयाच्या पातळीपेक्षा वर उचला",
      "रुग्णाला उबदार कपड्याने झाकून ठेवा"
    ],
    SNAKE_BITE: [
      "रुग्णाला पूर्णपणे शांत ठेवा; चावलेला भाग हालवू नका",
      "जखमेवर काप देऊ नका, विष चोखू नका आणि घट्ट बांधू नका",
      "अंगठी, घड्याळ किंवा घट्ट कपडे ताबडतोब काढा",
      "त्वरित जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) घेऊन जा"
    ],
    STROKE: [
      "लक्षणे सुरू झाल्याची वेळ नोंदवा",
      "उलटी होत असल्यास रुग्णाला एका कुशीवर झोपवा",
      "तोडाने काहीही खाणे-पिणे देऊ नका"
    ],
    FEVER: [
      "कपाळावर, मानेवर आणि काखेत मिठाच्या/थंड पाण्याच्या पट्ट्या ठेवा",
      "ओआरएस (ORS) किंवा उकळलेले पाणी थोडे थोडे प्यायला द्या",
      "खोली हवेशीर ठेवा"
    ]
  },
  ta: {
    CARDIAC: [
      "கழுத்து மற்றும் மார்பைச் சுற்றியுள்ள இறுக்கமான ஆடைகளைத் தளர்த்தவும்",
      "நோயாளியை வசதியான நிலையில் உட்கார வைக்கவும்",
      "உணவு அல்லது தண்ணீர் கொடுக்க வேண்டாம்",
      "ஆம்புலன்ஸ் வரும் வரை நாடித்துடிப்பைக் கண்காணிக்கவும்"
    ],
    BLEEDING: [
      "சுத்தமான துணியால் காயத்தின் மீது நேரடியாக அழுத்தம் கொடுக்கவும்",
      "காயமடைந்த பகுதியை இதய மட்டத்திற்கு மேலே உயர்த்தவும்",
      "நோயாளியை கதகதப்பாக வைக்கவும்"
    ],
    SNAKE_BITE: [
      "நோயாளியை அசைக்காமல் அமைதியாக வைக்கவும்",
      "காயத்தை வெட்டவோ, விஷத்தை உறிஞ்சவோ வேண்டாம்",
      "மோதிரம், கடிகாரம் போன்றவற்றை உடனே அகற்றவும்",
      "உடனடியாக அருகில் உள்ள ஆரம்ப சுகாதார நிலையத்திற்கு அழைத்துச் செல்லவும்"
    ],
    STROKE: [
      "அறிகுறிகள் தொடங்கிய நேரத்தைக் குறிக்கவும்",
      "வாந்தி எடுத்தால் நோயாளியை ஒருபுறமாக படுக்க வைக்கவும்",
      "வாயில் எதுவும் கொடுக்க வேண்டாம்"
    ],
    FEVER: [
      "நெற்றியில் குளிர்ந்த நீர் துணியை வைக்கவும்",
      "ORS அல்லது கொதித்த நீரைக் கொடுக்கவும்",
      "அறையை காற்றோட்டமாக வைக்கவும்"
    ]
  }
};

// Deterministic Red-Flag Keywords Inspector
export function evaluateClinicalSafety(symptomsQuery: string, langInput: string = 'en'): SafetyEngineResult {
  const query = symptomsQuery.toLowerCase();
  const lang: SupportedLang = (['en', 'hi', 'mr', 'ta'].includes(langInput) ? langInput : 'en') as SupportedLang;

  // 1. Red-Flag Emergency Keywords
  const isChestPain = /chest pain|chest pressure|jaw pain|left arm pain|heart attack|छाती|छातीत दर्द|मார்பு வலி/i.test(query);
  const isBreathless = /shortness of breath|breath|gasping|cannot breathe|सांस|श्वास|மூச்சுத்திணறல்/i.test(query);
  const isSevereBleeding = /bleeding|hemorrhage|blood loss|खून|रक्त|இரத்தம்/i.test(query);
  const isUnconscious = /unconscious|fainting|stroke|paralysis|loss of speech|बेहोश|बेशुद्ध|மயக்கம்/i.test(query);
  const isVenomousBite = /snake|scorpion|bite|sting|सांप|साप|பாம்பு/i.test(query);
  const isStiffNeckFever = /stiff neck|neck stiffness|delirium/i.test(query);

  const isEmergencyTriggered = isChestPain || isBreathless || isSevereBleeding || isUnconscious || isVenomousBite || isStiffNeckFever;

  if (isEmergencyTriggered) {
    let firstAidKey = 'CARDIAC';
    if (isVenomousBite) firstAidKey = 'SNAKE_BITE';
    else if (isSevereBleeding) firstAidKey = 'BLEEDING';
    else if (isUnconscious) firstAidKey = 'STROKE';

    const firstAid = FIRST_AID_PROTOCOLS[lang][firstAidKey] || FIRST_AID_PROTOCOLS.en.CARDIAC;

    if (lang === 'hi') {
      return {
        triageLevel: 'EMERGENCY',
        summary: "गंभीर आपातकालीन चेतावनी: मरीज़ में गंभीर आपातकालीन लक्षण दिखाई दिए हैं। तुरंत 108 एम्बुलेंस और अस्पताल को अलर्ट भेजा गया है।",
        patientAdvice: "अति आवश्यक: तुरंत आराम करें। बिल्कुल भी न चलें। सहायता तुरंत भेजी जा रही है। 108 डायल करें।",
        symptomsDetected: ["गंभीर आपातकालीन लक्षण", "हृदय / सांस / चोट संबंधी खतरा"],
        recommendedActions: [
          "तुरंत 108 एम्बुलेंस बुलाएं या नजदीकी अस्पताल के आईसीयू में जाएं",
          "स्थानीय आशा स्वास्थ्य कार्यकर्ता को आपातकालीन ऑक्सीजन के लिए सूचित करें",
          "आपातकालीन फोन नंबर को चालू रखें"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: true
      };
    }

    if (lang === 'mr') {
      return {
        triageLevel: 'EMERGENCY',
        summary: "गंभीर आणीबाणी इशारा: रुग्णामध्ये गंभीर आणीबाणीची लक्षणे आढळली आहेत. त्वरित 108 रुग्णवाहिका आणि आरोग्य केंद्राला संदेश पाठवला आहे.",
        patientAdvice: "अत्यंत महत्त्वाचे: ताबडतोब विश्रांती घ्या. अजिबात चालू नका. मदत लगेच पाठवली जात आहे. 108 वर कॉल करा.",
        symptomsDetected: ["गंभीर आणीबाणी लक्षणे", "हृदय / श्वास / दुखापत धोका"],
        recommendedActions: [
          "त्वरित 108 ॲम्ब्युलन्स बोलवा किंवा जवळच्या रुग्णालयात जा",
          "स्थानिक आशा आरोग्य सेविकेला तात्काळ सूचित करा",
          "फोन संपर्क चालू ठेवा"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: true
      };
    }

    if (lang === 'ta') {
      return {
        triageLevel: 'EMERGENCY',
        summary: "அவசர சுகாதார எச்சரிக்கை: நோயாளிக்கு கடுமையான அவசர அறிகுறிகள் உள்ளன. உடனடியாக 108 ஆம்புலன்ஸ் எச்சரிக்கை அனுப்பப்பட்டது.",
        patientAdvice: "மிக முக்கியம்: உடனடியாக ஓய்வெடுக்கவும். நடப்பதைத் தவிர்க்கவும். உதவி உடனே அனுப்பப்படுகிறது. 108 ஐ அழைக்கவும்.",
        symptomsDetected: ["கடுமையான அவசர அறிகுறிகள்", "இதயம் / மூச்சு ஆபத்து"],
        recommendedActions: [
          "உடனடியாக 108 ஆம்புலன்ஸை அழைக்கவும்",
          "அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்",
          "ஆஷா பணியாளரைத் தொடர்பு கொள்ளவும்"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: true
      };
    }

    // Default English
    return {
      triageLevel: 'EMERGENCY',
      summary: "CRITICAL SAFETY ALERT: Patient presents with high-risk emergency symptoms. Immediate 108 ambulance dispatch and PHC emergency alert activated.",
      patientAdvice: "CRITICAL: Rest immediately. Do not exert yourself or walk. Help is being dispatched right now. Call 108.",
      symptomsDetected: ["Acute Emergency Symptoms", "Cardiac / Dyspnea / Severe Trauma Risk"],
      recommendedActions: [
        "Call 108 Ambulance immediately or transport to nearest District Hospital ICU",
        "Alert local ASHA Health Worker for emergency oxygen standby",
        "Keep emergency contact phone line open"
      ],
      firstAidInstructions: firstAid,
      emergencyAlertTriggered: true
    };
  }

  // 2. Urgent Condition Keywords
  const isUrgent = /fever|chills|vomit|diarrhea|dengue|malaria|abdominal pain|bukhar|बुखार|ताप|कफ|காய்ச்சல்/i.test(query);
  if (isUrgent) {
    const firstAid = FIRST_AID_PROTOCOLS[lang].FEVER;

    if (lang === 'hi') {
      return {
        triageLevel: 'URGENT',
        summary: "तत्काल चिकित्सा परामर्श: मरीज़ को बुखार, ठंड लगना या पेट की समस्या है। आज ही डॉक्टर से परामर्श लें।",
        patientAdvice: "ओआरएस (ORS) या उबला हुआ गुनगुना पानी पीते रहें। हवादार जगह पर आराम करें और हल्का भोजन लें।",
        symptomsDetected: ["तेज बुखार / ठंड लगना", "शरीर में बेचैनी"],
        recommendedActions: [
          "आज ही प्राथमिक स्वास्थ्य केंद्र के डॉक्टर से परामर्श लें",
          "मलेरिया और डेंगू की जांच (RDT) निकटतम आंगनवाड़ी या स्वास्थ्य केंद्र पर कराएं"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: false
      };
    }

    if (lang === 'mr') {
      return {
        triageLevel: 'URGENT',
        summary: "तातडीचा वैद्यकीय सल्ला: रुग्णाला ताप, थंडी किंवा पोटाचा त्रास आहे. आजच डॉक्टरांचा सल्ला घ्या.",
        patientAdvice: "ओआरएस (ORS) किंवा उकळलेले कोमट पाणी प्या. हवेशीर जागी विश्रांती घ्या व हलका आहार घ्या.",
        symptomsDetected: ["ताप / थंडी वाजणे", "शारीरिक अस्वस्थता"],
        recommendedActions: [
          "आजच प्राथमिक आरोग्य केंद्राच्या डॉक्टरांशी संपर्क साधा",
          "मलेरिया व डेंग्यूची तपासणी जवळच्या आरोग्य केंद्रात करा"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: false
      };
    }

    if (lang === 'ta') {
      return {
        triageLevel: 'URGENT',
        summary: "அவசர மருத்துவ மதிப்பீடு: நோயாளிக்கு காய்ச்சல் அல்லது வயிற்றுப் பிரச்சனை உள்ளது. இன்றே மருத்துவரை அணுகவும்.",
        patientAdvice: "ORS அல்லது கொதிக்கவைத்த மிதமான நீரைக் குடிக்கவும். காற்றோட்டமான இடத்தில் ஓய்வெடுக்கவும்.",
        symptomsDetected: ["அதிக காய்ச்சல்", "உடல் அசதி"],
        recommendedActions: [
          "இன்றே ஆரம்ப சுகாதார நிலைய மருத்துவரை அணுகவும்",
          "மலேரியா மற்றும் டெங்கு பரிசோதனை செய்யவும்"
        ],
        firstAidInstructions: firstAid,
        emergencyAlertTriggered: false
      };
    }

    return {
      triageLevel: 'URGENT',
      summary: "URGENT CLINICAL EVALUATION: Patient presents with acute symptomatic fever/gastrointestinal distress. Requires same-day PHC tele-consultation.",
      patientAdvice: "Drink plenty of ORS or boiled lukewarm water. Rest in a well-ventilated area and avoid heavy food.",
      symptomsDetected: ["High fever / chills", "Systemic discomfort"],
      recommendedActions: [
        "Schedule tele-consultation with PHC Medical Officer today",
        "Get Rapid Diagnostic Test (RDT) for Malaria & Dengue at nearest Anganwadi"
      ],
      firstAidInstructions: firstAid,
      emergencyAlertTriggered: false
    };
  }

  // 3. Routine Condition
  if (lang === 'hi') {
    return {
      triageLevel: 'ROUTINE',
      summary: "सामान्य स्वास्थ्य जांच: मरीज़ में हल्के लक्षण हैं। सामान्य देखरेख की सलाह दी जाती है।",
      patientAdvice: "पर्याप्त पानी पीते रहें, पौष्टिक आहार लें और अगले 48 घंटे तक लक्षणों पर ध्यान दें।",
      symptomsDetected: ["हल्के लक्षण"],
      recommendedActions: [
        "यदि लक्षण 3 दिन से अधिक रहते हैं तो स्वास्थ्य केंद्र जाएं",
        "पर्याप्त आराम करें और संतुलित भोजन लें"
      ],
      firstAidInstructions: [
        "प्रतिदिन 2-3 लीटर साफ पानी पीएं",
        "पर्याप्त आराम करें"
      ],
      emergencyAlertTriggered: false
    };
  }

  if (lang === 'mr') {
    return {
      triageLevel: 'ROUTINE',
      summary: "सामान्य आरोग्य तपासणी: रुग्णामध्ये सौम्य लक्षणे आहेत. रोजची काळजी घेण्याचा सल्ला दिला जातो.",
      patientAdvice: "भरपूर पाणी प्या, पौष्टिक आहार घ्या आणि पुढील 48 तास लक्षणांवर लक्ष ठेवा.",
      symptomsDetected: ["सौम्य लक्षणे"],
      recommendedActions: [
        "लक्षणे ३ दिवसांपेक्षा जास्त राहिल्यास आरोग्य केंद्राला भेट द्या",
        "योग्य विश्रांती आणि संतुलित आहार घ्या"
      ],
      firstAidInstructions: [
        "रोज २-३ लिटर स्वच्छ पाणी प्या",
        "योग्य विश्रांती घ्या"
      ],
      emergencyAlertTriggered: false
    };
  }

  if (lang === 'ta') {
    return {
      triageLevel: 'ROUTINE',
      summary: "சாதாரண மருத்துவ பரிசோதனை: நோயாளிக்கு லேசான அறிகுறிகள் உள்ளன. சாதாரண பராமரிப்பு பரிந்துரைக்கப்படுகிறது.",
      patientAdvice: "போதிய அளவு தண்ணீர் குடிக்கவும், சத்தான உணவை உட்கொள்ளவும், 48 மணிநேரம் அறிகுறிகளைக் கண்காணிக்கவும்.",
      symptomsDetected: ["லேசான அறிகுறிகள்"],
      recommendedActions: [
        "அறிகுறிகள் நீடித்தால் சுகாதார மையத்திற்குச் செல்லவும்",
        "சீரான ஓய்வு பெறவும்"
      ],
      firstAidInstructions: [
        "தினமும் 2-3 லிட்டர் நீர் குடிக்கவும்",
        "நன்கு ஓய்வெடுக்கவும்"
      ],
      emergencyAlertTriggered: false
    };
  }

  return {
    triageLevel: 'ROUTINE',
    summary: "ROUTINE ASSESSMENT: Patient reports mild, non-emergency symptoms. Routine health monitoring advised.",
    patientAdvice: "Maintain adequate hydration, eat balanced meals, and monitor symptoms over the next 48 hours.",
    symptomsDetected: ["Mild non-acute symptoms"],
    recommendedActions: [
      "Visit PHC routine outpatient clinic if symptoms persist longer than 3 days",
      "Ensure regular rest and balanced nutrition"
    ],
    firstAidInstructions: [
      "Drink 2-3 liters of clean water daily",
      "Rest adequately"
    ],
    emergencyAlertTriggered: false
  };
}
