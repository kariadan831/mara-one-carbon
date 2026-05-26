import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, vote, message } = body;

    if (!name || !phone || !vote || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Payment request sent. Enter your M-Pesa PIN on the phone.",
      data: {
        name,
        phone,
        vote,
        message,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to start payment request." },
      { status: 500 }
    );
  }
}