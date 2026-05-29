import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const trackingId = searchParams.get("OrderTrackingId");
    const reference = searchParams.get("OrderMerchantReference");

    if (!reference) {
      return Response.json({ message: "Missing reference" }, { status: 400 });
    }

    const q = query(
      collection(db, "votes"),
      where("reference", "==", reference)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return Response.json({ message: "Vote not found" }, { status: 404 });
    }

    snapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, {
        paid: true,
        status: "PAID",
        trackingId,
        paidAt: new Date(),
      });
    });

    return Response.json({
      success: true,
      message: "Vote activated",
    });

  } catch (error) {
    console.error("CALLBACK ERROR:", error);

    return Response.json(
      { message: "Callback failed", error: error.message },
      { status: 500 }
    );
  }
}