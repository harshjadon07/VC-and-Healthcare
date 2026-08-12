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

// PRELOADED HARDCODED PATIENTS REMOVED - Dynamic Token Generation Active
export const MOCK_PATIENTS: MockPatient[] = [];

export const MOCK_RISK_ALERTS: RiskAlertData[] = [
  {
    id: "RISK-01",
    region: "Lucknow & Barabanki Belt",
    district: "Lucknow District",
    disease: "Dengue & Chikungunya",
    riskLevel: "High",
    symptoms: ["Sudden high fever", "Behind-eye pain", "Severe body ache"],
    prevention: [
      "Avoid stagnant water accumulation in coolers & containers",
      "Use mosquito nets while sleeping",
      "ASHA workers conducting larvicidal spraying"
    ],
    affectedCount: 42,
    updatedAt: "Today, 08:00 AM"
  },
  {
    id: "RISK-02",
    region: "Varanasi & Chandauli Zone",
    district: "Varanasi District",
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
  }
];
