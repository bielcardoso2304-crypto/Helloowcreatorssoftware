import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCreator } from "@/lib/get-current-creator";
import { CreatorProfileForm } from "../creator-profile-form";
import { createCreatorProfile } from "./actions";

export default async function OnboardingPage() {
  const creator = await getCurrentCreator();
  if (creator) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vamos criar seu perfil de criador
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Essas informações ajudam a Helloow Creators a conhecer melhor
          nossos criadores filiados.
        </p>
      </div>
      <CreatorProfileForm
        action={createCreatorProfile}
        defaultValues={{ email: user?.email ?? "" }}
        submitLabel="Concluir cadastro"
        pendingLabel="Salvando..."
      />
    </div>
  );
}
