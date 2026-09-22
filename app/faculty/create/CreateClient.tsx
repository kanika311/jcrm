"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateClient({ cmsData }: { cmsData: any }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Controlled form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    level: "Beginner",
    image: "",
    promoVideoUrl: "",
    price: "14999",
    isDraft: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size exceeds 5MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a course title.");
      setStep(1);
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      alert("Please enter a valid tuition price.");
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/faculty/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          level: formData.level,
          price: parseFloat(formData.price),
          image: formData.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
          status: formData.isDraft ? "DRAFT" : "PUBLISHED",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create course");
      }

      alert("🎉 Course created successfully and added to catalog!");
      router.push("/faculty/courses");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error creating course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <Link
          href="/faculty"
          className="text-sm font-semibold mb-4 inline-flex items-center gap-2 hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="heading-font text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Design hands-on curriculum, set pricing, and publish directly for students to enroll.
        </p>
        {cmsData?.guidelines && (
          <div
            className="p-4 rounded-xl mt-4 text-sm font-medium"
            style={{
              background: "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
              color: "var(--text-primary)",
              border: "1px solid var(--accent-primary)",
            }}
          >
            <strong>Guidelines:</strong> {cmsData.guidelines}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center mb-12">
        {[
          { num: 1, label: "Basic Info" },
          { num: 2, label: "Media & Cover" },
          { num: 3, label: "Pricing & Publish" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                step >= s.num
                  ? "bg-[var(--accent-primary)] text-txt-primary"
                  : "bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
              }`}
            >
              {s.num}
            </div>
            {i < 2 && (
              <div
                className={`h-1 w-full mx-2 rounded-full transition-colors ${
                  step > s.num ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-surface)]"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div
        className="p-8 rounded-[32px] mb-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
      >
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Course Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-premium w-full px-4 py-3 rounded-xl"
                placeholder="e.g. Next.js 15 & AI Full-Stack Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-premium w-full px-4 py-3 rounded-xl"
                rows={3}
                placeholder="A short summary of what students will learn..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="select-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="select-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">Media & Cover</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
              <div
                className="w-full min-h-[160px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors"
                style={{ borderColor: "var(--border-soft)" }}
              >
                {formData.image ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <img
                      src={formData.image}
                      alt="Thumbnail preview"
                      className="max-h-48 rounded-xl object-cover shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Remove & Choose Different Image
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex flex-col items-center justify-center cursor-pointer py-6">
                    <svg
                      className="w-10 h-10 mb-2 text-[var(--text-tertiary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      Click to upload an image thumbnail
                    </span>
                    <span className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                      JPG, PNG, WebP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Or Paste Image URL</label>
              <input
                type="url"
                value={formData.image.startsWith("data:") ? "" : formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-premium w-full px-4 py-3 rounded-xl text-xs"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">Pricing & Publish</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Tuition Fee (₹ INR) *</label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-premium w-full pl-8 pr-4 py-3 rounded-xl font-bold"
                  placeholder="14999"
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>
                Students will be charged this amount to enroll in this course.
              </p>
            </div>

            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="draft"
                  checked={formData.isDraft}
                  onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                />
                <label htmlFor="draft" className="font-bold text-sm cursor-pointer">
                  Save as Draft (Don't publish immediately to students)
                </label>
              </div>
              <p className="text-xs pl-7" style={{ color: "var(--text-secondary)" }}>
                If unchecked, the course will be published immediately to the Student Course Catalog for students to buy!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || isSubmitting}
          className={`px-6 py-3 rounded-xl font-bold ${
            step === 1 ? "opacity-0 pointer-events-none" : "btn-secondary"
          }`}
        >
          Back
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1 && !formData.title.trim()) {
                alert("Please enter a course title.");
                return;
              }
              setStep(step + 1);
            }}
            className="btn-primary px-8 py-3 rounded-xl font-bold cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCreateCourse}
            className="btn-primary px-8 py-3 rounded-xl font-bold cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? "Creating Course..." : formData.isDraft ? "Save Course as Draft" : "Create & Publish Course 🚀"}
          </button>
        )}
      </div>
    </div>
  );
}
