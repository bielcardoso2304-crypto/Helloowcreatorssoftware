import { redirect } from "next/navigation";
import { getCurrentCreator } from "@/lib/get-current-creator";
import { CreatorProfileForm } from "../../creator-profile-form";
import { updateCreatorProfile } from "./actions";

export default async function ProfilePage() {
  const creator = await getCurrentCreator();
  if (!creator) redirect("/onboarding");

  return (
    <div className="mx-auto flex max-w-lg flex-col p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantenha seus dados atualizados.
        </p>
      </div>
      <CreatorProfileForm
        action={updateCreatorProfile}
        defaultValues={creator}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando..."
      />
    </div>
  );
}
