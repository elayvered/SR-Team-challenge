
export interface ScoreEntry {
  id: string;
  employeeId: string;
  points: number;
  reason: string;
  date: string;
}

export interface Employee {
  id: string;
  fullName: string;
  totalPoints: number;
}

export enum View {
  LEADERBOARD = 'LEADERBOARD',
  ADMIN = 'ADMIN'
}

export const POINT_VALUES = {
  SHIFT: 1,
  ALCOHOL: 6,
  AVERAGE: 6
};

// Updated year to 2026 so the competition appears as active
export const DEADLINE = new Date('2026-02-05T23:59:59');
