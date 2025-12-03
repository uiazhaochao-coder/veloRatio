import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Bike, Settings, ChevronUp, ChevronDown, BrainCircuit, Info } from 'lucide-react';
import { DEFAULT_CONFIG, DEFAULT_CADENCE, MIN_CADENCE, MAX_CADENCE } from './constants';
import { getGearAdvice } from './services/geminiService';
import { Speedometer } from './components/Speedometer';
import { GearVisualizer } from './components/GearVisualizer';
import { GearChart } from './components/GearChart';
import { AIAdviceResponse } from './types';

// Tailwind needs to be loaded in index.html, assume it is present.

const App: React.FC = () => {
  // State
  const [cadence, setCadence] = useState<number>(DEFAULT_CADENCE);
  const [frontIdx, setFrontIdx] = useState<number>(1); // Default to big ring (52T is index 1)
  const [rearIdx, setRearIdx] = useState<number>(5); // Default to middle of cassette

  const [aiAdvice, setAiAdvice] = useState<AIAdviceResponse | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  // Derived Values
  const frontTeeth = DEFAULT_CONFIG.chainrings[frontIdx];
  const rearTeeth = DEFAULT_CONFIG.cassette[rearIdx];
  const gearRatio = frontTeeth / rearTeeth;
  
  // Speed Formula: (RPM * 60) * Ratio * Circumference(km)
  const calculateSpeed = (rpm: number, ratio: number) => {
    return (rpm * 60) * ratio * (DEFAULT_CONFIG.wheelCircumferenceMm / 1000000);
  };

  const currentSpeed = calculateSpeed(cadence, gearRatio);

  // Prepare chart data for the current front ring across all rear cogs
  const chartData = useMemo(() => {
    return DEFAULT_CONFIG.cassette.map(teeth => ({
      name: `${teeth}T`,
      teeth: teeth,
      speed: calculateSpeed(cadence, frontTeeth / teeth)
    }));
  }, [cadence, frontTeeth]);

  // Handler for AI Advice
  const fetchAdvice = async () => {
    setIsLoadingAdvice(true);
    const data = await getGearAdvice(frontTeeth, rearTeeth, cadence, currentSpeed);
    setAiAdvice(data);
    setIsLoadingAdvice(false);
  };

  // Reset advice when gears change to encourage re-checking, 
  // but don't auto-fetch to save tokens and avoid spamming.
  useEffect(() => {
    setAiAdvice(null);
  }, [frontTeeth, rearTeeth, cadence]);

  const handleRearShift = (direction: 'up' | 'down') => {
    if (direction === 'up' && rearIdx < DEFAULT_CONFIG.cassette.length - 1) {
      setRearIdx(prev => prev + 1); // Index up means smaller cog usually in array logic, wait.
      // Array: [34, ... 11]. Index 0 is 34 (Easy), Index 10 is 11 (Hard).
      // "Shift Up" usually means harder gear (smaller cog).
      // So Shift Up -> Index Increase.
    } else if (direction === 'down' && rearIdx > 0) {
      setRearIdx(prev => prev - 1);
    }
  };

  const handleFrontShift = () => {
    setFrontIdx(prev => prev === 0 ? 1 : 0);
  };

  // Helper for gear description
  const getGearDescription = () => {
    if (frontTeeth === 34 && rearTeeth >= 30) return "Climbing Gear";
    if (frontTeeth === 52 && rearTeeth <= 15) return "Speed/Sprint Gear";
    if (frontTeeth === 52 && rearTeeth >= 27) return "Cross-chain (Avoid)";
    if (frontTeeth === 34 && rearTeeth <= 13) return "Cross-chain (Avoid)";
    return "Cruising Gear";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-12">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Bike className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">VeloRatio Pro</h1>
              <p className="text-xs text-gray-500">2x11 Drivetrain Calculator</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
             <span className="flex items-center gap-1"><Settings size={14} /> 700c / 25mm</span>
             <span className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">Shimano 105 Spec</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        
        {/* Top Section: Visualizer & Speed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Speedometer speedKmh={currentSpeed} cadence={cadence} ratio={gearRatio} />
          
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400 font-medium">Gear Configuration</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                getGearDescription().includes('Avoid') ? 'bg-red-900/50 text-red-400' : 'bg-blue-900/50 text-blue-400'
              }`}>
                {getGearDescription()}
              </span>
            </div>
            
            <GearVisualizer 
              frontTeeth={frontTeeth} 
              rearTeeth={rearTeeth} 
              cassette={DEFAULT_CONFIG.cassette} 
              chainrings={DEFAULT_CONFIG.chainrings} 
            />
            
            <div className="flex justify-between mt-6 text-sm">
              <div className="text-center">
                <p className="text-gray-500 text-xs uppercase mb-1">Front Ring</p>
                <p className="text-2xl font-bold text-orange-500">{frontTeeth}T</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs uppercase mb-1">Rear Cog</p>
                <p className="text-2xl font-bold text-blue-500">{rearTeeth}T</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cadence Slider */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="cadence" className="text-lg font-semibold flex items-center gap-2">
                <Settings className="text-gray-400" size={20} />
                Cadence (RPM)
              </label>
              <span className="text-2xl font-mono font-bold text-green-400">{cadence}</span>
            </div>
            <input
              type="range"
              id="cadence"
              min={MIN_CADENCE}
              max={MAX_CADENCE}
              value={cadence}
              onChange={(e) => setCadence(Number(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{MIN_CADENCE} Grind</span>
              <span>{DEFAULT_CADENCE} Normal</span>
              <span>{MAX_CADENCE} Spin</span>
            </div>
          </div>

          {/* Shifters */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col gap-4 justify-center">
            
            {/* Front Shifter */}
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-bold uppercase w-12">Front</span>
              <button 
                onClick={handleFrontShift}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors border border-gray-700"
              >
                {frontTeeth === 52 ? 'Drop to Small (34T)' : 'Shift to Big (52T)'}
              </button>
            </div>

            {/* Rear Shifter */}
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800 gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase w-12">Rear</span>
              <button 
                onClick={() => handleRearShift('down')}
                disabled={rearIdx === 0}
                className={`flex-1 flex items-center justify-center gap-1 bg-gray-800 py-3 px-2 rounded border border-gray-700 transition-all ${rearIdx === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 hover:border-blue-500/50'}`}
              >
                <ChevronDown size={18} /> Easy
              </button>
              <button 
                onClick={() => handleRearShift('up')}
                disabled={rearIdx === DEFAULT_CONFIG.cassette.length - 1}
                className={`flex-1 flex items-center justify-center gap-1 bg-gray-800 py-3 px-2 rounded border border-gray-700 transition-all ${rearIdx === DEFAULT_CONFIG.cassette.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 hover:border-blue-500/50'}`}
              >
                Hard <ChevronUp size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Speed vs. Gear Selection</h3>
            <span className="text-xs text-gray-500">at {cadence} RPM</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">Visualizing the speed curve across the entire cassette for the current chainring.</p>
          <GearChart data={chartData} currentSpeed={currentSpeed} currentRearTeeth={rearTeeth} />
        </div>

        {/* AI Coach Section */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 transition-opacity ${isLoadingAdvice ? 'opacity-40 animate-pulse' : ''}`}></div>
          <div className="relative bg-gray-900 border border-gray-700 p-6 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-purple-400" />
                <h3 className="text-xl font-bold text-white">AI Race Engineer</h3>
              </div>
              <button
                onClick={fetchAdvice}
                disabled={isLoadingAdvice}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-purple-900/50"
              >
                {isLoadingAdvice ? 'Analyzing Telemetry...' : 'Analyze Gear Ratio'}
              </button>
            </div>

            {aiAdvice ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg ${
                    aiAdvice.category === 'cross-chain' ? 'bg-red-900/30 text-red-400' :
                    aiAdvice.category === 'climbing' ? 'bg-yellow-900/30 text-yellow-400' :
                    aiAdvice.category === 'sprinting' ? 'bg-green-900/30 text-green-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-1 capitalize">{aiAdvice.category} Mode Detected</h4>
                    <p className="text-gray-300 leading-relaxed text-lg">{aiAdvice.advice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-6 border-t border-gray-800/50 mt-4 border-dashed">
                <p>Tap "Analyze Gear Ratio" to get real-time coaching tips based on your current setup.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;