import React from 'react';
import { Gauge, Zap, Wind, Activity } from 'lucide-react';

interface SpeedometerProps {
  speedKmh: number;
  cadence: number;
  ratio: number;
  powerWatts: number;
  gradient: number;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ speedKmh, cadence, ratio, powerWatts, gradient }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Wind size={120} />
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Telemetry</h2>
        
        <div className="flex items-end justify-center gap-6 w-full">
            <div className="text-center">
                <span className="text-6xl font-bold text-white tracking-tighter">
                    {speedKmh.toFixed(1)}
                </span>
                <span className="text-xl text-gray-500 ml-2">km/h</span>
            </div>
            
            <div className="text-center pb-2">
                <div className="flex items-center justify-center text-yellow-500 mb-1">
                    <Zap size={20} className="fill-current" />
                </div>
                <span className="text-4xl font-bold text-white tracking-tighter">
                    {Math.round(powerWatts)}
                </span>
                <span className="text-sm text-gray-500 ml-1">Watts</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 w-full">
          <div className="bg-gray-700/50 rounded-xl p-2 flex flex-col items-center">
            <div className="flex items-center text-blue-400 mb-1">
              <Activity size={14} className="mr-1" />
              <span className="text-[10px] font-bold uppercase">Ratio</span>
            </div>
            <span className="text-lg font-mono text-white">{ratio.toFixed(2)}</span>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-2 flex flex-col items-center">
            <div className="flex items-center text-green-400 mb-1">
              <Gauge size={14} className="mr-1" />
              <span className="text-[10px] font-bold uppercase">RPM</span>
            </div>
            <span className="text-lg font-mono text-white">{cadence}</span>
          </div>

          <div className="bg-gray-700/50 rounded-xl p-2 flex flex-col items-center">
            <div className="flex items-center text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase">Grade</span>
            </div>
            <span className={`text-lg font-mono ${gradient > 0 ? 'text-red-400' : gradient < 0 ? 'text-green-400' : 'text-white'}`}>
                {gradient > 0 ? '+' : ''}{gradient}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};