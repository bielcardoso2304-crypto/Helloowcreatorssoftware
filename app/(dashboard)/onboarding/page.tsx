import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCreator } from "@/lib/get-current-creator";
import { getCurrentBrandProfile } from "@/lib/get-brand-profile";
import { CreatorProfileForm } from "../creator-profile-form";
import { BrandProfileForm } from "../brand-profile-form";
import { createCreatorProfile, createBrandProfile } from "./actions";

export default async function OnboardingPage() {
  const [creator, brandProfile] = await Promise.all([
    getCurrentCreator(),
    getCurrentBrandProfile(),
  ]);
  if (creator || brandProfile) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Chosen on the login/signup screen ("Sou criador" vs "Sou marca") and
  // persisted on the auth user (see signup() in (auth)/actions.ts) since
  // no profile row exists yet to store it on.
  const isBrand = user?.user_metadata?.account_type === "brand";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isBrand
            ? "Vamos criar o perfil da sua marca"
            : "Vamos criar seu perfil de criador"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isBrand
            ? "Essas informações ajudam os criadores a conhecer melhor sua marca."
            : "Essas informações ajudam a Helloow Creators a conhecer melhor nossos criadores filiados."}
        </p>
      </div>
      {isBrand ? (
        <BrandProfileForm
          action={createBrandProfile}
          defaultValues={{ email: user?.email ?? "" }}
          submitLabel="Concluir cadastro"
          pendingLabel="Salvando..."
        />
      ) : (
        <CreatorProfileForm
          action={createCreatorProfile}
          defaultValues={{ email: user?.email ?? "" }}
          submitLabel="Concluir cadastro"
          pendingLabel="Salvando..."
        />
      )}
    </div>
  );
}
