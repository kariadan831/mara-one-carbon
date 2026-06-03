import admin from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// 🟢 RATE LIMIT STORE (in-memory)
const rateLimit = new Map();

export async function POST(req) {
  try {
    // ✅ SAFE JSON PARSING
    let body;

    try {
      body = await req.json();
    } catch (err) {
      return Response.json(
        {
          success: false,
          message: "Invalid or missing JSON body",
        },
        { status: 400 }
      );
    }

    if (!body) {
      return Response.json(
        {
          success: false,
          message: "Empty request body",
        },
        { status: 400 }
      );
    }

    const { name, phone, email, vote, message, reference } = body;

    // 🟡 GET USER IP
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // 🟡 RATE LIMIT (20 seconds)
    const now = Date.now();
    const LIMIT_TIME = 20 * 1000;

    const lastTime = rateLimit.get(ip);

    if (lastTime && now - lastTime < LIMIT_TIME) {
      return Response.json(
        {
          success: false,
          message: "Too many requests. Please wait 20 seconds.",
        },
        { status: 429 }
      );
    }

    rateLimit.set(ip, now);

    // 🟢 VALIDATION
    if (!name || !phone || !email || !vote) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields (name, phone, email, vote)",
        },
        { status: 400 }
      );
    }

    // 🟢 VALID VOTE CHECK
    if (vote !== "YES" && vote !== "NO") {
      return Response.json(
        {
          success: false,
          message: "Invalid vote value",
        },
        { status: 400 }
      );
    }

    const db = admin.firestore();

    // 🟢 CHECK DUPLICATE EMAIL
    const existingEmail = await db
      .collection("votes")
      .where("email", "==", email.toLowerCase())
      .get();

    if (!existingEmail.empty) {
      return Response.json(
        {
          success: false,
          message: "You have already voted (email used)",
        },
        { status: 409 }
      );
    }

    // 🟢 CHECK DUPLICATE PHONE
    const existingPhone = await db
      .collection("votes")
      .where("phone", "==", phone)
      .get();

    if (!existingPhone.empty) {
      return Response.json(
        {
          success: false,
          message: "You have already voted (phone used)",
        },
        { status: 409 }
      );
    }

    // 🟢 CLEAN DATA
    const voteData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      vote,
      message: message ? String(message).trim() : "",
      reference: reference || `VOTE_${Date.now()}`,
      createdAt: FieldValue.serverTimestamp(),
      ip,
    };

    // 🟢 SAVE TO FIRESTORE
    const docRef = await db.collection("votes").add(voteData);

    return Response.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("❌ FIREBASE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}