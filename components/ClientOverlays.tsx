"use client";

import dynamic from "next/dynamic";

const DynamicBackgroundExtract = dynamic(
  () => import("@/components/DynamicBackgroundExtract"),
  { ssr: false }
);

const GlobalWhatsAppWidget = dynamic(
  () => import("@/components/GlobalWhatsAppWidget"),
  { ssr: false }
);

export default function ClientOverlays() {
  return (
    <>
      <DynamicBackgroundExtract />
      <GlobalWhatsAppWidget />
    </>
  );
}
