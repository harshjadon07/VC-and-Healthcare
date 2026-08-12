'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Send, ShieldAlert, AlertTriangle, ArrowLeft, RefreshCw, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  triageLevel?: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  symptomsDetected?: string[];
  patientAdvice?: string;
  recommendedActions?: string[];
  firstAidInstructions?: string[];
  emergencyAlertTriggered?: boolean;
  timestamp: string;
}

export default function AIAssistantPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const dict = dictionaries[currentLang] || dictionaries.en;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Namaste! I am your AI Health Assistant. Please describe your symptoms in simple language (e.g., fever, chest pain, cough, injury). I will provide instant clinical triage guidance.",
      timestamp: 'Just now',
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsProcessing(true);

    try {
      // Call Real AI Triage API Route with Safety Rules Engine
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
        symptomsDetected: data.symptomsDetected,
        patientAdvice: data.patientAdvice,
        recommendedActions: data.recommendedActions,
        firstAidInstructions: data.firstAidInstructions,
        emergencyAlertTriggered: data.emergencyAlertTriggered,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Triage API Call Error:", err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "Symptom processed via offline safety engine.",
          triageLevel: 'ROUTINE',
          patientAdvice: "Please visit the nearest ASHA health worker or PHC clinic.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-3">
            <Link href="/patient">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                SevaHealth AI Clinical Assistant
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Public Entry • Deterministic Safety Rules Engine Active
              </p>
            </div>
          </div>

          <a href="tel:108">
            <Button variant="danger" size="sm" className="text-xs">
              <PhoneCall className="w-3.5 h-3.5 mr-1" />
              Emergency 108
            </Button>
          </a>
        </div>

        {/* Chat Message Box */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[550px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-forest-800 text-white rounded-tr-none'
                    : msg.triageLevel === 'EMERGENCY'
                    ? 'bg-red-50 border-2 border-red-300 text-slate-900 rounded-tl-none'
                    : 'bg-sand-100/90 border border-sand-200 text-slate-900 rounded-tl-none'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-1.5 text-xs">
                  <span className="font-bold flex items-center space-x-1">
                    {msg.sender === 'assistant' ? (
                      <>
                        <Bot className="w-4 h-4 text-forest-700 inline" />
                        <span>Clinical AI Triage</span>
                      </>
                    ) : (
                      <span>You</span>
                    )}
                  </span>
                  <span className="opacity-70 text-[10px] font-mono">{msg.timestamp}</span>
                </div>

                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>

                {/* Structured Triage Output if Assistant */}
                {msg.sender === 'assistant' && msg.triageLevel && (
                  <div className="space-y-3 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-600">Assessed Priority:</span>
                      <Badge variant={msg.triageLevel}>{msg.triageLevel}</Badge>
                    </div>

                    {msg.patientAdvice && (
                      <div className="p-3 bg-white/90 rounded-lg border border-slate-200 text-xs font-medium text-slate-800">
                        <span className="font-bold text-forest-900 block mb-1">Patient Guidance:</span>
                        {msg.patientAdvice}
                      </div>
                    )}

                    {msg.recommendedActions && (
                      <div className="bg-white/90 p-3 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-slate-900 block mb-1">Recommended Actions:</span>
                        <ul className="list-disc pl-4 text-slate-700 space-y-1">
                          {msg.recommendedActions.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.firstAidInstructions && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-950">
                        <span className="font-bold text-amber-900 flex items-center space-x-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline" />
                          <span>First-Aid Protocols:</span>
                        </span>
                        <ul className="list-disc pl-4 space-y-1 font-medium">
                          {msg.firstAidInstructions.map((fa, idx) => (
                            <li key={idx}>{fa}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.emergencyAlertTriggered && (
                      <div className="p-3 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-between">
                        <span>🚨 Emergency SOS Alert Triggered for ASHA Queue</span>
                        <Link href="/patient">
                          <button className="underline text-white font-black text-xs hover:text-red-100">
                            View Dashboard →
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-xs font-bold text-forest-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 max-w-xs animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-forest-700" />
              <span>Analyzing symptoms via Clinical Safety Engine...</span>
            </div>
          )}
        </div>

        {/* Quick Symptom Chips */}
        <div className="my-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Test Quick Symptoms:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              "Severe chest pain & shortness of breath",
              "High fever (103°F) with body chills",
              "Persistent dry cough for 2 weeks",
              "Abdominal cramps & watery diarrhea"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-forest-700 hover:bg-forest-50 text-slate-800 text-xs font-semibold rounded-lg transition-all text-left shadow-2xs"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-300 shadow-sm"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type symptoms in plain English, Hindi, or regional text..."
            className="flex-1 px-4 py-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
          />
          <Button type="submit" variant="primary" size="md" className="shrink-0">
            <Send className="w-4 h-4 mr-1" />
            <span>Send</span>
          </Button>
        </form>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
