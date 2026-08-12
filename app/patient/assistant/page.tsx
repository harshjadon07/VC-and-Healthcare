'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, AlertTriangle, ArrowLeft, PhoneCall, Sparkles, Image as ImageIcon, X, FileText, Paperclip } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language, dictionaries } from '@/lib/i18n/dictionary';
import { SpeechToTextEngine, speakText, stopSpeaking } from '@/lib/speech';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  triageLevel?: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  patientAdvice?: string;
  recommendedActions?: string[];
  firstAidInstructions?: string[];
  attachedFile?: string;
  timestamp: string;
}

export default function AIAssistantPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // File attachment state
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Namaste! I am your AI Health Assistant. You can attach medical images/documents, speak into the mic, or type symptoms.",
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    sttEngineRef.current = new SpeechToTextEngine();
    return () => {
      stopSpeaking();
      if (sttEngineRef.current) {
        sttEngineRef.current.stopListening();
      }
    };
  }, []);

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
      alert("Speech recognition is not supported in this browser. You can type your symptoms.");
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
          setInputQuery(transcript);
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

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() && !attachedFile) return;

    if (isListening && sttEngineRef.current) {
      sttEngineRef.current.stopListening();
      setIsListening(false);
    }

    const currentFileObj = attachedFile;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query || (currentFileObj ? `[Attached File: ${currentFileObj.name}]` : "Medical document attached"),
      attachedFile: currentFileObj?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsProcessing(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: query || "Attached image / document evaluation",
          language: currentLang,
          attachmentName: currentFileObj?.name,
          attachmentData: currentFileObj?.base64Data,
          mimeType: currentFileObj?.mimeType,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.summary || "Assessed clinical status:",
        triageLevel: data.triageLevel,
        patientAdvice: data.patientAdvice,
        recommendedActions: data.recommendedActions,
        firstAidInstructions: data.firstAidInstructions,
        attachedFile: data.attachedFile,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (isVoiceEnabled && data.patientAdvice) {
        speakText(`${data.summary}. ${data.patientAdvice}`, currentLang);
      }
    } catch (err) {
      console.error("AI Triage API Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col space-y-4">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border-4 border-sand-300 shadow-md">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="outline" size="md" className="p-3">
                <ArrowLeft className="w-6 h-6 text-slate-800" />
              </Button>
            </Link>
            <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
              <Bot className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                AI Health Assistant (Gemini 2.0 AI)
              </h1>
              <p className="text-sm font-extrabold text-forest-800">
                Spacious Input, Image Attachment & Speech Active
              </p>
            </div>
          </div>

          <a href="tel:108">
            <Button variant="danger" size="md" className="text-base font-black px-4 py-3 rounded-2xl">
              <PhoneCall className="w-5 h-5 mr-1" />
              108 Emergency
            </Button>
          </a>
        </div>

        {/* 1-Tap Symptom Chips */}
        <div className="bg-white p-3.5 rounded-3xl border-4 border-sand-300 shadow-sm space-y-2">
          <span className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-forest-800" />
            <span>Tap Quick Symptom:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "🤒 High Fever", text: "High fever (103°F) with body chills" },
              { label: "🫁 Chest Pain", text: "Severe chest pain & shortness of breath" },
              { label: "🤕 Severe Headache", text: "Severe headache and dizziness" },
              { label: "🤢 Vomiting", text: "Abdominal cramps & watery diarrhea" },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.text)}
                className="px-3.5 py-1.5 bg-sand-100 hover:bg-forest-800 hover:text-white text-slate-900 text-sm font-black rounded-xl border-2 border-sand-300 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Display Box */}
        <div className="flex-1 bg-white rounded-3xl border-4 border-sand-300 shadow-md p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[380px] max-h-[500px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 space-y-3 border-2 ${
                  msg.sender === 'user'
                    ? 'bg-forest-800 text-white border-forest-950 rounded-tr-none'
                    : msg.triageLevel === 'EMERGENCY'
                    ? 'bg-red-50 border-4 border-red-500 text-slate-950 rounded-tl-none'
                    : 'bg-sand-100 border-2 border-sand-300 text-slate-950 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b-2 border-black/10 pb-2 text-sm font-black">
                  <span>{msg.sender === 'assistant' ? 'AI Advice' : 'You'}</span>
                  <span className="opacity-75 text-xs font-mono">{msg.timestamp}</span>
                </div>

                {msg.attachedFile && (
                  <div className="p-2.5 bg-white/20 rounded-xl text-xs font-black flex items-center space-x-1.5">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span>File Attached: {msg.attachedFile}</span>
                  </div>
                )}

                <p className="text-base sm:text-lg font-extrabold leading-relaxed">{msg.text}</p>

                {msg.sender === 'assistant' && msg.patientAdvice && (
                  <div className="p-3 bg-white rounded-xl border-2 border-slate-300 text-base font-extrabold text-slate-900">
                    <span className="font-black text-forest-900 block mb-1">Patient Advice:</span>
                    {msg.patientAdvice}
                  </div>
                )}

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(`${msg.text}. ${msg.patientAdvice || ''}`, currentLang)}
                    className="flex items-center space-x-1.5 text-xs font-black text-forest-900 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-400 hover:bg-emerald-200"
                  >
                    <Volume2 className="w-4 h-4 text-forest-800" />
                    <span>Read Out Loud</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center space-x-3 text-base font-black text-forest-900 bg-emerald-100 p-4 rounded-2xl border-2 border-emerald-400 max-w-xs animate-pulse">
              <RefreshCw className="w-5 h-5 animate-spin text-forest-800" />
              <span>Analyzing symptoms with Gemini AI...</span>
            </div>
          )}
        </div>

        {/* SPACIOUS INPUT BAR WITH COMPACT ACTION BUTTONS */}
        <div className="bg-white p-3 rounded-3xl border-4 border-sand-300 shadow-md space-y-2">
          
          {/* Hidden File Picker Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />

          {/* Attached File Preview Pill */}
          {attachedFile && (
            <div className="flex items-center justify-between bg-forest-50 border-2 border-forest-400 p-2 rounded-2xl text-xs font-black">
              <div className="flex items-center space-x-2 truncate">
                <ImageIcon className="w-4 h-4 text-forest-800 shrink-0" />
                <span className="truncate">Attached: {attachedFile.name}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* LEFT SIDE: COMPACT IMAGE / DOCUMENT ATTACHMENT ICON BUTTON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-2xl border-2 transition-all shrink-0 ${
                attachedFile ? 'bg-forest-800 border-forest-950 text-white' : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
              }`}
              title="Attach Image or Document"
            >
              <ImageIcon className="w-5 h-5 text-forest-800" />
            </button>

            {/* EXPANDED SPACIOUS INPUT TEXT BOX */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening ? "Listening... Speak now..." : "Type symptoms or attach image..."
              }
              className={`flex-1 px-4 py-3 text-base sm:text-lg font-extrabold text-slate-950 bg-sand-50 border-2 rounded-2xl focus:outline-none ${
                isListening ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />

            {/* COMPACT STT MICROPHONE BUTTON */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`p-3 rounded-2xl border-2 transition-all ${
                isListening ? 'bg-red-600 border-red-800 text-white animate-pulse' : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
              }`}
              title="🎤 Microphone (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-forest-800" />}
            </button>

            {/* COMPACT TTS VOICE READOUT BUTTON */}
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
              className={`p-3 rounded-2xl border-2 transition-all ${
                isVoiceEnabled ? 'bg-forest-800 border-forest-950 text-white' : 'bg-slate-200 border-slate-400 text-slate-600'
              }`}
              title={isVoiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
            >
              {isVoiceEnabled ? <Volume2 className="w-5 h-5 text-emerald-300" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* SUBMIT BUTTON */}
            <Button type="submit" variant="primary" size="lg" className="px-5 py-3 bg-forest-800 font-black shrink-0">
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline sm:ml-1.5">Send</span>
            </Button>
          </form>
        </div>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
