export interface MockPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  district: string;
  phone: string;
  chiefComplaint: string;
  triageLevel: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING';
  dateTime: string;
  vitals: {
    bp: string;
    temp: string;
    heartRate: string;
    spo2: string;
  };
  aiSummary: string;
  symptoms: string[];
  patientAdvice: string;
  recommendedActions: string[];
  firstAidInstructions?: string[];
  emergencyAlertTriggered: boolean;
  history: string[];
}

export interface RiskAlertData {
  id: string;
  region: string;
  district: string;
  disease: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Outbreak';
  symptoms: string[];
  prevention: string[];
  affectedCount: number;
  updatedAt: string;
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "PAT-101",
    name: "Ramesh Patil (रमेश पाटील)",
    age: 52,
    gender: "Male",
    village: "Khed Shivapur",
    district: "Pune",
    phone: "+91 98223 45678",
    chiefComplaint: "Acute chest pressure with pain radiating down left arm & dizziness",
    triageLevel: "EMERGENCY",
    status: "WAITING",
    dateTime: "10:30 AM",
    vitals: {
      bp: "165/100 mmHg",
      temp: "98.6 °F",
      heartRate: "112 bpm",
      spo2: "93%"
    },
    aiSummary: "CRITICAL: 52M presenting with classic acute coronary syndrome symptoms (chest pain radiating to arm, diaphoresis, tachycardia). Emergency alert triggered.",
    symptoms: ["Chest pain", "Arm radiation", "Shortness of breath", "Dizziness"],
    patientAdvice: "Do not exert yourself. Sit upright and rest immediately while emergency responders are notified.",
    recommendedActions: [
      "Immediate emergency transport to District Hospital ICU",
      "Keep patient calm & seated upright",
      "Monitor SpO2 and pulse continuously"
    ],
    firstAidInstructions: [
      "Loosen tight clothing around neck and chest",
      "Do not give solid food or cold water if feeling lightheaded",
      "Keep emergency contact phone open"
    ],
    emergencyAlertTriggered: true,
    history: ["Hypertension (3 yrs)", "Smoking history"]
  },
  {
    id: "PAT-102",
    name: "Sunita Devi (सुनिता देवी)",
    age: 38,
    gender: "Female",
    village: "Rampur Gram",
    district: "Satara",
    phone: "+91 94112 88901",
    chiefComplaint: "High fever (103°F), severe body chills, and joint pain for 3 days",
    triageLevel: "URGENT",
    status: "SCHEDULED",
    dateTime: "11:00 AM",
    vitals: {
      bp: "118/76 mmHg",
      temp: "102.8 °F",
      heartRate: "94 bpm",
      spo2: "97%"
    },
    aiSummary: "URGENT: 38F with high grade fever spikes, severe myalgia, and mild dehydration. Potential vector-borne illness (Dengue/Malaria). Blood smear recommended.",
    symptoms: ["High fever", "Chills", "Severe joint pain", "Headache"],
    patientAdvice: "Stay well hydrated with ORS or boiled lukewarm water. Take cold compress for high fever.",
    recommendedActions: [
      "Rapid Diagnostic Test (RDT) for Malaria & Dengue NS1",
      "Hydration monitoring by local ASHA worker",
      "Tele-consultation with Medical Officer today"
    ],
    firstAidInstructions: [
      "Apply damp cloth on forehead to reduce temperature",
      "Administer ORS fluid frequently"
    ],
    emergencyAlertTriggered: false,
    history: ["No prior chronic illness"]
  },
  {
    id: "PAT-103",
    name: "Anand Shinde (आनंद शिंदे)",
    age: 64,
    gender: "Male",
    village: "Bhor",
    district: "Pune",
    phone: "+91 97654 12390",
    chiefComplaint: "Persistent dry cough for 2 weeks with fatigue and mild weight loss",
    triageLevel: "ROUTINE",
    status: "SCHEDULED",
    dateTime: "11:30 AM",
    vitals: {
      bp: "130/82 mmHg",
      temp: "99.1 °F",
      heartRate: "78 bpm",
      spo2: "96%"
    },
    aiSummary: "ROUTINE: 64M chronic cough >14 days. Needs Sputum AFB test & Chest X-ray evaluation for suspected pulmonary tuberculosis screening.",
    symptoms: ["Chronic cough", "Fatigue", "Mild fever in evening"],
    patientAdvice: "Cover mouth while coughing. Visit local PHC for free sputum testing under National TB Elimination Program.",
    recommendedActions: [
      "Schedule PHC visit for Sputum Microscopy",
      "Prescribe antitussive relief syrup"
    ],
    emergencyAlertTriggered: false,
    history: ["Type 2 Diabetes (5 yrs)"]
  },
  {
    id: "PAT-104",
    name: "Meena Jadhav (मीना जाधव)",
    age: 27,
    gender: "Female",
    village: "Velhe",
    district: "Pune",
    phone: "+91 99881 77234",
    chiefComplaint: "Antenatal routine check-up (28 weeks pregnant), mild ankle swelling",
    triageLevel: "ROUTINE",
    status: "COMPLETED",
    dateTime: "09:45 AM",
    vitals: {
      bp: "110/70 mmHg",
      temp: "98.2 °F",
      heartRate: "82 bpm",
      spo2: "98%"
    },
    aiSummary: "ROUTINE: 27F ANC 3rd trimester check-up. Normal fetal heart rate, normal blood pressure. Iron and Folic Acid supplements reissued.",
    symptoms: ["Mild pedal edema", "Normal pregnancy changes"],
    patientAdvice: "Elevate feet while resting. Continue taking daily IFA tablets and calcium.",
    recommendedActions: [
      "Routine blood hemoglobin check",
      "Confirm next Tetanus Toxoid booster dose"
    ],
    emergencyAlertTriggered: false,
    history: ["G2P1, 1 prior healthy delivery"]
  }
];

export const MOCK_RISK_ALERTS: RiskAlertData[] = [
  {
    id: "RISK-01",
    region: "Haveli & Velhe Blocks",
    district: "Pune District",
    disease: "Dengue & Chikungunya",
    riskLevel: "High",
    symptoms: ["Sudden high fever", "Behind-eye pain", "Severe body ache"],
    prevention: [
      "Avoid stagnant water accumulation in containers & tires",
      "Use mosquito nets while sleeping",
      "ASHA workers conducting larvicidal spraying"
    ],
    affectedCount: 42,
    updatedAt: "Today, 08:00 AM"
  },
  {
    id: "RISK-02",
    region: "Wai & Mahabaleshwar Belt",
    district: "Satara District",
    disease: "Gastroenteritis / Waterborne Fever",
    riskLevel: "Moderate",
    symptoms: ["Watery diarrhea", "Abdominal cramps", "Nausea"],
    prevention: [
      "Drink only boiled or chlorine-treated water",
      "Wash hands thoroughly with soap before meals",
      "ORS packets distributed at Anganwadi centers"
    ],
    affectedCount: 19,
    updatedAt: "Yesterday"
  },
  {
    id: "RISK-03",
    region: "Shirur Taluka",
    district: "Pune District",
    disease: "Seasonal Viral Influenza",
    riskLevel: "Outbreak",
    symptoms: ["Fever", "Runny nose", "Throat irritation", "Dry cough"],
    prevention: [
      "Wear cloth masks in crowded weekly haats/markets",
      "Isolate family members with active fever",
      "Hydration & paracetamol symptom management"
    ],
    affectedCount: 87,
    updatedAt: "Today, 12:30 PM"
  }
];
