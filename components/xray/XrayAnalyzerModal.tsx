'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Cpu, AlertTriangle, CheckCircle2, RefreshCw, Server, X, Activity, Stethoscope, Eye, Code, ShieldAlert, HeartPulse, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface XrayPredictionResult {
  classification: string;
  confidence: number;
  risk_level: string;
  recommendation: string;
  serverSource?: string;
  isLocalServer?: boolean;
}

interface XrayAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XrayAnalyzerModal: React.FC<XrayAnalyzerModalProps> = ({ isOpen, onClose }) => {
  const [serverUrl, setServerUrl] = useState('https://01aa370f95b7ee9914.gradio.live/');
  const [patientName, setPatientName] = useState('Rural Resident');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<XrayPredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [viewMode, setViewMode] = useState<'VISUAL' | 'JSON'>('VISUAL');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMsg('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('serverUrl', serverUrl.trim());
      formData.append('patientName', patientName.trim());

      const res = await fetch('/api/xray-predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        // Automatically redirect webpage to Gradio Live Website after uploading
        const targetGradioUrl = serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`;
        window.open(targetGradioUrl, '_blank');
      } else {
        setErrorMsg(data.error || `AI Diagnostic Server (${serverUrl}) unreachable.`);
      }
    } catch (err) {
      console.error('X-Ray prediction error:', err);
      setErrorMsg(`Unable to connect to AI Diagnostic Server at ${serverUrl}.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🩻 Chest X-Ray AI Diagnostic Center">
      <div className="space-y-6">
        
        {/* Server Config Ribbon */}
        <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300 space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase text-forest-900">
            <span className="flex items-center space-x-1.5">
              <Server className="w-4 h-4 text-forest-800" />
              <span>AI Diagnostic Server Endpoint:</span>
            </span>
            <span className="text-emerald-700 font-mono font-bold">
              {serverUrl.includes('gradio.live') ? '⚡ Gradio Live AI Server' : '💻 Local Python Server'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://01aa370f95b7ee9914.gradio.live/"
              className="flex-1 text-xs font-mono font-black p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
            <div className="flex space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setServerUrl('https://01aa370f95b7ee9914.gradio.live/')}
                className={`px-3 py-2 text-xs font-black rounded-xl border ${
                  serverUrl.includes('gradio.live')
                    ? 'bg-forest-800 text-white border-forest-900'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                ⚡ Gradio Live
              </button>
              <button
                type="button"
                onClick={() => setServerUrl('http://10.109.112.128:5000/predict')}
                className={`px-3 py-2 text-xs font-black rounded-xl border ${
                  serverUrl.includes('10.109.112.128')
                    ? 'bg-forest-800 text-white border-forest-900'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                💻 Local IP
              </button>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Patient Name (Optional)</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Ramesh Patil"
              className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            accept="image/*,.dicom"
            className="hidden"
          />

          {/* Drag & Drop Target / Image Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-3 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              previewUrl
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-sand-400 bg-sand-50 hover:bg-sand-100'
            }`}
          >
            {previewUrl ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Chest X-Ray Preview"
                  className="max-h-64 mx-auto rounded-2xl border-4 border-slate-900 shadow-md object-contain bg-black"
                />
                <div className="flex items-center justify-center space-x-2 text-xs font-black text-forest-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>X-Ray Image Attached: {selectedFile?.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setResult(null);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 underline font-black ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-900 flex items-center justify-center mx-auto shadow-xs">
                  <UploadCloud className="w-8 h-8 text-forest-800" />
                </div>
                <div>
                  <p className="text-base font-black text-slate-950">Tap to Select or Drag Chest X-Ray Image</p>
                  <p className="text-xs font-bold text-slate-600 mt-1">Supports JPEG, PNG, DICOM (.jpg, .png)</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!selectedFile || isAnalyzing}
            className="w-full text-base font-black py-4 rounded-2xl shadow-md"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                <span>Posting X-Ray to {serverUrl}...</span>
              </>
            ) : (
              <>
                <Cpu className="w-5 h-5 mr-2 text-emerald-300" />
                <span>Analyze X-Ray via Local LLM Server →</span>
              </>
            )}
          </Button>
        </form>

        {/* Error Output */}
        {errorMsg && (
          <div className="p-4 bg-red-100 border-2 border-red-400 text-red-950 font-black text-sm rounded-2xl flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* RICH VISUAL DIAGNOSTIC REPORT RESULT */}
        {result && (
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* VIEW MODE TOGGLE HEADER */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-forest-800" />
                <span className="text-sm font-black text-slate-950 uppercase tracking-tight">
                  Diagnostic Report Presentation
                </span>
              </div>

              <div className="flex bg-slate-100 border-2 border-slate-300 p-1 rounded-xl text-xs font-black">
                <button
                  type="button"
                  onClick={() => setViewMode('VISUAL')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    viewMode === 'VISUAL' ? 'bg-forest-800 text-white shadow-2xs' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Visual Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('JSON')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    viewMode === 'JSON' ? 'bg-forest-800 text-white shadow-2xs' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Raw JSON Code</span>
                </button>
              </div>
            </div>

            {/* TAB 1: VISUAL CLINICAL DASHBOARD MODE */}
            {viewMode === 'VISUAL' && (
              <div className="space-y-6">
                
                {/* 1. VISUAL PATHOLOGY CLASSIFICATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Pathology Classification */}
                  <div className="md:col-span-2 bg-slate-950 text-white p-5 rounded-2xl border-2 border-slate-900 shadow-md flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black shadow-md ${
                      result.classification.includes('PNEUMONIA') || result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY'
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      <HeartPulse className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-black text-emerald-400 uppercase block">
                        AI CLASSIFICATION RESULT
                      </span>
                      <h3 className="text-2xl font-black tracking-tight leading-snug">
                        {result.classification}
                      </h3>
                      <span className="text-xs font-mono font-bold text-slate-400 block mt-1">
                        Source: {result.serverSource || 'Local LLM Server'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Risk Assessment Badge */}
                  <div className={`p-5 rounded-2xl border-2 shadow-md flex flex-col justify-between ${
                    result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY'
                      ? 'bg-red-50 border-red-500 text-red-950'
                      : result.risk_level === 'MODERATE' || result.risk_level === 'URGENT'
                      ? 'bg-amber-50 border-amber-400 text-amber-950'
                      : 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  }`}>
                    <span className="text-xs font-black uppercase tracking-wider block opacity-80">
                      Triage Risk Assessment
                    </span>
                    <div className="my-2">
                      <span className="text-2xl font-black uppercase tracking-tight block">
                        {result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY' ? '🔴 HIGH RISK' : 
                         result.risk_level === 'MODERATE' || result.risk_level === 'URGENT' ? '🟡 MODERATE' : '🟢 ROUTINE'}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold">
                      {result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY' ? 'Requires Immediate Clinical Attention' : 'Routine Monitoring'}
                    </span>
                  </div>
                </div>

                {/* 2. CONFIDENCE VISUAL GAUGE & PROGRESS METER */}
                <div className="bg-sand-50 p-5 rounded-2xl border-2 border-sand-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-900 flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-forest-800" />
                      <span>Model Confidence Visual Gauge:</span>
                    </span>
                    <span className="text-xl font-black font-mono text-forest-950">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>

                  {/* Visual Progress Bar Meter */}
                  <div className="w-full bg-slate-200 h-5 rounded-full overflow-hidden border-2 border-slate-300 shadow-inner">
                    <div
                      className={`h-full transition-all duration-700 ${
                        result.confidence > 0.85 ? 'bg-red-600' : result.confidence > 0.6 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-600 text-right">
                    Calculated via deep convolutional neural network feature activation maps.
                  </p>
                </div>

                {/* 3. CLINICAL RECOMMENDATION ALERT PANEL */}
                <div className="p-5 bg-emerald-50 border-3 border-emerald-400 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-forest-950 uppercase flex items-center space-x-2 text-base">
                    <Stethoscope className="w-5 h-5 text-forest-800" />
                    <span>Clinical AI Actionable Recommendation:</span>
                  </span>
                  <p className="text-lg font-extrabold text-slate-950 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>

                {/* 4. METADATA VISUAL METRICS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono font-bold">
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block">Input File:</span>
                    <span className="font-black text-slate-950 truncate block">{selectedFile?.name || 'xray.jpg'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block">Endpoint:</span>
                    <span className="font-black text-slate-950 truncate block">{serverUrl.replace('https://', '').replace('http://', '')}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block">Confidence:</span>
                    <span className="font-black text-forest-900 block">{result.confidence}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block">Supabase Storage:</span>
                    <span className="font-black text-emerald-700 block">Saved ✅</span>
                  </div>
                </div>

                {/* 5. OPEN DEDICATED WEBPAGE REPORT BUTTON */}
                <div className="pt-2">
                  <a
                    href="/patient/xray"
                    className="w-full block text-center font-black bg-forest-800 hover:bg-forest-900 text-white p-4 rounded-2xl shadow-md border-2 border-forest-950 text-sm"
                  >
                    🩻 Open Full Dedicated Website Report Page →
                  </a>
                </div>

              </div>
            )}

            {/* TAB 2: RAW JSON CODE PREVIEW */}
            {viewMode === 'JSON' && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-black text-slate-500 uppercase block">
                  Raw JSON REST API Output Payload:
                </span>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs sm:text-sm font-mono overflow-x-auto border-2 border-slate-950 shadow-inner">
{JSON.stringify({
  classification: result.classification,
  confidence: result.confidence,
  risk_level: result.risk_level,
  recommendation: result.recommendation
}, null, 2)}
                </pre>
              </div>
            )}

          </div>
        )}
      </div>
    </Modal>
  );
};
