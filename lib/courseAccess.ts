import { prisma } from "@/lib/prisma";

export const DEFAULT_REGISTRATION_FEE = 499;

export function feeAmount(fee: number | null | undefined) {
  if (fee === null || fee === undefined) return DEFAULT_REGISTRATION_FEE;
  const amount = Number(fee);
  if (!Number.isFinite(amount) || amount < 0) return DEFAULT_REGISTRATION_FEE;
  return amount;
}

export function registrationGrantsAccess(user: {
  isBlocked?: boolean;
  courseAccessBlocked?: boolean;
  registrationFee?: number | null;
  registrationPaid?: boolean;
} | null) {
  if (!user || user.isBlocked || user.courseAccessBlocked) return false;
  if (feeAmount(user.registrationFee) <= 0) return true;
  return !!user.registrationPaid;
}

export async function getRegistrationState(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isBlocked: true,
      registrationFee: true,
      registrationPaid: true,
      courseAccessBlocked: true,
      name: true,
      fullName: true,
    },
  });
  if (!user) return null;
  return {
    ...user,
    fee: feeAmount(user.registrationFee),
    hasAccess: registrationGrantsAccess(user),
  };
}

const courseInclude = {
  faculty: {
    select: { id: true, name: true, fullName: true, email: true, image: true },
  },
} as const;

export async function accessibleCourses(userId: string) {
  const state = await getRegistrationState(userId);
  if (!state?.hasAccess) return [];
  return prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: courseInclude,
    orderBy: { createdAt: "desc" },
  });
}
