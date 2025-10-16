export interface drill {
  id: number;
  premium: boolean;
  name: string;
  description: string;
  link: string;
  type: 'Drill' | 'Play';
  categories: Category[];
  players: number;
}

export const CATEGORIES = [
  '1v1',
  '2v2',
  '3v3',
  'Defence',
  'Dribbling',
  'Finishing',
  'Half-Court',
  'Offence',
  'Passing',
  'Press',
  'Rebounding',
  'Rotations',
  'Screening',
  'Shooting',
  'Transition',
  'Warm-Up',
  'Zone',
] as const;

export type Category = (typeof CATEGORIES)[number];
