import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCreator } from "@/lib/get-current-creator";
import { getCurrentBrandProfile } from "@/lib/get-brand-profile";
import { CreatorProfileForm } from "../../creator-profile-form";
import { BrandProfileForm } from "../../brand-profile-form";
import { updateCreatorProfile } from "./actions";
import { updateBrandProfile } from "./brand-actions";
import { DeleteAccountButton } from "./delete-account-button";
import { AccountSettingsForm } from "./account-settings-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const [creator, brandProfile, { data: { user } }] = await Promise.all([
    getCurrentCreator(),
    getCurrentBrandProfile(),
    supabase.auth.getUser(),
  ]);
  if (!creator && !brandProfile) redirect("/onboarding");

  return (
    <div className="mx-auto flex max-w-lg flex-col p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {brandProfile ? "Perfil da marca" : "Meu perfil"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantenha seus dados atualizados.
        </p>
      </div>
      {brandProfile ? (
        <BrandProfileForm
          action={updateBrandProfile}
          defaultValues={brandProfile}
          submitLabel="Salvar alterações"
          pendingLabel="Salvando..."
        />
      ) : (
        <CreatorProfileForm
          action={updateCreatorProfile}
          defaultValues={creator!}
          submitLabel="Salvar alterações"
          pendingLabel="Salvando..."
        />
      )}

      <div className="mt-8">
        <AccountSettingsForm currentEmail={user?.email ?? ""} />
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="mb-3 text-sm text-muted-foreground">
          Quer sair da Helloow Creators? Você pode apagar sua conta e seus
          dados a qualquer momento.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
