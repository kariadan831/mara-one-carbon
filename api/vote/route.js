export async function GET() {
  return Response.json({
    success: true,
    message: "GET is working",
  });
}

export async function POST(req) {
  const body = await req.json();

  return Response.json({
    success: true,
    message: "POST is working",
    data: body,
  });
}