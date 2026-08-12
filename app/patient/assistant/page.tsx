'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, AlertTriangle, ArrowLeft, PhoneCall, Sparkles } from 'lucide-react';
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
  timestamp: string;
}

export default function AIAssistantPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const sttEngineRef = useRef<SpeechToTextEngine | null>(null);
  const dict = dictionaries[currentLang] || dictionaries.en;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Namaste! I am your AI Health Assistant. Please tap the microphone to speak or type your symptoms. I will guide you out loud.",
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
    if (!query.trim()) return;

    if (isListening && sttEngineRef.current) {
      sttEngineRef.current.stopListening();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsProcessing(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: query, language: currentLang }),
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col space-y-4">
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
                AI Health Assistant (Voice + Text)
              </h1>
              <p className="text-sm font-extrabold text-forest-800">
                Speech-to-Text & Voice Readout Active
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
        <div className="bg-white p-4 rounded-3xl border-4 border-sand-300 shadow-sm space-y-2">
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
              <span>Analyzing symptoms...</span>
            </div>
          )}
        </div>

        {/* Input Bar with STT & TTS */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3 bg-white p-3 rounded-3xl border-4 border-sand-300 shadow-md"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isListening ? "Listening... Speak now..." : "Type or speak symptoms in your language..."
            }
            className={`flex-1 px-4 py-3 text-base sm:text-lg font-extrabold text-slate-950 bg-sand-50 border-2 rounded-2xl focus:outline-none ${
              isListening ? 'border-red-500 bg-red-50' : 'border-slate-300'
            }`}
          />

          <button
            type="button"
            onClick={handleToggleListening}
            className={`p-3.5 rounded-2xl border-2 transition-all ${
              isListening ? 'bg-red-600 border-red-800 text-white animate-pulse' : 'bg-emerald-100 border-emerald-400 text-forest-950 hover:bg-emerald-200'
            }`}
            title="🎤 Microphone (Speech-to-Text)"
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-forest-800" />}
          </button>

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
            className={`p-3.5 rounded-2xl border-2 transition-all ${
              isVoiceEnabled ? 'bg-forest-800 border-forest-950 text-white' : 'bg-slate-200 border-slate-400 text-slate-600'
            }`}
            title={isVoiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
          >
            {isVoiceEnabled ? <Volume2 className="w-6 h-6 text-emerald-300" /> : <VolumeX className="w-6 h-6" />}
          </button>

          <Button type="submit" variant="primary" size="lg" className="px-6 py-3.5 bg-forest-800 font-black">
            <Send className="w-5 h-5 mr-1" />
            <span>Send</span>
          </Button>
        </form>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
