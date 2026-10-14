export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What engineering courses does JCRM Technologies offer?",
    answer:
      "JCRM Technologies offers job-ready engineering courses across 10 specialized disciplines: Frontend Development (React & Next.js), Backend Development (Java Spring Boot & Node.js), AI & Machine Learning, Data Science & Analytics, Cyber Security (VAPT & SOC operations), Forensic Science, Cloud & DevOps (AWS & Kubernetes), QA Automation, Digital Marketing, and Zen AI. Every program includes live enterprise microservice projects and production deployments.",
  },
  {
    question: "What is the relationship between JCRM Technologies?",
    answer:
      "JCRM Technologies is officially registered as JCRM Technologies and is widely searched and referred to by students, enterprises, and partners. Both names represent the same organization offering enterprise cloud ERP software, engineering education, internship programs, and hiring placement services in India.",
  },
  {
    question: "How does JCRM Technologies' 100% placement assistance program work?",
    answer:
      "Our placement assistance includes personalized 1-on-1 resume building, LinkedIn and GitHub portfolio optimization, technical mock interviews, and direct HR referrals to our network of 150+ hiring partners, including top MNCs like Deloitte, Tech Mahindra, Cognizant, TCS, Infosys, and Cisco.",
  },
  {
    question: "What are the course fees and payment options?",
    answer:
      "Course fees range between ₹12,999 and ₹21,999 depending on the chosen track and mentoring depth. We provide zero-interest EMI options, flexible installment plans, and merit-based scholarship fee waivers to ensure accessibility for deserving candidates.",
  },
  {
    question: "Can college students and working professionals join the training programs?",
    answer:
      "Yes. We offer dedicated tracks for college students seeking official academic internship credits, as well as evening and weekend batches for working professionals aiming to upskill or transition into high-paying engineering roles.",
  },
  {
    question: "What enterprise ERP software products does JCRM develop?",
    answer:
      "JCRM Technologies builds modular cloud ERP solutions including Institute & Academy LMS ERP, Coaching Center & EdTech ERP, Healthcare & Clinical Hospital ERP (NABH-compliant), Polyclinic & Pharmacy ERP, HR & Payroll Management, Gym Management, and custom cloud microservices.",
  },
  {
    question: "How can an institution or business book a free ERP software demo?",
    answer:
      "You can book a free, personalized 1-on-1 walkthrough by clicking the 'Request Free Demo' button on our homepage, navigating to our Contact page, or reaching out directly to our enterprise solutions team via email at hr@jcrm.in or telephone at +91 8310531309.",
  },
  {
    question: "Do trainees receive recognized certifications after course completion?",
    answer:
      "Yes, every graduate receives an ISO 9001:2015 verified course completion certificate, a verified internship experience letter, and a GitHub repository of production-ready projects deployable on AWS or Docker.",
  },
];

interface FaqSectionProps {
  badgeText?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  faqs?: FaqItem[];
}

export default function FaqSection({
  badgeText,
  headingPrefix,
  headingHighlight,
  faqs,
}: FaqSectionProps = {}) {
  const displayFaqs = Array.isArray(faqs) && faqs.length > 0 ? faqs : FAQS;
  const badge = badgeText || "Got Questions? We Have Answers";
  const prefix = headingPrefix || "Frequently Asked";
  const highlight = headingHighlight || "Questions (FAQ)";

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] text-xs font-black uppercase tracking-wider mb-2">
            <span>{badge}</span>
          </div>
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight">
            {prefix} <span className="text-[#0055FF]">{highlight}</span>
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {displayFaqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-100/90 shadow-xs p-4 sm:p-6 transition-all duration-200 open:shadow-md open:border-blue-300"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-lg pr-4 inline-block">
                  {faq.question}
                </h3>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 group-open:bg-[#0055FF] text-[#0055FF] group-open:text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs sm:text-sm font-black" aria-hidden="true">
                  ↓
                </span>
              </summary>
              <p className="pt-3 sm:pt-4 text-xs sm:text-base text-slate-600 leading-relaxed font-normal border-t border-slate-100 mt-3 whitespace-pre-line">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
