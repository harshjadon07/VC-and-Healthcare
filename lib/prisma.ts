import { getTokenQueue, createTokenTicket, findTokenByNumber, updateTokenStatus, TokenTicket } from './token-queue';
import { MOCK_RISK_ALERTS } from './mock-data';

// Database Client Provider linked directly to live Token Generation & Queue Store
class DatabaseService {
  async getAppointments() {
    const queue = getTokenQueue();
    // Map TokenTicket to expected patient structure
    return queue.map((t) => ({
      id: t.tokenNumber,
      name: t.patientName,
      age: t.age,
      gender: t.gender,
      village: t.village,
      district: t.district,
      phone: t.phone,
      chiefComplaint: t.chiefComplaint,
      triageLevel: t.triageLevel,
      status: t.status,
      dateTime: t.createdAt,
      vitals: t.vitals,
      aiSummary: t.aiSummary,
      symptoms: t.symptoms,
      patientAdvice: t.patientAdvice,
      recommendedActions: t.recommendedActions,
      emergencyAlertTriggered: t.emergencyAlertTriggered,
      history: [t.prescription ? `Prescription: ${t.prescription}` : "Dynamic Token Patient Record"]
    }));
  }

  async addAppointment(newAppt: any) {
    const ticket = createTokenTicket({
      patientName: newAppt.name,
      age: newAppt.age,
      gender: newAppt.gender,
      village: newAppt.village,
      district: newAppt.district,
      phone: newAppt.phone,
      chiefComplaint: newAppt.chiefComplaint,
      triageLevel: newAppt.triageLevel,
      vitals: newAppt.vitals,
      aiSummary: newAppt.aiSummary,
      symptoms: newAppt.symptoms,
      patientAdvice: newAppt.patientAdvice,
      recommendedActions: newAppt.recommendedActions
    });

    return {
      id: ticket.tokenNumber,
      name: ticket.patientName,
      age: ticket.age,
      gender: ticket.gender,
      village: ticket.village,
      district: ticket.district,
      phone: ticket.phone,
      chiefComplaint: ticket.chiefComplaint,
      triageLevel: ticket.triageLevel,
      status: ticket.status,
      dateTime: ticket.createdAt,
      vitals: ticket.vitals,
      aiSummary: ticket.aiSummary,
      symptoms: ticket.symptoms,
      patientAdvice: ticket.patientAdvice,
      recommendedActions: ticket.recommendedActions,
      emergencyAlertTriggered: ticket.emergencyAlertTriggered,
      history: ["Token Created"]
    };
  }

  async updateAppointmentPrescription(id: string, prescription: string) {
    const ticket = updateTokenStatus(id, 'COMPLETED', prescription);
    if (ticket) {
      return {
        id: ticket.tokenNumber,
        name: ticket.patientName,
        status: 'COMPLETED',
        patientAdvice: `Prescription issued: ${prescription}`
      };
    }
    return null;
  }

  async getRiskAlerts() {
    return MOCK_RISK_ALERTS;
  }
}

export const db = new DatabaseService();
