export const TEAM_STATUSES = ["CANDIDATE", "STUDENT", "PLACED", "ALUMNI"] as const;
export type TeamStatus = (typeof TEAM_STATUSES)[number];

export const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  CANDIDATE: "Candidate",
  STUDENT: "Student",
  PLACED: "Placed",
  ALUMNI: "Alumni",
};

export function normalizeTeamStatus(status?: string | null): TeamStatus {
  if (status === "STUDENT" || status === "APPROVED") return "STUDENT";
  if (status === "PLACED") return "PLACED";
  if (status === "ALUMNI") return "ALUMNI";
  return "CANDIDATE";
}

export function isHomepageStatus(status?: string | null) {
  const normalized = normalizeTeamStatus(status);
  return normalized === "PLACED" || normalized === "ALUMNI";
}

/**
 * Only active members (Student, Placed, Alumni) appear on the public Our Team site.
 * Newly registered candidates remain INACTIVE until admin approves/activates them.
 */
export function isOurTeamStatus(status?: string | null) {
  const normalized = normalizeTeamStatus(status);
  return (
    normalized === "STUDENT" ||
    normalized === "PLACED" ||
    normalized === "ALUMNI"
  );
}

export function isActiveStatus(status?: string | null): boolean {
  return isOurTeamStatus(status);
}
