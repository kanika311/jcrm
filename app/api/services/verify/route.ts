import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { ServiceOrder } from "@/lib/servicesData";

async function getStoredOrders(): Promise<ServiceOrder[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "service-orders" },
    });
    if (record && Array.isArray(record.content)) {
      return record.content as unknown as ServiceOrder[];
    }
  } catch (err) {
    console.error("Failed to read service-orders from DB:", err);
  }
  return [];
}

async function saveOrders(orders: ServiceOrder[]) {
  await prisma.siteContent.upsert({
    where: { pageId: "service-orders" },
    create: {
      pageId: "service-orders",
      category: "public",
      content: orders as any,
    },
    update: {
      content: orders as any,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification tokens" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.error(
        "Service Razorpay signature verification failed for:",
        razorpay_payment_id
      );
      return NextResponse.json(
        { error: "Invalid payment cryptographic signature" },
        { status: 400 }
      );
    }

    const newOrder: ServiceOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      serviceId: orderDetails?.serviceId || "unknown",
      serviceTitle: orderDetails?.serviceTitle || "JCRM Digital Service",
      planId: orderDetails?.planId || "plan",
      planName: orderDetails?.planName || "Service Plan",
      baseAmount: Number(orderDetails?.baseAmount) || 0,
      gstAmount: Number(orderDetails?.gstAmount) || 0,
      totalAmount: Number(orderDetails?.totalAmount) || 0,
      customerName: orderDetails?.customer?.name || "Client",
      customerEmail: orderDetails?.customer?.email || "",
      customerPhone: orderDetails?.customer?.phone || "",
      businessName: orderDetails?.customer?.businessName || "",
      websiteUrl: orderDetails?.customer?.websiteUrl || "",
      notes: orderDetails?.customer?.notes || "",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: "PAID",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingOrders = await getStoredOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    await saveOrders(updatedOrders);

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified! Your service package is confirmed.",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Error verifying service payment:", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
