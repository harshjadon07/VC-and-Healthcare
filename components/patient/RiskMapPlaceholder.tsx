'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Activity, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_RISK_ALERTS, RiskAlertData } from '@/lib/mock-data';

export const RiskMapPlaceholder: React.FC = () => {
  const [alerts, setAlerts] = useState<RiskAlertData[]>(MOCK_RISK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlertData>(MOCK_RISK_ALERTS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRiskMap = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/risk-map');
        const data = await res.json();
        if (data && data.alerts && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
          setSelectedAlert(data.alerts[0]);
        }
      } catch (err) {
        console.error("Error loading live risk map API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiskMap();
  }, []);

  return (
    <Card className="border-forest-200 bg-linear-to-br from-white to-sand-50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 text-forest-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Surveillance Radar</span>
            </div>
            <CardTitle className="text-xl">Regional Disease Risk Map & Alerts</CardTitle>
            <CardDescription>
              Live health alerts, vector warnings, and preventive protocols across districts.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <MapPin className="w-4 h-4 text-forest-800" />
            <span className="text-xs font-bold text-forest-900">Pune & Satara Sector</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map Visual */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between min-h-[260px] relative overflow-hidden">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  [District Heatmap Surveillance]
                </span>
                <h4 className="text-lg font-bold mt-1 text-white">
                  Active Monitoring: 3 Talukas
                </h4>
              </div>
              <span className="bg-red-950/80 text-red-400 border border-red-800 text-xs px-2.5 py-1 rounded-full font-mono flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>LIVE RADAR</span>
              </span>
            </div>

            {/* Region Pins on Map */}
            <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-400/30'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold">{alert.region}</span>
                      <Badge variant={alert.riskLevel === 'Outbreak' ? 'EMERGENCY' : alert.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'}>
                        {alert.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-emerald-300 truncate">
                      {alert.disease}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {alert.affectedCount} cases flagged
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Updated: {selectedAlert?.updatedAt || 'Live'}</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <span>Select region pin for details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Selected Alert Details Box */}
          {selectedAlert && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alert Focus
                  </span>
                  <Badge variant={selectedAlert.riskLevel === 'Outbreak' ? 'EMERGENCY' : selectedAlert.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'}>
                    {selectedAlert.riskLevel} Risk
                  </Badge>
                </div>

                <h4 className="text-lg font-black text-slate-900">
                  {selectedAlert.disease}
                </h4>
                <p className="text-xs font-bold text-forest-800 mt-0.5">
                  {selectedAlert.region} ({selectedAlert.district})
                </p>

                {/* Symptoms */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Key Symptoms to Watch</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAlert.symptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prevention Guidelines */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-800" />
                    <span>Preventive Actions</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 font-medium">
                    {selectedAlert.prevention.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 flex justify-between items-center">
                <span>ASHA Surveillance Active</span>
                <span className="text-forest-800">Verified by PHC Officer</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
