import React, { useState, useEffect, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { TopStatusBar } from './components/TopStatusBar';
import { BiomeCanvas3D } from './components/BiomeCanvas3D';
import { BottomDock } from './components/BottomDock';
import { ActionReviewModal } from './components/ActionReviewModal';
import { ConsequenceModal } from './components/ConsequenceModal';
import { EndingModal } from './components/EndingModal';
import { PauseModal } from './components/PauseModal';
import { HotspotDetailDrawer } from './components/HotspotDetailDrawer';
import {
  WorldState,
  InterpretedProposal,
  ConsequenceReport,
} from './simulation/types';
import { createInitialWorldState, executeSimulationStep } from './simulation/engine';
import { SUPPORTED_ACTIONS } from './simulation/catalog';
import { soundFX } from './audio/soundFX';

export default function App() {
  const [gamePhase, setGamePhase] = useState<'title' | 'playing'>('title');
  const [worldState, setWorldState] = useState<WorldState>(() => createInitialWorldState(42));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'firms' | 'ndvi' | 'hydrology' | 'indigenous'>('standard');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Proposal interpretation review state
  const [pendingProposal, setPendingProposal] = useState<InterpretedProposal | null>(null);
  const [pendingProposalText, setPendingProposalText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Consequence report modal state
  const [activeReport, setActiveReport] = useState<ConsequenceReport | null>(null);

  // Sync mute state
  const handleToggleMute = useCallback(() => {
    const nextMuted = soundFX.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Global keyboard shortcuts (Space/Enter to start, Esc to pause, H to toggle HUD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (gamePhase === 'title') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          soundFX.playStartMission();
          setGamePhase('playing');
        }
      } else {
        if (e.code === 'Escape') {
          e.preventDefault();
          soundFX.playClick();
          setIsPaused(prev => !prev);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          soundFX.playClick();
          setIsDockCollapsed(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase]);

  // Handle Free-Text Proposal submission to backend Gemini API
  const handleSubmitProposal = async (proposalText: string) => {
    setIsAnalyzing(true);
    setPendingProposalText(proposalText);

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalText,
          currentIndicators: worldState.indicators,
          simulationYear: worldState.simulationYear,
          availableBudget: worldState.indicators.availableBudget,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: InterpretedProposal = await response.json();
      setPendingProposal(data);
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      // Graceful local fallback parsing
      setPendingProposal({
        understood: true,
        summary: `Interpreted plan: "${proposalText}"`,
        actions: [
          { actionId: 'forest_protection', intensity: 0.8, customNote: 'Border ranger patrols' },
          { actionId: 'agroforestry', intensity: 0.7, customNote: 'Pasture transition' },
        ],
        assumptions: ['Local nursery capacity and enforcement logistics are operational.'],
        unsupportedParts: [],
        clarificationQuestion: null,
        source: 'local-fallback',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Direct action selection from catalog or map
  const handleSelectActionDirect = (actionId: string) => {
    const def = SUPPORTED_ACTIONS.find(a => a.id === actionId);
    if (!def) return;

    setPendingProposalText(def.name);
    setPendingProposal({
      understood: true,
      summary: `Direct Action: ${def.name}`,
      actions: [{ actionId: def.id, intensity: 1.0, customNote: def.shortDescription }],
      assumptions: ['Direct administrative implementation.'],
      unsupportedParts: [],
      clarificationQuestion: null,
      source: 'local-fallback',
    });
  };

  // Advance simulation on confirmed plan
  const handleConfirmPlan = (actions: Array<{ actionId: string; intensity: number; customNote?: string }>) => {
    if (!pendingProposal) return;

    const { nextState, report, error } = executeSimulationStep(
      worldState,
      actions,
      pendingProposalText,
      pendingProposal.summary
    );

    if (error) {
      alert(error);
      return;
    }

    setPendingProposal(null);
    setWorldState(nextState);
    setActiveReport(report);

    // Audio feedback
    if (report.activeEvents.length > 0) {
      soundFX.playAlert();
    } else {
      soundFX.playAdvanceTurn();
    }
  };

  // Restart game
  const handleRestartGame = () => {
    setWorldState(createInitialWorldState(42));
    setPendingProposal(null);
    setActiveReport(null);
    setIsPaused(false);
    setSelectedHotspotId(null);
    setGamePhase('playing');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D Scene Viewport: 100% full-screen canvas underneath all HUD overlays */}
      <div className="absolute inset-0 z-0">
        <BiomeCanvas3D
          forestCondition={worldState.indicators.forestCondition}
          fireRisk={worldState.indicators.fireRisk}
          waterSecurity={worldState.indicators.waterSecurity}
          activeLayer={activeLayer}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={setSelectedHotspotId}
          className="w-full h-full"
        />
      </div>

      {/* Title Screen Overlay */}
      {gamePhase === 'title' && (
        <TitleScreen
          onStartGame={() => setGamePhase('playing')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Main Playing HUD Shell */}
      {gamePhase === 'playing' && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
          {/* Top Status Bar */}
          <TopStatusBar
            simulationYear={worldState.simulationYear}
            turnNumber={worldState.turnNumber}
            maxTurns={worldState.maxTurns}
            indicators={worldState.indicators}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(p => !p)}
            activeLayer={activeLayer}
            onChangeLayer={setActiveLayer}
          />

          {/* Central 3D Playfield: 85%+ completely unobstructed */}

          {/* Hotspot detail drawer if a beacon pin is clicked */}
          {selectedHotspotId && (
            <div className="pointer-events-auto">
              <HotspotDetailDrawer
                hotspotId={selectedHotspotId}
                onClose={() => setSelectedHotspotId(null)}
                onDirectAction={handleSelectActionDirect}
              />
            </div>
          )}

          {/* Collapsible Bottom Dock (Zero-occlusion tabbed panel) */}
          <BottomDock
            worldState={worldState}
            isCollapsed={isDockCollapsed}
            onToggleCollapse={() => setIsDockCollapsed(c => !c)}
            onSubmitProposal={handleSubmitProposal}
            isAnalyzing={isAnalyzing}
            onSelectActionDirect={handleSelectActionDirect}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={setSelectedHotspotId}
          />
        </div>
      )}

      {/* Action Review & Confirmation Modal */}
      {pendingProposal && (
        <ActionReviewModal
          proposal={pendingProposal}
          availableBudget={worldState.indicators.availableBudget}
          onConfirm={handleConfirmPlan}
          onCancel={() => setPendingProposal(null)}
        />
      )}

      {/* Consequence Report Modal */}
      {activeReport && (
        <ConsequenceModal
          report={activeReport}
          onContinue={() => setActiveReport(null)}
        />
      )}

      {/* Ending Modal (10 turns completed or collapse) */}
      {worldState.isGameOver && worldState.ending && (
        <EndingModal
          ending={worldState.ending}
          worldState={worldState}
          onRestart={handleRestartGame}
        />
      )}

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={handleRestartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}
