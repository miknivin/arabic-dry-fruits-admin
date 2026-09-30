import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import Order from "@/models/Order";

export async function POST(req) {
  await dbConnect();

  try {
    // Extract webhook data
    const { sheetName, row, column, newValue, columnCValue } = await req.json();

    // Log the incoming payload
    console.log("Webhook received:", {
      sheetName,
      row,
      column,
      newValue,
      columnCValue,
    });

    // Validate that columnCValue and newValue exist
    if (!columnCValue || !newValue) {
      return NextResponse.json(
        {
          error:
            "columnCValue (order ID) and newValue (order status) are required",
        },
        { status: 400 },
      );
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Extract token after "Bearer "

    // Define the expected token from environment variables
    const expectedToken =
      process.env.GSHEET_UPDATE_TOKEN || process.env.GSHEET_API_TOKEN;

    // Validate the token
    if (!expectedToken || !token || token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 403 },
      );
    }

    // Use columnCValue as the order _id and newValue as the orderStatus
    const id = columnCValue;
    const orderStatus = newValue;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated via webhook",
      order,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
