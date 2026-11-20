import type { Metadata } from "next";
import { getCandidateById, TEAM_MEMBERS, toCandidateSlug, toPublicTeamMember, type TeamMember } from "@/lib/teamData";
import { findTeamMemberByIdOrSlug } from "@/lib/teamDb";
import CandidateDetailClient, { type CandidateSummary } from "./CandidateDetailClient";
import { prisma } from "@/lib/prisma";
import { isOurTeamStatus } from "@/lib/teamStatus";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export const dynamicParams = true;

export async function generateStaticParams() {
  const staticList = TEAM_MEMBERS.map((member) => ({
    id: toCandidateSlug(member.name),
  }));

  try {
    const dbMembers = await prisma.teamMember.findMany({
      where: {
        status: { in: ["STUDENT", "APPROVED", "PLACED", "ALUMNI"] },
      },
      select: { id: true, name: true },
    });
    return [
      ...staticList,
      ...dbMembers.map((m) => ({ id: toCandidateSlug(m.name) })),
      ...dbMembers.map((m) => ({ id: m.id })),
    ];
  } catch {
    return staticList;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let dbMember = null;
  try {
    dbMember = await findTeamMemberByIdOrSlug(id);
  } catch {}

  const member = dbMember ? toPublicTeamMember(dbMember) : getCandidateById(id);
  const name = member?.name || "Candidate Profile";
  const role = member?.role || "Software Engineering Intern";
  const title = `${name} — ${role} | JCRM Technologies`;

  // Clean description without "About [Name] :" prefix
  const cleanBio = member?.bio?.trim();
  const description = cleanBio
    ? (cleanBio.length > 160 ? `${cleanBio.slice(0, 157)}...` : cleanBio)
    : `${name} is a verified ${role} at JCRM Technologies. Explore credentials, education, skills, and schedule an interview.`;

  const baseUrl = "https://www.jcrm.in";
  const slug = member ? toCandidateSlug(member.name) : toCandidateSlug(id);
  const pageUrl = `${baseUrl}/ourteam/${slug}`;
  let ogImage = `${baseUrl}/og-image.png`;
  if (member?.image && member.image.trim()) {
    const cleanImg = member.image.trim();
    if (cleanImg.startsWith("data:image/")) {
      ogImage = `${baseUrl}/api/avatar/${member.id}?w=800&q=85`;
    } else if (cleanImg.startsWith("http://") || cleanImg.startsWith("https://")) {
      ogImage = cleanImg;
    } else if (cleanImg.startsWith("/")) {
      ogImage = `${baseUrl}${cleanImg}`;
    }
  } else if (member?.id) {
    ogImage = `${baseUrl}/api/avatar/${member.id}?w=800&q=85`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "JCRM Technologies",
      locale: "en_IN",
      type: "profile",
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 800,
          height: 800,
          alt: `${name} - ${role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch active list to establish sequence and related candidates
  let activeList: CandidateSummary[] = [];
  let dbMember: any = null;
  let sponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;

  try {
    const [rawList, adListRecord, legacyAdRecord, foundMember] = await Promise.all([
      prisma.teamMember.findMany({
        where: {
          status: { in: ["STUDENT", "APPROVED", "PLACED", "ALUMNI"] },
        },
        select: {
          id: true,
          name: true,
          role: true,
          image: true,
          city: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.siteContent.findUnique({
        where: { pageId: "sponsored-ads-list" },
      }),
      prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      }),
      findTeamMemberByIdOrSlug(id),
    ]);

    activeList = rawList.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role || "Software Engineer",
      image: m.image || "",
      city: m.city || "India",
    }));

    dbMember = foundMember;

    if (adListRecord && Array.isArray(adListRecord.content) && adListRecord.content.length > 0) {
      const ads = adListRecord.content as unknown as SponsoredAd[];
      const activeAd = ads.find((a) => a.isActive);
      sponsoredAd = activeAd || ads[0] || DEFAULT_SPONSORED_AD;
    } else if (legacyAdRecord && legacyAdRecord.content && typeof legacyAdRecord.content === "object") {
      sponsoredAd = legacyAdRecord.content as unknown as SponsoredAd;
    }
  } catch (err) {
    console.error("Error fetching candidate or sponsored ad:", err);
  }

  if (activeList.length === 0) {
    activeList = TEAM_MEMBERS.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      image: m.image,
      city: m.city,
    }));
  }

  let member: TeamMember | null = null;

  if (dbMember) {
    const isPubliclyActive = isOurTeamStatus(dbMember.status);
    if (!isPubliclyActive) {
      const session = await getServerSession(authOptions).catch(() => null);
      const isAdmin = session?.user?.role === "ADMIN";
      if (!isAdmin) {
        return (
          <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Under Review</h2>
            <p className="text-sm text-slate-600 mb-6">
              This candidate application is currently inactive and awaiting admin activation.
            </p>
            <Link href="/ourteam" className="text-sm font-bold text-[#0055FF] hover:underline">
              ← Back to Our Team
            </Link>
          </div>
        );
      }
    }
    member = toPublicTeamMember(dbMember);
  } else {
    member = getCandidateById(id) || null;
  }

  if (!member) {
    member = {
      id,
      name: id
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      role: "Software Engineering Intern",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      city: "Udupi",
      state: "Karnataka",
      maskedPhone: "xxxxxx9070",
      maskedEmail: "akxxxxxxxxxxxx@gmail.com",
      college: "SMVITM Udupi",
      education: "B.E. Computer Science and Engineering",
      experience: "Fresher / Intern",
      skills: ["Python", "React", "Node.js", "Machine Learning"],
      bio: "Software engineering intern trained on enterprise software applications at JCRM Technologies.",
      isVerified: true,
    };
  }

  const currentIndex = activeList.findIndex((m) => m.id === member?.id);
  const prevMember =
    currentIndex > 0
      ? activeList[currentIndex - 1]
      : activeList.length > 1
      ? activeList[activeList.length - 1]
      : undefined;
  const nextMember =
    currentIndex >= 0 && currentIndex < activeList.length - 1
      ? activeList[currentIndex + 1]
      : activeList.length > 1
      ? activeList[0]
      : undefined;

  const prevMemberId = prevMember ? toCandidateSlug(prevMember.name) : undefined;
  const nextMemberId = nextMember ? toCandidateSlug(nextMember.name) : undefined;

  const relatedMembers = activeList.filter((m) => m.id !== member?.id).slice(0, 4);

  return (
    <CandidateDetailClient
      member={member}
      prevMemberId={prevMemberId}
      nextMemberId={nextMemberId}
      relatedMembers={relatedMembers}
      sponsoredAd={sponsoredAd}
    />
  );
}
