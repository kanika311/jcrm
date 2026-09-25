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

export function isOurTeamStatus(status?: string | null) {
  return normalizeTeamStatus(status) === "STUDENT";
}
