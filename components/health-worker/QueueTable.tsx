'use client';

import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, AlertTriangle, Eye, CheckCircle2, Plus, Ticket, RefreshCw, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TokenTicket } from '@/lib/token-queue';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface QueueTableProps {
  currentLang: Language;
}

export const QueueTable: React.FC<QueueTableProps> = ({ currentLang }) => {
  const dict = dictionaries[currentLang] || dictionaries.en;
  const [tokens, setTokens] = useState<TokenTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [selectedToken, setSelectedToken] = useState<TokenTicket | null>(null);

  // New Patient Registration Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('35');
  const [regGender, setRegGender] = useState('Female');
  const [regVillage, setRegVillage] = useState('Khed Shivapur');
  const [regPhone, setRegPhone] = useState('+91 98223 45678');
  const [regComplaint, setRegComplaint] = useState('');
  const [regTriageLevel, setRegTriageLevel] = useState<'EMERGENCY' | 'URGENT' | 'ROUTINE'>('URGENT');

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue');
      const data = await res.json();
      if (data.queue) {
        setTokens(data.queue);
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regComplaint.trim()) return;

    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: regName.trim(),
          age: parseInt(regAge) || 35,
          gender: regGender,
          village: regVillage,
          phone: regPhone,
          chiefComplaint: regComplaint.trim(),
          triageLevel: regTriageLevel,
          aiSummary: `ASHA Registered Triage Ticket (${regTriageLevel}): ${regComplaint}`,
          symptoms: [regComplaint]
        }),
      });

      const data = await res.json();
      if (data.ticket) {
        setTokens((prev) => [data.ticket, ...prev]);
        setIsRegisterOpen(false);
        setRegName('');
        setRegComplaint('');
        alert(`🎉 Unique Patient Token Ticket Generated: ${data.ticket.tokenNumber}`);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleUpdateStatus = async (tokenNumber: string, newStatus: TokenTicket['status']) => {
    try {
      const res = await fetch('/api/queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.ticket) {
        setTokens((prev) =>
          prev.map((t) => (t.tokenNumber === tokenNumber ? data.ticket : t))
        );
      }
    } catch (err) {
      console.error('Failed to update token status:', err);
    }
  };

  const filteredTokens = tokens.filter((t) => {
    const matchesSearch =
      t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filterLevel === 'ALL' || t.triageLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-white rounded-3xl border-4 border-sand-300 shadow-md overflow-hidden space-y-4">
      {/* Header Controls */}
      <div className="p-6 border-b-4 border-sand-200 bg-sand-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 font-black text-sm uppercase tracking-wider mb-1">
            <Ticket className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Dynamic Token Queue Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">ASHA Patient Token Queue</h2>
          <p className="text-base sm:text-lg text-slate-800 font-extrabold mt-1">
            Every patient has a unique authentication token number. Register new patients or dispatch urgent tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search Token (e.g. SEVA-TK-123456)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base font-black bg-white border-2 border-slate-400 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-forest-800"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-sand-200 p-1.5 rounded-2xl text-sm font-black">
            {['ALL', 'EMERGENCY', 'URGENT', 'ROUTINE'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-2 rounded-xl transition-all ${
                  filterLevel === lvl
                    ? 'bg-forest-800 text-white shadow-sm font-black'
                    : 'text-slate-800 hover:text-slate-950 font-bold'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Register Patient Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-3 font-black text-base rounded-2xl shadow-md shrink-0"
          >
            <Plus className="w-5 h-5 mr-1" />
            <span>+ Issue Patient Token</span>
          </Button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand-100 border-b-2 border-slate-300 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              <th className="py-4 px-4">Unique Token Ticket</th>
              <th className="py-4 px-4">{dict.patientName}</th>
              <th className="py-4 px-4">{dict.ageGender}</th>
              <th className="py-4 px-4">{dict.village}</th>
              <th className="py-4 px-4">{dict.chiefComplaint}</th>
              <th className="py-4 px-4">{dict.triageStatus}</th>
              <th className="py-4 px-4 text-right">{dict.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200 text-base font-extrabold text-slate-900">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-600 font-black text-lg">
                  <RefreshCw className="w-8 h-8 text-forest-800 animate-spin mx-auto mb-2" />
                  <span>Loading Live Token Queue...</span>
                </td>
              </tr>
            ) : filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-600 font-black text-lg">
                  <Ticket className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p>No active patient token tickets in queue.</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">Tap "+ Issue Patient Token" above to register a patient.</p>
                </td>
              </tr>
            ) : (
              filteredTokens.map((t) => (
                <tr
                  key={t.tokenNumber}
                  className={`hover:bg-sand-100/80 transition-colors ${
                    t.emergencyAlertTriggered ? 'bg-red-50' : ''
                  }`}
                >
                  {/* Token Number */}
                  <td className="py-4 px-4 font-mono font-black text-forest-900 text-base">
                    <span className="bg-emerald-100 border border-emerald-400 px-3 py-1 rounded-xl text-forest-950 block w-fit shadow-2xs">
                      🎫 {t.tokenNumber}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {t.emergencyAlertTriggered && (
                        <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce shrink-0" />
                      )}
                      <div>
                        <span className="font-black text-slate-950 text-base block leading-snug">
                          {t.patientName}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">{t.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm font-black text-slate-800">
                    {t.age} yrs / {t.gender}
                  </td>

                  <td className="py-4 px-4 text-sm font-black text-slate-900">
                    {t.village} ({t.district})
                  </td>

                  <td className="py-4 px-4 text-sm text-slate-800 max-w-xs truncate font-extrabold">
                    {t.chiefComplaint}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={t.triageLevel} className="text-xs px-3 py-1 font-black">
                      {t.triageLevel}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedToken(t)}
                        className="text-sm font-black border-2"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Inspect
                      </Button>

                      {t.status !== 'COMPLETED' ? (
                        <Button
                          variant={t.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                          size="sm"
                          onClick={() => handleUpdateStatus(t.tokenNumber, 'COMPLETED')}
                          className="text-sm font-black"
                        >
                          <Stethoscope className="w-4 h-4 mr-1" />
                          Consult
                        </Button>
                      ) : (
                        <span className="text-sm font-black text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Token Detail Modal */}
      <Modal
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        title={selectedToken ? `Token Authentication Ticket: ${selectedToken.tokenNumber}` : ''}
      >
        {selectedToken && (
          <div className="space-y-5">
            <div className="flex justify-between items-start bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
              <div>
                <p className="text-xs font-black text-slate-600 uppercase">Patient Name & Village</p>
                <p className="text-xl font-black text-slate-950">{selectedToken.patientName} ({selectedToken.age} {selectedToken.gender})</p>
                <p className="text-sm font-bold text-slate-700">📍 {selectedToken.village}, {selectedToken.district} • 📞 {selectedToken.phone}</p>
              </div>
              <Badge variant={selectedToken.triageLevel} className="text-sm px-3 py-1 font-black">{selectedToken.triageLevel}</Badge>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase mb-2">Vitals & Biometrics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-mono bg-white p-4 rounded-2xl border-2 border-slate-300">
                <div>BP: <span className="font-black text-slate-950">{selectedToken.vitals.bp}</span></div>
                <div>Temp: <span className="font-black text-slate-950">{selectedToken.vitals.temp}</span></div>
                <div>Pulse: <span className="font-black text-slate-950">{selectedToken.vitals.heartRate}</span></div>
                <div>SpO2: <span className="font-black text-slate-950">{selectedToken.vitals.spo2}</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-forest-900 uppercase mb-2">AI Clinical Triage Summary</h4>
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-base font-bold leading-relaxed">
                {selectedToken.aiSummary}
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-200 flex justify-end space-x-3">
              <Button variant="outline" size="md" onClick={() => setSelectedToken(null)}>
                Close
              </Button>
              <Button
                variant={selectedToken.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                size="lg"
                onClick={() => {
                  handleUpdateStatus(selectedToken.tokenNumber, 'COMPLETED');
                  setSelectedToken(null);
                }}
                className="text-base font-black"
              >
                Mark Consultation Completed
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Patient Token Registration Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Issue New Patient Unique Token Ticket"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Patient Full Name *</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Radhika Sharma"
              className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">Age *</label>
              <input
                type="number"
                required
                value={regAge}
                onChange={(e) => setRegAge(e.target.value)}
                className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">Gender *</label>
              <select
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
                className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">Village / Gram *</label>
              <input
                type="text"
                required
                value={regVillage}
                onChange={(e) => setRegVillage(e.target.value)}
                className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Chief Symptoms / Complaint *</label>
            <textarea
              required
              rows={3}
              value={regComplaint}
              onChange={(e) => setRegComplaint(e.target.value)}
              placeholder="Describe main symptoms..."
              className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Triage Level *</label>
            <select
              value={regTriageLevel}
              onChange={(e) => setRegTriageLevel(e.target.value as any)}
              className="w-full text-sm font-bold p-3 bg-sand-50 border-2 border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800"
            >
              <option value="ROUTINE">🟢 ROUTINE (Normal check-up)</option>
              <option value="URGENT">🟡 URGENT (Fever, pain, infection)</option>
              <option value="EMERGENCY">🔴 EMERGENCY (Chest pain, breathing difficulty)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full text-base font-black py-3.5">
            Generate Unique Token Ticket →
          </Button>
        </form>
      </Modal>
    </div>
  );
};
