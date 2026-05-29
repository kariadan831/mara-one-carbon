export async function POST(req) {
  try {
    console.log("🔥 PAY API HIT");

    const body = await req.json();

    const {
      amount,
      phone,
      email,
      firstName,
      lastName,
      reference,
    } = body;

    if (!amount || !phone || !email || !reference) {
      return Response.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("🔥 CONSUMER KEY:", consumerKey);
console.log("🔥 CONSUMER SECRET:", consumerSecret);
console.log("🔥 CALLBACK URL:", process.env.PESAPAL_CALLBACK_URL);
console.log("🔥 BASE URL:", process.env.NEXT_PUBLIC_BASE_URL);

    if (!consumerKey || !consumerSecret) {
      return Response.json(
        { success: false, message: "Missing API keys" },
        { status: 500 }
      );
    }

    // 🔐 TOKEN
    const tokenRes = await fetch(
      "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
        }),
      }
    );

    const tokenText = await tokenRes.text();
    let tokenData;

    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      return Response.json({
        success: false,
        message: "Invalid token response",
        raw: tokenText,
      });
    }

    if (!tokenData.token) {
      return Response.json({
        success: false,
        message: "Token failed",
        debug: tokenText,
      });
    }

    console.log("✔ TOKEN OK");

    // 💳 ORDER REQUEST (FIXED)
    const orderRes = await fetch(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          id: reference,
          currency: "KES",
          amount: Number(amount),
          description: "Mara One Carbon Vote",

          callback_url:
            callbackUrl || `${baseUrl}/api/pesapal/callback`,

          notification_id: process.env.PESAPAL_NOTIFICATION_ID,

          billing_address: {
            email_address: email,
            phone_number: phone,
            first_name: firstName || "User",
            last_name: lastName || "User",
          },
        }),
      }
    );

    const orderText = await orderRes.text();

    let orderData;
    try {
      orderData = JSON.parse(orderText);
    } catch (e) {
      return Response.json({
        success: false,
        message: "Invalid order response",
        raw: orderText,
      });
    }

    console.log("ORDER RESPONSE:", orderData);

    if (!orderData.redirect_url) {
      return Response.json({
        success: false,
        message: "No redirect URL from Pesapal",
        debug: orderData,
      });
    }

    return Response.json({
      success: true,
      redirect_url: orderData.redirect_url,
    });

  } catch (error) {
    console.error("PAY ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}