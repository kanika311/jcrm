import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { ERP_PRODUCTS } from "@/lib/erpData";
import ErpEditClient from "./ErpEditClient";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function AdminErpEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/auth");
  }

  const { id } = await params;

  let solution: any = null;

  // 1. Try fetching from Prisma DB
  if ((prisma as any).erpSolution) {
    try {
      solution = await (prisma as any).erpSolution.findUnique({
        where: { id },
      });
    } catch (err) {
      console.error("Prisma query error for erpSolution id:", id, err);
    }
  }

  // 2. Fallback to ERP_PRODUCTS if not found in DB
  if (!solution) {
    const foundProduct = ERP_PRODUCTS.find(
      (p, idx) => p.id === id || `erp_${idx + 1}` === id || p.title.toLowerCase() === decodeURIComponent(id).toLowerCase()
    );

    if (foundProduct) {
      solution = {
        id: foundProduct.id || id,
        title: foundProduct.title,
        category: foundProduct.category,
        badge: foundProduct.badge || "Enterprise Solution",
        modulesCount: foundProduct.modulesCount || 12,
        roiMetric: foundProduct.roiMetric || "Accelerates organizational efficiency by 35%",
        image: foundProduct.image,
        description: foundProduct.description,
        modules: foundProduct.modules || [],
        demoUrl: "/erp-solutions",
        price: "Custom Enterprise Quote",
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  if (!solution) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">ERP Solution Not Found</h2>
          <p className="text-slate-600 font-medium text-sm max-w-md mx-auto mb-6">
            The ERP solution with ID <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">{id}</span> could not be located in the database.
          </p>
          <Link
            href="/admin/erp"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to ERP Solutions
          </Link>
        </div>
      </div>
    );
  }

  const serialized = {
    ...solution,
    createdAt: solution.createdAt instanceof Date ? solution.createdAt.toISOString() : String(solution.createdAt || new Date().toISOString()),
    updatedAt: solution.updatedAt instanceof Date ? solution.updatedAt.toISOString() : String(solution.updatedAt || new Date().toISOString()),
    modules: Array.isArray(solution.modules) ? solution.modules : [],
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24">
      <ErpEditClient initialSolution={serialized} />
    </div>
  );
}
