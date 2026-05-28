export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const orderTrackingId = searchParams.get("OrderTrackingId");
    const merchantReference = searchParams.get("OrderMerchantReference");

    console.log("📩 Pesapal GET Callback:", {
      orderTrackingId,
      merchantReference,
    });

    // IMPORTANT: return simple success page response
    return Response.json({
      success: true,
      message: "Callback received",
      orderTrackingId,
      merchantReference,
    });

  } catch (error) {
    console.error("GET Callback Error:", error);

    return Response.json({
      success: false,
      error: "Callback failed",
    }, { status: 500 });
  }
}


// ===============================
// POST CALLBACK (IMPORTANT)
// ===============================
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    console.log("📩 Pesapal POST Callback:", body);

    // IMPORTANT: Pesapal may send payment status here
    const {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
      PaymentMethod,
      Amount,
      Status,
    } = body;

    return Response.json({
      success: true,
      message: "POST callback received",
      data: {
        OrderTrackingId,
        OrderMerchantReference,
        OrderNotificationType,
        PaymentMethod,
        Amount,
        Status,
      },
    });

  } catch (error) {
    console.error("POST Callback Error:", error);

    return Response.json({
      success: false,
      error: "POST callback failed",
    }, { status: 500 });
  }
}