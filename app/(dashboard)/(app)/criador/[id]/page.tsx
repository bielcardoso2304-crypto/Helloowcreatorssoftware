import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getCurrentCreator,
  getDirectoryCreatorById,
  getConnectedUserIds,
  getIsAdmin,
  type DirectoryCreator,
} from "@/lib/get-current-creator";
import { getCreatorRevenue } from "@/lib/get-deals";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { connectCreator, disconnectCreator } from "../../connections-actions";
import { DeleteMemberButton } from "../../delete-member-button";
import { instagramUrl, tiktokUrl, youtubeUrl } from "@/lib/social-links";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const platformLabels: Record<DirectoryCreator["main_platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Outra",
};

const followerFormatter = new Intl.NumberFormat("pt-BR", { notation: "compact" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

function SocialRow({
  label,
  handle,
  url,
  followers,
}: {
  label: string;
  handle: string | null;
  url: string | null;
  followers: number | null;
}) {
  if (!handle && !url && followers === null) return null;

  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {handle && <p className="text-sm text-muted-foreground">{handle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {followers !== null && (
          <span className="text-sm text-muted-foreground">
            {followerFormatter.format(followers)} seguidores
          </span>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Abrir
          </a>
        )}
      </div>
    </div>
  );
}

export default async function CreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [member, creator, connectedIds, isAdmin] = await Promise.all([
    getDirectoryCreatorById(id),
    getCurrentCreator(),
    getConnectedUserIds(),
    getIsAdmin(),
  ]);

  if (!member) notFound();

  const isSelf = member.user_id === creator?.user_id;
  const isConnected = connectedIds.has(member.user_id);
  const revenue = isAdmin ? await getCreatorRevenue(member.user_id) : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar src={member.avatar_url} size="size-20" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {member.full_name}
              </h1>
              {member.stage_name && (
                <p className="truncate text-muted-foreground">{member.stage_name}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{platformLabels[member.main_platform]}</Badge>
                {member.city_state && (
                  <span className="text-xs text-muted-foreground">
                    {member.city_state}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isSelf && (
            <form
              action={
                isConnected
                  ? disconnectCreator.bind(null, member.user_id)
                  : connectCreator.bind(null, member.user_id)
              }
              className="mt-4"
            >
              <Button
                type="submit"
                variant={isConnected ? "outline" : "default"}
                className="w-full"
              >
                {isConnected ? "Remover do network" : "Conectar"}
              </Button>
            </form>
          )}

          {member.bio && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {member.bio}
            </p>
          )}

          {member.niche && (
            <div className="mt-4">
              <p className="text-sm font-medium">Nicho</p>
              <p className="text-sm text-muted-foreground">{member.niche}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-1 text-sm font-medium">Redes sociais</p>
            <div className="rounded-lg border px-3">
              <SocialRow
                label="Instagram"
                handle={member.instagram_handle}
                url={instagramUrl(member.instagram_handle)}
                followers={member.instagram_followers}
              />
              <SocialRow
                label="TikTok"
                handle={member.tiktok_handle}
                url={tiktokUrl(member.tiktok_handle)}
                followers={member.tiktok_followers}
              />
              <SocialRow
                label="YouTube"
                handle={member.youtube_handle}
                url={youtubeUrl(member.youtube_handle)}
                followers={member.youtube_followers}
              />
              <SocialRow
                label={member.other_platform_name || "Outra plataforma"}
                handle={null}
                url={member.other_url}
                followers={null}
              />
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Na comunidade desde {dateFormatter.format(new Date(member.created_at))}
          </p>

          {isAdmin && revenue && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-3 text-sm font-medium">Área do admin</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Faturamento gerado
                  </p>
                  <p className="text-lg font-semibold tracking-tight">
                    {currency.format(revenue.totalValue)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Lucro para a Helloow
                  </p>
                  <p className="text-lg font-semibold tracking-tight">
                    {currency.format(revenue.totalEarning)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {revenue.dealCount === 0
                  ? "Nenhum negócio registrado com este criador ainda."
                  : `${revenue.dealCount} ${revenue.dealCount === 1 ? "negócio" : "negócios"} registrados.`}
              </p>
              <div className="mt-4">
                <DeleteMemberButton
                  userId={member.user_id}
                  name={member.stage_name || member.full_name}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
