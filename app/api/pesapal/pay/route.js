import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const orderTrackingId = searchParams.get("OrderTrackingId");
    const orderMerchantReference = searchParams.get("OrderMerchantReference");

    console.log("Pesapal Callback Received:", {
      orderTrackingId,
      orderMerchantReference,
    });

    // 1. Find vote in Firebase using reference
    const q = query(
      collection(db, "votes"),
      where("reference", "==", orderMerchantReference)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return Response.json({
        success: false,
        message: "Vote not found",
      });
    }

    // 2. Update vote as paid
    snapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, {
        paid: true,
        orderTrackingId,
        paidAt: new Date(),
      });
    });

    return Response.json({
      success: true,
      message: "Payment confirmed and vote updated",
    });

  } catch (error) {
    console.error("Callback error:", error);

    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}