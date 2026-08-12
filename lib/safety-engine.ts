export interface SafetyEngineResult {
  triageLevel: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  summary: string;
  patientAdvice: string;
  symptomsDetected: string[];
  recommendedActions: string[];
  firstAidInstructions: string[];
  emergencyAlertTriggered: boolean;
}

// First-Aid Protocol Lookup Table
export const FIRST_AID_PROTOCOLS: Record<string, string[]> = {
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
};

// Deterministic Red-Flag Keywords Inspector
export function evaluateClinicalSafety(symptomsQuery: string, language: string = 'en'): SafetyEngineResult {
  const query = symptomsQuery.toLowerCase();

  // 1. Red-Flag Emergency Keywords (Deterministic Safety Engine)
  const isChestPain = /chest pain|chest pressure|jaw pain|left arm pain|heart attack|छाती में दर्द/i.test(query);
  const isBreathless = /shortness of breath|breath|gasping|cannot breathe|सांस/i.test(query);
  const isSevereBleeding = /bleeding|hemorrhage|blood loss|खून/i.test(query);
  const isUnconscious = /unconscious|fainting|stroke|paralysis|loss of speech|बेहोश/i.test(query);
  const isVenomousBite = /snake|scorpion|bite|sting|सांप/i.test(query);
  const isStiffNeckFever = /stiff neck|neck stiffness|altered mental|delirium/i.test(query);

  const isEmergencyTriggered = isChestPain || isBreathless || isSevereBleeding || isUnconscious || isVenomousBite || isStiffNeckFever;

  if (isEmergencyTriggered) {
    const detected: string[] = [];
    if (isChestPain) detected.push("Acute chest pain / pressure");
    if (isBreathless) detected.push("Severe dyspnea / breathing distress");
    if (isSevereBleeding) detected.push("Hemorrhagic bleeding risk");
    if (isUnconscious) detected.push("Altered consciousness / stroke sign");
    if (isVenomousBite) detected.push("Venomous bite / sting exposure");
    if (isStiffNeckFever) detected.push("Meningeal irritation / high fever");

    let firstAid = FIRST_AID_PROTOCOLS.CARDIAC;
    if (isVenomousBite) firstAid = FIRST_AID_PROTOCOLS.SNAKE_BITE;
    else if (isSevereBleeding) firstAid = FIRST_AID_PROTOCOLS.BLEEDING;
    else if (isUnconscious) firstAid = FIRST_AID_PROTOCOLS.STROKE;

    return {
      triageLevel: 'EMERGENCY',
      summary: `CRITICAL SAFETY ALERT: Patient presents with high-risk emergency symptoms (${detected.join(', ')}). Immediate 108 ambulance dispatch and PHC emergency alert activated.`,
      patientAdvice: "CRITICAL: Rest immediately. Do not exert yourself or walk. Help is being dispatched right now.",
      symptomsDetected: detected,
      recommendedActions: [
        "Call 108 Ambulance immediately or transport to nearest District Hospital ICU",
        "Alert local ASHA Health Worker for emergency oxygen and stretcher standby",
        "Keep emergency contact phone line open"
      ],
      firstAidInstructions: firstAid,
      emergencyAlertTriggered: true
    };
  }

  // 2. Urgent Condition Keywords
  const isUrgent = /fever|chills|vomit|diarrhea|dengue|malaria|abdominal pain|bukhar|बुखार/i.test(query);
  if (isUrgent) {
    return {
      triageLevel: 'URGENT',
      summary: "URGENT CLINICAL EVALUATION: Patient presents with acute symptomatic fever/gastrointestinal distress. Requires same-day PHC tele-consultation.",
      patientAdvice: "Drink plenty of ORS or boiled lukewarm water. Rest in a well-ventilated area and avoid heavy food.",
      symptomsDetected: ["High fever / chills", "Systemic discomfort"],
      recommendedActions: [
        "Schedule tele-consultation with PHC Medical Officer today",
        "Get Rapid Diagnostic Test (RDT) for Malaria & Dengue at nearest Anganwadi"
      ],
      firstAidInstructions: FIRST_AID_PROTOCOLS.FEVER,
      emergencyAlertTriggered: false
    };
  }

  // 3. Routine Condition
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
