import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const tickets = await store.listTickets();
  return NextResponse.json(tickets);
}

export async function PATCH(request: Request) {
  try {
    const { id, status, expertNote } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const ticket = await store.updateTicket(id, {
      status: status ?? "resolved",
      expertNote,
      resolvedAt: status === "resolved" ? new Date() : undefined,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
