
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

// תקופת התחרות: 11/1 עד 5/2
export const START_DATE = new Date('2026-01-11T00:00:00');
export const DEADLINE = new Date('2026-02-05T23:59:59');
