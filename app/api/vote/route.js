import admin from "@/lib/firebaseAdmin";

// 🟢 STEP 3: RATE LIMIT STORE (in-memory)
const rateLimit = new Map();

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, phone, email, vote, message, reference } = body;

    // 🟡 STEP 3A: RATE LIMIT CHECK (ANTI-SPAM)
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const LIMIT_TIME = 20 * 1000; // 20 seconds

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

    // 🟢 STEP 1: VALIDATION
    if (!name || !phone || !email || !vote) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields (name, phone, email, vote)",
        },
        { status: 400 }
      );
    }

    // 🟢 STEP 2: VALID VOTE ONLY
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

    // 🟢 STEP 3: CHECK DUPLICATE EMAIL
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

    // 🟢 STEP 4: CHECK DUPLICATE PHONE
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

    // 🟢 STEP 5: CLEAN DATA
    const voteData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      vote,
      message: message ? String(message).trim() : "",
      reference: reference || `VOTE_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ip,
    };

    // 🟢 SAVE
    const docRef = await db.collection("votes").add(voteData);

    return Response.json({
      success: true,
      id: docRef.id,
    });

  } catch (error) {
    console.log("❌ FIREBASE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}