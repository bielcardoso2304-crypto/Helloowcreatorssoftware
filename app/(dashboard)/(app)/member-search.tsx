"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MemberCard } from "./member-card";
import { BrandCard } from "./brand-card";
import type { DirectoryCreator } from "@/lib/get-current-creator";
import type { DirectoryBrandProfile } from "@/lib/get-brand-profile";

function matches(query: string, values: (string | null | undefined)[]) {
  return values.some((v) => v?.toLowerCase().includes(query));
}

export function MemberSearch({
  creators,
  brands,
  connectedUserIds,
  selfUserId,
}: {
  creators: DirectoryCreator[];
  brands: DirectoryBrandProfile[];
  connectedUserIds: string[];
  selfUserId?: string;
}) {
  const [query, setQuery] = useState("");
  const connectedIds = useMemo(() => new Set(connectedUserIds), [connectedUserIds]);

  const q = query.trim().toLowerCase();
  const filteredCreators = q
    ? creators.filter((c) => matches(q, [c.full_name, c.stage_name, c.niche]))
    : creators;
  const filteredBrands = q
    ? brands.filter((b) => matches(q, [b.company_name, b.segment]))
    : brands;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar criadores ou marcas..."
          className="pl-9"
        />
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Criadores</h2>
          <Badge variant="highlight" className="h-auto px-2.5 py-1 text-sm">
            {filteredCreators.length}{" "}
            {filteredCreators.length === 1 ? "criador" : "criadores"}
          </Badge>
        </div>
        {filteredCreators.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {q ? "Nenhum criador encontrado." : "Nenhum criador cadastrado ainda."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCreators.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                isConnected={connectedIds.has(m.user_id)}
                isSelf={m.user_id === selfUserId}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Marcas</h2>
          <Badge variant="highlight" className="h-auto px-2.5 py-1 text-sm">
            {filteredBrands.length}{" "}
            {filteredBrands.length === 1 ? "marca" : "marcas"}
          </Badge>
        </div>
        {filteredBrands.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {q ? "Nenhuma marca encontrada." : "Nenhuma marca cadastrada ainda."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBrands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
