"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EnrollButton({
  courseId,
  coursePrice,
  initialEnrolled = false,
}: {
  courseId: string;
  coursePrice: string;
  initialEnrolled?: boolean;
}) {
  const { data: session, status } = useSession();
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (isEnrolled) {
    return (
      <Link
        href="/student/courses"
        className="px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Already Enrolled — Go to My Courses
      </Link>
    );
  }

  const handleEnroll = async () => {
    if (status !== "authenticated" || !session?.user) {
      router.push(`/auth?callbackUrl=/courses/${courseId}`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to complete enrollment");
      }

      setIsEnrolled(true);
      alert(data.message || "Congratulations! You have enrolled in this course.");
      router.push("/student/courses");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "An error occurred during enrollment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={isLoading}
      className="px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
    >
      {isLoading ? (
        <span>Processing Enrollment...</span>
      ) : (
        <>
          <span>Enroll Now — {coursePrice}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  );
}
