'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, AlertTriangle, PhoneCall, Image as ImageIcon, X, FileText, Paperclip, Cpu } from 'lucide-react';
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
  attachedFile?: string;
}

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [result, setResult] = useState<TriageResult | null>(null);

  // Local Image / Document attachment state
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    name: string;
    previewUrl?: string;
    base64Data?: string;
    mimeType?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    stopSpeaking();

    if (query.trim() || attachedFile) {
      fetchTriageResult(query, newLang, attachedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        let previewUrl: string | undefined = undefined;
        if (file.type.startsWith('image/')) {
          previewUrl = base64Data;
        }
        setAttachedFile({
          file,
          name: file.name,
          previewUrl,
          base64Data,
          mimeType: file.type || 'image/jpeg',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const fetchTriageResult = async (
    symptomText: string,
    targetLang: Language,
    fileObj?: { name: string; base64Data?: string; mimeType?: string } | null
  ) => {
    setIsProcessing(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomText || "Attached medical document / image for clinical evaluation",
          language: targetLang,
          attachmentName: fileObj?.name,
          attachmentData: fileObj?.base64Data,
          mimeType: fileObj?.mimeType,
        }),
      });

      const data: TriageResult = await res.json();
      setResult(data);

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
    if (!textToSearch.trim() && !attachedFile) return;

    if (isListening && sttEngineRef.current) {
      sttEngineRef.current.stopListening();
      setIsListening(false);
    }

    fetchTriageResult(textToSearch, currentLang, attachedFile);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      {/* Main Ultra-Clean AI Search Center */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full flex flex-col items-center justify-center space-y-8">
        
        {/* Welcome Tag */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border-2 border-emerald-400 text-forest-950 px-5 py-2 rounded-full text-base font-black shadow-xs">
            <Cpu className="w-5 h-5 text-forest-800 animate-pulse" />
            <span>Google Gemini AI Powered • ग्रामीण आरोग्य</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {dict.searchTitle}
          </h1>

          <p className="text-lg sm:text-xl text-slate-800 font-extrabold max-w-2xl mx-auto">
            {dict.searchSubtitle}
          </p>
        </div>

        {/* CENTRAL SPACIOUS AI SEARCH BAR */}
        <div className="w-full bg-white p-3 sm:p-4 rounded-3xl border-4 border-sand-300 shadow-xl space-y-3">
          
          {/* Hidden File Picker Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />

          {/* Attached File Preview Badge if selected */}
          {attachedFile && (
            <div className="flex items-center justify-between bg-forest-50 border-2 border-forest-400 p-2.5 rounded-2xl">
              <div className="flex items-center space-x-3 truncate">
                {attachedFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attachedFile.previewUrl}
                    alt="Medical attachment preview"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-forest-700 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-6 h-6 text-emerald-300" />
                  </div>
                )}
                <div className="truncate">
                  <span className="text-[11px] font-black text-forest-900 uppercase block">Medical File Attached:</span>
                  <span className="text-sm font-black text-slate-950 truncate block">{attachedFile.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors shrink-0"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            {/* LEFT SIDE: COMPACT IMAGE / DOCUMENT ATTACHMENT ICON BUTTON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3.5 sm:p-4 rounded-2xl border-3 transition-all shrink-0 flex items-center justify-center shadow-sm ${
                attachedFile
                  ? 'bg-forest-800 border-forest-950 text-white shadow-md'
                  : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
              }`}
              title="Attach Local Image or Document"
            >
              <ImageIcon className="w-6 h-6 text-forest-800" />
            </button>

            {/* EXPANDED SPACIOUS INPUT TEXT BOX */}
            <div className="relative flex-1">
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

            {/* RIGHT SIDE: COMPACT STT, TTS & SUBMIT BUTTONS */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* 🎤 Speech-to-Text Button */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`p-3.5 sm:px-4 sm:py-4 rounded-2xl text-base font-black transition-all border-3 shadow-md flex items-center space-x-1.5 ${
                  isListening
                    ? 'bg-red-600 border-red-800 text-white animate-pulse'
                    : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
                }`}
                title="Tap to Speak (Speech-to-Text)"
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-forest-800" />}
                <span className="hidden md:inline">{isListening ? dict.stopButton : dict.speakButton}</span>
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
                className={`p-3.5 sm:p-4 rounded-2xl border-3 transition-all ${
                  isVoiceEnabled
                    ? 'bg-forest-800 border-forest-950 text-white shadow-md'
                    : 'bg-slate-200 border-slate-400 text-slate-600'
                }`}
                title={isVoiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
              >
                {isVoiceEnabled ? <Volume2 className="w-6 h-6 text-emerald-300" /> : <VolumeX className="w-6 h-6" />}
              </button>

              {/* Submit Button */}
              <Button type="submit" variant="primary" size="lg" className="px-5 py-4 bg-forest-800 text-lg font-black rounded-2xl shrink-0">
                <Send className="w-6 h-6 text-emerald-300" />
                <span className="hidden sm:inline sm:ml-2">{dict.submitButton}</span>
              </Button>
            </div>
          </form>

          {/* 1-TAP QUICK SYMPTOM CHIPS */}
          <div className="pt-2 border-t-2 border-sand-200">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-2">
              {dict.tapQuickSymptom}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: dict.chipFever, text: "High fever (103°F) with body chills" },
                { label: dict.chipChestPain, text: "Severe chest pain & shortness of breath" },
                { label: dict.chipHeadache, text: "Severe headache and dizziness" },
                { label: dict.chipStomach, text: "Abdominal pain & continuous vomiting" },
                { label: dict.chipInjury, text: "Deep cut wound" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(chip.text);
                    handleSearchSubmit(chip.text);
                  }}
                  className="px-3.5 py-1.5 bg-sand-100 hover:bg-forest-800 hover:text-white text-slate-900 text-sm font-black rounded-xl border-2 border-sand-300 hover:border-forest-950 transition-all shadow-2xs active:scale-95"
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
            <span>Analyzing symptoms with Gemini AI Model...</span>
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
                  <p className="text-sm font-extrabold text-slate-700">Evaluated via Gemini Clinical Safety Model</p>
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

            {/* Attached File Note if present */}
            {result.attachedFile && (
              <div className="p-3.5 bg-forest-100 border-2 border-forest-400 rounded-2xl text-forest-950 font-black text-sm flex items-center space-x-3">
                <Paperclip className="w-5 h-5 text-forest-800 shrink-0" />
                <span>Medical File Analyzed by Gemini AI: {result.attachedFile}</span>
              </div>
            )}

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
