import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const orderTrackingId = searchParams.get("OrderTrackingId");
    const orderMerchantReference = searchParams.get("OrderMerchantReference");

    console.log("Pesapal Callback:", {
      orderTrackingId,
      orderMerchantReference,
    });

    if (!orderMerchantReference) {
      return NextResponse.json({
        success: false,
        message: "Missing reference",
      });
    }

    // STEP 1: FIND VOTE BY REFERENCE
    const q = query(
      collection(db, "votes"),
      where("reference", "==", orderMerchantReference)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({
        success: false,
        message: "Vote not found",
      });
    }

    // STEP 2: UPDATE DOCUMENT(S)
    const updates = snapshot.docs.map(async (docItem) => {
      await updateDoc(docItem.ref, {
        paid: true,
        orderTrackingId: orderTrackingId || null,
        paidAt: new Date(),
      });
    });

    await Promise.all(updates);

    // STEP 3: REDIRECT USER BACK TO SITE
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?payment=success`
    );

  } catch (error) {
    console.error("Callback error:", error);

    return NextResponse.json({
      success: false,
      error: "Callback failed",
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    console.log("Pesapal POST Callback:", body);

    return NextResponse.json({
      success: true,
      received: body,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Invalid POST callback",
    });
  }
}