import type { Metadata } from "next";
import JoinUsClient from "../join/JoinUsClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/joinus");

export default function JoinUsAliasPage() {
  return <JoinUsClient />;
}
