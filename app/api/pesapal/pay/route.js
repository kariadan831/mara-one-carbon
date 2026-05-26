export async function POST(request) {
  try {
    const body = await request.json();

    const { amount, phone, email, firstName, lastName, reference } = body;

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

    const authResponse = await fetch("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    const authData = await authResponse.json();

    if (!authData.token) {
      return Response.json({ error: "Token failed" }, { status: 400 });
    }

    const orderResponse = await fetch(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reference,
          currency: "KES",
          amount,
          description: "Payment",
          callback_url: process.env.PESAPAL_CALLBACK_URL,
          billing_address: {
            email_address: email,
            phone_number: phone,
            first_name: firstName,
            last_name: lastName,
          },
        }),
      }
    );

    const orderData = await orderResponse.json();

    return Response.json({
      success: true,
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id,
    });

  } catch (error) {
    return Response.json(
      { success: false, error: "Payment failed" },
      { status: 500 }
    );
  }
}