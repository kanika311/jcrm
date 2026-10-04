import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { DEFAULT_SERVICES, ServiceCategory, ServiceOrder } from "@/lib/servicesData";
import ServicesManagementClient from "./ServicesManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/jcrm-sushant");
  }

  let services: ServiceCategory[] = DEFAULT_SERVICES;
  let orders: ServiceOrder[] = [];

  try {
    const [servicesRecord, ordersRecord] = await Promise.all([
      prisma.siteContent.findUnique({
        where: { pageId: "services-config" },
      }),
      prisma.siteContent.findUnique({
        where: { pageId: "service-orders" },
      }),
    ]);

    if (
      servicesRecord &&
      Array.isArray(servicesRecord.content) &&
      servicesRecord.content.length > 0
    ) {
      services = servicesRecord.content as unknown as ServiceCategory[];
    }

    if (ordersRecord && Array.isArray(ordersRecord.content)) {
      orders = ordersRecord.content as unknown as ServiceOrder[];
    }
  } catch (error) {
    console.error("Failed to load services data for admin:", error);
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-24">
      <ServicesManagementClient
        initialServices={services}
        initialOrders={orders}
      />
    </div>
  );
}
