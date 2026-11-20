/**
 * Central event and winner configuration.
 * All editable event details are maintained here in one single source of truth.
 */
export const eventConfig = {
  title: "Vibe Coding Small Hackathon",
  tagline: "VIBE CODING 2026 // ORBIT RESULTS",
  deadline: "2026-11-20T21:00:00+05:30", // 20 November 2026, 9:00 PM IST (UTC+05:30)
  timezone: "Asia/Kolkata",

  timings: {
    stageAIntroDurationMs: 13000,
    stageBAnnouncementDurationMs: 6500,
    resultsBannerPauseMs: 2200,
    winnerDisplayPauseMs: 8500,
    transitionDebounceMs: 350
  },

  // Winners sequence: strictly revealed in order TOP 3 -> TOP 2 -> TOP 1
  winners: [
    {
      rankNum: 3,
      rank: "TOP 3",
      tierLabel: "TOP 3 — FINALIST",
      badgeColor: "tier-bronze",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "", // Optional, leave empty if not available
      image: ""  // Optional project screenshot
    },
    {
      rankNum: 2,
      rank: "TOP 2",
      tierLabel: "TOP 2 — RUNNER-UP",
      badgeColor: "tier-silver",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "",
      image: ""
    },
    {
      rankNum: 1,
      rank: "TOP 1",
      tierLabel: "TOP 1 — CHAMPION",
      badgeColor: "tier-gold",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "",
      image: ""
    }
  ]
};

/**
 * Checks if a string is empty or contains bracketed placeholder tokens like [NAME]
 */
export function isPlaceholder(val) {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return trimmed === '' || (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

/**
 * Sanitizes winner names for presentation, preventing raw bracketed tokens
 */
export function getCleanName(val) {
  return isPlaceholder(val) ? "Participant / Team Pending" : val.trim();
}

/**
 * Sanitizes project names
 */
export function getCleanProject(val) {
  return isPlaceholder(val) ? "Finalist Submission In Orbit" : val.trim();
}
