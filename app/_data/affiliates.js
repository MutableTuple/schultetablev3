/**
 * Affiliate offers rendered on the homepage below the game (AffiliateStrip).
 *
 * ── BEFORE THIS EARNS ANYTHING, DO THIS ──────────────────────────────────────
 * Every `url` below is a plain, non-affiliate link to a real product. They are
 * safe to ship as-is (they just won't pay), and they are deliberately NOT
 * fabricated tracking URLs. Replace each one with your own affiliate/tracking
 * link once your programme IDs are approved:
 *
 *   Amazon Associates → https://www.amazon.com/dp/XXXX?tag=YOURTAG-20
 *   Impact / ShareASale / PartnerStack → paste the link their dashboard gives you
 *
 * Anything with `enabled: false` is skipped at render time, so you can ship
 * only the slots you actually have links for.
 *
 * ── DISCLOSURE ───────────────────────────────────────────────────────────────
 * The FTC requires a clear, conspicuous disclosure near the links, and Google
 * requires rel="sponsored" on monetised outbound links. AffiliateStrip renders
 * both. Do not strip them out — the disclosure protects you legally and the
 * rel attribute protects the domain from a manual link-spam action, which would
 * cost far more than the affiliate revenue.
 *
 * ── PRO USERS ────────────────────────────────────────────────────────────────
 * This strip is not rendered at all for Pro users. That is a selling point, not
 * an accident: "no sponsored blocks" is listed as a Pro benefit on /get-pro.
 */

export const AFFILIATE_DISCLOSURE =
  "Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. Pro members never see this section.";

export const AFFILIATE_OFFERS = [
  {
    id: "speed-reading-book",
    enabled: true,
    // Schulte Tables are a speed-reading drill first and foremost — the single
    // most intent-aligned thing a visitor here could buy.
    category: "Read faster",
    title: "Breakthrough Rapid Reading",
    blurb:
      "The classic speed-reading course that popularised grid-scanning drills like this one. Pairs directly with what you just practised.",
    cta: "See the book",
    url: "https://www.amazon.com/dp/0735202192",
    badge: "Most relevant",
  },
  {
    id: "focus-timer",
    enabled: true,
    category: "Stay focused",
    title: "A physical focus timer",
    blurb:
      "Flip-to-start Pomodoro cube. Removes the phone from your desk entirely — the highest-leverage focus fix most people never try.",
    cta: "See the timer",
    url: "https://www.amazon.com/s?k=pomodoro+timer+cube",
    badge: null,
  },
  {
    id: "blue-light-glasses",
    enabled: true,
    category: "Eye strain",
    title: "Screen glasses for long sessions",
    blurb:
      "If your reaction time falls off a cliff late in the day, eye fatigue is usually the culprit before your brain is.",
    cta: "See options",
    url: "https://www.amazon.com/s?k=blue+light+blocking+glasses",
    badge: null,
  },
  {
    id: "deep-work",
    enabled: true,
    category: "Attention",
    title: "Deep Work — Cal Newport",
    blurb:
      "The best-known argument for training sustained attention on purpose. Explains why the score you just set actually matters.",
    cta: "See the book",
    url: "https://www.amazon.com/dp/1455586692",
    badge: null,
  },
];

export function getActiveAffiliateOffers() {
  return AFFILIATE_OFFERS.filter((offer) => offer.enabled && offer.url);
}
