import {
  getCurrentCreator,
  getCreatorsDirectory,
  getConnectedUserIds,
} from "@/lib/get-current-creator";
import { Badge } from "@/components/ui/badge";
import { MemberCard } from "./member-card";

export default async function HomePage() {
  const [creator, members, connectedIds] = await Promise.all([
    getCurrentCreator(),
    getCreatorsDirectory(),
    getConnectedUserIds(),
  ]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Seja bem-vindo(a), {creator?.stage_name || creator?.full_name}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conheça os outros criadores da comunidade Helloow Creators.
          </p>
        </div>
        <Badge variant="highlight" className="h-auto px-2.5 py-1 text-sm">
          {members.length} {members.length === 1 ? "criador" : "criadores"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            isConnected={connectedIds.has(m.user_id)}
            isSelf={m.user_id === creator?.user_id}
          />
        ))}
      </div>
    </div>
  );
}
