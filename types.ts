export interface GearRatio {
  front: number;
  rear: number;
  ratio: number;
  speedKmh: number;
  speedMph: number;
  gearInches: number;
}

export interface DrivetrainConfig {
  chainrings: number[];
  cassette: number[];
  wheelCircumferenceMm: number; // 700x25c approx 2105mm
}

export interface AIAdviceResponse {
  advice: string;
  category: 'climbing' | 'sprinting' | 'cruising' | 'cross-chain' | 'neutral';
}
