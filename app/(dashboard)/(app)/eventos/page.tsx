import Link from "next/link";
import { Calendar, MapPin, Trash2, Users } from "lucide-react";
import { getIsAdmin } from "@/lib/get-current-creator";
import {
  getUpcomingEvents,
  getAttendingEventIds,
  getAttendeeCountsByEvent,
  type Event,
} from "@/lib/get-events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewEventForm } from "./new-event-form";
import { deleteEvent } from "./actions";
import { attendEvent, unattendEvent } from "./rsvp-actions";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatEventDate(event: Event) {
  // Appending T00:00:00 avoids the UTC-midnight-to-local-date-before shift
  // that new Date("2026-09-20") is prone to.
  const date = dateFormatter.format(new Date(event.event_date + "T00:00:00"));
  if (!event.event_time) return date;
  return `${date} às ${event.event_time.slice(0, 5)}`;
}

function DeleteEventButton({ id }: { id: string }) {
  return (
    <form action={deleteEvent.bind(null, id)}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

function AttendButton({
  eventId,
  isAttending,
}: {
  eventId: string;
  isAttending: boolean;
}) {
  return (
    <form action={(isAttending ? unattendEvent : attendEvent).bind(null, eventId)}>
      <Button
        type="submit"
        variant={isAttending ? "outline" : "default"}
        size="sm"
      >
        {isAttending ? "Não vou mais" : "Estarei presente"}
      </Button>
    </form>
  );
}

function ParticipantsLink({ eventId, count }: { eventId: string; count: number }) {
  return (
    <Link
      href={`/eventos/${eventId}`}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
    >
      <Users className="size-3.5" />
      {count} {count === 1 ? "confirmado" : "confirmados"}
    </Link>
  );
}

export default async function EventosPage() {
  const [isAdmin, events, attendingIds] = await Promise.all([
    getIsAdmin(),
    getUpcomingEvents(),
    getAttendingEventIds(),
  ]);

  const attendeeCounts = isAdmin
    ? await getAttendeeCountsByEvent(events.map((e) => e.id))
    : new Map<string, number>();

  const [nextEvent, ...otherEvents] = events;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Eventos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calendário de eventos e encontros da comunidade.
        </p>
      </div>

      {isAdmin && <NewEventForm />}

      {!nextEvent ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Calendar className="size-10 text-muted-foreground" />
            <p className="font-medium">Nenhum evento marcado</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Assim que um evento for criado, ele aparece aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <Badge variant="highlight">Próximo evento</Badge>
                {isAdmin && <DeleteEventButton id={nextEvent.id} />}
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                {nextEvent.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatEventDate(nextEvent)}
              </p>
              {nextEvent.location && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {nextEvent.location}
                </p>
              )}
              {nextEvent.description && (
                <p className="mt-4 text-sm leading-relaxed">
                  {nextEvent.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <AttendButton
                  eventId={nextEvent.id}
                  isAttending={attendingIds.has(nextEvent.id)}
                />
                {isAdmin && (
                  <ParticipantsLink
                    eventId={nextEvent.id}
                    count={attendeeCounts.get(nextEvent.id) ?? 0}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {otherEvents.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Outros eventos futuros
              </h3>
              <div className="flex flex-col gap-3">
                {otherEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="flex flex-col gap-3 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(event)}
                          </p>
                          {event.location && (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {event.location}
                            </p>
                          )}
                        </div>
                        {isAdmin && <DeleteEventButton id={event.id} />}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <AttendButton
                          eventId={event.id}
                          isAttending={attendingIds.has(event.id)}
                        />
                        {isAdmin && (
                          <ParticipantsLink
                            eventId={event.id}
                            count={attendeeCounts.get(event.id) ?? 0}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
