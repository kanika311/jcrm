import type { Metadata } from "next";
import { TEAM_MEMBERS } from "@/lib/teamData";
import TeamDirectoryClient from "../im/TeamDirectoryClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/ourteam");

export default function OurTeamHyphenPage() {
  return <TeamDirectoryClient members={TEAM_MEMBERS} />;
}
