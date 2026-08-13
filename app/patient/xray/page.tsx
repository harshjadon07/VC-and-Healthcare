'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { UploadCloud, FileImage, Cpu, AlertTriangle, CheckCircle2, RefreshCw, Server, ArrowLeft, Activity, Stethoscope, Eye, Code, HeartPulse, Sparkles, Printer, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Language } from '@/lib/i18n/dictionary';
import { useAuth } from '@/context/AuthContext';

interface XrayPredictionResult {
  classification: string;
  confidence: number;
  risk_level: string;
  recommendation: string;
  serverSource?: string;
  isLocalServer?: boolean;
}

export default function DedicatedXrayPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [serverUrl, setServerUrl] = useState('https://623a7d62937c60c507.gradio.live/');
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<XrayPredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [viewMode, setViewMode] = useState<'VISUAL' | 'JSON'>('VISUAL');
  const [redirectedToGradio, setRedirectedToGradio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setErrorMsg('');
      setRedirectedToGradio(false);
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
    setRedirectedToGradio(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('serverUrl', serverUrl.trim());
      formData.append('patientName', patientName.trim() || user?.name || user?.email?.split('@')[0] || 'Patient');

      const res = await fetch('/api/xray-predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setRedirectedToGradio(true);

        // Redirect webpage X-ray results to its Gradio Live website after uploading
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
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <ProtectedRoute allowedRole="PATIENT">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
          
          {/* Top Back & Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-sand-300 pb-6">
            <div>
              <Link href="/patient" className="inline-flex items-center text-sm font-black text-forest-800 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Patient Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 flex items-center space-x-3">
                <span>🩻 Chest X-Ray AI Diagnostic Center</span>
              </h1>
              <p className="text-base text-slate-700 font-extrabold mt-1">
                Upload X-Rays directly to your Gradio Live Website (<code className="font-mono text-forest-900 font-black">https://623a7d62937c60c507.gradio.live/</code>).
              </p>
            </div>

            {result && (
              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => window.print()}
                  className="font-black text-sm"
                >
                  <Printer className="w-4 h-4 mr-1.5" /> Print Report
                </Button>
              </div>
            )}
          </div>

          {/* Diagnostic Server Config Banner */}
          <div className="bg-white p-5 rounded-3xl border-4 border-sand-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase text-forest-900">
              <span className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-forest-800" />
                <span className="text-sm">Target AI Diagnostic Server Endpoint:</span>
              </span>
              <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                {serverUrl.includes('gradio.live') ? '⚡ Gradio Live AI Website' : '💻 Local Network IP'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://623a7d62937c60c507.gradio.live/"
                className="flex-1 text-sm font-mono font-black p-3 bg-sand-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <div className="flex space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setServerUrl('https://623a7d62937c60c507.gradio.live/')}
                  className={`px-4 py-3 text-xs font-black rounded-2xl border-2 transition-all ${
                    serverUrl.includes('gradio.live')
                      ? 'bg-forest-800 text-white border-forest-950 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  ⚡ Gradio Live
                </button>
                <button
                  type="button"
                  onClick={() => setServerUrl('http://10.109.112.128:5000/predict')}
                  className={`px-4 py-3 text-xs font-black rounded-2xl border-2 transition-all ${
                    serverUrl.includes('10.109.112.128')
                      ? 'bg-forest-800 text-white border-forest-950 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  💻 Local IP
                </button>
              </div>
            </div>
          </div>

          {/* Upload Form Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-sand-300 shadow-md space-y-6">
            <h2 className="text-xl font-black text-slate-950 flex items-center space-x-2">
              <UploadCloud className="w-6 h-6 text-forest-800" />
              <span>Select Chest X-Ray Image File</span>
            </h2>

            <form onSubmit={handleAnalyzeSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Patient Name (Optional)</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={user?.name || user?.email?.split('@')[0] || 'e.g. Ramesh Patil'}
                  className="w-full text-base font-bold p-3.5 bg-sand-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                accept="image/*,.dicom"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  previewUrl
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-sand-400 bg-sand-50 hover:bg-sand-100'
                }`}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Chest X-Ray Preview"
                      className="max-h-80 mx-auto rounded-3xl border-4 border-slate-900 shadow-lg object-contain bg-black"
                    />
                    <div className="flex items-center justify-center space-x-3 text-sm font-black text-forest-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
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
                  <div className="space-y-4 py-6">
                    <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest-900 flex items-center justify-center mx-auto shadow-xs">
                      <UploadCloud className="w-10 h-10 text-forest-800" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-950">Tap to Select or Drag Chest X-Ray Image</p>
                      <p className="text-sm font-bold text-slate-600 mt-1">Supports JPEG, PNG, DICOM (.jpg, .png)</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="xl"
                disabled={!selectedFile || isAnalyzing}
                className="w-full text-lg font-black py-5 rounded-2xl shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Analyzing X-Ray & Preparing Gradio Redirect...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-6 h-6 mr-2 text-emerald-300" />
                    <span>Upload X-Ray & Redirect to Gradio Live Website →</span>
                  </>
                )}
              </Button>
            </form>

            {/* REDIRECT BANNER NOTIFICATION */}
            {redirectedToGradio && (
              <div className="p-5 bg-emerald-100 border-4 border-emerald-500 rounded-3xl space-y-3 shadow-md">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-800 shrink-0" />
                  <div>
                    <h4 className="text-xl font-black text-emerald-950">X-Ray Uploaded & Redirected!</h4>
                    <p className="text-sm font-extrabold text-emerald-900">
                      Redirecting results to Gradio Live Website (<code className="font-mono font-black">{serverUrl}</code>). If popup was blocked, tap below:
                    </p>
                  </div>
                </div>
                <a
                  href={serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white font-black text-base py-3.5 rounded-2xl shadow-md border-2 border-forest-950"
                >
                  <ExternalLink className="w-5 h-5 text-emerald-300" />
                  <span>Open Gradio Live Website Directly →</span>
                </a>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-100 border-3 border-red-400 text-red-950 font-black text-sm rounded-2xl flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* DEDICATED FULL-PAGE VISUAL DIAGNOSTIC REPORT */}
          {result && (
            <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              
              {/* Report Title & Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-emerald-200 text-forest-950 text-xs font-mono font-black px-3 py-1 rounded-full border border-emerald-400">
                      OFFICIAL DIAGNOSTIC REPORT
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">ID: XRAY-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-950">Visual Pulmonary Assessment</h2>
                </div>

                <div className="flex bg-sand-100 border-2 border-sand-300 p-1.5 rounded-2xl text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setViewMode('VISUAL')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                      viewMode === 'VISUAL' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Visual Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('JSON')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                      viewMode === 'JSON' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>Raw JSON Code</span>
                  </button>
                </div>
              </div>

              {/* VISUAL DASHBOARD VIEW */}
              {viewMode === 'VISUAL' && (
                <div className="space-y-8">
                  
                  {/* Primary Result Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Pathology Classification */}
                    <div className="md:col-span-2 bg-slate-950 text-white p-6 sm:p-7 rounded-3xl border-4 border-slate-900 shadow-xl flex items-center space-x-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black shadow-lg ${
                        result.classification.includes('PNEUMONIA') || result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY'
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        <HeartPulse className="w-10 h-10 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-black text-emerald-400 uppercase block mb-1">
                          PATHOLOGY DIAGNOSIS CLASSIFICATION
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                          {result.classification}
                        </h3>
                        <span className="text-xs font-mono text-slate-400 block mt-2">
                          Server Source: {result.serverSource || 'AI Diagnostic Model'}
                        </span>
                      </div>
                    </div>

                    {/* Risk Badge */}
                    <div className={`p-6 rounded-3xl border-4 shadow-xl flex flex-col justify-between ${
                      result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY'
                        ? 'bg-red-50 border-red-500 text-red-950'
                        : result.risk_level === 'MODERATE' || result.risk_level === 'URGENT'
                        ? 'bg-amber-50 border-amber-400 text-amber-950'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    }`}>
                      <span className="text-xs font-black uppercase tracking-wider block opacity-80">
                        TRIAGE RISK ASSESSMENT
                      </span>
                      <div className="my-3">
                        <span className="text-3xl font-black uppercase tracking-tight block">
                          {result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY' ? '🔴 HIGH RISK' : 
                           result.risk_level === 'MODERATE' || result.risk_level === 'URGENT' ? '🟡 MODERATE' : '🟢 ROUTINE'}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold">
                        {result.risk_level === 'HIGH' || result.risk_level === 'EMERGENCY' ? 'Requires Immediate Clinical Attention' : 'Routine Clinical Monitoring'}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Progress Meter */}
                  <div className="bg-sand-50 p-6 rounded-3xl border-3 border-sand-300 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black uppercase text-slate-900 flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-forest-800" />
                        <span>AI Model Classification Confidence Rating:</span>
                      </span>
                      <span className="text-2xl font-black font-mono text-forest-950">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden border-2 border-slate-300 shadow-inner">
                      <div
                        className={`h-full transition-all duration-700 ${
                          result.confidence > 0.85 ? 'bg-red-600' : result.confidence > 0.6 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.round(result.confidence * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Clinical Recommendation Card */}
                  <div className="p-6 bg-emerald-50 border-4 border-emerald-400 rounded-3xl space-y-2 shadow-xs">
                    <span className="text-sm font-black text-forest-950 uppercase flex items-center space-x-2">
                      <Stethoscope className="w-6 h-6 text-forest-800" />
                      <span>Actionable Clinical Recommendation:</span>
                    </span>
                    <p className="text-xl font-extrabold text-slate-950 leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>

                </div>
              )}

              {/* RAW JSON VIEW */}
              {viewMode === 'JSON' && (
                <div className="space-y-3">
                  <span className="text-xs font-mono font-black text-slate-500 uppercase block">
                    JSON REST API Output Payload:
                  </span>
                  <pre className="p-6 bg-slate-900 text-emerald-400 rounded-3xl text-sm font-mono overflow-x-auto border-4 border-slate-950 shadow-inner">
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

        </main>
      </ProtectedRoute>

      <Footer currentLang={currentLang} />
    </div>
  );
}
