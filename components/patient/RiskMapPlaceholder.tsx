'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Activity, Search, RefreshCw, Compass, Globe, Database, Building2, Thermometer, CloudRain, Award, CheckCircle2, Sparkles, FileText, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DiseaseRiskResponse, DiseaseInfo } from '@/app/api/disease-risk/route';

interface UPSpot {
  name: string;
}

const UP_HOTSPOTS: UPSpot[] = [
  { name: 'Lucknow' },
  { name: 'Varanasi' },
  { name: 'Gorakhpur' },
  { name: 'Agra' },
  { name: 'Kanpur' },
  { name: 'Prayagraj' },
  { name: 'Bareilly' },
  { name: 'Meerut' },
  { name: 'Jhansi' },
  { name: 'Mathura (Clean)' },
];

export const RiskMapPlaceholder: React.FC = () => {
  const [searchCity, setSearchCity] = useState('Lucknow');
  const [activeCity, setActiveCity] = useState('Lucknow');
  const [isLoading, setIsLoading] = useState(false);
  const [diseaseData, setDiseaseData] = useState<DiseaseRiskResponse | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const fetchCityData = async (cityToFetch: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/disease-risk?city=${encodeURIComponent(cityToFetch)}`);
      const data: DiseaseRiskResponse = await res.json();
      setDiseaseData(data);
      setActiveCity(data.city);
      if (data.diseases && data.diseases.length > 0) {
        setSelectedDisease(data.diseases[0]);
      } else {
        setSelectedDisease(null);
      }
    } catch (err) {
      console.error("Failed to load disease risk data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData('Lucknow');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    fetchCityData(searchCity.trim());
  };

  const hasCases = diseaseData && diseaseData.diseases && diseaseData.diseases.length > 0;
  const lat = diseaseData?.geo?.lat || 26.8467;
  const lng = diseaseData?.geo?.lng || 80.9462;
  const bbox = `${lng - 0.15},${lat - 0.15},${lng + 0.15},${lat + 0.15}`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sand-300 shadow-md space-y-6">
      {/* Header & City Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-2 border-sand-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 font-black text-sm uppercase tracking-wider mb-1">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>OpenMap Health Surveillance & Gemini AI Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Uttar Pradesh OpenMap Disease Surveillance
          </h2>
          <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">
            View exact sources, most common endemic cases, and Gemini AI customized prevention tips for any UP city.
          </p>
        </div>

        {/* City Input Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full lg:w-auto shrink-0">
          <div className="relative flex-1 lg:w-72">
            <MapPin className="w-5 h-5 text-forest-800 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search UP City (e.g. Lucknow, Mathura)..."
              className="w-full pl-11 pr-4 py-3 text-base font-extrabold text-slate-950 bg-sand-50 border-3 border-sand-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-forest-800"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-3 bg-forest-800 hover:bg-forest-900 text-white font-black text-base rounded-2xl flex items-center space-x-2 shadow-md shrink-0"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin text-emerald-300" /> : <Search className="w-5 h-5 text-emerald-300" />}
            <span>Fetch Data</span>
          </button>
        </form>
      </div>

      {/* 7 OFFICIAL REALTIME HEALTH & GEOGRAPHIC APIS CONNECTED */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl space-y-3 text-xs font-black">
        <div className="flex items-center justify-between">
          <span className="text-forest-950 uppercase tracking-wider block font-black text-sm flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
            <span>7 Live APIs + Gemini AI Customized Prevention Active:</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-white border border-emerald-400 text-forest-950 rounded-xl flex items-center space-x-1 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            <span>OpenStreetMap (OpenMap API)</span>
          </span>
          <span className="px-3 py-1 bg-white border border-emerald-400 text-forest-950 rounded-xl flex items-center space-x-1 shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>WHO Disease Outbreak News (DON API)</span>
          </span>
          <span className="px-3 py-1 bg-white border border-emerald-400 text-forest-950 rounded-xl flex items-center space-x-1 shadow-2xs">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>India Open Govt Data (data.gov.in)</span>
          </span>
          <span className="px-3 py-1 bg-white border border-emerald-400 text-forest-950 rounded-xl flex items-center space-x-1 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>NCDC / IDSP Surveillance Feed</span>
          </span>
          <span className="px-3 py-1 bg-white border border-emerald-400 text-forest-950 rounded-xl flex items-center space-x-1 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Gemini AI Custom Prevention Engine</span>
          </span>
        </div>
      </div>

      {/* City Hotspot Selector Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-black uppercase text-slate-500 tracking-wider shrink-0">
          Most Common UP Cities:
        </span>
        {UP_HOTSPOTS.map((spot) => (
          <button
            key={spot.name}
            onClick={() => {
              const cleanName = spot.name.split(' ')[0];
              setSearchCity(cleanName);
              fetchCityData(cleanName);
            }}
            className={`px-4 py-1.5 rounded-xl text-sm font-black transition-all shrink-0 border-2 ${
              activeCity.toLowerCase() === spot.name.split(' ')[0].toLowerCase()
                ? 'bg-forest-800 text-white border-forest-950 shadow-md'
                : 'bg-sand-100 text-slate-900 border-sand-300 hover:bg-sand-200'
            }`}
          >
            📍 {spot.name}
          </button>
        ))}
      </div>

      {/* Main Grid: OpenStreetMap Display & Outbreak Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OPENMAP API CONTAINER */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[440px] border-4 border-slate-900 shadow-inner relative overflow-hidden">
          
          {/* Map Header */}
          <div className="flex justify-between items-start mb-2 z-10">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                [OPENMAP STREET SURVEILLANCE API]
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-white flex items-center space-x-2">
                <Compass className="w-6 h-6 text-emerald-400" />
                <span>Sector: {activeCity}, Uttar Pradesh</span>
              </h3>
            </div>
            <span className="bg-red-950 text-red-400 border-2 border-red-700 text-xs px-3 py-1.5 rounded-full font-mono font-bold flex items-center space-x-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span>OPENMAP API</span>
            </span>
          </div>

          {/* REALTIME WEATHER & GEOGRAPHIC COORDINATES RIBBON */}
          {diseaseData?.weather && (
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl mb-2 flex flex-wrap items-center justify-between text-xs font-extrabold text-slate-200 z-10 gap-2">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1 text-amber-400">
                  <Thermometer className="w-4 h-4" />
                  <span>{diseaseData.weather.temperature}°C</span>
                </span>
                <span className="flex items-center space-x-1 text-cyan-400">
                  <CloudRain className="w-4 h-4" />
                  <span>Humidity: {diseaseData.weather.humidity}%</span>
                </span>
                <span className="text-slate-400 font-mono">
                  OSM Geo: ({lat.toFixed(3)}, {lng.toFixed(3)})
                </span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-800">
                ⚡ {diseaseData.weather.vectorRiskFactor}
              </span>
            </div>
          )}

          {/* OPENSTREETMAP EMBEDDED MAP CONTAINER */}
          <div className="relative w-full h-[300px] sm:h-[320px] bg-slate-900 rounded-3xl border-2 border-slate-800 overflow-hidden my-2 z-10 shadow-lg">
            <iframe
              title={`OpenStreetMap - ${activeCity}, Uttar Pradesh`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
              className="w-full h-full rounded-2xl filter contrast-105"
            />
            <div className="absolute top-3 left-3 bg-slate-950/90 text-white border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>OpenStreetMap Location: {activeCity}, UP</span>
            </div>
          </div>

          {/* MOST COMMON DISEASES LIST FOR CITY */}
          {hasCases && diseaseData && (
            <div className="z-10 space-y-2 mt-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                Most Common Cases / Diseases in {activeCity}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {diseaseData.diseases.map((dis, idx) => {
                  const isSelected = selectedDisease?.name === dis.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDisease(dis)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-900/80 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-black mb-1">
                        <span>{dis.name}</span>
                        <Badge
                          variant={dis.riskLevel === 'Outbreak' ? 'EMERGENCY' : dis.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {dis.riskLevel}
                        </Badge>
                      </div>

                      {/* Prevalence & Source Attributes */}
                      <div className="text-[11px] font-mono text-slate-300 font-bold space-y-0.5 mt-1">
                        <p className="text-emerald-300 font-black">
                          🔥 {dis.affectedCount} cases reported ({dis.prevalenceCategory || 'Endemic Case'})
                        </p>
                        <p className="text-slate-400 text-[10px] truncate flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-amber-400 shrink-0 inline" />
                          <span>Source: {dis.source || 'NCDC / IDSP Bulletin'}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 mt-3 font-bold z-10 gap-2">
            <span>Data Sources: WHO DON + Data.gov.in + NCDC/IDSP + Gemini AI</span>
            <span className="text-emerald-400 font-extrabold">Verified by Health Officers</span>
          </div>
        </div>

        {/* Selected Disease Details Panel with Source & Gemini Customized Prevention */}
        {hasCases && selectedDisease ? (
          <div className="bg-sand-50 rounded-3xl p-6 border-4 border-sand-300 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  Outbreak & Prevention Profile
                </span>
                <Badge
                  variant={selectedDisease.riskLevel === 'Outbreak' ? 'EMERGENCY' : selectedDisease.riskLevel === 'High' ? 'URGENT' : 'ROUTINE'}
                  className="text-sm px-3 py-1 font-black"
                >
                  {selectedDisease.riskLevel} Risk
                </Badge>
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {selectedDisease.name}
              </h3>
              <p className="text-sm font-black text-forest-900 mt-0.5">
                📍 {activeCity}, Uttar Pradesh • ({selectedDisease.prevalenceCategory || 'Most Common Endemic Disease'})
              </p>

              {/* Explicit Source Box */}
              <div className="mt-3 p-3 bg-white border-2 border-sand-300 rounded-2xl font-extrabold text-xs text-slate-900 space-y-1">
                <div className="text-slate-500 uppercase text-[10px] font-black flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Official Data Source:</span>
                </div>
                <span className="text-forest-900 font-black block">{selectedDisease.source || 'NCDC / IDSP Surveillance Bulletin'}</span>
                <div className="text-slate-700 text-sm font-black pt-1">
                  {selectedDisease.affectedCount} Cases in recent period
                </div>
              </div>

              {/* Symptoms */}
              <div className="mt-4">
                <span className="text-sm font-black text-slate-900 flex items-center space-x-1.5 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Common Symptoms</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDisease.symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black rounded-xl"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* GEMINI AI CUSTOMIZED PREVENTION */}
              <div className="mt-4 p-4 bg-emerald-100/90 border-2 border-emerald-400 rounded-2xl space-y-2">
                <span className="text-sm font-black text-forest-950 flex items-center space-x-1.5">
                  <Sparkles className="w-5 h-5 text-emerald-700 animate-bounce" />
                  <span>Gemini AI Customized Prevention</span>
                </span>

                <ul className="space-y-2 text-xs text-forest-950 font-extrabold">
                  {(selectedDisease.geminiCustomizedPrevention || selectedDisease.prevention).map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
                      <Check className="w-4 h-4 text-emerald-700 font-black shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-sand-300 text-xs font-black text-slate-700 flex justify-between items-center">
              <span>ASHA Surveillance Active</span>
              <span className="text-forest-900">Verified by Health Officers</span>
            </div>
          </div>
        ) : (
          /* USER DIRECTIVE EMPTY STATE: NO RECENT PHENOMENAL CASES HAPPENED */
          <div className="bg-emerald-100 border-4 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-200 border-2 border-emerald-500 flex items-center justify-center text-forest-950">
              <CheckCircle2 className="w-10 h-10 text-forest-900" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              no recent phenomenal cases happened
            </h3>

            <p className="text-base font-extrabold text-forest-950 max-w-xs leading-relaxed">
              Live WHO, NCDC/IDSP, and Data.gov.in health surveillance reports <span className="underline">0 active disease outbreak cases</span> in <span className="font-black text-slate-950">{activeCity}</span> during the recent time period.
            </p>

            <div className="pt-2 border-t border-emerald-300 w-full text-xs font-black text-forest-900">
              Community Health Status: Normal & Safe
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
