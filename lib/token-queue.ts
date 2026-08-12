export interface TokenTicket {
  tokenNumber: string; // e.g. "SEVA-TK-482910"
  patientName: string;
  age: number;
  gender: string;
  village: string;
  district: string;
  phone: string;
  chiefComplaint: string;
  triageLevel: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  status: 'WAITING' | 'IN_TRIAGE' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
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
  prescription?: string;
  emergencyAlertTriggered: boolean;
}

// In-memory global store for dynamic token tickets
let tokenQueueStore: TokenTicket[] = [];

export const generateUniqueTokenNumber = (): string => {
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `SEVA-TK-${randomSixDigits}`;
};

export const createTokenTicket = (data: Partial<TokenTicket>): TokenTicket => {
  const newToken: TokenTicket = {
    tokenNumber: generateUniqueTokenNumber(),
    patientName: data.patientName || 'Anonymous Patient',
    age: data.age || 40,
    gender: data.gender || 'Male',
    village: data.village || 'Khed Shivapur',
    district: data.district || 'Lucknow',
    phone: data.phone || '+91 98223 45678',
    chiefComplaint: data.chiefComplaint || 'General Health Evaluation',
    triageLevel: data.triageLevel || 'ROUTINE',
    status: 'WAITING',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    vitals: data.vitals || {
      bp: '120/80 mmHg',
      temp: '98.6 °F',
      heartRate: '75 bpm',
      spo2: '98%'
    },
    aiSummary: data.aiSummary || 'Patient submitted symptoms for clinical triage queue.',
    symptoms: data.symptoms || [],
    patientAdvice: data.patientAdvice || 'Rest and stay hydrated until ASHA/Doctor consultation.',
    recommendedActions: data.recommendedActions || ['Consult ASHA worker', 'Monitor vitals'],
    emergencyAlertTriggered: data.triageLevel === 'EMERGENCY'
  };

  tokenQueueStore.unshift(newToken);
  return newToken;
};

export const getTokenQueue = (): TokenTicket[] => {
  return tokenQueueStore;
};

export const findTokenByNumber = (tokenNumber: string): TokenTicket | undefined => {
  const clean = tokenNumber.trim().toUpperCase();
  return tokenQueueStore.find(t => t.tokenNumber === clean);
};

export const updateTokenStatus = (tokenNumber: string, newStatus: TokenTicket['status'], prescription?: string): TokenTicket | undefined => {
  const clean = tokenNumber.trim().toUpperCase();
  const ticket = tokenQueueStore.find(t => t.tokenNumber === clean);
  if (ticket) {
    ticket.status = newStatus;
    if (prescription) {
      ticket.prescription = prescription;
    }
  }
  return ticket;
};
