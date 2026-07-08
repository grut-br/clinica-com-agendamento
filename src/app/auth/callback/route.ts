import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host"); // Suporte a Proxies/Vercel
        const isLocalEnv = process.env.NODE_ENV === "development";
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        console.error("[OAUTH_CALLBACK_EXCHANGE_ERROR]:", error.message);
      }
    } catch (err) {
      console.error("[OAUTH_CALLBACK_CRITICAL_ERROR]:", err);
    }
  }

  // Retorna à página de login com um sinalizador de erro se o fluxo falhar
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
