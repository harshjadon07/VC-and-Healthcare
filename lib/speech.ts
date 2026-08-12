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

    const targetLang = LANG_CODE_MAP[options.language] || 'en-IN';
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
 * Text-to-Speech (TTS) SpeechSynthesis handler
 */
export function speakText(text: string, lang: 'en' | 'hi' | 'mr' | 'ta' = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Text-to-Speech not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_CODE_MAP[lang] || 'en-IN';
  utterance.rate = 0.95; // slightly relaxed pace for high clarity
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
