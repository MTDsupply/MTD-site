import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** Magic-link landing: verifies the token and redirects to the account page. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/account";
  const safeNext = next.startsWith("/") ? next : "/account";

  if (token_hash && type) {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) return NextResponse.redirect(new URL(safeNext, request.url));
    }
  }
  return NextResponse.redirect(new URL("/account?error=link", request.url));
}
