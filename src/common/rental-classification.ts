export enum RentalClass {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
}

export const LONG_TERM_TYPE_CODES = ['ROOM', 'DORM'];

export const SHORT_TERM_TYPE_CODES = [
  'SHOP',
  'OFFICE',
  'APARTMENT',
  'HOUSE',
  'HOTEL',
  'MOTEL',
];

export function normalizeTypeCode(typeCode?: string | null): string {
  return (typeCode ?? '').trim().toUpperCase();
}

export function isLongTermType(typeCode?: string | null): boolean {
  return LONG_TERM_TYPE_CODES.includes(normalizeTypeCode(typeCode));
}

export function isShortTermType(typeCode?: string | null): boolean {
  return SHORT_TERM_TYPE_CODES.includes(normalizeTypeCode(typeCode));
}
