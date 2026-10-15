import { redirect } from "next/navigation";

/** Checkout is Stripe-hosted; the cart page starts it. */
export default function CheckoutPage() {
  redirect("/cart");
}
