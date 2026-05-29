import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

// Click payment webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      click_trans_id,
      service_id,
      click_paydoc_id,
      merchant_trans_id,
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string,
    } = body;

    // Validate signature
    const secretKey = process.env.CLICK_SECRET_KEY || "";
    const signData = `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${action}${sign_time}`;
    const expectedSign = crypto.createHash("md5").update(signData).digest("hex");

    if (expectedSign !== sign_string) {
      return NextResponse.json({
        error: -1,
        error_note: "Invalid signature",
      });
    }

    // Action 0 = Prepare (check)
    if (action === 0) {
      return await handlePrepare(merchant_trans_id, amount);
    }

    // Action 1 = Complete (confirm payment)
    if (action === 1) {
      return await handleComplete(merchant_trans_id, click_trans_id, amount);
    }

    return NextResponse.json({
      error: -3,
      error_note: "Action not found",
    });
  } catch (error: any) {
    console.error("Click webhook error:", error);
    return NextResponse.json({
      error: -9,
      error_note: "System error: " + error.message,
    });
  }
}

// Prepare - check if order exists and amount is correct
async function handlePrepare(orderId: string, amount: number) {
  try {
    // Get order from database
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({
        error: -5,
        error_note: "Order not found",
      });
    }

    // Check if already paid
    if (order.payment_status === "paid") {
      return NextResponse.json({
        error: -4,
        error_note: "Already paid",
      });
    }

    // Check amount (Click sends amount in tiyin, we store in so'm)
    const expectedAmount = Math.round(order.final_amount * 100); // convert to tiyin
    if (Number(amount) !== expectedAmount) {
      return NextResponse.json({
        error: -2,
        error_note: "Incorrect amount",
      });
    }

    // Success - ready for payment
    return NextResponse.json({
      click_trans_id: 0, // will be filled by Click
      merchant_trans_id: orderId,
      merchant_prepare_id: order.id,
      error: 0,
      error_note: "Success",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: -9,
      error_note: "System error: " + error.message,
    });
  }
}

// Complete - confirm payment and update order
async function handleComplete(orderId: string, clickTransId: string, amount: number) {
  try {
    // Get order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({
        error: -5,
        error_note: "Order not found",
      });
    }

    // Update order payment status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({
        error: -9,
        error_note: "Failed to update order",
      });
    }

    // Add to status history
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      status: "processing",
      notes: `To'lov muvaffaqiyatli amalga oshirildi. Click Trans ID: ${clickTransId}`,
    });

    // TODO: Send confirmation email

    return NextResponse.json({
      click_trans_id: clickTransId,
      merchant_trans_id: orderId,
      merchant_confirm_id: order.id,
      error: 0,
      error_note: "Success",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: -9,
      error_note: "System error: " + error.message,
    });
  }
}
