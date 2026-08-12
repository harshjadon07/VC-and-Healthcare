// Speech-to-Text (STT) and Text-to-Speech (TTS) Utility using browser Web Speech API

export interface SpeechRecognitionResultEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechOptions {
  language: 'en' | 'hi' | 'mr' | 'ta';
  onTranscript?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

const LANG_CODE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
};

/**
 * Speech-to-Text (STT) SpeechRecognition handler
 */
export class SpeechToTextEngine {
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(options: SpeechOptions) {
    if (!this.recognition) {
      if (options.onError) options.onError("Speech recognition not supported in this browser.");
      return;
    }

    const targetLang = LANG_CODE_MAP[options.language] || 'hi-IN';
    this.recognition.lang = targetLang;

    this.recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let finalTranscript = '';
      for (let i = 0; i < Object.keys(event.results).length; i++) {
        const result = event.results[i];
        if (result && result[0]) {
          finalTranscript += result[0].transcript;
        }
      }
      if (options.onTranscript && finalTranscript) {
        options.onTranscript(finalTranscript);
      }
    };

    this.recognition.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    this.recognition.onerror = (event: any) => {
      if (options.onError) options.onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn("Speech recognition already running or error:", err);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
    }
  }
}

/**
 * Select a suitable female voice for Hindi & regional languages
 */
function getFemaleVoice(lang: 'en' | 'hi' | 'mr' | 'ta'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const bcp47 = LANG_CODE_MAP[lang] || 'hi-IN';
  const langPrefix = lang;

  // Female voice indicators across Windows, Android, iOS, macOS, Chrome
  const femaleKeywords = ['swara', 'kalpana', 'google', 'female', 'woman', 'heera', 'veena', 'ananya', 'shravani', 'natural'];

  // 1. Language matched voice containing a female keyword in name
  const langVoices = voices.filter(v =>
    v.lang.toLowerCase().startsWith(langPrefix) || v.lang.toLowerCase().replaceAll('_', '-').includes(bcp47.toLowerCase())
  );

  const femaleLangVoice = langVoices.find(v =>
    femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );

  if (femaleLangVoice) return femaleLangVoice;

  // 2. Any language-matched voice
  if (langVoices.length > 0) return langVoices[0];

  // 3. Fallback to any female voice in system
  return voices.find(v => femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))) || null;
}

/**
 * Text-to-Speech (TTS) SpeechSynthesis handler tuned for suitable Female Hindi voice
 */
export function speakText(text: string, lang: 'en' | 'hi' | 'mr' | 'ta' = 'hi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Text-to-Speech not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const performSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODE_MAP[lang] || 'hi-IN';
    utterance.rate = 0.92; // Pleasant, calm, clear rural health advisor pace
    utterance.pitch = 1.15; // Natural warm female voice pitch

    const femaleVoice = getFemaleVoice(lang);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // If voices are already loaded, speak immediately
  if (window.speechSynthesis.getVoices().length > 0) {
    performSpeak();
  } else {
    // If voices load asynchronously in Chrome/Edge
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      performSpeak();
    };
    performSpeak();
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
