import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder } from "@/lib/razorpay";
import { DEFAULT_SERVICES, ServiceCategory, ServicePlan } from "@/lib/servicesData";

async function getServicesConfig(): Promise<ServiceCategory[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "services-config" },
    });
    if (record && Array.isArray(record.content) && record.content.length > 0) {
      return record.content as unknown as ServiceCategory[];
    }
  } catch (err) {
    console.error("Failed to read services-config from DB:", err);
  }
  return DEFAULT_SERVICES;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      planId,
      customerName,
      customerEmail,
      customerPhone,
      businessName,
      websiteUrl,
      notes,
    } = body;

    if (!serviceId || !planId) {
      return NextResponse.json(
        { error: "Service and Plan must be specified" },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Please provide your name, email, and phone number" },
        { status: 400 }
      );
    }

    const services = await getServicesConfig();
    const service = services.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json(
        { error: "Requested service category not found" },
        { status: 404 }
      );
    }

    const plan = service.plans.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Requested plan not found" },
        { status: 404 }
      );
    }

    const baseAmount = Number(plan.price) || 0;
    const gstPercent = 0;
    const gstAmount = 0;
    const totalAmount = baseAmount;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid plan pricing" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions).catch(() => null);
    const receipt = `srv_${plan.id.slice(0, 6)}_${Date.now().toString().slice(-6)}`;

    // Create Razorpay order
    const order = await createRazorpayOrder(totalAmount, "INR", receipt);

    const razorpayKey =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
      process.env.RAZORPAY_KEY_ID?.trim() ||
      "";

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpayKey,
      serviceId: service.id,
      serviceTitle: service.title,
      planId: plan.id,
      planName: plan.name,
      baseAmount,
      gstPercent,
      gstAmount,
      totalAmount,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        businessName: businessName || "",
        websiteUrl: websiteUrl || "",
        notes: notes || "",
        userId: session?.user?.id || null,
      },
    });
  } catch (error: any) {
    console.error("Error creating service payment order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize payment gateway order" },
      { status: 500 }
    );
  }
}
