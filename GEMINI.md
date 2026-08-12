# GEMINI.md — Rural Healthcare Platform Architecture & Specifications

## Project Overview
**SevaHealth (ग्रामीण आरोग्य / Rural Health AI Platform)** is a high-accessibility rural healthcare platform designed to bridge the gap between rural patients, local community health workers (ASHA/VHM), and remote doctors.

---

## 1. System Architecture & Route Security

### Route Access Matrix
| Route | Access Level | Description |
|---|---|---|
| `/` | Public | Landing page with language selector, public AI assistant entry, & login trigger |
| `/patient` | Protected (`PATIENT`) | Patient dashboard: AI Assistant, Bookings, Family Records, Risk Map |
| `/health-worker` | Protected (`HEALTH_WORKER`) | Health worker queue, patient triage stats, emergency alert feed |
| `/doctor` | Protected (`DOCTOR`) | Doctor schedule, live patient queue, consultation panel & AI summary |

---

## 2. Database Schema (Prisma / PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  PATIENT
  HEALTH_WORKER
  DOCTOR
  ADMIN
}

enum TriageLevel {
  ROUTINE
  URGENT
  EMERGENCY
}

enum AppointmentStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model User {
  id            String        @id @default(cuid())
  phone         String?       @unique
  email         String?       @unique
  name          String
  role          Role          @default(PATIENT)
  language      String        @default("en")
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  patient       Patient?
  healthWorker  HealthWorker?
  doctor        Doctor?
}

model Patient {
  id            String        @id @default(cuid())
  userId        String        @unique
  user          User          @relation(fields: [userId], references: [id])
  age           Int
  gender        String
  village       String
  district      String
  bloodGroup    String?
  medicalHistory String[]
  familyId      String?
  createdAt     DateTime      @default(now())

  appointments  Appointment[]
  chatLogs      AIChatLog[]
}

model HealthWorker {
  id            String        @id @default(cuid())
  userId        String        @unique
  user          User          @relation(fields: [userId], references: [id])
  assignedVillage String
  centerName    String
  createdAt     DateTime      @default(now())
}

model Doctor {
  id            String        @id @default(cuid())
  userId        String        @unique
  user          User          @relation(fields: [userId], references: [id])
  specialty     String
  qualification String
  hospital      String
  availableDays String[]
  createdAt     DateTime      @default(now())

  appointments  Appointment[]
}

model Appointment {
  id            String            @id @default(cuid())
  patientId     String
  patient       Patient           @relation(fields: [patientId], references: [id])
  doctorId      String
  doctor        Doctor            @relation(fields: [doctorId], references: [id])
  dateTime      DateTime
  status        AppointmentStatus @default(SCHEDULED)
  triageLevel   TriageLevel       @default(ROUTINE)
  aiSummary     String?
  chiefComplaint String
  vitals        Json?             // { bp, temp, heartRate, spo2 }
  prescription  String?
  notes         String?
  createdAt     DateTime          @default(now())
}

model AIChatLog {
  id            String      @id @default(cuid())
  patientId     String
  patient       Patient     @relation(fields: [patientId], references: [id])
  messages      Json        // [{ role: "user" | "assistant", content: string, timestamp: string }]
  triageLevel   TriageLevel @default(ROUTINE)
  summary       String
  emergencyAlert Boolean    @default(false)
  createdAt     DateTime    @default(now())
}

model RiskAlert {
  id            String      @id @default(cuid())
  region        String
  disease       String
  riskLevel     String      // "Low" | "Moderate" | "High" | "Outbreak"
  symptoms      String[]
  prevention    String[]
  affectedCount Int         @default(0)
  createdAt     DateTime    @default(now())
}
```

---

## 3. AI Safety Rules & Triage Engine

### JSON Response Specification for AI Triage API (`/api/ai/triage`)
```json
{
  "triageLevel": "EMERGENCY | URGENT | ROUTINE",
  "summary": "Concise 2-sentence clinical summary for health worker / doctor",
  "patientAdvice": "Simple, non-jargon advice in user's selected language",
  "symptomsDetected": ["chest pain", "shortness of breath"],
  "recommendedActions": [
    "Seek immediate emergency medical attention",
    "Keep patient calm and seated upright"
  ],
  "firstAidInstructions": [
    "Loosen tight clothing around neck and chest",
    "Do not offer water or food if patient is dizzy"
  ],
  "emergencyAlertTriggered": true
}
```

### Red-Flag Emergency Keywords (Deterministic Safety Engine)
If any of these conditions are detected, `triageLevel` **MUST** be forced to `EMERGENCY` and `emergencyAlertTriggered` set to `true`:
- Chest pain, radiation to jaw/left arm, acute pressure
- Severe dyspnea / inability to breathe
- Profuse unstopped bleeding or severe hemorrhagic trauma
- Unconsciousness, fainting, sudden loss of speech or limb movement (Stroke symptoms)
- Venomous snake bite / scorpion sting
- High fever with neck stiffness / altered mental state
- Acute severe abdominal pain with vomiting blood

---

## 4. UI Design System Guidelines
- **Target Audience**: Rural citizens, community health workers (ASHA), rural doctors.
- **Visual Aesthetic**: Earthy, calm greens (`#0F5132`, `#198754`, `#E8F5E9`), warm sand background accent, high contrast text for sunlit outdoor phone usage.
- **Accessibility**: Clear visual indicators, minimal technical jargon, large touchable cards (min 48px target height), icon-augmented navigation.
- **Multilingual Support**: Built-in support for English (`en`), Hindi (`hi`), Marathi (`mr`), and Tamil (`ta`).
