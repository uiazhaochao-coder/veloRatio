import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

interface GearChartProps {
  data: Array<{ name: string; speed: number; teeth: number }>;
  currentSpeed: number;
  currentRearTeeth: number;
}

export const GearChart: React.FC<GearChartProps> = ({ data, currentSpeed, currentRearTeeth }) => {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="teeth" 
            stroke="#9CA3AF" 
            label={{ value: 'Rear Cogs (T)', position: 'insideBottom', offset: -5, fill: '#6B7280' }} 
            reversed={true} // Convention: Smaller cogs (harder gears) on right usually, but charts often show progression. Let's keep small teeth on right = higher speed.
          />
          <YAxis 
            stroke="#9CA3AF" 
            label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fill: '#6B7280' }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
            itemStyle={{ color: '#F3F4F6' }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value: number) => [`${value.toFixed(1)} km/h`, 'Speed']}
            labelFormatter={(label) => `${label}T Cog`}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#6366f1' }}
            activeDot={{ r: 6 }}
          />
          <ReferenceDot x={currentRearTeeth} y={currentSpeed} r={6} fill="#F97316" stroke="white" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};