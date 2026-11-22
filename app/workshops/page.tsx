import type { Metadata } from "next";
import { WORKSHOPS } from "@/lib/workshopData";
import WorkshopCatalogClient from "../workshop/WorkshopCatalogClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/workshop");

export default function WorkshopsPluralAliasPage() {
  return <WorkshopCatalogClient workshops={WORKSHOPS} />;
}
