"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: !currentStatus }
    });
    revalidatePath("/admin/students");
    revalidatePath("/admin/faculty");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    return { error: "Failed to update user status" };
  }
}

export async function setStudentPayment(
  userId: string,
  fee: number,
  courseAccessBlocked: boolean,
) {
  try {
    const amount = Number(fee);
    if (!Number.isFinite(amount) || amount < 0) {
      return { error: "Enter a fee of 0 or more" };
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        registrationFee: amount,
        courseAccessBlocked,
      },
    });
    revalidatePath("/admin/students");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to update student payment:", error);
    return { error: "Failed to update payment settings" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath("/admin/students");
    revalidatePath("/admin/faculty");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}
