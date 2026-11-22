import type { Metadata } from "next";
import JoinUsClient from "./JoinUsClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/joinus");

export default function JoinPage() {
  return <JoinUsClient />;
}
