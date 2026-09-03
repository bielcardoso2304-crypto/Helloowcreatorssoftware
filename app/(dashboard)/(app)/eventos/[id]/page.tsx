import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Users, UserRound, Building2 } from "lucide-react";
import { getIsAdmin } from "@/lib/get-current-creator";
import { getEventById, getEventAttendees } from "@/lib/get-events";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  const { id } = await params;
  const [event, attendees] = await Promise.all([
    getEventById(id),
    getEventAttendees(id),
  ]);
  if (!event) notFound();

  const creatorCount = attendees.filter((a) => a.type === "creator").length;
  const brandCount = attendees.filter((a) => a.type === "brand").length;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        href="/eventos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {dateFormatter.format(new Date(event.event_date + "T00:00:00"))}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 py-5">
            <Users className="size-5 text-muted-foreground" />
            <span className="text-2xl font-semibold tracking-tight">
              {attendees.length}
            </span>
            <span className="text-xs text-muted-foreground">Total</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 py-5">
            <UserRound className="size-5 text-muted-foreground" />
            <span className="text-2xl font-semibold tracking-tight">
              {creatorCount}
            </span>
            <span className="text-xs text-muted-foreground">Criadores</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 py-5">
            <Building2 className="size-5 text-muted-foreground" />
            <span className="text-2xl font-semibold tracking-tight">
              {brandCount}
            </span>
            <span className="text-xs text-muted-foreground">Marcas</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 rounded-xl border">
        {attendees.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Ninguém confirmou presença ainda.
          </p>
        ) : (
          <ul>
            {attendees.map((attendee) => (
              <li
                key={attendee.user_id}
                className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
              >
                <Avatar src={null} size="size-8" />
                <span className="flex-1 truncate text-sm font-medium">
                  {attendee.name}
                </span>
                <Badge variant="secondary">
                  {attendee.type === "creator" ? "Criador" : "Marca"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
