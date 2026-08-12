'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, AlertTriangle, PhoneCall, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language, dictionaries } from '@/lib/i18n/dictionary';
import { SpeechToTextEngine, speakText, stopSpeaking } from '@/lib/speech';

interface TriageResult {
  triageLevel: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  summary: string;
  patientAdvice: string;
  symptomsDetected?: string[];
  recommendedActions?: string[];
  firstAidInstructions?: string[];
  emergencyAlertTriggered?: boolean;
}

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [result, setResult] = useState<TriageResult | null>(null);

  const sttEngineRef = useRef<SpeechToTextEngine | null>(null);
  const dict = dictionaries[currentLang] || dictionaries.en;

  useEffect(() => {
    sttEngineRef.current = new SpeechToTextEngine();
    return () => {
      stopSpeaking();
      if (sttEngineRef.current) {
        sttEngineRef.current.stopListening();
      }
    };
  }, []);

  // When user switches language, re-evaluate AI result in the new language if query exists
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    stopSpeaking();

    if (query.trim()) {
      fetchTriageResult(query, newLang);
    }
  };

  const handleToggleListening = () => {
    if (!sttEngineRef.current || !sttEngineRef.current.isSupported()) {
      alert("Speech-to-Text microphone is not supported on this browser. You can type your symptoms.");
      return;
    }

    if (isListening) {
      sttEngineRef.current.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      sttEngineRef.current.startListening({
        language: currentLang,
        onTranscript: (transcript) => {
          setQuery(transcript);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (err) => {
          console.error("Speech recognition error:", err);
          setIsListening(false);
        },
      });
    }
  };

  const fetchTriageResult = async (symptomText: string, targetLang: Language) => {
    setIsProcessing(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomText, language: targetLang }),
      });

      const data: TriageResult = await res.json();
      setResult(data);

      // Text-to-Speech (TTS) Voice Readout in selected language
      if (isVoiceEnabled && data.patientAdvice) {
        const spokenText = `${data.summary}. ${data.patientAdvice}`;
        speakText(spokenText, targetLang);
      }
    } catch (err) {
      console.error("Triage API error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchSubmit = (symptomText?: string) => {
    const textToSearch = symptomText || query;
    if (!textToSearch.trim()) return;

    if (isListening && sttEngineRef.current) {
      sttEngineRef.current.stopListening();
      setIsListening(false);
    }

    fetchTriageResult(textToSearch, currentLang);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      {/* Main Ultra-Clean AI Search Center */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex flex-col items-center justify-center space-y-8">
        
        {/* Welcome Tag */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border-2 border-emerald-400 text-forest-950 px-5 py-2 rounded-full text-base font-black shadow-xs">
            <Sparkles className="w-5 h-5 text-forest-800" />
            <span>{dict.appName} • {dict.appTagline}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {dict.searchTitle}
          </h1>

          <p className="text-lg sm:text-xl text-slate-800 font-extrabold max-w-2xl mx-auto">
            {dict.searchSubtitle}
          </p>
        </div>

        {/* CENTRAL AI SEARCH BAR WITH STT & TTS CONTROLS */}
        <div className="w-full bg-white p-4 sm:p-5 rounded-3xl border-4 border-sand-300 shadow-xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            {/* Input Text Box */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? dict.listeningPlaceholder : dict.searchPlaceholder}
                className={`w-full px-5 py-4 text-lg sm:text-xl font-extrabold text-slate-950 bg-sand-50 border-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-forest-800 ${
                  isListening ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
            </div>

            {/* STT Microphone & TTS Voice Buttons */}
            <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
              {/* 🎤 Speech-to-Text Button */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`flex items-center space-x-2 px-5 py-4 rounded-2xl text-base font-black transition-all border-3 shadow-md ${
                  isListening
                    ? 'bg-red-600 border-red-800 text-white animate-pulse'
                    : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
                }`}
                title="Tap to Speak (Speech-to-Text)"
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-forest-800" />}
                <span className="hidden sm:inline">{isListening ? dict.stopButton : dict.speakButton}</span>
              </button>

              {/* 🔊 Text-to-Speech Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isVoiceEnabled) {
                    stopSpeaking();
                    setIsVoiceEnabled(false);
                  } else {
                    setIsVoiceEnabled(true);
                  }
                }}
                className={`p-4 rounded-2xl border-3 transition-all ${
                  isVoiceEnabled
                    ? 'bg-forest-800 border-forest-950 text-white shadow-md'
                    : 'bg-slate-200 border-slate-400 text-slate-600'
                }`}
                title={isVoiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
              >
                {isVoiceEnabled ? <Volume2 className="w-6 h-6 text-emerald-300" /> : <VolumeX className="w-6 h-6" />}
              </button>

              {/* Submit Button */}
              <Button type="submit" variant="primary" size="lg" className="px-6 py-4 bg-forest-800 text-lg font-black rounded-2xl">
                <Send className="w-6 h-6 mr-2 text-emerald-300" />
                <span>{dict.submitButton}</span>
              </Button>
            </div>
          </form>

          {/* 1-TAP QUICK SYMPTOM CHIPS */}
          <div className="pt-2 border-t-2 border-sand-200">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-2">
              {dict.tapQuickSymptom}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: dict.chipFever, text: "High fever (103°F) with body chills / तेज़ बुखार" },
                { label: dict.chipChestPain, text: "Severe chest pain & shortness of breath / छाती में दर्द" },
                { label: dict.chipHeadache, text: "Severe headache and dizziness / सिरदर्द" },
                { label: dict.chipStomach, text: "Abdominal pain & continuous vomiting / पेट दर्द" },
                { label: dict.chipInjury, text: "Deep cut wound / चोट" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(chip.text);
                    handleSearchSubmit(chip.text);
                  }}
                  className="px-4 py-2 bg-sand-100 hover:bg-forest-800 hover:text-white text-slate-900 text-sm font-black rounded-xl border-2 border-sand-300 hover:border-forest-950 transition-all shadow-2xs active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI ANALYSIS IN PROGRESS LOADING STATE */}
        {isProcessing && (
          <div className="w-full bg-emerald-100 p-6 rounded-3xl border-4 border-emerald-400 text-forest-950 font-black text-xl flex items-center justify-center space-x-3 animate-pulse shadow-md">
            <RefreshCw className="w-8 h-8 animate-spin text-forest-800" />
            <span>{dict.analyzingText}</span>
          </div>
        )}

        {/* AI TRIAGE RESULT OUTPUT CARD */}
        {result && !isProcessing && (
          <div
            className={`w-full rounded-3xl p-6 sm:p-8 border-4 shadow-xl space-y-6 ${
              result.triageLevel === 'EMERGENCY'
                ? 'bg-red-50 border-red-500 text-slate-950'
                : result.triageLevel === 'URGENT'
                ? 'bg-amber-50 border-amber-400 text-slate-950'
                : 'bg-white border-forest-600 text-slate-950'
            }`}
          >
            {/* Result Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-slate-300 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-black">
                  <Bot className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950">{dict.aiAdviceTitle}</h3>
                  <p className="text-sm font-extrabold text-slate-700">{dict.evaluatedViaSafetyEngine}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={result.triageLevel} className="text-sm px-4 py-1.5 font-black">
                  {result.triageLevel === 'EMERGENCY' ? '🔴 EMERGENCY' : result.triageLevel === 'URGENT' ? '🟡 URGENT' : '🟢 ROUTINE'}
                </Badge>
                
                {/* Voice Re-play Button */}
                <button
                  onClick={() => speakText(`${result.summary}. ${result.patientAdvice}`, currentLang)}
                  className="p-2.5 rounded-xl bg-forest-100 border-2 border-forest-400 text-forest-900 font-bold hover:bg-forest-200 flex items-center space-x-1"
                  title={dict.rePlayVoice}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-300 text-lg font-extrabold text-slate-900 leading-relaxed shadow-xs">
              <span className="font-black text-forest-900 block mb-1 text-xl">{dict.clinicalAssessmentLabel}</span>
              {result.summary}
            </div>

            {/* Patient Guidance */}
            {result.patientAdvice && (
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-300 text-lg font-extrabold text-slate-900 leading-relaxed shadow-xs">
                <span className="font-black text-forest-900 block mb-1 text-xl">{dict.adviceInYourLangLabel}</span>
                {result.patientAdvice}
              </div>
            )}

            {/* First-Aid Instructions */}
            {result.firstAidInstructions && result.firstAidInstructions.length > 0 && (
              <div className="bg-amber-100 p-5 rounded-2xl border-2 border-amber-400 text-base text-amber-950 space-y-2">
                <span className="font-black text-amber-950 flex items-center space-x-2 text-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-700" />
                  <span>{dict.firstAidTitle}</span>
                </span>
                <ul className="list-disc pl-6 space-y-1 font-extrabold text-base">
                  {result.firstAidInstructions.map((fa, idx) => (
                    <li key={idx}>{fa}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency SOS Call Trigger */}
            {result.triageLevel === 'EMERGENCY' && (
              <div className="pt-2">
                <a href="tel:108" className="w-full block">
                  <Button variant="danger" size="xl" className="w-full text-xl font-black py-5 border-4 border-red-800 shadow-xl">
                    <PhoneCall className="w-7 h-7 mr-3 text-white animate-bounce" />
                    <span>{dict.callAmbulanceNow}</span>
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
