import FeedbackForm from "./FeedbackForm";
import { getSiteContent } from "@/lib/cms";

export default async function FeedbackPage() {
  const cmsData = await getSiteContent("public-feedback");

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center animate-fade-in-up">
      <div className="max-w-xl w-full px-4">
         
         <div className="text-center mb-10">
            <h1 className="heading-font text-4xl font-bold mb-4">{cmsData?.heading || "How are we doing?"}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{cmsData?.subtitle || "We constantly iterate on our platform. Let us know how your experience was."}</p>
         </div>

         <FeedbackForm />
         
      </div>
    </div>
  );
}