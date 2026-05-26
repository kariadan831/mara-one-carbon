export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");

  console.log("Pesapal Callback:", {
    orderTrackingId,
    orderMerchantReference,
  });

  return Response.json({
    success: true,
    orderTrackingId,
    orderMerchantReference,
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  console.log("Pesapal POST Callback:", body);

  return Response.json({
    success: true,
    received: body,
  });
}