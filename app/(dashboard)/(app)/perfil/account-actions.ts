"use server";

import { createClient } from "@/lib/supabase/server";
import {
  updateEmailSchema,
  updatePasswordSchema,
} from "@/lib/validations/account";

export type AccountActionState = { error: string | null; success: boolean };

export async function updateEmail(
  _prevState: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const parsed = updateEmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      success: false,
    };
  }

  const supabase = await createClient();
  // Supabase e-mails a confirmation link to the new address — the change
  // only takes effect once that link is clicked, so the old e-mail keeps
  // working for login until then.
  const { error } = await supabase.auth.updateUser(
    { email: parsed.data.email },
    { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/perfil` }
  );
  if (error) {
    return {
      error: "Não foi possível atualizar o e-mail. Tente novamente.",
      success: false,
    };
  }

  return { error: null, success: true };
}

export async function updatePassword(
  _prevState: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      success: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return {
      error: "Não foi possível atualizar a senha. Tente novamente.",
      success: false,
    };
  }

  return { error: null, success: true };
}
