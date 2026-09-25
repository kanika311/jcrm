import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";
import { DEFAULT_SPONSORED_ADS, DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

// Helper to get all sponsored ads from site_content
async function getSponsoredAdsFromDb(): Promise<SponsoredAd[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "sponsored-ads-list" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      return record.content as unknown as SponsoredAd[];
    }

    // Check legacy single-ad record
    const legacyRecord = await prisma.siteContent.findUnique({
      where: { pageId: "ourteam-sponsored-ad" },
    });

    if (legacyRecord && legacyRecord.content && typeof legacyRecord.content === "object") {
      const legacyAd = legacyRecord.content as unknown as SponsoredAd;
      return [
        {
          id: legacyAd.id || "sp_legacy_1",
          ...legacyAd,
          createdAt: legacyAd.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  } catch (err) {
    console.error("Error reading sponsored ads:", err);
  }

  return DEFAULT_SPONSORED_ADS;
}

// Helper to save ads to site_content
async function saveSponsoredAdsToDb(ads: SponsoredAd[]) {
  await prisma.siteContent.upsert({
    where: { pageId: "sponsored-ads-list" },
    create: {
      pageId: "sponsored-ads-list",
      category: "public",
      content: ads as any,
    },
    update: {
      content: ads as any,
    },
  });

  // Keep legacy single-record in sync with the primary ad
  if (ads.length > 0) {
    await prisma.siteContent.upsert({
      where: { pageId: "ourteam-sponsored-ad" },
      create: {
        pageId: "ourteam-sponsored-ad",
        category: "public",
        content: (ads.find(a => a.isActive) || ads[0]) as any,
      },
      update: {
        content: (ads.find(a => a.isActive) || ads[0]) as any,
      },
    });
  }

  revalidatePath("/courses");
  revalidatePath("/ourteam");
  revalidatePath("/im");
  revalidatePath("/admin/sponsored");
  revalidatePath("/admin/team");
}

// GET /api/admin/sponsored
export async function GET() {
  try {
    const ads = await getSponsoredAdsFromDb();
    const primaryAd = ads.find(a => a.isActive) || ads[0] || DEFAULT_SPONSORED_AD;

    return NextResponse.json({
      success: true,
      ads,
      ad: primaryAd,
    });
  } catch (error: any) {
    console.error("Failed to load sponsored ads:", error);
    return NextResponse.json({
      success: true,
      ads: DEFAULT_SPONSORED_ADS,
      ad: DEFAULT_SPONSORED_AD,
    });
  }
}

// POST /api/admin/sponsored
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    let ads = await getSponsoredAdsFromDb();

    // 1. Action: CREATE
    if (body.action === "create" || (body.title && !body.id && !body.action)) {
      const newAdData = body.ad || body;
      const newAd: SponsoredAd = {
        id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        isActive: newAdData.isActive !== false,
        badge: newAdData.badge?.trim() || "SPONSORED",
        title: newAdData.title?.trim() || "New Sponsored Banner",
        company: newAdData.company?.trim() || "Partner Company",
        description: newAdData.description?.trim() || "",
        image: newAdData.image?.trim() || "",
        ctaText: newAdData.ctaText?.trim() || "Learn More",
        ctaLink: newAdData.ctaLink?.trim() || "https://wa.me/918310531309",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      ads = [newAd, ...ads];
      await saveSponsoredAdsToDb(ads);
      return NextResponse.json({ success: true, ad: newAd, ads });
    }

    // 2. Action: UPDATE
    if (body.action === "update") {
      const updatedAdData = body.ad || body;
      if (!updatedAdData.id) {
        return NextResponse.json({ error: "Sponsored Ad ID is required for update." }, { status: 400 });
      }

      ads = ads.map(a => {
        if (a.id === updatedAdData.id) {
          return {
            ...a,
            ...updatedAdData,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });

      await saveSponsoredAdsToDb(ads);
      return NextResponse.json({ success: true, ads });
    }

    // 3. Action: DELETE
    if (body.action === "delete") {
      const idToDelete = body.id;
      if (!idToDelete) {
        return NextResponse.json({ error: "Sponsored Ad ID is required for deletion." }, { status: 400 });
      }

      ads = ads.filter(a => a.id !== idToDelete);
      await saveSponsoredAdsToDb(ads);
      return NextResponse.json({ success: true, ads, message: "Sponsored ad deleted successfully." });
    }

    // 4. Action: TOGGLE
    if (body.action === "toggle") {
      const targetId = body.id;
      ads = ads.map(a => {
        if (a.id === targetId) {
          return {
            ...a,
            isActive: !a.isActive,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });

      await saveSponsoredAdsToDb(ads);
      return NextResponse.json({ success: true, ads });
    }

    // 5. Legacy Single Ad Update fallback
    if (body.title && body.company) {
      if (ads.length > 0) {
        ads[0] = {
          ...ads[0],
          ...body,
          updatedAt: new Date().toISOString(),
        };
      } else {
        ads = [{
          id: "sp_default_1",
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }];
      }

      await saveSponsoredAdsToDb(ads);
      return NextResponse.json({ success: true, ad: ads[0], ads });
    }

    return NextResponse.json({ error: "Invalid action or payload." }, { status: 400 });
  } catch (error: any) {
    console.error("Failed to process sponsored ad request:", error);
    return NextResponse.json({ error: error.message || "Failed to process request." }, { status: 500 });
  }
}

// DELETE /api/admin/sponsored?id=...
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sponsored ad ID is required." }, { status: 400 });
    }

    let ads = await getSponsoredAdsFromDb();
    ads = ads.filter(a => a.id !== id);
    await saveSponsoredAdsToDb(ads);

    return NextResponse.json({ success: true, ads, message: "Sponsored ad deleted successfully." });
  } catch (error: any) {
    console.error("Failed to delete sponsored ad:", error);
    return NextResponse.json({ error: error.message || "Failed to delete sponsored ad." }, { status: 500 });
  }
}
