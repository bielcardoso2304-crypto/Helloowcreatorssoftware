import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/avatar";
import type { DirectoryCreator } from "@/lib/get-current-creator";
import { connectCreator, disconnectCreator } from "./connections-actions";

const platformLabels: Record<DirectoryCreator["main_platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Outra",
};

const followerFormatter = new Intl.NumberFormat("pt-BR", { notation: "compact" });

function topFollowerCount(m: DirectoryCreator) {
  const counts = [
    m.instagram_followers,
    m.tiktok_followers,
    m.youtube_followers,
  ].filter((n): n is number => typeof n === "number");
  if (counts.length === 0) return null;
  return Math.max(...counts);
}

export function MemberCard({
  member,
  isConnected,
  isSelf,
}: {
  member: DirectoryCreator;
  isConnected: boolean;
  isSelf: boolean;
}) {
  const followers = topFollowerCount(member);

  return (
    <Card className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="pt-6">
        {/* Everything except the connect/disconnect form lives inside this
            link, so clicking the card opens the full profile — the form
            stays a sibling to avoid nesting a <form> inside an <a>. */}
        <Link href={`/criador/${member.id}`} className="block">
          <div className="flex items-center gap-3">
            <Avatar src={member.avatar_url} size="size-12" />
            <div className="min-w-0">
              <p className="truncate font-medium leading-tight">
                {member.full_name}
              </p>
              {member.stage_name && (
                <p className="truncate text-xs text-muted-foreground">
                  {member.stage_name}
                </p>
              )}
            </div>
          </div>

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {member.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{platformLabels[member.main_platform]}</Badge>
            {followers !== null && (
              <span className="text-xs text-muted-foreground">
                {followerFormatter.format(followers)} seguidores
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {[member.city_state, member.niche].filter(Boolean).join(" · ")}
          </div>
        </Link>

        {!isSelf && (
          <form
            action={
              isConnected
                ? disconnectCreator.bind(null, member.user_id)
                : connectCreator.bind(null, member.user_id)
            }
            className="mt-3"
          >
            <Button
              type="submit"
              variant={isConnected ? "outline" : "default"}
              size="sm"
              className="w-full"
            >
              {isConnected ? "Remover do network" : "Conectar"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
