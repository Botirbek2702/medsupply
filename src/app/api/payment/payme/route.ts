import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Payme webhook handler (JSON-RPC 2.0)
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Basic ${Buffer.from(`Paycom:${process.env.PAYME_KEY}`).toString("base64")}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({
        error: {
          code: -32504,
          message: "Insufficient privilege",
        },
      });
    }

    const body = await request.json();
    const { method, params } = body;

    // Route to appropriate handler
    switch (method) {
      case "CheckPerformTransaction":
        return await checkPerformTransaction(params);
      case "CreateTransaction":
        return await createTransaction(params);
      case "PerformTransaction":
        return await performTransaction(params);
      case "CancelTransaction":
        return await cancelTransaction(params);
      case "CheckTransaction":
        return await checkTransaction(params);
      default:
        return NextResponse.json({
          error: {
            code: -32601,
            message: "Method not found",
          },
        });
    }
  } catch (error: any) {
    console.error("Payme webhook error:", error);
    return NextResponse.json({
      error: {
        code: -32400,
        message: "System error: " + error.message,
      },
    });
  }
}

// Check if transaction can be performed
async function checkPerformTransaction(params: any) {
  const { account } = params;
  const orderId = account.order_id;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({
      error: {
        code: -31050,
        message: "Order not found",
      },
    });
  }

  if (order.payment_status === "paid") {
    return NextResponse.json({
      error: {
        code: -31051,
        message: "Already paid",
      },
    });
  }

  // Check amount (Payme sends amount in tiyin)
  const expectedAmount = Math.round(order.final_amount * 100);
  if (Number(params.amount) !== expectedAmount) {
    return NextResponse.json({
      error: {
        code: -31001,
        message: "Incorrect amount",
      },
    });
  }

  return NextResponse.json({
    result: {
      allow: true,
    },
  });
}

// Create transaction
async function createTransaction(params: any) {
  const { id, time, amount, account } = params;
  const orderId = account.order_id;

  // Check if transaction already exists
  const { data: existing } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("transaction_id", id)
    .single();

  if (existing) {
    return NextResponse.json({
      result: {
        create_time: existing.create_time,
        transaction: existing.id.toString(),
        state: existing.state,
      },
    });
  }

  // Create new transaction
  const { data: transaction, error } = await supabase
    .from("payment_transactions")
    .insert({
      transaction_id: id,
      order_id: orderId,
      amount: amount,
      state: 1, // Created
      create_time: time,
      provider: "payme",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({
      error: {
        code: -31008,
        message: "Failed to create transaction",
      },
    });
  }

  return NextResponse.json({
    result: {
      create_time: time,
      transaction: transaction.id.toString(),
      state: 1,
    },
  });
}

// Perform transaction (confirm payment)
async function performTransaction(params: any) {
  const { id } = params;

  const { data: transaction, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("transaction_id", id)
    .single();

  if (error || !transaction) {
    return NextResponse.json({
      error: {
        code: -31003,
        message: "Transaction not found",
      },
    });
  }

  // Update transaction state
  await supabase
    .from("payment_transactions")
    .update({
      state: 2, // Performed
      perform_time: Date.now(),
    })
    .eq("transaction_id", id);

  // Update order
  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
    })
    .eq("id", transaction.order_id);

  // Add to history
  await supabase.from("order_status_history").insert({
    order_id: transaction.order_id,
    status: "processing",
    notes: `To'lov muvaffaqiyatli. Payme Trans ID: ${id}`,
  });

  return NextResponse.json({
    result: {
      transaction: transaction.id.toString(),
      perform_time: Date.now(),
      state: 2,
    },
  });
}

// Cancel transaction
async function cancelTransaction(params: any) {
  const { id, reason } = params;

  const { data: transaction } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("transaction_id", id)
    .single();

  if (!transaction) {
    return NextResponse.json({
      error: {
        code: -31003,
        message: "Transaction not found",
      },
    });
  }

  // Update transaction state
  const newState = transaction.state === 2 ? -2 : -1;
  await supabase
    .from("payment_transactions")
    .update({
      state: newState,
      cancel_time: Date.now(),
      reason: reason,
    })
    .eq("transaction_id", id);

  return NextResponse.json({
    result: {
      transaction: transaction.id.toString(),
      cancel_time: Date.now(),
      state: newState,
    },
  });
}

// Check transaction status
async function checkTransaction(params: any) {
  const { id } = params;

  const { data: transaction, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("transaction_id", id)
    .single();

  if (error || !transaction) {
    return NextResponse.json({
      error: {
        code: -31003,
        message: "Transaction not found",
      },
    });
  }

  return NextResponse.json({
    result: {
      create_time: transaction.create_time,
      perform_time: transaction.perform_time || 0,
      cancel_time: transaction.cancel_time || 0,
      transaction: transaction.id.toString(),
      state: transaction.state,
      reason: transaction.reason || null,
    },
  });
}
