import AuthClient from "./AuthClient";
import { Suspense } from "react";
import { getSiteContent } from "@/lib/cms";

export default async function AuthPage() {
  const cmsData = await getSiteContent("public-auth");

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthClient cmsData={cmsData} />
    </Suspense>
  );
}