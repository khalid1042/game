import React, { useState } from 'react';
import { Play, BookOpen, Satellite, ShieldCheck, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface TitleScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleStart = () => {
    soundFX.playStartMission();
    onStartGame();
  };

  return (
    <div className="relative z-20 flex flex-col justify-between w-full h-full min-h-screen p-6 md:p-12 text-slate-100 select-none bg-gradient-to-b from-emerald-950/40 via-transparent to-slate-950/80 pointer-events-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 text-xs font-semibold tracking-wider uppercase rounded border border-emerald-500/40 bg-emerald-900/40 text-emerald-300">
            NASA Space Apps Challenge
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Mission 001 · Brazilian Amazon Basin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute procedural audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setShowHowItWorks(true);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            How It Works
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup with 30-40% Negative Space */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-3xl mx-auto px-4">
        {/* Inline SVG Title Lockup */}
        <div className="mb-4">
          <svg viewBox="0 0 680 130" className="w-full max-w-2xl h-auto drop-shadow-2xl">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Earth Gear Badge Icon */}
            <g transform="translate(60, 65)">
              <circle r="34" fill="url(#glowGrad)" stroke="#34d399" strokeWidth="2.5" />
              {/* Stylized continents and repair wrench/leaf */}
              <path
                d="M-14 -12 C-8 -22, 6 -20, 16 -12 C24 -2, 22 14, 12 22 C2 28, -12 24, -20 14 Z"
                fill="#065f46"
                stroke="#6ee7b7"
                strokeWidth="1.5"
              />
              <path
                d="M-4 -20 L4 -20 L6 -8 L-6 -8 Z M-20 -4 L-20 4 L-8 6 L-8 -6 Z M20 -4 L20 4 L8 6 L8 -6 Z M-4 20 L4 20 L6 8 L-6 8 Z"
                fill="#34d399"
              />
              <circle r="8" fill="#38bdf8" />
            </g>

            {/* Typography */}
            <text
              x="130"
              y="60"
              fill="url(#titleGrad)"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="48"
              fontWeight="900"
              letterSpacing="3"
            >
              PLANET REPAIR SHOP
            </text>
            <text
              x="132"
              y="88"
              fill="#94a3b8"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="14"
              fontWeight="600"
              letterSpacing="2.5"
            >
              AI-POWERED EARTH RESTORATION SIMULATOR
            </text>
            <line x1="130" y1="102" x2="620" y2="102" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />
          </svg>
        </div>

        <p className="text-base md:text-lg text-emerald-100/90 font-normal leading-relaxed max-w-xl mx-auto drop-shadow mb-6">
          Every solution changes something. Every change has consequences. Propose your own restorative plans in free text, explore ecological trade-offs, and guide tropical biomes toward resilience.
        </p>

        {/* Primary Start CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <button
            onClick={handleStart}
            className="group relative px-8 py-3.5 rounded-xl font-bold text-sm md:text-base tracking-wide text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 hover:from-emerald-300 hover:to-sky-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.65)] transition-all flex items-center gap-3 active:scale-95"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START MISSION 001</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-950/20 text-slate-900 font-mono">
              SPACE
            </span>
          </button>
        </div>

        {/* Flat Control Hint Line */}
        <div className="text-xs text-slate-400/90 font-mono tracking-wider flex items-center justify-center gap-2">
          <span>WASD / Drag Orbit</span>
          <span>·</span>
          <span>Space Action</span>
          <span>·</span>
          <span>Esc Pause</span>
          <span>·</span>
          <span>H Toggle HUD</span>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-4 border-t border-slate-800/60 text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-sky-400" />
          <span>Grounded in NASA FIRMS, Landsat NDVI, GEDI Canopy Height, and peer-reviewed tropical forestry literature.</span>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setShowDisclaimer(true);
          }}
          className="text-emerald-400/80 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Data & Simulation Transparency
        </button>
      </div>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                How Planet Repair Shop Works
              </h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono px-2 py-1 rounded bg-slate-800"
              >
                ESC
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-semibold text-emerald-300 mb-1">1. Propose Interventions in Your Own Words</h4>
                <p>
                  No multiple-choice quiz. Enter any strategy in free text—e.g., <em>"Enforce forest protection, fund agroforestry cooperatives, and train rapid volunteer fire brigades."</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-semibold text-sky-300 mb-1">2. Transparent AI Interpretation</h4>
                <p>
                  Gemini translates your natural language proposal into supported action structures and identifies your core assumptions. The AI <strong>never</strong> invents numbers; a deterministic, testable scientific engine updates all variables.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-semibold text-amber-300 mb-1">3. Realistic Ecological Trade-offs & Delays</h4>
                <p>
                  Restoration takes time. Tree plantings mature into closed canopies over 2–3 turns. Banning logging without alternative jobs damages household income and triggers civil discontent.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-semibold text-purple-300 mb-1">4. Evolving World & Multiple Endings</h4>
                <p>
                  Droughts, understory fires, or bio-economy export booms emerge dynamically from your state. Complete 10 simulation turns to discover whether your strategy achieves <em>The Balanced Civilization</em>, <em>The Green Renaissance</em>, or <em>Planetary Harmony</em>.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scientific Transparency Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-sky-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Scientific & Educational Disclosure
            </h3>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Educational Simulation:</strong> Initial scenario indicators (e.g. Forest Condition: 48/100, Budget: 50 FRU) are <em>illustrative game values</em> designed to model complex systems in a manageable classroom/hackathon format. They do not represent official NASA statistical estimates for the entire Amazon.
              </p>
              <p>
                <strong>Observed Earth Data:</strong> Satellite telemetry in the NASA tab draws on calibrated NASA FIRMS (VIIRS 375m active fire detections), Landsat NDVI time-series, and GEDI spaceborne lidar canopy profiles from the Tapajós River study region.
              </p>
              <p>
                <strong>Research Grounding:</strong> Case studies in the Researcher\'s Journal link directly to peer-reviewed publications (PNAS, Science, Nature, Conservation Biology).
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
