"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, forgotPasswordSchema } from "@/lib/validations/auth";

export type AuthActionState = { error: string | null };

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect("/");
}

export type SignupActionState = { error: string | null; success: boolean };

export async function signup(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      success: false,
    };
  }

  // Server-side check — the checkbox's `required` attribute stops most
  // people, but never trust the client alone for something LGPD-relevant.
  if (formData.get("accepted_terms") !== "on") {
    return {
      error: "É preciso aceitar os Termos de Uso e a Política de Privacidade.",
      success: false,
    };
  }

  const accountType = formData.get("account_type") === "brand" ? "brand" : "creator";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      // Without this, Supabase falls back to the project's dashboard
      // "Site URL" setting for the confirmation email link — which is
      // easy to leave pointed at a different local project.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      // Persisted on the auth user itself (not a profile row, which
      // doesn't exist until onboarding) so onboarding still knows which
      // form to show after the user comes back from the confirmation
      // e-mail in a fresh session. terms_accepted_at is the LGPD consent
      // record — proof of when this account agreed to the current terms.
      data: {
        account_type: accountType,
        terms_accepted_at: new Date().toISOString(),
      },
    },
  });
  if (error) {
    return {
      error: error.message.includes("already registered")
        ? "Esse e-mail já está cadastrado."
        : "Não foi possível criar a conta. Tente novamente.",
      success: false,
    };
  }

  // If email confirmation is required, signUp succeeds but no session is
  // created yet — sending the user to the dashboard would just bounce
  // them back to /login via the auth guard.
  if (!data.session) {
    return { error: null, success: true };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type ForgotPasswordActionState = { error: string | null; success: boolean };

export async function requestPasswordReset(
  _prevState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      success: false,
    };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/redefinir-senha`,
  });

  // Always report success, even if the e-mail isn't registered — avoids
  // leaking which addresses have an account.
  return { error: null, success: true };
}
