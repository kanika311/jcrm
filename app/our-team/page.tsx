import { TEAM_MEMBERS } from "@/lib/teamData";
import TeamDirectoryClient from "../im/TeamDirectoryClient";

export default function OurTeamHyphenPage() {
  return <TeamDirectoryClient members={TEAM_MEMBERS} />;
}
