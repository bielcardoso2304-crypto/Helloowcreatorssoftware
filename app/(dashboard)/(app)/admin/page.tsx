import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin, type Creator } from "@/lib/get-current-creator";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const platformLabels: Record<Creator["main_platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Outra",
};

export default async function AdminPage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  const supabase = await createClient();
  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (creators ?? []) as Creator[];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Criadores filiados
        </h1>
        <Badge variant="highlight" className="h-auto px-2.5 py-1 text-sm">
          {list.length}{" "}
          {list.length === 1 ? "criador cadastrado" : "criadores cadastrados"}
        </Badge>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Redes sociais</TableHead>
              <TableHead>Cadastrado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="whitespace-normal py-8 text-center text-muted-foreground"
                >
                  Nenhum criador cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
            {list.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar src={creator.avatar_url} size="size-8" />
                    <div className="flex flex-col">
                      <span>{creator.full_name}</span>
                      {creator.stage_name && (
                        <span className="text-xs text-muted-foreground">
                          {creator.stage_name}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{creator.email}</span>
                    <span className="text-muted-foreground">{creator.whatsapp}</span>
                  </div>
                </TableCell>
                <TableCell>{creator.city_state}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {platformLabels[creator.main_platform]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    {creator.instagram_handle && (
                      <span>IG: {creator.instagram_handle}</span>
                    )}
                    {creator.tiktok_handle && (
                      <span>TikTok: {creator.tiktok_handle}</span>
                    )}
                    {creator.youtube_handle && (
                      <span>YouTube: {creator.youtube_handle}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(creator.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
