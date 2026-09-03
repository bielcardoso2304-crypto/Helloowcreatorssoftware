import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Share2,
  Radar,
  Handshake,
  Wallet,
  TrendingUp,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getIsAdmin } from "@/lib/get-current-creator";
import { getAdminDashboardStats } from "@/lib/get-admin-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

const platformLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  other: "Outra",
};

const monthLabels = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function formatCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-3xl font-semibold tracking-tight">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
        <div className="rounded-full bg-accent p-2.5 text-accent-foreground">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyBarChart({
  data,
  label,
}: {
  data: { month: string; count: number }[];
  label: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div
      role="img"
      aria-label={`${label}: ${data
        .map((d) => `${d.month}: ${d.count}`)
        .join(", ")}`}
      className="flex h-40 items-end justify-between gap-2 sm:gap-4"
    >
      {data.map((d) => {
        const [, monthNum] = d.month.split("-");
        const heightPct = (d.count / max) * 100;
        return (
          <div
            key={d.month}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span className="text-xs font-medium tabular-nums">
              {d.count}
            </span>
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-sm bg-primary transition-[height] duration-300"
                style={{ height: `${Math.max(heightPct, 3)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {monthLabels[Number(monthNum) - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BreakdownBars({
  rows,
  emptyLabel,
}: {
  rows: { label: string; count: number }[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm">{row.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
            {row.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function AdminPage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  const stats = await getAdminDashboardStats();

  if (!stats) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar as métricas agora. Tente atualizar a
          página em alguns instantes.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral dos criadores filiados à Helloow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Users}
          label="Criadores cadastrados"
          value={formatCompact(stats.total_creators)}
          sub={`+${stats.new_last_30_days} nos últimos 30 dias`}
        />
        <StatTile
          icon={UserPlus}
          label="Novos (30 dias)"
          value={formatCompact(stats.new_last_30_days)}
          sub="cadastros recentes"
        />
        <StatTile
          icon={Radar}
          label="Alcance total"
          value={formatCompact(stats.total_reach)}
          sub="seguidores somados (IG + TikTok + YT)"
        />
        <StatTile
          icon={Share2}
          label="Conexões na rede"
          value={formatCompact(stats.total_connections)}
          sub="conexões entre criadores"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novos cadastros por mês</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart
            data={stats.signups_by_month}
            label="Novos cadastros por mês"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plataforma principal</CardTitle>
            <CardDescription>Onde os criadores mais atuam</CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownBars
              rows={stats.by_platform.map((p) => ({
                label: platformLabels[p.platform] ?? p.platform,
                count: p.count,
              }))}
              emptyLabel="Nenhum criador cadastrado ainda."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top nichos</CardTitle>
            <CardDescription>Nichos mais comuns entre os criadores</CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownBars
              rows={stats.top_niches.map((n) => ({
                label: n.niche,
                count: n.count,
              }))}
              emptyLabel="Nenhum nicho informado ainda."
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Marcas cadastradas
        </h2>
        <p className="text-sm text-muted-foreground">
          Marcas que criaram conta própria na Helloow Creators.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Building2}
          label="Marcas cadastradas"
          value={formatCompact(stats.total_brands)}
          sub={`+${stats.new_brands_last_30_days} nos últimos 30 dias`}
        />
        <StatTile
          icon={Sparkles}
          label="Novas (30 dias)"
          value={formatCompact(stats.new_brands_last_30_days)}
          sub="cadastros recentes"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novas marcas por mês</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart
            data={stats.brand_signups_by_month}
            label="Novas marcas por mês"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segmentos das marcas</CardTitle>
          <CardDescription>Segmentos mais comuns entre as marcas</CardDescription>
        </CardHeader>
        <CardContent>
          <BreakdownBars
            rows={stats.top_brand_segments.map((s) => ({
              label: s.segment,
              count: s.count,
            }))}
            emptyLabel="Nenhum segmento informado ainda."
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Negócios com marcas
          </h2>
          <p className="text-sm text-muted-foreground">
            Contratos fechados entre criadores e marcas parceiras.
          </p>
        </div>
        <Button
          size="sm"
          nativeButton={false}
          className="self-start"
          render={<Link href="/admin/negocios">Registrar negócio</Link>}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={Handshake}
          label="Negócios fechados"
          value={formatCompact(stats.total_deals)}
          sub="entre criadores e marcas"
        />
        <StatTile
          icon={Wallet}
          label="Valor total negociado"
          value={currency.format(stats.total_deal_value)}
          sub="soma de todos os negócios"
        />
        <StatTile
          icon={TrendingUp}
          label="Ganho da Helloow"
          value={currency.format(stats.total_company_earning)}
          sub="comissão sobre os negócios"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Negócios fechados por mês</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart
            data={stats.deals_by_month}
            label="Negócios fechados por mês"
          />
        </CardContent>
      </Card>
    </div>
  );
}
