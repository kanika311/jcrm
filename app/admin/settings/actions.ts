"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Admins can access these settings.");
  }
  return session;
}

export async function getAdminUsers() {
  await requireAdminSession();

  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        isBlocked: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      admins: admins.map((admin) => ({
        ...admin,
        createdAt: admin.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch admin users:", error);
    return { success: false, error: "Failed to load admin users" };
  }
}

export async function createAdminUser(data: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}) {
  await requireAdminSession();

  const { fullName, email, password, phoneNumber } = data;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(phoneNumber ? [{ phoneNumber: phoneNumber.trim() }] : []),
        ],
      },
    });

    if (existingUser) {
      if (existingUser.role === "ADMIN") {
        return { error: "An admin with this email or phone number already exists." };
      }
      // If user exists as student or instructor, promote to admin and update password
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "ADMIN",
          passwordHash,
          fullName: fullName || existingUser.fullName,
        },
      });
      revalidatePath("/admin/settings");
      revalidatePath("/admin/users");
      return { success: true, message: `Existing user promoted to Admin successfully.` };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
        passwordHash,
        role: "ADMIN",
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/users");
    return { success: true, message: "New Admin created successfully!" };
  } catch (error: any) {
    console.error("Failed to create admin:", error);
    return { error: error.message || "Failed to create new admin." };
  }
}

export async function changeAdminPassword(data: {
  targetEmail?: string;
  currentPassword?: string;
  newPassword: string;
}) {
  const session = await requireAdminSession();
  const { targetEmail, currentPassword, newPassword } = data;

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long." };
  }

  const emailToChange = (targetEmail || session.user?.email || "").trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: emailToChange },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // If changing own password and user already has a passwordHash, verify current password
    const isSelf = session.user?.email?.toLowerCase() === emailToChange;
    if (isSelf && currentPassword && user.passwordHash) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return { error: "Current password does not match." };
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { success: true, message: `Password for ${emailToChange} has been successfully updated!` };
  } catch (error: any) {
    console.error("Failed to change password:", error);
    return { error: error.message || "Failed to update password." };
  }
}

export async function deleteAdminUser(adminId: string) {
  const session = await requireAdminSession();

  try {
    const targetAdmin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!targetAdmin) {
      return { error: "Admin account not found." };
    }

    if (targetAdmin.role !== "ADMIN") {
      return { error: "Target user is not an administrator." };
    }

    // Prevent deleting oneself
    if (session.user?.email && targetAdmin.email.toLowerCase() === session.user.email.toLowerCase()) {
      return { error: "You cannot delete your own active admin account." };
    }

    // Ensure there is at least one admin remaining
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      return { error: "Cannot delete the only remaining administrator on the platform." };
    }

    await prisma.user.delete({
      where: { id: adminId },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/users");
    return { success: true, message: `Admin (${targetAdmin.fullName || targetAdmin.email}) deleted successfully.` };
  } catch (error: any) {
    console.error("Failed to delete admin user:", error);
    return { error: error.message || "Failed to delete admin user." };
  }
}

export async function getWhatsAppConfigAction() {
  await requireAdminSession();
  try {
    const { getWhatsAppSettings } = await import("@/lib/whatsappSettings");
    const config = await getWhatsAppSettings();
    return { success: true, config };
  } catch (error: any) {
    console.error("Failed to fetch WhatsApp config:", error);
    return { success: false, error: "Failed to load WhatsApp configuration" };
  }
}

export async function updateWhatsAppConfigAction(data: {
  whatsappNumber: string;
  buttonText: string;
  defaultMessage: string;
  isEnabled: boolean;
  supportTitle?: string;
  supportSubtitle?: string;
}) {
  await requireAdminSession();
  try {
    const { saveWhatsAppSettings } = await import("@/lib/whatsappSettings");
    const updated = await saveWhatsAppSettings(data);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "WhatsApp contact number & popup settings updated successfully!", config: updated };
  } catch (error: any) {
    console.error("Failed to update WhatsApp config:", error);
    return { success: false, error: error.message || "Failed to update WhatsApp settings" };
  }
}

