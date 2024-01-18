/**
 * These are small utility functions that can be used in any project.
 */

export const areNullOrUndefined = (...args: unknown[]): boolean =>
  args.every((arg) => isNullOrUndefined(arg));

export const isNullOrUndefined = <T>(
  obj: T | null | undefined
): obj is null | undefined => {
  return typeof obj === 'undefined' || obj === null;
};

export const weekdays = {
  MONDAY: 'Hétfő',
  TUESDAY: 'Kedd',
  WEDNESDAY: 'Szerda',
  THURSDAY: 'Csütörtök',
  FRIDAY: 'Péntek',
  SATURDAY: 'Szombat',
  SUNDAY: 'Vasárnap',
} as const;
export type WEEKDAYS = typeof weekdays[keyof typeof weekdays];

export interface Offer {
  day: Date;
  foodName: string;
  price: number;
}
