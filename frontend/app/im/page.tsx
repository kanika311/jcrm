import { TEAM_MEMBERS } from "@/lib/teamData";
import TeamDirectoryClient from "./TeamDirectoryClient";

export default function TeamDirectoryPage() {
  return <TeamDirectoryClient members={TEAM_MEMBERS} />;
}
