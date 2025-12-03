import React from 'react';
import { Gauge, Zap, Wind } from 'lucide-react';

interface SpeedometerProps {
  speedKmh: number;
  cadence: number;
  ratio: number;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ speedKmh, cadence, ratio }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Wind size={120} />
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Projected Speed</h2>
        
        <div className="text-center">
          <span className="text-7xl font-bold text-white tracking-tighter">
            {speedKmh.toFixed(1)}
          </span>
          <span className="text-2xl text-gray-500 ml-2">km/h</span>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-4 w-full">
          <div className="bg-gray-700/50 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-blue-400 mb-1">
              <Zap size={16} className="mr-1" />
              <span className="text-xs font-bold">RATIO</span>
            </div>
            <span className="text-xl font-mono text-white">{ratio.toFixed(2)}</span>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-green-400 mb-1">
              <Gauge size={16} className="mr-1" />
              <span className="text-xs font-bold">RPM</span>
            </div>
            <span className="text-xl font-mono text-white">{cadence}</span>
          </div>
        </div>
      </div>
    </div>
  );
};