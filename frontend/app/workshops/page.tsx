import { WORKSHOPS } from "@/lib/workshopData";
import WorkshopCatalogClient from "../workshop/WorkshopCatalogClient";

export default function WorkshopsPluralAliasPage() {
  return <WorkshopCatalogClient workshops={WORKSHOPS} />;
}
