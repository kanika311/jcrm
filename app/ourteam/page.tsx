import { TEAM_MEMBERS } from "@/lib/teamData";
import TeamDirectoryClient from "../im/TeamDirectoryClient";

export default function OurTeamAliasPage() {
  return <TeamDirectoryClient members={TEAM_MEMBERS} />;
}
