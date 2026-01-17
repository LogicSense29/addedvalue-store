import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderIds, items, currency } = await req.json();

    if (!orderIds || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: item.images, // Array of URLs
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        orderIds: JSON.stringify(orderIds),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_ERROR", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
