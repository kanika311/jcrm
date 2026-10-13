export default function TestimonialsSection() {
  const clientQuotes = [
    {
      quote: "JCRM Technologies ERP system unified our branch operations seamlessly. Our billing, logistics, and student admissions are now completely automated in a single cloud dashboard.",
      author: "Raghav Mishra",
      role: "Operations Director, V-Logistics",
      rating: 5,
    },
    {
      quote: "Hands-on engineering training at JCRM Technologies (Jain CRM) prepared me for real-world DevOps & Cloud deployment in just 3 months. Now working as a Senior Engineer at Tech Solutions!",
      author: "Shwati Singh",
      role: "DevOps Engineer @ Tech Solutions",
      rating: 5,
    },
    {
      quote: "The LMS & Hospital ERP solutions built by JCRM Technologies exceeded our performance expectations. Fast database queries, secure EHR records, and reliable technical support.",
      author: "Dr. Rajesh Verma",
      role: "Managing Director, CityCare Health",
      rating: 5,
    },
    {
      quote: "JCRM Technologies completely transformed my career. Their hands-on ERP development and real-world full-stack curriculum gave me the exact skills needed to transition to a senior role.",
      author: "Gautam Sahu",
      role: "Software Engineer @ LTI Mindtree",
      rating: 5,
    },
    {
      quote: "The mentorship I received at JCRM Technologies was invaluable. Working on live production microservices & ERP API integrations gave me real industry confidence in technical interviews.",
      author: "Pronay Dey",
      role: "Backend Engineer @ Apexon",
      rating: 5,
    },
    {
      quote: "I truly appreciate the level of knowledge and ERP product training at JCRM Technologies. Special thanks to my instructors for helping me master high-scale backend engineering.",
      author: "Abhishek Dey",
      role: "Back-end Engineer @ Cisco",
      rating: 5,
    },
  ];

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight">
            What <span className="text-[#0055FF]">Clients & Trainees Say</span>
          </h2>
          <p className="text-slate-600 font-medium text-xs sm:text-base md:text-lg">
            Real feedback from enterprise clients and successfully placed engineering trainees at JCRM Technologies (Jain CRM).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {clientQuotes.map((review, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-[30px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_4px_24px_rgba(0,85,255,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-3 text-sm">
                  {"★".repeat(review.rating)}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-slate-700 font-normal leading-relaxed italic mb-6">
                  "{review.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-blue-50">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {review.author}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#0055FF]">
                  {review.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
