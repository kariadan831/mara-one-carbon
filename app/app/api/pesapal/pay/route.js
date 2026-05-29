import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("REQUEST BODY:", body);

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        { message: "Missing Pesapal credentials" },
        { status: 500 }
      );
    }

    // AUTH
    const authRes = await fetch(
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

    const authText = await authRes.text();
    console.log("AUTH RAW:", authText);

    const authData = JSON.parse(authText);

    if (!authData.token) {
      return NextResponse.json(
        { message: "Auth failed", raw: authData },
        { status: 500 }
      );
    }

    // ORDER
    const orderRes = await fetch(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          id: reference,
          currency: "KES",
          amount,
          description: "Voting Payment",
          callback_url: `${baseUrl}/api/pesapal/callback`,
          billing_address: {
            email_address: email,
            phone_number: phone,
            first_name: firstName,
            last_name: lastName,
          },
        }),
      }
    );

    const orderText = await orderRes.text();
    console.log("ORDER RAW:", orderText);

    const orderData = JSON.parse(orderText);

    return NextResponse.json({
      redirect_url: orderData.redirect_url || null,
      order_tracking_id: orderData.order_tracking_id || null,
    });
  } catch (error) {
    console.error("PAY ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}