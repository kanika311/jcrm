import { WORKSHOPS } from "@/lib/workshopData";
import WorkshopCatalogClient from "./WorkshopCatalogClient";

export default function WorkshopPage() {
  return <WorkshopCatalogClient workshops={WORKSHOPS} />;
}
