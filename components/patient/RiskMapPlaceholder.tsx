'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MOCK_RISK_ALERTS, RiskAlertData } from '@/lib/mock-data';

export const RiskMapPlaceholder: React.FC = () => {
  const [alerts, setAlerts] = useState<RiskAlertData[]>(MOCK_RISK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlertData>(MOCK_RISK_ALERTS[0]);

  useEffect(() => {
    const fetchRiskMap = async () => {
      try {
        const res = await fetch('/api/risk-map');
        const data = await res.json();
        if (data && data.alerts && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
          setSelectedAlert(data.alerts[0]);
        }
      } catch (err) {
        console.error("Error loading live risk map API:", err);
      }
    };
    fetchRiskMap();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sand-300 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 font-black text-sm uppercase tracking-wider mb-1">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Surveillance Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Regional Disease Risk Map & Alerts</h2>
          <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">
            Live health warnings and prevention guidelines for your district.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-2xl border-2 border-emerald-400 shrink-0">
          <MapPin className="w-6 h-6 text-forest-900" />
          <span className="text-base font-black text-forest-950">Pune & Satara Sector</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Cards */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[300px] border-4 border-slate-900 shadow-inner">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                [District Heatmap Radar]
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-white">
                Active Monitoring: 3 Talukas
              </h3>
            </div>
            <span className="bg-red-950 text-red-400 border-2 border-red-700 text-xs px-3 py-1.5 rounded-full font-mono font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span>LIVE RADAR</span>
            </span>
          </div>

          {/* Region Buttons */}
          <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-2xl border-3 text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm mb-1 font-black">
                    <span>{alert.region}</span>
                    <Badge variant={alert.riskLevel === 'Outbreak' ? 'EMERGENCY' : alert.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'} className="text-xs px-2 py-0.5 font-bold">
                      {alert.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-base font-extrabold text-emerald-300 truncate">
                    {alert.disease}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block font-bold">
                    {alert.affectedCount} cases flagged
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-800 pt-3 font-bold">
            <span>Updated: {selectedAlert?.updatedAt || 'Live'}</span>
            <span className="text-emerald-400 font-extrabold flex items-center space-x-1">
              <span>Tap region box to see details</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Selected Alert Details Box */}
        {selectedAlert && (
          <div className="bg-sand-50 rounded-3xl p-6 border-4 border-sand-300 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  Selected Focus
                </span>
                <Badge variant={selectedAlert.riskLevel === 'Outbreak' ? 'EMERGENCY' : selectedAlert.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'} className="text-sm px-3 py-1 font-black">
                  {selectedAlert.riskLevel} Risk
                </Badge>
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {selectedAlert.disease}
              </h3>
              <p className="text-base font-black text-forest-900 mt-0.5">
                {selectedAlert.region} ({selectedAlert.district})
              </p>

              {/* Symptoms */}
              <div className="mt-4">
                <span className="text-sm font-black text-slate-900 flex items-center space-x-1.5 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Key Symptoms to Watch</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAlert.symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-950 text-sm font-black rounded-xl"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prevention Guidelines */}
              <div className="mt-4">
                <span className="text-sm font-black text-slate-900 flex items-center space-x-1.5 mb-2">
                  <ShieldCheck className="w-5 h-5 text-forest-800" />
                  <span>Prevention Guidelines</span>
                </span>
                <ul className="space-y-1.5 text-sm text-slate-900 font-extrabold">
                  {selectedAlert.prevention.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-forest-800 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-sand-300 text-xs font-black text-slate-700 flex justify-between items-center">
              <span>ASHA Surveillance Active</span>
              <span className="text-forest-900">Verified by PHC Officer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
