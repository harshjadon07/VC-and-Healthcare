import { SafetyEngineResult, evaluateClinicalSafety } from './safety-engine';

/**
 * Gemini AI Integration Module for SevaHealth
 * Exclusively uses the gemini-3.6-flash model with fallback to deterministic Safety Rules Engine.
 */
export async function analyzeWithGemini(
  symptomsText: string,
  language: string = 'en',
  attachment?: { name: string; base64Data?: string; mimeType?: string }
): Promise<SafetyEngineResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // If no API key is set, fallback to local deterministic safety engine
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found in environment; using Safety Rules Engine fallback.");
    return evaluateClinicalSafety(symptomsText, language, attachment?.name);
  }

  // Exclusively use gemini-3.6-flash model
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

  const langNames: Record<string, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    mr: 'Marathi (मराठी)',
    ta: 'Tamil (தமிழ்)',
  };

  const selectedLangName = langNames[language] || 'English';

  const systemInstruction = `You are SevaHealth Clinical AI Triage Assistant for rural healthcare.
Evaluate the patient's symptoms and any attached medical image or document.
Return ONLY valid JSON using this exact schema:
{
  "triageLevel": "EMERGENCY" | "URGENT" | "ROUTINE",
  "summary": "Concise 2-sentence clinical summary in ${selectedLangName}",
  "patientAdvice": "Simple non-jargon advice for the patient in ${selectedLangName}",
  "symptomsDetected": ["symptom 1", "symptom 2"],
  "recommendedActions": ["action 1", "action 2"],
  "firstAidInstructions": ["first aid step 1", "first aid step 2"],
  "emergencyAlertTriggered": boolean
}

RED-FLAG SAFETY RULES:
If the patient has chest pain, acute shortness of breath, severe uncontrolled bleeding, unconsciousness, stroke, snake bite, or scorpion bite:
- Set triageLevel to "EMERGENCY"
- Set emergencyAlertTriggered to true
- Recommend immediate emergency 108 medical care
Do not provide a definitive diagnosis. All text values must be written in ${selectedLangName}.`;

  const textPrompt = `Patient Language: ${selectedLangName}\nPatient Symptoms / Query: ${symptomsText}`;
  const parts: any[] = [{ text: textPrompt }];

  // Include attached image/document if provided
  if (attachment?.base64Data && attachment?.mimeType) {
    const base64Clean = attachment.base64Data.replace(/^data:[^;]+;base64,/, '');
    parts.push({
      inline_data: {
        mime_type: attachment.mimeType,
        data: base64Clean,
      },
    });
  }

  const contents = [{ parts }];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    console.log(`Analyzing symptoms using Gemini model: '${modelName}'`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini model '${modelName}' returned HTTP ${response.status}: ${errorText.slice(0, 150)}`);
      return evaluateClinicalSafety(symptomsText, language, attachment?.name);
    }

    const data = await response.json();
    let candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn(`Gemini model '${modelName}' returned empty text. Using Safety Rules Engine.`);
      return evaluateClinicalSafety(symptomsText, language, attachment?.name);
    }

    // Strip markdown ```json code blocks if returned by Gemini
    candidateText = candidateText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

    let parsed: SafetyEngineResult;
    try {
      parsed = JSON.parse(candidateText);
    } catch (jsonErr) {
      console.error(`Failed to parse Gemini JSON output from model '${modelName}':`, candidateText);
      return evaluateClinicalSafety(symptomsText, language, attachment?.name);
    }

    // Enforce server-side red flag safety override
    const queryLower = symptomsText.toLowerCase();
    const isRedFlag = /chest pain|heart attack|cannot breathe|can't breathe|shortness of breath|difficulty breathing|severe bleeding|unconscious|stroke|snake bite|snakebite|scorpion|छाती में दर्द|सीने में दर्द|सांस लेने में दिक्कत|साँप के काटने|बिच्छू|बेहोश|स्ट्रोक/i.test(queryLower);

    if (isRedFlag) {
      parsed.triageLevel = 'EMERGENCY';
      parsed.emergencyAlertTriggered = true;
    }

    // Attach file name if provided
    if (attachment?.name) {
      parsed.attachedFile = attachment.name;
    }

    console.log(`Successfully received clinical triage from Gemini model: '${modelName}'`);
    return parsed;

  } catch (modelErr) {
    console.warn(`Error invoking Gemini model '${modelName}':`, modelErr);
    return evaluateClinicalSafety(symptomsText, language, attachment?.name);
  }
}