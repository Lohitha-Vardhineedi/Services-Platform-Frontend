// src/utils/bookingSort.ts
export type Tab = 'upcoming' | 'completed' | 'cancelled';

const UPCOMING_SET = new Set([
  'upcoming', 'accepted', 'started'
]);
const CANCELLED_SET = new Set(['cancelled', 'declined']);

export function normalizeStatus(status?: string): string {
  return (status || '').trim().toLowerCase();
}

/**
 * Safely parse a booking's effective datetime for freshness sorting.
 * Priority: booking.bookingDate -> booking.createdAt -> 0
 */
export function getFreshnessTs(bookingData: any): number {
  const b = bookingData?.booking ?? {};
  const tryParse = (v: any) => {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : NaN;
  };

  // Prefer bookingDate (appointment time)
  let ts = tryParse(b.bookingDate);
  if (Number.isNaN(ts)) {
    // Fallback to createdAt
    ts = tryParse(b.createdAt);
  }
  return Number.isNaN(ts) ? 0 : ts;
}

/** Newest first */
export function compareByFreshnessDesc(a: any, b: any): number {
  return getFreshnessTs(b) - getFreshnessTs(a);
}

/**
 * Filter by active tab using normalized statuses.
 */
export function filterByTab(bookings: any[], tab: Tab): any[] {
  return bookings.filter((bd) => {
    const s = normalizeStatus(bd?.booking?.status);
    if (tab === 'upcoming') return UPCOMING_SET.has(s);
    if (tab === 'completed') return s === 'completed';
    if (tab === 'cancelled') return CANCELLED_SET.has(s);
    return false;
  });
}

/**
 * Full pipeline: filter -> sort (newest first)
 */
export function byTabFresh(bookings: any[], tab: Tab): any[] {
  return filterByTab(bookings, tab).sort(compareByFreshnessDesc);
}
