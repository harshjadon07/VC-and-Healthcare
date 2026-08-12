'use client';

import React, { useState } from 'react';
import { Ticket, Search, CheckCircle2, Clock, AlertTriangle, ShieldCheck, UserCheck, Stethoscope, RefreshCw } from 'lucide-react';
import { TokenTicket } from '@/lib/token-queue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TokenAuthLookup: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [ticket, setTicket] = useState<TokenTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setTicket(null);

    try {
      const res = await fetch(`/api/queue?token=${encodeURIComponent(tokenInput.trim())}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setTicket(data.ticket);
      } else {
        setErrorMsg(data.error || 'Token number not found in queue.');
      }
    } catch (err) {
      console.error('Token lookup error:', err);
      setErrorMsg('Failed to verify token. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-sand-300 p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-sand-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 font-black text-sm uppercase tracking-wider mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Digital Patient Authentication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Patient Unique Token Authentication</h2>
          <p className="text-base text-slate-800 font-extrabold mt-1">
            Enter your unique token number (e.g. <code className="font-mono text-forest-800 font-black bg-emerald-100 px-2 py-0.5 rounded-md">SEVA-TK-XXXXXX</code>) to inspect live queue status and medical records.
          </p>
        </div>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Ticket className="w-6 h-6 text-forest-800 absolute left-4 top-4" />
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter Unique Token (e.g. SEVA-TK-482910)..."
            className="w-full pl-13 pr-4 py-3.5 text-lg font-mono font-black uppercase text-slate-950 bg-sand-50 border-3 border-sand-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-forest-800"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-4 text-base font-black rounded-2xl shrink-0 shadow-md"
        >
          {isLoading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2 text-emerald-300" />}
          <span>Verify Token Status →</span>
        </Button>
      </form>

      {/* Error Output */}
      {errorMsg && (
        <div className="p-4 bg-red-100 border-2 border-red-400 text-red-950 font-black text-sm rounded-2xl flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Ticket Details Output */}
      {ticket && (
        <div className="bg-emerald-50 border-4 border-emerald-400 rounded-3xl p-6 space-y-5 text-slate-950">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-emerald-300 pb-4">
            <div>
              <span className="text-xs font-mono font-black text-forest-800 uppercase block">AUTHENTICATED DIGITAL HEALTH TICKET</span>
              <span className="text-2xl font-black font-mono text-forest-950">🎫 {ticket.tokenNumber}</span>
              <p className="text-base font-black text-slate-900 mt-1">
                Patient: {ticket.patientName} ({ticket.age} {ticket.gender}) • Village: {ticket.village}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={ticket.triageLevel} className="text-sm px-4 py-1.5 font-black">
                {ticket.triageLevel}
              </Badge>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                ticket.status === 'COMPLETED' ? 'bg-emerald-200 text-forest-950 border border-emerald-500' : 'bg-amber-200 text-amber-950 border border-amber-500'
              }`}>
                Status: {ticket.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold">
            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 space-y-2">
              <span className="text-xs font-black text-forest-900 uppercase block">Chief Symptoms Reported:</span>
              <p className="text-base font-extrabold text-slate-950">{ticket.chiefComplaint}</p>
              <div className="text-xs font-mono text-slate-700 pt-2 border-t border-slate-200">
                Created At: {ticket.createdAt} • Phone: {ticket.phone}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 space-y-2">
              <span className="text-xs font-black text-forest-900 uppercase block">Vitals & Biometrics Recorded:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>BP: <span className="font-black">{ticket.vitals.bp}</span></div>
                <div>Temp: <span className="font-black">{ticket.vitals.temp}</span></div>
                <div>Pulse: <span className="font-black">{ticket.vitals.heartRate}</span></div>
                <div>SpO2: <span className="font-black">{ticket.vitals.spo2}</span></div>
              </div>
            </div>
          </div>

          {/* Clinical Advice or Prescription */}
          {ticket.prescription ? (
            <div className="p-4 bg-white border-2 border-emerald-500 rounded-2xl space-y-1">
              <span className="text-xs font-black text-forest-900 uppercase flex items-center space-x-1">
                <Stethoscope className="w-4 h-4 text-forest-800" />
                <span>Doctor Tele-Prescription Issued:</span>
              </span>
              <p className="text-base font-black text-slate-950">{ticket.prescription}</p>
            </div>
          ) : (
            <div className="p-4 bg-white border-2 border-emerald-300 rounded-2xl space-y-1">
              <span className="text-xs font-black text-forest-900 uppercase block">AI Clinical Guidance:</span>
              <p className="text-sm font-bold text-slate-900">{ticket.patientAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
