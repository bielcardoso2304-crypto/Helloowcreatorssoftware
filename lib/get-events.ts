import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  event_time: string | null;
  created_by: string;
  created_at: string;
};

/** Events today or later, soonest first — every member (creator or brand)
 * can read these, see events_read_all in 0012_events.sql. */
export async function getUpcomingEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: false });

  return data ?? [];
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}

/** event_id -> number of RSVPs, for the admin-only counts shown on the
 * events list. One query for every event on the page instead of N. */
export async function getAttendeeCountsByEvent(
  eventIds: string[]
): Promise<Map<string, number>> {
  if (eventIds.length === 0) return new Map();

  const supabase = await createClient();
  const { data } = await supabase
    .from("event_attendees")
    .select("event_id")
    .in("event_id", eventIds);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.event_id, (counts.get(row.event_id) ?? 0) + 1);
  }
  return counts;
}

/** event_ids the currently logged-in member has RSVP'd to — used to show
 * "Estarei presente" vs "Não vou mais" on each event card. */
export async function getAttendingEventIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("event_attendees")
    .select("event_id")
    .eq("user_id", user.id);

  return new Set((data ?? []).map((row) => row.event_id));
}

export type EventAttendee = {
  user_id: string;
  name: string;
  type: "creator" | "brand";
};

/** Full attendee list for one event, resolved against `creators` and
 * `brand_profiles` (event_attendees.user_id only references auth.users,
 * so this join happens in JS — same pattern as getDeals()). Admin-only:
 * relies on event_attendees_admin_read_all plus the existing
 * creators_admin_read_all / brand_profiles_admin_read_all policies. */
export async function getEventAttendees(
  eventId: string
): Promise<EventAttendee[]> {
  const supabase = await createClient();
  const { data: attendees } = await supabase
    .from("event_attendees")
    .select("user_id")
    .eq("event_id", eventId);

  if (!attendees || attendees.length === 0) return [];

  const userIds = attendees.map((a) => a.user_id);

  const [{ data: creators }, { data: brands }] = await Promise.all([
    supabase
      .from("creators")
      .select("user_id, full_name, stage_name")
      .in("user_id", userIds),
    supabase
      .from("brand_profiles")
      .select("user_id, company_name")
      .in("user_id", userIds),
  ]);

  const result: EventAttendee[] = [];
  for (const c of creators ?? []) {
    result.push({
      user_id: c.user_id,
      name: c.stage_name || c.full_name,
      type: "creator",
    });
  }
  for (const b of brands ?? []) {
    result.push({ user_id: b.user_id, name: b.company_name, type: "brand" });
  }
  return result;
}
