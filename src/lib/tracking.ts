/**
 * Funnel Tracking Layer
 *
 * Fires Meta Pixel custom events at every funnel step + scroll depth on results page.
 * Also stores events in localStorage for the auto-anneal system to read.
 *
 * Events fired:
 * - FunnelView: landing page loaded
 * - QuizStart: user clicks "Get My Free Retirement Report"
 * - QuizStep1Complete: step 1 done (goals)
 * - QuizStep2Complete: step 2 done (income & savings)
 * - QuizStep3Complete: step 3 done (priorities)
 * - LoadingPageView: loading screen shown
 * - ClaimPageView: lead form shown
 * - Lead: form submitted (already exists)
 * - ResultsPageView: results page loaded
 * - ResultsScroll25/50/75/100: scroll depth on results page
 * - CTAClick1/2/3: which CTA button clicked
 * - BookingClick: any booking URL clicked
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface FunnelEvent {
  event: string;
  timestamp: string;
  page: string;
  data?: Record<string, unknown>;
}

const STORAGE_KEY = 'cpf_funnel_events';

function getSessionId(): string {
  let id = sessionStorage.getItem('cpf_session_id');
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('cpf_session_id', id);
  }
  return id;
}

function storeEvent(event: FunnelEvent) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FunnelEvent[];
    // Keep last 500 events max
    const trimmed = existing.length > 499 ? existing.slice(-499) : existing;
    trimmed.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export function trackEvent(
  eventName: string,
  page: string,
  data?: Record<string, unknown>
) {
  const sessionId = getSessionId();

  // Fire Meta Pixel custom event
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, {
      page,
      sessionId,
      ...data,
    });
  }

  // Store locally for auto-anneal
  storeEvent({
    event: eventName,
    timestamp: new Date().toISOString(),
    page,
    data: { sessionId, ...data },
  });
}

/**
 * Results page scroll depth tracker.
 * Call once on mount — sets up IntersectionObserver on sentinel elements.
 */
export function setupScrollTracking() {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const depth = Number(entry.target.getAttribute('data-scroll-depth'));
          if (depth && !fired.has(depth)) {
            fired.add(depth);
            trackEvent(`ResultsScroll${depth}`, '/results', { scrollDepth: depth });
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe sentinel elements (inserted by ResultsPage)
  thresholds.forEach((depth) => {
    const el = document.querySelector(`[data-scroll-depth="${depth}"]`);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}

/**
 * Get all stored events (for auto-anneal system to read)
 */
export function getStoredEvents(): FunnelEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear stored events (after auto-anneal processes them)
 */
export function clearStoredEvents() {
  localStorage.removeItem(STORAGE_KEY);
}
