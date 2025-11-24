import React from 'react';

interface GearVisualizerProps {
  frontTeeth: number;
  rearTeeth: number;
  cassette: number[];
  chainrings: number[];
}

export const GearVisualizer: React.FC<GearVisualizerProps> = ({ 
  frontTeeth, 
  rearTeeth, 
  cassette, 
  chainrings 
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-center space-x-12 h-32 overflow-hidden relative">
      
      {/* Rear Cassette Visualization */}
      <div className="flex items-center space-x-1 relative">
         <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">Cassette</span>
        {cassette.map((teeth, idx) => {
          // Calculate height based on teeth count relative to max (34T)
          const height = (teeth / 34) * 80; 
          const isActive = teeth === rearTeeth;
          
          return (
            <div 
              key={`rear-${idx}`}
              className={`w-2 rounded-sm transition-all duration-300 ${isActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`}
              style={{ height: `${height}px` }}
              title={`${teeth}T`}
            />
          );
        })}
      </div>

      {/* Chain (Simplified visual connection) */}
      <div className="h-0.5 bg-gray-600 flex-grow max-w-[100px] relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-8 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      </div>

      {/* Front Chainrings Visualization */}
      <div className="flex items-center space-x-2 relative">
         <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">Chainrings</span>
        {chainrings.slice().reverse().map((teeth, idx) => {
           // Calculate height based on teeth count relative to max (52T)
           const height = (teeth / 52) * 90;
           const isActive = teeth === frontTeeth;
           
           return (
             <div
               key={`front-${idx}`}
               className={`w-3 rounded-sm transition-all duration-300 ${isActive ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-gray-700'}`}
               style={{ height: `${height}px` }}
               title={`${teeth}T`}
             />
           );
        })}
      </div>
    </div>
  );
};