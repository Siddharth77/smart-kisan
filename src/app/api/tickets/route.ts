import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tickets = await db.rSKTicket.findMany({
    include: {
      diagnosis: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tickets);
}

export async function PATCH(request: Request) {
  try {
    const { id, status, expertNote } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const ticket = await db.rSKTicket.update({
      where: { id },
      data: {
        status: status ?? "resolved",
        expertNote,
        resolvedAt: status === "resolved" ? new Date() : undefined,
      },
      include: { diagnosis: true },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
