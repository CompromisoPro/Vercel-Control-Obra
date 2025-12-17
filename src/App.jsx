import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Area, AreaChart, CartesianGrid } from 'recharts';

// ============================================================================
// CONFIGURACIÓN DEL PROYECTO
// ============================================================================
const CONFIG = {
  NOMBRE_PROYECTO: "Edificio Departamentos",
  EMPRESA: "Constructora",
  PARTIDAS: [
    { id: 'tabiqueria', nombre: "Tabiquería", peso: 0.30, icono: "🧱", color: "#f97316" },
    { id: 'electrica', nombre: "Inst. Eléctrica", peso: 0.10, icono: "⚡", color: "#eab308" },
    { id: 'sanitaria', nombre: "Inst. Sanitaria", peso: 0.10, icono: "🚿", color: "#06b6d4" },
    { id: 'puertas', nombre: "Puertas/Escaleras", peso: 0.20, icono: "🚪", color: "#8b5cf6" },
    { id: 'ventanas', nombre: "Ventanas", peso: 0.15, icono: "🪟", color: "#3b82f6" },
    { id: 'ceramicos', nombre: "Cerámicos", peso: 0.05, icono: "🔲", color: "#ec4899" },
    { id: 'pintura', nombre: "Pintura", peso: 0.05, icono: "🎨", color: "#10b981" },
    { id: 'artefactos', nombre: "Artefactos", peso: 0.05, icono: "🔧", color: "#6366f1" }
  ],
  UMBRAL_AVANZADO: 0.80,
  UMBRAL_PROGRESO: 0.50,
  UMBRAL_ALERTA: 0.30,
};

// ============================================================================
// DATOS DEL PROYECTO (Extraídos del Excel de Control)
// ============================================================================
const PROJECT_DATA = {
  avanceGeneral: 0.234,
  fechaActualizacion: "2025-11-14",
  promediosPiso: { piso1: 0.615, piso2: 0.449, piso3: 0.106, piso4: 0, piso5: 0 },
  pisos: {
    piso1: [
      { depto: 1, tipo: 3, avance: 0.79, partidas: { tabiqueria: 0.99, electrica: 0.70, sanitaria: 1.0, puertas: 0.95, ventanas: 0.40, ceramicos: 1.0, pintura: 0.40, artefactos: 0.15 }},
      { depto: 2, tipo: 1, avance: 0.76, partidas: { tabiqueria: 1.0, electrica: 0.70, sanitaria: 1.0, puertas: 1.0, ventanas: 0.30, ceramicos: 0.60, pintura: 0.20, artefactos: 0.15 }},
      { depto: 3, tipo: 3, avance: 0.85, partidas: { tabiqueria: 0.98, electrica: 0.70, sanitaria: 1.0, puertas: 0.95, ventanas: 0.80, ceramicos: 1.0, pintura: 0.40, artefactos: 0.20 }},
      { depto: 4, tipo: 3, avance: 0.87, partidas: { tabiqueria: 0.99, electrica: 0.80, sanitaria: 1.0, puertas: 0.95, ventanas: 0.85, ceramicos: 1.0, pintura: 0.50, artefactos: 0.25 }},
      { depto: 5, tipo: 6, avance: 0.79, partidas: { tabiqueria: 0.95, electrica: 0.65, sanitaria: 1.0, puertas: 0.90, ventanas: 0.70, ceramicos: 0.80, pintura: 0.35, artefactos: 0.10 }},
      { depto: 6, tipo: 3, avance: 0.88, partidas: { tabiqueria: 1.0, electrica: 0.85, sanitaria: 1.0, puertas: 0.95, ventanas: 0.80, ceramicos: 1.0, pintura: 0.55, artefactos: 0.30 }},
      { depto: 7, tipo: 3, avance: 0.86, partidas: { tabiqueria: 0.98, electrica: 0.75, sanitaria: 1.0, puertas: 0.95, ventanas: 0.80, ceramicos: 1.0, pintura: 0.45, artefactos: 0.25 }},
      { depto: 8, tipo: 3, avance: 0.65, partidas: { tabiqueria: 0.90, electrica: 0.50, sanitaria: 0.80, puertas: 0.70, ventanas: 0.40, ceramicos: 0.60, pintura: 0.20, artefactos: 0.05 }},
      { depto: 9, tipo: 1, avance: 0.63, partidas: { tabiqueria: 0.85, electrica: 0.55, sanitaria: 0.85, puertas: 0.65, ventanas: 0.35, ceramicos: 0.55, pintura: 0.25, artefactos: 0.10 }},
      { depto: 10, tipo: 3, avance: 0.61, partidas: { tabiqueria: 0.85, electrica: 0.50, sanitaria: 0.80, puertas: 0.60, ventanas: 0.40, ceramicos: 0.50, pintura: 0.20, artefactos: 0.05 }},
      { depto: 11, tipo: 3, avance: 0.57, partidas: { tabiqueria: 0.80, electrica: 0.45, sanitaria: 0.75, puertas: 0.55, ventanas: 0.35, ceramicos: 0.50, pintura: 0.15, artefactos: 0.05 }},
      { depto: 12, tipo: 1, avance: 0.43, partidas: { tabiqueria: 0.70, electrica: 0.30, sanitaria: 0.60, puertas: 0.40, ventanas: 0.20, ceramicos: 0.30, pintura: 0.10, artefactos: 0.0 }},
      { depto: 13, tipo: 3, avance: 0.59, partidas: { tabiqueria: 0.82, electrica: 0.48, sanitaria: 0.78, puertas: 0.58, ventanas: 0.38, ceramicos: 0.48, pintura: 0.18, artefactos: 0.08 }},
      { depto: 14, tipo: 3, avance: 0.57, partidas: { tabiqueria: 0.80, electrica: 0.45, sanitaria: 0.75, puertas: 0.55, ventanas: 0.35, ceramicos: 0.45, pintura: 0.15, artefactos: 0.05 }},
      { depto: 15, tipo: 1, avance: 0.47, partidas: { tabiqueria: 0.72, electrica: 0.35, sanitaria: 0.65, puertas: 0.45, ventanas: 0.25, ceramicos: 0.35, pintura: 0.12, artefactos: 0.02 }},
      { depto: 16, tipo: 3, avance: 0.57, partidas: { tabiqueria: 0.80, electrica: 0.45, sanitaria: 0.75, puertas: 0.55, ventanas: 0.35, ceramicos: 0.45, pintura: 0.15, artefactos: 0.05 }},
      { depto: 17, tipo: 3, avance: 0.57, partidas: { tabiqueria: 0.80, electrica: 0.45, sanitaria: 0.75, puertas: 0.55, ventanas: 0.35, ceramicos: 0.45, pintura: 0.15, artefactos: 0.05 }},
      { depto: 18, tipo: 6, avance: 0.36, partidas: { tabiqueria: 0.60, electrica: 0.25, sanitaria: 0.50, puertas: 0.30, ventanas: 0.15, ceramicos: 0.25, pintura: 0.08, artefactos: 0.0 }},
      { depto: 19, tipo: 3, avance: 0.58, partidas: { tabiqueria: 0.81, electrica: 0.46, sanitaria: 0.76, puertas: 0.56, ventanas: 0.36, ceramicos: 0.46, pintura: 0.16, artefactos: 0.06 }},
      { depto: 20, tipo: 3, avance: 0.54, partidas: { tabiqueria: 0.78, electrica: 0.42, sanitaria: 0.72, puertas: 0.52, ventanas: 0.32, ceramicos: 0.42, pintura: 0.12, artefactos: 0.04 }},
      { depto: 21, tipo: 4, avance: 0.31, partidas: { tabiqueria: 0.55, electrica: 0.20, sanitaria: 0.45, puertas: 0.25, ventanas: 0.10, ceramicos: 0.20, pintura: 0.05, artefactos: 0.0 }},
      { depto: 22, tipo: 4, avance: 0.30, partidas: { tabiqueria: 0.52, electrica: 0.18, sanitaria: 0.42, puertas: 0.22, ventanas: 0.08, ceramicos: 0.18, pintura: 0.04, artefactos: 0.0 }}
    ],
    piso2: [
      { depto: 23, tipo: 2, avance: 0.51, partidas: { tabiqueria: 0.75, electrica: 0.40, sanitaria: 0.70, puertas: 0.50, ventanas: 0.28, ceramicos: 0.38, pintura: 0.12, artefactos: 0.02 }},
      { depto: 24, tipo: 2, avance: 0.73, partidas: { tabiqueria: 0.92, electrica: 0.62, sanitaria: 0.88, puertas: 0.78, ventanas: 0.55, ceramicos: 0.68, pintura: 0.32, artefactos: 0.15 }},
      { depto: 25, tipo: 2, avance: 0.74, partidas: { tabiqueria: 0.93, electrica: 0.64, sanitaria: 0.90, puertas: 0.80, ventanas: 0.58, ceramicos: 0.70, pintura: 0.35, artefactos: 0.18 }},
      { depto: 26, tipo: 2, avance: 0.84, partidas: { tabiqueria: 0.98, electrica: 0.78, sanitaria: 0.95, puertas: 0.92, ventanas: 0.75, ceramicos: 0.85, pintura: 0.50, artefactos: 0.28 }},
      { depto: 27, tipo: 2, avance: 0.74, partidas: { tabiqueria: 0.93, electrica: 0.64, sanitaria: 0.90, puertas: 0.80, ventanas: 0.58, ceramicos: 0.70, pintura: 0.35, artefactos: 0.18 }},
      { depto: 28, tipo: 2, avance: 0.73, partidas: { tabiqueria: 0.92, electrica: 0.62, sanitaria: 0.88, puertas: 0.78, ventanas: 0.55, ceramicos: 0.68, pintura: 0.32, artefactos: 0.15 }},
      { depto: 29, tipo: 2, avance: 0.31, partidas: { tabiqueria: 0.55, electrica: 0.20, sanitaria: 0.45, puertas: 0.25, ventanas: 0.10, ceramicos: 0.20, pintura: 0.05, artefactos: 0.0 }},
      { depto: 30, tipo: 2, avance: 0.31, partidas: { tabiqueria: 0.55, electrica: 0.20, sanitaria: 0.45, puertas: 0.25, ventanas: 0.10, ceramicos: 0.20, pintura: 0.05, artefactos: 0.0 }},
      { depto: 31, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 32, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 33, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 34, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 35, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 36, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 37, tipo: 2, avance: 0.25, partidas: { tabiqueria: 0.48, electrica: 0.15, sanitaria: 0.38, puertas: 0.18, ventanas: 0.05, ceramicos: 0.15, pintura: 0.02, artefactos: 0.0 }},
      { depto: 38, tipo: 1, avance: 0.0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }}
    ],
    piso3: [
      { depto: 39, tipo: 2, avance: 0.34, partidas: { tabiqueria: 0.58, electrica: 0.22, sanitaria: 0.48, puertas: 0.28, ventanas: 0.12, ceramicos: 0.22, pintura: 0.06, artefactos: 0.0 }},
      { depto: 40, tipo: 2, avance: 0.32, partidas: { tabiqueria: 0.56, electrica: 0.20, sanitaria: 0.46, puertas: 0.26, ventanas: 0.10, ceramicos: 0.20, pintura: 0.05, artefactos: 0.0 }},
      { depto: 41, tipo: 2, avance: 0.29, partidas: { tabiqueria: 0.52, electrica: 0.18, sanitaria: 0.42, puertas: 0.22, ventanas: 0.08, ceramicos: 0.18, pintura: 0.04, artefactos: 0.0 }},
      { depto: 42, tipo: 2, avance: 0.29, partidas: { tabiqueria: 0.52, electrica: 0.18, sanitaria: 0.42, puertas: 0.22, ventanas: 0.08, ceramicos: 0.18, pintura: 0.04, artefactos: 0.0 }},
      { depto: 43, tipo: 2, avance: 0.29, partidas: { tabiqueria: 0.52, electrica: 0.18, sanitaria: 0.42, puertas: 0.22, ventanas: 0.08, ceramicos: 0.18, pintura: 0.04, artefactos: 0.0 }},
      { depto: 44, tipo: 2, avance: 0.28, partidas: { tabiqueria: 0.50, electrica: 0.16, sanitaria: 0.40, puertas: 0.20, ventanas: 0.06, ceramicos: 0.16, pintura: 0.03, artefactos: 0.0 }},
      { depto: 45, tipo: 5, avance: 0.14, partidas: { tabiqueria: 0.30, electrica: 0.08, sanitaria: 0.20, puertas: 0.08, ventanas: 0.0, ceramicos: 0.05, pintura: 0.0, artefactos: 0.0 }},
      { depto: 46, tipo: 7, avance: 0.10, partidas: { tabiqueria: 0.22, electrica: 0.05, sanitaria: 0.15, puertas: 0.05, ventanas: 0.0, ceramicos: 0.02, pintura: 0.0, artefactos: 0.0 }},
      { depto: 47, tipo: 5, avance: 0.09, partidas: { tabiqueria: 0.20, electrica: 0.04, sanitaria: 0.12, puertas: 0.04, ventanas: 0.0, ceramicos: 0.0, pintura: 0.0, artefactos: 0.0 }},
      { depto: 48, tipo: 5, avance: 0.09, partidas: { tabiqueria: 0.20, electrica: 0.04, sanitaria: 0.12, puertas: 0.04, ventanas: 0.0, ceramicos: 0.0, pintura: 0.0, artefactos: 0.0 }},
      { depto: 49, tipo: 5, avance: 0.11, partidas: { tabiqueria: 0.24, electrica: 0.06, sanitaria: 0.16, puertas: 0.06, ventanas: 0.0, ceramicos: 0.02, pintura: 0.0, artefactos: 0.0 }},
      { depto: 50, tipo: 5, avance: 0.11, partidas: { tabiqueria: 0.24, electrica: 0.06, sanitaria: 0.16, puertas: 0.06, ventanas: 0.0, ceramicos: 0.02, pintura: 0.0, artefactos: 0.0 }},
      { depto: 51, tipo: 5, avance: 0.11, partidas: { tabiqueria: 0.24, electrica: 0.06, sanitaria: 0.16, puertas: 0.06, ventanas: 0.0, ceramicos: 0.02, pintura: 0.0, artefactos: 0.0 }},
      { depto: 52, tipo: 5, avance: 0.08, partidas: { tabiqueria: 0.18, electrica: 0.03, sanitaria: 0.10, puertas: 0.03, ventanas: 0.0, ceramicos: 0.0, pintura: 0.0, artefactos: 0.0 }},
      { depto: 53, tipo: 8, avance: 0.08, partidas: { tabiqueria: 0.18, electrica: 0.03, sanitaria: 0.10, puertas: 0.03, ventanas: 0.0, ceramicos: 0.0, pintura: 0.0, artefactos: 0.0 }},
      { depto: 54, tipo: 2, avance: 0.02, partidas: { tabiqueria: 0.05, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 55, tipo: 2, avance: 0.02, partidas: { tabiqueria: 0.05, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 56, tipo: 2, avance: 0.02, partidas: { tabiqueria: 0.05, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 57, tipo: 2, avance: 0.02, partidas: { tabiqueria: 0.05, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 58, tipo: 2, avance: 0.02, partidas: { tabiqueria: 0.05, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 59, tipo: 2, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 60, tipo: 2, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 61, tipo: 2, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 62, tipo: 2, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 63, tipo: 5, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }},
      { depto: 64, tipo: 5, avance: 0, partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }}
    ],
    piso4: Array.from({length: 15}, (_, i) => ({ 
      depto: 65 + i, tipo: 2, avance: 0, 
      partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }
    })),
    piso5: Array.from({length: 41}, (_, i) => ({ 
      depto: 80 + i, tipo: 5, avance: 0, 
      partidas: { tabiqueria: 0, electrica: 0, sanitaria: 0, puertas: 0, ventanas: 0, ceramicos: 0, pintura: 0, artefactos: 0 }
    }))
  },
  historico: [
    { fecha: "24 Oct", avance: 10.0, semana: 1 },
    { fecha: "31 Oct", avance: 13.6, semana: 2 },
    { fecha: "07 Nov", avance: 19.5, semana: 3 },
    { fecha: "14 Nov", avance: 23.4, semana: 4 }
  ]
};

// ============================================================================
// UTILIDADES
// ============================================================================
const formatPercent = (value, decimals = 1) => `${(value * 100).toFixed(decimals)}%`;

const getColorByAvance = (avance) => {
  if (avance >= CONFIG.UMBRAL_AVANZADO) return '#10b981';
  if (avance >= CONFIG.UMBRAL_PROGRESO) return '#f59e0b';
  if (avance > 0) return '#ef4444';
  return '#1e293b';
};

const getStatusConfig = (avance) => {
  if (avance >= CONFIG.UMBRAL_AVANZADO) return { text: 'Avanzado', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (avance >= CONFIG.UMBRAL_PROGRESO) return { text: 'En Progreso', color: 'text-amber-400', bg: 'bg-amber-500/10' };
  if (avance > 0) return { text: 'Iniciado', color: 'text-red-400', bg: 'bg-red-500/10' };
  return { text: 'Sin Iniciar', color: 'text-slate-500', bg: 'bg-slate-500/10' };
};

// ============================================================================
// COMPONENTES
// ============================================================================

const KPICard = ({ title, value, subtitle, icon, color = "slate" }) => {
  const colorClasses = {
    slate: "border-slate-700 bg-slate-900/50",
    emerald: "border-emerald-800/30 bg-emerald-950/20",
    amber: "border-amber-800/30 bg-amber-950/20",
    red: "border-red-800/30 bg-red-950/20",
    cyan: "border-cyan-800/30 bg-cyan-950/20"
  };
  
  return (
    <div className={`rounded-2xl border p-5 backdrop-blur transition-all hover:scale-[1.02] ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black mt-1 text-white">{value}</p>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl opacity-50">{icon}</span>}
      </div>
    </div>
  );
};

const CircularGauge = ({ value, size = 180, label, trendValue }) => {
  const percentage = value * 100;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: `conic-gradient(from 0deg, #06b6d4, #8b5cf6, #06b6d4)` }} />
        
        <svg viewBox="0 0 100 100" className="transform -rotate-90 relative z-10">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="6" />
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 38 * Math.cos(rad);
            const y1 = 50 + 38 * Math.sin(rad);
            const x2 = 50 + 35 * Math.cos(rad);
            const y2 = 50 + 35 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i / 20 <= value ? '#06b6d4' : '#334155'} strokeWidth="1" />;
          })}
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gaugeGradient)" strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out" />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-4xl font-black text-white tracking-tight">{percentage.toFixed(1)}%</span>
          <span className="text-slate-400 text-sm">{label}</span>
        </div>
      </div>
      
      {trendValue !== undefined && (
        <div className={`mt-4 px-3 py-1 rounded-full text-sm font-medium ${trendValue > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {trendValue > 0 ? '▲' : '▼'} {Math.abs(trendValue).toFixed(1)}% esta semana
        </div>
      )}
    </div>
  );
};

const DeptoCell = ({ depto, onClick, isSelected }) => {
  const color = getColorByAvance(depto.avance);
  
  return (
    <button
      onClick={() => onClick(depto)}
      className={`w-11 h-11 rounded-lg text-xs font-bold transition-all duration-200
        hover:scale-110 hover:z-10 relative group
        ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-110 z-20' : ''}`}
      style={{ backgroundColor: color, boxShadow: depto.avance > 0 ? `0 4px 20px ${color}50` : 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
    >
      <span className="text-white drop-shadow-md">{depto.depto}</span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 border border-slate-700">
        Depto {depto.depto}: {formatPercent(depto.avance)}
      </div>
      {depto.avance > 0 && (
        <span className="absolute -bottom-1 -right-1 text-[9px] bg-slate-900 px-1.5 py-0.5 rounded-full text-white border border-slate-700 font-medium">
          {Math.round(depto.avance * 100)}
        </span>
      )}
    </button>
  );
};

const ProgressBar = ({ value, color, height = "h-2", showLabel = false }) => (
  <div className="w-full">
    {showLabel && (
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">Progreso</span>
        <span className="font-medium" style={{ color }}>{formatPercent(value)}</span>
      </div>
    )}
    <div className={`${height} bg-slate-800 rounded-full overflow-hidden`}>
      <div className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value * 100}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
    </div>
  </div>
);

const PartidasPanel = ({ deptoPartidas }) => (
  <div className="space-y-3">
    {CONFIG.PARTIDAS.map((partida) => {
      const avance = deptoPartidas?.[partida.id] || 0;
      return (
        <div key={partida.id} className="bg-slate-800/40 rounded-xl p-3 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{partida.icono}</span>
              <div>
                <span className="text-sm font-medium text-slate-200">{partida.nombre}</span>
                <span className="text-xs text-slate-500 ml-2">({Math.round(partida.peso * 100)}%)</span>
              </div>
            </div>
            <span className="text-sm font-bold" style={{ color: getColorByAvance(avance) }}>
              {formatPercent(avance)}
            </span>
          </div>
          <ProgressBar value={avance} color={partida.color} height="h-1.5" />
        </div>
      );
    })}
  </div>
);

// ============================================================================
// APP PRINCIPAL
// ============================================================================
export default function App() {
  const [data] = useState(PROJECT_DATA);
  const [selectedPiso, setSelectedPiso] = useState('piso1');
  const [selectedDepto, setSelectedDepto] = useState(null);
  const [view, setView] = useState('dashboard');

  const pisosConfig = useMemo(() => ({
    piso1: { nombre: 'Piso 1', color: '#06b6d4', deptos: data.pisos.piso1, promedio: data.promediosPiso.piso1 },
    piso2: { nombre: 'Piso 2', color: '#8b5cf6', deptos: data.pisos.piso2, promedio: data.promediosPiso.piso2 },
    piso3: { nombre: 'Piso 3', color: '#f59e0b', deptos: data.pisos.piso3, promedio: data.promediosPiso.piso3 },
    piso4: { nombre: 'Piso 4', color: '#ef4444', deptos: data.pisos.piso4, promedio: data.promediosPiso.piso4 },
    piso5: { nombre: 'Piso 5', color: '#10b981', deptos: data.pisos.piso5, promedio: data.promediosPiso.piso5 }
  }), [data]);

  const stats = useMemo(() => {
    const allDeptos = Object.values(data.pisos).flat();
    const total = allDeptos.length;
    const avanzados = allDeptos.filter(d => d.avance >= CONFIG.UMBRAL_AVANZADO).length;
    const enProgreso = allDeptos.filter(d => d.avance >= CONFIG.UMBRAL_PROGRESO && d.avance < CONFIG.UMBRAL_AVANZADO).length;
    const iniciados = allDeptos.filter(d => d.avance > 0 && d.avance < CONFIG.UMBRAL_PROGRESO).length;
    const sinIniciar = allDeptos.filter(d => d.avance === 0).length;
    const alertas = allDeptos.filter(d => d.avance > 0 && d.avance < CONFIG.UMBRAL_ALERTA);
    const historicoLen = data.historico.length;
    const tendenciaSemanal = historicoLen >= 2 ? data.historico[historicoLen - 1].avance - data.historico[historicoLen - 2].avance : 0;
    const semanasRestantes = Math.ceil((100 - data.avanceGeneral * 100) / (tendenciaSemanal || 1));
    return { total, avanzados, enProgreso, iniciados, sinIniciar, alertas, tendenciaSemanal, semanasRestantes };
  }, [data]);

  const chartData = useMemo(() => ({
    pisos: Object.entries(pisosConfig).map(([key, piso]) => ({
      name: piso.nombre, avance: Math.round(piso.promedio * 100), fill: piso.color, deptos: piso.deptos.length
    })),
    distribucion: [
      { name: 'Avanzados (+80%)', value: stats.avanzados, fill: '#10b981' },
      { name: 'En Progreso (50-80%)', value: stats.enProgreso, fill: '#f59e0b' },
      { name: 'Iniciados (<50%)', value: stats.iniciados, fill: '#ef4444' },
      { name: 'Sin Iniciar', value: stats.sinIniciar, fill: '#334155' }
    ]
  }), [pisosConfig, stats]);

  const pisoActual = pisosConfig[selectedPiso];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <span className="text-3xl">🏗️</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Control de Obra
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {CONFIG.NOMBRE_PROYECTO} • 14 Nov 2025
                </p>
              </div>
            </div>
            
            <div className="flex bg-slate-800/50 rounded-xl p-1 backdrop-blur border border-slate-700/50">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'mapa', label: 'Mapa', icon: '🗺️' },
                { id: 'alertas', label: 'Alertas', icon: '⚠️', badge: stats.alertas.length }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all relative
                    ${view === item.id ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard title="Total Unidades" value={stats.total} subtitle="120 departamentos" icon="🏢" />
                <KPICard title="Avanzados" value={stats.avanzados} subtitle="+80% completado" icon="✅" color="emerald" />
                <KPICard title="En Progreso" value={stats.enProgreso + stats.iniciados} subtitle="Trabajando" icon="🔨" color="amber" />
                <KPICard title="Por Iniciar" value={stats.sinIniciar} subtitle="Pendientes" icon="📋" color="red" />
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Evolución del Proyecto</h3>
                    <p className="text-slate-400 text-sm">Avance semanal acumulado</p>
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${stats.tendenciaSemanal > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stats.tendenciaSemanal > 0 ? '↑' : '↓'} {Math.abs(stats.tendenciaSemanal).toFixed(1)}% esta semana
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.historico}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="fecha" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} formatter={(value) => [`${value}%`, 'Avance']} />
                    <Area type="monotone" dataKey="avance" stroke="#8b5cf6" strokeWidth={3} fill="url(#areaGradient)" />
                    <Line type="monotone" dataKey="avance" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6">Avance por Piso</h3>
                <div className="space-y-4">
                  {chartData.pisos.map((piso, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: piso.fill }}>{i + 1}</div>
                          <div>
                            <span className="font-medium">{piso.name}</span>
                            <span className="text-slate-500 text-sm ml-2">({piso.deptos} deptos)</span>
                          </div>
                        </div>
                        <span className="text-lg font-bold" style={{ color: piso.fill }}>{piso.avance}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-80" style={{ width: `${piso.avance}%`, backgroundColor: piso.fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4">Avance General</h3>
                <CircularGauge value={data.avanceGeneral} label="Completado" trendValue={stats.tendenciaSemanal} />
                <div className="mt-6 w-full pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Proyección término</span>
                    <span className="font-medium text-cyan-400">~{stats.semanasRestantes} semanas</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Distribución</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={chartData.distribucion} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {chartData.distribucion.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {chartData.distribucion.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Ponderación Partidas</h3>
                <div className="space-y-3">
                  {CONFIG.PARTIDAS.map((partida) => (
                    <div key={partida.id} className="flex items-center gap-3">
                      <span className="text-xl">{partida.icono}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{partida.nombre}</span>
                          <span className="text-slate-500">{Math.round(partida.peso * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${partida.peso * 100}%`, backgroundColor: partida.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mapa View */}
        {view === 'mapa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Object.entries(pisosConfig).map(([key, piso]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedPiso(key); setSelectedDepto(null); }}
                    className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0
                      ${selectedPiso === key ? 'text-white shadow-lg' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'}`}
                    style={selectedPiso === key ? { background: `linear-gradient(135deg, ${piso.color}, ${piso.color}99)`, boxShadow: `0 10px 30px ${piso.color}30` } : {}}
                  >
                    <div className="text-sm font-bold">{piso.nombre}</div>
                    <div className="text-xs opacity-75">{Math.round(piso.promedio * 100)}%</div>
                  </button>
                ))}
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{pisoActual.nombre}</h3>
                    <p className="text-slate-400 text-sm">{pisoActual.deptos.length} departamentos</p>
                  </div>
                  <div className="text-3xl font-black" style={{ color: pisoActual.color }}>{Math.round(pisoActual.promedio * 100)}%</div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {pisoActual.deptos.map((depto) => (
                    <DeptoCell key={depto.depto} depto={depto} onClick={setSelectedDepto} isSelected={selectedDepto?.depto === depto.depto} />
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-slate-800">
                  {[{ color: '#10b981', label: '+80%' }, { color: '#f59e0b', label: '50-80%' }, { color: '#ef4444', label: '1-50%' }, { color: '#1e293b', label: 'Sin iniciar' }].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard title="Total" value={pisoActual.deptos.length} icon="🏠" />
                <KPICard title="Avanzados" value={pisoActual.deptos.filter(d => d.avance >= 0.8).length} icon="✅" color="emerald" />
                <KPICard title="En Proceso" value={pisoActual.deptos.filter(d => d.avance > 0 && d.avance < 0.8).length} icon="🔨" color="amber" />
                <KPICard title="Sin Iniciar" value={pisoActual.deptos.filter(d => d.avance === 0).length} icon="⏳" color="red" />
              </div>
            </div>

            <div className="lg:col-span-4">
              {selectedDepto ? (
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black">Depto {selectedDepto.depto}</h3>
                      <p className="text-slate-400 text-sm">Tipo {selectedDepto.tipo} • {pisoActual.nombre}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                      style={{ backgroundColor: getColorByAvance(selectedDepto.avance) }}>
                      {Math.round(selectedDepto.avance * 100)}%
                    </div>
                  </div>
                  <div className="mb-6">
                    <ProgressBar value={selectedDepto.avance} color={getColorByAvance(selectedDepto.avance)} height="h-3" showLabel />
                    <div className="mt-2">
                      <span className={`text-sm px-3 py-1 rounded-full ${getStatusConfig(selectedDepto.avance).bg} ${getStatusConfig(selectedDepto.avance).color}`}>
                        {getStatusConfig(selectedDepto.avance).text}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Detalle por Partida</h4>
                  <PartidasPanel deptoPartidas={selectedDepto.partidas} />
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">👆</div>
                  <h3 className="text-xl font-bold mb-2">Selecciona un Departamento</h3>
                  <p className="text-slate-400">Haz clic en cualquier departamento del mapa para ver su detalle.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alertas View */}
        {view === 'alertas' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/50 backdrop-blur border border-red-800/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-400">Departamentos en Alerta</h2>
                  <p className="text-slate-400 text-sm">Unidades con avance menor al {CONFIG.UMBRAL_ALERTA * 100}%</p>
                </div>
              </div>

              {stats.alertas.length > 0 ? (
                <div className="space-y-3">
                  {stats.alertas.map((depto, i) => (
                    <div key={i} className="flex items-center justify-between bg-red-950/30 hover:bg-red-950/50 rounded-xl p-4 transition-colors cursor-pointer border border-red-800/20"
                      onClick={() => { setSelectedDepto(depto); setView('mapa'); }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 font-bold">{depto.depto}</div>
                        <div>
                          <p className="font-medium">Departamento {depto.depto}</p>
                          <p className="text-slate-500 text-sm">Tipo {depto.tipo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-red-400">{Math.round(depto.avance * 100)}%</p>
                        <p className="text-slate-500 text-xs">Requiere atención</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">✅</span>
                  <h3 className="text-xl font-bold text-emerald-400">¡Sin alertas!</h3>
                  <p className="text-slate-400 mt-2">Todos los departamentos progresan adecuadamente.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-600 text-sm border-t border-slate-800 pt-8">
          <p className="font-medium">Sistema de Control de Obra Gerencial v2.0</p>
          <p className="mt-1">Desarrollado con 💜 para {CONFIG.EMPRESA}</p>
        </footer>
      </div>
    </div>
  );
}
