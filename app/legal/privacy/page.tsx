import { getSiteContent } from "@/lib/cms";

export default async function PrivacyPolicyPage() {
  const cmsData = await getSiteContent("public-privacy");

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4">
      <h1 className="heading-font text-4xl font-bold mb-8">{cmsData?.heading || "Privacy Policy"}</h1>
      <div className="prose prose-invert max-w-none text-lg" style={{ color: 'var(--text-secondary)' }}>
        <p className="whitespace-pre-wrap">{cmsData?.content || "No content provided."}</p>
      </div>
    </div>
  );
}
