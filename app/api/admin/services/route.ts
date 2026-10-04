import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DEFAULT_SERVICES, ServiceCategory, ServiceOrder } from "@/lib/servicesData";

async function getServicesConfig(): Promise<ServiceCategory[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "services-config" },
    });
    if (record && Array.isArray(record.content) && record.content.length > 0) {
      return record.content as unknown as ServiceCategory[];
    }
  } catch (err) {
    console.error("Failed to read services config:", err);
  }
  return DEFAULT_SERVICES;
}

async function getOrders(): Promise<ServiceOrder[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "service-orders" },
    });
    if (record && Array.isArray(record.content)) {
      return record.content as unknown as ServiceOrder[];
    }
  } catch (err) {
    console.error("Failed to read service orders:", err);
  }
  return [];
}

export async function GET() {
  try {
    const [services, orders] = await Promise.all([
      getServicesConfig(),
      getOrders(),
    ]);

    return NextResponse.json({
      success: true,
      services,
      orders,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/services:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch services admin data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const action = body.action || "update_services";

    if (action === "update_services") {
      const services = body.services;
      if (!Array.isArray(services)) {
        return NextResponse.json(
          { error: "Invalid services payload format" },
          { status: 400 }
        );
      }

      await prisma.siteContent.upsert({
        where: { pageId: "services-config" },
        create: {
          pageId: "services-config",
          category: "public",
          content: services as any,
        },
        update: {
          content: services as any,
        },
      });

      revalidatePath("/services");
      revalidatePath("/services/seo");
      revalidatePath("/services/social-media");
      revalidatePath("/admin/services");

      return NextResponse.json({
        success: true,
        message: "Services configuration updated successfully",
        services,
      });
    }

    if (action === "update_order_status") {
      const { orderId, status } = body;
      if (!orderId || !status) {
        return NextResponse.json(
          { error: "Order ID and status are required" },
          { status: 400 }
        );
      }

      const orders = await getOrders();
      const updatedOrders = orders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      });

      await prisma.siteContent.upsert({
        where: { pageId: "service-orders" },
        create: {
          pageId: "service-orders",
          category: "public",
          content: updatedOrders as any,
        },
        update: {
          content: updatedOrders as any,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Order status updated successfully",
        orders: updatedOrders,
      });
    }

    if (action === "reset_defaults") {
      await prisma.siteContent.upsert({
        where: { pageId: "services-config" },
        create: {
          pageId: "services-config",
          category: "public",
          content: DEFAULT_SERVICES as any,
        },
        update: {
          content: DEFAULT_SERVICES as any,
        },
      });

      revalidatePath("/services");
      revalidatePath("/admin/services");

      return NextResponse.json({
        success: true,
        message: "Services reset to original brochure defaults",
        services: DEFAULT_SERVICES,
      });
    }

    return NextResponse.json(
      { error: "Unknown action specified" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/admin/services:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update admin services data" },
      { status: 500 }
    );
  }
}
