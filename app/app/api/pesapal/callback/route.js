import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const trackingId = searchParams.get("OrderTrackingId");
    const reference = searchParams.get("OrderMerchantReference");

    console.log("🔥 Pesapal callback received:", {
      trackingId,
      reference,
    });

    if (!reference) {
      return Response.json(
        { success: false, message: "Missing reference" },
        { status: 400 }
      );
    }

    // 🔍 FIND VOTE
    const q = query(
      collection(db, "votes"),
      where("reference", "==", reference)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return Response.json(
        { success: false, message: "Vote not found" },
        { status: 404 }
      );
    }

    // 🔥 UPDATE ALL MATCHING DOCS SAFELY
    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(docSnap.ref, {
        paid: true,
        status: "PAID",
        trackingId: trackingId || null,
        paidAt: new Date().toISOString(),
      })
    );

    await Promise.all(updates);

    return Response.json({
      success: true,
      message: "Payment confirmed",
    });

  } catch (error) {
    console.error("❌ Callback error:", error);

    return Response.json(
      {
        success: false,
        message: "Callback failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}