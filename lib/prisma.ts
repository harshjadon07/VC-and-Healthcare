import { MOCK_PATIENTS, MOCK_RISK_ALERTS, MockPatient } from './mock-data';

// Database Client Provider with fallback in-memory store if DB is initializing
class DatabaseService {
  private appointments: MockPatient[] = [...MOCK_PATIENTS];

  async getAppointments() {
    return this.appointments;
  }

  async addAppointment(newAppt: Partial<MockPatient>) {
    const created: MockPatient = {
      id: `PAT-${Date.now().toString().slice(-4)}`,
      name: newAppt.name || "Rural Resident",
      age: newAppt.age || 45,
      gender: newAppt.gender || "Female",
      village: newAppt.village || "Khed Shivapur",
      district: newAppt.district || "Pune",
      phone: newAppt.phone || "+91 98000 11223",
      chiefComplaint: newAppt.chiefComplaint || "Routine consultation",
      triageLevel: newAppt.triageLevel || 'ROUTINE',
      status: 'SCHEDULED',
      dateTime: newAppt.dateTime || '02:30 PM',
      vitals: newAppt.vitals || { bp: "120/80 mmHg", temp: "98.6 °F", heartRate: "72 bpm", spo2: "98%" },
      aiSummary: newAppt.aiSummary || "Patient requested routine tele-consultation.",
      symptoms: newAppt.symptoms || ["General discomfort"],
      patientAdvice: newAppt.patientAdvice || "Rest and maintain hydration.",
      recommendedActions: newAppt.recommendedActions || ["Tele-consultation scheduled"],
      emergencyAlertTriggered: newAppt.triageLevel === 'EMERGENCY',
      history: ["No prior chronic history"],
    };

    this.appointments.unshift(created);
    return created;
  }

  async updateAppointmentPrescription(id: string, prescription: string) {
    const item = this.appointments.find((p) => p.id === id);
    if (item) {
      item.status = 'COMPLETED';
      item.patientAdvice = `Prescription issued: ${prescription}`;
      return item;
    }
    return null;
  }

  async getRiskAlerts() {
    return MOCK_RISK_ALERTS;
  }
}

export const db = new DatabaseService();
