
export const DEFAULT_CONFIG = {
  // Custom Compact Setup as requested (32T/48T)
  chainrings: [32, 48], 
  // Custom 11-32T 11-speed cassette as requested
  // Order: Largest (Easiest/Low Gear) to Smallest (Hardest/High Gear)
  cassette: [32, 28, 25, 23, 21, 19, 17, 15, 13, 12, 11], 
  wheelCircumferenceMm: 2105, // 700x25c
};

export const MIN_CADENCE = 40;
export const MAX_CADENCE = 130;
export const DEFAULT_CADENCE = 90;

// Physics Constants
export const BIKE_WEIGHT_KG = 7.0; // Fixed as per requirements
export const DEFAULT_RIDER_WEIGHT_KG = 70;
export const GRAVITY = 9.81;
export const AIR_DENSITY = 1.225; // kg/m^3 at sea level
export const CRR = 0.004; // Coefficient of Rolling Resistance (Good road tires)
export const CDA = 0.32; // Coefficient of Drag * Area (Rider on hoods)
export const DRIVETRAIN_EFFICIENCY = 0.96; // ~4% loss
