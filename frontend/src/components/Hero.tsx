import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// ─────────────────────────────────────────────
// CARD DATA — each card has a stagger index
// ─────────────────────────────────────────────
const cards = [
  {
    id: 'ts',
    title: 'systems.ts',
    titleColor: '#93c5fd',
    border: 'rgba(59,130,246,0.4)',
    bg: 'rgba(4,10,26,0.92)',
    glow: 'rgba(59,130,246,0.15)',
    pos: { left: '1%', top: '15%' },
    floatDur: 4.2,
    lines: [
      { t: 'class Analyst {',       c: '#60a5fa' },
      { t: '  model(system) {',     c: 'rgba(148,163,184,0.55)' },
      { t: '    map(dataFlow);',    c: '#34d399' },
      { t: '    return spec;',      c: '#34d399' },
      { t: '  }',                   c: 'rgba(148,163,184,0.55)' },
      { t: '  deploy(): void {',    c: 'rgba(148,163,184,0.55)' },
      { t: '    ship(build);',      c: '#fbbf24' },
      { t: '  }',                   c: 'rgba(148,163,184,0.55)' },
      { t: '}',                     c: '#60a5fa' },
    ],
  },
  {
    id: 'bpmn',
    title: 'BPMN Process Flow',
    titleColor: '#67e8f9',
    border: 'rgba(34,211,238,0.4)',
    bg: 'rgba(3,10,22,0.92)',
    glow: 'rgba(34,211,238,0.12)',
    pos: { left: '1%', top: '52%' },
    floatDur: 5.1,
    lines: [
      { t: '▶  Gather Requirements', c: '#22d3ee' },
      { t: '→  Analyze & Model',     c: 'rgba(148,163,184,0.55)' },
      { t: '→  Design Architecture', c: '#60a5fa' },
      { t: '→  Build & Integrate',   c: 'rgba(148,163,184,0.55)' },
      { t: '→  QA & Test',           c: '#34d399' },
      { t: '■  Deploy to Prod',      c: '#34d399' },
    ],
  },
  {
    id: 'uml',
    title: '«class» DataModel',
    titleColor: '#a5f3fc',
    border: 'rgba(34,211,238,0.38)',
    bg: 'rgba(3,10,22,0.92)',
    glow: 'rgba(34,211,238,0.1)',
    pos: { right: '1%', top: '10%' },
    floatDur: 4.6,
    lines: [
      { t: '– id       : UUID',      c: '#a5f3fc' },
      { t: '– schema   : JSON',      c: '#a5f3fc' },
      { t: '– version  : int',       c: '#a5f3fc' },
      { t: '──────────────────',     c: 'rgba(34,211,238,0.25)' },
      { t: '+ validate()',           c: '#22d3ee' },
      { t: '+ transform()',          c: '#22d3ee' },
      { t: '+ persist()',            c: '#22d3ee' },
    ],
    isUml: true,
  },
  {
    id: 'api',
    title: 'REST API',
    titleColor: '#86efac',
    border: 'rgba(34,197,94,0.38)',
    bg: 'rgba(3,10,18,0.92)',
    glow: 'rgba(34,197,94,0.1)',
    pos: { right: '1%', top: '44%' },
    floatDur: 3.9,
    lines: [
      { t: 'GET    /api/systems',    c: '#34d399' },
      { t: 'POST   /api/analyze',    c: '#60a5fa' },
      { t: 'PUT    /api/schema',     c: 'rgba(148,163,184,0.55)' },
      { t: 'DELETE /api/legacy',     c: 'rgba(148,163,184,0.55)' },
      { t: '',                       c: '' },
      { t: '200 OK  ✓',             c: '#34d399' },
    ],
  },
  {
    id: 'stack',
    title: 'Tech Stack',
    titleColor: '#fcd34d',
    border: 'rgba(251,191,36,0.38)',
    bg: 'rgba(8,6,2,0.92)',
    glow: 'rgba(251,191,36,0.1)',
    pos: { right: '1%', top: '72%' },
    floatDur: 4.8,
    lines: [
      { t: 'React  · TypeScript',   c: '#60a5fa' },
      { t: 'Node   · Express',      c: '#34d399' },
      { t: 'PostgreSQL · Prisma',   c: '#a5f3fc' },
      { t: 'Docker · CI/CD',        c: '#fbbf24' },
      { t: 'UML    · BPMN',         c: 'rgba(148,163,184,0.55)' },
    ],
  },
];

const pills = [
  { label: 'Systems Analyst',    dot: '#3b82f6', border: 'rgba(59,130,246,0.45)',  bg: 'rgba(37,99,235,0.1)',  pos: { left: '1%',  top: '74%' } },
  { label: 'Full Stack Dev',     dot: '#10b981', border: 'rgba(16,185,129,0.4)',   bg: 'rgba(5,150,105,0.1)',  pos: { left: '1%',  top: '81%' } },
  { label: 'AI Engineer',  dot: '#8b5cf6', border: 'rgba(139,92,246,0.4)',  bg: 'rgba(109,40,217,0.1)', pos: { left: '1%',  top: '88%' } },
];

const navSections = ['Experience', 'Projects', 'Education', 'Skills', 'Contact'];

// Connection data: which card connects to which (by card id)
// Each connection draws an SVG path that reveals stroke-dashoffset → 0
const connections = [
  { from: 'ts',   to: 'batman', color: '#3b82f6', delay: 2.2 },
  { from: 'bpmn', to: 'batman', color: '#22d3ee', delay: 2.8 },
  { from: 'uml',  to: 'batman', color: '#22d3ee', delay: 3.4 },
  { from: 'api',  to: 'batman', color: '#34d399', delay: 3.9 },
  { from: 'stack',to: 'batman', color: '#fbbf24', delay: 4.4 },
];

// ─────────────────────────────────────────────
// BATMAN SVG — full 3D detailed
// ─────────────────────────────────────────────
function BatmanFigure() {
  return (
    <svg
      viewBox="0 0 340 520"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="gHead" cx="42%" cy="38%" r="58%">
          <stop offset="0%"   stopColor="#1e2848"/>
          <stop offset="35%"  stopColor="#0d1320"/>
          <stop offset="100%" stopColor="#020408"/>
        </radialGradient>
        <radialGradient id="gCowlFace" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#0c1220"/>
          <stop offset="100%" stopColor="#030508"/>
        </radialGradient>
        <linearGradient id="gSuitL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1c2844"/>
          <stop offset="30%"  stopColor="#0e1628"/>
          <stop offset="65%"  stopColor="#080c18"/>
          <stop offset="100%" stopColor="#020406"/>
        </linearGradient>
        <linearGradient id="gSuitR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0c1830"/>
          <stop offset="55%"  stopColor="#06090f"/>
          <stop offset="100%" stopColor="#020306"/>
        </linearGradient>
        <linearGradient id="gArmL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1a2640"/>
          <stop offset="50%"  stopColor="#0a1020"/>
          <stop offset="100%" stopColor="#040810"/>
        </linearGradient>
        <linearGradient id="gArmR" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#161e34"/>
          <stop offset="50%"  stopColor="#07090f"/>
          <stop offset="100%" stopColor="#020406"/>
        </linearGradient>
        <radialGradient id="gChest" cx="48%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#fcd34d"/>
          <stop offset="45%"  stopColor="#d97706"/>
          <stop offset="100%" stopColor="#78350f"/>
        </radialGradient>
        <radialGradient id="gEye" cx="32%" cy="30%" r="72%">
          <stop offset="0%"   stopColor="#f0f9ff"/>
          <stop offset="50%"  stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </radialGradient>
        <radialGradient id="gCape" cx="50%" cy="4%" r="82%">
          <stop offset="0%"   stopColor="#111e30"/>
          <stop offset="55%"  stopColor="#060c16"/>
          <stop offset="100%" stopColor="#01030a"/>
        </radialGradient>
        <linearGradient id="gLeg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0e1828"/>
          <stop offset="45%"  stopColor="#161e34"/>
          <stop offset="100%" stopColor="#060a14"/>
        </linearGradient>
        <radialGradient id="gKnee" cx="28%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#1e2e4c"/>
          <stop offset="100%" stopColor="#060b18"/>
        </radialGradient>
        <linearGradient id="gRimL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1e3a5a" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#1e3a5a" stopOpacity="0"/>
        </linearGradient>
        <filter id="eyeBloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="chestGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>
          <feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="drop" x="-15%" y="-5%" width="130%" height="120%">
          <feDropShadow dx="5" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.9"/>
        </filter>
        <style>{`
          @keyframes batEye{0%,100%{opacity:.92}45%{opacity:1}55%{opacity:.82}}
          @keyframes batChest{0%,100%{opacity:.82}50%{opacity:1}}
          @keyframes capeBreath{0%,100%{transform:scaleX(1) rotate(0deg)}50%{transform:scaleX(1.035) rotate(.25deg)}}
          @keyframes blink{0%,90%,100%{opacity:.92}93%,97%{opacity:.05}}
          .el{animation:blink 6s ease-in-out infinite; transform-origin:157px 142px;}
          .er{animation:blink 6s ease-in-out infinite .15s; transform-origin:183px 142px;}
          .chest{animation:batChest 3.2s ease-in-out infinite;}
          .cape{animation:capeBreath 3.5s ease-in-out infinite;transform-origin:170px 118px;}
        `}</style>
      </defs>

      {/* ── CAPE ── */}
      <g className="cape" filter="url(#drop)">
        <path d="M170,118 C128,130 78,150 46,198 C20,234 12,268 14,302 C16,320 22,330 31,326 C42,315 58,286 76,265 C93,245 116,232 138,226 C155,220 166,219 168,235 L170,252 L172,235 C174,219 185,220 202,226 C224,232 247,245 264,265 C282,286 298,315 309,326 C318,330 324,320 326,302 C328,268 320,234 294,198 C262,150 212,130 170,118Z" fill="url(#gCape)"/>
        {/* Cape edges */}
        <path d="M170,118 C128,130 78,150 46,198 C20,234 12,268 14,302" fill="none" stroke="#192840" strokeWidth="0.6" opacity="0.7"/>
        <path d="M170,118 C212,130 262,150 294,198 C320,234 328,268 326,302" fill="none" stroke="#0f1e30" strokeWidth="0.6" opacity="0.6"/>
        {/* Fabric texture */}
        <path d="M108,162 L72,300" fill="none" stroke="#0e1e34" strokeWidth="0.5" opacity="0.5"/>
        <path d="M140,144 L118,302" fill="none" stroke="#0e1e34" strokeWidth="0.4" opacity="0.4"/>
        <path d="M200,144 L222,302" fill="none" stroke="#0a1628" strokeWidth="0.4" opacity="0.4"/>
        <path d="M232,162 L268,300" fill="none" stroke="#0a1628" strokeWidth="0.5" opacity="0.4"/>
        {/* Jagged hem — 25 teeth */}
        <path d="
          M31,326 C42,315 58,286 76,265 C93,245 116,232 138,226 C155,220 166,219 168,235
          L169,276 L170,252 L171,276 L172,235
          C174,219 185,220 202,226 C224,232 247,245 264,265 C282,286 298,315 309,326
          L304,308 L295,334 L288,306 L280,336 L273,308
          L265,338 L258,310 L250,340 L243,312 L236,342
          L229,314 L222,342 L215,316 L209,344 L203,318
          L197,346 L191,320 L185,346 L179,318 L173,344
          L167,318 L161,346 L155,318 L149,342 L143,316
          L136,342 L130,312 L122,340 L115,310 L107,338
          L100,308 L91,334 L83,306 L75,332 L70,326Z
        " fill="#030608" stroke="#0a1020" strokeWidth="0.3"/>
      </g>

      {/* ── TORSO ── */}
      <path d="M132,200 C128,218 126,240 126,262 C126,282 128,298 132,316 L170,326 L208,316 C212,298 214,282 214,262 C214,240 212,218 208,200 C196,191 184,187 170,187 C156,187 144,191 132,200Z" fill="url(#gSuitL)"/>
      {/* Right half darker */}
      <path d="M208,200 C214,218 216,240 216,262 C216,282 214,298 210,316 L170,326 L170,187 C184,187 196,191 208,200Z" fill="url(#gSuitR)" opacity="0.75"/>
      {/* Muscle panel lines */}
      <path d="M146,208 C144,228 143,250 144,270 C145,285 148,297 151,308" fill="none" stroke="#1a2844" strokeWidth="0.9" opacity="0.75"/>
      <path d="M157,202 C154,225 153,248 154,269 C155,283 158,295 162,308" fill="none" stroke="#1a2844" strokeWidth="0.65" opacity="0.55"/>
      <path d="M183,202 C186,225 187,248 186,269 C185,283 182,295 178,308" fill="none" stroke="#0e1a2e" strokeWidth="0.65" opacity="0.55"/>
      <path d="M194,208 C196,228 197,250 196,270 C195,285 192,297 189,308" fill="none" stroke="#0e1a2e" strokeWidth="0.9" opacity="0.75"/>
      {/* Pec ridge */}
      <path d="M136,218 C142,212 157,209 170,210 C183,209 198,212 204,218" fill="none" stroke="#1c2e4a" strokeWidth="0.9" opacity="0.65"/>
      <path d="M134,232 C140,225 157,222 170,223 C183,222 200,225 206,232" fill="none" stroke="#1c2e4a" strokeWidth="0.6" opacity="0.45"/>
      {/* Blue sheen highlight left side */}
      <path d="M150,200 C146,222 145,246 146,268 C147,283 151,296 155,308 L170,312 L170,187 C162,187 156,192 150,200Z" fill="rgba(59,130,246,0.07)"/>

      {/* ── CHEST BAT EMBLEM ── */}
      <g className="chest" transform="translate(170,257)" filter="url(#chestGlow)">
        {/* Wings */}
        <path d="M0,-17 C-11,-12 -26,-7 -34,0 C-26,6 -15,8 0,6 C15,8 26,6 34,0 C26,-7 11,-12 0,-17Z" fill="url(#gChest)"/>
        {/* Body oval */}
        <ellipse cx="0" cy="0" rx="7.5" ry="13" fill="#92400e"/>
        {/* Ear spikes */}
        <path d="M-9,-17 L-14,-26 L-4,-16Z" fill="#fcd34d"/>
        <path d="M9,-17 L14,-26 L4,-16Z" fill="#fcd34d"/>
        {/* Wing veins */}
        <path d="M-6,-12 C-12,-7 -22,-3 -28,0" fill="none" stroke="#fde68a" strokeWidth="0.6" opacity="0.45"/>
        <path d="M6,-12 C12,-7 22,-3 28,0" fill="none" stroke="#ca8a04" strokeWidth="0.6" opacity="0.35"/>
        {/* Specular highlight */}
        <path d="M-12,-10 C-8,-15 -3,-16 0,-17 C-5,-13 -9,-7 -11,-2" fill="none" stroke="#fef3c7" strokeWidth="0.7" opacity="0.5"/>
      </g>

      {/* ── BELT ── */}
      <rect x="132" y="298" width="76" height="14" rx="4" fill="#1c1600"/>
      <rect x="132" y="298" width="76" height="14" rx="4" fill="none" stroke="#d97706" strokeWidth="0.55" opacity="0.75"/>
      {/* Buckle */}
      <rect x="162" y="300" width="16" height="10" rx="2" fill="#fcd34d" opacity="0.95"/>
      <rect x="164" y="302" width="12" height="6" rx="1" fill="#92400e"/>
      {/* Pouches */}
      <rect x="135" y="300" width="11" height="9" rx="2" fill="#181000" stroke="#b45309" strokeWidth="0.4" opacity="0.85"/>
      <rect x="149" y="300" width="9" height="9" rx="2" fill="#181000" stroke="#b45309" strokeWidth="0.4" opacity="0.75"/>
      <rect x="182" y="300" width="9" height="9" rx="2" fill="#181000" stroke="#b45309" strokeWidth="0.4" opacity="0.75"/>
      <rect x="194" y="300" width="11" height="9" rx="2" fill="#181000" stroke="#b45309" strokeWidth="0.4" opacity="0.85"/>

      {/* ── LEFT ARM ── */}
      <path d="M132,200 C124,208 116,224 113,241 C110,256 111,268 114,276 C116,282 121,284 125,282 C130,279 132,271 134,262 L137,240 L138,213 L136,200Z" fill="url(#gArmL)"/>
      <path d="M132,200 C126,213 124,231 124,246 C124,258 127,268 130,274" fill="none" stroke="#1c2e4a" strokeWidth="0.85" opacity="0.55"/>
      {/* Forearm / gauntlet */}
      <path d="M114,276 C112,284 112,295 114,305 C115,312 120,315 124,313 C128,311 131,304 132,295 L134,281 L132,270Z" fill="#070b18"/>
      {/* Gauntlet spikes */}
      <path d="M108,280 L103,273 L110,282Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      <path d="M107,290 L101,285 L108,293Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      <path d="M108,300 L102,297 L109,305Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      {/* Glove */}
      <ellipse cx="122" cy="314" rx="12" ry="9" fill="#060912"/>
      <path d="M114,313 C116,318 119,320 122,320 C125,320 128,318 130,313" fill="none" stroke="#0e1828" strokeWidth="0.5"/>

      {/* ── RIGHT ARM ── */}
      <path d="M208,200 C216,208 224,224 227,241 C230,256 229,268 226,276 C224,282 219,284 215,282 C210,279 208,271 206,262 L203,240 L202,213 L204,200Z" fill="url(#gArmR)"/>
      <path d="M208,200 C214,213 216,231 216,246 C216,258 213,268 210,274" fill="none" stroke="#0e1828" strokeWidth="0.85" opacity="0.5"/>
      <path d="M226,276 C228,284 228,295 226,305 C225,312 220,315 216,313 C212,311 209,304 208,295 L206,281 L208,270Z" fill="#070b18"/>
      <path d="M232,280 L237,273 L230,282Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      <path d="M233,290 L239,285 L232,293Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      <path d="M232,300 L238,297 L231,305Z" fill="#0e1830" stroke="#1e3a5c" strokeWidth="0.6"/>
      <ellipse cx="218" cy="314" rx="12" ry="9" fill="#060912"/>
      <path d="M210,313 C212,318 215,320 218,320 C221,320 224,318 226,313" fill="none" stroke="#0e1828" strokeWidth="0.5"/>

      {/* ── LEFT LEG ── */}
      <path d="M132,316 C128,327 125,348 123,368 C121,385 120,398 122,410 C124,421 130,426 136,424 C142,421 145,412 146,401 L148,372 L150,345 L142,316Z" fill="url(#gLeg)"/>
      {/* Knee pad */}
      <ellipse cx="136" cy="360" rx="15" ry="13" fill="url(#gKnee)"/>
      <ellipse cx="136" cy="360" rx="11" ry="9" fill="#0b1424" stroke="#1c3450" strokeWidth="0.55"/>
      <ellipse cx="136" cy="360" rx="5" ry="4" fill="#162040" stroke="#1e3a5a" strokeWidth="0.4"/>
      {/* Boot */}
      <path d="M122,410 C121,419 120,427 120,433 C120,440 124,443 130,443 L142,443 C147,443 149,440 149,433 C149,424 147,417 145,413 C142,421 138,425 134,424Z" fill="#040810"/>
      <rect x="116" y="434" width="36" height="7" rx="3" fill="#040810"/>
      <path d="M117,438 C123,436 130,435 136,435 C142,435 148,436 152,438" fill="none" stroke="#1c3450" strokeWidth="0.5" opacity="0.5"/>

      {/* ── RIGHT LEG ── */}
      <path d="M208,316 C212,327 215,348 217,368 C219,385 220,398 218,410 C216,421 210,426 204,424 C198,421 195,412 194,401 L192,372 L190,345 L198,316Z" fill="url(#gSuitL)"/>
      <ellipse cx="204" cy="360" rx="15" ry="13" fill="url(#gKnee)"/>
      <ellipse cx="204" cy="360" rx="11" ry="9" fill="#0b1424" stroke="#1c3450" strokeWidth="0.55"/>
      <ellipse cx="204" cy="360" rx="5" ry="4" fill="#162040" stroke="#1e3a5a" strokeWidth="0.4"/>
      <path d="M218,410 C219,419 220,427 220,433 C220,440 216,443 210,443 L198,443 C193,443 191,440 191,433 C191,424 193,417 195,413 C198,421 202,425 206,424Z" fill="#040810"/>
      <rect x="188" y="434" width="36" height="7" rx="3" fill="#040810"/>
      <path d="M183,438 C189,436 196,435 202,435 C208,435 215,436 223,438" fill="none" stroke="#1c3450" strokeWidth="0.5" opacity="0.5"/>

      {/* ── NECK ── */}
      <rect x="162" y="170" width="16" height="22" rx="4" fill="#060a16"/>
      <rect x="166" y="170" width="8" height="22" rx="2" fill="#020508" opacity="0.75"/>

      {/* ── HEAD / COWL ── */}
      {/* Head base volume */}
      <ellipse cx="170" cy="146" rx="33" ry="37" fill="url(#gHead)"/>
      {/* Face plate */}
      <path d="M137,146 C137,123 148,109 170,107 C192,109 203,123 203,146" fill="#050810"/>
      {/* Inner dome */}
      <ellipse cx="170" cy="134" rx="31" ry="27" fill="#08101e"/>
      {/* Brow ridge 3D */}
      <path d="M143,126 C149,119 160,117 170,117 C180,117 191,119 197,126" fill="none" stroke="#1a2a48" strokeWidth="1.1" opacity="0.75"/>
      {/* Cowl 3D left highlight */}
      <path d="M146,130 C143,140 143,152 146,164 C148,148 153,132 146,130Z" fill="#1e3050" opacity="0.5"/>
      <path d="M194,130 C197,140 197,152 194,164 C192,148 187,132 194,130Z" fill="#0c1828" opacity="0.35"/>
      {/* Side panels */}
      <path d="M137,136 C137,124 140,116 146,112 C141,120 139,130 139,140Z" fill="#0c1628" opacity="0.6"/>
      <path d="M203,136 C203,124 200,116 194,112 C199,120 201,130 201,140Z" fill="#060c18" opacity="0.5"/>

      {/* ── BAT EARS ── */}
      {/* Left ear with 3D depth */}
      <path d="M146,116 L132,60 L158,106Z" fill="#050810" stroke="#0c1828" strokeWidth="0.5"/>
      <path d="M146,116 L132,60" stroke="#101e38" strokeWidth="0.9" opacity="0.7"/>
      <path d="M146,116 L158,106" stroke="#0a1420" strokeWidth="0.6" opacity="0.5"/>
      <path d="M138,85 C137,80 135,74 133,68" fill="none" stroke="#0e1a30" strokeWidth="0.5" opacity="0.6"/>
      {/* Right ear */}
      <path d="M194,116 L208,60 L182,106Z" fill="#030608" stroke="#0a1420" strokeWidth="0.5"/>
      <path d="M194,116 L208,60" stroke="#0e1828" strokeWidth="0.9" opacity="0.6"/>
      <path d="M194,116 L182,106" stroke="#060e1c" strokeWidth="0.6" opacity="0.4"/>
      <path d="M202,85 C203,80 205,74 207,68" fill="none" stroke="#0c1626" strokeWidth="0.5" opacity="0.5"/>

      {/* ── EYES — full detail + bloom ── */}
      {/* Left eye */}
      <ellipse cx="157" cy="140" rx="15" ry="9" fill="#01030a"/>
      <ellipse className="el" cx="157" cy="140" rx="12" ry="7" fill="url(#gEye)" filter="url(#eyeBloom)"/>
      <ellipse cx="157" cy="140" rx="15" ry="9" fill="none" stroke="#0e1e38" strokeWidth="0.9"/>
      {/* Left iris detail */}
      <ellipse cx="157" cy="140" rx="6" ry="3.5" fill="#7dd3fc" opacity="0.55"/>
      <ellipse cx="157" cy="140" rx="3" ry="2" fill="#0369a1" opacity="0.4"/>
      {/* Left specular */}
      <ellipse cx="152" cy="137" rx="3.5" ry="1.8" fill="#fff" opacity="0.65"/>
      <ellipse cx="163" cy="142" rx="1.5" ry="1" fill="#fff" opacity="0.25"/>

      {/* Right eye */}
      <ellipse cx="183" cy="140" rx="15" ry="9" fill="#01030a"/>
      <ellipse className="er" cx="183" cy="140" rx="12" ry="7" fill="url(#gEye)" filter="url(#eyeBloom)"/>
      <ellipse cx="183" cy="140" rx="15" ry="9" fill="none" stroke="#0e1e38" strokeWidth="0.9"/>
      <ellipse cx="183" cy="140" rx="6" ry="3.5" fill="#7dd3fc" opacity="0.55"/>
      <ellipse cx="183" cy="140" rx="3" ry="2" fill="#0369a1" opacity="0.4"/>
      <ellipse cx="178" cy="137" rx="3.5" ry="1.8" fill="#fff" opacity="0.65"/>
      <ellipse cx="189" cy="142" rx="1.5" ry="1" fill="#fff" opacity="0.25"/>

      {/* Chin / jaw line */}
      <path d="M152,160 C157,167 163,170 170,170 C177,170 183,167 188,160" fill="none" stroke="#0a1424" strokeWidth="1.3"/>
      <ellipse cx="170" cy="165" rx="19" ry="9" fill="#060a14"/>

      {/* Rim light left */}
      <path d="M132,200 C123,210 116,228 113,246 C111,260 113,272 118,280" fill="none" stroke="#1e3a5a" strokeWidth="1.1" opacity="0.45"/>
      {/* Rim light right */}
      <path d="M208,200 C217,210 224,228 227,246 C229,260 227,272 222,280" fill="none" stroke="#0c1828" strokeWidth="0.9" opacity="0.35"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// ANIMATED CONNECTION LINE COMPONENT
// ─────────────────────────────────────────────
function ConnectionLine({ 
  fromX, fromY, toX, toY, color, delay, strokeLen 
}: { 
  fromX: number; fromY: number; toX: number; toY: number; 
  color: string; delay: number; strokeLen: number;
}) {
  return (
    <motion.path
      d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${(fromY + toY) / 2 - 30} ${toX},${toY}`}
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray={`${strokeLen}`}
      initial={{ strokeDashoffset: strokeLen, opacity: 0 }}
      animate={{ strokeDashoffset: 0, opacity: 0.5 }}
      transition={{ duration: 1.2, delay, ease: 'easeInOut' }}
    />
  );
}

// ─────────────────────────────────────────────
// ANIMATED CARD COMPONENT — line-by-line reveal
// ─────────────────────────────────────────────
function AnimCard({ card, cardIndex }: { card: typeof cards[0]; cardIndex: number }) {
  const baseDelay = cardIndex * 0.55 + 0.6;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        ...card.pos,
        background: card.bg,
        border: `0.5px solid ${card.border}`,
        borderRadius: 8,
        padding: '9px 13px',
        fontFamily: 'monospace',
        fontSize: 10,
        backdropFilter: 'blur(8px)',
        boxShadow: `0 0 22px ${card.glow}, inset 0 0 0 0.5px ${card.border}`,
        minWidth: 168,
        zIndex: 20,
        animation: `floatCard${cardIndex} ${card.floatDur}s ease-in-out ${baseDelay + 0.5}s infinite`,
      }}
    >
      {/* Card title bar */}
      {card.isUml ? (
        <div style={{
          background: 'rgba(34,211,238,0.13)',
          padding: '3px 8px',
          margin: '-9px -13px 7px',
          borderBottom: `0.5px solid ${card.border}`,
          color: card.titleColor,
          fontSize: 9,
          letterSpacing: '0.04em',
          borderRadius: '8px 8px 0 0',
        }}>
          {card.title}
        </div>
      ) : (
        <div style={{ color: card.titleColor, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
          {card.title}
        </div>
      )}
      {/* Lines — each reveals with its own stagger */}
      {card.lines.map((line, li) => (
        <motion.div
          key={li}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: baseDelay + 0.25 + li * 0.08, ease: 'easeOut' }}
          style={{ color: line.c, marginBottom: 2, lineHeight: 1.6, whiteSpace: 'nowrap' }}
        >
          {line.t}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN HERO
// ─────────────────────────────────────────────
export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });

  // Connection endpoint refs — we'll use approximate positions
  // Left cards connect from their right edge, right cards from left edge
  // Batman center is approx 50% of screen, 55% height

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #050d1a 0%, #000 100%)' }}
    >
      {/* keyframes injected globally */}
      <style>{`
        @keyframes gridDrift{from{background-position:0 0}to{background-position:48px 48px}}
        @keyframes scanDown{0%{top:-3px;opacity:0}8%{opacity:1}92%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes ringOut{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.22}50%{transform:translate(-50%,-50%) scale(1.18);opacity:.04}}
        @keyframes gndPulse{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.55}50%{transform:translateX(-50%) scaleX(1.14);opacity:.9}}
        @keyframes ptRise{0%{opacity:0;transform:translateY(0)}20%{opacity:.85}80%{opacity:.4}100%{opacity:0;transform:translateY(-130px)}}
        @keyframes floatCard0{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
        @keyframes floatCard1{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes floatCard2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes floatCard3{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes floatCard4{0%,100%{transform:translateY(0)}50%{transform:translateY(-13px)}}
        @keyframes nodePulse{0%,100%{r:4;opacity:.8}50%{r:6.5;opacity:1}}
        .scan-ln{animation:scanDown 4.5s linear infinite;}
        .ring1{animation:ringOut 3.2s ease-in-out infinite;}
        .ring2{animation:ringOut 4s ease-in-out infinite 1.6s;}
        .gnd{animation:gndPulse 5s ease-in-out infinite;}
        .pt{animation:ptRise var(--d) ease-in var(--dl) infinite;opacity:0;}
        .fn{animation:nodePulse 2.8s ease-in-out infinite;}
      `}</style>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(37,99,235,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.07) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
        animation: 'gridDrift 22s linear infinite',
      }}/>

      {/* Scan line */}
      <div className="scan-ln" style={{ position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(37,99,235,0.25),transparent)',zIndex:8,pointerEvents:'none'}}/>

      {/* Pulse rings centered on batman */}
      <div className="ring1" style={{ position:'absolute',width:320,height:320,borderRadius:'50%',border:'0.5px solid rgba(37,99,235,0.2)',top:'58%',left:'50%',transform:'translate(-50%,-50%)',zIndex:4,pointerEvents:'none'}}/>
      <div className="ring2" style={{ position:'absolute',width:460,height:460,borderRadius:'50%',border:'0.5px solid rgba(37,99,235,0.1)',top:'58%',left:'50%',transform:'translate(-50%,-50%)',zIndex:4,pointerEvents:'none'}}/>

      {/* Ground glow */}
      <div className="gnd" style={{ position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',width:300,height:24,background:'radial-gradient(ellipse,rgba(37,99,235,0.45) 0%,transparent 70%)',borderRadius:'50%',zIndex:6,pointerEvents:'none'}}/>

      {/* Particles */}
      {[
        {l:'41%',b:'21%',sz:3,c:'#60a5fa',d:'3.3s',dl:'0s'},
        {l:'55%',b:'19%',sz:2,c:'#22d3ee',d:'4.1s',dl:'.7s'},
        {l:'38%',b:'17%',sz:2,c:'#60a5fa',d:'3.7s',dl:'1.4s'},
        {l:'62%',b:'22%',sz:3,c:'#38bdf8',d:'5.2s',dl:'.3s'},
        {l:'50%',b:'23%',sz:2,c:'#93c5fd',d:'3.9s',dl:'2s'},
        {l:'44%',b:'25%',sz:1,c:'#fbbf24',d:'4.5s',dl:'1s'},
      ].map((p,i)=>(
        <div key={i} className="pt" style={{
          position:'absolute',left:p.l,bottom:p.b,
          width:p.sz,height:p.sz,borderRadius:'50%',background:p.c,
          zIndex:6,pointerEvents:'none',
          '--d':p.d,'--dl':p.dl
        } as React.CSSProperties}/>
      ))}

      {/* ── HERO GRID ── */}
      <div style={{
        position:'relative',zIndex:10,
        display:'grid',
        gridTemplateColumns:'230px 1fr 230px',
        minHeight:'100vh',
        paddingTop:80,
      }}>

        {/* LEFT COL */}
        <motion.div
          initial={{opacity:0,x:-32}}
          animate={{opacity:1,x:0}}
          transition={{duration:.7,delay:.3}}
          style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 24px 96px',gap:0}}
        >
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:20,color:'#fff',lineHeight:1.3,marginBottom:10}}>
            From Blueprints<br/>to Bytecode
          </h2>
          <p style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.35)',lineHeight:1.75,maxWidth:170}}>
            Systems thinking meets full-stack engineering. I design and build things that actually work.
          </p>

          {/* Stagger pills */}
          <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8}}>
            {pills.map((pill,i)=>(
              <motion.div
                key={i}
                initial={{opacity:0,x:-16}}
                animate={{opacity:1,x:0}}
                transition={{duration:.45,delay:1.8+i*0.18,ease:'easeOut'}}
                style={{
                  display:'inline-flex',alignItems:'center',gap:7,
                  padding:'5px 12px',borderRadius:99,
                  fontFamily:'monospace',fontSize:10,
                  color:'rgba(199,214,245,0.9)',
                  background:pill.bg,
                  border:`0.5px solid ${pill.border}`,
                  width:'fit-content',
                }}
              >
                <div style={{width:5,height:5,borderRadius:'50%',background:pill.dot,flexShrink:0}}/>
                {pill.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CENTER COL */}
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>

          {/* Headline */}
          <motion.div
            initial={{opacity:0,y:-22}}
            animate={{opacity:1,y:0}}
            transition={{duration:.65,delay:.25}}
            style={{position:'absolute',top:28,left:0,right:0,textAlign:'center',zIndex:10,pointerEvents:'none'}}
          >
            <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(96,165,250,0.45)',letterSpacing:'0.14em',marginBottom:6}}>
              Systems Analyst · Full Stack Developer
            </div>
            <h1 style={{fontFamily:'Georgia,serif',fontWeight:800,lineHeight:1.12,letterSpacing:'-0.01em',fontSize:'clamp(24px,3.8vw,44px)'}}>
              <span style={{color:'#fff'}}>Think in Systems,<br/>Build in </span>
              <span style={{background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Code.</span>
            </h1>
          </motion.div>

          {/* Floating cards — left side */}
          {cards.filter((_,i)=>i<2).map((c,i)=>(
            <AnimCard key={c.id} card={c} cardIndex={i}/>
          ))}

          {/* Floating cards — right side */}
          {cards.filter((_,i)=>i>=2).map((c,i)=>(
            <AnimCard key={c.id} card={c} cardIndex={i+2}/>
          ))}

          {/* SVG layer: connection lines + nodes */}
          <svg
            style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:5,pointerEvents:'none',overflow:'visible'}}
            viewBox="0 0 760 680"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 2L8 5L2 8" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round"/>
              </marker>
            </defs>

            {/* Card→Batman connections: left cards */}
            <motion.path d="M185,120 Q320,180 365,310"
              fill="none" stroke="#3b82f6" strokeWidth="0.9"
              strokeDasharray="220" initial={{strokeDashoffset:220,opacity:0}}
              animate={{strokeDashoffset:0,opacity:0.45}}
              transition={{duration:1.2,delay:1.1,ease:'easeInOut'}}
              markerEnd="url(#arr)"/>

            <motion.path d="M185,372 Q300,360 365,370"
              fill="none" stroke="#22d3ee" strokeWidth="0.9"
              strokeDasharray="200" initial={{strokeDashoffset:200,opacity:0}}
              animate={{strokeDashoffset:0,opacity:0.4}}
              transition={{duration:1.1,delay:1.7,ease:'easeInOut'}}
              markerEnd="url(#arr)"/>

            {/* Card→Batman connections: right cards */}
            <motion.path d="M575,95 Q490,180 400,310"
              fill="none" stroke="#22d3ee" strokeWidth="0.9"
              strokeDasharray="240" initial={{strokeDashoffset:240,opacity:0}}
              animate={{strokeDashoffset:0,opacity:0.4}}
              transition={{duration:1.2,delay:2.3,ease:'easeInOut'}}
              markerEnd="url(#arr)"/>

            <motion.path d="M575,310 Q490,320 400,340"
              fill="none" stroke="#34d399" strokeWidth="0.9"
              strokeDasharray="190" initial={{strokeDashoffset:190,opacity:0}}
              animate={{strokeDashoffset:0,opacity:0.38}}
              transition={{duration:1,delay:2.9,ease:'easeInOut'}}
              markerEnd="url(#arr)"/>

            <motion.path d="M575,510 Q480,440 400,380"
              fill="none" stroke="#fbbf24" strokeWidth="0.9"
              strokeDasharray="220" initial={{strokeDashoffset:220,opacity:0}}
              animate={{strokeDashoffset:0,opacity:0.38}}
              transition={{duration:1.2,delay:3.5,ease:'easeInOut'}}
              markerEnd="url(#arr)"/>

            {/* Pulsing nodes at connection endpoints on batman */}
            {[
              {cx:380,cy:310,c:'#3b82f6',dl:'1.3s'},
              {cx:385,cy:360,c:'#22d3ee',dl:'1.9s'},
              {cx:375,cy:325,c:'#34d399',dl:'3.1s'},
              {cx:382,cy:345,c:'#fbbf24',dl:'3.7s'},
            ].map((n,i)=>(
              <motion.circle key={i} className="fn" cx={n.cx} cy={n.cy} r="4" fill={n.c}
                initial={{opacity:0}} animate={{opacity:0.8}}
                transition={{delay: parseFloat(n.dl)+0.8, duration:0.4}}
                style={{animationDelay:n.dl}}/>
            ))}
          </svg>

          {/* Batman — 3D detailed */}
          <motion.div
            initial={{opacity:0,scale:.86,y:20}}
            animate={{opacity:1,scale:1,y:0}}
            transition={{duration:1,delay:.55,ease:[.22,1,.36,1]}}
            style={{
              position:'relative',
              width:340,height:520,
              filter:'drop-shadow(0 0 55px rgba(37,99,235,0.22)) drop-shadow(0 20px 40px rgba(0,0,0,0.9))',
              zIndex:15,
            }}
          >
            <motion.div
              animate={{y:[0,-20,0],rotate:[-0.4,0.4,-0.4]}}
              transition={{duration:5.5,repeat:Infinity,ease:'easeInOut'}}
              style={{width:'100%',height:'100%'}}
            >
              <BatmanFigure/>
            </motion.div>
          </motion.div>

        </div>{/* end center */}

        {/* RIGHT COL */}
        <motion.div
          initial={{opacity:0,x:32}}
          animate={{opacity:1,x:0}}
          transition={{duration:.7,delay:.45}}
          style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center',paddingRight:20,gap:10}}
        >
          {navSections.map((s,i)=>(
            <button key={s} onClick={()=>scrollTo(s)}
              style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer',padding:'2px 0'}}
            >
              <span style={{
                fontFamily:'monospace',fontSize:10,
                color: i===0 ? '#60a5fa' : 'rgba(255,255,255,0.2)',
                transition:'color .2s',
              }}>{s}</span>
              <div style={{
                height:1,
                width: i===0 ? 32 : 22,
                background: i===0 ? '#3b82f6' : 'rgba(255,255,255,0.12)',
                transition:'all .2s',
              }}/>
            </button>
          ))}

          {/* Stats */}
          <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:16,alignItems:'flex-end'}}>
            {[
              {v:'12+', l:'Systems Modeled'},
              {v:'8+',  l:'Projects Shipped'},
              {v:'Full',l:'Stack Coverage'},
            ].map(s=>(
              <motion.div
                key={s.l}
                initial={{opacity:0,x:20}}
                animate={{opacity:1,x:0}}
                transition={{duration:.5,delay:1.6}}
                style={{textAlign:'right'}}
              >
                <div style={{fontFamily:'monospace',fontWeight:700,fontSize:20,color:'#fff'}}>{s.v}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(96,165,250,0.5)'}}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>{/* end grid */}

      {/* Scroll */}
      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:2}}
        style={{
          position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:6,
          color:'rgba(100,116,139,0.65)',zIndex:20,
        }}
      >
        <span style={{fontFamily:'monospace',fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase'}}>Scroll</span>
        <motion.div animate={{y:[0,8,0]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut'}}>
          <ArrowDown size={15}/>
        </motion.div>
      </motion.div>

    </section>
  );
}