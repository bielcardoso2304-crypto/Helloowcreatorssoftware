import {
  getCurrentCreator,
  getCreatorsDirectory,
  getConnectedUserIds,
} from "@/lib/get-current-creator";
import { Badge } from "@/components/ui/badge";
import { MemberCard } from "../member-card";

export default async function NetworkPage() {
  const [creator, members, connectedIds] = await Promise.all([
    getCurrentCreator(),
    getCreatorsDirectory(),
    getConnectedUserIds(),
  ]);

  const network = members.filter((m) => connectedIds.has(m.user_id));

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Network</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Os criadores que você conectou.
          </p>
        </div>
        <Badge variant="highlight" className="h-auto px-2.5 py-1 text-sm">
          {network.length} {network.length === 1 ? "conexão" : "conexões"}
        </Badge>
      </div>

      {network.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Você ainda não conectou com ninguém. Vá até a{" "}
          <span className="font-medium text-foreground">Início</span> e clique
          em &quot;Conectar&quot; nos perfis que quiser acompanhar aqui.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {network.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isConnected
              isSelf={m.user_id === creator?.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
