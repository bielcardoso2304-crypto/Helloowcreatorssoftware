"use client";

import { useActionState, useRef, useEffect } from "react";
import { createEvent, type EventActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: EventActionState = { error: null };

export function NewEventForm() {
  const [state, formAction, pending] = useActionState(
    createEvent,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar evento</CardTitle>
        <CardDescription>
          Visível para todos os criadores e marcas na aba Eventos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Data</Label>
            <Input id="event_date" name="event_date" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_time">Horário (opcional)</Label>
            <Input id="event_time" name="event_time" type="time" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="location">Local (opcional)</Label>
            <Input
              id="location"
              name="location"
              placeholder="Endereço, ou link se for online"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea id="description" name="description" />
          </div>

          {state.error && (
            <p className="text-sm text-destructive sm:col-span-2">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="sm:col-span-2">
            {pending ? "Criando..." : "Criar evento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
