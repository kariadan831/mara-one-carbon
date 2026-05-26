import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("M-Pesa callback:", data);

    return NextResponse.json({
      message: "Callback received successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Callback failed." },
      { status: 500 }
    );
  }
}