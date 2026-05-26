export async function POST(request) {
  try {
    const body = await request.json();

    const {
      amount,
      phone,
      email,
      firstName,
      lastName,
      reference,
    } = body;

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL;

    const notificationId = "9dce10fc-6d43-441b-ad46-da5670ba84b2";

    // ✅ VALIDATION (IMPORTANT)
    if (!consumerKey || !consumerSecret || !callbackUrl) {
      return Response.json({
        success: false,
        error: "Missing environment variables"
      }, { status: 500 });
    }

    // 🔐 STEP 1: Get token
    const authResponse = await fetch(
      "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
        }),
      }
    );

    const authData = await authResponse.json();
    const token = authData?.token;

    if (!token) {
      return Response.json({
        success: false,
        error: "Failed to get Pesapal token",
        authData,
      }, { status: 400 });
    }

    // 💳 STEP 2: Create order
    const orderPayload = {
      id: reference,
      currency: "KES",
      amount: Number(amount),
      description: "Mara One Carbon Payment",
      callback_url: callbackUrl,
      notification_id: notificationId,

      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      },
    };

    const orderResponse = await fetch(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const orderData = await orderResponse.json();

    // 🔍 DEBUG (IMPORTANT)
    console.log("AUTH RESPONSE:", authData);
    console.log("ORDER RESPONSE:", orderData);

    // ❌ HANDLE ERROR PROPERLY
    if (!orderData?.redirect_url) {
      return Response.json({
        success: false,
        error: "Pesapal order failed",
        orderData,
      }, { status: 400 });
    }

    // ✅ SUCCESS
    return Response.json({
      success: true,
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id,
    });

  } catch (error) {
    console.error("Pesapal Error:", error);

    return Response.json({
      success: false,
      error: "Payment request failed",
      message: error.message,
    }, { status: 500 });
  }
}