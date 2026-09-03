import {
  getCurrentCreator,
  getCreatorsDirectory,
  getConnectedUserIds,
} from "@/lib/get-current-creator";
import {
  getCurrentBrandProfile,
  getBrandProfilesDirectory,
} from "@/lib/get-brand-profile";
import { MemberSearch } from "./member-search";

export default async function HomePage() {
  const [creator, brandProfile, members, brands, connectedIds] =
    await Promise.all([
      getCurrentCreator(),
      getCurrentBrandProfile(),
      getCreatorsDirectory(),
      getBrandProfilesDirectory(),
      getConnectedUserIds(),
    ]);

  const displayName = creator
    ? creator.stage_name || creator.full_name
    : brandProfile?.company_name;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Seja bem-vindo(a), {displayName}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conheça os criadores e as marcas da comunidade Helloow Creators.
        </p>
      </div>

      <MemberSearch
        creators={members}
        brands={brands}
        connectedUserIds={[...connectedIds]}
        selfUserId={creator?.user_id}
      />
    </div>
  );
}
